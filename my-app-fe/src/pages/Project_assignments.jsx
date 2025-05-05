import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTakenAssignments, getNotTakenAssignments, getAllAssignments, getTeamLeader } from '../services/database_queries_BE';

function Project_assignments({ adminStatus, Account_id }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { project_id } = location.state || {};

    const [assignments, setAssignments] = useState([]);
    const [takenAssignments, setTakenAssignments] = useState([]);
    const [notTakenAssignments, setNotTakenAssignments] = useState([]);
    const [isTeamLeader, setIsTeamLeader] = useState(false);

    // Separate filters for taken and not taken assignments
    const [takenFilters, setTakenFilters] = useState({
        search: '',
        status: '',
        priority: '',
        startDate: '',
        endDate: '',
        finishedDate: '',
    });

    const [notTakenFilters, setNotTakenFilters] = useState({
        search: '',
        status: '',
        priority: '',
        startDate: '',
        endDate: '',
        finishedDate: '',
    });

    // Redirect to main page if project_id is null or undefined
    useEffect(() => {
        if (!project_id) {
            navigate('/');
        }
        
        const fetchProjectDetails = async () => {
            try {
                const projectDetails = await getTeamLeader(project_id);
                console.log('Project Details:', projectDetails); // Debugging line to check fetched project details
                setIsTeamLeader(projectDetails.leader_id === Account_id); // Check if the current user is the team leader
            } catch (error) {
                console.error('Error fetching project details:', error);
                alert('Error fetching project details. Redirecting to the main page.');
                navigate('/main');
            }
        };

        fetchProjectDetails();
    }, [project_id, Account_id, navigate]);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                if (adminStatus) {
                    const allAssignments = await getAllAssignments(project_id);
                    setAssignments(allAssignments);
                } else {
                    const [taken, notTaken] = await Promise.all([
                        getTakenAssignments(project_id),
                        getNotTakenAssignments(project_id),
                    ]);
                    setTakenAssignments(taken);
                    setNotTakenAssignments(notTaken);
                }
            } catch (error) {
                console.error('Error fetching assignments:', error);
            }
        };

        fetchAssignments();
    }, []);

    const handleTakenFilterChange = (e) => {
        const { name, value } = e.target;
        setTakenFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const handleNotTakenFilterChange = (e) => {
        const { name, value } = e.target;
        setNotTakenFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const normalizeDate = (date) => {
        const normalized = new Date(date);
        normalized.setHours(0, 0, 0, 0);
        return normalized;
    };

    const applyFilters = (assignments, filters) => {
        return assignments.filter((assignment) => {
            const matchesSearch = filters.search
                ? assignment.assignment_title.toLowerCase().includes(filters.search.toLowerCase())
                : true;
            const matchesStatus = filters.status ? assignment.status_name === filters.status : true;
            const matchesPriority = filters.priority ? assignment.priority_name === filters.priority : true;
            const matchesStartDate = filters.startDate
                ? normalizeDate(assignment.start_time) >= normalizeDate(filters.startDate)
                : true;
            const matchesEndDate = filters.endDate
                ? normalizeDate(assignment.end_time) <= normalizeDate(filters.endDate)
                : true;
            const matchesFinishedDate = filters.finishedDate
                ? assignment.finished_time &&
                  normalizeDate(assignment.finished_time) === normalizeDate(filters.finishedDate)
                : true;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesStartDate &&
                matchesEndDate &&
                matchesFinishedDate
            );
        });
    };

    const filteredTakenAssignments = applyFilters(takenAssignments, takenFilters);
    const filteredNotTakenAssignments = applyFilters(notTakenAssignments, notTakenFilters);

    return (
        <div className="container">
            <div className="row mt-4">
                <div className="col">
                    <h1>Project Assignments</h1>
                </div>
            </div>

            {/* Buttons */}
            <div className="row mt-3">
                {isTeamLeader && (
                    <>
                        <div className="col-auto">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/newleader', { state: { project_id } })}
                            >
                                Change Team Leader
                            </button>
                        </div>
                        <div className="col-auto">
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/create', { state: { project_id } })}
                            >
                                Edit Project
                            </button>
                        </div>
                        <div className="col-auto">
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/create2', { state: { project_id } })}
                            >
                                Edit Assignments
                            </button>
                        </div>
                    </>
                )}
                {adminStatus && (
                    <>
                        <div className="col-auto">
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/create', { state: { project_id } })}
                            >
                                Edit Project
                            </button>
                        </div>
                        <div className="col-auto">
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/create2', { state: { project_id } })}
                            >
                                Edit Assignments
                            </button>
                        </div>
                    </>
                )}
                
            </div>

            {/* Taken Assignments Section */}
            {!adminStatus && (
                <>
                    <div className="row mt-5">
                        <div className="col">
                            <h3>Taken Assignments</h3>
                            {/* Filters for Taken Assignments */}
                            <div className="row mb-4">
                                <div className="col-md-3">
                                    <label>Search by Assignment Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter assignment title"
                                        name="search"
                                        value={takenFilters.search}
                                        onChange={handleTakenFilterChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label>Filter by Status</label>
                                    <select
                                        className="form-select"
                                        name="status"
                                        value={takenFilters.status}
                                        onChange={handleTakenFilterChange}
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
                                        value={takenFilters.priority}
                                        onChange={handleTakenFilterChange}
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
                                        value={takenFilters.startDate}
                                        onChange={handleTakenFilterChange}
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
                                        value={takenFilters.endDate}
                                        onChange={handleTakenFilterChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label>Filter by Finished Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="finishedDate"
                                        value={takenFilters.finishedDate}
                                        onChange={handleTakenFilterChange}
                                    />
                                </div>
                            </div>
                            <ul>
                                {filteredTakenAssignments.map((assignment) => (
                                    <li key={assignment.Assignment_id}
                                        onClick={() => navigate('/assignment', { state: { Assignment_id: assignment.Assignment_id, project_id : project_id } })}
                                        style={{ cursor: 'pointer' }}

                                    >
                                        <strong>ID:</strong> {assignment.Assignment_id} <br />
                                        <strong>Parent Assignment ID:</strong> {assignment.parent_assignment_id || 'None'} <br />
                                        <strong>Type:</strong> {assignment.assignment_type} <br />
                                        <strong>Title:</strong> {assignment.assignment_title} <br />
                                        <strong>Description:</strong> {assignment.assignment_description} <br />
                                        <strong>Start Time:</strong> {new Date(assignment.start_time).toLocaleDateString()} <br />
                                        <strong>End Time:</strong> {new Date(assignment.end_time).toLocaleDateString()} <br />
                                        <strong>Priority:</strong> {assignment.priority_name} <br />
                                        <strong>Status:</strong> {assignment.status_name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Not Taken Assignments Section */}
                    <div className="row mt-5">
                        <div className="col">
                            <h3>Not Taken Assignments</h3>
                            {/* Filters for Not Taken Assignments */}
                            {/* Filters for Not Taken Assignments */}
                            <div className="row mb-4">
                                <div className="col-md-3">
                                    <label>Search by Assignment Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter assignment title"
                                        name="search"
                                        value={notTakenFilters.search}
                                        onChange={handleNotTakenFilterChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label>Filter by Status</label>
                                    <select
                                        className="form-select"
                                        name="status"
                                        value={notTakenFilters.status}
                                        onChange={handleNotTakenFilterChange}
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
                                        value={notTakenFilters.priority}
                                        onChange={handleNotTakenFilterChange}
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
                                        value={notTakenFilters.startDate}
                                        onChange={handleNotTakenFilterChange}
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
                                        value={notTakenFilters.endDate}
                                        onChange={handleNotTakenFilterChange}
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label>Filter by Finished Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="finishedDate"
                                        value={notTakenFilters.finishedDate}
                                        onChange={handleNotTakenFilterChange}
                                    />
                                </div>
                            </div>
                            <ul>
                                {filteredNotTakenAssignments.map((assignment) => (
                                    <li
                                        key={assignment.Assignment_id}
                                        onClick={() => navigate('/assignment', { state: { Assignment_id: assignment.Assignment_id, project_id : project_id } })}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <strong>ID:</strong> {assignment.Assignment_id} <br />
                                        <strong>Parent Assignment ID:</strong> {assignment.parent_assignment_id || 'None'} <br />
                                        <strong>Type:</strong> {assignment.assignment_type} <br />
                                        <strong>Title:</strong> {assignment.assignment_title} <br />
                                        <strong>Description:</strong> {assignment.assignment_description} <br />
                                        <strong>Start Time:</strong> {new Date(assignment.start_time).toLocaleDateString()} <br />
                                        <strong>End Time:</strong> {new Date(assignment.end_time).toLocaleDateString()} <br />
                                        <strong>Priority:</strong> {assignment.priority_name} <br />
                                        <strong>Status:</strong> {assignment.status_name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </>
            )}

            {/* Admin Section */}
            {adminStatus && (
                <div className="row mt-5">
                    <div className="col">
                        <h3>All Assignments</h3>
                        {/* Filters for All Assignments */}
                        <div className="row mb-4">
                            <div className="col-md-3">
                                <label>Search by Assignment Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter assignment title"
                                    name="search"
                                    value={takenFilters.search} // Reusing takenFilters for admin filters
                                    onChange={handleTakenFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label>Filter by Status</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={takenFilters.status} // Reusing takenFilters for admin filters
                                    onChange={handleTakenFilterChange}
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
                                    value={takenFilters.priority} // Reusing takenFilters for admin filters
                                    onChange={handleTakenFilterChange}
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
                                    value={takenFilters.startDate}
                                    onChange={handleTakenFilterChange}
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
                                    value={takenFilters.endDate}
                                    onChange={handleTakenFilterChange}
                                />
                            </div>
                            <div className="col-md-3">
                                <label>Filter by Finished Date</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    name="finishedDate"
                                    value={takenFilters.finishedDate}
                                    onChange={handleTakenFilterChange}
                                />
                            </div>
                        </div>
                        <ul>
                            {applyFilters(assignments, takenFilters).map((assignment) => (
                                <li
                                    key={assignment.Assignment_id}
                                    onClick={() => navigate('/assignment', { state: { Assignment_id: assignment.Assignment_id, project_id : project_id } })}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <strong>ID:</strong> {assignment.Assignment_id} <br />
                                    <strong>Parent Assignment ID:</strong> {assignment.parent_assignment_id || 'None'} <br />
                                    <strong>Type:</strong> {assignment.assignment_type} <br />
                                    <strong>Title:</strong> {assignment.assignment_title} <br />
                                    <strong>Description:</strong> {assignment.assignment_description} <br />
                                    <strong>Start Time:</strong> {new Date(assignment.start_time).toLocaleDateString()} <br />
                                    <strong>End Time:</strong> {new Date(assignment.end_time).toLocaleDateString()} <br />
                                    <strong>Priority:</strong> {assignment.priority_name} <br />
                                    <strong>Status:</strong> {assignment.status_name}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            <div className="col-auto">
                    <button className="btn btn-secondary" onClick={() => navigate('/main')}>
                        Go Back
                    </button>
            </div>
        </div>
    );
}

export default Project_assignments;