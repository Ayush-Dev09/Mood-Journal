// server/controllers/analyticsController.js
const Post  = require("../models/Post");
const User  = require("../models/User");

const getMoodAnalytics = async (req, res) => {
  try {
    const email = req.user.email; // From Firebase Auth middleware
    const mongoUser = await User.findOne({ email });

    if (!mongoUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const userId = mongoUser._id;

    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const posts = await Post.find({
      author: userId,
      createdAt: { $gte: last30Days },
    });

    if (!posts.length) {
      return res.status(200).json({
        averageMoodRating: null,
        moodFrequency: {},
        totalPosts: 0,
        message: "No mood data available.",
      });
    }

    const moodCount = {};
    let moodSum = 0;
    let count = 0;

    posts.forEach((post) => {
      const mood = post.mood;
      if (mood) {
        moodCount[mood] = (moodCount[mood] || 0) + 1;
        if (typeof post.sentiment !=null) {
          moodSum += parseFloat(post.sentiment.toString());
          count++;
        }
      }
    });

    const averageMood = count ? (moodSum / count).toFixed(2) : null;

    res.status(200).json({
      averageMoodRating: averageMood,
      moodFrequency: moodCount,
      totalPosts: posts.length,
    });
  } catch (error) {
    console.error("Error in mood analytics:", error);
    res.status(500).json({ error: "Error generating mood analytics" });
  }
};

module.exports = { getMoodAnalytics };
