import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function SongDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get(`/api/songs/${id}`)
      .then((data) => {
        if (cancelled) return;
        setSong(data.song);
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
    if (!confirm("Delete this song? This cannot be undone.")) return;
    try {
      await api.del(`/api/songs/${id}`);
      navigate("/songs");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p className="text-text-muted">Loading…</p>;
  if (error) return <p className="text-error text-sm">{error}</p>;
  if (!song) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-text">{song.title}</h1>
          <p className="text-sm text-text-muted mt-1">
            {song.scale} · {song.major} · {song.status}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/songs/${id}/edit`}
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Meta
          label="Poem by"
          value={song.poem_by?.name}
          honorific={song.poem_by?.honorific_title}
        />
        <Meta
          label="Melody by"
          value={song.melody_by?.name}
          honorific={song.melody_by?.honorific_title}
        />
        <Meta
          label="Sung by"
          value={song.sung_by?.name}
          honorific={song.sung_by?.honorific_title}
        />
      </div>

      {song.lyric_body && (
        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xs uppercase tracking-wider text-text-muted mb-3">
            Lyrics
          </h2>
          <pre className="text-sm text-text whitespace-pre-wrap font-sans leading-relaxed">
            {song.lyric_body}
          </pre>
        </section>
      )}

      {song.notes && (
        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xs uppercase tracking-wider text-text-muted mb-3">
            Notes
          </h2>
          <p className="text-sm text-text whitespace-pre-wrap">{song.notes}</p>
        </section>
      )}
    </div>
  );
}

function Meta({ label, value, honorific }) {
  if (!value) return null;
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
        {label}
      </p>
      <p className="text-sm text-text">
        {honorific ? `${honorific} ` : ""}
        {value}
      </p>
    </div>
  );
}
