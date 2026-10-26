import mongoose from 'mongoose';

export const connectDB=async ()=>{
    try {

        const conn=await mongoose.connect(process.env.MONGODB_URI);
        
        console.log(`MONGO DB connected at ${conn.connection.host}`);
    } catch (error) {
        console.log("there is error in database connection",error);
    }
}

