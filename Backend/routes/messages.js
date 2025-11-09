import express from "express";
import { verifyFirebaseToken } from "../middleware/auth.js";
import { messages } from "../models/message.js";
import { rooms } from "../models/room.js";
import { users } from "../models/user.js";

const router = express.Router({ mergeParams: true });

/**
 * @route   POST /:roomId
 * @desc    Send a message (protected)
 * @access  Private
 */
router.post("/:roomId", verifyFirebaseToken, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { text } = req.body;
    const firebaseUid = req.user.uid;

    // Find sender user by Firebase UID
    const sender = await users.findOne({ firebaseId: firebaseUid });
    if (!sender) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if room exists
    const room = await rooms.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Create a new message
    const newMessage = await messages.create({
      roomId,
      sender: sender._id,
      text,
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

/**
 * @route   GET /:roomId
 * @desc    Get recent messages from a room
 * @access  Public or Protected (your choice)
 */
router.get("/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;

    // Validate room existence
    const room = await rooms.findById(roomId);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Get latest 200 messages (oldest first)
    const chatMessages = await messages
      .find({ roomId })
      .populate("sender", "username profilePic firebaseId")
      .sort({ createdAt: 1 })
      .limit(200);

    res.json(chatMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
