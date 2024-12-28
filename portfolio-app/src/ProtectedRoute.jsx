import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ element }) => {
    const { isAuthenticated } = useAuth();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return element;
};

export default ProtectedRoute;
