import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js"
import notesRouter from "./routes/notesRoutes.js"


const app = express()


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


// API ENDPOINTS
app.get("/",(req,res)=>
    res.send("Api working")
)
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/notes',notesRouter);

export {app}
