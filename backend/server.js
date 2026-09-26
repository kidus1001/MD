import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./Config/db.js";

import authRoute from "./Routes/authRoute.js";
import projectRoute from "./Routes/projectRoute.js";
import songRoute from "./Routes/songRoute.js";
import recordingRoute from "./Routes/recordingRoute.js";
import dashboardRoute from "./Routes/dashboardRoute.js";
// import authRoute from './Routes/authRoute.js';

// const express = require("express");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const connectDB = require("./Config/db");

// dotenv.config(); //This middleware is used to load environment variables from a .env file into process.env. It allows you to keep sensitive information, such as database credentials and API keys, separate from your codebase and easily configurable for different environments (e.g., development, testing, production).

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //This middleware is used to parse the incoming request body and make it available in the req.body object. The extended option allows for parsing of nested objects and arrays in the request body.

app.use("/api/auth", authRoute);
app.use("/api/projects", projectRoute);
app.use("/api/songs", songRoute);
app.use("/api", recordingRoute);
app.use("/api/dashboard", dashboardRoute);

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File too large (max 50MB)",
    });
  }
  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      message: `Unexpected file field. Use "audio".`,
    });
  }
  if (err.message === "Only mp3, wav, m4a, ogg allowed") {
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Server error" });
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
