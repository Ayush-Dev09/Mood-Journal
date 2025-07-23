const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes_count: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    sentiment: {
      type: mongoose.Decimal128,
      default: 0.0,
    },
    mood: {
      type: String, // e.g., "Happy", "Sad", "Neutral"
    },
    moodEmoji: {
      type: String, // e.g., "😊", "😢", "😐"
    },
    moodColor: {
      type: String, // e.g., "green", "red", "gray"
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
