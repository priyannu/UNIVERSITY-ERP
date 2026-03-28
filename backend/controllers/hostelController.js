const Hostel = require("../models/Hostel");

exports.getRequests = async (req, res) => {
  try {
    const filter = req.user.role === "student" ? { studentId: req.user.id } : {};
    res.json(await Hostel.find(filter).sort({ createdAt: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createRequest = async (req, res) => {
  try {
    res.json(await Hostel.create({ ...req.body, studentId: req.user.id }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateRequest = async (req, res) => {
  try {
    if (req.body.status === "resolved") req.body.resolvedAt = new Date();
    res.json(await Hostel.findByIdAndUpdate(req.params.id, req.body, { new: true }));
  } catch (err) { res.status(500).json({ message: err.message }); }
};
