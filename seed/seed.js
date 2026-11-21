require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Course = require("../models/Course");
const Section = require("../models/Section");
const Enrollment = require("../models/Enrollment");

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Promise.all([User.deleteMany({}), Course.deleteMany({}), Section.deleteMany({}), Enrollment.deleteMany({})]);
  const passwordHash = await bcrypt.hash("Password123", 12);
  const [admin, faculty, student1, student2] = await User.create([
    { name: "System Admin", email: "admin@university.com", passwordHash, role: "admin" },
    { name: "Dr. Rahul Sharma", email: "faculty@university.com", passwordHash, role: "faculty", department: "Computer Science", facultyId: "FAC001" },
    { name: "Aarav Mehta", email: "student1@university.com", passwordHash, role: "student", department: "Computer Science", studentId: "STU001" },
    { name: "Priya Singh", email: "student2@university.com", passwordHash, role: "student", department: "Computer Science", studentId: "STU002" }
  ]);
  const course = await Course.create({ code: "CS101", title: "Introduction to Programming", description: "Programming fundamentals", credits: 4, department: "Computer Science", faculty: faculty._id });
  const section = await Section.create({ name: "A", course: course._id, faculty: faculty._id, semester: "Semester 1", academicYear: "2026-2027" });
  await Enrollment.create([
    { student: student1._id, course: course._id, section: section._id },
    { student: student2._id, course: course._id, section: section._id }
  ]);
  console.log("Seed complete.");
  console.log("Demo logins (all passwords: Password123):");
  console.log("Admin: admin@university.com");
  console.log("Faculty: faculty@university.com");
  console.log("Student: student1@university.com or student2@university.com");
  await mongoose.disconnect();
}
seed().catch(async e => { console.error(e); await mongoose.disconnect(); process.exit(1); });
