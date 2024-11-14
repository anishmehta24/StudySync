// Login.jsx
import React from 'react';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background ">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-primary">
          Login to StudySync
        </h2>

        <form className="mt-6">
          <div className="mb-4">
            <label className="block text-text mb-2">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg bg-background  text-text  focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-text mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg bg-background text-text  focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-primary hover:bg-primary-dark  hover:dark:bg-secondary-dark rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-center text-text ">
          Don't have an account? <a href="/signup" className="text-primary dark:text-secondary underline">Sign up here</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
