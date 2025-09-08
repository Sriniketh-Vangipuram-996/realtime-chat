import React from "react";
import { Navigate } from "react-router-dom";

export default function RootRedirect() {
  const user = localStorage.getItem("user");
  if (user) return <Navigate to="/" />;
  return <Navigate to="/login" />;
}
