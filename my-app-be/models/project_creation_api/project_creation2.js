const pool = require('../../config/db.js');

async function getAssignmentsWithMembersAndProjectDetails(project_id) {
    // Step 1: Get all assignments for the project
    const assignmentsQuery = `
        SELECT * 
        FROM "Assignment" 
        WHERE "Project_id" = $1
    `;
    const assignmentsResult = await pool.query(assignmentsQuery, [project_id]);

    const assignments = assignmentsResult.rows;

    // Step 2: For each assignment, get its members
    const assignmentsWithMembers = await Promise.all(assignments.map(async (assignment) => {
        // Get members for each assignment
        const membersQuery = `
            SELECT ptm."Project_Team_Member_id", a."username"
            FROM "AssignmentMember" am
            JOIN "ProjectTeamMember" ptm ON am."Project_Team_Member_id" = ptm."Project_Team_Member_id"
            JOIN "Account" a ON ptm."Account_id" = a."Account_id"
            WHERE am."Assignment_id" = $1
        `;
        const membersResult = await pool.query(membersQuery, [assignment.Assignment_id]);

        return {
            ...assignment, // Include assignment details
            members: membersResult.rows // Add members for this assignment
        };
    }));

    // Step 3: Get all members of the project (from the ProjectTeamMember table)
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
        assignments: assignmentsWithMembers, // Assignments with their members
        projectMembers, // All members of the project
        deadline // Project deadline
    };
}



async function createOrUpdateAssignments(assignments, project_id) {
    const client = await pool.connect(); // assuming you're using pg-pool or similar
    console.log(assignments,project_id)
    

        // Iterate over each assignment in the request
        for (let assignment of assignments) {
            const { assignment_id, title, description,  deadline, members } = assignment;
            console.log(assignment_id, title, description,  deadline, members,assignment);
            // If assignment_id exists, update the existing assignment
            if (assignment_id) {
                console.log(assignment_id);
                const result = await client.query(`
                    UPDATE "public"."Assignment"
                    SET "assignment_title" = $2, 
                        "assignment_description" = $3, 
                        "start_time" = now(), 
                        "end_time" = $4
                    WHERE "Assignment_id" = $1
                `, [assignment_id, title, description, end_time]);
                console.log(result, assignment_id);
                createdAssignmentId = assignment_id;
            } else {
                console.log(title, description, deadline, members);
                // If assignment_id does not exist, create a new assignment
                const result = await client.query(`
                    INSERT INTO "public"."Assignment" 
                    ("Project_id", "assignment_title", "assignment_description", "start_time", "end_time", "Priority_id","Type_id", "Status_id")
                    VALUES ($1, $2, $3, now(), $4,1,1,1)
                    RETURNING "Assignment_id"
                `, [project_id, title, description, deadline]);

                createdAssignmentId = result.rows[0].Assignment_id; // Get the newly created assignment's ID
                console.log(createdAssignmentId);
            }

            console.log("Here1")
            // First, delete all members for the current assignment
            await client.query(`
                DELETE FROM "public"."AssignmentMember"
                WHERE "Assignment_id" = $1
            `, [createdAssignmentId]);
            
            console.log("Here2",members)
            // Now, add members to the assignment
            for (let member of members) {
                await client.query(`
                    INSERT INTO "public"."AssignmentMember" 
                    ("Assignment_id", "Project_Team_Member_id")
                    VALUES ($1, $2)
                `, [createdAssignmentId, member]);
            }
            console.log("Here3")
        }

        return { success: true };
    
}

module.exports = { getAssignmentsWithMembersAndProjectDetails, createOrUpdateAssignments };
