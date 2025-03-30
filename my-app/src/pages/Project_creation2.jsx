import { useState } from "react";

function ProjectCreation2() {
    const [count, setCount] = useState(0);
    const [error, setError] = useState(""); // State to store error message
    const [assignments, setAssignments] = useState([]); // State to hold assignment data

    const handleInputChange = (e) => {
        const value = Number(e.target.value);
        if (!isNaN(value) && value > 0) {
            setCount(value); // Update count only if it's a valid number and greater than 0
            setError(""); // Clear error message

            // Initialize assignments array with empty objects for each assignment
            setAssignments(Array.from({ length: value }, () => ({
                title: "",
                description: "",
                deadline: "",
                members: [],
            })));
        } else {
            setCount(0); // Reset count to 0 for invalid input
            setAssignments([]); // Clear assignments array
            setError("Please enter a valid number greater than 0."); // Set error message
        }
    };

    const handleAssignmentChange = (index, field, value) => {
        const updatedAssignments = [...assignments];
        updatedAssignments[index][field] = value; // Update the specific field for the assignment
        setAssignments(updatedAssignments); // Update the state
    };

    return (
        <div className="container">
            {/* Input for number of assignments */}
            <div className="row justify-content-center mt-3">
                <div className="col-auto">
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Choose number of assignments"
                        onChange={handleInputChange}
                    />
                    {error && <small className="text-danger">{error}</small>} {/* Display error message */}
                </div>
            </div>

            {/* Render assignments dynamically */}
            {count > 0 && (
                assignments.map((assignment, index) => (
                    <div key={index} className="row align-items-center mb-3">
                        {/* Left Section: Assignment Input */}
                        <div className="col">
                            {/* Assignment Title */}
                            <div className="mb-2">
                                <label htmlFor={`assignment-title-${index}`} className="form-label">Assignment Title</label>
                                <input
                                    type="text"
                                    id={`assignment-title-${index}`}
                                    className="form-control"
                                    placeholder="Enter assignment title"
                                    value={assignment.title}
                                    onChange={(e) => handleAssignmentChange(index, "title", e.target.value)}
                                />
                            </div>

                            {/* Assignment Description */}
                            <div className="mb-2">
                                <label htmlFor={`assignment-description-${index}`} className="form-label">Assignment Description</label>
                                <textarea
                                    id={`assignment-description-${index}`}
                                    className="form-control"
                                    placeholder="Enter assignment description"
                                    value={assignment.description}
                                    onChange={(e) => handleAssignmentChange(index, "description", e.target.value)}
                                ></textarea>
                            </div>

                            {/* Assignment Deadline */}
                            <div className="mb-2">
                                <label htmlFor={`assignment-deadline-${index}`} className="form-label">Assignment Deadline</label>
                                <input
                                    type="date"
                                    id={`assignment-deadline-${index}`}
                                    className="form-control"
                                    value={assignment.deadline}
                                    onChange={(e) => handleAssignmentChange(index, "deadline", e.target.value)}
                                />
                            </div>

                            {/* Assignment Members */}
                            <div className="mb-2">
                                <label htmlFor={`assignment-members-${index}`} className="form-label">Assignment Members</label>
                                <select
                                    id={`assignment-members-${index}`}
                                    className="form-select"
                                    multiple
                                    value={assignment.members}
                                    onChange={(e) => {
                                        const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
                                        handleAssignmentChange(index, "members", selectedOptions);
                                    }}
                                >
                                    <option value="member1">Member 1</option>
                                    <option value="member2">Member 2</option>
                                    <option value="member3">Member 3</option>
                                </select>
                            </div>
                        </div>

                        {/* Right Section: Status, Bug Report*/}
                        <div className="col-auto text-end">
                            {/* Assignment Status */}
                            <div className="mb-2">
                                <label htmlFor={`assignment-status-${index}`} className="form-label">Status</label>
                                <select
                                    id={`assignment-status-${index}`}
                                    className="form-select"
                                >
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>

                            {/* Report Bug */}
                            <div className="mb-2">
                                <button className="btn btn-warning">Report Bug</button>
                                {/* This button opens a an another page for bug reporting */}
                            </div>

                            
                        </div>
                        {/* Finish Create Assignments */}
                        <div className="mb-2">
                                <button className="btn btn-success">Finish</button>
                                {/* This button sends data to DB API */}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default ProjectCreation2;