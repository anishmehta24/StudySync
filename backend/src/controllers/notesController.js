import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

import notesModel from '../models/notes.model.js';
import { upload } from '../middlewares/multer.middleware.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

dotenv.config({ path: './env' });


export const uploadNotes = async (req, res) => {
  try {
    const uploadFiles = upload.fields([
      { name: 'image', maxCount: 1 },
      { name: 'document', maxCount: 1 },
    ]);

    uploadFiles(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }

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
        data: newNote,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



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

        const data = await notesModel.find(query);
        res.send({data:data})
        
    } catch (error) {
        
        console.log(error);

    }
}
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
