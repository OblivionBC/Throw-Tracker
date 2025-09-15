import React, { useEffect, useState, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useUserStore, {
  useIsAuthenticated,
  useIsLoading,
} from "../stores/userStore";

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const isLoading = useIsLoading();
  const location = useLocation();
  const { fetchUser, reset } = useUserStore();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const hasCheckedAuth = useRef(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      // Prevent multiple checks
      if (hasCheckedAuth.current) {
        setIsCheckingAuth(false);
        return;
      }

      // If already authenticated, no need to check
      if (isAuthenticated) {
        hasCheckedAuth.current = true;
        setIsCheckingAuth(false);
        return;
      }

      // Check if there's a token in cookies before making API call
      const hasToken = document.cookie.includes("access_token=");

      if (!hasToken) {
        // No token found, clear any invalid state and redirect
        reset();
        hasCheckedAuth.current = true;
        setIsCheckingAuth(false);
        return;
      }

      try {
        // Try to fetch user data to check if token is valid
        const userData = await fetchUser();
        if (!userData) {
          // No valid token, clear state but don't redirect (let the API error handling do it)
          console.log("ProtectedRoute: No user data returned, clearing state");
          reset();
        }
      } catch (error) {
        console.error("ProtectedRoute: Authentication check failed:", error);
        // Clear any invalid state but don't redirect (let the API error handling do it)
        console.log("ProtectedRoute: Error during auth check, clearing state");
        reset();
      }

      hasCheckedAuth.current = true;
      setIsCheckingAuth(false);
    };

    checkAuthentication();
  }, [isAuthenticated, fetchUser, reset]);

  // Reset the check flag when location changes
  useEffect(() => {
    hasCheckedAuth.current = false;
  }, [location.pathname]);

  // Show loading while checking authentication
  if (isLoading || isCheckingAuth) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "18px",
        }}
      >
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
