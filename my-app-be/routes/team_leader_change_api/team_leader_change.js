const express = require('express');
const { updateTeamLeader, getTeamMembers, getProjectDetails } = require('../../models/team_leader_change_api/team_leader_change');
const router = express.Router();

// POST: Update the team leader for a project
router.post('/:project_id/update-leader', async (req, res) => {
    const { project_id } = req.params;
    const { newLeaderId } = req.body;

    if (!req.session.Account_Id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    if (!newLeaderId) {
        return res.status(400).json({ error: "New leader ID is required" });
    }

    try {
        await updateTeamLeader(project_id, newLeaderId);
        res.status(200).json({ message: "Team leader updated successfully" });
    } catch (error) {
        console.error("Error updating team leader:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET: Fetch team members for a project
router.get('/:project_id/team-members', async (req, res) => {
    const { project_id } = req.params;

    if (!req.session.Account_Id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    try {
        const members = await getTeamMembers(project_id);
        res.status(200).json({ members });
    } catch (error) {
        console.error("Error fetching team members:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET: Fetch project details
router.get('/:project_id/details', async (req, res) => {
    const { project_id } = req.params;

    if (!req.session.Account_Id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const projectDetails = await getProjectDetails(project_id);
        res.status(200).json(projectDetails);
    } catch (error) {
        console.error('Error fetching project details:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;