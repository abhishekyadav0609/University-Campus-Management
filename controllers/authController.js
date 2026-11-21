const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/User");
const { accessToken, refreshToken } = require("../utils/tokens");

const hash = (value) => crypto.createHash("sha256").update(value).digest("hex");
exports.register = async (req, res) => {
  const { name, email, password, role, department, studentId, facultyId } = req.body;
  if (!name || !email || !password) return res.status(400).json({ success: false, message: "name, email and password are required" });
  if (password.length < 8) return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
  if (role && role !== "student") return res.status(403).json({ success: false, message: "Public registration is for students only" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: "Email already registered" });
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role: "student", department, studentId });
  const at = accessToken(user), rt = refreshToken(user);
  user.refreshTokenHash = hash(rt); await user.save();
  res.status(201).json({ success: true, message: "Registration successful", data: { user: safeUser(user), accessToken: at, refreshToken: rt } });
};
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+passwordHash +refreshTokenHash");
  if (!user || !user.isActive || !(await bcrypt.compare(password || "", user.passwordHash))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }
  const at = accessToken(user), rt = refreshToken(user);
  user.refreshTokenHash = hash(rt); await user.save();
  res.json({ success: true, data: { user: safeUser(user), accessToken: at, refreshToken: rt } });
};
exports.refresh = async (req, res) => {
  const jwt = require("jsonwebtoken");
  const token = req.body.refreshToken;
  if (!token) return res.status(400).json({ success: false, message: "refreshToken is required" });
  try {
    const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id).select("+refreshTokenHash");
    if (!user || !user.refreshTokenHash || user.refreshTokenHash !== hash(token) || payload.tokenVersion !== user.tokenVersion) {
      return res.status(401).json({ success: false, message: "Refresh token invalid or revoked" });
    }
    const newAccess = accessToken(user), newRefresh = refreshToken(user);
    user.refreshTokenHash = hash(newRefresh); await user.save();
    res.json({ success: true, data: { accessToken: newAccess, refreshToken: newRefresh } });
  } catch { res.status(401).json({ success: false, message: "Invalid or expired refresh token" }); }
};
exports.logout = async (req, res) => {
  const user = await User.findById(req.user._id).select("+refreshTokenHash");
  user.refreshTokenHash = undefined; user.tokenVersion += 1; await user.save();
  res.json({ success: true, message: "Logged out; refresh token revoked" });
};
exports.me = async (req, res) => res.json({ success: true, data: safeUser(req.user) });
exports.updateMe = async (req, res) => {
  const allowed = ["name", "department"];
  allowed.forEach(k => { if (req.body[k] !== undefined) req.user[k] = req.body[k]; });
  await req.user.save();
  res.json({ success: true, data: safeUser(req.user) });
};
function safeUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, studentId: user.studentId, facultyId: user.facultyId };
}
