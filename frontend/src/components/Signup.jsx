// Signup.jsx
import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { AppContext } from '../context/AppContext';

const Signup = () => {

  const navigate = useNavigate()
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

   const {backendUrl,setIsLoggedin} = useContext(AppContext)

  // Function to handle form submission
  const handleSubmit = async (e) => {
    try {
        e.preventDefault(); 

        axios.defaults.withCredentials = true
        
        const {data} = await axios.post(backendUrl+ '/api/auth/register',
          { name,email,password});
        if(data.success) {
          setIsLoggedin(true)
          navigate("/dashboard")
        }
        else{
          toast.error(data.message)
        }
      // console.log('Email:', email);
      // console.log('Password:', password);
      // Add your login logic here
    } catch (error) {
      toast.error(error.message)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-background to-secondary-light">
      <div className="w-full max-w-md p-8 bg-gradient-to-r from-background to-secondary-light shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-primary">
          Create Your Account
        </h2>

        <form className="mt-6" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-text mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)} 
              className="w-full px-4 py-2 border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your name"
            />
          </div>
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
              placeholder="Create a password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-lg transition duration-200"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-text">
          Already have an account?{' '}
          <a href="/login" className="text-primary font-semibold hover:underline">
            Log in here
          </a>.
        </p>
      </div>
    </div>
  );
};

export default Signup;
