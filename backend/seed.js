require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const users = [
  // Admin
  { name: "Admin User",      email: "admin@college.edu",    password: "admin123",    role: "admin",   department: "Administration" },
  // Teachers
  { name: "Dr. Priya Sharma",email: "teacher@college.edu",  password: "teacher123",  role: "teacher", subject: "Mathematics",       designation: "Associate Professor", department: "Computer Science", experience: 8 },
  { name: "Prof. Raj Kumar", email: "raj@college.edu",      password: "teacher123",  role: "teacher", subject: "Physics",           designation: "Assistant Professor", department: "Electronics",      experience: 5 },
  { name: "Dr. Anita Singh", email: "anita@college.edu",    password: "teacher123",  role: "teacher", subject: "Computer Science",  designation: "Professor",           department: "Computer Science", experience: 12 },
  // Students
  { name: "Jane Student",    email: "student@college.edu",  password: "student123",  role: "student", class: "CS-3A", rollNo: "CS001", department: "Computer Science", semester: 3, batch: "2022-26", feeStatus: "pending" },
  { name: "Arjun Patel",     email: "arjun@college.edu",    password: "student123",  role: "student", class: "CS-3A", rollNo: "CS002", department: "Computer Science", semester: 3, batch: "2022-26", feeStatus: "paid" },
  { name: "Sneha Reddy",     email: "sneha@college.edu",    password: "student123",  role: "student", class: "CS-3B", rollNo: "CS003", department: "Computer Science", semester: 3, batch: "2022-26", feeStatus: "overdue" },
  { name: "Rahul Verma",     email: "rahul@college.edu",    password: "student123",  role: "student", class: "ECE-2A",rollNo: "EC001", department: "Electronics",      semester: 2, batch: "2023-27", feeStatus: "paid" },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) { console.log(`⏭  Skipped (exists): ${u.email}`); continue; }
    const user = new User({ ...u, password: await bcrypt.hash(u.password, 12) });
    await user.save(); // triggers pre-save permission assignment
    console.log(`✅ Created: ${u.email} [${u.role}]`);
  }

  console.log("\n🎓 Seed complete! Login credentials:");
  console.log("  Admin:   admin@college.edu   / admin123");
  console.log("  Teacher: teacher@college.edu / teacher123");
  console.log("  Student: student@college.edu / student123");

  mongoose.disconnect();
})();
