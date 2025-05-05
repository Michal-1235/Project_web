import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from '../services/authService';

function LoginPage(props) {
    const [username_email, setUsernameEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Local state for error messages

    const handleUsernameEmailChange = (e) => setUsernameEmail(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        // prevent page reload
        e.preventDefault();
        // basic validation  
        if (username_email === '' || password === '') {
            setError('Username and password are required!');
            return;
        }

        login(username_email, password)
            .then((data) => {
                setError(''); // Clear error on successful login
                props.setAuthStatus(true); // Update auth status in parent component
                props.setAdminStatus(data.is_admin); // Update admin status in parent component
                console.log("here",data.is_admin);
                navigate('/main');
            })
            .catch((error) => {
                console.log(error.message);
                setError(error.message); // Set error message on failure
            });
       
                
    };

    const handleRegister = () => {
        navigate('/register'); // Navigate to the registration page
    };
    
    return (
        <div className="row">
            <div className="col-sm-4">
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username or email</label>
                        <input
                            type="text"
                            id="username"
                            className="form-control"
                            value={username_email}
                            onChange={handleUsernameEmailChange}
                            placeholder="Enter your username"
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
                    {/* Display error message if it exists */}
                    {error && (
                        <div className="alert alert-danger mt-2">
                            {error}
                        </div>
                    )}
                    <button type="submit" className="btn btn-primary btn-block">
                        Login
                    </button>
                </form>
                <button className="btn btn-secondary btn-block mt-2" onClick={handleRegister}>
                    Register
                </button>
            </div>
        </div>
    );
}

export default LoginPage;