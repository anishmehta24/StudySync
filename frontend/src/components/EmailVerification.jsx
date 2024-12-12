import React, { useState, useRef, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const EmailVerification = () => {
  const navigate = useNavigate();
  axios.defaults.withCredentials=true;
  const { backendUrl, userData , isLoggedin , getUserData } = useContext(AppContext); // Retrieve user data from context
  const userName = userData?.name || 'User'; // Default to "User" if no name is available

  // State to store OTP
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);

  // Handle OTP input changes
  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return; // Only allow digits
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    // Automatically focus the next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace for navigating to the previous input
  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pasteData)) {
      toast.error('Please paste a valid 6-digit OTP.');
      return;
    }

    const updatedOtp = pasteData.split('');
    setOtp(updatedOtp);

    // Automatically focus the last input
    updatedOtp.forEach((digit, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx].value = digit;
      }
    });
    inputRefs.current[5]?.focus();
  };

  // Handle OTP submission
  const handleVerification = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }
    // console.log(enteredOtp)
    try {
      const { data } = await axios.post(backendUrl+'/api/auth/verify-account', { otp: enteredOtp });
      console.log(data)
      if (data.success) {
        toast.success('Account verified successfully!');
        getUserData()
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'OTP verification failed.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred during verification.');
    }
  };

  useEffect(()=>{
    isLoggedin && userData && userData.isAccountVerified && navigate("/dashboard")
  },[isLoggedin, userData])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-background to-secondary-light">
      <div className="w-full max-w-md p-8 bg-gradient-to-r from-background to-secondary-light shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-primary">
          Verify Your Account
        </h2>
        <div className="mt-4 text-center text-text">
          <p>
            Hi <span className="font-bold text-primary">{userName}</span>, enter the 6-digit OTP sent to your registered email address to verify your account.
          </p>
        </div>

        <form className="mt-6" onSubmit={handleVerification}>
          <div
            className="flex justify-center space-x-2 mb-6"
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleBackspace(e, index)}
                ref={(el) => (inputRefs.current[index] = el)}
                maxLength="1"
                className="w-12 h-12 text-center text-lg border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-primary hover:bg-primary-dark hover:dark:bg-secondary-dark rounded-lg transition duration-200"
          >
            Verify Email
          </button>
        </form>

        
      </div>
    </div>
  );
};

export default EmailVerification;
