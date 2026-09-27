import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatMajor } from "../lib/format";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const accidental = user?.preferences?.accidental || "sharp";

  const [project, setProject] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get(`/api/projects/${id}`),
      api.get(`/api/songs?project=${id}&limit=100`),
    ])
      .then(([projectData, songsData]) => {
        if (cancelled) return;
        setProject(projectData.project);
        setSongs(songsData.songs || []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load project");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleDelete() {
    if (
      !confirm("Delete this project and all its songs? This cannot be undone.")
    )
      return;
    try {
      await api.del(`/api/projects/${id}`);
      navigate("/projects");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-text-muted">Loading…</p>;
  if (error)
    return (
      <div className="text-sm text-error bg-error-bg border border-error rounded px-3 py-2">
        {error}
      </div>
    );
  if (!project) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-medium text-text">{project.title}</h1>
          <p className="text-sm text-text-muted mt-1">
            {project.type} · {songs.length} song{songs.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/projects/${id}/edit`}
            className="text-sm text-text-muted hover:text-text px-3 py-1.5 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="text-sm text-text-faint hover:text-error px-3 py-1.5 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {project.description && (
        <section className="bg-surface border border-border rounded-lg p-5">
          <p className="text-sm text-text-muted whitespace-pre-wrap leading-relaxed">
            {project.description}
          </p>
        </section>
      )}

      <section className="bg-surface border border-border rounded-lg p-5">
        <div className="flex items-center justify-between text-xs text-text-muted mb-2">
          <span className="uppercase tracking-wider">Project progress</span>
          <span className="tabular-nums">{project.percent || 0}%</span>
        </div>
        <div className="w-full h-1.5 bg-darker-canvas rounded-full overflow-hidden">
          <div
            className="h-full bg-text-muted"
            style={{ width: `${project.percent || 0}%` }}
          />
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h2 className="text-xs uppercase tracking-wider text-text-muted">
          Songs ({songs.length})
        </h2>
        <Link
          to="/songs/new"
          className="text-xs text-text-muted hover:text-text transition"
        >
          + Add song
        </Link>
      </div>

      {songs.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-10 text-center">
          <p className="text-sm text-text-muted">
            No songs in this project yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {songs.map((song) => (
            <Link
              key={song._id}
              to={`/songs/${song._id}`}
              className="block bg-surface border border-border rounded-lg p-4 hover:bg-surface-hover transition"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text truncate">
                    {song.title}
                  </p>
                  <p className="text-xs text-text-muted mt-1">
                    {song.scale} · {formatMajor(song.major, accidental)}
                  </p>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-text-muted shrink-0">
                  {song.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
