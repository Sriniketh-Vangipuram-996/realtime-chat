require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const Message = require("./models/Message");
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:3000",
  "https://your-vercel-frontend-url.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
}));

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

app.use(express.json());
app.use(cookieParser());

let onlineUsers = new Map();

// socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("userJoined", ({ userId, username }) => {
    onlineUsers.set(socket.id, { userId, username });
    io.emit("onlineUsers", Array.from(onlineUsers.values()));
    console.log(`${username} joined the chat`);
  });

  socket.on("chatMessage", async ({ userId, text, mediaUrl }) => {
    try {
      const message = new Message({ sender: userId, text, mediaUrl });
      await message.save();
      const populated = await message.populate("sender", "username email");
      io.emit("chatMessage", populated);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("typing", ({ userId, username, isTyping }) => {
    socket.broadcast.emit("typing", { userId, username, isTyping });
  });

  socket.on("disconnect", () => {
    const leftUser = onlineUsers.get(socket.id);
    if (leftUser) {
      console.log(`${leftUser.username} left`);
      onlineUsers.delete(socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    }
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
