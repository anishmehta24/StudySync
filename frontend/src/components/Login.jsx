// Login.jsx
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

   const navigate = useNavigate()
  const {backendUrl,setIsLoggedin,getUserData} = useContext(AppContext)
  // State variables for storing user inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {

    try {
      e.preventDefault(); 

        axios.defaults.withCredentials = true
        
        const {data} = await axios.post(backendUrl+ '/api/auth/login',
          { email,password});
        if(data.success) {
          setIsLoggedin(true)
          getUserData()
          navigate("/dashboard")
        }
        else{
          toast.error(data.message)
        }
    } catch (error) {
      toast.error(error.message)
    }
   
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-background to-secondary-light">
      <div className="w-full max-w-md p-8 bg-gradient-to-r from-background to-secondary-light shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-primary">
          Login to StudySync
        </h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text mb-2">Email</label>
            <input
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-6">
            <label className="block text-text mb-2">Password</label>
            <input
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-primary hover:bg-primary-dark hover:dark:bg-secondary-dark rounded-lg transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center text-text">
          <p>
            <a href="/reset-password" className="text-primary font-semibold hover:underline">Forgot Password?</a>
          </p>
          <p className="mt-2">
            Don't have an account?{' '}
            <a href="/signup" className="text-primary font-semibold hover:underline">
              Sign up here
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
