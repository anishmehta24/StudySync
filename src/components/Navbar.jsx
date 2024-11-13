// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-primary text-background py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <a href="/" className="text-2xl font-bold text-background">
          NoteShare
        </a>
        
        {/* Menu Items */}
        <div className="hidden md:flex space-x-8">
          <a href="/" className="hover:text-secondary-light transition duration-200">
            Home
          </a>
          <a href="/notes" className="hover:text-secondary-light transition duration-200">
            Notes
          </a>
          <a href="/groups" className="hover:text-secondary-light transition duration-200">
            Groups
          </a>
          <a href="/community" className="hover:text-secondary-light transition duration-200">
            Community
          </a>
          <a href="/profile" className="hover:text-secondary-light transition duration-200">
            Profile
          </a>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden flex items-center">
          <button className="text-background focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
