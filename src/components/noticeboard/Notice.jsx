import React from 'react';
import Navbar from '../Navbar';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PushPinIcon from '@mui/icons-material/PushPin';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

const NoticeBoard = () => {
  const postAnnouncement = () => {
    alert('Post Announcement functionality will go here!');
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-r from-background to-secondary-light px-6 py-10 flex flex-col items-center animate-fadeIn">
        {/* Hero Section */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-extrabold text-primary-dark mb-4 tracking-wide animate-bounceIn">
            📜 Digital Notice Board!
          </h1>
          <h3 className="text-lg text-text-light mb-12 animate-fadeIn">
            Important updates, upcoming events, and featured announcements all in one place.
          </h3>
          <hr className="border-t-2 border-primary-dark w-1/2 mx-auto my-4" />
        </div>

        <div className="flex flex-col lg:flex-row w-full max-w-7xl space-y-8 lg:space-y-0 lg:space-x-8 animate-slideIn">
          {/* Center Section */}
          <div className="flex-grow lg:flex-[3]">
            <h1 className="text-3xl text-primary-dark font-bold mb-6">
              🛎️ Latest Announcements
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-5xl">
              <AnnouncementCard
                title="Platform Maintenance"
                date="Nov 18, 2024"
                description="Our platform will undergo scheduled maintenance from 12 AM to 4 AM. Please save your work."
              />
              <AnnouncementCard
                title="New Feature: Group Polls"
                date="Nov 20, 2024"
                description="Excited to announce the addition of group polls! Make decisions collaboratively with your peers."
              />
            </div>

            <h1 className="text-3xl text-primary-dark font-bold mb-6">
              📅 Upcoming Events
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 max-w-5xl">
              <EventCard
                title="React Workshop"
                date="Dec 5, 2024"
                details="Join us for an interactive session on React. Open for all skill levels!"
              />
              <EventCard
                title="Physics Hackathon"
                date="Dec 12, 2024"
                details="Test your physics knowledge and win exciting prizes!"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="w-full lg:w-1/4 shadow-lg shadow-current p-6 space-y-6 border rounded-lg bg-gradient-to-r from-background to-secondary-light relative animate-fadeIn">
            <motion.button
              onClick={postAnnouncement}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-primary-dark text-white py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 mb-6"
            >
              + Post Announcement
            </motion.button>

            <h2 className="text-xl font-bold text-primary-dark mb-4">
              📌 Pinned Notices
            </h2>
            <PinnedNotice
              title="Exam Schedules"
              description="Final exam schedules have been updated. Please check your dashboard for details."
            />
            <PinnedNotice
              title="Study Resources"
              description="Access the latest study materials uploaded by the community."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const AnnouncementCard = ({ title, date, description }) => (
  <Tilt>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-tr from-gray-50 to-gray-100 shadow-lg rounded-lg p-4 relative border-l-8 border-blue-500"
    >
      <div className="absolute top-3 right-3 text-yellow-500">
        <StarIcon fontSize="large" className="animate-spin-slow" />
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <NotificationsActiveIcon color="primary" />
        <h4 className="text-lg font-bold text-primary-dark">{title}</h4>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
      <hr className="my-4" />
      <div className="text-sm text-gray-500">{date}</div>
    </motion.div>
  </Tilt>
);

const EventCard = ({ title, date, details }) => (
  <Tilt>
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-tr from-gray-50 to-gray-100 shadow-lg rounded-lg p-4 relative border-l-8 border-green-500"
    >
      <div className="absolute top-3 right-3 text-yellow-500">
        <StarIcon fontSize="large" className="animate-pulse" />
      </div>
      <div className="flex items-center space-x-2 mb-4">
        <EventIcon color="primary" />
        <h4 className="text-lg font-bold text-primary-dark">{title}</h4>
      </div>
      <p className="text-sm text-gray-600">{details}</p>
      <hr className="my-4" />
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{date}</span>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center space-x-2 text-sm bg-green-500 text-white py-1 px-3 rounded-full shadow-md hover:shadow-lg"
        >
          <NotificationsIcon fontSize="small" />
          <span>Notify Me</span>
        </motion.button>
      </div>
    </motion.div>
  </Tilt>
);

const PinnedNotice = ({ title, description }) => (
  <div className="bg-yellow-50 shadow-md rounded-lg p-4 border-l-4 border-yellow-500 relative">
    <h4 className="text-lg font-bold text-primary-dark">{title}</h4>
    <p className="text-sm text-gray-700">{description}</p>
  </div>
);

export default NoticeBoard;
