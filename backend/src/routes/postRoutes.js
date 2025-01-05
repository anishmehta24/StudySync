import express from "express";
import { uploadPost } from "../controllers/postController.js";

const postRouter = express.Router();


postRouter.post("/upload",uploadPost)


export default postRouter