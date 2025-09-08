import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await API.post("/auth/logout"); // clear cookie in backend
        localStorage.removeItem("user"); // clear user info
        navigate("/login"); // redirect to login page
      } catch (err) {
        alert(err.response?.data?.error || "Logout failed");
      }
    };

    doLogout();
  }, [navigate]);

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    background: "#f3f4f6",
  };

  const messageStyle = {
    padding: "20px 30px",
    borderRadius: "12px",
    background: "white",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    color: "#1d3557",
    fontSize: "20px",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={messageStyle}>
        <h2>Logging you out...</h2>
      </div>
    </div>
  );
}
