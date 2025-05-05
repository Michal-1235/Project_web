const express = require('express');
const { getAllProjects, getTeamLeaderProjects, getMemberProjects } = require('../../models/main_page_api/main_page');
const router = express.Router();

// GET: Fetch all projects (admin-only)
router.get('/all', async (req, res) => {
    try {
        if (!req.session.Account_Id || !req.session.is_admin) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const projects = await getAllProjects();
        return res.status(200).json({ projects });
    } catch (err) {
        console.error("Error fetching all projects:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET: Fetch projects where the user is a team leader
router.get('/teamleader', async (req, res) => {
    try {
        if (!req.session.Account_Id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const projects = await getTeamLeaderProjects(req.session.Account_Id);
        return res.status(200).json({ projects });
    } catch (err) {
        console.error("Error fetching team leader projects:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET: Fetch projects where the user is a team member
router.get('/member', async (req, res) => {
    try {
        if (!req.session.Account_Id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const projects = await getMemberProjects(req.session.Account_Id);
        return res.status(200).json({ projects });
    } catch (err) {
        console.error("Error fetching member projects:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;