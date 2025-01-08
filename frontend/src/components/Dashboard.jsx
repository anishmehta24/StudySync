import React, { useContext } from 'react';
import Navbar from './Navbar';
import { FaBook, FaRobot, FaComments, FaUsers, FaChalkboard, FaArrowRight } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';

const Dashboard = () => {
  const { userData } = useContext(AppContext);

  const features = [
    {
      title: 'Notes Sharing Platform',
      description: 'Upload, view, and share notes with other users.',
      link: '/notes',
      icon: <FaBook className="text-primary text-4xl" />,
    },
    {
      title: 'AI Notes Generation',
      description: 'Generate notes using AI based on a topic or document.',
      link: '/ai-note-generation',
      icon: <FaRobot className="text-primary text-4xl" />,
    },
    {
      title: 'Community Support',
      description: 'Ask questions, share tips, and help others in our forum.',
      link: '/community',
      icon: <FaUsers className="text-primary text-4xl" />,
    },
    {
      title: 'Group Study Finder',
      description: 'Find study groups based on subjects or interests.',
      link: '/groups',
      icon: <FaChalkboard className="text-primary text-4xl" />,
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="bg-gradient-to-r from-background to-secondary-light container mx-auto px-10 lg:px-28 py-16">
        <h1 className="text-4xl font-extrabold text-primary-dark mb-6 text-center tracking-wide">
          Hey, <span className="font-semi">{userData.name}!</span> Welcome to StudySync!
        </h1>
        <p className="text-lg text-text-light mb-10 px-28 text-center">
          Explore the features available to enhance your learning experience. Choose from a variety of tools to share notes, generate AI-powered content, connect with other students, and more.
        </p>
        <hr className="border-gray-500 border-2  mb-12" />
        <div className="flex flex-col space-y-10">
          {features.map((feature, index) => (
            <a
              href={feature.link}
              key={index}
              className="bg-gradient-to-r from-background to-secondary-light border-gray-200 p-8 rounded-lg shadow-lg shadow-current hover:shadow-xl hover:shadow-current hover:bg-secondary-light transition duration-300 transform hover:scale-105"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                  {feature.icon}
                  <h2 className="text-2xl font-semibold text-primary-dark my-3">
                    {feature.title}
                  </h2>
                  <p className="text-gray-700 mb-4">{feature.description}</p>
                </div>
                <div className="flex items-center mt-4 md:mt-0">
                  <button className="px-6 py-2 bg-primary-light text-white rounded-md hover:bg-primary-dark transition duration-300">
                    Explore
                  </button>
                  <FaArrowRight className="ml-4 text-primary-light hover:text-primary transition duration-300  text-3xl" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
