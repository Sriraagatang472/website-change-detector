import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [type, setType] = useState("");
  const [diff, setDiff] = useState("");
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFav, setShowFav] = useState(false);

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

  // 🔔 Notification
  const showNotification = (site) => {
    if (Notification.permission === "granted") {
      new Notification("Website Updated!", {
        body: `${site} has changed`,
      });
    }
  };

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  // 🔁 Auto check
  useEffect(() => {
    const interval = setInterval(() => {
      favorites.forEach(async (site) => {
        try {
          const res = await axios.post("http://localhost:5000/check", {
            url: site,
          });

          if (res.data.changed) {
            showNotification(site);
          }
        } catch {}
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [favorites]);

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
      {/* DOODLE */}
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

      {/* HERO */}
      <div style={{ textAlign: "center", padding: "120px 20px" }}>
        <p style={{ letterSpacing: "8px", fontSize: "12px", color: "#64748b" }}>
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

        {/* ⭐ FAVORITES TAB BUTTON */}
        <button
          onClick={() => setShowFav(!showFav)}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            borderRadius: "20px",
            border: "none",
            background: "#6b6ca7",
            color: "white",
            cursor: "pointer",
          }}
        >
          ⭐ Favorites
        </button>

        {/* FAVORITES LIST */}
        {showFav && (
          <div
            style={{
              marginTop: "20px",
              maxWidth: "500px",
              marginLeft: "auto",
              marginRight: "auto",
              background: "#ffffff",
              padding: "15px",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
              textAlign: "left",
            }}
          >
            <h3>Saved Sites</h3>

            {favorites.length === 0 && <p>No favorites yet</p>}

            {favorites.map((site, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{ cursor: "pointer", color: "#6366f1" }}
                  onClick={() => setUrl(site)}
                >
                  {site}
                </span>

                <button
                  onClick={() =>
                    setFavorites(favorites.filter((_, index) => index !== i))
                  }
                  style={{
                    border: "none",
                    background: "red",
                    color: "white",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

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
              cursor: "pointer",
            }}
          >
            {loading ? "Checking..." : "Go"}
          </button>

          {/* ⭐ SAVE */}
          <button
            onClick={() => {
              if (!url.trim()) return alert("Enter URL first");
              if (favorites.includes(url))
                return alert("Already saved ⭐");

              setFavorites([...favorites, url]);
              alert("Saved ⭐");
            }}
            style={{
              marginLeft: "10px",
              padding: "15px",
              borderRadius: "10px",
              border: "1px solid #ccc",
              cursor: "pointer",
              background: "#fff",
            }}
          >
            ⭐
          </button>
        </div>

        {/* OUTPUT */}
        {(result || diff) && (
          <div
            style={{
              marginTop: "25px",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "left",
              fontSize: "14px",
              color: "#64748b",
            }}
          >
            <p>
              {result} {type && `(${type})`}
            </p>

            <div dangerouslySetInnerHTML={{ __html: diff }} />
          </div>
        )}
      </div>

      {/* STEPS */}
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>How it works</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "30px" }}>
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
              }}
            >
              <h3>Step {i + 1}</h3>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;