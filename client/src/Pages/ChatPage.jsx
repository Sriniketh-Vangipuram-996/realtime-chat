import React, { useEffect, useState, useRef } from "react";
import API from "../api";
import io from "socket.io-client";

const SOCKET_URL = import .meta.env.VITE_SOCKET_URL || "http://localhost:4000";

export default function ChatPage() {
  const [user, setUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const socketRef = useRef();
  const messagesEndRef = useRef();

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) return (window.location.href = "/login");

    const u = JSON.parse(savedUser);
    setUser(u);

    const fetchMessages = async () => {
      const res = await API.get("/messages");
      setMessages(res.data);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(SOCKET_URL, { withCredentials: true });
    socketRef.current.emit("userJoined", { userId: user.id, username: user.username });
    socketRef.current.on("onlineUsers", setOnlineUsers);
    socketRef.current.on("chatMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socketRef.current.on("typing", ({ userId, username, isTyping }) => {
      if (userId === user.id) return;
      setTypingUsers((prev) => {
        if (isTyping) return [...new Set([...prev, username])];
        return prev.filter((u) => u !== username);
      });
    });

    return () => socketRef.current.disconnect();
  }, [user]);

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!text && !file) return;

    let mediaUrl = null;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await API.post("/messages/upload", formData);
      mediaUrl = res.data.mediaUrl;
      setFile(null);
    }

    socketRef.current.emit("chatMessage", { userId: user.id, text, mediaUrl });
    setText("");
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    socketRef.current.emit("typing", {
      userId: user.id,
      username: user.username,
      isTyping: e.target.value.length > 0,
    });
  };

  const renderMessage = (msg) => {
    const isSender = msg.sender._id === user.id;
    const bubbleStyle = {
      maxWidth: "60%",
      padding: "10px 14px",
      borderRadius: "18px",
      marginBottom: "8px",
      background: isSender ? "#1d4ed8" : "#e5e7eb",
      color: isSender ? "white" : "black",
      alignSelf: isSender ? "flex-end" : "flex-start",
      wordBreak: "break-word",
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    };

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isSender ? "flex-end" : "flex-start",
        }}
      >
        <div style={bubbleStyle}>
          {msg.text && <div>{msg.text}</div>}
          {msg.mediaUrl &&
            (msg.mediaUrl.endsWith(".mp4") ? (
              <video src={msg.mediaUrl} controls style={{ maxWidth: "100%", borderRadius: "12px" }} />
            ) : (
              <img src={msg.mediaUrl} alt="media" style={{ maxWidth: "100%", borderRadius: "12px" }} />
            ))}
        </div>
        <small style={{ fontSize: "10px", color: "gray", marginTop: "2px" }}>
          {msg.sender.username} • {new Date(msg.createdAt).toLocaleTimeString()}
        </small>
      </div>
    );
  };

  // Inline styles
  const sidebarStyle = {
    width: "220px",
    borderRight: "1px solid #ccc",
    padding: "15px",
    background: "#f3f4f6",
    display: "flex",
    flexDirection: "column",
  };

  const userBadgeStyle = {
    padding: "6px 10px",
    margin: "4px 0",
    borderRadius: "8px",
    background: "#1d4ed8",
    color: "white",
    fontWeight: "500",
  };

  const chatWindowStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    background: "#f9fafb",
  };

  const messagesContainerStyle = {
    flex: 1,
    padding: "15px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
  };

  const inputAreaStyle = {
    display: "flex",
    padding: "12px",
    borderTop: "1px solid #ccc",
    background: "#fff",
  };

  const inputStyle = {
    flex: 1,
    marginRight: "8px",
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
  };

  const fileInputStyle = {
    marginRight: "8px",
  };

  const sendButtonStyle = {
    padding: "10px 16px",
    background: "#1d4ed8",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background 0.2s",
  };

  const handleButtonHover = (e) => (e.currentTarget.style.background = "#2563eb");
  const handleButtonOut = (e) => (e.currentTarget.style.background = "#1d4ed8");

  const typingStyle = { fontStyle: "italic", color: "gray", marginBottom: "10px" };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <h3>Online Users</h3>
        {onlineUsers.map((u) => (
          <div key={u.userId} style={userBadgeStyle}>
            {u.username}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div style={chatWindowStyle}>
        <div style={messagesContainerStyle}>
          {messages.map((msg) => (
            <div key={msg._id}>{renderMessage(msg)}</div>
          ))}
          {typingUsers.length > 0 && (
            <div style={typingStyle}>
              {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
            </div>
          )}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div style={inputAreaStyle}>
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            placeholder="Type a message..."
            style={inputStyle}
          />
          <input type="file" onChange={(e) => setFile(e.target.files[0])} style={fileInputStyle} />
          <button
            onClick={sendMessage}
            style={sendButtonStyle}
            onMouseOver={handleButtonHover}
            onMouseOut={handleButtonOut}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
