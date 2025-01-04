import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import notesModel from '../models/notes.model.js';
import { upload } from '../middlewares/multer.middleware.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import userModel from '../models/user.model.js';
import {GoogleGenerativeAI,HarmCategory,HarmBlockThreshold} from "@google/generative-ai"


dotenv.config({ path: './env' });


export const uploadNotes = async (req, res) => {
  try {
    // console.log("hello")
    // res.json({success : true , message: 'Notes uploaded successfully'})


      const { title, description, tags, uploadedBy } = req.body;
      const documentFile = req.files.document?.[0];
      const imageFile = req.files.image?.[0];

      if (!documentFile) {
        return res.status(400).json({ success: false, message: 'Document is required' });
      }

      // Upload the document to Cloudinary
      const documentUpload = await uploadOnCloudinary(documentFile.path);
      if (!documentUpload) {
        fs.unlinkSync(documentFile.path);
        return res.status(500).json({ success: false, message: 'Failed to upload document' });
      }

      // Upload the thumbnail image to Cloudinary, or use the default
      let thumbnailUrl = 'https://elafnotes.com/wp-content/uploads/2023/07/pdf-thumbnail-file-2127829-1024x1024.png';
      if (imageFile) {
        const imageUpload = await uploadOnCloudinary(imageFile.path);
        if (imageUpload) {
          thumbnailUrl = imageUpload.secure_url;
          fs.unlinkSync(imageFile.path); // Remove the local image file
        } else {
          fs.unlinkSync(imageFile.path); // Clean up if image upload fails
        }
      }

      // Remove the local document file after upload
      fs.unlinkSync(documentFile.path);

      // Save the note in the database
      const newNote = new notesModel({
        title,
        description,
        tags,
        thumbnail: thumbnailUrl,
        file: documentUpload.secure_url,
        uploadedBy,
      });

      await newNote.save();

      res.status(200).json({
        success: true,
        message: 'Notes uploaded successfully',
      });
    ;
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get All Notes

export const getNotes = async(req,res) => {
    try {

        const {title , tags} = req.query;
        const query = {}
        if(title) {
            query.title = {
                $regex: title,
                $options: "i"
            };
        }
        if(tags) {
            query.tags = {
                $regex: tags,
                $options: "i"
            };
        }

        const notes = await notesModel.find(query);

        // Add the `author` field for each note
        const notesWithAuthors = await Promise.all(
              notes.map(async (note) => {
                  const user = await userModel.findById(note.uploadedBy).select("name");
                  return {
                      ...note._doc,
                      author: user ? user.name : "Unknown", // Add author field
                  };
              })
        );

        res.status(200).send({ data: notesWithAuthors });
      } catch (error) {
          console.error(error);
          res.status(500).send({ message: "Server error", error });
      }
}



//get notes by userid
export const getNotesByID = async(req,res) => {
    
    try {

       const userId = req.params.id;
       console.log(userId);

       await notesModel.find({
        uploadedBy:userId
       }).then(data =>{
        res.send({  data:data})
       })
         
    } catch (error) {
        
        console.log(error);

    }
}

export const generateNotes = async(req,res)=>{
  const { prompt } = req.body; 

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

                    
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
                    
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });
                    
    const generationConfig = {
          temperature: 1,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
         responseMimeType: "text/plain",
    };
                    
    async function run() {
        const chatSession = model.startChat({
              generationConfig,
              history:  [
                {
                  role: "user",
                  parts: [
                    {text: "You are a notes generating assistant and you have to generate notes in this format whenever i give you prompt like this \nGenerate ${length} notes on the topic: \"${topic}\".\nKeywords or subtopics to cover: ${keywords}.\nFormat the notes in HTML format.\nProvide additional context for ${context}.\nEnsure the notes are clear, concise, and suitable for students preparing for this context.\nUse proper HTML tags like <ul>, <li>, <b>, <p>, etc., for structuring the notes.\n\n"},
                  ],
                },
                {
                  role: "model",
                  parts: [
                    {text: "Okay, I understand! I will generate notes in the HTML format you've specified, adhering to the prompt structure you've provided. I will focus on clarity, conciseness, and suitability for students, while also including keywords, context, and using proper HTML tags.\n\nI'm ready when you are. Just provide me with the prompt in the specified format. For example:\n\n```\nGenerate 3 notes on the topic: \"Photosynthesis\".\nKeywords or subtopics to cover: \"Chlorophyll, Light-dependent reactions, Carbon fixation\".\nFormat the notes in HTML format.\nProvide additional context for \"High school biology exam preparation\".\nEnsure the notes are clear, concise, and suitable for students preparing for this context.\nUse proper HTML tags like <ul>, <li>, <b>, <p>, etc., for structuring the notes.\n```\n\nI'll then generate the HTML output accordingly. Let's get started!\n"},
                  ],
                },
                {
                  role: "user",
                  parts: [
                    {text: "Keep in mind Whenever the length is Brief summary try to give the notes in 200 words explaining only the important topics with respect to the provided CONTEXT and when the length says \"in-depth \" then try to give the notes in 500 to 800 words or more explaining every topics according to context and when the length says \"Detailed explanation\" give the notes of as much as you can explaining each topic in detail and also dont reply anything whenever a notes is requested just give the notes\n"},
                  ],
                },
                {
                  role: "model",
                  parts: [
                    {text: "Okay, I understand. I will adjust the length of the notes based on your specifications:\n\n*   **Brief summary:** Approximately 200 words, focusing on the most important topics relevant to the context.\n*   **In-depth:** Approximately 500-800 words or more, explaining all topics in detail within the context.\n*   **Detailed explanation:** As much detail as possible, comprehensively covering each topic with extensive explanations.\n\nI will also refrain from any conversational replies and will directly provide the HTML formatted notes.\n"},
                  ],
                },
                {
                  role: "user",
                  parts: [
                    {text: "Also keep this in mind\n. Generate clear and concise notes based on the given prompt, using proper HTML tags (<h1>, <ul>, <li>, <p>, <b>, etc.) but exclude the overall <html>, <head>, or <body> tags. Always include a heading using an <h1> tag for the topic at the beginning of the notes.\n"},
                  ],
                },
                {
                  role: "model",
                  parts: [
                    {text: "Understood. I will now generate the notes as requested, adhering to all the specified constraints:\n\n*   Varying lengths based on \"Brief summary\", \"In-depth\", and \"Detailed explanation\".\n*   No conversational replies, only direct HTML output.\n*   Excluding `<html>`, `<head>`, and `<body>` tags.\n*   Using proper HTML tags for structure (`<h1>`, `<ul>`, `<li>`, `<p>`, `<b>`, etc.).\n*   Including a heading using `<h1>` for the topic at the beginning of the notes.\n"},
                  ],
                },
              ],
        });
                    
        const result = await chatSession.sendMessage(prompt);
        const cleanedResponse = result.response.text().trim();

        // Remove extra line breaks and leading spaces
        const formattedResponse = cleanedResponse.replace(/\s{2,}/g, " ").replace(/\n\s+/g, "\n");
        const finalResponse = formattedResponse.replace(/```html/g, "").replace(/```/g, "");
  
        res.json({ data: finalResponse });
        // console.log(result.response.text());
     }
                    
    run();
  
}