import { auth } from "../config/firebase.js";

export async function verifyFirebaseToken(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split("Bearer ")[1] : null;
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = await auth.verifyIdToken(token);
    // decoded contains uid, email, etc.
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Token verify error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
