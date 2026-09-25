import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
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

        login(data.user, data.token);
        setStatus("success");
        setMessage(`Welcome, ${data.user.name}`);

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
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-8 text-center">
        {status === "verifying" && (
          <p className="text-gray-600">Verifying your email…</p>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold text-green-600 mb-2">Verified</h1>
            <p className="text-gray-700 mb-6">{message}</p>
            <p className="text-gray-500 text-sm">
              Taking you to your dashboard…
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold text-red-600 mb-2">
              Verification failed
            </h1>
            <p className="text-gray-700 mb-6">{message}</p>
            <Link
              to="/register"
              className="inline-block text-purple-700 hover:underline"
            >
              Register again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

// import { useEffect, useState } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';

// export default function VerifyEmail () {
//     const [params] = useSearchParams();
//     const token = params.get('token');
//     const [status, setStatus] = useState(token? 'verifying': 'error');
//     const [message, setMessage] = useState(token? '': 'No verification token found in the link.');

//     useEffect (() => {
//         if (!token) {
//             return;
//         }

//         fetch (`http://localhost:3001/api/auth/verify-email?token=${token}`)
//             .then (res => res.json())
//             .then (data => {
//                 if (data.success) {
//                     setStatus ('success');
//                     setMessage ('Your email is verified. You can now log in.');
//                 } else {
//                     setStatus('error');
//                     setMessage (data.message || 'Verification failed.')
//                 }
//             })
//             .catch (() => {
//                 setStatus('error');
//                 setMessage ('Could not reach the server.')
//             });
//     }, [token]);

//     return (
//         <div className="max-w-md mx-auto mt-20 text-center px-4">
//             {status === 'verifying' && <p>Verifying your email</p>}

//             {status === "success" && (
//                 <>
//                     <h1 className='text-2xl font-bold text-green-600'>Verified!</h1>
//                     <p className='mt-2 text-gray-700'>{message}</p>
//                     <Link to="/login" className="text-blue-600 underline mt-4 inline-block">
//                         Go to login
//                     </Link>
//                 </>
//             )}

//             {status === "error" && (
//                 <>
//                     <h1 className='text-2xl font-bold text-red-600'>Verification failed</h1>
//                     <p className='mt-2 text-gray-700'>{message}</p>
//                 </>
//             )}
//         </div>
//     )
// }
