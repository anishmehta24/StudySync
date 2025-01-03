import React, { useContext } from 'react';
import Navbar from './Navbar'
import { FaBook, FaRobot, FaComments, FaUsers, FaChalkboard, FaBell } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

  const {userData} = useContext(AppContext)

  const features = [
    {
      title: 'Notes Sharing Platform',
      description: 'Upload, view, and share notes with other users.',
      link: '/notes',
      icon: <FaBook className="text-primary text-4xl" />,
    },
    {
      title: 'Group Study Finder',
      description: 'Find study groups based on subjects or interests.',
      link: '/groups',
      icon: <FaChalkboard className="text-primary text-4xl" />,
    },
    {
      title: 'AI Notes   Generation',
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
      title: 'Chat Feature',
      description: 'Chat with other users in real-time, one-on-one or in groups.',
      link: '/chat',
      icon:  <FaComments className="text-primary text-4xl" />,
    },
    {
      title: 'Digital Notice Board',
      description: 'Announcements, study resources, and events.',
      link: '/noticeboard',
      icon: <FaBell className="text-primary text-4xl" />,
    },
  ];

  return (
    <div className=" min-h-screen">
  
      <Navbar/>
      <div className="bg-gradient-to-r from-background to-secondary-light container mx-auto px-6 py-16">
        <h1 className="text-4xl font-extrabold text-primary-dark mb-4 text-center tracking-wide">
           Hey, <span className="font-semi">{userData.name} !</span>  Welcome to StudySync!
        </h1>
        <p className="text-lg text-text-light mb-12 text-center">
        Explore the features available to enhance your learning experience. Choose from a variety of tools to share notes, generate AI-powered content, connect with other students, and more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <a
              href={feature.link}
              key={index}
              className="bg-gradient-to-r from-background to-secondary-light border-gray-200 p-8 rounded-lg shadow-md shadow-current hover:shadow-xl hover:shadow-current hover:bg-secondary-light  transition duration-300 transform hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                {feature.icon}
                <h2 className="text-2xl font-semibold text-primary-dark my-3">
                  {feature.title}
                </h2>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div> 
      </div>
      
  );
};

export default Dashboard;
