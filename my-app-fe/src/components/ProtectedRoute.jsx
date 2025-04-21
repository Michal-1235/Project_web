import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { checkAuthStatus } from "../services/authService";

function ProtectedRoute(props) {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation(); // Hook to detect route changes

  useEffect(() => {
    checkAuthStatus()
      .then((status) => {
        props.setAuthStatus(status.isLoggedIn); // Update global auth status
        props.setAdminStatus(status.is_admin); // Update global admin status
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error);
        props.setAuthStatus(false); // Set global auth status to false
        setIsLoading(false);
      });
  }, [location]);

  if (isLoading) {
    // Show a loading spinner or placeholder while checking authentication
    return <div>Loading...</div>;
  }

  if (!props.authStatus) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  // Pass adminStatus to children as a prop
  return React.cloneElement(props.children, { adminStatus: props.adminStatus });
}

export default ProtectedRoute;