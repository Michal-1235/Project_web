function getdata_ProjectCreation2() {
    return Promise.resolve(true);
}

function submit_ProjectCreation2() {
    return Promise.resolve(true);
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
    return fetch("/api/projects", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
    })
        .then((response) => {
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

export {
    getdata_ProjectCreation1,
    submit_ProjectCreation1,
    getdata_ProjectCreation2,
    submit_ProjectCreation2,
    checkUserExists,
    registerUser,
};

