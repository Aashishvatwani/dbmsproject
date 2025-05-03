import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import FirebaseConfig from './FirebaseConfig';
import { useAuth } from './AuthProvider';
import axios from 'axios'; // Import axios for making API calls

const app = initializeApp(FirebaseConfig);
const auth = getAuth(app);

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log('Auto-Login: User is already logged in:', user);
                login(user);
                // DO NOT send details blindly, let sendUserDetailsToBackend handle the check
                await sendUserDetailsToBackend(user);
                navigate('/home');
            }
        });
        return () => unsubscribe();
    }, [auth, login, navigate]);
    
let userid = null; // Declare userId outside the function
const sendUserDetailsToBackend = async (user) => {
    try {
        // Step 1: Check if user already exists
        const checkRes = await axios.get(`http://localhost:5000/api/userexists?uid=${user.uid}`);
        const exists = checkRes.data.exists;

        if (exists) {
            console.log('✅ User already exists in backend');
            return checkRes.data.user_id;
        }

        // Step 2: If not exists, add user
        const userData = {
            email: user.email,
            name: user.displayName || user.email.split('@')[0],
            firebaseUid: user.uid,
        };

        const response = await axios.post('http://localhost:5000/api/userdetail', userData);
        const userId = response.data.user_id;

        console.log('✅ New user created with ID:', userId);
        localStorage.setItem('user_id', userId);
        return userId;
    } catch (error) {
        console.error('❌ Failed to process user data:', error);
        throw error;
    }
};
    

    const handleEmailPasswordLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log('Logged in with Email/Password:', user);
            login(user);
            await sendUserDetailsToBackend(user); // Send user details after login
            navigate(`/home`);
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
            console.error('Error logging in:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError('');
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            console.log('Logged in with Google:', user);
            login(user);
            await sendUserDetailsToBackend(user); // Send user details after login
            navigate('/home');
        } catch (err) {
            setError(err.message || 'Google login failed.');
            console.error('Google Login Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGitHubLogin = async () => {
        setError('');
        setLoading(true);
        const provider = new GithubAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;
            console.log('Logged in with GitHub:', user);
            login(user);
            await sendUserDetailsToBackend(user); // Send user details after login
            navigate('/home');
        } catch (err) {
            setError(err.message || 'GitHub login failed.');
            console.error('GitHub Login Error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#212121] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-[#333333] rounded-lg shadow-lg p-8 border border-[#795548]">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-[#FFD700]">
                        Log in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleEmailPasswordLogin}>
                    {/* Inputs */}
                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* Email Input */}
                        <div>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#795548] placeholder-[#BDBDBD] text-[#F5F5F5] bg-[#424242] focus:outline-none focus:ring-2 focus:ring-[#FFD700] sm:text-sm"
                            />
                        </div>
                        {/* Password Input */}
                        <div className="mt-4">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#795548] placeholder-[#BDBDBD] text-[#F5F5F5] bg-[#424242] focus:outline-none focus:ring-2 focus:ring-[#FFD700] sm:text-sm"
                            />
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-[#E53935] focus:ring-2 focus:ring-[#FFD700] border border-[#795548] rounded bg-[#424242]"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-[#BDBDBD]">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-[#E53935] hover:text-[#D32F2F]">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#F5F5F5] bg-[#E53935] hover:bg-[#D32F2F] focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Log in'}
                        </button>
                    </div>
                </form>

                {/* Social Login Buttons */}
                <div className="mt-6 flex flex-col gap-4">
                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-[#795548] text-[#F5F5F5] bg-[#424242] hover:bg-[#555555] focus:ring-2 focus:ring-[#FFD700] rounded-md"
                    >
                        {/* Google SVG */}
                        Continue with Google
                    </button>
                    <button
                        onClick={handleGitHubLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-[#795548] text-[#F5F5F5] bg-[#424242] hover:bg-[#555555] focus:ring-2 focus:ring-[#FFD700] rounded-md"
                    >
                        {/* GitHub SVG */}
                        Continue with GitHub
                    </button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center text-sm text-[#BDBDBD] mt-4">
                    Don't have an account?
                    <Link to="/signup" className="font-medium text-[#FFD700] hover:text-[#D4AF37] ml-1">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;