const pool = require('../../config/db.js');

// Fetch all team members who are not admins
exports.getUsers = async function () {
    const query = `
        SELECT "Account_id" AS id, "username" AS name
        FROM "public"."Account"
        WHERE "is_admin" = FALSE
    `;
    return pool.query(query);
};

// Fetch project details by project_id, including its members
exports.getProject = async function (project_id) {
    const query = `
        SELECT 
            p."Project_id" AS id,
            p."project_title" AS title,
            p."project_description" AS description,
            p."end_time" AS deadline,
            p."Account_id" AS leader,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', a."Account_id",
                    'name', a."username"
                )
            ) AS members
        FROM "public"."Project" p
        LEFT JOIN "public"."ProjectTeamMember" ptm
        ON p."Project_id" = ptm."Project_id"
        LEFT JOIN "public"."Account" a
        ON ptm."Account_id" = a."Account_id"
        WHERE p."Project_id" = $1
        GROUP BY p."Project_id"
    `;
    return pool.query(query, [project_id]);
};

// Create a new project
exports.createProject = async function ({ title, description, deadline, members, projectLeader }) {
    const client = await pool.connect();
    console.log("createProject", title, description, deadline, members, projectLeader);
    try {
        await client.query('BEGIN');

        // Insert into Project table
        const projectQuery = `
            INSERT INTO "public"."Project" 
            ("project_title", "project_description", "start_time", "end_time", "Account_id", "Priority_id", "Status_id")
            VALUES ($1, $2, CURRENT_DATE, $3, $4, 1, 1) -- Default Priority and Status
            RETURNING "Project_id"
        `;
        const projectResult = await client.query(projectQuery, [title, description, deadline, projectLeader]);
        const project_id = projectResult.rows[0].Project_id;

        // Insert members into ProjectTeamMember table
        const memberQuery = `
            INSERT INTO "public"."ProjectTeamMember" ("Project_id", "Account_id")
            VALUES ($1, UNNEST($2::BIGINT[]))
        `;
        await client.query(memberQuery, [project_id, members]);

        await client.query('COMMIT');
        return { project_id };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

// Update an existing project
exports.updateProject = async function ({ project_id, title, description, deadline, members, projectLeader }) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Fetch current members of the project
        const currentMembersQuery = `
            SELECT "Account_id"
            FROM "public"."ProjectTeamMember"
            WHERE "Project_id" = $1
        `;
        const currentMembersResult = await client.query(currentMembersQuery, [project_id]);
        const currentMembers = currentMembersResult.rows.map(row => row.Account_id);

        // Determine members to be removed
        const membersToRemove = currentMembers.filter(member => !members.includes(member));

        // Delete removed members from AssignmentMember table
        if (membersToRemove.length > 0) {
            const deleteAssignmentMembersQuery = `
                DELETE FROM "public"."AssignmentMember"
                WHERE "Project_Team_Member_id" IN (
                    SELECT "Project_Team_Member_id"
                    FROM "public"."ProjectTeamMember"
                    WHERE "Account_id" = ANY($1::BIGINT[])
                    AND "Project_id" = $2
                )
            `;
            await client.query(deleteAssignmentMembersQuery, [membersToRemove, project_id]);
        }

        // Update Project table
        const projectQuery = `
            UPDATE "public"."Project"
            SET 
                "project_title" = $1,
                "project_description" = $2,
                "end_time" = $3,
                "Account_id" = $4
            WHERE "Project_id" = $5
        `;
        await client.query(projectQuery, [title, description, deadline, projectLeader, project_id]);

        // Delete existing members from ProjectTeamMember table
        const deleteMembersQuery = `
            DELETE FROM "public"."ProjectTeamMember"
            WHERE "Project_id" = $1
        `;
        await client.query(deleteMembersQuery, [project_id]);

        // Insert updated members into ProjectTeamMember table
        const insertMembersQuery = `
            INSERT INTO "public"."ProjectTeamMember" ("Project_id", "Account_id")
            VALUES ($1, UNNEST($2::BIGINT[]))
        `;
        await client.query(insertMembersQuery, [project_id, members]);

        await client.query('COMMIT');
        return { project_id };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};