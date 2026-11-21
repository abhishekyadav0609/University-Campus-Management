const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const Enrollment = require("../models/Enrollment");
const Section = require("../models/Section");
const events = require("../utils/events");

exports.markAttendance = async (req, res) => {
  const { section, date, records } = req.body;
  if (!section || !date || !Array.isArray(records) || !records.length) return res.status(400).json({ success: false, message: "section, date and non-empty records array are required" });
  const sec = await Section.findById(section);
  if (!sec) return res.status(404).json({ success: false, message: "Section not found" });
  if (req.user.role === "faculty" && !sec.faculty.equals(req.user._id)) return res.status(403).json({ success: false, message: "You are not assigned to this section" });
  const sessionDate = new Date(date);
  if (Number.isNaN(sessionDate.getTime())) return res.status(400).json({ success: false, message: "Invalid date" });
  const results = [];
  for (const item of records) {
    if (!["present", "absent", "late"].includes(item.status)) return res.status(400).json({ success: false, message: "Status must be present, absent or late" });
    const enrolled = await Enrollment.findOne({ student: item.student, course: sec.course, section });
    if (!enrolled) return res.status(400).json({ success: false, message: `Student ${item.student} is not enrolled in this section` });
    const record = await Attendance.findOneAndUpdate(
      { student: item.student, course: sec.course, section, date: sessionDate },
      { $set: { status: item.status, markedBy: req.user._id, remarks: item.remarks } },
      { new: true, upsert: true, runValidators: true }
    );
    results.push(record);
    events.emit("attendance:marked", { studentId: item.student, record });
  }
  res.status(201).json({ success: true, message: "Attendance saved", data: results });
};
exports.myAttendance = async (req, res) => {
  const studentId =
    req.user.role === "student" ? req.user._id : req.query.studentId;

  if (!studentId) {
    return res.status(400).json({
      success: false,
      message: "studentId is required"
    });
  }

  if (req.user.role === "faculty") {
    const sectionId = req.query.section;

    if (!sectionId) {
      return res.status(400).json({
        success: false,
        message: "section is required for faculty"
      });
    }

    const allowed = await Section.findOne({
      faculty: req.user._id,
      _id: sectionId
    });

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: "Not assigned to this section"
      });
    }
  }

  const filter = { student: studentId };

  if (req.query.course) filter.course = req.query.course;
  if (req.query.section) filter.section = req.query.section;

  const records = await Attendance.find(filter)
    .populate("course", "code title")
    .sort({ date: -1 });

  res.json({ success: true, data: records });
};
exports.summary = async (req, res) => {
  const studentId = req.user.role === "student" ? req.user._id : req.params.studentId;
  if (!studentId) return res.status(400).json({ success: false, message: "studentId is required" });
  const studentObjectId = new mongoose.Types.ObjectId(studentId);
  const summary = await Attendance.aggregate([
    { $match: { student: studentObjectId } },
    { $group: { _id: "$course", totalClasses: { $sum: 1 }, attended: { $sum: { $cond: [{ $in: ["$status", ["present", "late"]] }, 1, 0] } } } },
    { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
    { $unwind: "$course" },
    { $project: { course: "$course.title", code: "$course.code", totalClasses: 1, attended: 1, percentage: { $multiply: [{ $divide: ["$attended", "$totalClasses"] }, 100] } } }
  ]);
  res.json({ success: true, data: summary });
};
exports.lowAttendance = async (req, res) => {
  const threshold = Math.min(100, Math.max(0, Number(req.query.threshold) || 75));
  const data = await Attendance.aggregate([
    { $group: { _id: { student: "$student", course: "$course" }, total: { $sum: 1 }, attended: { $sum: { $cond: [{ $in: ["$status", ["present", "late"]] }, 1, 0] } } } },
    { $addFields: { percentage: { $multiply: [{ $divide: ["$attended", "$total"] }, 100] } } },
    { $match: { percentage: { $lt: threshold } } },
    { $lookup: { from: "users", localField: "_id.student", foreignField: "_id", as: "student" } },
    { $lookup: { from: "courses", localField: "_id.course", foreignField: "_id", as: "course" } },
    { $unwind: "$student" }, { $unwind: "$course" },
    { $project: { student: "$student.name", studentEmail: "$student.email", course: "$course.title", total: 1, attended: 1, percentage: 1 } }
  ]);
  res.json({ success: true, threshold, data });
};
