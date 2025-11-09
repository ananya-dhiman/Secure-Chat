// models/Room.js
import mongoose from "mongoose";
const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isGroup: {
    type: Boolean,
    default: false,
  },
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ],
}, { timestamps: true });

export const rooms = mongoose.model("Room", roomSchema);
