import { useLocation, Link, Navigate } from "react-router-dom";

export default function CheckEmail() {
  const location = useLocation();
  const email = location.state?.email;

  if (!email) {
    console.log("Email = " + email);
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8 text-center">
        <div className="text-5xl mb-4">📧</div>
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-gray-700 mb-4">We sent a verification link to</p>
        <p className="font-medium text-purple-700 mb-6 break-all">{email}</p>
        <p className="text-gray-600 text-sm mb-6">
          Click the link in the email to verify your account. If you don't see
          it within a few minutes, check your spam folder.
        </p>
        <Link
          to="/login"
          className="inline-block text-purple-700 hover:underline text-sm"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
