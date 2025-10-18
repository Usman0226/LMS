import { connect } from 'mongoose';

const connectDB = async ()=>{
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.log("DB connection failed !", new Error("Missing MONGODB_URI environment variable"));
        return;
    }

    try {
        await connect(uri);
        console.log("DB connected !");
        
    } catch (error) {
        console.log("DB connection failed !",error)       
    }
}

export default connectDB