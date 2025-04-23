
function getdata_ProjectCreation2(Project_id) {
    return fetch(`/api/project_creation2?project_id=${encodeURIComponent(Project_id)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (response.status === 401) {
            throw new Error("Unauthorized");
        }
        if (!response.ok) {
            throw new Error(`Failed to fetch project creation data: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        const { assignments, members, deadline } = data;
        return { assignments, members, deadline };
    })
    .catch((error) => {
        console.error("Error fetching project creation 2 data:", error);
        throw new Error("Error communicating with server");
    });
}


function submit_ProjectCreation2(Project_id, assignments) {
    console.log(Project_id, assignments); // Debugging line to check project_id and assignments
    return fetch("/api/project_creation2", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            project_id: Project_id,
            assignments: assignments
        }),
    })
    .then((response) => {
        if (response.status === 401) {
            throw new Error("Unauthorized");
        }
        if (!response.ok) {
            throw new Error("Failed to submit assignments");
        }
        return response.json();
    })
    .then((result) => {
        console.log("Assignments submitted successfully:", result);
        return result;
    })
    .catch((error) => {
        console.error("Error submitting assignments:", error);
        throw new Error("Error communicating with server");
    });
}



function registerUser(data) {
    return fetch("/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    .then((response) => {
        if (response.status === 200) {
            console.log("Registration successful!");
            return;
        }
        else if (response.status === 500) {
            throw new Error("Error at server side");
        } else {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    })
    .catch((error) => {
        console.error("Error during fetch:", error); // Log the error
        throw new Error("Error communicating with server");
    });
}

function checkUserExists(username) {

    return fetch(`/api/register?username=${encodeURIComponent(username)}`)
        .then((response) => {
            if (response.status === 200) {
                return true; // User already exists
            } else if (response.status === 404) {
                return false; // User does not exist
            } else if (response.status === 400) {
                throw new Error("Username query parameter is missing");
            } else if (response.status === 500) {
                throw new Error("Error at server side");
            } else {
                throw new Error(`Unexpected status code: ${response.status}`);
            }
        })
        .catch((error) => {
            console.error("Error during fetch:", error); // Log the error
            throw new Error("Error communicating with server");
        });
}



function getdata_ProjectCreation1(Project_id) {
    

    // Include Project_id as a query parameter if it exists
    const url = Project_id ? `/api/project_creation1?project_id=${encodeURIComponent(Project_id)}` : "/api/project_creation1";

    return fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error("Unauthorized"); // Throw specific error for 401
            }
            if (!response.ok) {
                throw new Error(`Failed to fetch project creation data: ${response.status}`);
            }
            return response.json(); // Parse the JSON response
        })
        .then((data) => {
            const { teamMembers, project } = data; // project is empty if no project_id is provided
            return { teamMembers, project }; // Return all relevant data
        })
        .catch((error) => {
            console.error("Error fetching project creation data:", error);
            throw new Error("Error communicating with server");
        });
}

function submit_ProjectCreation1(projectData, Project_id) {

    // Submit the project data to the backend
    return fetch("/api/project_creation1", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
    })
        .then((response) => {
            if (response.status === 401) {
                throw new Error("Unauthorized"); // Throw specific error for 401
            }
            if (!response.ok) {
                throw new Error("Failed to submit project data");
            }
            return response.json();
        })
        .then((result) => {
            console.log("Project submitted successfully:", result);
            return result;
        })
        .catch((error) => {
            console.error("Error submitting project data:", error);
            throw new Error("Error communicating with server");
        });
}


// NOT IMPLEMENTED YET


// Fetch projects where the current user is the team leader
function getProjectsAsTeamLeader() {
    return fetch('/api/projects/teamleader', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (response.status === 401) throw new Error("Unauthorized");
        if (!response.ok) throw new Error("Failed to fetch team leader projects");
        return response.json();
    })
    .then(data => data.projects)
    .catch((error) => {
        console.error("Error fetching team leader projects:", error);
        throw new Error("Error communicating with server");
    });
}

