import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { getUserData, searchUsers } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data",userAuth,getUserData)
userRouter.get("/search", userAuth, searchUsers)

export default userRouter