const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
let io;

function initSocket(server) {
  io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication token required"));
      socket.user = jwt.verify(token, process.env.JWT_SECRET);
      next();
    } catch {
      next(new Error("Invalid or expired socket token"));
    }
  });
  io.on("connection", (socket) => {
    socket.join(`user:${socket.user.id}`);
    socket.on("join-section", (sectionId) => socket.join(`section:${sectionId}`));
  });
  return io;
}
function getIO() {
  if (!io) throw new Error("Socket.IO has not been initialized");
  return io;
}
module.exports = { initSocket, getIO };
