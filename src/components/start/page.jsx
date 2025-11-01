import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function StartInterview() {
  const { id } = useParams(); // matches <Route path="/interview/:id/start" ...>
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("❌ No interview ID found in URL.");
      return;
    }

    const result = localStorage.getItem(id);
    if (!result) {
      setError(`⚠️ No data found in localStorage for ID: ${id}`);
      setTimeout(() => navigate("/"), 2000);
      return;
    }

    try {
      const parsedData = JSON.parse(result);

      // ✅ Immediately redirect to QuestionList
      navigate("/questionlist", {
        state: { interviewData: parsedData, id },
      });
    } catch (parseErr) {
      console.error("JSON Parse Error:", parseErr);
      setError("❌ Failed to parse stored interview data.");
      setTimeout(() => navigate("/"), 2000);
    }
  }, [id, navigate]);

  return (
    <div style={styles.container}>
      {!error ? (
        <>
          <h1 style={styles.text}>🚀 Redirecting to questions...</h1>
          <p style={styles.subtext}>Please wait.</p>
        </>
      ) : (
        <>
          <h1 style={{ ...styles.text, color: "#dc2626" }}>Error Occurred</h1>
          <p style={{ ...styles.subtext, color: "#b91c1c" }}>{error}</p>
        </>
      )}
    </div>
  );
}

export default StartInterview;

// ---------- Inline Styles ----------
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f9fafb",
    fontFamily: "Poppins, sans-serif",
  },
  text: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#1e40af",
  },
  subtext: {
    marginTop: "10px",
    fontSize: "16px",
    color: "#374151",
  },
};
