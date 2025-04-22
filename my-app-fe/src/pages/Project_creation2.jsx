import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getdata_ProjectCreation2,
  submit_ProjectCreation2
} from "../services/database_queries_BE";

function ProjectCreation2() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState([]);
  const [members, setMembers] = useState([]);
  const [projectDeadline, setProjectDeadline] = useState("");
  const [count, setCount] = useState(0);
  const [minCount, setMinCount] = useState(0);
  const [error, setError] = useState("");
  const location = useLocation(); 
  const Project_id = location.state?.project_id; // Get project ID from state 
  console.log("Project ID:", Project_id); // Debugging line to check the project ID

  // Function to convert ISO string to YYYY-MM-DD format and add one day
  const formatDateForInput = (isoString, offsetDays = 1) => {
  const date = new Date(isoString); // Parse ISO string into Date object
  date.setDate(date.getDate() + offsetDays); // Add offset (1 day by default)
  return date.toISOString().split('T')[0]; // Extract only the date part (YYYY-MM-DD)
 };

  useEffect(() => {

    if (!Project_id) {
        alert("Missing project ID");
        navigate("/main");
        return;
      }

    async function fetchData() {
      try {
        const data = await getdata_ProjectCreation2(Project_id);
        console.log("Fetched data:", data); // Debugging line to check fetched data
        const fetchedAssignments = data.assignments || [];
        const fetchedMembers = data.members || [];
        const deadline = data.deadline|| "";

        setAssignments(fetchedAssignments);
        setCount(fetchedAssignments.length);
        setMinCount(fetchedAssignments.length);
        setMembers(fetchedMembers);
        setProjectDeadline(deadline);
      } catch (err) {
        console.error("Error loading data:", err);
        alert("Failed to load data. Please try again later.");
        navigate("/main");
      }
    }
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    if (!isNaN(value) && value >= minCount) {
      setCount(value);
      setError("");

      setAssignments((prev) => {
        if (value > prev.length) {
          return [
            ...prev,
            ...Array.from({ length: value - prev.length }, () => ({
              title: "",
              description: "",
              deadline: "",
              members: [],
              status: "Not Created"
            })),
          ];
        } else {
          return prev.slice(0, value);
        }
      });
    } else {
      setError(`Please enter a number ≥ ${minCount}.`);
    }
  };

  const handleAssignmentChange = (index, field, value) => {
    const updated = [...assignments];
    updated[index][field] = value;
    setAssignments(updated);
  };

  const handleSubmit = async () => {
    const issues = assignments
      .map((a, i) => {
        if (!a.title || !a.description || !a.deadline || a.members.length === 0)
          return `Assignment ${i + 1} is incomplete`;
        if (a.deadline > formatDateForInput(projectDeadline))
          return `Assignment ${i + 1} deadline exceeds project deadline`;
        return null;
      })
      .filter(Boolean);

    if (issues.length > 0) {
      alert("Please fix the following:\n" + issues.join("\n"));
      return;
    }

    try {
      await submit_ProjectCreation2(assignments,Project_id);
      alert("Assignments submitted successfully.");
      navigate("/main");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit assignments.");
    }
  };

  return (
    <div className="container">
      <p>Choose number of assignments:</p>
      <div className="row justify-content-center mt-3">
        <div className="col-auto">
          <input
            type="number"
            className="form-control"
            placeholder="Number"
            value={count}
            onChange={handleInputChange}
            min={minCount}
          />
          {error && <small className="text-danger">{error}</small>}
        </div>
      </div>

      {assignments.slice(0, count).map((assignment, index) => (
        <div key={index} className="row align-items-center mb-3">
          <div className="col">
            <div className="mb-2">
              <label className="form-label">Assignment Title</label>
              <input
                type="text"
                className="form-control"
                value={assignment.title}
                onChange={(e) => handleAssignmentChange(index, "title", e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Assignment Description</label>
              <textarea
                className="form-control"
                value={assignment.description}
                onChange={(e) => handleAssignmentChange(index, "description", e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Assignment Deadline</label>
              <input
                type="date"
                className="form-control"
                max={projectDeadline ? formatDateForInput(projectDeadline) : ""} // Dynamically set max
                value={assignment.deadline}
                onChange={(e) => handleAssignmentChange(index, "deadline", e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Assignment Members</label>
              <select
                className="form-select"
                multiple
                value={assignment.members}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
                  handleAssignmentChange(index, "members", selected);
                }}
              >
                {members.map((m) => (
                  <option key={m.Project_Team_Member_id} value={m.Project_Team_Member_id}>{m.username}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-auto text-end">
            <div className="mb-2">
              <label className="form-label">Status</label>
              <p className="text-success">{assignment.status}</p>
            </div>
            {(assignment.status === "Finished before deadline" || assignment.status === "Finished after deadline") && (
              <div className="mb-2">
                <button className="btn btn-warning">Report Bug</button>
              </div>
            )}
          </div>
          <hr />
        </div>
      ))}

      {count > 0 && (
        <div className="mb-2 text-center">
          <button className="btn btn-success" onClick={handleSubmit}>Finish</button>
        </div>
      )}
    </div>
  );
}

export default ProjectCreation2;
