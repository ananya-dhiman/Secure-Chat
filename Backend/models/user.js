// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
    unique: true, // matches Firebase UID
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  profilePic: {
    type: String,
    default: "",
  },
}, { timestamps: true });

export const users = mongoose.model("User", userSchema);
