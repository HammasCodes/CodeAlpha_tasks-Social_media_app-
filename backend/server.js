const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
const commentRoutes = require("./routes/comments");
app.use("/api/comments", commentRoutes);

const userRoutes = require("./routes/users");
app.use("/api/users", userRoutes);

const postRoutes = require("./routes/posts");
app.use("/api/posts", postRoutes);

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Social Media API is running");
});

// Server listen
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
