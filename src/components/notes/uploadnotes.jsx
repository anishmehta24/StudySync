import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Upload functionality here...
    console.log(formData);
    alert('Note uploaded successfully!');
    navigate('/notes'); // Redirect after upload
  };

  return (
    <div>
        <Navbar/>
    <div className="bg-gradient-to-r from-background to-secondary-light min-h-screen flex justify-center items-center p-6">
      <div className="w-full max-w-md bg-gradient-to-r from-secondary-light to-background rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-primary-dark mb-4">Upload Note</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-text-light">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-text-light">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="4"
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tags" className="block text-sm font-medium text-text-light">
              Tags (comma-separated) *
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              required
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="block text-sm font-medium text-text-light">
              Upload Thumbnail (Optional)
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="document" className="block text-sm font-medium text-text-light">
              Upload Document (PDF or similar) *
            </label>
            <input
              type="file"
              id="document"
              name="document"
              required
              accept=".pdf,.doc,.docx"
              onChange={handleChange}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div className="mb-4">
            <span className="block text-sm text-text-light">
              Uploaded by: <span className="font-medium">{username}</span>
            </span>
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-primary text-background rounded hover:bg-primary-dark transition"
          >
            Upload Note
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Uploadnotes;
