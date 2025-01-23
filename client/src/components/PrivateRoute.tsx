import React from "react";
import { Navigate } from "react-router";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("token"); // Check if the token exists

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
