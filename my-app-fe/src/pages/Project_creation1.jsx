import { useRef } from "react";
import { useNavigate } from "react-router-dom";


function ProjectCreation1() {
    const teamTitleRef = useRef(null);
    const teamDescriptionRef = useRef(null);
    const teamDeadlineRef = useRef(null);
    const teamMembersRef = useRef(null);
    const teamLeaderRef = useRef(null);

    const navigate = useNavigate();

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    };

    // Get id from database

    function handleSubmit() {
        if (
            !teamTitleRef.current.value.trim() ||
            !teamDescriptionRef.current.value.trim() ||
            !teamDeadlineRef.current.value ||
            teamMembersRef.current.selectedOptions.length === 0
            //!teamLeaderRef.current.value
        ) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        const newProject = {
            title: teamTitleRef.current.value,
            description: teamDescriptionRef.current.value,
            deadline: teamDeadlineRef.current.value,
            members: Array.from(teamMembersRef.current.selectedOptions).map(option => option.value),
            //leader: teamLeaderRef.current.value,
            id: Date.now() // Use a unique ID based on timestamp
        };

        const existingProjects = JSON.parse(localStorage.getItem("teamData")) || [];
        existingProjects.push(newProject);
        localStorage.setItem("teamData", JSON.stringify(existingProjects)); // Save updated array to local storage

        console.log("Updated Team Data:", existingProjects);
        navigate("/create2");
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
                >   {/* get from database */}

                    <option value="member1">Member 1</option>
                    <option value="member2">Member 2</option>
                    <option value="member3">Member 3</option>
                </select>
            </div>

            {/* Team Leader Dropdown 
            <div className="mb-3">
                <label htmlFor="teamLeader" className="form-label">Team Leader</label>
                <select
                    id="teamLeader"
                    className="form-select"
                    ref={teamLeaderRef}
                >
                    <option value="leader1">Leader 1</option>
                    <option value="leader2">Leader 2</option>
                    <option value="leader3">Leader 3</option>
                </select>
            </div>
            */}

            {/* Finish Button */}
            <div className="mb-3">
                <button className="btn btn-primary" onClick={handleSubmit}>
                    Finish Create Assignments
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