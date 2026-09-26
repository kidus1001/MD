import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";

export default function SongList() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const url = q ? `/api/songs?q=${encodeURIComponent(q)}` : "/api/songs";
    api
      .get(url)
      .then((data) => {
        if (cancelled) return;
        setSongs(data.songs || []);
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
  }, [q]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-medium text-text">Songs</h1>
        <Link
          to="/songs/new"
          className="bg-accent hover:bg-accent-hover text-text text-sm font-medium rounded px-3 py-1.5 transition"
        >
          + New Song
        </Link>
      </div>

      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search songs…"
        className="w-full bg-darker-canvas border border-border rounded px-3 py-2 text-text placeholder:text-text-faint focus:outline-none focus:border-border-strong transition"
      />

      {loading && <p className="text-text-muted text-sm">Loading…</p>}
      {error && <p className="text-error text-sm">{error}</p>}

      {!loading && !error && songs.length === 0 && (
        <div className="bg-surface border border-border rounded-lg p-10 text-center">
          <p className="text-sm text-text-muted mb-3">
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

      <div className="space-y-2">
        {songs.map((song) => (
          <Link
            key={song._id}
            to={`/songs/${song._id}`}
            className="block bg-surface border border-border rounded-lg p-3 hover:bg-surface-hover transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-text truncate">
                  {song.title}
                </p>
                <p className="text-xs text-text-muted mt-0.5">{song.scale}</p>
              </div>
              <span className="text-xs uppercase tracking-wider text-text-muted">
                {song.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
