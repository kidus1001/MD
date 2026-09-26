import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../lib/api";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.post("/api/auth/register", { name, email, password });
      localStorage.setItem("pending_email", email);
      navigate("/check-email");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-text tracking-tight">
            Mezmur Debter
          </h1>
          <p className="text-sm text-text-faint mt-1">A home for your music</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-8">
          <h2 className="text-lg font-medium text-text mb-6">Create account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-darker-canvas border border-border rounded px-3 py-2 text-white placeholder:text-text-faint focus:outline-none focus:border-border-strong transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-darker-canvas border border-border rounded px-3 py-2 text-white placeholder:text-text-faint focus:outline-none focus:border-border-strong transition"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-text-muted mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-darker-canvas border border-border rounded px-3 py-2 text-white placeholder:text-text-faint focus:outline-none focus:border-border-strong transition"
              />
            </div>

            {error && (
              <div className="text-sm text-error bg-error-bg border border-error rounded px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-accent hover:bg-accent-hover disabled:opacity-50 text-text font-medium rounded py-2 transition"
            >
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-sm text-text-muted text-center mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-text hover:text-text-hover underline-offset-4 hover:underline transition"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
