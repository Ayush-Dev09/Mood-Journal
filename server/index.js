require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDb = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes"); // 🆕
const therapyRoutes = require("./routes/therapyRoutes");
const testimonialRoutes = require("./routes/testimonialRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const quoteRoutes = require("./routes/quoteRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDb();

// Middleware
app.use(express.json()); // Replaces body-parser
app.use(cors());
app.use(morgan("tiny"));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes); // 🆕
app.use("/api/therapy", therapyRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/quote", quoteRoutes);


// Error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running on port ${port}`);
});
