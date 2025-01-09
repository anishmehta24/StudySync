import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {

  const navigate = useNavigate()

  const [step, setStep] = useState(1); // Track the current step
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const inputRefs = React.useRef([]);

  axios.defaults.withCredentials=true;
  const { backendUrl, userData , isLoggedin , getUserData } = useContext(AppContext);

  // Handle OTP change
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  // Handle OTP Backspace
  const handleOtpBackspace = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle OTP Paste
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (!/^\d{6}$/.test(pasteData)) {
      toast.error('Please paste a valid 6-digit OTP.');
      return;
    }
    const updatedOtp = pasteData.split('');
    setOtp(updatedOtp);
    updatedOtp.forEach((digit, idx) => {
      if (inputRefs.current[idx]) inputRefs.current[idx].value = digit;
    });
    inputRefs.current[5]?.focus();
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true
        
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      // console.log(data);
      if (data.success) {
        toast.success('OTP sent to your email.');
        setStep(2); // Move to OTP verification step
      } else {
        toast.error(data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred.');
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }
    try {
      const { data } = await axios.post(backendUrl+ '/api/auth/verify-reset-otp', { email, otp: enteredOtp });
      
      if (data.success) {
        toast.success('OTP verified. Proceed to reset your password.');
        setStep(3); // Move to set new password step

      } else {
        toast.error(data.message || 'OTP verification failed.');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred.');
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      const { data } = await axios.post(backendUrl+ '/api/auth/reset-password', { email,  newPassword:password });
      if (data.success) {
        toast.success('Password reset successfully!');
        setStep(1); // Reset to initial step
        setEmail('');
        setOtp(new Array(6).fill(''));
        setPassword('');
        setConfirmPassword('');
        navigate("/login")
      } else {
        toast.error(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-background to-secondary-light">
      <div className="w-full max-w-md p-8 bg-gradient-to-r from-background to-secondary-light shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-primary">
          {step === 1 ? 'Forgot Password' : step === 2 ? 'Verify OTP' : 'Reset Password'}
        </h2>

        {step === 1 && (
          <form className="mt-6" onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="block text-text mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your registered email"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-lg transition duration-200"
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="mt-6" onSubmit={handleVerifyOtp}>
            <div className="flex justify-center space-x-2 mb-6" onPaste={handleOtpPaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  onKeyDown={(e) => handleOtpBackspace(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  maxLength="1"
                  className="w-12 h-12 text-center text-lg border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                />
              ))}
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-lg transition duration-200"
            >
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="mt-6" onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label className="block text-text mb-2">New Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-text mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-background text-text focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm new password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-primary hover:bg-primary-dark rounded-lg transition duration-200"
            >
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
