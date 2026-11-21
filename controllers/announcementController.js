const Announcement = require("../models/Announcement");
const Section = require("../models/Section");
const events = require("../utils/events");

exports.create = async (req, res) => {
  const { title, message, audience = "university", section, course } = req.body;
  if (!title || !message) return res.status(400).json({ success: false, message: "title and message are required" });
  if (!["university", "section", "course"].includes(audience)) return res.status(400).json({ success: false, message: "Invalid audience" });
  if (audience === "section" && !section) return res.status(400).json({ success: false, message: "section is required" });
  if (audience === "course" && !course) return res.status(400).json({ success: false, message: "course is required" });
  if (section && req.user.role === "faculty") {
    const owned = await Section.findOne({ _id: section, faculty: req.user._id });
    if (!owned) return res.status(403).json({ success: false, message: "Not assigned to this section" });
  }
  const announcement = await Announcement.create({ title, message, audience, section, course, createdBy: req.user._id });
  events.emit("announcement:created", { announcement, sectionId: section });
  res.status(201).json({ success: true, data: announcement });
};
exports.list = async (req, res) => {
  const rows = await Announcement.find().sort({ createdAt: -1 }).limit(Math.min(100, Number(req.query.limit) || 30)).populate("createdBy", "name role");
  res.json({ success: true, data: rows });
};
exports.remove = async (req, res) => {
  const row = await Announcement.findByIdAndDelete(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: "Announcement not found" });
  res.json({ success: true, message: "Announcement deleted" });
};
