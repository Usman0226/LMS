import express from "express"
import { login, logout, register,sendData  } from "../controllers/auth.controllers.js"

const authRouter = express.Router()

authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',logout)
authRouter.get('/me',sendData)

export default authRouter