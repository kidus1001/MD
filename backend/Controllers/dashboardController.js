import Song from "../Models/songModel.js";
import Project from "../Models/projectModel.js";

export async function getDashboard(req, res) {
  try {
    const userId = req.user._id;

    const [
      totalSongs,
      totalProjects,
      inProgress,
      recorded,
      recentSongs,
      recentProjects,
    ] = await Promise.all([
      Song.countDocuments({ user_id: userId }),
      Project.countDocuments({ user_id: userId }),
      Song.countDocuments({
        user_id: userId,
        status: { $in: ["idea", "draft", "composed", "rehearsed"] },
      }),
      Song.countDocuments({ user_id: userId, status: "recorded" }),
      Song.find({ user_id: userId })
        .sort({ updated_at: -1 })
        .limit(5)
        .select("title scale status updated_at")
        .lean(),
      Project.find({ user_id: userId })
        .sort({ updated_at: -1 })
        .limit(4)
        .select("title type percent song_count updated_at")
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      stats: { totalSongs, totalProjects, inProgress, recorded },
      recentSongs,
      recentProjects,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
