import React from "react";
import LogoutButton from "./LogoutButton";

export default function Navbar({ user }) {
  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 25px",
    background: "#1d3557",
    color: "white",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  const linkStyle = {
    color: "white",
    marginLeft: "15px",
    textDecoration: "none",
    fontWeight: "500",
    fontSize: "16px",
    cursor: "pointer",
  };

  const brandStyle = {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    cursor: "pointer",
  };

  const handleLinkHover = (e) => {
    e.currentTarget.style.color = "#a8dadc";
  };

  const handleLinkOut = (e) => {
    e.currentTarget.style.color = "white";
  };

  return (
    <nav style={navStyle}>
      <div>
        <a
          href="/"
          style={brandStyle}
          onMouseOver={handleLinkHover}
          onMouseOut={handleLinkOut}
        >
          📨 ChatApp
        </a>
      </div>
      <div>
        {user ? (
          <LogoutButton />
        ) : (
          <>
            <a
              href="/login"
              style={linkStyle}
              onMouseOver={handleLinkHover}
              onMouseOut={handleLinkOut}
            >
              Login
            </a>
            <a
              href="/signup"
              style={linkStyle}
              onMouseOver={handleLinkHover}
              onMouseOut={handleLinkOut}
            >
              Signup
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
