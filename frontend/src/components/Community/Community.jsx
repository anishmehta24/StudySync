import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaThumbsDown, FaCommentAlt, FaSearch, FaPlus } from 'react-icons/fa';
import Navbar from '../Navbar';
import { AddCircle } from '@mui/icons-material';

const samplePosts = [
  {
    id: 1,
    title: 'How to learn React?',
    content: 'I am new to React. Can someone suggest resources or tips for beginners?',
    category: 'Computer Science',
    tags: ['React', 'JavaScript'],
    author: 'John Doe',
    upvotes: 12,
    downvotes: 2,
    replies: 3,
    liked: false,
    disliked: false,
  },
  // Additional sample posts...
];

const Community = () => {
  const [posts, setPosts] = useState(samplePosts);
  const [searchTerm, setSearchTerm] = useState('');

  const handleLike = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          liked: !post.liked,
          disliked: false,
          upvotes: post.liked ? post.upvotes - 1 : post.upvotes + 1,
        };
      }
      return post;
    }));
  };

  const handleDislike = (id) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        return {
          ...post,
          disliked: !post.disliked,
          liked: false,
          downvotes: post.disliked ? post.downvotes - 1 : post.downvotes + 1,
        };
      }
      return post;
    }));
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
        <Navbar/>
    <div className="bg-gradient-to-r from-background to-secondary-light min-h-screen p-6">
      {/* Header Section */}
      <div className="text-center mb-10 mt-10">
        <h1 className="text-4xl font-extrabold text-primary-dark mb-4 text-center tracking-wide">Ask The Community</h1>
        <p className="text-lg text-gray-600">Connect, share knowledge, and help each other by asking questions, sharing tips, and more.</p>
      </div>

      {/* Search and New Post */}
    <div className="flex flex-col items-center md:flex-row md:justify-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="relative w-full md:w-1/2">
            <FaSearch className="absolute left-4 top-4 text-gray-400" />
            <input
            type="text"
            placeholder="Search  by Query's title or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 rounded-lg border border-secondary-light focus:outline-none focus:border-primary-dark"
            />
        </div>
        <Link to="/community/new-post">
            <button className="flex items-center justify-center bg-primary text-background px-4 py-3 rounded-md hover:scale-105 transition duration-300 w-full md:w-auto">
            <AddCircle className="mr-2" /> New Query
            </button>
        </Link>
    </div>

      {/* Posts List */}
      {filteredPosts.map((post) => (
        <div
          key={post.id}
          className="bg-gradient-to-r from-background to-secondary-light p-5 rounded-lg shadow-md shadow-current hover:shadow-lg hover:shadow-current mb-5 ml-8 mr-8 border border-secondary  cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/community/post/${post.id}`} className="text-2xl font-semibold text-primary-dark hover:underline">
                {post.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">Category: {post.category} • by {post.author}</p>
              <div className="flex gap-2 mt-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-secondary-light text-background px-2 py-1 rounded-full text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex space-x-3 items-center">
              <button
                onClick={() => handleLike(post.id)}
                className={`text-primary ${post.liked ? 'text-primary' : 'hover:text-secondary'}`}
              >
                {post.liked ? <FaHeart /> : <FaRegHeart />} <span>{post.upvotes}</span>
              </button>
              <button
                onClick={() => handleDislike(post.id)}
                className={`text-primary ${post.disliked ? 'text-gray-500' : 'hover:text-secondary'}`}
              >
                <FaThumbsDown /> <span>{post.downvotes}</span>
              </button>
            </div>
          </div>

          <p className="text-gray-700 mt-4">{post.content}</p>

          <div className="flex justify-between items-center mt-4">
            <Link
              to={`/community/post/${post.id}`}
              className="text-primary-dark flex items-center space-x-1 hover:text-secondary-dark font-semibold text-sm"
            >
              <FaCommentAlt /> <span>Add Reply</span>
            </Link>
            <Link
              to={`/community/post/${post.id}`}
              className="text-secondary-dark hover:underline text-sm font-semibold"
            >
              {post.replies} Replies
            </Link>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default Community;
