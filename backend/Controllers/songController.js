import Song from "../Models/songModel.js";
import Recording from "../Models/recordingModel.js";
import mongoose from "mongoose";

export async function AllSongs(req, res) {
  try {
    const { page, limit, sort, order, scale, status, project } = req.query;
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 20));

    const filter = { user_id: req.user._id };
    if (status) filter.status = status;
    if (scale) filter.scale = scale;
    if (project) filter.project_id = project;

    const sortField = sort || "updated_at";
    const sortDir = order === "asc" ? 1 : -1;
    const sortObject = { [sortField]: sortDir };

    const skip = (pageNum - 1) * limitNum;

    const [total, songs] = await Promise.all([
      Song.countDocuments(filter),
      Song.find(filter).sort(sortObject).skip(skip).limit(limitNum).lean(),
    ]);

    return res.status(200).json({
      success: true,
      songs,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      message: "Server error",
    });
  }
}

export async function CreateSong(req, res) {
  try {
    const {
      title,
      lyric_body,
      poem_by,
      melody_by,
      sung_by,
      scale,
      major,
      status,
      percent,
      notes,
    } = req.body;
    if (!title) {
      res.status(400).json({ message: "Please provide title" });
      return;
    }
    const SongExists = await Song.findOne({
      title,
      user_id: req.user._id,
    });

    if (SongExists) {
      return res.status(400).json({
        message: "You already have a song with that title",
        success: false,
      });
    }

    const song = await Song.create({
      user_id: req.user._id,
      title,
      lyric_body,
      poem_by,
      melody_by,
      sung_by,
      scale,
      major,
      status,
      percent,
      notes,
    });

    return res.status(201).json({
      success: true,
      message: "Song created",
      song,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}

export async function SongDetail(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }
    const song = await Song.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    return res.status(200).json({
      success: true,
      song,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function UpdateSong(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }
    const song = await Song.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    const {
      title,
      lyric_body,
      poem_by,
      melody_by,
      sung_by,
      scale,
      major,
      status,
      percent,
      notes,
    } = req.body;

    if (title !== undefined) song.title = title;
    if (lyric_body !== undefined) song.lyric_body = lyric_body;
    if (poem_by !== undefined) song.poem_by = poem_by;
    if (melody_by !== undefined) song.melody_by = melody_by;
    if (sung_by !== undefined) song.sung_by = sung_by;
    if (scale !== undefined) song.scale = scale;
    if (major !== undefined) song.major = major;
    if (status !== undefined) song.status = status;
    if (percent !== undefined) song.percent = percent;
    if (notes !== undefined) song.notes = notes;

    await song.save();

    return res.status(200).json({
      success: true,
      message: "Song updated successfully",
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}

export async function DeleteSong(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }
    await Recording.deleteMany({ song_id: id, user_id: req.user._id });

    const song = await Song.findOneAndDelete({
      _id: id,
      user_id: req.user._id,
    });

    if (!song) {
      return res.status(404).json({
        success: false,
        message: "Song not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Song deleted successfully",
      song,
    });
  } catch (err) {
    console.log("Error: ", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
}
