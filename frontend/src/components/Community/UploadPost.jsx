import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { Box, TextField, Typography, Button, IconButton } from '@mui/material';
import { AddCircle, AddCircleOutline, AddCircleRounded, Cancel } from '@mui/icons-material';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const UploadPost = () => {
  const { userData, backendUrl } = useContext(AppContext);
  const username = userData?.name;
  const userId = userData?.id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    question: '',
    tags: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    const postData = {
      title: formData.title,
      description: formData.question,
      tags: formData.tags,
      user: userId,
    };

    const { data } = await axios.post(backendUrl + '/api/post/upload', postData);
    if (data.success) {
      toast.success('Post Created Successfully');
      navigate('/community');
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gradient-to-r from-background to-secondary-light min-h-screen flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-gradient-to-r from-background to-secondary-light rounded-lg shadow-lg shadow-current p-6">
          <h2 className="text-2xl font-bold text-primary-dark mb-4 text-center tracking-normal">
            Create a Post <AddCircle className='mb-1' />
          </h2>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                variant="outlined"
                label="Question - Title"
                placeholder="E.g., How to approach DSA?"
                id="title"
                name="title"
                required
                onChange={handleChange}
                fullWidth
                size="small"
                margin="dense"
              />
            </Box>

            <Box mb={2}>
              <TextField
                variant="outlined"
                label="Description"
                placeholder="Write your question here in detail..."
                id="question"
                name="question"
                required
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                size="small"
                margin="dense"
              />
            </Box>

            <Box mb={2}>
              <TextField
                variant="outlined"
                label="Tags (comma-separated)"
                placeholder="E.g., DSA, JavaScript, React"
                id="tags"
                name="tags"
                required
                onChange={handleChange}
                fullWidth
                size="small"
                margin="dense"
              />
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Posted by: <span style={{ fontWeight: 'bold' }}>{username}</span> (You)
              </Typography>
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'medium' }}
              className="hover:scale-105"
            >
              Post <AddCircleRounded className="ml-1 " />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadPost;
