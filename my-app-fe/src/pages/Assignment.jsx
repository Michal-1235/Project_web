import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    fetchAssignmentDetails,
    saveAssignment,
    getTeamMembers,
    reportAssignmentCompletion,
    takeAssignment,
    getTeamLeader
} from '../services/database_queries_BE';

function formatDateToInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    date.setHours(date.getHours() + 2); // Add two hours to the date
    return date.toISOString().split('T')[0]; // Converts to "yyyy-MM-dd"
}

function Assignment({ adminStatus, Account_id }) {
    const navigate = useNavigate();
    const location = useLocation();
    const { Assignment_id, project_id} = location.state;

    const [assignment, setAssignment] = useState(null);
    const [editableTitle, setEditableTitle] = useState('');
    const [editableDescription, setEditableDescription] = useState('');
    const [editableDeadline, setEditableDeadline] = useState('');
    const [editableMembers, setEditableMembers] = useState([]);
    const [projectMembers, setProjectMembers] = useState([]);
    const [isTeamLeader, setIsTeamLeader] = useState(false); 
    const [hasTakenAssignment, setHasTakenAssignment] = useState(false);
    const [projectDeadline, setProjectDeadline] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const assignmentData = await fetchAssignmentDetails(Assignment_id);
                const membersData = await getTeamMembers(project_id);
                const projectDetails = await getTeamLeader(project_id); // Fetch Team Leader details
    
                console.log('Fetched assignment data:', assignmentData);
                console.log('Fetched members:', assignmentData.members);
    
                setAssignment(assignmentData);
                setEditableTitle(assignmentData.assignment_title);
                setEditableDescription(assignmentData.assignment_description);
                setEditableDeadline(formatDateToInput(assignmentData.end_time));
    
                if (assignmentData.members) {
                    const memberIds = Array.isArray(assignmentData.members)
                        ? assignmentData.members
                        : assignmentData.members.split(',').map((id) => id.trim());
                    setEditableMembers(memberIds);
    
                    // Check if the current user has taken the assignment
                    setHasTakenAssignment(memberIds.includes(Account_id.toString()));
                } else {
                    setEditableMembers([]);
                    setHasTakenAssignment(false);
                }
    
                setProjectMembers(membersData);
    
                // Set the project deadline
                if (assignmentData.project_deadline) {
                    setProjectDeadline(formatDateToInput(assignmentData.project_deadline));
                }
    
                // Check if the current user is the team leader
                setIsTeamLeader(projectDetails.leader_id === Account_id);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [Assignment_id, project_id, Account_id]);

    useEffect(() => {
        console.log('Updated editableMembers:', editableMembers);
        console.log('Updated projectMembers:', projectMembers);
        if (assignment) {
        console.log(assignment.finished_time,isTeamLeader,adminStatus )
        }
    }, [editableMembers,projectMembers]);
  
    const handleSave = async () => {
        // Validate that the deadline does not exceed the project deadline (except for bugs)
        if (
            assignment.assignment_type !== "Bug" &&
            editableDeadline > projectDeadline
        ) {
            alert("The deadline cannot exceed the project deadline.");
            return;
        }
    
        try {
            const updatedAssignment = {
                assignment_title: editableTitle,
                assignment_description: editableDescription,
                end_time: editableDeadline,
                members: editableMembers.map((id) => parseInt(id, 10)), // Convert to array of integers
            };
            console.log("Saving assignment:", updatedAssignment); // Debugging line
            await saveAssignment(Assignment_id, updatedAssignment);
            navigate("/project", { state: { project_id } });
        } catch (error) {
            console.error("Error saving assignment:", error);
        }
    };

    const handleReportCompletion = async () => {
        const confirmCompletion = window.confirm("Are you sure you want to complete this assignment?");
        if (!confirmCompletion) {
            return; // Exit if the user cancels
        }
    
        try {
            await reportAssignmentCompletion(Assignment_id);
            navigate('/project', { state: { project_id } });
        } catch (error) {
            console.error('Error reporting completion:', error);
        }
    };

    const handleTakeAssignment = async () => {
        try {
            await takeAssignment(Assignment_id, Account_id);
            navigate('/project', { state: { project_id } });
        } catch (error) {
            console.error('Error taking assignment:', error);
        }
    };

    const handleReportBug = () => {
        navigate('/bug', { state: { project_id, Assignment_id } });
    };

    if (!assignment) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h1>Assignment Details</h1>
            <div className="row mt-4">
                <div className="col-md-6">
                    <label>Assignment Title</label>
                    <input
                        type="text"
                        className="form-control"
                        value={editableTitle}
                        onChange={(e) => setEditableTitle(e.target.value)}
                        disabled={!!assignment.finished_time || (!isTeamLeader && !adminStatus)}
                    />
                </div>
                <div className="col-md-6">
                    <label>Assignment Description</label>
                    <textarea
                        className="form-control"
                        value={editableDescription}
                        onChange={(e) => setEditableDescription(e.target.value)}
                        disabled={!!assignment.finished_time || (!isTeamLeader && !adminStatus)}
                    />
                </div>
            </div>
            <div className="row mt-4">
            <div className="col-md-6">
                <label>Deadline</label>
                <input
                    type="date"
                    className="form-control"
                    value={editableDeadline}
                    onChange={(e) => setEditableDeadline(e.target.value)}
                    max={assignment.assignment_type !== "Bug" ? projectDeadline : ""}
                    disabled={!!assignment.finished_time || (!isTeamLeader && !adminStatus)}
                />
            </div>
                <div className="col-md-6">
                    <label>Assignment Members</label>
                    <select
                        className="form-control"
                        multiple
                        value={editableMembers}
                        onChange={(e) =>
                            setEditableMembers(Array.from(e.target.selectedOptions, (option) => option.value))
                        }
                        disabled={!!assignment.finished_time || (!isTeamLeader && !adminStatus)}
                    >
                        {projectMembers.map((member) => (
                            <option key={member.id} value={member.id}>
                                {member.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-4">
                    <label>Priority</label>
                    <input type="text" className="form-control" value={assignment.priority_name} disabled />
                </div>
                <div className="col-md-4">
                    <label>Status</label>
                    <input type="text" className="form-control" value={assignment.status_name} disabled />
                </div>
                <div className="col-md-4">
                    <label>Type</label>
                    <input type="text" className="form-control" value={assignment.assignment_type} disabled />
                </div>
            </div>
            <div className="row mt-4">
                <div className="col-md-4">
                    <label>Start Time</label>
                    <input
                        type="text"
                        className="form-control"
                        value={new Date(assignment.start_time).toLocaleDateString()}
                        disabled
                    />
                </div>
                <div className="col-md-4">
                    <label>Finished Time</label>
                    <input
                        type="text"
                        className="form-control"
                        value={assignment.finished_time ? new Date(assignment.finished_time).toLocaleDateString() : 'Not Finished'}
                        disabled
                    />
                </div>
            </div>
            <div className="row mt-5">
            { (isTeamLeader || adminStatus) && assignment.status_name !== 'Finished In Time' && assignment.status_name !== 'Finished After Deadline' && (
                <div className="col-auto">
                    <button className="btn btn-primary" onClick={handleSave}>
                        Finish Edit
                    </button>
                </div>
            )}
            {!adminStatus && !hasTakenAssignment && assignment.status_name !== 'Finished In Time' && assignment.status_name !== 'Finished After Deadline' && (
                <div className="col-auto">
                    <button className="btn btn-success" onClick={handleTakeAssignment}>
                        Take Assignment
                    </button>
                </div>
            )}
            {!adminStatus && hasTakenAssignment && assignment.status_name !== 'Finished In Time' && assignment.status_name !== 'Finished After Deadline' && (
                <div className="col-auto">
                    <button className="btn btn-warning" onClick={handleReportCompletion}>
                        Complete assignment
                    </button>
                </div>
            )}
            {(assignment.status_name === 'Finished In Time' || assignment.status_name === 'Finished After Deadline')  && (
                <div className="col-auto">
                    <button className="btn btn-danger" onClick={handleReportBug}>
                        Report Bug
                    </button>
                </div>
            )}
            <div className="col-auto">
                <button className="btn btn-secondary" onClick={() => navigate('/project', {state: { project_id }})}>
                    Go Back
                </button>
            </div>
        </div>
        </div>
    );
}

export default Assignment;