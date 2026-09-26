import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Album");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    api
      .get(`/api/projects/${id}`)
      .then((data) => {
        if (cancelled) return;
        setTitle(data.project.title);
        setType(data.project.type);
        setDescription(data.project.description || "");
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
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/api/projects/${id}`, { title, type, description });
        navigate(`/projects/${id}`);
      } else {
        const data = await api.post("/api/projects", {
          title,
          type,
          description,
        });
        navigate(`/projects/${data.project._id}`);
      }
    } catch (err) {
      setError(err.message || "Failed to save");
      setSaving(false);
    }
  }

  if (loading) return <p className="text-text-muted">Loading…</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-medium text-text">
        {isEdit ? "Edit project" : "New project"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-surface border border-border rounded-lg p-6"
      >
        <div>
          <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-darker-canvas border border-border rounded px-3 py-2 text-text focus:outline-none focus:border-border-strong transition"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-darker-canvas border border-border rounded px-3 py-2 text-text focus:outline-none focus:border-border-strong transition"
          >
            <option value="Album">Album</option>
            <option value="Single">Single</option>
            <option value="Untitled">Untitled</option>
          </select>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-darker-canvas border border-border rounded px-3 py-2 text-text focus:outline-none focus:border-border-strong transition resize-none"
          />
        </div>

        {error && (
          <div className="text-sm text-error bg-error-bg border border-error rounded px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-text font-medium rounded px-4 py-2 transition"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Create project"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-text-muted hover:text-text-hover px-4 py-2 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
