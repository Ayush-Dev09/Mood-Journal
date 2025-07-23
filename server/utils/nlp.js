const natural = require("natural");
const aposToLexForm = require("apos-to-lex-form");
const SpellCorrector = require("spelling-corrector");
const SW = require("stopword");

const spellCorrector = new SpellCorrector();
spellCorrector.loadDictionary();

const getMoodLabel = (score) => {
  if (score >= 3) return { mood: "Happy", emoji: "😊", color: "green" };
  if (score > 0) return { mood: "Content", emoji: "🙂", color: "lightgreen" };
  if (score === 0) return { mood: "Neutral", emoji: "😐", color: "gray" };
  if (score > -1) return { mood: "Sad", emoji: "😟", color: "orange" };
  return { mood: "Very Sad", emoji: "😢", color: "red" };
};

const analyze = (content) => {
  const lexedContent = aposToLexForm(content);
  const casedContent = lexedContent.toLowerCase();
  const alphaOnlyContent = casedContent.replace(/[^a-zA-Z\s]+/g, "");

  const { WordTokenizer } = natural;
  const tokenizer = new WordTokenizer();
  const tokenizedContent = tokenizer.tokenize(alphaOnlyContent);

  tokenizedContent.forEach((word, index) => {
    tokenizedContent[index] = spellCorrector.correct(word);
  });

  const filteredContent = SW.removeStopwords(tokenizedContent);

  const { SentimentAnalyzer, PorterStemmer } = natural;
  const analyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");
  const sentimentScore = analyzer.getSentiment(filteredContent);

  const moodResult = getMoodLabel(sentimentScore);

  return {
    score: sentimentScore,
    ...moodResult, // Adds mood, emoji, and color
  };
};

module.exports = analyze;
