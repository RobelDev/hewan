const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },

  active: {
    type: Boolean,
    default: false,
  },

  role: {
    type: String,
    default: "subscriber",
  },

  date: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = User = mongoose.model("user", userSchema);
