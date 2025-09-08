import React, { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("Login successful!");
      navigate("/"); // go to chat page
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  // Inline styles (matching Signup page)
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
        <h2 style={headingStyle}>Login</h2>
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
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
