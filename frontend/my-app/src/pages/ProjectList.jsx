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
        setError(err.message || "Failed to load projects");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-text">Projects</h1>
          <p className="text-sm text-text-muted mt-1">
            {loading
              ? "Loading…"
              : `${projects.length} project${projects.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link
          to="/projects/new"
          className="bg-accent hover:bg-accent-hover text-text text-sm font-medium rounded px-4 py-2 transition"
        >
          + New Project
        </Link>
      </div>

      {error && (
        <div className="text-sm text-error bg-error-bg border border-error rounded px-3 py-2">
          {error}
        </div>
      )}

      {!loading && !error && projects.length === 0 && (
        <div className="bg-surface border border-border rounded-lg p-10 text-center">
          <p className="text-sm text-text-muted mb-4">No projects yet.</p>
          <Link
            to="/projects/new"
            className="text-text hover:text-text-hover underline-offset-4 hover:underline transition"
          >
            Create your first project
          </Link>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div
          className={`grid gap-4 ${
            projects.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          }`}
        >
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ project }) {
  const isUntitled =
    project.title === "Untitled" && project.type === "Untitled";

  return (
    <Link
      to={`/projects/${project._id}`}
      className="block bg-surface border border-border rounded-lg p-5 hover:bg-surface-hover transition"
    >
      <div className="flex items-start justify-between gap-3 mb-1">
        <h2
          className={`text-base font-medium truncate ${
            isUntitled ? "text-text-muted italic" : "text-text"
          }`}
        >
          {project.title}
        </h2>
        <span className="text-[10px] uppercase tracking-wider text-text-faint shrink-0 mt-1">
          {project.type}
        </span>
      </div>

      {project.description && (
        <p className="text-xs text-text-muted line-clamp-2 mb-3">
          {project.description}
        </p>
      )}

      {isUntitled && !project.description && (
        <p className="text-xs text-text-faint italic mb-3">
          Songs without a project live here
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-text-muted mt-4 mb-3">
        <span>
          {project.song_count || 0} song
          {project.song_count === 1 ? "" : "s"}
        </span>
        <span className="tabular-nums">{project.percent || 0}%</span>
      </div>

      <div className="w-full h-1 bg-darker-canvas rounded-full overflow-hidden">
        <div
          className="h-full bg-text-muted"
          style={{ width: `${project.percent || 0}%` }}
        />
      </div>
    </Link>
  );
}
