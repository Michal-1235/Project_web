const express = require('express');
const {
    getAssignmentsWithMembersAndProjectDetails,
    createOrUpdateAssignments
} = require('../../models/project_creation_api/project_creation2');

const router = express.Router();

// GET: Fetch assignments, members, and deadline for a specific project
router.get('/', async (req, res) => {
    try {
        if (!req.session.Account_Id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { project_id } = req.query;
        if (!project_id) {
            return res.status(400).json({ error: "Missing project_id in query" });
        }

        // Fetch assignments, team members, and project deadline in parallel
        const { assignments, projectMembers, deadline } = await getAssignmentsWithMembersAndProjectDetails(project_id);
        console.log(project_id, assignments, projectMembers, deadline);
        return res.status(200).json({
            assignments: assignments,
            members: projectMembers,
            deadline: deadline 
        });
    } catch (err) {
        console.error("Error fetching project creation 2 data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST: Submit (create or update) assignments for a project
router.post('/', async (req, res) => {
    try {
        if (!req.session.Account_Id) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        
        const { project_id, assignments } = req.body;
        if (!project_id || !assignments) {
            return res.status(400).json({ error: "Missing project_id or assignments in request body" });
        }

        // Pass arguments in the correct order
        const result = await createOrUpdateAssignments(assignments, project_id);
        return res.status(200).json({ message: "Assignments submitted successfully", result });
    } catch (err) {
        console.error("Error submitting assignments:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;