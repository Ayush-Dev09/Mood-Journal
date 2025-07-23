const mongoose = require("mongoose");
const User = require("../models/User");

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const id = req.query.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(id).select("-__v -createdAt -updatedAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by email
const getUserByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: "Email query param is required" });
    }

    const user = await User.findOne({ email }).select("-__v -createdAt -updatedAt");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Register new user
const registerUser = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    // Check if user already exists
    const exists = await User.exists({ email });
    if (exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Create and save new user
    const newUser = new User({ name, email });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getUserById,
  getUserByEmail,
  registerUser,
};
