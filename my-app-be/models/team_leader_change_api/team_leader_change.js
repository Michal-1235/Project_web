const pool = require('../../config/db.js');

// Update the team leader for a project
async function updateTeamLeader(projectId, newLeaderId) {


    // Update the team leader in the Project table
    const updateLeaderQuery = `
            UPDATE "public"."Project"
            SET "Account_id" = $1
            WHERE "Project_id" = $2
        `;
    return await pool.query(updateLeaderQuery, [newLeaderId, projectId]);

}

// Fetch team members for a project
async function getTeamMembers(projectId) {
    const query = `
        SELECT ptm."Account_id" AS id, a."username" AS name
        FROM "public"."ProjectTeamMember" ptm
        JOIN "public"."Account" a ON ptm."Account_id" = a."Account_id"
        WHERE ptm."Project_id" = $1
    `;
    const result = await pool.query(query, [projectId]);
    return result.rows;
}

// Fetch project details, including the team leader
async function getProjectDetails(projectId) {
    const query = `
        SELECT "Project_id", "Account_id" AS leader_id
        FROM "public"."Project"
        WHERE "Project_id" = $1
    `;
    const result = await pool.query(query, [projectId]);
    return result.rows[0];
}

module.exports = {
    updateTeamLeader,
    getTeamMembers,
    getProjectDetails,
};