import mongoose from "mongoose";
import Song from "../Models/songModel.js";
import Recording from "../Models/recordingModel.js";

export async function AllRecordings(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID",
      });
    }

    const SongExists = await Song.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!SongExists) {
      return res.status(404).json({
        message: "Song doesn't exist",
        success: false,
      });
    }

    const recordings = await Recording.find({
      song_id: id,
      user_id: req.user._id,
    })
      .sort({
        version: 1,
      })
      .lean();

    return res.status(200).json({
      message: "Successful",
      success: true,
      recordings,
    });
  } catch (err) {
    return res.status(500).json({
      message: "All recordings error",
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

    const recordingOne = await Recording.findOne({
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

export async function CreateRecording(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid ID",
        success: false,
      });
    }

    const SongExists = await Song.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!SongExists) {
      return res.status(404).json({
        message: "Song doesn't exist",
        success: false,
      });
    }

    const recordingCount = await Recording.countDocuments({
      song_id: id,
      user_id: req.user._id,
    });

    if (recordingCount >= 20) {
      return res.status(400).json({
        message: "Number of recordings exceeded 20",
        success: false,
      });
    }

    const highest = await Recording.findOne({
      song_id: id,
      user_id: req.user._id,
    })
      .sort({ version: -1 })
      .select("version");

    const nextVersion = (highest?.version || 0) + 1;

    const { title, notes, duration, mime_type, file_size, file_url } = req.body; //file_url - maybe the hardest part from this controller. For now we will accept it from req.body

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Please provide a title",
      });
    }

    const newRecording = await Recording.create({
      song_id: id,
      user_id: req.user._id,
      title,
      version: nextVersion,
      notes,
      duration,
      mime_type,
      file_size,
      file_url,
    });

    return res.status(201).json({
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
      message: "create recording error",
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

    const recording = await Recording.findOne({
      _id: id,
      user_id: req.user._id,
    });

    if (!recording) {
      return res.status(404).json({
        message: "No recording found",
        success: false,
      });
    }
    if (title !== undefined) recording.title = title;
    if (notes !== undefined) recording.notes = notes;

    await recording.save(); //to persist the change

    return res.status(200).json({
      message: "Recording updated successfully",
      success: true,
      recording,
    });
  } catch (err) {
    console.log("Update recording error", err);
    return res.status(500).json({
      message: "Update recording error",
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

    const deletedRec = await Recording.findOneAndDelete({
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
      deletedRec,
    });
  } catch (err) {
    return res.status(500).json({
      message: "internal server error",
      success: false,
    });
  }
}
