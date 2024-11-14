// src/components/Dashboard.jsx
import React from 'react';
import Navbar from './Navbar';

const Dashboard = () => {
  const features = [
    {
      title: 'Note Sharing Platform',
      description: 'Upload, view, and share notes with other users.',
      link: '/notes',
    },
    {
      title: 'AI Note Generation',
      description: 'Generate notes using AI based on a topic or document.',
      link: '/ai-note-generation',
    },
    {
      title: 'Community Support',
      description: 'Ask questions, share tips, and help others in our forum.',
      link: '/community',
    },
    {
      title: 'Chat Feature',
      description: 'Chat with other users in real-time, one-on-one or in groups.',
      link: '/chat',
    },
    {
      title: 'Group Study Finder',
      description: 'Find study groups based on subjects or interests.',
      link: '/groups',
    },
    {
      title: 'Digital Notice Board',
      description: 'Announcements, study resources, and events.',
      link: '/noticeboard',
    },
  ];

  return (
    <div className="bg-background min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-primary-dark mb-12 text-center">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <a
              href={feature.link}
              key={index}
              className="bg-white border border-gray-200 p-6 rounded-lg shadow-lg hover:bg-secondary-light hover:text-white transition duration-300 transform hover:scale-105"
            >
              <h2 className="text-2xl font-semibold text-primary-dark mb-3">
                {feature.title}
              </h2>
              <p className="text-gray-700">{feature.description}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
