import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { checkAuthStatus } from "../services/authService";

function ProtectedRoute({ element: Component, ...props }) {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    checkAuthStatus()
      .then((status) => {
        props.setAuthStatus(status.isLoggedIn);
        props.setAdminStatus(status.is_admin);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error checking authentication status:", error);
        props.setAuthStatus(false);
        setIsLoading(false);
      });
  }, [location]);

  if (isLoading) return <div>Loading...</div>;

  if (!props.authStatus) return <Navigate to="/login" replace />;

  // Render the protected component with additional props
  return <Component adminStatus={props.adminStatus} />;
}

export default ProtectedRoute;
