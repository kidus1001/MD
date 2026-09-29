import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatMajor } from "../lib/format";

export default function Dashboard() {
  const { user } = useAuth();
  const accidental = user?.preferences?.accidental || "sharp";

  const [stats, setStats] = useState(null);
  const [recentSongs, setRecentSongs] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get("/api/dashboard")
      .then((data) => {
        if (cancelled) return;
        setStats(data.stats);
        setRecentSongs(data.recentSongs || []);
        setRecentProjects(data.recentProjects || []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load dashboard");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return <p className="text-text-muted">Loading…</p>;

  if (error) {
    return (
      <div className="text-sm text-error bg-error-bg border border-error rounded px-3 py-2">
        {error}
      </div>
    );
  }

  const hasContent = stats.totalSongs > 0 || stats.totalProjects > 0;

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-medium text-text">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Here's what you've been working on
          </p>
        </div>
        <Link
          to="/songs/new"
          className="bg-accent hover:bg-accent-hover text-text text-sm font-medium rounded px-4 py-2 transition text-center sm:text-left w-full sm:w-auto shrink-0"
        >
          + New Song
        </Link>
      </div>

      {!hasContent ? (
        <EmptyState />
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <StatCard label="Songs" value={stats.totalSongs} />
            <StatCard label="Projects" value={stats.totalProjects} />
            <StatCard label="In Progress" value={stats.inProgress} />
            <StatCard label="Recorded" value={stats.recorded} />
          </div>

          {/* Two-column: recent songs + recent projects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <section className="md:col-span-2">
              <SectionHeader
                title="Recently Updated"
                linkTo="/songs"
                linkLabel="View all"
              />
              {recentSongs.length === 0 ? (
                <p className="text-sm text-text-faint py-4">No songs yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentSongs.map((song) => (
                    <SongRow
                      key={song._id}
                      song={song}
                      accidental={accidental}
                    />
                  ))}
                </div>
              )}
            </section>

            <section>
              <SectionHeader
                title="Recent Projects"
                linkTo="/projects"
                linkLabel="View all"
              />
              {recentProjects.length === 0 ? (
                <p className="text-sm text-text-faint py-4">No projects yet.</p>
              ) : (
                <div className="space-y-2">
                  {recentProjects.map((project) => (
                    <ProjectCard key={project._id} project={project} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </div>
  );
}

/* --- Sub-components --- */

function StatCard({ label, value }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-3 md:p-4">
      <p className="text-[10px] md:text-xs uppercase tracking-wider text-text-muted mb-1">
        {label}
      </p>
      <p className="text-xl md:text-2xl font-medium text-text tabular-nums">
        {value}
      </p>
    </div>
  );
}

function SectionHeader({ title, linkTo, linkLabel }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-xs uppercase tracking-wider text-text-muted">
        {title}
      </h2>
      {linkTo && (
        <Link
          to={linkTo}
          className="text-xs text-text-muted hover:text-text transition"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

function SongRow({ song, accidental }) {
  return (
    <Link
      to={`/songs/${song._id}`}
      className="block bg-surface border border-border rounded-lg p-3 hover:bg-surface-hover transition"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text truncate">{song.title}</p>
          <p className="text-xs text-text-muted mt-0.5 truncate">
            {song.scale} · {formatMajor(song.major, accidental)} ·{" "}
            {timeAgo(song.updated_at)}
          </p>
        </div>
        <StatusPill status={song.status} />
      </div>
    </Link>
  );
}

function ProjectCard({ project }) {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="block bg-surface border border-border rounded-lg p-3 hover:bg-surface-hover transition"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <p className="text-sm font-medium text-text truncate">
          {project.title}
        </p>
        <span className="text-[10px] uppercase tracking-wider text-text-faint shrink-0 mt-1">
          {project.type}
        </span>
      </div>
      <p className="text-xs text-text-muted">
        {project.song_count || 0} song{project.song_count === 1 ? "" : "s"}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1 bg-darker-canvas rounded-full overflow-hidden">
          <div
            className="h-full bg-text-muted"
            style={{ width: `${project.percent || 0}%` }}
          />
        </div>
        <span className="text-xs text-text-muted tabular-nums">
          {project.percent || 0}%
        </span>
      </div>
    </Link>
  );
}

function StatusPill({ status }) {
  const styles = {
    idea: "bg-darker-canvas text-text-muted",
    draft: "bg-darker-canvas text-text-muted",
    composed: "bg-darker-canvas text-text",
    rehearsed: "bg-darker-canvas text-text",
    recorded: "bg-text-muted text-surface",
    released: "bg-text text-surface",
  };

  return (
    <span
      className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded shrink-0 ${
        styles[status] || "bg-darker-canvas text-text-muted"
      }`}
    >
      {status}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="bg-surface border border-border rounded-lg p-6 md:p-12 text-center">
      <h2 className="text-base md:text-lg font-medium text-text mb-2">
        Start your music library
      </h2>
      <p className="text-sm text-text-muted mb-6 max-w-md mx-auto">
        Create a project to organize an album or a collection of songs, or jump
        straight in and write your first song.
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
        <Link
          to="/projects/new"
          className="bg-accent hover:bg-accent-hover text-text text-sm font-medium rounded px-4 py-2 transition"
        >
          Create a project
        </Link>
        <Link
          to="/songs/new"
          className="text-sm text-text-muted hover:text-text px-4 py-2 transition"
        >
          Or write a song
        </Link>
      </div>
    </div>
  );
}

/* --- Utils --- */

function timeAgo(dateString) {
  if (!dateString) return "";
  const then = new Date(dateString).getTime();
  const diff = Math.floor((Date.now() - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateString).toLocaleDateString();
}
