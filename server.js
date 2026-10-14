
import express from "express";
import dotenv from "dotenv";
import { nanoid } from "nanoid";
import pool from "./db.js";
import redisClient from "./redis.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({
    message: "URL Shortener API is running!",
  });
});

// Create a short URL
app.post("/api/shorten", async (req, res) => {
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

  try {
    await pool.query(
      "INSERT INTO urls (short_code, long_url) VALUES ($1, $2)",
      [shortCode, parsedUrl.toString()]
    );

    return res.status(201).json({
      shortCode,
      shortUrl: `http://localhost:${PORT}/${shortCode}`,
      longUrl: parsedUrl.toString(),
    });
  } catch (error) {
    console.error("Error saving URL:", error.message);

    return res.status(500).json({
      error: "Could not create short URL.",
    });
  }
});

// Redirect to the original URL using Redis caching
app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;

  try {
    // 1. Check Redis cache first
    const cachedUrl = await redisClient.get(`url:${shortCode}`);

    if (cachedUrl) {
      console.log("Cache HIT:", shortCode);
      return res.redirect(cachedUrl);
    }

    console.log("Cache MISS:", shortCode);

    // 2. If not cached, query PostgreSQL
    const result = await pool.query(
      "SELECT long_url FROM urls WHERE short_code = $1",
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Short URL not found.",
      });
    }

    const longUrl = result.rows[0].long_url;

    // 3. Cache the URL for one hour
    await redisClient.set(`url:${shortCode}`, longUrl, {
      EX: 3600,
    });

    // 4. Redirect to the original URL
    return res.redirect(longUrl);
  } catch (error) {
    console.error("Error retrieving URL:", error.message);

    return res.status(500).json({
      error: "Could not retrieve short URL.",
    });
  }
});

// Connect to Redis, then start the server
async function startServer() {
  try {
    await redisClient.connect();
    console.log("Redis connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
