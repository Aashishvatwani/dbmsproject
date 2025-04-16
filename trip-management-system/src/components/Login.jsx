import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log('Login submitted:', { email, password });
  };

  return (
    <div className="min-h-screen bg-[#212121] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-[#333333] rounded-lg shadow-lg p-8 border border-[#795548]">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-[#FFD700]">
            Log in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#795548] placeholder-[#BDBDBD] text-[#F5F5F5] bg-[#424242] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:z-1 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#795548] placeholder-[#BDBDBD] text-[#F5F5F5] bg-[#424242] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:z-1 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
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

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#F5F5F5] bg-[#E53935] hover:bg-[#D32F2F] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2"
            >
              Log in
            </button>
          </div>

          <div className="text-center text-sm text-[#BDBDBD]">
            Don't have an account?
            <Link to="/signup" className="font-medium text-[#FFD700] hover:text-[#D4AF37] ml-1">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;