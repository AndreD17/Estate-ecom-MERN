import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
        setTimeout(() => navigate('/sign-in'), 2000);
      }
    } catch (err) {
      setMessage('Something went wrong.');
    }finally{
      setLoading(true);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold text-center my-7">Reset Password</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="Enter new password"
          className="border p-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-green-700 text-white p-3 rounded-lg hover:opacity-90">
          {loading ? 'Updating Password...' : 'Enter Your New Password Here'}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
}
