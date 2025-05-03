import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import FirebaseConfig from './FirebaseConfig'; // Your Firebase config file
import { useAuth } from './AuthProvider';

const app = initializeApp(FirebaseConfig);
const auth = getAuth(app);

// Providers for OAuth login
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Password mismatch check
    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      // Firebase sign up
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user profile with the name
      await updateProfile(user, { displayName: name });

      console.log('User signed up:', user);

      // Backend API call to store the name and email
      
      await handleBackendSignUp(name, email);

      // Log in the user using our custom hook
      login(user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Failed to create account.');
      console.error('Sign up error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to send user details to the backend
  const handleBackendSignUp = async (name, email) => {
    try {
      const response = await fetch('http://localhost:5000/api/userdetail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }), // Send name and email to the backend
      });

      if (!response.ok) {
        throw new Error('Failed to sign up on the backend. Please try again.');
      }

      const data = await response.json();
      console.log('Backend sign up successful:', data);
    } catch (err) {
      setError(err.message || 'Backend SignUp failed.');
      console.error('Backend SignUp error:', err);
    }
  };

  // Google sign-up
  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log('Google sign up:', result.user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'Google SignUp failed.');
      console.error('Google SignUp error:', err);
    }
  };

  // GitHub sign-up
  const handleGithubSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      console.log('GitHub sign up:', result.user);
      navigate('/home');
    } catch (err) {
      setError(err.message || 'GitHub SignUp failed.');
      console.error('GitHub SignUp error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#212121] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#333333] rounded-lg shadow-lg p-8 border border-[#795548]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#FFD700]">
            Create your account
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#795548] placeholder-[#BDBDBD] text-[#F5F5F5] bg-[#424242] focus:outline-none focus:ring-2 focus:ring-[#FFD700] sm:text-sm"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#795548] placeholder-[#BDBDBD] text-[#F5F5F5] bg-[#424242] focus:outline-none focus:ring-2 focus:ring-[#FFD700] sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#795548] placeholder-[#BDBDBD] text-[#F5F5F5] bg-[#424242] focus:outline-none focus:ring-2 focus:ring-[#FFD700] sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#795548] placeholder-[#BDBDBD] text-[#F5F5F5] bg-[#424242] focus:outline-none focus:ring-2 focus:ring-[#FFD700] sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#F5F5F5] bg-[#E53935] hover:bg-[#D32F2F] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign up'}
            </button>
          </div>

          {/* Google and GitHub Sign Up buttons */}
          <div className="flex flex-col space-y-4 mt-6">
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="group relative w-full flex justify-center py-2 px-4 border border-[#795548] text-sm font-medium rounded-md text-[#F5F5F5] bg-[#4285F4] hover:bg-[#357AE8] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            >
              Sign Up with Google
            </button>
            <button
              type="button"
              onClick={handleGithubSignUp}
              className="group relative w-full flex justify-center py-2 px-4 border border-[#795548] text-sm font-medium rounded-md text-[#F5F5F5] bg-[#333333] hover:bg-[#24292e] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
            >
              Sign Up with GitHub
            </button>
          </div>

          <div className="text-center text-sm text-[#BDBDBD] mt-4">
            Already have an account?
            <Link to="/login" className="font-medium text-[#FFD700] hover:text-[#D4AF37] ml-1">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
