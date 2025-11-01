import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Webcam from "react-webcam";

function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showWebcam, setShowWebcam] = useState(false);

  // ✅ Get interview data from localStorage
  const data = JSON.parse(localStorage.getItem(id));

  if (!data) {
    return (
      <div style={styles.centerBox}>
        <h2>❌ Interview not found</h2>
        <button style={styles.primaryBtn} onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* ---------- HEADER ---------- */}
      <header style={styles.header}>
        <h1>Let's Get Started</h1>
      </header>

      <div style={styles.mainContainer}>
        {/* ---------- LEFT SIDE JOB INFO ---------- */}
        <div style={styles.leftBox}>
          <div style={styles.infoCard}>
            <p>
              <strong>Job Role / Job Title:</strong>{" "}
              {data.jobPosition || "Not Provided"}
            </p>
            <p>
              <strong>Job Description / Tech Stack:</strong>{" "}
              {data.jobDesc || "Not Provided"}
            </p>
            <p>
              <strong>Years of Experience:</strong>{" "}
              {data.jobExperience || "Not Provided"}
            </p>
          </div>

          <div style={styles.infoBox}>
            <p style={styles.infoTitle}>💡 Information</p>
            <p style={styles.infoText}>
              Enable Video Web Cam and Microphone to start your AI-generated
              Mock Interview.
              <br />
              <br />
              <strong>NOTE:</strong> Your video is never recorded. You can
              disable webcam access anytime.
            </p>
          </div>
        </div>

        {/* ---------- RIGHT SIDE WEBCAM ---------- */}
        <div style={styles.rightBox}>
          <div style={styles.webcamArea}>
            {showWebcam ? (
              <Webcam
                audio={true}
                height={300}
                width={300}
                mirrored={true}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  width: 300,
                  height: 300,
                  facingMode: "user",
                }}
              />
            ) : (
              <div style={styles.webcamPlaceholder}>
                <span style={styles.webcamIcon}>📷</span>
              </div>
            )}
          </div>

          {/* Enable Webcam Button */}
          <button
            style={styles.enableBtn}
            onClick={() => setShowWebcam(!showWebcam)}
          >
            {showWebcam
              ? "Disable Web Cam and Microphone"
              : "Enable Web Cam and Microphone"}
          </button>

          {/* ✅ Corrected Link path */}
         {showWebcam && (
  <Link
    to={`/interview/${id}/start`} // ✅ Correct dynamic route
    style={{ textDecoration: "none" }}
  >
    <button
      style={{
        ...styles.enableBtn,
        backgroundColor: "#22c55e",
        marginTop: "15px",
        transition: "opacity 0.4s ease",
      }}
    >
      🚀 Start Interview
    </button>
  </Link>
)}

        </div>
      </div>
    </div>
  );
}

export default InterviewPage;

// ---------- Inline Styles ----------
const styles = {
  page: {
    fontFamily: "Poppins, sans-serif",
    backgroundColor: "#fff",
    minHeight: "100vh",
    padding: "40px 60px",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  mainContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "40px",
    flexWrap: "wrap",
  },
  leftBox: {
    flex: 1,
    minWidth: "300px",
  },
  infoCard: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    padding: "15px",
    marginBottom: "20px",
  },
  infoBox: {
    backgroundColor: "#fef9c3",
    border: "1px solid #fde047",
    borderRadius: "10px",
    padding: "15px",
  },
  infoTitle: {
    fontWeight: "600",
    color: "#b45309",
    marginBottom: "5px",
  },
  infoText: {
    color: "#555",
    lineHeight: 1.5,
    fontSize: "14px",
  },
  rightBox: {
    flex: 1,
    minWidth: "300px",
    textAlign: "center",
  },
  webcamArea: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },
  webcamPlaceholder: {
    height: "300px",
    width: "300px",
    borderRadius: "10px",
    border: "2px dashed #ccc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  webcamIcon: {
    fontSize: "3rem",
    color: "#9ca3af",
  },
  enableBtn: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "12px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "0.3s",
  },
  primaryBtn: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  centerBox: {
    textAlign: "center",
    marginTop: "60px",
  },
};
