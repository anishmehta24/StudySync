import { FaBars, FaCodepen, FaEllipsisV } from 'react-icons/fa';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/verify-email');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setIsLoggedin(false);
        setUserData(false);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-primary-light to-primary text-background py-4 px-8 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-3xl flex font-extrabold text-background px-6">
          <FaCodepen className="mr-3 mt-1" /> StudySync
        </Link>

        {/* Three-dot menu for small screens */}
        <div className="md:hidden">
          <button
            className="text-background text-2xl focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <FaBars />
          </button>
        </div>

        {/* Menu Options */}
        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 absolute md:static bg-primary md:bg-transparent w-full md:w-auto top-full left-0 md:left-auto z-10 md:z-0 p-4 md:p-0`}
        >
          <Link to="/dashboard" className="text-lg font-medium hover:text-primary-light transition">
            Dashboard
          </Link>
          <Link to="/notes" className="text-lg font-medium hover:text-primary-light transition">
            Notes
          </Link>
          <Link to="/community" className="text-lg font-medium hover:text-primary-light transition">
            Community
          </Link>
          <Link to="/groups" className="text-lg font-medium hover:text-primary-light transition">
            Groups
          </Link>
          <Link to="/noticeboard" className="text-lg font-medium hover:text-primary-light transition">
            Notice Board
          </Link>
        </div>

        {/* User Profile */}
        <div className="px-4">
          {userData && (
            <div className="w-10 h-10 flex justify-center items-center rounded-full bg-background text-primary-dark font-bold shadow hover:bg-primary-light hover:text-white transition hover:cursor-pointer relative group">
              {userData?.name[0].toUpperCase()}
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-primary rounded pt-10">
                <ul className="list-none m-0 p-2 bg-background font-semibold text-sm rounded-lg">
                  {!userData.isAccountVerified && (
                    <li
                      className="py-1 px-2 hover:bg-secondary-light hover:rounded-lg cursor-pointer"
                      onClick={sendVerificationOtp}
                    >
                      Verify Email
                    </li>
                  )}
                  <li
                    onClick={logout}
                    className="py-1 px-2 hover:bg-secondary-light hover:rounded-lg cursor-pointer pr-10"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
