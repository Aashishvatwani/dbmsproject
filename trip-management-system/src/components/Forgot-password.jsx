// sendPasswordReset.js

import React, { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import FirebaseConfig from './FirebaseConfig';
// ✅ Firebase Configuration

// ✅ Initialize Firebase
const app = initializeApp(FirebaseConfig);
const auth = getAuth(app);

// ✅ Forgot Password Component
const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent successfully.");
    } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    };
  
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white px-4">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400 text-center">Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 mb-4 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            onClick={handleReset}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition"
          >
            Send Reset Email
          </button>
          {message && (
            <p className="mt-4 text-sm text-center text-green-400">{message}</p>
          )}
        </div>
      </div>
    );
  };
  
  export default ForgotPassword;
