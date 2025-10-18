import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import app from "./src/app.js"
import connectDB from "./config/mongoDb.js"

const port = process.env.PORT || 3000

try{
    await connectDB()
}catch(error){ 
    console.log("Database connection failed", error)
}

app.listen(port, ()=>{
    console.log(`Server is at http://localhost:${port}`)
})