import {
  AllRecordings,
  OneRecording,
  CreateRecording,
  UpdateRecording,
  DeleteRecording,
} from "../Controllers/recordingController";

import express from "express";
import protect from "../Middleware/auth.js";
import upload from "../Middleware/upload.js";

const Router = express.Router();

Router.get("/songs/:id/recordings", protect, AllRecordings);
Router.post(
  "/songs/:id/recordings",
  protect,
  upload.single("audio"),
  CreateRecording,
);
Router.get("/recordings/:id", protect, OneRecording);
Router.put("/recordings/:id", protect, UpdateRecording);
Router.delete("/recordings/:id", protect, DeleteRecording);

export default Router;
