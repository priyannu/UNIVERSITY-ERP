const mongoose = require("mongoose");

const hostelSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  studentName: String,
  roomNo: String,
  block: String,
  issueType: { type: String, enum: ["electrical", "plumbing", "furniture", "cleaning", "other"] },
  description: String,
  status: { type: String, enum: ["open", "in-progress", "resolved"], default: "open" },
  resolvedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("Hostel", hostelSchema);
