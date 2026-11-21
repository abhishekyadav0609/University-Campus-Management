const Course = require("../models/Course");
const Section = require("../models/Section");
const Enrollment = require("../models/Enrollment");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  const { code, title, description, credits, department, faculty } = req.body;
  if (!code || !title || !department || !faculty) return res.status(400).json({ success: false, message: "code, title, department and faculty are required" });
  const teacher = await User.findOne({ _id: faculty, role: "faculty" });
  if (!teacher) return res.status(400).json({ success: false, message: "Faculty user not found" });
  const course = await Course.create({ code, title, description, credits, department, faculty });
  res.status(201).json({ success: true, data: course });
};
exports.listCourses = async (req, res) => {
  const filter = {};
  if (req.user.role === "faculty") filter.faculty = req.user._id;
  if (req.query.department) filter.department = req.query.department;
  const courses = await Course.find(filter).populate("faculty", "name email").sort({ createdAt: -1 });
  res.json({ success: true, data: courses });
};
exports.updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: "Course not found" });
  if (req.user.role === "faculty" && !course.faculty.equals(req.user._id)) return res.status(403).json({ success: false, message: "Not your course" });
  ["title", "description", "credits", "department", "faculty"].forEach(k => { if (req.body[k] !== undefined) course[k] = req.body[k]; });
  await course.save(); res.json({ success: true, data: course });
};
exports.deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) return res.status(404).json({ success: false, message: "Course not found" });
  res.json({ success: true, message: "Course deleted" });
};
exports.createSection = async (req, res) => {
  const { name, course, faculty, semester, academicYear } = req.body;
  const c = await Course.findById(course);
  const f = await User.findOne({ _id: faculty, role: "faculty" });
  if (!c || !f) return res.status(400).json({ success: false, message: "Valid course and faculty are required" });
  const section = await Section.create({ name, course, faculty, semester, academicYear });
  res.status(201).json({ success: true, data: section });
};
exports.listSections = async (req, res) => {
  const filter = {};
  if (req.user.role === "faculty") filter.faculty = req.user._id;
  const sections = await Section.find(filter).populate("course", "code title").populate("faculty", "name");
  res.json({ success: true, data: sections });
};
exports.updateSection = async (req, res) => {
  const section = await Section.findById(req.params.id);

  if (!section) {
    return res.status(404).json({
      success: false,
      message: "Section not found"
    });
  }

  const { name, course, faculty, semester, academicYear } = req.body;

  if (course) {
    const validCourse = await Course.findById(course);
    if (!validCourse) {
      return res.status(400).json({
        success: false,
        message: "Course not found"
      });
    }
  }

  if (faculty) {
    const validFaculty = await User.findOne({
      _id: faculty,
      role: "faculty"
    });

    if (!validFaculty) {
      return res.status(400).json({
        success: false,
        message: "Faculty not found"
      });
    }
  }

  if (name !== undefined) section.name = name;
  if (course !== undefined) section.course = course;
  if (faculty !== undefined) section.faculty = faculty;
  if (semester !== undefined) section.semester = semester;
  if (academicYear !== undefined) section.academicYear = academicYear;

  await section.save();

  res.json({ success: true, data: section });
};

exports.deleteSection = async (req, res) => {
  const section = await Section.findById(req.params.id);

  if (!section) {
    return res.status(404).json({
      success: false,
      message: "Section not found"
    });
  }

  const enrollmentExists = await Enrollment.exists({
    section: section._id
  });

  if (enrollmentExists) {
    return res.status(409).json({
      success: false,
      message: "Cannot delete a section with existing enrollments"
    });
  }

  await section.deleteOne();

  res.json({
    success: true,
    message: "Section deleted successfully"
  });
};
exports.enroll = async (req, res) => {
  const { student, course, section } = req.body;
  const s = await User.findOne({ _id: student, role: "student" });
  const c = await Course.findById(course);
  const sec = await Section.findById(section);
  if (!s || !c || !sec || !sec.course.equals(c._id)) return res.status(400).json({ success: false, message: "Valid student, course and matching section are required" });
  const enrollment = await Enrollment.create({ student, course, section });
  res.status(201).json({ success: true, data: enrollment });
};
exports.myCourses = async (req, res) => {
  const filter = req.user.role === "student" ? { student: req.user._id } : { student: req.params.studentId || req.user._id };
  const rows = await Enrollment.find(filter).populate("course").populate("section");
  res.json({ success: true, data: rows });
};
exports.deleteEnrollment = async (req, res) => {
  const row = await Enrollment.findByIdAndDelete(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: "Enrollment not found" });
  res.json({ success: true, message: "Enrollment removed" });
};
exports.courseEnrollmentReport = async (req, res) => {
  const report = await Enrollment.aggregate([
    {
      $group: {
        _id: "$course",
        totalStudents: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "course"
      }
    },
    { $unwind: "$course" },
    {
      $project: {
        _id: 0,
        courseCode: "$course.code",
        courseTitle: "$course.title",
        totalStudents: 1
      }
    },
    { $sort: { courseTitle: 1 } }
  ]);

  res.json({ success: true, data: report });
};

exports.sectionSummaryReport = async (req, res) => {
  const report = await Enrollment.aggregate([
    {
      $group: {
        _id: "$section",
        totalStudents: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: "sections",
        localField: "_id",
        foreignField: "_id",
        as: "section"
      }
    },
    { $unwind: "$section" },
    {
      $lookup: {
        from: "courses",
        localField: "section.course",
        foreignField: "_id",
        as: "course"
      }
    },
    { $unwind: "$course" },
    {
      $project: {
        _id: 0,
        sectionName: "$section.name",
        courseCode: "$course.code",
        courseTitle: "$course.title",
        semester: "$section.semester",
        academicYear: "$section.academicYear",
        totalStudents: 1
      }
    },
    { $sort: { courseTitle: 1, sectionName: 1 } }
  ]);

  res.json({ success: true, data: report });
};