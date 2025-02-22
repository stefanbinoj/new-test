import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";

import Register from "views/auth/Register";
import Verify from "views/auth/Verify";
import { SessionProvider, useSession } from "context/AuthContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { sessionValid, isAdmin, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!sessionValid) {
        navigate("/auth/sign-in");
      } else if (adminOnly && !isAdmin) {
        navigate("/user");
      }
    }
  }, [sessionValid, isAdmin, adminOnly, loading, navigate]);

  if (loading) {
    return null; // Or render a loading indicator
  }

  return sessionValid ? children : null;
};

const PublicRoute = ({ children }) => {
  const { sessionValid, isAdmin, loading } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (sessionValid) {
        if (isAdmin) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      }
    }
  }, [sessionValid, isAdmin, loading, navigate]);

  if (loading) {
    return null; // Or render a loading indicator
  }

  return !sessionValid ? children : null;
};

const App = () => {
  return (
    <SessionProvider>
      <Routes>
        <Route
          path="auth/*"
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        />
        <Route
          path="admin/*"
          element={
            // <ProtectedRoute adminOnly={true}>
            <AdminLayout />
            // </ProtectedRoute>
          }
        />
        <Route
          path="user/*"
          element={<ProtectedRoute>{/* <UserLayout /> */}</ProtectedRoute>}
        />
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
        <Route path="auth/register" element={<Register />} />
        <Route path="auth/verify" element={<Verify />} />
      </Routes>
    </SessionProvider>
  );
};

export default App;
