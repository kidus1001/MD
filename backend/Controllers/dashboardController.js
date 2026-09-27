import Song from "../Models/songModel.js";
import Project from "../Models/projectModel.js";

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

  if (result.length === 0) return { song_count: 0, percent: 0 };

  return {
    song_count: result[0].song_count,
    percent: Math.round(result[0].percent || 0),
  };
}

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
        .select("title scale major status percent updated_at project_id")
        .lean(),
      Project.find({ user_id: userId })
        .sort({ updated_at: -1 })
        .limit(4)
        .select("title type percent song_count updated_at")
        .lean(),
    ]);

    // Enrich recent projects with live stats
    const enrichedProjects = await Promise.all(
      recentProjects.map(async (p) => {
        const stats = await computeProjectStats(p._id, userId);
        return { ...p, ...stats };
      }),
    );

    return res.status(200).json({
      success: true,
      stats: { totalSongs, totalProjects, inProgress, recorded },
      recentSongs,
      recentProjects: enrichedProjects,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
