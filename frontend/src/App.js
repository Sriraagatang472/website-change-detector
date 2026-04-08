import { useState } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [type, setType] = useState("");
  const [diff, setDiff] = useState("");
  const [loading, setLoading] = useState(false);

  const checkWebsite = async () => {
    if (!url) return;

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/check", { url });

      setResult(res.data.message);
      setType(res.data.type);
      setDiff(res.data.diff);
    } catch {
      setResult("Error checking website");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        fontFamily: "Arial",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* DOODLES */}
      <div
        style={{
        position: "absolute",
      bottom: "-80px",
       right: "-80px",
        width: "250px",
        height: "250px",
        background: "#9c9cc2",
        borderRadius: "50%",
        opacity: 0.2,
        }}
      />

      <div
        style={{
          position: "absolute",
          bottom: "100px",
          right: "80px",
          width: "200px",
          height: "200px",
          background: "#a5b4fc",
          borderRadius: "50%",
          opacity: 0.3,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "200px",
          right: "200px",
          width: "10px",
          height: "10px",
          background: "#6366f1",
          borderRadius: "50%",
        }}
      />

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "100px 20px" }}>
        <p
          style={{
            letterSpacing: "8px",
            fontSize: "12px",
            color: "#64748b",
          }}
        >
          REAL-TIME WEBSITE MONITORING
        </p>

        <h1
          style={{
            fontSize: "60px",
            fontWeight: "bold",
            background: "linear-gradient(90deg, #8b5cf6, #6366f1)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Monitor website changes
        </h1>

        <p style={{ marginTop: "15px", color: "#64748b" }}>
          Track updates and detect differences instantly.
        </p>

        {/* INPUT */}
        <div style={{ marginTop: "30px" }}>
          <input
            type="text"
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{
              padding: "15px",
              width: "350px",
              borderRadius: "10px 0 0 10px",
              border: "1px solid #e2e8f0",
            }}
          />

          <button
            onClick={checkWebsite}
            style={{
              padding: "15px 25px",
              background: "#6b6ca7",
              color: "white",
              border: "none",
              borderRadius: "0 10px 10px 0",
            }}
          >
            {loading ? "Checking..." : "Go"}
          </button>
        </div>

        <h3 style={{ marginTop: "20px" }}>{result}</h3>
        <h4>{type}</h4>
      </div>

      {/* STEPS */}
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>How it works</h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            marginTop: "30px",
          }}
        >
          {[
            "Enter website URL",
            "Detect changes",
            "View differences",
          ].map((step, i) => (
            <div
              key={i}
              style={{
                width: "250px",
                padding: "20px",
                borderRadius: "15px",
                background: "#d5cadb",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              }}
            >
              <h3>Step {i + 1}</h3>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* DIFF */}
      <div style={{ padding: "40px" }}>
        <h2>Detected Changes</h2>

        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            borderRadius: "10px",
            background: "#ffffff",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
          dangerouslySetInnerHTML={{ __html: diff }}
        />
      </div>
    </div>
  );
}

export default App;