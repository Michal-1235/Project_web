import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getdata_ProjectCreation1, submit_ProjectCreation1 } from "../services/database_queries_BE";

function ProjectCreation1({ adminStatus }) {
    const teamTitleRef = useRef(null);
    const teamDescriptionRef = useRef(null);
    const teamDeadlineRef = useRef(null);
    const teamMembersRef = useRef(null);
    const teamLeaderRef = useRef(null);

    const [teamData, setTeamData] = useState([]); // Single state for both members and leaders
    const [existingProject, setExistingProject] = useState(null); // State to store existing project data
    const [isLoading, setIsLoading] = useState(true); // Loading state

    const navigate = useNavigate();
    const location = useLocation(); 
    const Project_id = location.state?.project_id; // Get project ID from state 

    useEffect(() => {
        
        // Fetch team data and project data when the component loads
        getdata_ProjectCreation1(Project_id)
            .then((data) => {
                setTeamData(data.teamMembers); // Always set team members for dropdown
                console.log("Fetched team data:", data.teamMembers); // Debugging line to check fetched team data
                if (data.project) {
                    setExistingProject(data.project); // Set existing project data if it exists
                    // Pre-fill the form with existing project data
                    teamTitleRef.current.value = data.project.title || "";
                    teamDescriptionRef.current.value = data.project.description || "";
                    teamDeadlineRef.current.value = data.project.deadline || getTomorrowDate();
                    if (data.project.members) {
                        Array.from(teamMembersRef.current.options).forEach((option) => {
                            option.selected = data.project.members.includes(option.value);
                        });
                    }
                    if (data.project.leader) {
                        teamLeaderRef.current.value = data.project.leader;
                    }
                }
                setIsLoading(false); // Data has been loaded
            })
            .catch((error) => {
                if (error.message === "Unauthorized") {
                  console.error("Unauthorized access:", error);
                  alert("Unauthorized access. Please log in again.");
                  navigate("/login"); // Redirect to login on 401
                } else {
                  console.error("Error:", error);
                  alert("Error fetching data. Please try again later.");
                }
              });
    }, []);

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    };

    

    function handleSubmit() {
        if (
            !teamTitleRef.current.value.trim() ||
            !teamDescriptionRef.current.value.trim() ||
            !teamDeadlineRef.current.value ||
            teamMembersRef.current.selectedOptions.length === 0 ||
            (adminStatus && !teamLeaderRef.current.value) // Check team leader only if admin
        ) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        const projectData = {
            title: teamTitleRef.current.value,
            description: teamDescriptionRef.current.value,
            deadline: teamDeadlineRef.current.value,
            members: Array.from(teamMembersRef.current.selectedOptions).map(option => option.value),
            leader: adminStatus ? teamLeaderRef.current.value : null, // Include leader only if admin
            id: Project_id
        };

        // Submit the project data
        submit_ProjectCreation1(projectData)
            .then((data) => {
                alert(existingProject ? "Changes saved successfully!" : "Project created successfully!");
                // Navigate based on whether the project is new or existing
                if (existingProject) {
                    navigate("/main"); // Navigate to main if editing an existing project
                } else {
                    console.log("Project ID:", data); // Log the project ID for debugging
                    navigate("/create2", {state: { project_id: data.project_id }}); // Navigate to create2 if creating a new project
                }
            })
            .catch((error) => {
                if (error.message === "Unauthorized") {
                  console.error("Unauthorized access:", error);
                  alert("Unauthorized access. Please log in again.");
                  navigate("/login"); // Redirect to login on 401
                } else {
                  console.error("Error:", error);
                  alert("Error submitting data. Please try again later.");
                }
              });
    }

    if (isLoading) {
        return <div>Loading...</div>; // Show a loading spinner or placeholder while data is being fetched
    }

    return (
        <div>
            {/* Title Input */}
            <div className="mb-3">
                <label htmlFor="teamTitle" className="form-label">Team Title</label>
                <input
                    type="text"
                    id="teamTitle"
                    className="form-control"
                    placeholder="Enter team title"
                    ref={teamTitleRef}
                />
            </div>

            {/* Description Input */}
            <div className="mb-3">
                <label htmlFor="teamDescription" className="form-label">Team Description</label>
                <textarea
                    id="teamDescription"
                    className="form-control"
                    placeholder="Enter team description"
                    ref={teamDescriptionRef}
                ></textarea>
            </div>

            {/* Deadline Input */}
            <div className="mb-3">
                <label htmlFor="teamDeadline" className="form-label">Team Deadline</label>
                <input
                    type="date"
                    id="teamDeadline"
                    className="form-control"
                    ref={teamDeadlineRef}
                    min={getTomorrowDate()} // Set minimum date to tomorrow
                />
            </div>

            {/* Team Members Dropdown */}
            <div className="mb-3">
                <label htmlFor="teamMembers" className="form-label">Team Members, use CTRL to select</label>
                <select
                    id="teamMembers"
                    className="form-select"
                    multiple
                    ref={teamMembersRef}
                >
                    {teamData.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Team Leader Dropdown (Visible only for admins) */}
            {adminStatus && (
                <div className="mb-3">
                    <label htmlFor="teamLeader" className="form-label">Team Leader</label>
                    <select
                        id="teamLeader"
                        className="form-select"
                        ref={teamLeaderRef}
                    >
                        {teamData.map((leader) => (
                            <option key={leader.id} value={leader.id}>
                                {leader.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Finish Button */}
            <div className="mb-3">
                <button className="btn btn-primary" onClick={handleSubmit}>
                    {existingProject ? "Save Changes" : "Create Project"}
                </button>
            </div>

            <div className="mb-3">
                <button className="btn btn-danger" onClick={() => navigate("/main")}>
                    Go back
                </button>
            </div>
        </div>
    );
}

export default ProjectCreation1;