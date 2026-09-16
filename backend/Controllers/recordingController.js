import mongoose from "mongoose";
import Song from "../Models/songModel";
import Recording from "../Models/recordingModel";

export async function AllRecordings(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const SongExists = Song.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!SongExists) {
      return res.status(404).json({
        message: "Song doesn't exist",
        success: false,
      });
    }

    const res = Recording.find({
      song_id: id,
      user_id: req.user_.id,
    })
      .sort({
        version: 1,
      })
      .lean();

    return recordings.status(200).json({
      message: "Successful",
      success: true,
      recordings,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}

export async function OneRecording(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const recordingOne = Recording.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!recordingOne) {
      return res.status(404).json({
        message: "Recording not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Successful",
      success: true,
      recordingOne,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}

export async function Create(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        message: "Invalid ID",
        success: false,
      });
    }

    const SongExists = Song.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!SongExists) {
      return res.status(404).json({
        message: "Song doesn't exist",
        success: false,
      });
    }

    const recordingCount = await Recording.countDocument({
      song_id: id,
      user_id: req.user._id,
    });

    if (recordingCount > 20) {
      return res.status(400).json({
        message: "Number of recordings exceeded 20",
        success: false,
      });
    }

    const nextVersion = await Recording.findOne({
      created_at: -1,
    });

    nextVersion = nextVersion.version + 1;
    const { title, notes, duration, mime_type, file_size, file_url } = req.body; //file_url - maybe the hardest part from this controller. For now we will accept it from req.body

    if (title === undefined) {
      title = "";
    }

    const newRecording = Recording.create({
      title: title,
      version: nextVersion,
      notes: notes,
      duration: duration,
      mime_type: mime_type,
      file_size: file_size,
      file_url: file_url,
    });

    res.status(201).json({
      message: "Recording created successfully",
      success: true,
      newRecording,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Version conflict, please retry",
      });
    }
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
}

export async function UpdateRecording(req, res) {
  try {
    const { id } = req.params;
    const { title, notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID",
        success: false,
      });
    }

    const recording = Recording.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!recording) {
      return res.status(400).json({
        message: "No recording found",
        success: false,
      });
    }

    if (title !== undefined) recording.title = title;
    if (notes !== undefined) recording.notes = notes;
  } catch (err) {
    console.log("Server error", err);
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
}

export async function DeleteRecording(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID",
        success: false,
      });
    }

    const deletedRec = Recording.findOneAndDelete({
      _id: id,
      user_id: req.user._id,
    });

    if (!deletedRec) {
      return res.status(404).json({
        message: "Recording not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Recording deleted successfully",
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
}
