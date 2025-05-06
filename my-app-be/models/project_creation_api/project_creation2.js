const pool = require('../../config/db.js');

async function getAssignmentsWithMembersAndProjectDetails(project_id) {
    // Step 1: Get all assignments for the project with their details
    const assignmentsQuery = `
        SELECT 
            a."Assignment_id",
            a."Project_id",
            a."assignment_title",
            a."assignment_description",
            a."start_time",
            a."end_time",
            a."finished_time",
            s."status" AS status_name,
            t."type" AS type_name,
            a."Priority_id",
            p."priority" AS priority_name
        FROM "Assignment" a
        JOIN "Status" s ON a."Status_id" = s."Status_id"
        JOIN "AssignmentType" t ON a."Type_id" = t."Type_id"
        JOIN "Priority" p ON a."Priority_id" = p."Priority_id"
        WHERE a."Project_id" = $1
    `;
    const assignmentsResult = await pool.query(assignmentsQuery, [project_id]);
    const assignments = assignmentsResult.rows;

    // Step 2: For each assignment, get its members
    const assignmentsWithMembers = await Promise.all(assignments.map(async (assignment) => {
        const membersQuery = `
            SELECT ptm."Project_Team_Member_id", a."username"
            FROM "AssignmentMember" am
            JOIN "ProjectTeamMember" ptm ON am."Project_Team_Member_id" = ptm."Project_Team_Member_id"
            JOIN "Account" a ON ptm."Account_id" = a."Account_id"
            WHERE am."Assignment_id" = $1
        `;
        const membersResult = await pool.query(membersQuery, [assignment.Assignment_id]);

        return {
            ...assignment,
            members: membersResult.rows
        };
    }));

    // Step 3: Get all members of the project
    const projectMembersQuery = `
        SELECT ptm."Project_Team_Member_id", a."username"
        FROM "ProjectTeamMember" ptm
        JOIN "Account" a ON ptm."Account_id" = a."Account_id"
        WHERE ptm."Project_id" = $1
    `;
    const projectMembersResult = await pool.query(projectMembersQuery, [project_id]);
    const projectMembers = projectMembersResult.rows;

    // Step 4: Get the project deadline
    const deadlineQuery = `
        SELECT "end_time"
        FROM "Project"
        WHERE "Project_id" = $1
    `;
    const deadlineResult = await pool.query(deadlineQuery, [project_id]);
    const deadline = deadlineResult.rows[0]?.end_time;

    return {
        assignments: assignmentsWithMembers,
        projectMembers,
        deadline
    };
}

async function createOrUpdateAssignments(assignments, project_id) {
    const client = await pool.connect(); // Connect to the database
    try {
        await client.query('BEGIN'); // Start a transaction

        console.log("Received assignments:", assignments, "Project ID:", project_id);

        // Iterate over each assignment in the request
        for (let assignment of assignments) {
            const { id: Assignment_id, title, description, deadline, members } = assignment;

            let createdAssignmentId;

            if (Assignment_id) {
                // Update existing assignment
                console.log("Updating assignment:", Assignment_id);
                await client.query(
                    `
                    UPDATE "public"."Assignment"
                    SET 
                        "assignment_title" = $2, 
                        "assignment_description" = $3, 
                        "end_time" = $4
                    WHERE "Assignment_id" = $1
                    `,
                    [Assignment_id, title, description, deadline]
                );
                createdAssignmentId = Assignment_id;
            } else {
                // Create new assignment
                console.log("Creating new assignment:", title, description, deadline);
                const result = await client.query(
                    `
                    INSERT INTO "public"."Assignment" 
                    ("Project_id", "assignment_title", "assignment_description", "start_time", "end_time", "Priority_id", "Type_id", "Status_id")
                    VALUES ($1, $2, $3, now(), $4, 1, 1, 1)
                    RETURNING "Assignment_id"
                    `,
                    [project_id, title, description, deadline]
                );
                createdAssignmentId = result.rows[0].Assignment_id; // Get the newly created assignment's ID
            }

            console.log("Assignment ID:", createdAssignmentId);

            // Delete all members for the current assignment
            await client.query(
                `
                DELETE FROM "public"."AssignmentMember"
                WHERE "Assignment_id" = $1
                `,
                [createdAssignmentId]
            );

            console.log("Deleted existing members for assignment:", createdAssignmentId);

            // Add members to the assignment
            for (let member of members) {
                await client.query(
                    `
                    INSERT INTO "public"."AssignmentMember" 
                    ("Assignment_id", "Project_Team_Member_id")
                    VALUES ($1, $2)
                    `,
                    [createdAssignmentId, member]
                );
            }

            console.log("Added members for assignment:", createdAssignmentId);
        }

        await client.query('COMMIT'); // Commit the transaction
        return { success: true };
    } catch (error) {
        await client.query('ROLLBACK'); // Rollback the transaction on error
        console.error("Error in createOrUpdateAssignments:", error);
        throw error;
    } finally {
        client.release(); // Release the database client
    }
}

module.exports = { getAssignmentsWithMembersAndProjectDetails, createOrUpdateAssignments };