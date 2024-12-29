import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { Box, TextField, Typography, Button } from '@mui/material';
import {  AddTask,  UploadFile,  UploadRounded,} from '@mui/icons-material';

const Uploadnotes = ({ username }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    image: null,
    document: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async(e) => {
   
      axios.defaults.withCredentials = true
          
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('tags', formData.tags);
      if (formData.image) form.append('image', formData.image);
      form.append('document', formData.document);
      form.append('uploadedBy', username); 

      const { data } = await axios.post('/api/notes/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if(data.success) {
        toast.success("Notes Uploaded Successfully")
        navigate("/notes")
      }
      else{
        toast.error(data.message)
      }
  };

  return (
    <div>
        <div><Navbar/></div>
        
    <div className="bg-gradient-to-r from-background to-secondary-light min-h-screen flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-gradient-to-r from-background to-secondary-light rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-primary-dark mb-4 text-center tracking-normal">Upload Your Notes <UploadRounded/></h2>
        <form onSubmit={handleSubmit}>
      <Box mb={2}>
        {/* <Typography variant="body1" color="textSecondary" component="label" htmlFor="title">
          Title *
        </Typography> */}
        <TextField
          variant="outlined"
          label="Title"
           placeholder="E.g., Quantum Physics, Basics of Calculus"
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
        {/* <Typography variant="body1" color="textSecondary" component="label" htmlFor="description">
          Description *
        </Typography> */}
        <TextField
          variant="outlined"
          label="Description"
          id="description"
          placeholder="Short Brief About the Notes You are Uploading"
          name="description"
          required
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          size="small"
          margin="dense"
        />
      </Box>

      <Box mb={2}>
        {/* <Typography variant="body1" color="textSecondary" component="label" htmlFor="tags">
          Tags (comma-separated) *
        </Typography> */}
        <TextField
          variant="outlined"
             label="Tags (comma-separated)"
           placeholder="E.g., Calculus, C++, Python, etc"
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
        <Typography variant="body1" color="textSecondary">
          Upload Thumbnail (Optional)
        </Typography>
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
          Upload Document (PDF or similar) *
        </Typography>
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
          Uploaded by: <span style={{ fontWeight: 'bold' }}>{username}</span>
        </Typography>
      </Box>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'medium' }}
        className='hover:scale-105'
      >
        Upload <AddTask className='ml-1'/>
      </Button>
    </form>
      </div>
    </div>
    </div>
  );
};

export default Uploadnotes;
