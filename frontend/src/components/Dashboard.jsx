import React, { useContext } from 'react';
import Navbar from './Navbar';
import { Link } from 'react-router-dom';
import { FaBook, FaRobot, FaComments, FaUsers, FaArrowRight, FaPlus, FaUpload, FaBolt } from 'react-icons/fa';
import { AppContext } from '../context/AppContext';
import { ChatApi } from '../api/chatApi';

const Dashboard = () => {
  const { userData } = useContext(AppContext);
  const [unreadTotal, setUnreadTotal] = React.useState(0)

  React.useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await ChatApi.listConversations()
        if (mounted && res?.success) {
          const total = (res.conversations || []).reduce((sum, c) => sum + (typeof c.unreadCount === 'number' ? c.unreadCount : 0), 0)
          setUnreadTotal(total)
        }
      } catch {}
    })()
    return () => { mounted = false }
  }, [])

  const features = [
    {
      title: 'Notes',
      description: 'Upload, view, and share high-quality notes with classmates.',
      link: '/notes',
      icon: <FaBook className="text-primary text-4xl" />,
      accent: 'from-indigo-50 to-white',
    },
    {
      title: 'AI Notes Generation',
      description: 'Turn topics or docs into clean, structured notes in seconds.',
      link: '/ai-note-generation',
      icon: <FaRobot className="text-primary text-4xl" />,
      accent: 'from-emerald-50 to-white',
    },
    {
      title: 'Community',
      description: 'Ask questions, share tips, and collaborate with peers.',
      link: '/community',
      icon: <FaUsers className="text-primary text-4xl" />,
      accent: 'from-rose-50 to-white',
    },
    {
      title: 'Chat',
      description: 'Direct messages and group chats—all in one place.',
      link: '/chat',
      icon: <FaComments className="text-primary text-4xl" />,
      accent: 'from-amber-50 to-white',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-background to-secondary-light">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10">
        {/* Hero */}
        <div className="rounded-2xl bg-white/90 shadow-lg shadow-current p-6 md:p-10 mb-8 md:mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary-dark tracking-tight">
                Hey, {userData?.name ? <span className="font-semibold">{userData.name}</span> : 'there'} 👋
              </h1>
              <p className="text-gray-700 mt-2">
                Everything you need to learn faster and together—notes, AI, community, and chat.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Link to="/chat" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-gray-50">
                <FaBolt className="text-primary" /> Quick Chat
              </Link>
              <Link to="/notes/upload" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-gray-50">
                <FaUpload className="text-primary" /> Upload Notes
              </Link>
              <Link to="/community/new-post" className="inline-flex items-center gap-2 px-4 py-2 rounded-md border hover:bg-gray-50">
                <FaPlus className="text-primary" /> New Post
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl bg-white/90 border border-gray-100 p-5">
            <div className="text-sm text-gray-600">Unread messages</div>
            <div className="mt-1 text-2xl font-bold text-primary-dark">{unreadTotal}</div>
            <Link to="/chat" className="inline-block mt-3 text-sm text-primary hover:underline">Open Chat</Link>
          </div>
          <div className="rounded-xl bg-white/90 border border-gray-100 p-5">
            <div className="text-sm text-gray-600">Account</div>
            <div className="mt-1 text-2xl font-bold text-primary-dark">{userData?.isAccountVerified ? 'Verified' : 'Unverified'}</div>
            {!userData?.isAccountVerified && (
              <Link to="/verify-email" className="inline-block mt-3 text-sm text-primary hover:underline">Verify now</Link>
            )}
          </div>
          <div className="rounded-xl bg-white/90 border border-gray-100 p-5">
            <div className="text-sm text-gray-600">Notes</div>
            <div className="mt-1 text-2xl font-bold text-primary-dark">Share your knowledge</div>
            <Link to="/notes/upload" className="inline-block mt-3 text-sm text-primary hover:underline">Upload a note</Link>
          </div>
        </div>

        {/* Features Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((f, i) => (
            <Link
              to={f.link}
              key={i}
              className={`group rounded-xl bg-gradient-to-br ${f.accent} p-6 border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition`}
            >
              <div className="flex items-start justify-between">
                {f.icon}
                <FaArrowRight className="text-primary opacity-0 group-hover:opacity-100 transition" />
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-primary-dark">{f.title}</h3>
                <p className="text-gray-700 mt-2 text-sm leading-relaxed">{f.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* More Content: Recent Activity + Announcements + Tips */}
        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl bg-white/90 border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-primary-dark">Recent activity</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {unreadTotal > 0 ? (
                <li className="flex items-center justify-between">
                  <span className="text-gray-700">You have <strong>{unreadTotal}</strong> unread {unreadTotal === 1 ? 'message' : 'messages'}.</span>
                  <Link to="/chat" className="text-primary hover:underline">View</Link>
                </li>
              ) : (
                <li className="text-gray-700">No new messages. Start a conversation in Chat.</li>
              )}
              <li className="flex items-center justify-between">
                <span className="text-gray-700">Share notes to help your peers learn faster.</span>
                <Link to="/notes/upload" className="text-primary hover:underline">Upload</Link>
              </li>
              <li className="flex items-center justify-between">
                <span className="text-gray-700">Ask a question or post a tip in the community.</span>
                <Link to="/community/new-post" className="text-primary hover:underline">Post</Link>
              </li>
            </ul>
          </div>

          <div className="rounded-xl bg-white/90 border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-primary-dark">Announcements</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>• Group polls are now available in Notice Board.</li>
              <li>• Try the new AI Notes Generator for faster summaries.</li>
              <li>• Keep your profile updated—add an avatar in the menu.</li>
            </ul>
            <Link to="/noticeboard" className="inline-block mt-4 text-primary hover:underline text-sm">See all</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
