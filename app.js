const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const imageRoutes = require("./routes/imageRoutes");
const apiRouter = require("./routes/api");
const cors = require("cors"); // Import CORS middleware

require("dotenv").config();

require("./config/db");

const app = express();
app.use(cors());

app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/images", imageRoutes);
app.use("/api", apiRouter);

app.get("/", (req, res) => {
  res.send("server Running");
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
