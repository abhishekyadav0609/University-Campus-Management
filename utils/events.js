const EventEmitter = require("events");
const events = new EventEmitter();
const { getIO } = require("../config/socket");

events.on("announcement:created", ({ announcement, sectionId }) => {
  try {
    const io = getIO();
    if (sectionId) io.to(`section:${sectionId}`).emit("announcement:new", announcement);
    else io.emit("announcement:new", announcement);
  } catch (err) {
    console.warn("Realtime announcement delivery skipped:", err.message);
  }
});
events.on("attendance:marked", ({ studentId, record }) => {
  try { getIO().to(`user:${studentId}`).emit("attendance:updated", record); }
  catch (err) { console.warn("Realtime attendance delivery skipped:", err.message); }
});
module.exports = events;
