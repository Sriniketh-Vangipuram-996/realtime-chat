import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function LogoutButton() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout"); 
      localStorage.removeItem("user"); 
      navigate("/login"); // redirect to login
    } catch (err) {
      alert(err.response?.data?.error || "Logout failed");
    }
  };

  const buttonStyle = {
    padding: "8px 18px",
    background: "#e63946",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background 0.2s",
  };

  const handleHover = (e) => (e.currentTarget.style.background = "#d62839");
  const handleOut = (e) => (e.currentTarget.style.background = "#e63946");

  return (
    <button
      onClick={handleLogout}
      style={buttonStyle}
      onMouseOver={handleHover}
      onMouseOut={handleOut}
    >
      Logout
    </button>
  );
}
