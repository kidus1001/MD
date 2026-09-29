import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatMajor } from "../lib/format";

export default function SongList() {
  const { user } = useAuth();
  const accidental = user?.preferences?.accidental || "sharp";

  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const url = q.trim()
      ? `/api/songs?q=${encodeURIComponent(q.trim())}`
      : "/api/songs";

    api
      .get(url)
      .then((data) => {
        if (cancelled) return;
        setSongs(data.songs || []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load songs");
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-medium text-text">
            All Songs
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {loading
              ? "Loading…"
              : `${songs.length} song${songs.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link
          to="/songs/new"
          className="bg-accent hover:bg-accent-hover text-text text-sm font-medium rounded px-4 py-2 transition text-center w-full sm:w-auto shrink-0"
        >
          + New Song
        </Link>
      </div>

      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title or any word in the lyrics…"
        className="w-full bg-surface border border-border rounded px-4 py-2.5 text-base md:text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-border-strong transition"
      />

      {error && (
        <div className="text-sm text-error bg-error-bg border border-error rounded px-3 py-2">
          {error}
        </div>
      )}

      {!loading && !error && songs.length === 0 && (
        <div className="bg-surface border border-border rounded-lg p-8 md:p-10 text-center">
          <p className="text-sm text-text-muted mb-4">
            {q ? "No songs matched your search." : "No songs yet."}
          </p>
          {!q && (
            <Link
              to="/songs/new"
              className="text-text hover:text-text-hover underline-offset-4 hover:underline transition"
            >
              Write your first song
            </Link>
          )}
        </div>
      )}

      {!loading && songs.length > 0 && (
        <div className="space-y-2">
          {songs.map((song) => (
            <SongRow key={song._id} song={song} accidental={accidental} />
          ))}
        </div>
      )}
    </div>
  );
}

function SongRow({ song, accidental }) {
  return (
    <Link
      to={`/songs/${song._id}`}
      className="block bg-surface border border-border rounded-lg p-3 md:p-4 hover:bg-surface-hover transition"
    >
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-9 h-9 md:w-10 md:h-10 rounded bg-darker-canvas flex items-center justify-center text-text-muted shrink-0">
          ♪
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text truncate">{song.title}</p>
          <div className="flex items-center gap-2 md:gap-3 mt-1 text-xs text-text-muted flex-wrap">
            <StatusPill status={song.status} />
            <span className="truncate">
              {song.scale} · {formatMajor(song.major, accidental)}
            </span>
          </div>
        </div>

        {/* Percent bar — hidden on mobile, shown on desktop */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="w-24 h-1.5 bg-darker-canvas rounded-full overflow-hidden">
            <div
              className="h-full bg-text-muted"
              style={{ width: `${song.percent || 0}%` }}
            />
          </div>
          <span className="text-xs text-text-muted tabular-nums w-9 text-right">
            {song.percent || 0}%
          </span>
        </div>

        {/* On mobile, just show the number */}
        <span className="md:hidden text-xs text-text-muted tabular-nums shrink-0">
          {song.percent || 0}%
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
