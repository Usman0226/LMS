import { connect } from "mongoose"
import app from "./src/app.js"
import connectDB from "./config/mongoDb.js"

const port = process.env.PORT || 3000

try{
    await connectDB()
    console.log("Database connected")
}catch(error){ 
    console.log("Database connection failed", error)
}

app.listen(port, ()=>{
    console.log(`Server is at http://localhost:${port}`)
})