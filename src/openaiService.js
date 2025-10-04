import OpenAI from "openai";

// Use your API key (store in .env later for safety)
const client = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // since this is frontend-only
});

export async function generateQuiz(topic) {
  const prompt = `Generate 3 multiple-choice quiz questions about ${topic}.
  Format as JSON:
  [
    {
      "question": "string",
      "options": ["a", "b", "c", "d"],
      "answer": "correct option"
    }
  ]`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // Parse JSON response
    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
}
