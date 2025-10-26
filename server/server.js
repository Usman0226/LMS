import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

import app from "./src/app.js"
import connectDB from "./config/mongoDb.js"

const port = process.env.PORT || 3000

try{
    await connectDB()
}catch(error){
    console.log("Database connection failed", error)
}

// Create HTTP server
const server = createServer(app);

// Setup Socket.IO
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    // Handle authentication
    socket.on('authenticate', (data) => {
        // In a real implementation, you would verify the token here
        socket.userId = data.userId;
        socket.userRole = data.userRole;
        socket.join(data.userId); // Join user-specific room for real-time messaging
        console.log('User authenticated:', data.userId);
    });
});

// Export Socket.IO instance for use in other modules
export { io };

server.listen(port, ()=>{
    console.log(`Server is at http://localhost:${port}`)
})