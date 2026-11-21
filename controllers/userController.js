const User = require("../models/User");
const bcrypt = require("bcryptjs");
exports.listUsers = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1), limit = Math.min(100, Number(req.query.limit) || 10);
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.department) filter.department = req.query.department;
  if (req.query.search) filter.$or = [{ name: new RegExp(req.query.search, "i") }, { email: new RegExp(req.query.search, "i") }];
  const [users, total] = await Promise.all([
    User.find(filter).select("-passwordHash -refreshTokenHash").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter)
  ]);
  res.json({ success: true, data: users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
};
exports.createUser = async (req, res) => {
  const { name, email, password, role, department, studentId, facultyId } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ success: false, message: "name, email, password and role are required" });
  if (!["admin", "faculty", "student"].includes(role)) return res.status(400).json({ success: false, message: "Invalid role" });
  if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role, department, studentId, facultyId });
  res.status(201).json({ success: true, data: { id: user._id, name, email, role, department } });
};
exports.updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  ["name", "department", "isActive"].forEach(k => { if (req.body[k] !== undefined) user[k] = req.body[k]; });
  await user.save();
  res.json({ success: true, data: { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, isActive: user.isActive } });
};
exports.deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, message: "User deleted" });
};
