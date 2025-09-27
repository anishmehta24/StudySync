import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { getUserData, searchUsers, updateAvatar } from "../controllers/userController.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = express.Router();

userRouter.get("/data",userAuth,getUserData)
userRouter.get("/search", userAuth, searchUsers)
userRouter.post("/avatar", userAuth, upload.single('avatar'), updateAvatar)

export default userRouter