import express from "express";
import {
  getProjects,
  CreateProject,
  getProject,
  UpdateProject,
  DeleteProject,
} from "../Controllers/projectController.js";
import protect from "../Middleware/auth.js";

const router = express.Router();

router.get("/", protect, getProjects);
router.post("/", protect, CreateProject);
router.get("/:id", protect, getProject);
router.put("/:id", protect, UpdateProject);
router.delete("/:id", protect, DeleteProject);

export default router;
