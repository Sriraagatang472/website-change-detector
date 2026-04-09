const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const Diff = require("diff");

const app = express();

app.use(cors());
app.use(express.json());

// 🧠 Memory storage
let storedContent = {};
let history = {};

app.post("/check", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    // 🌐 Fetch website
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    const html = response.data;

    // 🧹 Extract clean text
    const $ = cheerio.load(html);
    const text = $("body").text().replace(/\s+/g, " ").trim();

    let oldText = storedContent[url];

    let changed = false;
    let type = "Initial";
    let message = "First time checking";
    let formattedDiff = "";

    // 🟡 FIRST TIME
    if (!oldText) {
      storedContent[url] = text;

      history[url] = history[url] || [];
      history[url].push({
        time: new Date().toLocaleTimeString(),
        content: text,
      });

      return res.json({
        changed: false,
        type,
        message,
        diff: "",
        history: history[url],
      });
    }

    // 🔁 CHECK CHANGE
    changed = oldText !== text;

    let diffLen = Math.abs(oldText.length - text.length);

    if (!changed) {
      type = "No Change";
      message = "No changes detected";
    } else if (diffLen > 200) {
      type = "Major Change 🚨";
      message = "Website has significantly changed!";
    } else {
      type = "Minor Change";
      message = "Website has minor changes";
    }

    // 🧾 DIFF GENERATION
    const differences = Diff.diffWords(oldText, text);

    formattedDiff = differences
      .map((part) => {
        if (part.added) {
          return `<span style="color:green;font-weight:bold;">${part.value}</span>`;
        } else if (part.removed) {
          return `<span style="color:red;text-decoration:line-through;">${part.value}</span>`;
        } else {
          return part.value;
        }
      })
      .join("");

    // 💾 STORE NEW VERSION
    storedContent[url] = text;

    history[url] = history[url] || [];
    history[url].push({
      time: new Date().toLocaleTimeString(),
      content: text,
    });

    // 📤 RESPONSE (IMPORTANT FOR FRONTEND)
    res.json({
      changed,
      type,
      message,
      diff: formattedDiff,
      history: history[url],
    });

  } catch (err) {
    console.log(err.message);

    res.status(500).json({
      error: "Failed to fetch website",
      changed: false,
      message: "Error checking website",
      type: "Error",
      diff: "",
    });
  }
});

// 🧪 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});