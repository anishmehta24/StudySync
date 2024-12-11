import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

const connectDB = async()=>{
    try {
        mongoose.connection.on('connected',()=>console.log("Database connected"));
       const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    } catch (error) {
        console.log("Database Connection error",error);
        process.exit(1);
    }
}

export default connectDB