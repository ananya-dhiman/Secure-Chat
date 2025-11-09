import express from "express";
const router = express.Router();
import { db } from "../firebaseAdmin.js";

// Create a room
router.post("/", async (req, res) => {
  const { name } = req.body;
  const roomRef = await db.collection("chatRooms").add({
    name,
    createdAt: new Date(),
  });
  res.json({ id: roomRef.id });
});

// List rooms
router.get("/", async (req, res) => {
  const snap = await db.collection("chatRooms").orderBy("createdAt","asc").get();
  const rooms = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(rooms);
});

export default router;
