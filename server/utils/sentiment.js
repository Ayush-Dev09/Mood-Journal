// analyze.js
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

// Map sentiment score to mood, emoji, and color
const getMoodLabel = (score) => {
  if (score >= 4) return { mood: "Happy", emoji: "😊", color: "green" };
  if (score >= 1) return { mood: "Content", emoji: "🙂", color: "lightgreen" };
  if (score === 0) return { mood: "Neutral", emoji: "😐", color: "gray" };
  if (score >= -2) return { mood: "Sad", emoji: "😟", color: "orange" };
  return { mood: "Very Sad", emoji: "😢", color: "red" };
};

// Main analyzer function
const analyze = (content) => {
  const result = sentiment.analyze(content);
  const score = result.score;

  const moodResult = getMoodLabel(score);

  return {
    score,
    comparative: result.comparative, // optional, useful for longer texts
    words: result.words,             // optional, words matched
    ...moodResult,                   // mood, emoji, color
  };
};

module.exports = analyze;
