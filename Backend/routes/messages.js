import express from "express";
const router = express.Router({ mergeParams: true });
import { db } from "../firebaseAdmin.js";
import { verifyFirebaseToken } from "../middleware/auth.js";

// Send message (protected)
router.post("/:roomId", verifyFirebaseToken, async (req, res) => {
  const { roomId } = req.params;
  const { text } = req.body;
  const senderId = req.user.uid;

  const msgRef = await db.collection("chatRooms")
    .doc(roomId)
    .collection("messages")
    .add({
      text,
      senderId,
      createdAt: new Date(),
    });

  res.json({ id: msgRef.id });
});

// Get recent messages (public or protected as you prefer)
router.get("/:roomId", async (req, res) => {
  const { roomId } = req.params;
  const snap = await db.collection("chatRooms")
    .doc(roomId)
    .collection("messages")
    .orderBy("createdAt", "asc")
    .limit(200)
    .get();

  const messages = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  res.json(messages);
});

export default router;
