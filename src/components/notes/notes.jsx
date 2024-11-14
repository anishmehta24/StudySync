import React, { useState } from 'react';
import Navbar from '../Navbar';
import { FaSearch, FaRegBookmark, FaRegThumbsUp, FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { AddCircle, AutoAwesome } from '@mui/icons-material';

const Notes = () => {
  const [notes] = useState([
    {
      id: 1,
      title: 'Introduction to React',
      tags: ['React', 'JavaScript'],
      author: 'John Doe',
      thumbnail: '../public/react.png',
    },
    {
      id: 2,
      title: 'Machine Learning Basics',
      tags: ['ML', 'AI'],
      author: 'Jane Smith',
      thumbnail: '../public/ml.jpeg',
    },
    // Add more notes here...
  ]);

  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterTag ? note.tags.includes(filterTag) : true)
  );

  return (
    <div className="bg-gradient-to-r from-background to-secondary-light min-h-screen">
      <Navbar />
      
      <div className="container mx-auto py-16 px-10 ">
        <div className=''>
        <div className="text-center mb-8 shadow-md shadow-current rounded-xl">
            <h2 className="text-4xl font-extrabold text-primary-dark  py-10 text-center tracking-wide">Share Your Knowledge</h2>
            <p className="text-lg text-text-light max-w-2xl mx-auto mb-4">
              Upload your notes to help others learn and explore. Your contributions make this a valuable resource for everyone.
            </p>
            <Link to='/notes/upload'> 
              <button className="bg-primary-dark text-background px-6 py-3 mb-8 rounded-md hover:bg-primary transition duration-300 font-medium mt-4">
                Upload Your Notes <AddCircle className='ml-2 mb-1' />
              </button>
            </Link>
        </div>
        </div>

        <div className="flex justify-between items-center mt-4 mb-8">
          <h1 className="text-3xl font-bold text-primary-dark text-center tracking-normal">Featured Notes</h1>
        <Link to='/ai-note-generation'> 
            <button className="bg-primary-dark text-background px-4 py-2 rounded-md hover:bg-primary transition duration-300">
            Generate Notes From AI <span><AutoAwesome className='mb-1'/></span>
            </button>
        </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center mb-6">
          <div className="relative flex items-center border border-primary-light rounded-md w-1/2 md:w-1/3">
            <FaSearch className="absolute left-3 text-primary-light" />
            <input
              type="text"
              placeholder="Search for notes by title, author, or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-2 rounded-md w-full focus:outline-none"
            />
          </div>
          <select
            className="ml-4 border border-primary-light px-4 py-2 rounded-md"
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
          >
            <option value="">All Tags</option>
            <option value="React">React</option>
            <option value="JavaScript">JavaScript</option>
            <option value="ML">Machine Learning</option>
            <option value="AI">Artificial Intelligence</option>
            {/* Add more tags here */}
          </select>
          
        </div>

        {/* Notes List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-background border border-secondary-light p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
              onClick={() => setSelectedNote(note)}
            >
              <img src={note.thumbnail} alt={note.title} className="w-full h-40 object-cover rounded-t-md mb-2" />
              <h2 className="text-xl font-semibold text-primary-dark">{note.title}</h2>
              <p className="text-text-light mt-2">by {note.author}</p>
              <div className="mt-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm bg-secondary-light text-background px-2 py-1 rounded-full mr-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Note Detail Page */}
        {selectedNote && (
          <div className="fixed inset-0 bg-background bg-opacity-90 flex justify-center items-center p-6">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
              <button onClick={() => setSelectedNote(null)} className="float-right text-primary-dark font-bold">
                &times;
              </button>
              <h2 className="text-2xl font-bold text-primary-dark mb-4">{selectedNote.title}</h2>
              <p className="text-text mb-2">by {selectedNote.author}</p>
              <div className="mb-4">
                {selectedNote.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-sm bg-secondary-light text-background px-2 py-1 rounded-full mr-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-text mb-4">
                {/* Sample content - Replace with actual note content */}
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a elementum mi. Duis eget cursus nibh.
              </p>
              <div className="flex items-center space-x-4">
                <button className="flex items-center bg-primary-dark text-background px-4 py-2 rounded-md hover:bg-primary transition duration-300">
                  <FaDownload className="mr-2" /> Download
                </button>
                <button className="flex items-center text-primary hover:text-primary-dark transition duration-300">
                  <FaRegThumbsUp className="mr-1" /> Like
                </button>
                <button className="flex items-center text-primary hover:text-primary-dark transition duration-300">
                  <FaRegBookmark className="mr-1" /> Bookmark
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
