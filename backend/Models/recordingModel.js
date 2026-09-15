import mongoose from "mongoose";

const RecordingSchema = new mongoose.Schema(
  {
    song_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Song",
      index: true,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Please add a title"],
      trim: true,
    },
    file_url: {
      type: String,
      default: "",
    },
    file_size: {
      type: Number, //bytes
      default: 0,
      min: 0,
    },
    duration: {
      type: Number, //(Seconds - Minutes will be rendered later at run-time)
      default: 0,
      min: 0,
    },
    mime_type: {
      type: String,
      default: "",
    },
    version: {
      type: Number,
      default: 1,
      min: 0,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  },
);

RecordingSchema.index(
  {
    song_id: 1,
    version: 1,
  },
  { unique: true },
);

RecordingSchema.index({
  song_id: 1,
  created_at: 1,
});
export default mongoose.model("Recording", RecordingSchema);
