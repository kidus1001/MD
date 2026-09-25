import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

export default function CheckEmail() {
  const [email] = useState(() => localStorage.getItem("pending_email"));

  if (!email) {
    return <Navigate to="/register" replace />;
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

        <div className="bg-surface border border-border rounded-lg p-8 text-center">
          <h2 className="text-lg font-medium text-text mb-3">
            Check your email
          </h2>
          <p className="text-sm text-text-muted mb-2">
            We sent a verification link to
          </p>
          <p className="text-text font-medium mb-6 break-all">{email}</p>
          <p className="text-xs text-text-faint mb-6">
            Click the link in the email to verify your account. Don't see it?
            Check your spam folder.
          </p>
          <Link
            to="/login"
            className="text-sm text-text hover:text-text-hover underline-offset-4 hover:underline transition"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
