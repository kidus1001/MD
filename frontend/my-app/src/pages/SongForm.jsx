import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { MAJOR_OPTIONS } from "../lib/format";

const SCALES = [
  "TBA",
  "Tizita",
  "Ambassel",
  "Anchihoye",
  "Selamta",
  "Bati",
  "EOTC Chants - Ge'ez",
  "EOTC Chants - Ezl",
  "EOTC Chants - Araray",
  "Ionian",
  "Dorian",
  "Phrygian",
  "Lydian",
  "Mixolydian",
  "Aeolian",
  "Locrian",
  "Major Pentatonic",
  "Minor Pentatonic",
  "Insen",
  "Hirajoshi",
  "Yo",
];

const STATUSES = [
  "idea",
  "draft",
  "composed",
  "rehearsed",
  "recorded",
  "released",
];

const emptyForm = {
  title: "",
  lyric_body: "",
  poem_by: { name: "", honorific_title: "" },
  melody_by: { name: "", honorific_title: "" },
  sung_by: { name: "", honorific_title: "" },
  scale: "TBA",
  major: "TBA",
  status: "idea",
  percent: 0,
  notes: "",
};

export default function SongForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const accidental = user?.preferences?.accidental || "sharp";

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    api
      .get(`/api/songs/${id}`)
      .then((data) => {
        if (cancelled) return;
        const s = data.song;
        setForm({
          title: s.title || "",
          lyric_body: s.lyric_body || "",
          poem_by: s.poem_by || { name: "", honorific_title: "" },
          melody_by: s.melody_by || { name: "", honorific_title: "" },
          sung_by: s.sung_by || { name: "", honorific_title: "" },
          scale: s.scale || "TBA",
          major: s.major || "TBA",
          status: s.status || "idea",
          percent: s.percent ?? 0,
          notes: s.notes || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load song");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, isEdit]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function updateContributor(field, key, value) {
    setForm((f) => ({ ...f, [field]: { ...f[field], [key]: value } }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/api/songs/${id}`, form);
        navigate(`/songs/${id}`);
      } else {
        const data = await api.post("/api/songs", form);
        navigate(`/songs/${data.song._id}`);
      }
    } catch (err) {
      setError(err.message || "Failed to save");
      setSaving(false);
    }
  }

  if (loading) return <p className="text-text-muted">Loading…</p>;

  const inputClass =
    "w-full bg-darker-canvas border border-border rounded px-3 py-2 text-text placeholder:text-text-faint focus:outline-none focus:border-border-strong transition";
  const labelClass =
    "block text-xs uppercase tracking-wider text-text-muted mb-2";

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-medium text-text">
        {isEdit ? "Edit song" : "New song"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basics */}
        <section className="bg-surface border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-wider text-text-muted">
            Basics
          </h2>

          <div>
            <label className={labelClass}>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              required
              autoFocus
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Lyrics</label>
            <textarea
              value={form.lyric_body}
              onChange={(e) => update("lyric_body", e.target.value)}
              rows={12}
              placeholder="Write your lyrics here…"
              className={`${inputClass} resize-none font-sans leading-relaxed`}
            />
          </div>
        </section>

        {/* Contributors */}
        <section className="bg-surface border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-wider text-text-muted">
            Contributors
          </h2>
          {[
            { key: "poem_by", label: "Poem by" },
            { key: "melody_by", label: "Melody by" },
            { key: "sung_by", label: "Sung by" },
          ].map(({ key, label }) => (
            <div key={key} className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs text-text-muted mb-1">
                  {label}
                </label>
                <input
                  type="text"
                  value={form[key].name}
                  onChange={(e) =>
                    updateContributor(key, "name", e.target.value)
                  }
                  placeholder="Name"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs text-text-muted mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={form[key].honorific_title}
                  onChange={(e) =>
                    updateContributor(key, "honorific_title", e.target.value)
                  }
                  placeholder="e.g. Deacon"
                  className={inputClass}
                />
              </div>
            </div>
          ))}
        </section>

        {/* Music */}
        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xs uppercase tracking-wider text-text-muted mb-4">
            Music
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Scale</label>
              <select
                value={form.scale}
                onChange={(e) => update("scale", e.target.value)}
                className={inputClass}
              >
                {SCALES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Major</label>
              <select
                value={form.major}
                onChange={(e) => update("major", e.target.value)}
                className={inputClass}
              >
                {MAJOR_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {accidental === "flat" ? m.flat : m.sharp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Status</label>
              <select
                value={form.status}
                onChange={(e) => update("status", e.target.value)}
                className={inputClass}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Progress — {form.percent}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={form.percent}
                onChange={(e) =>
                  update("percent", parseInt(e.target.value, 10))
                }
                className="w-full accent-accent"
              />
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="bg-surface border border-border rounded-lg p-6">
          <label className={labelClass}>Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            placeholder="Anything else worth remembering…"
            className={`${inputClass} resize-none`}
          />
        </section>

        {error && (
          <div className="text-sm text-error bg-error-bg border border-error rounded px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-text font-medium rounded px-5 py-2 transition"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create song"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-text-muted hover:text-text px-4 py-2 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
