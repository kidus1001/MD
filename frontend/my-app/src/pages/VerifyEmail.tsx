import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const token = params.get("token");

  const [status, setStatus] = useState(token ? "verifying" : "error");
  const [message, setMessage] = useState(
    token ? "" : "No verification token found in the link.",
  );

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    api
      .get(`/api/auth/verify-email?token=${token}`)
      .then((data) => {
        if (cancelled) return;

        if (!data.user || !data.token) {
          setStatus("error");
          setMessage("Server response was incomplete. Please try signing in.");
          return;
        }

        localStorage.removeItem("pending_email");
        login(data.user, data.token);
        setStatus("success");
        setMessage(`Welcome, ${data.user.name}!`);

        setTimeout(() => navigate("/projects"), 1500);
      })
      .catch((err) => {
        if (cancelled) return;
        setStatus("error");
        setMessage(err.message || "Verification failed.");
      });

    return () => {
      cancelled = true;
    };
  }, [token, login, navigate]);

  return (
    <div className="min-h-screen bg-grid flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-xl font-semibold text-text tracking-tight">
            Mezmur Debter
          </h1>
          <p className="text-sm text-text-faint mt-1">A home for your music</p>
        </div>

        <div className="bg-surface border border-border rounded-lg p-8 text-center">
          {status === "verifying" && (
            <p className="text-text-muted">Verifying your email…</p>
          )}

          {status === "success" && (
            <>
              <h2 className="text-lg font-medium text-text mb-2">Verified</h2>
              <p className="text-text-muted mb-6">{message}</p>
              <p className="text-sm text-text-faint">
                Taking you to your dashboard…
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <h2 className="text-lg font-medium text-text mb-2">
                Verification failed
              </h2>
              <p className="text-text-muted mb-6">{message}</p>
              <Link
                to="/register"
                className="text-sm text-text hover:text-text-hover underline-offset-4 hover:underline transition"
              >
                Register again
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
