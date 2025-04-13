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

function checkUserExists(username) {
    return Promise.resolve(false);
}

function registerUser(username, password) {
    return Promise.resolve(true);
}

export {
    getdata_ProjectCreation1,
    submit_ProjectCreation1,
    getdata_ProjectCreation2,
    submit_ProjectCreation2,
    checkUserExists,
    registerUser
};

