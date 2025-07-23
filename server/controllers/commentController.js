const Comment = require("../models/Comment");
const Post = require("../models/Post");
const mongoose = require("mongoose");

// Create a new comment and add it to a post
const addComment = async (req, res) => {
  try {
    const { content, postId, userId } = req.body;

    // Validate ObjectId for post and user
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create and save comment
    const comment = new Comment({
      content,
      author: userId,
      post: postId,
    });

    const savedComment = await comment.save();

    // Add comment reference to post's comments array
    post.comments.push(savedComment._id);
    await post.save();

    res.status(201).json(savedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add comment", details: err.message });
  }
};

// Get comments by post ID
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const comments = await Comment.find({ post: postId }).populate("author", "name email");
    res.status(200).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch comments", details: err.message });
  }
};

// Delete comment by comment ID
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const deleted = await Comment.findByIdAndDelete(commentId);

    if (!deleted) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Remove comment reference from post's comments array
    await Post.findByIdAndUpdate(deleted.post, { $pull: { comments: commentId } });

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete comment", details: err.message });
  }
};

module.exports = {
  addComment,
  getCommentsByPost,
  deleteComment,
};
