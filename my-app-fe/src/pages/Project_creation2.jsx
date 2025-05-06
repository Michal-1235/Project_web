import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { format, addDays, parseISO } from "date-fns";
import {
  getdata_ProjectCreation2,
  submit_ProjectCreation2,
} from "../services/database_queries_BE";

function ProjectCreation2() {
  const navigate = useNavigate();
  const location = useLocation();
  const Project_id = location.state?.project_id; // Get project ID from state

  const [assignments, setAssignments] = useState([]);
  const [members, setMembers] = useState([]);
  const [projectDeadline, setProjectDeadline] = useState("");
  const [count, setCount] = useState(0);
  const [minCount, setMinCount] = useState(0);
  const [error, setError] = useState("");
  const [isFetched, setIsFetched] = useState(false); // Track if assignments are fetched
  const [loading, setLoading] = useState(true); // Track loading state

  // Format date for input fields (YYYY-MM-DD)
  const formatDateForInput = (isoString) => format(new Date(isoString), 'yyyy-MM-dd');

  // Get tomorrow's date
  const getTomorrowDate = () => format(addDays(new Date(), 1), "yyyy-MM-dd");

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

        const fetchedAssignments = (data.assignments || []).map((assignment) => ({
          id: assignment.Assignment_id,
          title: assignment.assignment_title,
          description: assignment.assignment_description,
          deadline: assignment.end_time ? formatDateForInput(assignment.end_time) : "",
          members: assignment.members.map((member) => member.Project_Team_Member_id),
          status: assignment.status_name,
          type: assignment.type_name,
          start_time: assignment.start_time ? formatDateForInput(assignment.start_time) : "",
          finished_time: assignment.finished_time ? formatDateForInput(assignment.finished_time) : "",
        }));

        const fetchedMembers = data.members || [];
        const deadline = data.deadline || "";

        setAssignments(fetchedAssignments);
        setCount(fetchedAssignments.length);
        setMinCount(fetchedAssignments.length);
        setMembers(fetchedMembers);
        setProjectDeadline(deadline);
        setIsFetched(fetchedAssignments.length > 0); // Set isFetched based on whether assignments exist
      } catch (err) {
        console.error("Error loading data:", err);
        alert("Failed to load data. Please try again later.");
        navigate("/main");
      } finally {
        setLoading(false); // Stop loading after data is fetched
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
              status: "Not Created",
              type: "Not Created",
              start_time: "",
              finished_time: null,
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
    if (field === "members") {
      // Convert selected member IDs to integers
      updated[index][field] = value.map((v) => parseInt(v, 10));
    } else {
      updated[index][field] = value;
    }
    setAssignments(updated);
  };

  const handleSaveChanges = async () => {
    const issues = assignments
        .map((a, i) => {
            if (!a.title || !a.description || !a.deadline) {
                return `Assignment ${i + 1} is incomplete`;
            }
            // Skip deadline validation for assignments of type "Bug" or finished assignments
            if (
                a.type !== "Bug" &&
                a.status !== "Finished In Time" &&
                a.status !== "Finished After Deadline" &&
                a.deadline > formatDateForInput(projectDeadline)
            ) {
                return `Assignment ${i + 1} deadline exceeds project deadline`;
            }
            return null;
        })
        .filter(Boolean);

    if (issues.length > 0) {
        alert("Please fix the following:\n" + issues.join("\n"));
        return;
    }

    try {
        await submit_ProjectCreation2(Project_id, assignments);
        alert("Changes saved successfully.");
        navigate("/project", { state: { project_id: Project_id } });
    } catch (err) {
        console.error("Save error:", err);
        alert("Failed to save changes.");
    }
};

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleFinish = async () => {
    try {
      await submit_ProjectCreation2(Project_id, assignments);
      alert("Assignments submitted successfully.");
      navigate("/main");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Failed to submit assignments.");
    }
  };

  const handleReportBug = (assignmentId,project_id) => {
    navigate('/bug', { state: { project_id, Assignment_id: assignmentId } });
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading data, please wait...</p>
      </div>
    );
  }

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
                disabled={
                  assignment.status === "Finished In Time" ||
                  assignment.status === "Finished After Deadline"
                }
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Assignment Description</label>
              <textarea
                className="form-control"
                value={assignment.description}
                onChange={(e) => handleAssignmentChange(index, "description", e.target.value)}
                disabled={
                  assignment.status === "Finished In Time" ||
                  assignment.status === "Finished After Deadline"
                }
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Assignment Deadline</label>
              <input
                type="date"
                className="form-control"
                max={assignment.type !== "Bug" && projectDeadline ? formatDateForInput(projectDeadline) : ""}
                min={getTomorrowDate()}
                value={assignment.deadline}
                onChange={(e) => handleAssignmentChange(index, "deadline", e.target.value)}
                disabled={
                  assignment.status === "Finished In Time" ||
                  assignment.status === "Finished After Deadline"
                }
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Assignment Members</label>
              <select
                className="form-select"
                multiple
                value={assignment.members}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                  handleAssignmentChange(index, "members", selected);
                }}
                disabled={
                  assignment.status === "Finished In Time" ||
                  assignment.status === "Finished After Deadline"
                }
              >
                {members.map((m) => (
                  <option key={m.Project_Team_Member_id} value={m.Project_Team_Member_id}>
                    {m.username}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-auto text-end">
            <div className="mb-2">
              <label className="form-label">Status</label>
              <p className="text-success">{assignment.status}</p>
            </div>
            <div className="mb-2">
              <label className="form-label">Type</label>
              <p className="text-info">{assignment.type || "General"}</p>
            </div>
            <div className="mb-2">
              <label className="form-label">Start Time</label>
              <p className="text-muted">
                {assignment.start_time ? formatDateForInput(assignment.start_time) : "Not Started"}
              </p>
            </div>
            <div className="mb-2">
              <label className="form-label">Finished Time</label>
              <p className="text-muted">
                {assignment.finished_time
                  ? formatDateForInput(assignment.finished_time)
                  : "Not Finished"}
              </p>
            </div>
            {(assignment.status === 'Finished In Time' || assignment.status === 'Finished After Deadline') && (
              <div className="col-auto">
                <button
                  className="btn btn-danger"
                  onClick={() => handleReportBug(assignment.id,Project_id)} // Pass the assignment's id
                >
                  Report Bug
                </button>
              </div>
            )}
          </div>
          <hr />
        </div>
      ))}

      {count > 0 && (
        <div className="mb-2 text-center">
          {isFetched ? (
            <>
              <button
                className="btn btn-primary me-2"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                className="btn btn-secondary"
                onClick={handleGoBack}
              >
                Go Back
              </button>
            </>
          ) : (
            <button
              className="btn btn-success"
              onClick={handleFinish}
            >
              Finish
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectCreation2;