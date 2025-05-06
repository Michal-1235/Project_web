import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    getdata_ProjectCreation1,
    submit_ProjectCreation1,
} from "../services/database_queries_BE";
import { format } from "date-fns";

function ProjectCreation1({ adminStatus, Account_id }) {
    const [teamTitle, setTeamTitle] = useState("");
    const [teamDescription, setTeamDescription] = useState("");
    const [teamDeadline, setTeamDeadline] = useState("");
    const [teamLeader, setTeamLeader] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [existingProject, setExistingProject] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();
    const { state } = useLocation();
    const Project_id = state?.project_id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { teamMembers: members, project } = await getdata_ProjectCreation1(Project_id);
                console.log("Fetched team data:", members);
                console.log("Fetched project data:", project);

                setTeamData(members);

                if (project) {
                    setExistingProject(true);
                    setTeamTitle(project.title);
                    setTeamDescription(project.description);
                    setTeamDeadline(format(new Date(project.deadline), "yyyy-MM-dd"));
                    setTeamLeader(project.leader.toString());
                    setTeamMembers(project.members.map(m => m.id.toString()));
                } else {
                    if (adminStatus) {
                        const firstId = members[0]?.id?.toString() || "";
                        setTeamLeader(firstId);
                        setTeamMembers([firstId]);
                    } else {
                        setTeamMembers([Account_id.toString()]);
                    }
                }
            } catch (error) {
                console.error("Fetch error:", error);
                if (error.message === "Unauthorized") {
                    alert("Unauthorized access. Please log in again.");
                    navigate("/login");
                } else {
                    alert("Error fetching data. Please try again later.");
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [Project_id, adminStatus, Account_id, navigate]);

    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return format(tomorrow, "yyyy-MM-dd");
    };

    const handleSubmit = async () => {
        if (
            !teamTitle.trim() ||
            !teamDescription.trim() ||
            !teamDeadline ||
            (adminStatus && !teamLeader)
        ) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        const leaderId = adminStatus ? teamLeader : Account_id.toString();
        const membersSet = new Set(teamMembers);
        membersSet.add(leaderId);

        const projectData = {
            title: teamTitle,
            description: teamDescription,
            deadline: teamDeadline,
            members: [...membersSet],
            leader: leaderId,
            id: Project_id,
        };

        try {
            const data = await submit_ProjectCreation1(projectData);
            alert(existingProject ? "Changes saved successfully!" : "Project created successfully!");
            navigate(existingProject ? -1 : "/create2", {
                state: { project_id: data.project_id },
            });
        } catch (error) {
            console.error("Submit error:", error);
            if (error.message === "Unauthorized") {
                alert("Unauthorized access. Please log in again.");
                navigate("/login");
            } else {
                alert("Error submitting data. Please try again later.");
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="teamTitle" className="form-label">Team Title</label>
                <input
                    type="text"
                    id="teamTitle"
                    className="form-control"
                    value={teamTitle}
                    onChange={(e) => setTeamTitle(e.target.value)}
                    placeholder="Enter team title"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="teamDescription" className="form-label">Team Description</label>
                <textarea
                    id="teamDescription"
                    className="form-control"
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Enter team description"
                ></textarea>
            </div>

            <div className="mb-3">
                <label htmlFor="teamDeadline" className="form-label">Team Deadline</label>
                <input
                    type="date"
                    id="teamDeadline"
                    className="form-control"
                    value={teamDeadline}
                    onChange={(e) => setTeamDeadline(e.target.value)}
                    min={getTomorrowDate()}
                />
            </div>

            {adminStatus && (
                <div className="mb-3">
                    <label htmlFor="teamLeader" className="form-label">Team Leader</label>
                    <select
                        id="teamLeader"
                        className="form-select"
                        value={teamLeader}
                        onChange={(e) => setTeamLeader(e.target.value)}
                    >
                        {teamData.map(({ id, name }) => (
                            <option key={id} value={id.toString()}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="mb-3">
                <label htmlFor="teamMembers" className="form-label">
                    Team Members (use CTRL to select multiple)
                </label>
                <select
                    id="teamMembers"
                    className="form-select"
                    multiple
                    value={teamMembers}
                    onChange={(e) =>
                        setTeamMembers(
                            Array.from(e.target.selectedOptions, (opt) => opt.value)
                        )
                    }
                >
                    {teamData.map(({ id, name }) => (
                        <option key={id} value={id.toString()}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-3">
                <button className="btn btn-primary" onClick={handleSubmit}>
                    {existingProject ? "Save Changes" : "Create Project"}
                </button>
            </div>

            <div className="mb-3">
                <button className="btn btn-danger" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        </div>
    );
}

export default ProjectCreation1;
