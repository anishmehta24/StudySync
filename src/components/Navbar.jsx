// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-primary-light to-primary text-background py-4 shadow-md ">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-3xl font-extrabold text-background px-6">
          StudySync
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
          <Link
            to="/"
            className="bg-background text-primary-dark px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary-light hover:text-white transition"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
