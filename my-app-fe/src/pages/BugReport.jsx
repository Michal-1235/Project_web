import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getTeamMembers, submitBugReport } from "../services/database_queries_BE";

function BugReport() {
  const navigate = useNavigate();
  const location = useLocation();
  const { project_id, Assignment_id } = location.state || {};

  const [bugTitle, setBugTitle] = useState("");
  const [bugDescription, setBugDescription] = useState("");
  const [bugDeadline, setBugDeadline] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  useEffect(() => {
    if (!project_id || !Assignment_id) {
      alert("Missing project or assignment ID.");
      navigate("/main");
      return;
    }

    const fetchTeamMembers = async () => {
      try {
        const members = await getTeamMembers(project_id); // Fetch team members for the project
        console.log("Fetched team members:", members); // Debugging line to check fetched data
        setTeamMembers(members);
      } catch (error) {
        console.error("Error fetching team members:", error);
        alert("Failed to load team members.");
      }
    };

    fetchTeamMembers();
  }, [project_id, Assignment_id, navigate]);

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0]; // Format as YYYY-MM-DD
  };

  const handleSubmit = async () => {
    if (!bugTitle || !bugDescription || !bugDeadline) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const bugData = {
      title: bugTitle,
      description: bugDescription,
      deadline: bugDeadline,
      members: selectedMembers,
    };
  
    try {
      await submitBugReport(project_id, Assignment_id, bugData); 
      alert("Bug report submitted successfully.");
      navigate(-1);
    } catch (error) {
      console.error("Error submitting bug report:", error);
      alert("Failed to submit bug report.");
    }
  };

  return (
    <div className="container mt-5">
      <h1>Report Bug</h1>
      <div className="row mt-4">
        <div className="col-md-6">
          <label>Parent Assignment ID</label>
          <input
            type="text"
            className="form-control"
            value={Assignment_id}
            disabled
          />
        </div>
        <div className="col-md-6">
          <label>Bug Title</label>
          <input
            type="text"
            className="form-control"
            value={bugTitle}
            onChange={(e) => setBugTitle(e.target.value)}
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-12">
          <label>Bug Description</label>
          <textarea
            className="form-control"
            rows="4"
            value={bugDescription}
            onChange={(e) => setBugDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6">
          <label>Deadline</label>
          <input
            type="date"
            className="form-control"
            min={getTomorrowDate()} // Set minimum date to tomorrow
            value={bugDeadline}
            onChange={(e) => setBugDeadline(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <label>Assign Team Members</label>
          <select
            className="form-select"
            multiple
            value={selectedMembers}
            onChange={(e) =>
              setSelectedMembers(Array.from(e.target.selectedOptions, (opt) => opt.value))
            }
          >
            {teamMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-auto">
          <button className="btn btn-success" onClick={handleSubmit}>
            Report Bug
          </button>
        </div>
        <div className="col-auto">
          <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default BugReport;