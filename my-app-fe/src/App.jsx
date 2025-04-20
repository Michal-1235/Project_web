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
    const [adminStatus, setAdminStatus] = useState(false); // Tracks if the user is an admin

    return (
        <div className="container">
            <BrowserRouter>
                <Header authStatus={authStatus} setAuthStatus={setAuthStatus} adminStatus={adminStatus} setAdminStatus={setAdminStatus}  />
                <Routes>
                    <Route
                        path="/"
                        element={<LoginPage authStatus={authStatus} setAuthStatus={setAuthStatus} adminStatus={adminStatus} setAdminStatus={setAdminStatus}/>}
                    />
                    <Route
                        path="/Register"
                        element={<RegisterPage authStatus={authStatus} setAuthStatus={setAuthStatus} adminStatus={adminStatus} setAdminStatus={setAdminStatus} />}
                    />
                    <Route
                        path="/main"
                        element={<MainPage authStatus={authStatus} setAuthStatus={setAuthStatus} adminStatus={adminStatus} setAdminStatus={setAdminStatus}/>}
                    />
                    <Route
                        path="/create"
                        element={<ProjectCreation1 authStatus={authStatus} setAuthStatus={setAuthStatus} adminStatus={adminStatus} setAdminStatus={setAdminStatus}/>}
                    />
                    <Route
                        path="/create2"
                        element={<ProjectCreation2 authStatus={authStatus} setAuthStatus={setAuthStatus} adminStatus={adminStatus} setAdminStatus={setAdminStatus}/>}
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