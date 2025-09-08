const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Multer config to store file in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to verify JWT token
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

// Helper function to upload buffer to Cloudinary using stream
function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "chat_media",
        resource_type: "auto", // supports images, videos, etc.
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
}

// POST /upload - upload media
router.post("/upload", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Upload file buffer to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    res.json({ mediaUrl: result.secure_url });
  } catch (err) {
    console.error("File upload failed:", err);
    res.status(500).json({ message: "File upload failed" });
  }
});

module.exports = router;
