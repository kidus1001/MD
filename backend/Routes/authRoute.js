import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
} from "../Controllers/authController.js";
import protect from "../Middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;
