const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  getUserById,
  getUserByEmail,
  registerUser,
} = require("../controllers/authController");

// Protect sensitive user data routes with Firebase auth middleware
router.get("/get-user-by-id", protect, getUserById);
router.get("/get-user-by-email", protect, getUserByEmail);

// Usually registration route remains public
router.post("/register", registerUser);

module.exports = router;
