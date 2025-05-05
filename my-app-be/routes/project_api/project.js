const express = require('express');
const {
    getAllAssignments,
    getTakenAssignments,
    getNotTakenAssignments,
    completeAssignment,
    takeAssignment,
    fetchAssignmentDetails,
    saveAssignment,
    reportBug
} = require('../../models/project_api/project');

const router = express.Router();

// GET: Fetch all assignments for a project (Admin)
router.get('/all', async (req, res) => {
    try {
        const { project_id } = req.query;

        if (!req.session.Account_Id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const assignments = await getAllAssignments(project_id);
        return res.status(200).json({ assignments });
    } catch (err) {
        console.error("Error fetching all assignments:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET: Fetch taken assignments for a project
router.get('/taken', async (req, res) => {
    try {
        const { project_id } = req.query;

        if (!req.session.Account_Id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const assignments = await getTakenAssignments(project_id, req.session.Account_Id);
        return res.status(200).json({ assignments });
    } catch (err) {
        console.error("Error fetching taken assignments:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// GET: Fetch not taken assignments for a project
router.get('/available', async (req, res) => {
    try {
        const { project_id } = req.query;

        if (!req.session.Account_Id) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const assignments = await getNotTakenAssignments(project_id, req.session.Account_Id);
        return res.status(200).json({ assignments });
    } catch (err) {
        console.error("Error fetching not taken assignments:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

// POST: Mark assignment as completed
router.post('/:assignment_id/complete', async (req, res) => {
    try {
        const { assignment_id } = req.params;

        if (!req.session.Account_Id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await completeAssignment(assignment_id);

        if (!result) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.status(200).json({ success: true, assignment: result });
    } catch (err) {
        console.error('Error marking assignment as completed:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST: Take an assignment
router.post('/:assignment_id/take', async (req, res) => {
    try {
        const { assignment_id } = req.params;
        const { Account_Id } = req.session;

        if (!Account_Id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const result = await takeAssignment(assignment_id, Account_Id);

        if (!result) {
            return res.status(404).json({ error: 'Failed to take assignment' });
        }

        res.status(200).json({ success: true, assignmentMember: result });
    } catch (err) {
        console.error('Error taking assignment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// GET: Fetch assignment details
router.get('/:assignment_id', async (req, res) => {
    try {
        const { assignment_id } = req.params;

        if (!req.session.Account_Id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const assignment = await fetchAssignmentDetails(assignment_id);

        if (!assignment) {
            return res.status(404).json({ error: 'Assignment not found' });
        }

        res.status(200).json(assignment);
    } catch (err) {
        console.error('Error fetching assignment details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// PUT: Save assignment details
router.put('/:assignment_id', async (req, res) => {
    try {
        const { assignment_id } = req.params;
        const { assignment_title, assignment_description, end_time, members } = req.body;

        if (!req.session.Account_Id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.log("Saving assignment with details:", assignment_title, assignment_description, end_time, members);
        const updatedAssignment = await saveAssignment(assignment_id, {
            assignment_title,
            assignment_description,
            end_time,
            members,
        });

        if (!updatedAssignment) {
            return res.status(404).json({ error: 'Assignment not found or update failed' });
        }

        res.status(200).json(updatedAssignment);
    } catch (err) {
        console.error('Error saving assignment:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST: Report a bug
router.post('/report-bug', async (req, res) => {
    const { project_id, parent_assignment_id, title, description, deadline, members } = req.body;

    if (!req.session.Account_Id) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    console.log("Reporting bug with details:", {
        project_id,
        parent_assignment_id,
        title,
        description,
        deadline,
        members,
    });

    if (!project_id || !parent_assignment_id || !title || !description || !deadline) {
        return res.status(400).json({ error: "Missing required fields" });
    }   
    console.log("Reporting bug with details:", {
        project_id,
        parent_assignment_id,
        title,
        description,
        deadline,
        members,
    });
    try {
        const newAssignment = await reportBug({
            project_id,
            parent_assignment_id,
            title,
            description,
            deadline,
            members,
        });
        res.status(201).json({ message: "Bug report created successfully", newAssignment });
    } catch (err) {
        console.error("Error reporting bug:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;