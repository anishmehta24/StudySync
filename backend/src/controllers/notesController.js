import express from 'express'
import dotenv from 'dotenv'
import multer from 'multer'
import path from 'path';
import notesModel from '../models/notes.model.js';

dotenv.config({
    path:'./env'
})

const storage = multer.memoryStorage();
var upload = multer({storage:storage});

export const uploadNotes = async(req,res) =>{
    try {

        const fileName = req.body.file;
        const fileDescription = req.body.description;
        const tags = req.body.tags;
        const file = req.file.filename;

        const uploadedBy = req.body.userId;
        console.log(uploadedBy);

        const newFile= new notesModel({
            title:fileName,
            description:fileDescription,
            tags:tags,
            file:file,
            uploadedBy:uploadedBy
        });

        await newFile.save();
        res.send({status : "OK"})
        
    } catch (error) {
        res.json({error:error.message});
        console.log(error)
    }
}


