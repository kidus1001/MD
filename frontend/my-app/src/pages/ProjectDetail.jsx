import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
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
      .then(([p, s]) => {
        if (cancelled) return;
        setProject(p.project);
        setSongs(s.songs || []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
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
  if (error) return <p className="text-error text-sm">{error}</p>;
  if (!project) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-text">{project.title}</h1>
          <p className="text-sm text-text-muted mt-1">
            {project.type} · {songs.length} song{songs.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/projects/${id}/edit`}
            className="text-sm text-text-muted hover:text-text-hover px-3 py-1.5 transition"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="text-sm text-error hover:underline px-3 py-1.5 transition"
          >
            Delete
          </button>
        </div>
      </div>

      {project.description && (
        <div className="bg-surface border border-border rounded-lg p-4">
          <p className="text-sm text-text-muted whitespace-pre-wrap">
            {project.description}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-text">Songs</h2>
        <Link
          to="/songs/new"
          className="text-xs text-text-muted hover:text-text-hover transition"
        >
          + Add song
        </Link>
      </div>

      {songs.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-8 text-center">
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
              className="block bg-surface border border-border rounded-lg p-3 hover:bg-surface-hover transition"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-text">{song.title}</p>
                <span className="text-xs uppercase tracking-wider text-text-muted">
                  {song.status}
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1">{song.scale}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
