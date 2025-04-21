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

// Fetch project details by project_id
exports.getProject = async function (project_id) {
    const query = `
        SELECT 
            "Project_id" AS id,
            "project_title" AS title,
            "project_description" AS description,
            "start_time" AS start_time,
            "end_time" AS deadline,
            "Account_id" AS leader
        FROM "public"."Project"
        WHERE "Project_id" = $1
    `;
    return pool.query(query, [project_id]);
};

// Create a new project
exports.createProject = async function ({ title, description, deadline, members, leader }) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Insert into Project table
        const projectQuery = `
            INSERT INTO "public"."Project" 
            ("project_title", "project_description", "start_time", "end_time", "Account_id", "Priority_id", "Status_id")
            VALUES ($1, $2, CURRENT_DATE, $3, $4, 1, 1) -- Default Priority and Status
            RETURNING "Project_id"
        `;
        const projectResult = await client.query(projectQuery, [title, description, deadline, leader]);
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
exports.updateProject = async function ({ project_id, title, description, deadline, members, leader }) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

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
        await client.query(projectQuery, [title, description, deadline, leader, project_id]);

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