const pool = require('../../config/db.js');

// Fetch all assignments for a project
async function getAllAssignments(projectId) {
    const query = `
        SELECT DISTINCT
            a."Assignment_id",
            a."Parent_Assignment_id",
            at."type" AS assignment_type,
            a."assignment_title",
            a."assignment_description",
            a."start_time",
            a."end_time",
            a."finished_time",
            p."priority" AS priority_name,
            s."status" AS status_name
        FROM "public"."Assignment" a
        JOIN "public"."Priority" p ON a."Priority_id" = p."Priority_id"
        JOIN "public"."Status" s ON a."Status_id" = s."Status_id"
        JOIN "public"."AssignmentType" at ON a."Type_id" = at."Type_id"
        WHERE a."Project_id" = $1
    `;
    const result = await pool.query(query, [projectId]);
    return result.rows;
}

// Fetch taken assignments for a project
async function getTakenAssignments(projectId, accountId) {
    const query = `
        SELECT DISTINCT
            a."Assignment_id",
            a."Parent_Assignment_id",
            at."type" AS assignment_type,
            a."assignment_title",
            a."assignment_description",
            a."start_time",
            a."end_time",
            a."finished_time",
            p."priority" AS priority_name,
            s."status" AS status_name
        FROM "public"."Assignment" a
        JOIN "public"."Priority" p ON a."Priority_id" = p."Priority_id"
        JOIN "public"."Status" s ON a."Status_id" = s."Status_id"
        JOIN "public"."AssignmentType" at ON a."Type_id" = at."Type_id"
        JOIN "public"."AssignmentMember" am ON a."Assignment_id" = am."Assignment_id"
        JOIN "public"."ProjectTeamMember" ptm ON am."Project_Team_Member_id" = ptm."Project_Team_Member_id"
        WHERE a."Project_id" = $1 AND ptm."Account_id" = $2
    `;
    const result = await pool.query(query, [projectId, accountId]);
    return result.rows;
}

// Fetch not taken assignments for a project
async function getNotTakenAssignments(projectId, accountId) {
    const query = `
        SELECT DISTINCT
            a."Assignment_id",
            a."Parent_Assignment_id",
            at."type" AS assignment_type,
            a."assignment_title",
            a."assignment_description",
            a."start_time",
            a."end_time",
            a."finished_time",
            p."priority" AS priority_name,
            s."status" AS status_name
        FROM "public"."Assignment" a
        JOIN "public"."Priority" p ON a."Priority_id" = p."Priority_id"
        JOIN "public"."Status" s ON a."Status_id" = s."Status_id"
        JOIN "public"."AssignmentType" at ON a."Type_id" = at."Type_id"
        WHERE a."Project_id" = $1
        AND NOT EXISTS (
            SELECT 1
            FROM "public"."AssignmentMember" am
            JOIN "public"."ProjectTeamMember" ptm ON am."Project_Team_Member_id" = ptm."Project_Team_Member_id"
            WHERE am."Assignment_id" = a."Assignment_id" AND ptm."Account_id" = $2
        )
    `;
    const result = await pool.query(query, [projectId, accountId]);
    return result.rows;
}

// Mark assignment as completed
async function completeAssignment(assignmentId) {
    const query = `
        UPDATE "public"."Assignment"
        SET "finished_time" = NOW(),
            "Status_id" = (
                CASE
                    WHEN "end_time" >= NOW() THEN 3 -- Finished In Time
                    ELSE 4 -- Finished After Deadline
                END
            )
        WHERE "Assignment_id" = $1
        RETURNING *;
    `;
    const result = await pool.query(query, [assignmentId]);
    return result.rowCount > 0 ? result.rows[0] : null;
}

// Take an assignment
async function takeAssignment(assignmentId, accountId) {
    const query = `
        INSERT INTO "public"."AssignmentMember" ("Assignment_id", "Project_Team_Member_id")
        SELECT $1, ptm."Project_Team_Member_id"
        FROM "public"."ProjectTeamMember" ptm
        WHERE ptm."Account_id" = $2
        RETURNING *;
    `;
    const result = await pool.query(query, [assignmentId, accountId]);
    return result.rowCount > 0 ? result.rows[0] : null;
}

