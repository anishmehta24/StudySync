import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../Navbar';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [user,setUser] = useState('');
  const { userData, backendUrl } = useContext(AppContext);

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        axios.defaults.withCredentials = true
        
        const { data } = await axios.get(`${backendUrl}/api/post/getPostById/${id}`);
        setPost(data.data);
        // console.log(data)
        setUser(data.user.name)

      } catch (error) {
        console.error('Error fetching post details:', error);
      }
    };

    fetchPostDetails();
  }, [id, backendUrl]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment before submitting.');
      return;
    }

    // Optimistically update the UI
    const tempComment = {
      text: newComment,
      user: userData?.name,
      createdAt:new Date()
    };
    const tempComment2 = {
      text: newComment,
      user: userData?.id,
    };

    setPost((prevPost) => ({
      ...prevPost,
      comments: [...prevPost.comments, tempComment],
    }));

    setNewComment('');

    // Send the comment to the backend
    try {
        const response = await axios.put(`${backendUrl}/api/post/addComment/${id}`, {
          comment: tempComment2,
        });
    
        toast.success('Comment added successfully:');

        // setPost(response.data.post); 
      } catch (error) {
        console.error('Error adding comment:', error);
        toast.error('Failed to add comment. Please try again.');
    
        // Revert optimistic update
        setPost((prevPost) => ({
          ...prevPost,
          comments: prevPost.comments.filter((comment) => comment !== tempComment),
        }));
      }
  };

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading post details...</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="bg-gradient-to-r from-background to-secondary-light min-h-screen p-6">
        <div className="text-center mb-10 mt-10">
          <h1 className="text-4xl font-extrabold text-primary-dark mb-4 tracking-wide">{post.title}</h1>
          <p className="text-lg text-gray-600">Asked by: {user}</p>
          <p className="text-sm text-gray-500">Created At: {new Date(post.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="bg-gradient-to-r from-background to-secondary-light p-6 rounded-lg shadow-md shadow-current hover:shadow-lg hover:shadow-current mb-6 border border-secondary">
          <p className="text-gray-700 mb-4">{post.description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className="bg-secondary-light text-primary-light px-3 py-1 rounded-full text-xs font-semibold"
            >
              {post.tags}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-2xl font-semibold text-primary-dark mb-4">Comments</h2>
          {post.comments?.length > 0 ? (
            <ul className="space-y-4">
              {post.comments.map((comment, index) => (
                <li key={index} className="bg-secondary-light p-4 rounded-md">
                  <p className="text-primary font-bold">{comment.user}</p>
                  <p className="text-gray-700">{comment.text}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Posted on: {new Date(comment.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No comments yet. Be the first to add one!</p>
          )}

          <div className="mt-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your reply here..."
              className="w-full p-3 rounded-lg border border-secondary-light focus:outline-none focus:border-primary-dark"
              rows="4"
            ></textarea>
            <button
              onClick={handleAddComment}
              className="mt-3 bg-primary text-background px-4 py-2 rounded-md hover:scale-105 transition duration-300"
            >
              Add Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
