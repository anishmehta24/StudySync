import express from "express";
import { addCommentToPost, getPost, getPostByID, uploadPost } from "../controllers/postController.js";

const postRouter = express.Router();


postRouter.post("/upload",uploadPost)
postRouter.get("/getPost",getPost)
postRouter.get("/getPostById/:id",getPostByID)
postRouter.put("/addComment/:id", addCommentToPost)


export default postRouter