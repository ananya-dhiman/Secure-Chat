// server.js
require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const admin = require("./config/firebase");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Setup Socket.IO (simple for now)
const io = new Server(server, {
  cors: {
    origin: "*", // later restrict to frontend URL
    methods: ["GET", "POST"],
  },
});

// --- Firebase Auth Middleware ---
const verifyFirebaseToken = async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// --- Test Route ---
app.get("/", (req, res) => {
  res.send("✅ Chat App Backend is Running...");
});

// --- Protected Route Example ---
app.get("/protected", verifyFirebaseToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.email}!` });
});

// --- Socket.IO Events (placeholder for now) ---
io.on("connection", (socket) => {
  console.log("🟢 A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 A user disconnected:", socket.id);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
