const express = require("express");
const dotenv = require("dotenv");
const ConnectDB = require("./src/utils/db.js");
const cors = require("cors");
const { scrapePropertyData } = require("./scraper.js");
const userRoutes = require("./src/routes/userRoutes.js")


dotenv.config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 5000;

const arr = [1, 3, 2, 5, 4];

const targeted = 6;

const newArr = new Map();

let result = [];

for (let a = 0; a < arr.length; a++) {
  const sec = targeted - arr[a];
  if (newArr.has(sec)) {
    result = [newArr.get(sec), a];
    break;
  }
  newArr.set(arr[a], a);
}

// Routes
app.use("/api/v1/users", userRoutes);

console.log("result", result);

app.get("/", (req, res) => {
  res.send("Scraper API is running. Use /scrape?url=<page_url>");
});

app.get("/scrape", async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "Missing required query param: url" });
  }

  try {
    console.log(`Scraping: ${url}`);
    const data = await scrapePropertyData(url);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Connect DB and start server
ConnectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err.message);
  });

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
