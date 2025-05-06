const express = require('express');
const { getUsers, getProject, createProject, updateProject } = require('../../models/project_creation_api/project_creation');

const router = express.Router();

// GET: Fetch data (e.g., team members and project details if project_id is provided)
router.get('/', async (req, res) => {
    try {
        if (!req.session.Account_Id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { project_id } = req.query;

        if (project_id) {
            // Fetch project details along with its members
            const project = await getProject(project_id);
            const members = await getUsers(); // Fetch all accounts (non-admins)
            return res.status(200).json({ project: project.rows[0], teamMembers: members.rows });
        } else {
            // Fetch only accounts (non-admins)
            const members = await getUsers();
            return res.status(200).json({ project: null, teamMembers: members.rows });
        }
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST: Create or update a project based on the presence of project_id
router.post('/', async (req, res) => {
    try {
        if (!req.session.Account_Id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const { id: project_id, title, description, deadline, members, leader } = req.body;
        console.log("Received data:", req.body);

        // If leader is null, set it to the Account_Id from the session
        const projectLeader = leader || req.session.Account_Id;
        if (project_id) {
            // Update an existing project
            console.log("Updating project:", project_id);
            const result = await updateProject({ project_id, title, description, deadline, members, projectLeader });
            return res.status(200).json(result);
        } else {
            // Create a new project
            console.log("Creating new project:", title);
            const result = await createProject({ title, description, deadline, members, projectLeader });
            return res.status(201).json(result);
        }
    } catch (err) {
        console.error("Error processing project data:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;