const router = require("express").Router();
const { auth, requireRole } = require("../middleware/authMiddleware");
const { getAttendance, markAttendance, bulkMark } = require("../controllers/attendanceController");

router.get("/", auth, getAttendance);
router.post("/", auth, requireRole("teacher"), markAttendance);
router.post("/bulk", auth, requireRole("teacher"), bulkMark);

module.exports = router;
