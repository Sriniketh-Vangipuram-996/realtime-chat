require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const {Server}=require("socket.io");
const mongoose = require("mongoose");
const authRoutes=require("./routes/auth");
const messageRoutes=require("./routes/messages");
const Message=require("./models/Message");
const User=require("./models/User");
const cookieParser=require("cookie-parser");


const app = express();
const server=http.createServer(app);
const io=new Server(server,{
  cors:{
    origin:"realtime-chat-ux9x-dbyi7a3tf-srinikeths-projects-204d2680.vercel.app",
    credentials:true,
    methods:["GET","POST"]
  }
});
app.use(cors({
  origin: "realtime-chat-ux9x-dbyi7a3tf-srinikeths-projects-204d2680.vercel.app", // frontend URL
  credentials: true,               // allow cookies and credentials
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allow methods your API supports
}));

app.use(express.json());
app.use(cookieParser());
let onlineUsers=new Map();

//socket.io basic connection
io.on("connection",(socket)=>{
  console.log("A user connected:",socket.id);

  //userJoined
  socket.on("userJoined",({userId,username})=>{
    onlineUsers.set(socket.id,{userId,username});
    io.emit("onlineUsers",Array.from(onlineUsers.values()));
    console.log(`${username} joined the chat`);
  })
  //chat Message
  socket.on("chatMessage",async({userId,text,mediaUrl})=>{
    try{
      const message=new Message({sender:userId,text,mediaUrl});
      await message.save();
      const populated=await message.populate("sender","username email");
      io.emit("chatMessage",populated); //broadcast saved msg
    }
    catch(err){
      console.error("Error saving message:",err);
    }
  });

  //typing indicator
  socket.on("typing",({userId,username,isTyping})=>{
    socket.broadcast.emit("typing",{userId,username,isTyping});
  });

  //Disconnect
  socket.on("disconnect",()=>{
    const leftUser=onlineUsers.get(socket.id);
      if (leftUser) {
      console.log(`${leftUser.username} left`);
      onlineUsers.delete(socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.values()));
    }
  });
})

// connect to MongoDB
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// Add auth routes here
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () =>
      console.log(` Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
