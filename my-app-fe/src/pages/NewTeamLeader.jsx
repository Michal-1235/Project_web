import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTeamMembers, updateTeamLeader } from "../services/database_queries_BE";

function NewTeamLeader() {
    const [teamMembers, setTeamMembers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const teamLeaderRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();
    const { project_id } = location.state || {}; // Get project_id from state

    useEffect(() => {
        if (!project_id) {
            alert("Project ID is missing. Redirecting to the main page.");
            navigate("/main");
            return;
        }

        // Fetch team members for the project
        getTeamMembers(project_id)
            .then((members) => {
                setTeamMembers(members);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching team members:", error);
                alert("Error fetching team members. Please try again later.");
                navigate("/main");
            });
    }, [project_id, navigate]);

    const handleSubmit = () => {
        const newLeaderId = teamLeaderRef.current.value;

        if (!newLeaderId) {
            alert("Please select a new team leader.");
            return;
        }

        // Submit the new team leader
        updateTeamLeader(project_id, newLeaderId)
            .then(() => {
                alert("Team leader updated successfully!");
                navigate(`/project`, { state: { project_id } }); // Redirect back to the project page
            })
            .catch((error) => {
                console.error("Error updating team leader:", error);
                alert("Error updating team leader. Please try again later.");
            });
    };

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading spinner or placeholder while data is being fetched
    }

    return (
        <div className="container">
            <h1 className="mt-4">Change Team Leader</h1>
            <div className="mb-3">
                <label htmlFor="teamLeader" className="form-label">Select New Team Leader</label>
                <select id="teamLeader" className="form-select" ref={teamLeaderRef}>
                    <option value="">-- Select a Team Leader --</option>
                    {teamMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <button className="btn btn-primary me-2" onClick={handleSubmit}>
                    Submit
                </button>
                <button className="btn btn-secondary" onClick={() => navigate(`/project`, { state: { project_id } })}>
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default NewTeamLeader;