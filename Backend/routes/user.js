// routes/User.js
import express from "express";
import { users } from "../models/user.js";
import admin from "../config/firebase.js";
import { verifyFirebaseToken } from "../middleware/auth.js";
const router = express.Router();



// -----------------------------
// Login/Register User
// -----------------------------
router.post("/login", verifyFirebaseToken, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user;

    // Check if user exists in Mongo
    let user = await users.findOne({ firebaseId: uid });

    if (!user) {
      // First time login → create Mongo user
      user = await users.create({
        firebaseId: uid,
        username: name || "Anonymous",
        email: email || "",
        profilePic: picture || "",
      });
    }

    res.json({
      message: "Login successful",
      user,
      token: req.headers.authorization.split(" ")[1], // return same Firebase token
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// -----------------------------
// Get current user (protected)
// -----------------------------
router.get("/me", verifyFirebaseToken, async (req, res) => {
  try {
    const user = await users.findOne({ firebaseId: req.user.uid });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
