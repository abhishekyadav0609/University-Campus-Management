const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (req, res) => res.json({
  success: true,
  message: "University Campus Management API is running",
  endpoints: "/api"
}));
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);
module.exports = app;
