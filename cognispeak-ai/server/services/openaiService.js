const { OpenAI } = require('openai');

// Initialize gracefully if key is missing
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'missing_key_fallback',
  });
} catch (e) {
  console.log("OpenAI init warning:", e.message);
}

exports.evaluateSpeech = async (original, transcript, pace) => {
  try {
    const prompt = `
      Evaluate the user's spoken English.
      Original sentence: "${original}"
      User transcript: "${transcript}"
      User speaking pace: ${pace} words per minute.

      Provide a structured JSON response with the following keys:
      - pronunciationScore (0-100)
      - fluencyScore (0-100)
      - feedbackNotes (A brief string with specific feedback on pronunciation and fluency)

      Make the scoring realistic based on the transcript's similarity to the original. 
      If the transcript is highly dissimilar, lower the scores.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI evaluation failed:', error);
    // Fallback if API fails or key is missing
    return {
      pronunciationScore: 70,
      fluencyScore: 70,
      feedbackNotes: "Unable to reach AI scoring service. Basic score applied."
    };
  }
};

exports.evaluateSpeakingTopic = async (topic, transcript) => {
  try {
    const prompt = `
      Evaluate the user's spoken response on the topic: "${topic}".
      User transcript: "${transcript}"

      Provide a structured JSON response with the following keys:
      - grammarIssues (Array of strings, list specific grammatical errors made)
      - vocabularyRange (String: "Basic", "Intermediate", or "Advanced")
      - confidenceIndicators (String: Feedback on confidence based on sentence completion and hedging language)
      - overallFeedback (String: General feedback on the response)

      Be constructive and objective.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI evaluation failed:', error);
    return {
      grammarIssues: ["Could not evaluate grammar due to AI service error."],
      vocabularyRange: "Intermediate",
      confidenceIndicators: "Unable to assess confidence.",
      overallFeedback: "AI scoring service is currently unavailable."
    };
  }
};

exports.evaluateEmail = async (scenario, emailText) => {
  try {
    const prompt = `
      Evaluate the following email based on the scenario provided.
      Scenario: "${scenario}"
      User's Email: "${emailText}"

      Provide a structured JSON response with the following keys:
      - grammarIssues (Array of strings, list specific grammatical errors made)
      - tone (String: e.g., "Professional", "Casual", "Aggressive")
      - format (String: Feedback on greeting, body paragraphs, and sign-off)
      - relevance (String: Does it adequately address the scenario?)
      - overallScore (Number 0-100)

      Be constructive and objective.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI evaluation failed:', error);
    return {
      grammarIssues: ["Could not evaluate grammar due to AI service error."],
      tone: "Unknown",
      format: "Unable to assess.",
      relevance: "Unable to assess.",
      overallScore: 0
    };
  }
};
