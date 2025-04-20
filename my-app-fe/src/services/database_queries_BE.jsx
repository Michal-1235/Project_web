function getdata_ProjectCreation1() {
    return Promise.resolve(true);
}

function submit_ProjectCreation1() {
    return Promise.resolve(true);
}

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


//export {addMessage, getMessages, clearMessages};
export {
    getdata_ProjectCreation1,
    submit_ProjectCreation1,
    getdata_ProjectCreation2,
    submit_ProjectCreation2,
    checkUserExists,
    registerUser
};

