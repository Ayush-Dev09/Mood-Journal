const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createTestimonial,
  getAllTestimonials,
} = require("../controllers/testimonialController");

// Routes
router.get("/", getAllTestimonials); // Publicly viewable
router.post("/", protect, createTestimonial); // Authenticated users only

module.exports = router;
