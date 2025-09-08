import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/auth/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // Inline styles
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    background: "#f3f4f6",
  };

  const cardStyle = {
    background: "white",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    width: "350px",
    textAlign: "center",
  };

  const headingStyle = {
    marginBottom: "20px",
    color: "#1d3557",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 15px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
    outline: "none",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px 0",
    marginTop: "15px",
    background: "#1d4ed8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  };
  
  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={headingStyle}>Signup</h2>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            style={inputStyle}
          />
          <button
            type="submit"
            style={buttonStyle}
            onMouseOver={(e) => (e.currentTarget.style.background = "#2563eb")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#1d4ed8")}
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}
