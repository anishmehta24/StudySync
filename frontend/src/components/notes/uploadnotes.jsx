import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { Box, TextField, Typography, Button, IconButton } from '@mui/material';
import { AddTask, UploadFile, UploadRounded, Cancel } from '@mui/icons-material';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEye } from 'react-icons/fa';

const Uploadnotes = () => {
  const { userData, backendUrl } = useContext(AppContext);
  const username = userData?.name;
  const userId = userData?.id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    image: null,
    document: null,
  });

  const handleChange = (e) => {
    const { name, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : null,
    });
  };

  const removeFile = (field) => {
    setFormData({
      ...formData,
      [field]: null,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('tags', formData.tags);
    if (formData.image) form.append('image', formData.image);
    form.append('document', formData.document);
    form.append('uploadedBy', userId);

    const { data } = await axios.post(backendUrl + '/api/notes/upload', form);
    if (data.success) {
      toast.success('Notes Uploaded Successfully');
      navigate('/notes');
    } else {
      toast.error(data.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gradient-to-r from-background to-secondary-light min-h-screen flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-gradient-to-r from-background to-secondary-light rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-primary-dark mb-4 text-center tracking-normal">
            Upload Your Notes <UploadRounded />
          </h2>
          <form onSubmit={handleSubmit}>
            <Box mb={2}>
              <TextField
                variant="outlined"
                label="Title"
                placeholder="E.g., Quantum Physics, Basics of Calculus"
                id="title"
                name="title"
                required
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                fullWidth
                size="small"
                margin="dense"
              />
            </Box>

            <Box mb={2}>
              <TextField
                variant="outlined"
                label="Description"
                id="description"
                placeholder="Short Brief About the Notes You are Uploading"
                name="description"
                required
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
                size="small"
                margin="dense"
              />
            </Box>

            <Box mb={2}>
              <TextField
                variant="outlined"
                label="Tags (comma-separated)"
                placeholder="E.g., Calculus, C++, Python, etc"
                id="tags"
                name="tags"
                required
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                fullWidth
                size="small"
                margin="dense"
              />
            </Box>

            <Box mb={2}>
              <Typography variant="body1" color="textSecondary">
                Upload Thumbnail <span className='font-bold'> (Optional) </span>
              </Typography>
              {!formData.image ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="1px dashed"
                  borderRadius="8px"
                  py={1.5}
                  sx={{
                    cursor: 'pointer',
                    color: 'text.secondary',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                  onClick={() => document.getElementById('image').click()}
                >
                  <UploadFile sx={{ mr: 1 }} />
                  <Typography>Choose a thumbnail image</Typography>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <img
                    src={URL.createObjectURL(formData.image)}
                    alt="Uploaded Thumbnail"
                    style={{ maxWidth: '80px', maxHeight: '80px', marginRight: '10px' }}
                  />
                  <IconButton onClick={() => removeFile('image')}>
                    <Cancel color="error" />
                  </IconButton>
                </Box>
              )}
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
                style={{ display: 'none' }}
              />
            </Box>

            <Box mb={2}>
              <Typography variant="body1" color="textSecondary">
                Upload Notes (PDF or similar) *
              </Typography>
              {!formData.document ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  border="1px dashed"
                  borderRadius="8px"
                  py={1.5}
                  sx={{
                    cursor: 'pointer',
                    color: 'text.secondary',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                  onClick={() => document.getElementById('document').click()}
                >
                  <UploadFile sx={{ mr: 1 }} />
                  <Typography>Choose a document file</Typography>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography display="flex"
                    component="a"
                    href={URL.createObjectURL(formData.document)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: 'none',
                      color: '#007bff',
                      fontWeight: 'bold',
                      marginRight: '10px',
                    }}
                  >
                   <FaEye className="mr-2 mt-1 ml-2" />  View Document
                  </Typography>
                  <IconButton onClick={() => removeFile('document')}>
                    <Cancel color="error" />
                  </IconButton>
                </Box>
              )}
              <input
                type="file"
                id="document"
                name="document"
                required
                accept=".pdf,.doc,.docx"
                onChange={handleChange}
                style={{ display: 'none' }}
              />
            </Box>

            <Box mb={2}>
              <Typography variant="body2" color="textSecondary">
                Uploaded by: <span style={{ fontWeight: 'bold' }}>{username}</span> (You)
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
              Upload <AddTask className="ml-1" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Uploadnotes;
