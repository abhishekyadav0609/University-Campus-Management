const { io } = require("socket.io-client");

const token = process.argv[2];

if (!token) {
  console.log("Please provide an access token.");
  process.exit(1);
}

const socket = io("http://localhost:5000", {
  auth: { token }
});

socket.on("connect", () => {
  console.log("Socket connected successfully!");
  console.log("Socket ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Connection error:", error.message);
});

socket.on("attendance:updated", (record) => {
  console.log("Live attendance notification received:");
  console.log(record);
});

socket.on("announcement:new", (announcement) => {
  console.log("Live announcement received:");
  console.log(announcement);
});