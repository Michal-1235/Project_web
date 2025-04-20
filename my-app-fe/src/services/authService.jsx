function login(username, password) {
  return fetch("/api/auth/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include"
  })
    .then((response) => {  // promise is resolved
      if (!response.ok) {
        // invalid password or user does not exist
        if (response.status === 401) {
          throw new Error("Invalid credentials"); 
        }
        throw new Error("Error logging in");
      }      
    })
}

function logout() {
  return fetch("/api/auth/", {method: "DELETE", credentials: "include"})
    .then((response) => {  // promise is resolved
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error("Bad request - session does not exist"); 
        }
        throw new Error("Error logging out");
      }      
    })
    
}

export { login, logout };