const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["admin", "faculty", "student"], default: "student", required: true },
  department: { type: String, trim: true },
  studentId: { type: String, unique: true, sparse: true, trim: true },
  facultyId: { type: String, unique: true, sparse: true, trim: true },
  isActive: { type: Boolean, default: true },
  tokenVersion: { type: Number, default: 0 },
  refreshTokenHash: { type: String, select: false }
}, { timestamps: true });
userSchema.index({ role: 1, department: 1 });
module.exports = mongoose.model("User", userSchema);
