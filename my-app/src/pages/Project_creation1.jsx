import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function ProjectCreation1() {
    const teamTitleRef = useRef(null);
    const teamDescriptionRef = useRef(null);
    const teamDeadlineRef = useRef(null);
    const teamMembersRef = useRef(null);
    const teamLeaderRef = useRef(null);

    const navigate = useNavigate();

    function handleSubmit() {
        const teamData = {
            title: teamTitleRef.current.value,
            description: teamDescriptionRef.current.value,
            deadline: teamDeadlineRef.current.value,
            members: Array.from(teamMembersRef.current.selectedOptions).map(option => option.value),
            leader: teamLeaderRef.current.value,
        };

        console.log("Team Data:", teamData);
        // backend API call 
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
                />
            </div>

            {/* Team Members Dropdown */}
            <div className="mb-3">
                <label htmlFor="teamMembers" className="form-label">Team Members</label>
                <select
                    id="teamMembers"
                    className="form-select"
                    multiple
                    ref={teamMembersRef}
                >
                    <option value="member1">Member 1</option>
                    <option value="member2">Member 2</option>
                    <option value="member3">Member 3</option>
                </select>
            </div>

            {/* Team Leader Dropdown */}
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

            {/* Finish Button */}
            <div className="mb-3">
                <button className="btn btn-primary" onClick={handleSubmit}>
                    Finish Create Assignments
                </button>
            </div>
        </div>
    );
}


export default ProjectCreation1;