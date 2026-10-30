import mongoose from 'mongoose';

export const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected at ${conn.connection.host}`);
    return conn;
};
