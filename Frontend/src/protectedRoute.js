import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("accessToken") !== null;

  if (!isLoggedIn) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  return children;
};

export default PrivateRoute;
