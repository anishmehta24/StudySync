import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Navbar';
import { AddCircleRounded, Search } from '@mui/icons-material';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ChatIcon from '@mui/icons-material/Chat';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

const Group = () => {
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    console.log('Searching for study groups:', search);
  };

  const redirectToCommunityForm = () => {
    window.location.href = '/community';
  };

  const redirectToChatPage = () => {
    window.location.href = '/chat';
  };

  const redirectToNoticeBoard = () => {
    window.location.href = '/noticeboard';
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-background to-secondary-light px-6 py-10 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold text-primary-dark mb-4 text-center tracking-wide">
            Find Your Perfect Study Group: Collaborate, Learn, and Succeed!
          </h1>
          <h3 className="text-lg text-text-light mb-12 text-center">
            Your gateway to knowledge and connection awaits.
          </h3>
          <hr className="border-t-2 border-primary-dark w-1/2 mx-auto my-4" />
          <br />
      <div className="flex flex-wrap items-center justify-around gap-4">
      <img src="/group4.png" alt="Study Illustration 1" className="rounded-lg shadow-lg shadow-current w-full sm:w-80 h-60 object-cover" />
      <img src="/group3.png" alt="Study Illustration 2" className="rounded-lg shadow-lg shadow-current w-full sm:w-80 h-60 object-cover" />
      <img src="/group5.png" alt="Study Illustration 3" className="rounded-lg shadow-lg shadow-current w-full sm:w-80 h-60 object-cover" />
      </div>

        </div>

        {/* Search Study Groups Section */}
        <div className="w-full mb-8 p-6 max-w-7xl bg-gradient-to-r from-background to-secondary-light rounded-xl shadow-lg shadow-current space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <input
                type="text"
                placeholder="Search Study Groups"
                className="w-full p-3 border rounded-md"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="p-3 bg-primary-dark text-white rounded-md hover:bg-primary-light transition"
                onClick={handleSearch}
              >
                <Search />
              </button>
            </div>
            <div className="ml-4">
              <Link to="/chat" className="px-4 py-2 border rounded-md hover:bg-gray-50">Open Chat</Link>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer flex items-center gap-2">
              <SchoolIcon /> Physics
            </div>
            <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer flex items-center gap-2">
              <SchoolIcon /> Math
            </div>
            <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer flex items-center gap-2">
              <SchoolIcon /> Coding
            </div>
            <div className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer flex items-center gap-2">
              <SchoolIcon /> Design
            </div>
          </div>

          <div className="text-center flex items-center justify-center">
            <button className="bg-primary-dark text-white font-bold mt-3 py-3 px-6 rounded-lg shadow-md transform hover:scale-105 transition duration-300 flex items-center gap-2">
              <AddCircleRounded /> Create Study Group
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row w-full max-w-7xl space-y-8 lg:space-y-0 lg:space-x-8">
          {/* Featured Study Groups */}
          <div className="flex-grow lg:flex-[3]">
            <h1 className="text-3xl text-primary-dark font-bold mb-6">
              Featured Study Groups
              <hr className='mt-2 border border-secondary-dark w-1/2'/>
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-5xl">
              <StudyGroupCard
                title="Physics Exam Prep"
                members="12 Members"
                description="Prepare for your physics exams with regular discussions and problem-solving."
                isOnline={true}
              />
              <StudyGroupCard
                title="React JS Mastery"
                members="8 Members"
                description="Learn modern web development and React by collaborating with peers."
                isOnline={false}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/4 shadow-lg shadow-current p-6 space-y-6 border rounded-lg">
            <h2 className="text-xl font-bold text-primary-dark mb-4">📘 Study Tips</h2>
            <ul className="list-disc ml-6 text-gray-700">
              <li>Break your study sessions into focused intervals.</li>
              <li>Use group discussions to tackle challenging topics.</li>
              <li>Review regularly to retain knowledge effectively.</li>
            </ul>

            <div className="p-4 bg-blue-50 rounded-lg shadow-inner">
              <h3 className="text-lg font-bold text-blue-600">Have a question?</h3>
              <p className="text-gray-700 mt-2">Don't hesitate! Click the button below to ask your doubts in the community forum.</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md mt-4 flex items-center gap-2" onClick={redirectToCommunityForm}>
                <HelpOutlineIcon /> Ask the Community
              </button>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg shadow-inner">
              <h3 className="text-lg font-bold text-green-600">💬 Let's Chat!</h3>
              <p className="text-gray-700 mt-2">Feeling stuck or need a pep talk? <strong>Click here</strong> to jump into a lively chatroom and share your thoughts!</p>
              <button className="bg-green-500 text-white px-4 py-2 rounded-md mt-4 flex items-center gap-2" onClick={redirectToChatPage}>
                <ChatIcon /> Join the Chat
              </button>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg shadow-inner">
              <h3 className="text-lg font-bold text-orange-600">📜 Notice Board</h3>
              <p className="text-gray-700 mt-2">Stay informed! Check out the <strong>Digital Notice Board</strong> for the latest updates and announcements.</p>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md mt-4 flex items-center gap-2" onClick={redirectToNoticeBoard}>
                <NotificationsActiveIcon /> View Notices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StudyGroupCard = ({ title, members, description, isOnline }) => (
  <div className=" shadow-lg shadow-current rounded-xl p-4 transform hover:scale-105 transition duration-300 cursor-pointer">
    <div className="flex items-center space-x-2 mb-4">
      <GroupIcon color="primary" />
      <h4 className="text-lg font-bold text-primary-dark">{title}</h4>
    </div>
    <p className="text-sm text-gray-600 mb-4">{description}</p>
    <hr />
    <div className="flex justify-between items-center mt-4">
      <span className="text-sm text-primary font-semibold">{members}</span>
      <span className={`text-sm font-semibold ${isOnline ? 'text-green-500' : 'text-red-500'}`}>
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  </div>
);

export default Group;