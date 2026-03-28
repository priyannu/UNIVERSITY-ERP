const Attendance = require("../models/Attendance");

exports.getAttendance = async (req, res) => {
  try {
    const filter = req.user.role === "student" ? { studentId: req.user.id } : {};
    res.json(await Attendance.find(filter).sort({ date: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.markAttendance = async (req, res) => {
  try {
    res.json(await Attendance.create({ ...req.body, markedBy: req.user.id }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.bulkMark = async (req, res) => {
  try {
    const { records } = req.body;
    const docs = await Attendance.insertMany(records.map(r => ({ ...r, markedBy: req.user.id })));
    res.json(docs);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
