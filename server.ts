import express from "express";
import path from "path";
import ImageKit from "imagekit";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

app.use(express.json());

// ImageKit Authentication Endpoint
app.get("/api/imagekit/auth", (req, res) => {
  try {
    const result = imagekit.getAuthenticationParameters();
    res.json(result);
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    res.status(500).json({ error: "Failed to get auth parameters" });
  }
});

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Serve static files from the 'dist' directory
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

// For any other request, serve the index.html file
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

export default app;

