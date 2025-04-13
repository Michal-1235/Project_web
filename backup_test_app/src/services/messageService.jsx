const MESSAGES_STORAGE_KEY="messages";

let storage = localStorage;

function addMessage(message) {
    return fetch("/api/v1", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(message)
    });
}

function getMessages() {
    return fetch("/api/v1").then(  // promise is resolved
        (response) => {
            if (!response.ok) { // HTTP status code NOT between 200-299
                throw new Error("Error getting messages");
            }
            return response.json();
        }).catch((error) => {               // promise is rejected  
            // Better way would be to throw error here and let the 
            // client handle (e.g. show error message)
            // Returning empty array for simplicity only!
            console.log("Error getting messages");
            return [];
        });
}

function clearMessages() {
    return storage.removeItem(MESSAGES_STORAGE_KEY);
}

export {addMessage, getMessages, clearMessages};