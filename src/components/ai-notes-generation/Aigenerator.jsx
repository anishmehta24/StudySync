// src/components/Aigenerator.jsx
import React, { useState } from 'react';
import Navbar from '../Navbar';
import { TextField, ToggleButton, ToggleButtonGroup, Button, Box, Typography, Input } from '@mui/material';
import { AutoAwesome, AutoFixHigh, Create, EmojiEmotions, EmojiObjects, Lightbulb, NoteAdd, } from '@mui/icons-material';


const Aigenerator = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [length, setLength] = useState('Brief Summary');
  const [style, setStyle] = useState('Bullet Points');
  const [context, setContext] = useState('Exam Prep');

  const handleGenerateNotes = () => {
    // Trigger note generation process with input values
    console.log({
      topic,
      keywords,
      length,
      style,
      context
    });
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gradient-to-r from-background to-secondary-light min-h-screen flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center mb-12">
          <h1  className="text-4xl font-extrabold text-primary-dark mb-4 text-center tracking-wide">
            Let's Create Your Notes
          </h1>
          <p className="text-text-light mt-2 text-lg">
            Create detailed notes based on specific topics with customized formats to suit your learning style.
          </p>
        </div>

        <div className="bg-gradient-to-r from-background to-secondary-light shadow-2xl rounded-xl p-10 w-full max-w-3xl">
          <h1  className="text-2xl font-bold text-primary-dark mb-10 text-center tracking-normal">
      Enter Details to Generate Notes 
       <span >  <AutoFixHigh className="text-primary-dark mb-2 ml-1" /></span>
          </h1>

          <div className="space-y-6">
            <TextField
              label="Topic"
              variant="outlined"
              fullWidth
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="E.g., Quantum Physics, Basics of JavaScript"
            />

            <TextField
              label="Keywords or Subtopics"
              variant="outlined"
              required
              fullWidth
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="E.g., subatomic particles, ES6 features"
            />

            <div>
              <Typography marginBottom={1} className="text-text-light font-semibold mb-2">Content Length</Typography>
              <ToggleButtonGroup
                value={length}
                exclusive
                onChange={(e, newLength) => setLength(newLength)}
                className="flex flex-wrap gap-2"
              >
                <ToggleButton value="Brief Summary" className="px-4 py-2">Brief Summary</ToggleButton>
                <ToggleButton value="In-Depth" className="px-4 py-2">In-Depth</ToggleButton>
                <ToggleButton value="Detailed Explanation" className="px-4 py-2">Detailed Explanation</ToggleButton>
              </ToggleButtonGroup>
            </div>

            <div>
              <Typography marginBottom={1} className="text-text-light font-semibold mb-2">Note Style</Typography>
              <ToggleButtonGroup
                value={style}
                exclusive
                onChange={(e, newStyle) => setStyle(newStyle)}
                className="flex flex-wrap gap-2"
              >
                <ToggleButton value="Bullet Points" className="px-4 py-2">Bullet Points</ToggleButton>
                <ToggleButton value="Detailed Paragraphs" className="px-4 py-2">Detailed Paragraphs</ToggleButton>
                <ToggleButton value="Q&A Style" className="px-4 py-2">Q&A Style</ToggleButton>
              </ToggleButtonGroup>
            </div>

            <div>
              <Typography marginBottom={1} className="text-text-light font-semibold mb-2">Additional Context</Typography>
              <ToggleButtonGroup
                value={context}
                exclusive
                onChange={(e, newContext) => setContext(newContext)}
                className="flex flex-wrap gap-2"
              >
                <ToggleButton value="Exam Prep" className="px-4 py-2">Exam Prep</ToggleButton>
                <ToggleButton value="Quick Revision" className="px-4 py-2">Quick Revision</ToggleButton>
                <ToggleButton value="Detailed Study" className="px-4 py-2">Detailed Study</ToggleButton>
              </ToggleButtonGroup>
            </div>

            <button
                variant="contained"
                onClick={handleGenerateNotes}
                className="bg-primary text-background w-full font-bold py-4 rounded-lg mt-6 transform hover:scale-105 transition duration-300 shadow-md"
                 // Adds the icon at the start of the text
            >
                Generate Notes <AutoAwesome/>
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Aigenerator;
