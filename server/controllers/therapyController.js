require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

const therapyChat = async (req, res) => {
  console.log("GPT therapy request received");
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ success: false, error: "Prompt is required" });
  }

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a compassionate mental health therapist bot. Respond empathetically and help users manage their emotions.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });

    return res.status(200).json({
      success: true,
      data: response.data.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return res.status(400).json({
      success: false,
      error: error.response?.data || "There was an issue with the therapy chat.",
    });
  }
};

module.exports = { therapyChat };
