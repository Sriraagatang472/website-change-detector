const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const Diff = require("diff");

const app = express();

app.use(cors());
app.use(express.json());


let storedContent = {};
let history = {};

app.post("/check", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const text = $("body").text().replace(/\s+/g, " ").trim();

    let oldText = storedContent[url] || "";

    let changed = oldText !== text;

    
    let diffLen = Math.abs(oldText.length - text.length);
    let type = diffLen > 200 ? "Major Change 🚨" : "Minor Change";

    
    let differences = Diff.diffWords(oldText, text);

    let formattedDiff = differences
      .map((part) => {
        if (part.added) {
          return `<span style="color:green;">${part.value}</span>`;
        } else if (part.removed) {
          return `<span style="color:red;">${part.value}</span>`;
        } else {
          return part.value;
        }
      })
      .join("");

    storedContent[url] = text;

  
    history[url] = history[url] || [];
    history[url].push({
      time: new Date().toLocaleTimeString(),
      content: text,
    });

    res.json({
      changed,
      type,
      message: changed ? "Website changed!" : "No change",
      history: history[url],
      diff: formattedDiff,
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      error: "Failed to fetch website",
    });
  }
});


app.get("/", (req, res) => {
  res.send("Server is working!");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});