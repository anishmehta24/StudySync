import { FaBars, FaCodepen, FaEllipsisV } from 'react-icons/fa';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin, getUserData } = useContext(AppContext);
  const profileRef = useRef(null)

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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

  const NavItem = ({ to, label, end }) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `relative group text-lg font-medium transition px-1 py-1 ${isActive ? 'text-background' : 'hover:text-primary-light'}`}
    >
      {({ isActive }) => (
        <>
          <span>{label}</span>
          <span
            className={`pointer-events-none absolute left-0 -bottom-1 h-[4px] w-full origin-left transform rounded bg-background transition-transform duration-300 ease-out ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
          />
        </>
      )}
    </NavLink>
  )

  return (
    <nav className="bg-gradient-to-r from-primary-light to-primary text-background py-4 px-4 sm:px-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="text-2xl sm:text-3xl flex font-extrabold text-background px-2 sm:px-6">
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
          className={`${isMenuOpen ? 'block' : 'hidden'} md:flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 absolute md:static bg-primary md:bg-transparent w-full md:w-auto top-full left-0 md:left-auto z-30 md:z-auto p-4 md:p-0`}
        >
          <NavItem to="/dashboard" label="Dashboard" end />
          <NavItem to="/notes" label="Notes" />
          <NavItem to="/community" label="Community" />
          <NavItem to="/chat" label="Chat" />
          <NavItem to="/noticeboard" label="Notice Board" />
        </div>

        {/* User Profile */}
        <div className="px-4">
          {userData && (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                onClick={() => setIsProfileOpen((v) => !v)}
                className="w-10 h-10 flex justify-center items-center rounded-full bg-background text-primary-dark font-bold shadow hover:bg-primary-light hover:text-white transition hover:cursor-pointer overflow-hidden"
              >
                {userData?.avatarUrl ? (
                  <img src={userData.avatarUrl} alt={userData?.name || 'Profile'} className="w-full h-full object-cover" />
                ) : (
                  (userData?.name?.[0]?.toUpperCase() || 'U')
                )}
              </button>
              <div className={`absolute right-0 top-12 z-20 text-primary rounded ${isProfileOpen ? 'block' : 'hidden'}`}>
                <ul className="list-none m-0 p-2 bg-background font-semibold text-sm rounded-lg shadow-lg border border-gray-200 min-w-40">
                  {!userData.isAccountVerified && (
                    <li
                      className="py-1 px-3 hover:bg-secondary-light hover:rounded-lg cursor-pointer"
                      onClick={() => { setIsProfileOpen(false); sendVerificationOtp() }}
                    >
                      Verify Email
                    </li>
                  )}
                  <li className="py-1 px-3 hover:bg-secondary-light hover:rounded-lg cursor-pointer">
                    <label className="cursor-pointer block">
                      Update Avatar
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        try {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const form = new FormData()
                          form.append('avatar', file)
                          axios.defaults.withCredentials = true
                          const { data } = await axios.post(backendUrl + '/api/user/avatar', form, {
                            headers: { 'Content-Type': 'multipart/form-data' }
                          })
                          const url = data?.user?.avatarUrl
                          if (data?.success && url) {
                            setUserData((prev) => (prev ? { ...prev, avatarUrl: url } : prev))
                            // Also refresh full user data for consistency
                            try { await getUserData?.() } catch {}
                            toast.success('Avatar updated')
                          } else {
                            toast.error(data?.message || 'Failed to update avatar')
                          }
                        } catch(err) {
                          toast.error(err.message)
                        } finally {
                          e.target.value = ''
                          setIsProfileOpen(false)
                        }
                      }} />
                    </label>
                  </li>
                  <li
                    onClick={() => { setIsProfileOpen(false); logout() }}
                    className="py-1 px-3 hover:bg-secondary-light hover:rounded-lg cursor-pointer pr-10"
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
