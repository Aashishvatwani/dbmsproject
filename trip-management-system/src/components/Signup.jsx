import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using React Router

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your sign up logic here
    console.log('Sign up submitted:', { name, email, password, confirmPassword });
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
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
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#795548] placeholder-[#BDBDBD] text-[#F5F5F5] bg-[#424242] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:z-1 sm:text-sm"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mt-4">
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
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#795548] placeholder-[#BDBDBD] text-[#F5F5F5] bg-[#424242] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:z-1 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="confirm-password" className="sr-only">
                Confirm Password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-[#795548] placeholder-[#BDBDBD] text-[#F5F5F5] bg-[#424242] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:z-1 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#F5F5F5] bg-[#E53935] hover:bg-[#D32F2F] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2"
            >
              Sign up
            </button>
          </div>

          <div className="text-center text-sm text-[#BDBDBD]">
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