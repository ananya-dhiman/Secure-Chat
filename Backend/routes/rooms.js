import express from "express";
import admin from "firebase-admin";
import { rooms } from "../models/room.js";
import { users } from "../models/user.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

const router = express.Router();



// 🟢 Create a room
router.post("/", verifyFirebaseToken, async (req, res) => {
  try {
    const { name, isGroup = false, participantIds = [] } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Room name is required" });
    }

    // get the current user from firebase uid
    let creator = await users.findOne({ firebaseId: req.user.uid });
    if (!creator) {
      return res.status(404).json({ error: "User not found" });
    }

    // Ensure creator is part of the room participants
    const allParticipants = [...new Set([...participantIds, creator._id.toString()])];

    const room = await rooms.create({
      name,
      isGroup,
      participants: allParticipants,
    });

    res.status(201).json(room);
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Failed to create room" });
  }
});

// 🟡 Get all rooms the current user is part of
router.get("/", verifyFirebaseToken, async (req, res) => {
  try {
    const user = await users.findOne({ firebaseId: req.user.uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const userRooms = await rooms
      .find({ participants: user._id })
      .populate("participants", "username email profilePic")
      .sort({ createdAt: 1 });

    res.json(userRooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Failed to fetch rooms" });
  }
});

export default router;
