import { connect } from 'mongoose';

const connectDB = async ()=>{
    try {
        await connect("mongodb+srv://chandanusmangani_db_user:2NDdhx9Ky5IKYWgP@cluster0.irgcxyy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        console.log("DB connected !");
        
    } catch (error) {
        console.log("DB connection failed !",error)       
    }
}
// 2NDdhx9Ky5IKYWgP
export default connectDB