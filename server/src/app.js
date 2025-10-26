import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

//Routes
import authRouter from "../Routes/auth.routes.js"
import courseRouter from '../Routes/course.routes.js';
import enrollmentRouter from '../Routes/enrollment.routes.js';
import assignmentRouter from '../Routes/assignment.routes.js';
import submissionRouter from '../Routes/submission.routes.js';
import gradeRouter from '../Routes/grade.routes.js';
import userRouter from '../Routes/user.routes.js';
import messagingRouter from '../Routes/messaging.routes.js';

//middleware
import authMiddleware from "../middlewares/authMiddleware.js"

const app = express()

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  'https://lms-red-iota.vercel.app',
  // Add production origins from environment variables
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : []),
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [])
]

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({origin :allowedOrigins ,credentials :true}))


app.use('/api/auth', authRouter);
app.use('/api/courses', courseRouter);
app.use('/api/enrollments', enrollmentRouter);
app.use('/api/assignments', assignmentRouter);
app.use('/api/submissions', submissionRouter);
app.use('/api/grades', gradeRouter);
app.use('/api/users', userRouter);
app.use('/api/messaging', messagingRouter);

app.get('/',(req,res)=>{
    res.send("Welcome to LMS Backend")
})


export default app