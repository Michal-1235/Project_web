import { useState, useEffect } from 'react';
import {Routes, Route, useNavigate } from 'react-router-dom';
import MainPage from './pages/Main_page';
import ProjectCreation1 from './pages/Project_creation1';
import ProjectCreation2 from './pages/Project_creation2';
import Header from './components/Header';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import { checkAuthStatus } from './services/authService';

function App() {
  const [authStatus, setAuthStatus] = useState(false); // Tracks if the user is logged in
  const [adminStatus, setAdminStatus] = useState(false); // Tracks if the user is an admin
  const [isLoading, setIsLoading] = useState(true); // Tracks if the initial auth check is in progress
  const navigate = useNavigate();

  useEffect(() => {
    // Perform initial authentication check
    checkAuthStatus()
      .then((status) => {
        setAuthStatus(status.isLoggedIn);
        setAdminStatus(status.is_admin);
        setIsLoading(false);

        // Redirect based on authentication status
        if (status.isLoggedIn) {
          navigate('/main'); // Redirect to /main if logged in
        } else {
          navigate('/login'); // Redirect to / if not logged in
        }
      })
      .catch((error) => {
        console.error('Error checking authentication status:', error);
        setAuthStatus(false);
        setIsLoading(false);
        navigate('/login'); // Redirect to / on error
      });
  }, []); // Empty dependency array ensures this runs only once at starting of application

  if (isLoading) {
    // Show a loading spinner or placeholder while checking authentication
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
        <Header
          authStatus={authStatus}
          setAuthStatus={setAuthStatus}
          adminStatus={adminStatus}
          setAdminStatus={setAdminStatus}
        />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <LoginPage
                authStatus={authStatus}
                setAuthStatus={setAuthStatus}
                adminStatus={adminStatus}
                setAdminStatus={setAdminStatus}
              />
            }
          />
          <Route
            path="/register"
            element={
              <RegisterPage
                authStatus={authStatus}
                setAuthStatus={setAuthStatus}
                adminStatus={adminStatus}
                setAdminStatus={setAdminStatus}
              />
            }
          />

          {/* Protected Routes */}
          <Route
            path="/main"
            element={
              <ProtectedRoute
                authStatus={authStatus}
                setAuthStatus={setAuthStatus}
                adminStatus={adminStatus}
                setAdminStatus={setAdminStatus}
              >
                <MainPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute
                authStatus={authStatus}
                setAuthStatus={setAuthStatus}
                adminStatus={adminStatus}
                setAdminStatus={setAdminStatus}
              >
                <ProjectCreation1 />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create2"
            element={
              <ProtectedRoute
                authStatus={authStatus}
                setAuthStatus={setAuthStatus}
                adminStatus={adminStatus}
                setAdminStatus={setAdminStatus}
              >
                <ProjectCreation2 />
              </ProtectedRoute>
            }
          />
        </Routes>
    </div>
  );
}

export default App;