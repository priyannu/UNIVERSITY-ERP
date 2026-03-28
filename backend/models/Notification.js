const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: String,
  message: String,
  type: { type: String, enum: ["info", "warning", "success", "urgent"], default: "info" },
  audience: String,
  postedBy: String,
  date: Date
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
