import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./Pages/ChatPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import LogoutButton from "./Components/LogoutButton";
import ProtectedRoute from "./Components/ProtectedRoute";
import RootRedirect from "./Components/RootRedirect";
import AppWrapper from "./Components/AppWrapper";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppWrapper>
              <ChatPage />
            </AppWrapper>
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<AppWrapper><Login /></AppWrapper>} />
      <Route path="/signup" element={<AppWrapper><Signup /></AppWrapper>} />
      <Route path="/logout" element={<AppWrapper><LogoutButton /></AppWrapper>} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  </BrowserRouter>
);
