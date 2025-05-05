const pool = require('../../config/db.js');

// Fetch all projects (admin-only) with all columns
async function getAllProjects() {
    const query = `
        SELECT 
            p."Project_id",
            p."project_title",
            p."project_description",
            p."start_time",
            p."end_time",
            p."finished_time",
            a."username" AS leader_name,
            pr."priority" AS priority_name,
            s."status" AS status_name
        FROM "public"."Project" p
        JOIN "public"."Account" a ON p."Account_id" = a."Account_id"
        JOIN "public"."Priority" pr ON p."Priority_id" = pr."Priority_id"
        JOIN "public"."Status" s ON p."Status_id" = s."Status_id"
    `;
    const result = await pool.query(query);
    return result.rows;
}

async function getTeamLeaderProjects(accountId) {
    const query = `
        SELECT 
            p."Project_id",
            p."project_title",
            p."project_description",
            p."start_time",
            p."end_time",
            p."finished_time",
            pr."priority" AS priority_name,
            s."status" AS status_name
        FROM "public"."Project" p
        JOIN "public"."Priority" pr ON p."Priority_id" = pr."Priority_id"
        JOIN "public"."Status" s ON p."Status_id" = s."Status_id"
        WHERE p."Account_id" = $1
    `;
    const result = await pool.query(query, [accountId]);
    return result.rows;
}

// Fetch projects where the user is a team member with all columns
async function getMemberProjects(accountId) {
    const query = `
        SELECT 
            p."Project_id",
            p."project_title",
            p."project_description",
            p."start_time",
            p."end_time",
            p."finished_time",
            pr."priority" AS priority_name,
            s."status" AS status_name,
            a."username" AS leader_name -- Fetch the team leader's name
        FROM "public"."Project" p
        JOIN "public"."ProjectTeamMember" ptm ON p."Project_id" = ptm."Project_id"
        JOIN "public"."Priority" pr ON p."Priority_id" = pr."Priority_id"
        JOIN "public"."Status" s ON p."Status_id" = s."Status_id"
        JOIN "public"."Account" a ON p."Account_id" = a."Account_id" -- Join with Account table to get leader name
        WHERE ptm."Account_id" = $1
    `;
    const result = await pool.query(query, [accountId]);
    return result.rows;
}

module.exports = {
    getAllProjects,
    getTeamLeaderProjects,
    getMemberProjects,
};