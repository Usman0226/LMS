import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

//Routes
import authRouter from "../Routes/auth.routes.js"

//middleware
import authMiddleware from "../middlewares/authMiddleware.js"

const app = express()

const allowedOrigins = ['http://localhost:5173','http://localhost:3000']

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({origin :allowedOrigins ,credentials :true}))


app.use('/api/auth',authRouter)

app.get('/',(req,res)=>{
    res.send("Welcome to LMS Backend")
})


export default app