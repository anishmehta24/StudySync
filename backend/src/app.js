import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js"
import notesRouter from "./routes/notesRoutes.js"
import postRouter from "./routes/postRoutes.js"
import chatRouter from "./routes/chatRoutes.js"


const app = express()

const allowedOrigins =  [process.env.CORS_ORIGIN_1, process.env.CORS_ORIGIN_2, process.env.CORS_ORIGIN_3]; 

const corsOption = {
    origin: 
      (origin, callback) => {
          if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true); 
          } else {
            callback(new Error('Not allowed by CORS')); 
          }
        },
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    exposedHeaders: ['Content-Length', 'X-Response-Time']
};

app.use(cors(corsOption));

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// // API ENDPOINTS
app.get("/",(req,res)=>
    res.send("Api working")
)
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/notes',notesRouter);
app.use('/api/post',postRouter);
app.use('/api/chat',chatRouter);

export {app}
