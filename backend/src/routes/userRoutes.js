import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { getUserData } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data",userAuth,getUserData)
userRouter.get("/data",getUserData)

export default userRouter