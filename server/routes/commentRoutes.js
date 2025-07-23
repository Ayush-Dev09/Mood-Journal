const express = require("express");
const router = express.Router();

const {
  addComment,
  getCommentsByPost,
  deleteComment,
} = require("../controllers/commentController");

router.post("/add", addComment);             // POST /api/comment/add
router.get("/post/:postId", getCommentsByPost);  // GET /api/comment/post/:postId
router.delete("/delete/:commentId", deleteComment);  // DELETE /api/comment/delete/:commentId

module.exports = router;
