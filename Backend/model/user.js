// models/User.js
const mongoose = require("mongoose");

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

module.exports = mongoose.model("User", userSchema);
