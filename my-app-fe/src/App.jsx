import { useState } from 'react';
import MainPage from './pages/Main_page';
import ProjectCreation1 from './pages/Project_creation1';
import ProjectCreation2 from './pages/Project_creation2';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';


function App() {
    const [authStatus, setAuthStatus] = useState(false); // Tracks if the user is logged in
    const [error, setError] = useState(''); // Tracks error messages

    return (
        <div className="container">
            <BrowserRouter>
                <Header authStatus={authStatus} setAuthStatus={setAuthStatus} setError={setError} error={error} />
                <Routes>
                    <Route
                        path="/"
                        element={<LoginPage authStatus={authStatus} setAuthStatus={setAuthStatus} setError={setError} error={error} />}
                    />
                    <Route
                        path="/Register"
                        element={<RegisterPage />}
                    />
                    <Route
                        path="/main"
                        element={<MainPage />}
                    />
                    <Route
                        path="/create"
                        element={<ProjectCreation1 />}
                    />
                    <Route
                        path="/create2"
                        element={<ProjectCreation2 />}
                    />
                    {/* 
                    <Route
                        path="/project"
                        element={<ProjectAssignments />}
                    />
                    
                    <Route
                        path="/assignment"
                        element={<Assignment />}
                    />
                    <Route
                        path="/completion"
                        element={<AssignmentCompletion />}
                    />
                    <Route
                        path="/bugreport"
                        element={<BugReport />}
                    />
                    <Route
                        path="/newleader"
                        element={<NewTeamLeader />}
                    />
                    */}
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;