// Fetch projects where the current user is a member
function getProjectsAsMember() {
    return fetch('/api/projects/member', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (response.status === 401) throw new Error("Unauthorized");
        if (!response.ok) throw new Error("Failed to fetch member projects");
        return response.json();
    })
    .then(data => data.projects)
    .catch((error) => {
        console.error("Error fetching member projects:", error);
        throw new Error("Error communicating with server");
    });
}

// Fetch all projects (admin-only)
function getAllProjects() {
    return fetch('/api/projects/all', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (response.status === 401) throw new Error("Unauthorized");
        if (!response.ok) throw new Error("Failed to fetch all projects");
        return response.json();
    })
    .then(data => data.projects)
    .catch((error) => {
        console.error("Error fetching all projects:", error);
        throw new Error("Error communicating with server");
    });
}

// Fetch taken assignments for a project
function getTakenAssignments(project_id) {
    return fetch(`/api/assignments/taken?project_id=${encodeURIComponent(project_id)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (response.status === 401) throw new Error("Unauthorized");
        if (!response.ok) throw new Error("Failed to fetch taken assignments");
        return response.json();
    })
    .then(data => data.assignments)
    .catch((error) => {
        console.error("Error fetching taken assignments:", error);
        throw new Error("Error communicating with server");
    });
}

// Fetch available assignments for a project
function getNotTakenAssignments(project_id) {
    return fetch(`/api/assignments/available?project_id=${encodeURIComponent(project_id)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (response.status === 401) throw new Error("Unauthorized");
        if (!response.ok) throw new Error("Failed to fetch available assignments");
        return response.json();
    })
    .then(data => data.assignments)
    .catch((error) => {
        console.error("Error fetching available assignments:", error);
        throw new Error("Error communicating with server");
    });
}

// Fetch all assignments for a project
function getAllAssignments(project_id) {
    return fetch(`/api/assignments/all?project_id=${encodeURIComponent(project_id)}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
    .then((response) => {
        if (response.status === 401) throw new Error("Unauthorized");
        if (!response.ok) throw new Error("Failed to fetch all assignments");
        return response.json();
    })
    .then(data => data.assignments)
    .catch((error) => {
        console.error("Error fetching all assignments:", error);
        throw new Error("Error communicating with server");
    });
}

// Change project team leader
function changeProjectTeamLeader(project_id, new_leader_id) {
    return fetch('/api/projects/change-teamleader', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            project_id,
            new_leader_id
        }),
    })
    .then((response) => {
        if (response.status === 401) throw new Error("Unauthorized");
        if (!response.ok) throw new Error("Failed to change team leader");
        return response.json();
    })
    .then(data => data.success)
    .catch((error) => {
        console.error("Error changing team leader:", error);
        throw new Error("Error communicating with server");
    });
}

// Report assignment completion
function reportAssignmentCompletion(assignment_id, description) {
    return fetch('/api/assignments/complete', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            assignment_id,
            description
        }),
    })
    .then((response) => {
        if (response.status === 401) throw new Error("Unauthorized");
        if (!response.ok) throw new Error("Failed to report completion");
        return response.json();
    })
    .then(data => data.success)
    .catch((error) => {
        console.error("Error reporting completion:", error);
        throw new Error("Error communicating with server");
    });
}

// Report a bug as a parent assignment
function reportBug(project_id, parent_assignment_id, bugData) {
    return fetch('/api/assignments/report-bug', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            project_id,
            parent_assignment_id,
            ...bugData
        }),
    })
    .then((response) => {
        if (response.status === 401) throw new Error("Unauthorized");
        if (!response.ok) throw new Error("Failed to report bug");
        return response.json();
    })
    .then(data => data.newAssignment)
    .catch((error) => {
        console.error("Error reporting bug:", error);
        throw new Error("Error communicating with server");
    });
}

// Add these to the existing export block
export {
    getdata_ProjectCreation1,
    submit_ProjectCreation1,
    getdata_ProjectCreation2,
    submit_ProjectCreation2,
    checkUserExists,
    registerUser,
    /*
    getProjectsAsTeamLeader,
    getProjectsAsMember,
    getAllProjects,
    getTakenAssignments,
    getNotTakenAssignments,
    getAllAssignments,
    changeProjectTeamLeader,
    reportAssignmentCompletion,
    reportBug*/
};

export {
};

