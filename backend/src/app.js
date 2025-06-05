import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js"
import notesRouter from "./routes/notesRoutes.js"
import postRouter from "./routes/postRoutes.js"


const app = express()


app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

// API ENDPOINTS
app.get("/",(req,res)=>
    res.send("Api working")
)
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/notes',notesRouter);
app.use('/api/post',postRouter);

export {app}
