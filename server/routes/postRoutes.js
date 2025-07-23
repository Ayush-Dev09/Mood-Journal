// routes/postRoutes.js
const express = require("express");
const router = express.Router();

const {
  sentimentAnalyzer,
  getAllPosts,
  getPostsByUser,
  getPostById,
  createNewPost,
  deletePostById,
  addNewComment,
} = require("../controllers/postController");

// REST-style routes
router.get("/sentiment/:content", sentimentAnalyzer);        // Analyze sentiment of content
router.get("/", getAllPosts);                                // Get all visible posts
router.get("/user/:userId", getPostsByUser);                 // Get posts by user ID
router.get("/:id", getPostById);                             // Get post by post ID
router.post("/", createNewPost);                             // Create a new post
router.post("/:id/comments", addNewComment);                 // Add comment to post
router.delete("/:id", deletePostById);                       // Delete post by ID

module.exports = router;

