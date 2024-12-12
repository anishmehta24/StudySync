// src/components/Navbar.jsx
import { Book, BookOnline, CastForEducation, Code, CodeOff } from '@mui/icons-material';
import React, { useContext } from 'react';
import { FaCode, FaCodeBranch, FaCodepen, FaCodiepie } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

  const navigate = useNavigate();
  const {userData , backendUrl, setUserData, setIsLoggedin} = useContext(AppContext)
  // console.log(userData)

  const sendVerificationOtp = async ()=>{
    try {
      axios.defaults.withCredentials = true

      const {data} = await axios.post(backendUrl + '/api/auth/send-verify-otp')

      if(data.success){
        navigate("/verify-email")
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const logout = async() =>{
    try {
      axios.defaults.withCredentials = true
      const {data} = await axios.post(backendUrl+ '/api/auth/logout')

      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate("/")
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-primary-light to-primary text-background py-4 shadow-md ">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-3xl flex font-extrabold text-background px-6">
        <FaCodepen className='mr-3 mt-1'/>StudySync
        </Link>
        <div className="flex space-x-6">
          <Link to="/dashboard" className="text-lg font-medium hover:text-primary-light transition">
            Dashboard
          </Link>
          <Link to="/notes" className="text-lg font-medium hover:text-primary-light transition">
            Notes
          </Link>
          <Link to="/community" className="text-lg font-medium hover:text-primary-light transition">
            Community
          </Link>
          <Link to="/chat" className="text-lg font-medium hover:text-primary-light transition">
            Chat
          </Link>
          <Link to="/groups" className="text-lg font-medium hover:text-primary-light transition">
            Groups
          </Link>
          <Link to="/noticeboard" className="text-lg font-medium hover:text-primary-light transition">
            Notice Board
          </Link>
        </div>
        <div className='px-4'>

          {userData && <div className='w-10 h-10 flex justify-center items-center rounded-full bg-background text-primary-dark font-bold shadow hover:bg-primary-light hover:text-white transition hover:cursor-pointer relative group '>
            {userData?.name[0].toUpperCase()} 
            <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-primary rounded pt-10'>
              <ul className='list-none m-0 p-2 bg-background font-semibold text-sm rounded-lg'>
                {!userData.isAccountVerified && 
                <li className='py-1 px-2 hover:bg-secondary-light hover:rounded-lg cursor-pointer' onClick={sendVerificationOtp}>Verify Email</li> }
                <li onClick={logout} className='py-1 px-2 hover:bg-secondary-light hover:rounded-lg  cursor-pointer pr-10'> Logout</li>
              </ul>
            </div>
          </div>}
          {/* <Link
            to="/"
            className="bg-background text-primary-dark px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary-light hover:text-white transition"
          >
            Logout
          </Link> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
