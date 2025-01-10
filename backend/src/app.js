import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js"
import notesRouter from "./routes/notesRoutes.js"
import postRouter from "./routes/postRoutes.js"


const app = express()

const allowedOrigins = [process.env.CORS_ORIGIN, process.env.CORS_ORIGIN2,process.env.CORS_ORIGIN3];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

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
app.use('/api/post',postRouter);

export {app}
