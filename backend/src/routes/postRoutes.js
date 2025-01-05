import express from "express";
import { getPost, uploadPost } from "../controllers/postController.js";

const postRouter = express.Router();


postRouter.post("/upload",uploadPost)
postRouter.get("/getPost",getPost)


export default postRouter