// Fetch assignment details
async function fetchAssignmentDetails(assignmentId) {
    const query = `
        SELECT DISTINCT
            a."Assignment_id",
            a."Parent_Assignment_id",
            at."type" AS assignment_type,
            a."assignment_title",
            a."assignment_description",
            a."start_time",
            a."end_time",
            a."finished_time",
            p."priority" AS priority_name,
            s."status" AS status_name,
            (
                SELECT STRING_AGG(DISTINCT ptm."Account_id"::TEXT, ', ')
                FROM "public"."AssignmentMember" am
                JOIN "public"."ProjectTeamMember" ptm ON am."Project_Team_Member_id" = ptm."Project_Team_Member_id"
                WHERE am."Assignment_id" = a."Assignment_id"
            ) AS members
        FROM "public"."Assignment" a
        JOIN "public"."Priority" p ON a."Priority_id" = p."Priority_id"
        JOIN "public"."Status" s ON a."Status_id" = s."Status_id"
        JOIN "public"."AssignmentType" at ON a."Type_id" = at."Type_id"
        WHERE a."Assignment_id" = $1
    `;
    const result = await pool.query(query, [assignmentId]);
    return result.rowCount > 0 ? result.rows[0] : null;
}

async function saveAssignment(assignmentId, { assignment_title, assignment_description, end_time, members }) {
    const client = await pool.connect();
    console.log(assignmentId, assignment_title, assignment_description, end_time, members);
    try {
        await client.query('BEGIN');

        // Update assignment details
        const updateQuery = `
            UPDATE "public"."Assignment"
            SET 
                "assignment_title" = $1,
                "assignment_description" = $2,
                "end_time" = $3
            WHERE "Assignment_id" = $4
            RETURNING *;
        `;
        const updateResult = await client.query(updateQuery, [
            assignment_title,
            assignment_description,
            end_time,
            assignmentId,
        ]);

        if (updateResult.rowCount === 0) {
            await client.query('ROLLBACK');
            return null;
        }

        // Update assignment members
        const deleteMembersQuery = `
            DELETE FROM "public"."AssignmentMember"
            WHERE "Assignment_id" = $1;
        `;
        await client.query(deleteMembersQuery, [assignmentId]);

        if (members && members.length > 0) {
            const insertMembersQuery = `
                INSERT INTO "public"."AssignmentMember" ("Assignment_id", "Project_Team_Member_id")
                SELECT $1, ptm."Project_Team_Member_id"
                FROM "public"."ProjectTeamMember" ptm
                WHERE ptm."Account_id" = ANY($2::BIGINT[]);
            `;
            await client.query(insertMembersQuery, [assignmentId, members]);
        }

        await client.query('COMMIT');
        return updateResult.rows[0];
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error saving assignment:', err);
        throw err;
    } finally {
        client.release();
    }
}

// Report a bug as a new assignment
async function reportBug({ project_id, parent_assignment_id, title, description, deadline, members }) {
    const client = await pool.connect();
    console.log(project_id, parent_assignment_id, title, description, deadline, members);
    try {
        await client.query('BEGIN');

        const query = `
            INSERT INTO "public"."Assignment" (
                "Project_id", 
                "Parent_Assignment_id", 
                "Type_id", 
                "Priority_id", 
                "Status_id", 
                "assignment_title", 
                "assignment_description", 
                "start_time", 
                "end_time"
            ) VALUES (
                $1, $2, 2, 3, 1, $3, $4, NOW(), $5
            ) RETURNING *;
        `;

        const result = await client.query(query, [
            project_id,
            parent_assignment_id,
            title,
            description,
            deadline,
        ]);

        const newAssignment = result.rows[0];

        // Assign members to the bug (if provided)
        if (members && members.length > 0) {
            const memberQuery = `
                INSERT INTO "public"."AssignmentMember" ("Assignment_id", "Project_Team_Member_id")
                SELECT $1, ptm."Project_Team_Member_id"
                FROM "public"."ProjectTeamMember" ptm
                WHERE ptm."Account_id" = ANY($2::BIGINT[]);
            `;
            await client.query(memberQuery, [newAssignment.Assignment_id, members]);
        }

        await client.query('COMMIT');
        return newAssignment;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error reporting bug:", error);
        throw error;
    } finally {
        client.release();
    }
}


module.exports = {
    getAllAssignments,
    getTakenAssignments,
    getNotTakenAssignments,
    completeAssignment,
    takeAssignment,
    fetchAssignmentDetails,
    saveAssignment,
    reportBug,
};