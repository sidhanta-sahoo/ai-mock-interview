import { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import AddNewInterview from "./components/AddNewInterview";
import InterviewPage from "./components/InterviewPage";
import StartInterview from "./components/start/page";
import QuestionList from "./components/QuestionList";

function Dashboard() {
  const [showInterview, setShowInterview] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleDashboard = () => {
    setShowInterview(false);
    setShowUpgrade(false);
    setShowHelp(false);
    setMenuOpen(false);
  };

  return (
    <div className="app">
      {/* ---------- HEADER ---------- */}
      <header className="navbar">
        <div className="logo">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712102.png"
            alt="AI Interview Logo"
          />
          <h2>AI Mock Pro</h2>
        </div>

        <div
          className={`menu-icon ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <button className="link-btn" onClick={handleDashboard}>
            Dashboard
          </button>
          <button
            className="link-btn"
            onClick={() => {
              setShowInterview(true);
              setShowUpgrade(false);
              setShowHelp(false);
              setMenuOpen(false);
            }}
          >
            Questions
          </button>
          <button
            className="link-btn"
            onClick={() => {
              setShowUpgrade(true);
              setShowInterview(false);
              setShowHelp(false);
              setMenuOpen(false);
            }}
          >
            Upgrade
          </button>
          <button
            className="link-btn"
            onClick={() => {
              setShowHelp(true);
              setShowInterview(false);
              setShowUpgrade(false);
              setMenuOpen(false);
            }}
          >
            Help
          </button>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="signin-btn">Sign In</button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </header>

      {/* ---------- MAIN SECTION ---------- */}
      {!showInterview && !showUpgrade && !showHelp && (
        <main className="hero-section">
          <div className="hero-left">
            <h1>Master Every Interview with AI</h1>
            <p>
              Generate smart, tailored questions powered by AI. Practice
              effectively and get real feedback to boost your confidence.
            </p>
            <button className="cta-btn" onClick={() => setShowInterview(true)}>
              Start Your Journey 🚀
            </button>
          </div>

          <div className="hero-right">
            <img
              src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
              alt="AI Interview Illustration"
            />
          </div>
        </main>
      )}

      {/* ---------- INTERVIEW SECTION ---------- */}
      {showInterview && !showUpgrade && !showHelp && (
        <section className="generator-section">
          <div className="generator-card">
            <h2>🎯 Generate Your AI Interview</h2>
            <p>Enter job details to generate personalized interview questions.</p>
            <AddNewInterview />
            <button className="back-btn" onClick={handleDashboard}>
              ⬅ Back to Home
            </button>
          </div>
        </section>
      )}

      {/* ---------- UPGRADE SECTION ---------- */}
      {showUpgrade && !showHelp && (
        <section className="upgrade-section">
          <h2>💎 Choose Your Plan</h2>
          <p>Select the perfect plan for your interview preparation journey.</p>

          <div className="plans-container">
            {/* -------- FREE PLAN -------- */}
            <div className="plan-card free">
              <h3>Free Plan</h3>
              <p>Get started with basic AI interview questions.</p>
              <ul>
                <li>✅ 5 AI Questions per day</li>
                <li>✅ Access to Question Generator</li>
                <li>🚫 No analytics or feedback</li>
              </ul>
              <button
                className="choose-btn free-btn"
                onClick={() => {
                  setShowInterview(true);
                  setShowUpgrade(false);
                  setShowHelp(false);
                }}
              >
                Continue with Free
              </button>
            </div>

            {/* -------- PRO PLAN -------- */}
            <div className="plan-card pro highlight">
              <h3>Pro Plan</h3>
              <p>Unlock advanced AI interview tools and insights.</p>
              <ul>
                <li>✅ Unlimited AI Questions</li>
                <li>✅ Real-time Feedback</li>
                <li>✅ Performance Reports</li>
              </ul>
              <button className="choose-btn pro-btn">Upgrade to Pro</button>
            </div>

            {/* -------- ENTERPRISE PLAN -------- */}
            <div className="plan-card enterprise">
              <h3>Enterprise</h3>
              <p>Perfect for teams or organizations preparing together.</p>
              <ul>
                <li>✅ Team Access & Admin Control</li>
                <li>✅ Custom AI Question Bank</li>
                <li>✅ Dedicated Support</li>
              </ul>
              <button className="choose-btn enterprise-btn">Contact Sales</button>
            </div>
          </div>

          <button className="back-btn" onClick={handleDashboard}>
            ⬅ Back to Home
          </button>
        </section>
      )}

      {/* ---------- HELP SECTION ---------- */}
      {showHelp && (
        <section className="help-section">
          <div className="help-header">
            <h2>🧠 Help & Support</h2>
            <p>
              Need assistance? We’re here to guide you through every step of your AI interview journey.
              Fill out the form below and we’ll respond within 24 hours.
            </p>
          </div>

          <div className="help-container">
            {/* Left Side Image */}
            <div className="help-image">
              <img
                src="data:image/jpeg;base64,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"
                alt="Support Illustration"
              />
            </div>

            {/* Right Side Form */}
            <div className="help-form">
              <h3>Contact Our Support Team</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("✅ Your message has been sent successfully!");
                }}
              >
                <input type="text" placeholder="Your Name" required />
                <input type="email" placeholder="Your Email" required />
                <textarea placeholder="Your Message" rows="5" required></textarea>
                <button type="submit">Send Message</button>
              </form>
              <p className="assurance">✅ We’ll get back to you within 24 hours.</p>

              <button className="back-btn" onClick={handleDashboard}>
                ⬅ Back to Home
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ---------- FOOTER ---------- */}
      <footer className="footer">
        <p>© 2025 AI Mock Pro | Crafted with ❤️ using React & Clerk</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* 📄 Interview detail page */}
        <Route path="/interview/:id" element={<InterviewPage />} />

        {/* 🚀 Start interview page */}
        <Route path="/interview/:id/start" element={<StartInterview />} />

        {/* 🧠 Question list page */}
        <Route path="/questionlist" element={<QuestionList />} />
      </Routes>
    </BrowserRouter>
  );
}
