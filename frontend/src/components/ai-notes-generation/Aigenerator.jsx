import React, { useContext, useState } from 'react';
import Navbar from '../Navbar';
import { TextField, ToggleButton, ToggleButtonGroup, Button, Box, Typography, Input } from '@mui/material';
import { AutoAwesome, AutoFixHigh, ContentCopy, Create, Download, EmojiEmotions, EmojiObjects, Lightbulb, NoteAdd, Timer } from '@mui/icons-material';
import { AppContext } from '../../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import DOMPurify from 'dompurify';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


const Aigenerator = () => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [length, setLength] = useState('Brief Summary');
  const [style, setStyle] = useState('Bullet Points');
  const [context, setContext] = useState('Exam Prep');

  const [notes, setNotes] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { backendUrl } = useContext(AppContext);

  const handleGenerateNotes = async () => {
    if(!topic || !keywords) {toast.error("Missing details"); return;}
    setLoading(true);
    setNotes('');

    const prompt =`
      Generate ${length} notes on the topic: "${topic}".
      Keywords or subtopics to cover: ${keywords}.
      Format the notes in HTML format.
      Provide additional context for ${context}.
      Ensure the notes are clear, concise, and suitable for students preparing for this context.
      Use proper HTML tags like <ul>, <li>, <b>, <p>, etc., for structuring the notes.`

    try {
      const response = await axios.post(`${backendUrl}/api/notes/generateNotes`, {
        prompt,
      });

      if (response) {
        setNotes(response.data.data); 
        console.log(response.data.data)
      } else {
        toast.error('Failed to generate notes. Please try again.');
      }
    } catch (error) {
      toast.error("An error occurred while generating notes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadAsPDF = async () => {
    const notesElement = document.querySelector("#notes-container");
    if (!notesElement) {
      toast.error("No notes to download!");
      return;
    }
  
    try {
      const canvas = await html2canvas(notesElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
  
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${topic}_notes.pdf`);
    } catch (error) {
      toast.error("Failed to download notes as PDF!");
      console.error(error);
    }
  };

  
  

  return (
    <div>
      <Navbar />
      <div className="bg-gradient-to-r from-background to-secondary-light min-h-screen flex flex-col items-center justify-center px-6 py-10">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-primary-dark mb-4 text-center tracking-wide">
            Let's Create Your Notes
          </h1>
          <p className="text-text-light mt-2 text-lg">
            Create detailed notes based on specific topics with customized formats to suit your learning style.
          </p>
        </div>

        <div className="bg-gradient-to-r from-background to-secondary-light shadow-2xl rounded-xl p-10 w-full max-w-3xl">
          <h1 className="text-2xl font-bold text-primary-dark mb-10 text-center tracking-normal">
            Enter Details to Generate Notes 
            <span> <AutoFixHigh className="text-primary-dark mb-2 ml-1" /></span>
          </h1>

          <div className="space-y-6">
            <TextField
              label="Topic"
              variant="outlined"
              fullWidth
              required
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

           { !loading && <button
              variant="contained"
              onClick={handleGenerateNotes}
              className="bg-primary text-background w-full font-bold py-4 rounded-lg mt-6 transform hover:scale-105 transition duration-300 shadow-md"
            >
              Generate Notes <AutoAwesome />
            </button>
            }
          </div>


          {loading && <button
              variant="contained"
              className="bg-primary-light text-background w-full font-bold py-4 rounded-lg mt-6 transform  shadow-md"
            >
              Generating Your Notes...  <AutoAwesome />
            </button>}

          {notes && (
            <div className="mt-10 shadow-md shadow-current p-6 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Here is your Notes On:</h2>
              <h3 className="text-3xl font-extrabold mb-4 flex justify-center text-primary">{topic.toUpperCase()} : {context}</h3>

              

              <div  id="notes-container"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(notes) }}
                style={{ padding: "20px", border: "1px solid #ddd", overflowY: "auto", maxHeight: "500px" }}
              />
               <div className="mt-6 flex justify-center gap-4">
                <button onClick={downloadAsPDF} className="bg-secondary-dark flex text-primary px-6 py-2 rounded-lg">
                 <Download className='mr-2 mt-1'/> Download Notes
                </button>
              
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Aigenerator;
