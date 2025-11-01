"use client";
import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast, { Toaster } from "react-hot-toast";
import Webcam from "react-webcam";

function InterviewPage() {
  const questions = [
    { id: 1, text: "Describe your experience with React." },
    { id: 2, text: "Explain how the virtual DOM works." },
    { id: 3, text: "What are React Hooks? Name some commonly used hooks." },
    { id: 4, text: "Differentiate between state and props in React." },
    { id: 5, text: "How do you optimize React applications for performance?" },
  ];

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [chatSession, setChatSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [webcamEnabled, setWebcamEnabled] = useState(true);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [overallFeedback, setOverallFeedback] = useState("");

  const webcamRef = useRef(null);
  const interviewSummaryRef = useRef([]);

  // ✅ Initialize Gemini AI
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      toast.error("❌ Missing Gemini API key in .env");
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
      const session = model.startChat({ history: [] });
      setChatSession(session);
    } catch (error) {
      console.error("Gemini initialization failed:", error);
      toast.error("⚠️ AI initialization failed.");
    }
  }, []);

  // 🎤 Setup Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("❌ Speech recognition not supported in this browser.");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.continuous = true; // ✅ allow longer sentences

    recog.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      setResults((prev) => [...prev, { transcript }]);
    };

    recog.onend = () => {
      setIsListening(false);
      toast("🛑 Listening stopped.");
    };

    recog.onerror = (err) => {
      console.error("Speech recognition error:", err);
      setIsListening(false);
      toast.error("🎙 Voice input failed. Try again.");
    };

    setRecognition(recog);
  }, []);

  const startSpeechToText = () => {
    if (!recognition) return toast.error("Speech recognition not ready.");
    setResults([]);
    setIsListening(true);
    recognition.start();
    toast("🎤 Listening... Speak clearly!");
  };

  const stopSpeechToText = () => {
    if (!recognition) return;
    recognition.stop();
    setIsListening(false);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 💾 Save Answer + AI Feedback
  const SaveAnswer = async () => {
    const userAnswer = results.map((r) => r.transcript).join(" ").trim();

    if (!userAnswer || userAnswer.split(" ").length < 3) {
      toast.error("⚠️ Please speak a complete answer before saving.");
      return;
    }

    if (!chatSession) {
      toast.error("AI not ready yet. Try again later.");
      return;
    }

    toast.loading("🧠 Analyzing your answer...");
    setLoading(true);

    try {
      const feedbackPrompt = `
      Question: ${questions[activeQuestionIndex].text}
      User Answer: ${userAnswer}
      Give a rating (1-5) and feedback in JSON only.
      Example: {"rating":4,"feedback":"Good start but add more detail."}
      `;

      const result = await chatSession.sendMessage(feedbackPrompt);
      const rawText = (await result.response.text()).replace(/json|```/g, "");
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      const parsed =
        jsonMatch && jsonMatch[0]
          ? JSON.parse(jsonMatch[0])
          : { rating: 3, feedback: "Could not parse AI feedback." };

      const feedbackData = {
        question: questions[activeQuestionIndex].text,
        userAnswer,
        feedback: parsed.feedback,
        rating: parsed.rating,
        timestamp: new Date().toISOString(),
      };

      interviewSummaryRef.current.push(feedbackData);
      localStorage.setItem(
        "interviewSummary",
        JSON.stringify(interviewSummaryRef.current)
      );

      toast.dismiss();
      toast.success("✅ Feedback saved!");
      stopSpeechToText();

      await sleep(1000);
      if (activeQuestionIndex < questions.length - 1) {
        setActiveQuestionIndex((prev) => prev + 1);
      } else {
        toast.success("🎉 Interview Complete!");
        setSummaryData(interviewSummaryRef.current);
        setShowSummary(true);
        generateOverallFeedback(interviewSummaryRef.current);
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.dismiss();
      toast.error("❌ Failed to generate feedback.");
    } finally {
      setLoading(false);
    }
  };

  // 🧠 Generate overall feedback
  const generateOverallFeedback = async (summaryArray) => {
    try {
      const combinedFeedback = summaryArray
        .map(
          (f, i) =>
            `Q${i + 1}: ${f.question}\nAnswer: ${f.userAnswer}\nRating: ${f.rating}\nFeedback: ${f.feedback}`
        )
        .join("\n\n");

      const prompt = `
      Based on the following interview feedback, summarize the candidate's strengths
      and weaknesses in 4-5 lines.\n\n${combinedFeedback}
      `;

      const result = await chatSession.sendMessage(prompt);
      const summaryText = await result.response.text();
      setOverallFeedback(summaryText);
    } catch (err) {
      console.error("AI Summary Error:", err);
      setOverallFeedback("⚠️ Could not generate overall feedback.");
    }
  };

  // 🧾 Summary Page
  if (showSummary) {
    return (
      <div
        style={{
          padding: "40px 20px",
          backgroundColor: "#f9fafb",
          minHeight: "100vh",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <Toaster position="top-center" />
        <h1 style={{ textAlign: "center", color: "#1d4ed8" }}>
          🧾 Interview Summary
        </h1>

        <div
          style={{
            maxWidth: "800px",
            margin: "30px auto",
            background: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          {summaryData.map((item, i) => (
            <div
              key={i}
              style={{
                marginBottom: "20px",
                padding: "15px",
                background: "#eef2ff",
                borderRadius: "8px",
              }}
            >
              <strong>Q{i + 1}: {item.question}</strong>
              <p><strong>Your Answer:</strong> {item.userAnswer}</p>
              <p>⭐ <strong>Rating:</strong> {item.rating}/5</p>
              <p><strong>Feedback:</strong> {item.feedback}</p>
            </div>
          ))}

          <div
            style={{
              marginTop: "30px",
              padding: "15px",
              background: "#e0f2fe",
              borderRadius: "10px",
            }}
          >
            <h3>💡 Overall AI Summary</h3>
            <p>{overallFeedback || "Generating summary..."}</p>
          </div>
        </div>
      </div>
    );
  }

  // 🎯 Interview Page
  return (
    <div
      style={{
        padding: "40px 20px",
        backgroundColor: "#f9fafb",
        minHeight: "100vh",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <Toaster position="top-center" />
      <h1 style={{ textAlign: "center", color: "#1d4ed8" }}>
        🎯 Mock React Interview
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "30px",
          flexWrap: "wrap",
          marginTop: "30px",
        }}
      >
        {/* Webcam */}
        <div
          style={{
            flex: "1",
            minWidth: "300px",
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <h3>🎥 Candidate Webcam</h3>
          {webcamEnabled ? (
            <Webcam
              ref={webcamRef}
              audio={false}
              height={250}
              width="100%"
              screenshotFormat="image/jpeg"
              videoConstraints={{ facingMode: "user" }}
              style={{
                borderRadius: "10px",
                border: "2px solid #1d4ed8",
                marginTop: "10px",
              }}
            />
          ) : (
            <p style={{ color: "#64748b" }}>Webcam off.</p>
          )}
          <button
            onClick={() => setWebcamEnabled(!webcamEnabled)}
            style={{
              marginTop: "15px",
              padding: "8px 16px",
              background: webcamEnabled ? "#dc2626" : "#16a34a",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            {webcamEnabled ? "🛑 Stop Webcam" : "🎥 Start Webcam"}
          </button>
        </div>

        {/* Question Section */}
        <div
          style={{
            flex: "2",
            minWidth: "300px",
            background: "white",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          }}
        >
          <h2>
            Question {activeQuestionIndex + 1} of {questions.length}
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#333",
              marginBottom: "20px",
            }}
          >
            {questions[activeQuestionIndex].text}
          </p>

          <div style={{ marginBottom: "15px" }}>
            <button
              onClick={startSpeechToText}
              disabled={isListening}
              style={{
                background: "#2563eb",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              🎤 Start
            </button>

            <button
              onClick={stopSpeechToText}
              disabled={!isListening}
              style={{
                background: "#dc2626",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                marginRight: "10px",
                cursor: "pointer",
              }}
            >
              🛑 Stop
            </button>

            <button
              onClick={SaveAnswer}
              disabled={loading || results.length === 0}
              style={{
                background: "#16a34a",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: results.length === 0 ? "not-allowed" : "pointer",
              }}
            >
              💾 {loading ? "Saving..." : "Save Answer"}
            </button>
          </div>

          <div
            style={{
              background: "#eef2ff",
              padding: "15px",
              borderRadius: "8px",
              color: "#1e3a8a",
            }}
          >
            <strong>Your Voice Transcript:</strong>
            <p>{results.map((r) => r.transcript).join(" ") || "No answer yet..."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;
