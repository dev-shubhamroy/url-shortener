
import express from "express";
import dotenv from "dotenv";
import { nanoid } from "nanoid";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Temporary storage; PostgreSQL comes later.
const urls = new Map();

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "URL Shortener API is running!" });
});

// Create a short URL
app.post("/api/shorten", (req, res) => {
  const { longUrl } = req.body;

  if (typeof longUrl !== "string") {
    return res.status(400).json({
      error: "Please provide a longUrl string.",
    });
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(longUrl);
  } catch {
    return res.status(400).json({
      error: "Please provide a valid URL.",
    });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return res.status(400).json({
      error: "Only HTTP and HTTPS URLs are allowed.",
    });
  }

  const shortCode = nanoid(7);

  urls.set(shortCode, parsedUrl.toString());

  res.status(201).json({
    shortCode,
    shortUrl: `http://localhost:${PORT}/${shortCode}`,
    longUrl: parsedUrl.toString(),
  });
});

// Redirect a short URL
app.get("/:shortCode", (req, res) => {
  const longUrl = urls.get(req.params.shortCode);

  if (!longUrl) {
    return res.status(404).json({
      error: "Short URL not found.",
    });
  }

  res.redirect(longUrl);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
