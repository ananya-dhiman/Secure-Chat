// socket/chatSocket.js
import { messages } from "../models/message.js";
import { rooms } from "../models/room.js";
import { users } from "../models/user.js";

export default (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    // ✅ Join room event
    socket.on("joinRoom", async ({ roomId, userId }) => {
      try {
        const user = await users.findById(userId);
        if (!user) return console.warn(`User not found: ${userId}`);

        const room = await rooms.findById(roomId);
        if (!room) return console.warn(`Room not found: ${roomId}`);

        socket.join(roomId);
        console.log(`👤 ${user.username} joined room ${roomId}`);
      } catch (error) {
        console.error("Error in joinRoom:", error);
      }
    });

    // ✅ Send message event
    socket.on("sendMessage", async ({ roomId, senderId, text }) => {
      try {
        if (!text?.trim()) return;

        // Ensure sender and room exist
        const sender = await users.findById(senderId);
        const room = await rooms.findById(roomId);
        if (!sender || !room) return console.warn("Invalid sender or room");

        // Save message to DB
        const message = await messages.create({
          roomId,
          sender: senderId,
          text,
        });

        // Populate sender details for frontend
        const populatedMsg = await message.populate("sender", "username email profilePic");

        // Emit to everyone in room
        io.to(roomId).emit("newMessage", populatedMsg);
        console.log(`💬 [${roomId}] ${sender.username}: ${text}`);
      } catch (error) {
        console.error("❌ Error sending message:", error);
      }
    });

    // ✅ Leave room event
    socket.on("leaveRoom", ({ roomId, userId }) => {
      socket.leave(roomId);
      console.log(`🚪 User ${userId} left room ${roomId}`);
    });

    // ✅ On disconnect
    socket.on("disconnect", () => {
      console.log("🔴 User disconnected:", socket.id);
    });
  });
};
