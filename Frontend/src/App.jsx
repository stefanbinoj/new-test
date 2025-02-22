import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";

import Register from "views/auth/Register";
import Verify from "views/auth/Verify";

const App = () => {
  return (
    <Routes>
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="auth/register" element={<Register />} />
      <Route path="auth/verify" element={<Verify />} />
    </Routes>
  );
};

export default App;
