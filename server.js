require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
}
start().catch((err) => {
  console.error("Server startup failed:", err.message);
  process.exit(1);
});
