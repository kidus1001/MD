import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";
import { formatMajor } from "../lib/format";

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

      const token = localStorage.getItem("token");
      login(data.user, token);
      setMessage("Saved");
      setTimeout(() => setMessage(""), 2500);
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
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-text">Settings</h1>
        <p className="text-sm text-text-muted mt-1">
          Manage your profile and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — settings forms */}
        <div className="lg:col-span-2 space-y-6">
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
                <div className="flex items-center justify-between gap-3 bg-darker-canvas border border-border rounded px-3 py-2">
                  <span className="text-sm text-text truncate">{email}</span>
                  <span className="text-xs text-text-faint shrink-0">
                    Read-only
                  </span>
                </div>
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
              className="bg-darker-canvas border border-border hover:border-border-strong hover:bg-surface text-text text-sm font-medium rounded px-4 py-2 transition"
            >
              Sign out of this device
            </button>
          </section>
        </div>

        {/* Right column — preview + context */}
        <div className="space-y-6">
          <PreviewCard accidental={accidental} />
          <AccountCard user={user} />
        </div>
      </div>
    </div>
  );
}

/* --- Sub-components --- */

function PreviewCard({ accidental }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-5 sticky top-6">
      <h2 className="text-xs uppercase tracking-wider text-text-muted mb-4">
        Preview
      </h2>

      <p className="text-xs text-text-faint mb-3">
        How songs look with this setting:
      </p>

      {/* Sample song row — mimics SongRow from SongList */}
      <div className="bg-darker-canvas border border-border rounded-lg p-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-surface flex items-center justify-center text-text-muted shrink-0 text-sm">
            ♪
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-text truncate">ለአብ ለወልድ</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-text-muted">
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface text-text-muted">
                draft
              </span>
              <span>Anchihoye · {formatMajor("D#", accidental)}</span>
            </div>
          </div>

          <span className="text-xs text-text-muted tabular-nums shrink-0">
            25%
          </span>
        </div>
      </div>

      <p className="text-xs text-text-faint mt-4 leading-relaxed">
        Sharps use <span className="text-text">♯</span>, flats use{" "}
        <span className="text-text">♭</span>. The stored value never changes —
        only how it's shown.
      </p>
    </div>
  );
}

function AccountCard({ user }) {
  const joined = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="bg-surface border border-border rounded-lg p-5">
      <h2 className="text-xs uppercase tracking-wider text-text-muted mb-4">
        Account
      </h2>

      <div className="space-y-3 text-sm">
        <Row
          label="Email verified"
          value={
            user?.email_verified ? (
              <span className="text-text">✓ Yes</span>
            ) : (
              <span className="text-text-faint">No</span>
            )
          }
        />
        {joined && <Row label="Member since" value={joined} />}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-text-muted">{label}</span>
      <span className="text-xs text-text text-right">{value}</span>
    </div>
  );
}
