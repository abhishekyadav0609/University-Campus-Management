const jwt = require("jsonwebtoken");
exports.accessToken = (user) => jwt.sign(
  { id: user._id.toString(), role: user.role, name: user.name },
  process.env.JWT_SECRET,
  { expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m" }
);
exports.refreshToken = (user) => jwt.sign(
  { id: user._id.toString(), tokenVersion: user.tokenVersion },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d" }
);
