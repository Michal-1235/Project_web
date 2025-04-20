import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { checkUserExists, registerUser } from "../services/database_queries_BE";

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // New state for email
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handleEmailChange = (e) => setEmail(e.target.value); // New handler for email
    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!username || !email || !password || !confirmPassword) {
            setError("All fields are required!");
            return;
        }


        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long!");
            return;
        }

        try {
            // Check if the user already exists
            const userExists = await checkUserExists(username);
            if (userExists) {
                setError("Username already exists!");
                return;
            }
            const emailExists = await checkUserExists(email);
            if (emailExists) {
                setError("Email already exists!");
                return;
            }
            // Register the user
            await registerUser({ username, email, password }); // Include email in the payload
            setError("");
            setSuccess("Registration successful! Redirecting to login...");
            setTimeout(() => navigate("/"), 2000); // Redirect to login page after 2 seconds
        } catch (err) {
            setError(err.message || "An error occurred during registration.");
        }
    };

    const handleBackToLogin = () => {
        navigate("/"); // Navigate to the login page
    };

    return (
        <div className="row">
            <div className="col-sm-4">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label> 
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="form-control"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            placeholder="Re-enter your password"
                        />
                    </div>
                    {error && <div className="alert alert-danger mt-2">{error}</div>}
                    {success && <div className="alert alert-success mt-2">{success}</div>}
                    <button type="submit" className="btn btn-primary btn-block">
                        Register
                    </button>
                </form>
                <button className="btn btn-secondary btn-block mt-2" onClick={handleBackToLogin}>
                    Back to Login
                </button>
            </div>
        </div>
    );
}

export default RegisterPage;