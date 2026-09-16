import {
  AllSongs,
  CreateSong,
  SongDetail,
  UpdateSong,
  DeleteSong,
} from "../Controllers/songController.js";
import express from "express";
import protect from "../Middleware/auth.js";

const router = express.Router();

router.get("/", protect, AllSongs);
router.post("/", protect, CreateSong);
router.get("/:id", protect, SongDetail);
router.put("/:id", protect, UpdateSong);
router.delete("/:id", protect, DeleteSong);

export default router;
