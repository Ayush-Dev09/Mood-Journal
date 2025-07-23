const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { getMoodAnalytics } = require("../controllers/analyticsController");

router.get("/mood", protect, getMoodAnalytics);

module.exports = router;
