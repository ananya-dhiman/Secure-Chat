import "dotenv/config.js";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import {connectDB} from "./config/db.js"
import userRoutes from "./routes/user.js";
import roomsRoutes from "./routes/rooms.js";
import messagesRoutes from "./routes/messages.js";
// import { connectDB } from "./config/firebase.js";
// import admin from "./config/firebase.js";
import chatSocket from "./sockets/chatSocket.js";

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",

  },
});

// Import and use socket logic
chatSocket(io);


app.get("/", (req, res) => {
  res.send("Chat App Backend Running with Socket.IO");
});
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/messages", messagesRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
