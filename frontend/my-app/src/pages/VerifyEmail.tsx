import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function VerifyEmail () {
    const [params] = useSearchParams();
    const token = params.get('token');
    const [status, setStatus] = useState(token? 'verifying': 'error');
    const [message, setMessage] = useState(token? '': 'No verification token found in the link.');

    useEffect (() => {
        if (!token) {
            return;
        }

        fetch (`http://localhost:3001/api/auth/verify-email?token=${token}`)
            .then (res => res.json())
            .then (data => {
                if (data.success) {
                    setStatus ('success');
                    setMessage ('Your email is verified. You can now log in.');
                } else {
                    setStatus('error');
                    setMessage (data.message || 'Verification failed.')
                }
            })
            .catch (() => {
                setStatus('error');
                setMessage ('Could not reach the server.')
            });
    }, [token]);

    return (
        <div className="max-w-md mx-auto mt-20 text-center px-4">
            {status === 'verifying' && <p>Verifying your email</p>}

            {status === "success" && (
                <>
                    <h1 className='text-2xl font-bold text-green-600'>Verified!</h1>
                    <p className='mt-2 text-gray-700'>{message}</p>
                    <Link to="/login" className="text-blue-600 underline mt-4 inline-block">
                        Go to login
                    </Link>
                </>
            )}

            {status === "error" && (
                <>
                    <h1 className='text-2xl font-bold text-red-600'>Verification failed</h1>
                    <p className='mt-2 text-gray-700'>{message}</p>
                </>
            )}
        </div>
    )
}