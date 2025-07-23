const mongoose = require("mongoose");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const analyze = require("../utils/nlp");

// Sentiment analyzer endpoint logic
const sentimentAnalyzer = (req, res) => {
  const content = req.params.content;
  const sentiment = analyze(content);
  res.status(200).json({ sentiment });
};

// Get all visible posts
const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({ visibility: true })
      .populate("author", "username") // Include username of author
      .populate("comments");
    res.json(allPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get posts by user ID
const getPostsByUser = async (req, res) => {
  try {
    const userId = req.params.userId;  // Changed from req.query to req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const userPosts = await Post.find({ author: userId }).populate("comments");
    res.status(200).json(userPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get post by post ID
const getPostById = async (req, res) => {
  try {
    const id = req.params.id;  // Changed from req.query to req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const post = await Post.findById(id)
      .populate("comments")
      .populate("author", "username");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new post
const createNewPost = async (req, res) => {
  try {
    console.log("Create post body:", req.body);

    const { title, content, visibility, author_id } = req.body;

    if (!mongoose.Types.ObjectId.isValid(author_id)) {
      return res.status(400).json({ error: "Invalid author ID" });
    }

    const analysis = analyze(content);

    const newPost = new Post({
      title,
      content,
      visibility,
      author: author_id,
      likes_count: 0,
      sentiment: analysis.score,
      mood: analysis.mood,
      moodEmoji: analysis.emoji,
      moodColor: analysis.color,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a post by ID
const deletePostById = async (req, res) => {
  try {
    const postId = req.params.id;  // Use req.params here for RESTful delete route
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({ error: "Invalid post ID" });
    }

    const deleted = await Post.findByIdAndDelete(postId);
    if (!deleted) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ success: true, msg: "Post deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new comment to a post
const addNewComment = async (req, res) => {
  try {
    const postId = req.params.id;  // Get postId from req.params to match route
    const { content, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid post or user ID" });
    }

    const comment = new Comment({
      content,
      date: new Date(),
      author: userId,
    });
    await comment.save();

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: comment._id },
    });

    const updatedPost = await Post.findById(postId).populate("comments");
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  sentimentAnalyzer,
  getAllPosts,
  getPostsByUser,
  getPostById,
  createNewPost,
  deletePostById,
  addNewComment,
};
