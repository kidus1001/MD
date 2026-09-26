import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function ProjectList() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/api/projects")
      .then((data) => {
        if (cancelled) return;
        setProjects(data.projects || []);
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
  }, []);

  if (loading) return <p className="text-text-muted">Loading…</p>;
  if (error) return <p className="text-error text-sm">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-text">Projects</h1>
        <Link
          to="/projects/new"
          className="bg-accent hover:bg-accent-hover text-text text-sm font-medium rounded px-3 py-1.5 transition"
        >
          + New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg p-10 text-center">
          <p className="text-text-muted mb-4">No projects yet.</p>
          <Link
            to="/projects/new"
            className="text-text hover:text-text-hover underline-offset-4 hover:underline transition"
          >
            Create your first project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <Link
              key={p._id}
              to={`/projects/${p._id}`}
              className="block bg-surface border border-border rounded-lg p-4 hover:bg-surface-hover transition"
            >
              <p className="text-sm font-medium text-text">{p.title}</p>
              <p className="text-xs text-text-muted mt-1">
                {p.type} · {p.song_count} song{p.song_count === 1 ? "" : "s"}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1 bg-darker-canvas rounded-full overflow-hidden">
                  <div
                    className="h-full bg-text-muted"
                    style={{ width: `${p.percent || 0}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted tabular-nums">
                  {p.percent || 0}%
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
