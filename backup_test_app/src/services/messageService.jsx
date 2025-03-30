const MESSAGES_STORAGE_KEY="messages";

let storage = localStorage;

function addMessage(message) {
    let messages = getMessages()
    messages.push(message);
    storage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
}

function getMessages() {
    let messagesSerialized = storage.getItem(MESSAGES_STORAGE_KEY);
    if (messagesSerialized) {
        return JSON.parse(messagesSerialized);
    } else {
        return [];
    };
}

function clearMessages() {
    return storage.removeItem(MESSAGES_STORAGE_KEY);
}

export {addMessage, getMessages, clearMessages};