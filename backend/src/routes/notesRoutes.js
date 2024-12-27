import express from 'express'
import multer from 'multer'
import { uploadNotes } from '../controllers/notesController.js';
// import { uploadNotes } from '../controllers/notesController.js';
const notesRouter = express.Router();

const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        const destinationPath = './files';
        cb(null,destinationPath);
    },
    filename:function (req,file,cb) {
        const uniqueSuffix = Date.now();
        cb(null,uniqueSuffix + file.originalname);
    },
});

const upload = multer({
    storage: storage
})

notesRouter.post("/upload",upload.single("file"),uploadNotes);
// notesRouter.get("/getFiles",notesController.getNote);
// notesRouter.get("/getFiles/:id",notesController.getNoteByID);


export default notesRouter
