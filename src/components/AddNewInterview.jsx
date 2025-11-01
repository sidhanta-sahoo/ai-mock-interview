import React, { useState } from "react";
import "./AddNewInterview.css";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import moment from "moment";
import { useNavigate } from "react-router-dom"; // ✅ For redirecting to /interview/:id

const AddNewInterview = () => {
  const [formData, setFormData] = useState({
    jobPosition: "",
    jobDesc: "",
    jobExperience: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ React Router navigation

  // ✅ Initialize Gemini Model
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { jobPosition, jobDesc, jobExperience } = formData;

      // ✅ Generate unique interview ID & timestamp
      const interviewId = uuidv4();
      const createdAt = moment().format("YYYY-MM-DD HH:mm:ss");

      console.log("🆔 Interview ID:", interviewId);
      console.log("🕒 Created At:", createdAt);

      // ✅ Create chat session
      const chatSession = model.startChat({
        generationConfig: {
          temperature: 0.8,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 1024,
          responseMimeType: "text/plain",
        },
      });

      // ✅ Improved prompt for clean JSON response
      const inputPrompt = `
You are an AI interviewer.

Generate exactly 5 realistic interview questions and answers based on:
- Job Position: ${jobPosition}
- Job Description: ${jobDesc}
- Years of Experience: ${jobExperience}

Return your response in pure JSON format only, no markdown or explanations.

Example format:
{
  "questions": [
    {"question": "string", "answer": "string"},
    {"question": "string", "answer": "string"},
    {"question": "string", "answer": "string"},
    {"question": "string", "answer": "string"},
    {"question": "string", "answer": "string"}
  ]
}
`;

      // ✅ Send request to Gemini
      const result = await chatSession.sendMessage(inputPrompt);
      let responseText = result.response.text();

      console.log("🧠 Raw Gemini Output:\n", responseText);

      // 🧹 Clean Gemini output safely
      responseText = responseText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      // ✅ Extract only JSON between { ... }
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      let parsedOutput;

      if (jsonMatch) {
        try {
          parsedOutput = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.warn("⚠️ JSON parsing failed, showing raw text instead:", e);
          parsedOutput = { rawText: responseText };
        }
      } else {
        parsedOutput = { rawText: responseText };
      }

      // ✅ Prepare structured data
      const interviewData = {
        id: interviewId,
        createdAt,
        ...formData,
        generatedQuestions: parsedOutput,
      };

      console.log("📦 Full Interview Data:", interviewData);

      // ✅ Save locally (temporary storage)
      localStorage.setItem(interviewId, JSON.stringify(interviewData));

      // ✅ Redirect user to interview page with unique ID
      navigate(`/interview/${interviewId}`);
    } catch (err) {
      console.error("❌ Error generating interview:", err);
      alert("Something went wrong while generating interview questions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interview-container">
      <div className="form-card">
        <h2 className="form-title">🧠 Add New Interview</h2>
        <p className="form-subtitle">
          Enter job details below to generate AI-powered interview questions.
        </p>

        {/* Interview Form */}
        <form className="interview-form" onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="jobPosition">Job Position</label>
            <input
              type="text"
              id="jobPosition"
              name="jobPosition"
              value={formData.jobPosition}
              onChange={handleChange}
              placeholder="e.g. Frontend Developer"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobDesc">Job Description</label>
            <textarea
              id="jobDesc"
              name="jobDesc"
              value={formData.jobDesc}
              onChange={handleChange}
              rows="5"
              placeholder="e.g. Build responsive UI using React and Tailwind CSS..."
              required
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="jobExperience">Years of Experience</label>
            <input
              type="number"
              id="jobExperience"
              name="jobExperience"
              value={formData.jobExperience}
              onChange={handleChange}
              placeholder="e.g. 2"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "⏳ Generating from AI..." : "🚀 Generate Interview"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddNewInterview;
