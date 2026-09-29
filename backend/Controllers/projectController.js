import Project from "../Models/projectModel.js";
import Song from "../Models/songModel.js";
import Recording from "../Models/recordingModel.js";
import mongoose from "mongoose";


export async function CreateProject(req, res) {
  try {
    const { title, type, description, percent } = req.body;

    if (!title || !type) {
      res.status(400).json({ message: "Please provide title and type" });
      return;
    }

    const titleExists = await Project.findOne({ title, user_id: req.user._id });
    if (titleExists) {
      return res.status(409).json({
        success: false,
        message: "Title is already in use",
      });
    }

    const project = await Project.create({
      user_id: req.user._id,
      title: title,
      type: type,
      percent: percent || 0,
      description: description,
      song_count: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Project created",
      project,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}


export async function UpdateProject(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }
    const project = await Project.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const { title, type, percent, description } = req.body;

    project.title = title;
    project.type = type;
    project.percent = percent;
    project.description = description;

    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function DeleteProject(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const project = await Project.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Prevent deleting the auto-created Untitled project
    if (project.title === "Untitled" && project.type === "Untitled") {
      return res.status(403).json({
        success: false,
        message:
          "The Untitled project can't be deleted. Rename it first if you need to.",
      });
    }

    // Cascade: find songs in this project → delete their recordings → delete songs
    const songs = await Song.find({
      project_id: id,
      user_id: req.user._id,
    }).select("_id");

    const songIds = songs.map((s) => s._id);

    if (songIds.length > 0) {
      await Recording.deleteMany({
        song_id: { $in: songIds },
        user_id: req.user._id,
      });
    }

    await Song.deleteMany({ project_id: id, user_id: req.user._id });
    await Project.deleteOne({ _id: id, user_id: req.user._id });

    return res.status(200).json({
      success: true,
      message: "Project and its songs deleted",
      deleted_songs: songIds.length,
    });
  } catch (err) {
    console.error("Delete project error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

async function computeProjectStats(projectId, userId) {
  const result = await Song.aggregate([
    { $match: { project_id: projectId, user_id: userId } },
    {
      $group: {
        _id: null,
        song_count: { $sum: 1 },
        percent: { $avg: "$percent" },
      },
    },
  ]);

  if (result.length === 0) {
    return { song_count: 0, percent: 0 };
  }

  return {
    song_count: result[0].song_count,
    percent: Math.round(result[0].percent || 0),
  };
}

// GET /api/projects — list all projects with live stats
export async function getProjects(req, res) {
  try {
    const projects = await Project.find({ user_id: req.user._id })
      .sort({ updated_at: -1 })
      .lean();

    // Attach live stats to each project
    const enriched = await Promise.all(
      projects.map(async (p) => {
        const stats = await computeProjectStats(p._id, req.user._id);
        return { ...p, ...stats };
      }),
    );

    return res.status(200).json({
      success: true,
      count: enriched.length,
      projects: enriched,
    });
  } catch (err) {
    console.error("Get projects error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}

// GET /api/projects/:id — single project with live stats
export async function getProject(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const project = await Project.findOne({
      _id: id,
      user_id: req.user._id,
    }).lean();

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    const stats = await computeProjectStats(project._id, req.user._id);

    return res.status(200).json({
      success: true,
      project: { ...project, ...stats },
    });
  } catch (err) {
    console.error("Get project error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
