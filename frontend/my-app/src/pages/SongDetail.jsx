import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatMajor } from "../lib/format";
import ConfirmDialog from "../components/ConfirmDialog";

export default function SongDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const accidental = user?.preferences?.accidental || "sharp";

  const [song, setSong] = useState(null);
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [recordingTitle, setRecordingTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [confirmDeleteSong, setConfirmDeleteSong] = useState(false);
  const [confirmDeleteRecId, setConfirmDeleteRecId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      api.get(`/api/songs/${id}`),
      api.get(`/api/songs/${id}/recordings`),
    ])
      .then(([songData, recData]) => {
        if (cancelled) return;
        setSong(songData.song);
        setRecordings(recData.recordings || []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleDeleteSong() {
    setConfirmDeleteSong(false);
    try {
      await api.del(`/api/songs/${id}`);
      navigate("/songs");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteRecording(recordingId) {
    setConfirmDeleteRecId(null);
    try {
      await api.del(`/api/recordings/${recordingId}`);
      setRecordings((prev) => prev.filter((r) => r._id !== recordingId));
    } catch (err) {
      setUploadError(err.message);
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    const file = e.target.elements.audio.files[0];

    if (!file) {
      setUploadError("Please select an audio file");
      return;
    }
    if (!recordingTitle.trim()) {
      setUploadError("Give this take a title");
      return;
    }

    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("audio", file);
      formData.append("title", recordingTitle);
      formData.append("notes", "");

      const data = await api.upload(`/api/songs/${id}/recordings`, formData);
      setRecordings((prev) => [...prev, data.recording]);
      setRecordingTitle("");
      e.target.reset();
    } catch (err) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (loading) return <p className="text-text-muted">Loading…</p>;
  if (error)
    return (
      <div className="text-sm text-error bg-error-bg border border-error rounded px-3 py-2">
        {error}
      </div>
    );
  if (!song) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-medium text-text break-words">
            {song.title}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {song.scale} · {formatMajor(song.major, accidental)} · {song.status}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/songs/${id}/edit`}
            className="text-sm text-text-muted hover:text-text px-3 py-1.5 transition"
          >
            Edit
          </Link>
          <button
            onClick={() => setConfirmDeleteSong(true)}
            className="text-sm text-text-faint hover:text-error px-3 py-1.5 transition"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <Meta label="Poem by" person={song.poem_by} />
        <Meta label="Melody by" person={song.melody_by} />
        <Meta label="Sung by" person={song.sung_by} />
      </div>

      {song.lyric_body && (
        <section className="bg-surface border border-border rounded-lg p-4 md:p-6">
          <h2 className="text-xs uppercase tracking-wider text-text-muted mb-3">
            Lyrics
          </h2>
          <pre className="text-sm text-text whitespace-pre-wrap font-sans leading-relaxed">
            {song.lyric_body}
          </pre>
        </section>
      )}

      {song.notes && (
        <section className="bg-surface border border-border rounded-lg p-4 md:p-6">
          <h2 className="text-xs uppercase tracking-wider text-text-muted mb-3">
            Notes
          </h2>
          <p className="text-sm text-text whitespace-pre-wrap">{song.notes}</p>
        </section>
      )}

      <section className="bg-surface border border-border rounded-lg p-4 md:p-6">
        <h2 className="text-xs uppercase tracking-wider text-text-muted mb-4">
          Recordings ({recordings.length}/20)
        </h2>

        {recordings.length === 0 ? (
          <p className="text-sm text-text-faint mb-4">No recordings yet.</p>
        ) : (
          <div className="space-y-2 mb-4">
            {recordings.map((r) => (
              <RecordingRow
                key={r._id}
                recording={r}
                onDelete={() => setConfirmDeleteRecId(r._id)}
              />
            ))}
          </div>
        )}

        {recordings.length < 20 && (
          <form
            onSubmit={handleUpload}
            className="border-t border-border pt-4 mt-4 space-y-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs text-text-muted mb-1">
                  File
                </label>
                <input
                  type="file"
                  name="audio"
                  accept="audio/*"
                  className="w-full text-sm text-text-muted file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:bg-darker-canvas file:text-text hover:file:bg-surface-hover transition"
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">
                  Take title
                </label>
                <input
                  type="text"
                  value={recordingTitle}
                  onChange={(e) => setRecordingTitle(e.target.value)}
                  placeholder="e.g. Take 1"
                  className="w-full bg-darker-canvas border border-border rounded px-3 py-2.5 text-base md:text-sm text-text placeholder:text-text-faint focus:outline-none focus:border-border-strong transition"
                />
              </div>
            </div>

            {uploadError && (
              <p className="text-sm text-error bg-error-bg border border-error rounded px-3 py-2">
                {uploadError}
              </p>
            )}

            <button
              type="submit"
              disabled={uploading}
              className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-text font-medium rounded px-4 py-2.5 text-sm transition w-full sm:w-auto"
            >
              {uploading ? "Uploading…" : "Upload recording"}
            </button>
          </form>
        )}

        {recordings.length >= 20 && (
          <p className="text-xs text-text-faint border-t border-border pt-4 mt-4">
            This song has reached the maximum of 20 recordings.
          </p>
        )}
      </section>

      <ConfirmDialog
        open={confirmDeleteSong}
        title="Delete this song?"
        message="All its recordings will be deleted too. This cannot be undone."
        confirmLabel="Delete song"
        danger
        onConfirm={handleDeleteSong}
        onCancel={() => setConfirmDeleteSong(false)}
      />

      <ConfirmDialog
        open={confirmDeleteRecId !== null}
        title="Delete this recording?"
        message="The audio file will be removed permanently."
        confirmLabel="Delete"
        danger
        onConfirm={() => handleDeleteRecording(confirmDeleteRecId)}
        onCancel={() => setConfirmDeleteRecId(null)}
      />
    </div>
  );
}

function Meta({ label, person }) {
  const name = person?.name;
  const honorific = person?.honorific_title;
  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <p className="text-xs uppercase tracking-wider text-text-muted mb-1">
        {label}
      </p>
      <p className="text-sm text-text">
        {name ? (
          <>
            {honorific ? `${honorific} ` : ""}
            {name}
          </>
        ) : (
          <span className="text-text-faint">—</span>
        )}
      </p>
    </div>
  );
}

function RecordingRow({ recording, onDelete }) {
  return (
    <div className="bg-darker-canvas border border-border rounded p-3">
      <div className="flex items-start gap-3">
        <div className="text-xs text-text-muted w-8 text-center shrink-0 pt-0.5">
          v{recording.version}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm text-text truncate">{recording.title}</p>
          <p className="text-xs text-text-faint mt-0.5">
            {formatBytes(recording.file_size)} ·{" "}
            {formatDuration(recording.duration)}
          </p>
          <audio
            controls
            src={recording.file_url}
            className="w-full mt-2 h-8"
            preload="none"
          />
        </div>
        <button
          onClick={onDelete}
          className="text-xs text-text-faint hover:text-error transition shrink-0 pt-0.5"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function formatBytes(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function formatDuration(seconds) {
  if (!seconds) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
