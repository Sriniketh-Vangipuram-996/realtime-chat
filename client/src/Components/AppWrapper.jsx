import React from "react";
import Navbar from "./Navbar";

export default function AppWrapper({ children }) {
  const user = localStorage.getItem("user");
  return (
    <>
      <Navbar user={user && JSON.parse(user)} />
      {children}
    </>
  );
}
