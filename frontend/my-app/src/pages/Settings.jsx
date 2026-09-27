import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function Settings() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [accidental, setAccidental] = useState(
    user?.preferences?.accidental || "sharp",
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSave(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const data = await api.put("/api/auth/profile", {
        name,
        email,
        preferences: { accidental },
      });

      // Refresh auth context with the updated user
      const token = localStorage.getItem("token");
      login(data.user, token);
      setMessage("Saved");
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const inputClass =
    "w-full bg-darker-canvas border border-border rounded px-3 py-2 text-text placeholder:text-text-faint focus:outline-none focus:border-border-strong transition";

  const labelClass =
    "block text-xs uppercase tracking-wider text-text-muted mb-2";

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-medium text-text">Settings</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile */}
        <section className="bg-surface border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xs uppercase tracking-wider text-text-muted">
            Profile
          </h2>

          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>
        </section>

        {/* Preferences */}
        <section className="bg-surface border border-border rounded-lg p-6">
          <h2 className="text-xs uppercase tracking-wider text-text-muted mb-4">
            Preferences
          </h2>

          <div>
            <label className={labelClass}>Accidentals</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAccidental("sharp")}
                className={`px-4 py-2 text-sm rounded border transition ${
                  accidental === "sharp"
                    ? "bg-text text-surface border-text"
                    : "bg-darker-canvas text-text-muted border-border hover:border-border-strong"
                }`}
              >
                Sharps (C♯)
              </button>
              <button
                type="button"
                onClick={() => setAccidental("flat")}
                className={`px-4 py-2 text-sm rounded border transition ${
                  accidental === "flat"
                    ? "bg-text text-surface border-text"
                    : "bg-darker-canvas text-text-muted border-border hover:border-border-strong"
                }`}
              >
                Flats (D♭)
              </button>
            </div>
            <p className="text-xs text-text-faint mt-2">
              How major keys are displayed across the app.
            </p>
          </div>
        </section>

        {error && (
          <div className="text-sm text-error bg-error-bg border border-error rounded px-3 py-2">
            {error}
          </div>
        )}
        {message && (
          <div className="text-sm text-text-muted bg-surface border border-border rounded px-3 py-2">
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-accent hover:bg-accent-hover disabled:opacity-50 text-text font-medium rounded px-5 py-2 transition"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>

      {/* Session */}
      <section className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-xs uppercase tracking-wider text-text-muted mb-3">
          Session
        </h2>
        <button
          onClick={handleLogout}
          className="text-sm text-text-muted hover:text-text underline-offset-4 hover:underline transition"
        >
          Sign out of this device
        </button>
      </section>
    </div>
  );
}
