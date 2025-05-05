import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjectsAsTeamLeader, getProjectsAsMember, getAllProjects } from '../services/database_queries_BE';

function MainPage({ adminStatus }) {
    const navigate = useNavigate();
    const [teamLeaderProjects, setTeamLeaderProjects] = useState([]);
    const [teamMemberProjects, setTeamMemberProjects] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [filteredAdminProjects, setFilteredAdminProjects] = useState([]);
    const [filteredLeaderProjects, setFilteredLeaderProjects] = useState([]);
    const [filteredMemberProjects, setFilteredMemberProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [adminFilters, setAdminFilters] = useState({
        search: '',
        status: '',
        priority: '',
        startDate: '',
        endDate: '',
        finishedDate: '',
        leader: '',
    });

    const [leaderFilters, setLeaderFilters] = useState({
        search: '',
        status: '',
        priority: '',
        startDate: '',
        endDate: '',
        finishedDate: '',
    });

    const [memberFilters, setMemberFilters] = useState({
        search: '',
        status: '',
        priority: '',
        startDate: '',
        endDate: '',
        finishedDate: '',
    });

    // Normalize the date to midnight (local time)
    const normalizeDate = (date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    };

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                if (adminStatus) {
                    const projects = await getAllProjects();
                    setAllProjects(projects);
                } else {
                    const [leaderProjects, memberProjects] = await Promise.all([
                        getProjectsAsTeamLeader(),
                        getProjectsAsMember(),
                    ]);
                    setTeamLeaderProjects(leaderProjects);
                    setTeamMemberProjects(memberProjects);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProjects();
    }, [adminStatus]);

    const handleCreateProject = () => {
        navigate("/create", { state: { project_id: null } });
    };

    const handleProjectClick = (projectId, isTeamLeader = false) => {
        navigate("/project", { state: { project_id: projectId, isTeamLeader } });
    };

    const handleAdminFilterChange = (e) => {
        const { name, value } = e.target;
        setAdminFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleLeaderFilterChange = (e) => {
        const { name, value } = e.target;
        setLeaderFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleMemberFilterChange = (e) => {
        const { name, value } = e.target;
        setMemberFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    useEffect(() => {
        // Filter Admin Projects
        let adminProjects = [...allProjects];

        if (adminFilters.search) {
            adminProjects = adminProjects.filter((project) =>
                project.project_title.toLowerCase().includes(adminFilters.search.toLowerCase())
            );
        }

        if (adminFilters.status) {
            adminProjects = adminProjects.filter((project) => project.status_name === adminFilters.status);
        }

        if (adminFilters.priority) {
            adminProjects = adminProjects.filter((project) => project.priority_name === adminFilters.priority);
        }

        if (adminFilters.startDate) {
            adminProjects = adminProjects.filter(
                (project) => normalizeDate(project.start_time) >= normalizeDate(adminFilters.startDate)
            );
        }

        if (adminFilters.endDate) {
            adminProjects = adminProjects.filter(
                (project) => normalizeDate(project.end_time) <= normalizeDate(adminFilters.endDate)
            );
        }

        if (adminFilters.finishedDate) {
            adminProjects = adminProjects.filter(
                (project) =>
                    project.finished_time && normalizeDate(project.finished_time) === normalizeDate(adminFilters.finishedDate)
            );
        }

        if (adminFilters.leader) {
            adminProjects = adminProjects.filter((project) =>
                project.leader_name.toLowerCase().includes(adminFilters.leader.toLowerCase())
            );
        }

        setFilteredAdminProjects(adminProjects);

        // Filter Team Leader Projects
        let leaderProjects = [...teamLeaderProjects];

        if (leaderFilters.search) {
            leaderProjects = leaderProjects.filter((project) =>
                project.project_title.toLowerCase().includes(leaderFilters.search.toLowerCase())
            );
        }

        if (leaderFilters.status) {
            leaderProjects = leaderProjects.filter((project) => project.status_name === leaderFilters.status);
        }

        if (leaderFilters.priority) {
            leaderProjects = leaderProjects.filter((project) => project.priority_name === leaderFilters.priority);
        }

        if (leaderFilters.startDate) {
            leaderProjects = leaderProjects.filter(
                (project) => normalizeDate(project.start_time) >= normalizeDate(leaderFilters.startDate)
            );
        }

        if (leaderFilters.endDate) {
            leaderProjects = leaderProjects.filter(
                (project) => normalizeDate(project.end_time) <= normalizeDate(leaderFilters.endDate)
            );
        }

        if (leaderFilters.finishedDate) {
            leaderProjects = leaderProjects.filter(
                (project) =>
                    project.finished_time && normalizeDate(project.finished_time) === normalizeDate(leaderFilters.finishedDate)
            );
        }

        setFilteredLeaderProjects(leaderProjects);

        // Filter Team Member Projects
        let memberProjects = [...teamMemberProjects];

        if (memberFilters.search) {
            memberProjects = memberProjects.filter((project) =>
                project.project_title.toLowerCase().includes(memberFilters.search.toLowerCase())
            );
        }

        if (memberFilters.status) {
            memberProjects = memberProjects.filter((project) => project.status_name === memberFilters.status);
        }

        if (memberFilters.priority) {
            memberProjects = memberProjects.filter((project) => project.priority_name === memberFilters.priority);
        }

        if (memberFilters.startDate) {
            memberProjects = memberProjects.filter(
                (project) => normalizeDate(project.start_time) >= normalizeDate(memberFilters.startDate)
            );
        }

        if (memberFilters.endDate) {
            memberProjects = memberProjects.filter(
                (project) => normalizeDate(project.end_time) <= normalizeDate(memberFilters.endDate)
            );
        }

        if (memberFilters.finishedDate) {
            memberProjects = memberProjects.filter(
                (project) =>
                    project.finished_time && normalizeDate(project.finished_time) === normalizeDate(memberFilters.finishedDate)
            );
        }

        setFilteredMemberProjects(memberProjects);
    }, [adminFilters, leaderFilters, memberFilters, allProjects, teamLeaderProjects, teamMemberProjects]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            {/* Create Project Button */}
            <div className="row justify-content-center mt-5">
                <div className="col-auto">
                    <button className="btn btn-primary" onClick={handleCreateProject}>
                        Create Project
                    </button>
                </div>
            </div>
            <div className="row mt-5">
                <div className="col">
                    <hr />
                </div>
            </div>

            {/* Admin View */}
            {adminStatus && (
                <div>
                    <h3>All Projects</h3>
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <label>Search by Project Name</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter project name"
                                name="search"
                                value={adminFilters.search}
                                onChange={handleAdminFilterChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <label>Filter by Status</label>
                            <select
                                className="form-select"
                                name="status"
                                value={adminFilters.status}
                                onChange={handleAdminFilterChange}
                            >
                                <option value="">All Statuses</option>
                                <option value="Ongoing">Ongoing</option>
                                <option value="Ongoing After Deadline">Ongoing After Deadline</option>
                                <option value="Finished In Time">Finished In Time</option>
                                <option value="Finished After Deadline">Finished After Deadline</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label>Filter by Priority</label>
                            <select
                                className="form-select"
                                name="priority"
                                value={adminFilters.priority}
                                onChange={handleAdminFilterChange}
                            >
                                <option value="">All Priorities</option>
                                <option value="Low">Low</option>
                                <option value="Lower">Lower</option>
                                <option value="Middle">Middle</option>
                                <option value="Higher">Higher</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label>Search by Leader</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter leader name"
                                name="leader"
                                value={adminFilters.leader}
                                onChange={handleAdminFilterChange}
                            />
                        </div>
                    </div>
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <label>Filter by Start Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="startDate"
                                value={adminFilters.startDate}
                                onChange={handleAdminFilterChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <label>Filter by End Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="endDate"
                                value={adminFilters.endDate}
                                onChange={handleAdminFilterChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <label>Filter by Finished Date</label>
                            <input
                                type="date"
                                className="form-control"
                                name="finishedDate"
                                value={adminFilters.finishedDate}
                                onChange={handleAdminFilterChange}
                            />
                        </div>
                    </div>
                    <ul>
                        {filteredAdminProjects.map((project) => (
                            <li
                                key={project.Project_id}
                                onClick={() => handleProjectClick(project.Project_id)}
                                style={{ cursor: "pointer" }}
                            >
                                <strong>Title:</strong> {project.project_title} <br />
                                <strong>Description:</strong> {project.project_description} <br />
                                <strong>Start Time:</strong> {new Date(project.start_time).toLocaleDateString()} <br />
                                <strong>End Time:</strong> {new Date(project.end_time).toLocaleDateString()} <br />
                                <strong>Finished Time:</strong> {project.finished_time ? new Date(project.finished_time).toLocaleDateString() : "Not Finished"} <br />
                                <strong>Priority:</strong> {project.priority_name} <br />
                                <strong>Status:</strong> {project.status_name} <br />
                                <strong>Leader:</strong> {project.leader_name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Non-Admin View */}
            {!adminStatus && (
                <>
                    {/* Team Leader Projects */}
                    <div>
                        <h3>Team Leader Projects</h3>
                        {/* Filters for Team Leader Projects */}
                        <div className="row mb-4">
                            <div className="col-md-3">
                                <label>Search by Project Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter project name"
                                    name="search"
                                    value={leaderFilters.search}
                                    onChange={handleLeaderFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label>Filter by Status</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={leaderFilters.status}
                                    onChange={handleLeaderFilterChange}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Ongoing After Deadline">Ongoing After Deadline</option>
                                    <option value="Finished In Time">Finished In Time</option>
                                    <option value="Finished After Deadline">Finished After Deadline</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label>Filter by Priority</label>
                                <select
                                    className="form-select"
                                    name="priority"
                                    value={leaderFilters.priority}
                                    onChange={handleLeaderFilterChange}
                                >
                                    <option value="">All Priorities</option>
                                    <option value="Low">Low</option>
                                    <option value="Lower">Lower</option>
                                    <option value="Middle">Middle</option>
                                    <option value="Higher">Higher</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label>Filter by Start Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="startDate"
                                    value={leaderFilters.startDate}
                                    onChange={handleLeaderFilterChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-3">
                                <label>Filter by End Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="endDate"
                                    value={leaderFilters.endDate}
                                    onChange={handleLeaderFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label>Filter by Finished Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="finishedDate"
                                    value={leaderFilters.finishedDate}
                                    onChange={handleLeaderFilterChange}
                                />
                            </div>
                        </div>
                        <ul>
                            {filteredLeaderProjects.map((project) => (
                                <li
                                    key={project.Project_id}
                                    onClick={() => handleProjectClick(project.Project_id, true)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <strong>Title:</strong> {project.project_title} <br />
                                    <strong>Description:</strong> {project.project_description} <br />
                                    <strong>Start Time:</strong> {new Date(project.start_time).toLocaleDateString()} <br />
                                    <strong>End Time:</strong> {new Date(project.end_time).toLocaleDateString()} <br />
                                    <strong>Finished Time:</strong> {project.finished_time ? new Date(project.finished_time).toLocaleDateString() : "Not Finished"} <br />
                                    <strong>Priority:</strong> {project.priority_name} <br />
                                    <strong>Status:</strong> {project.status_name} <br />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Team Member Projects */}
                    <div>
                        <h3>Team Member Projects</h3>
                        {/* Filters for Team Member Projects */}
                        <div className="row mb-4">
                            <div className="col-md-3">
                                <label>Search by Project Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter project name"
                                    name="search"
                                    value={memberFilters.search}
                                    onChange={handleMemberFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label>Filter by Status</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={memberFilters.status}
                                    onChange={handleMemberFilterChange}
                                >
                                    <option value="">All Statuses</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Ongoing After Deadline">Ongoing After Deadline</option>
                                    <option value="Finished In Time">Finished In Time</option>
                                    <option value="Finished After Deadline">Finished After Deadline</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label>Filter by Priority</label>
                                <select
                                    className="form-select"
                                    name="priority"
                                    value={memberFilters.priority}
                                    onChange={handleMemberFilterChange}
                                >
                                    <option value="">All Priorities</option>
                                    <option value="Low">Low</option>
                                    <option value="Lower">Lower</option>
                                    <option value="Middle">Middle</option>
                                    <option value="Higher">Higher</option>
                                    <option value="High">High</option>
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label>Filter by Start Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="startDate"
                                    value={memberFilters.startDate}
                                    onChange={handleMemberFilterChange}
                                />
                            </div>
                        </div>
                        <div className="row mb-4">
                            <div className="col-md-3">
                                <label>Filter by End Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="endDate"
                                    value={memberFilters.endDate}
                                    onChange={handleMemberFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label>Filter by Finished Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="finishedDate"
                                    value={memberFilters.finishedDate}
                                    onChange={handleMemberFilterChange}
                                />
                            </div>
                        </div>
                        <ul>
                            {filteredMemberProjects.map((project) => (
                                <li
                                    key={project.Project_id}
                                    onClick={() => handleProjectClick(project.Project_id, false)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <strong>Title:</strong> {project.project_title} <br />
                                    <strong>Description:</strong> {project.project_description} <br />
                                    <strong>Start Time:</strong> {new Date(project.start_time).toLocaleDateString()} <br />
                                    <strong>End Time:</strong> {new Date(project.end_time).toLocaleDateString()} <br />
                                    <strong>Finished Time:</strong> {project.finished_time ? new Date(project.finished_time).toLocaleDateString() : "Not Finished"} <br />
                                    <strong>Priority:</strong> {project.priority_name} <br />
                                    <strong>Status:</strong> {project.status_name} <br />
                                    <strong>Leader:</strong> {project.leader_name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}

export default MainPage;