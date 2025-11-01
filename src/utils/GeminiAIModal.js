import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// ✅ Use your Gemini API key from .env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

// ✅ Load the Gemini model
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-lite",
});

// ✅ Configuration for output style
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// ✅ Safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

// ✅ Function to generate interview questions
export async function generateInterviewQuestions(jobRole, jobDescription, experience) {
  try {
    // 🧠 Start chat session
    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `Job Position: ${jobRole}\nJob Description: ${jobDescription}\nYears of Experience: ${experience}`,
            },
          ],
        },
      ],
    });

    // 🎯 Ask model to generate JSON interview questions
    const prompt = `
      Generate 5 realistic interview questions and answers based on:
      - Job Role: ${jobRole}
      - Description: ${jobDescription}
      - Experience: ${experience} years
      Respond **only** in valid JSON format like this:
      [
        {"question":"...", "answer":"..."},
        {"question":"...", "answer":"..."}
      ]
    `;

    const result = await chatSession.sendMessage(prompt);

    // ✅ Extract and parse clean JSON
    const responseText = await result.response.text();
    console.log("🎯 Gemini Response:", responseText);

    // Clean up accidental formatting
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return parsed;
  } catch (error) {
    console.error("❌ Error generating interview questions:", error);
    return [];
  }
}
