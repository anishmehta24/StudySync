import express from 'express'
import { getNotes, getNotesByID, uploadNotes } from '../controllers/notesController.js';
import { upload } from '../middlewares/multer.middleware.js';
// import { uploadNotes } from '../controllers/notesController.js';
const notesRouter = express.Router();



notesRouter.post("/upload", upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),uploadNotes);
notesRouter.get("/getFiles",getNotes);
notesRouter.get("/getFiles/:id",getNotesByID);


export default notesRouter
