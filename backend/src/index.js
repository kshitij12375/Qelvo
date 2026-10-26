import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import cors from 'cors';


import authRoutes from './routes/auth.routes.js';
import { connectDB } from './lib/db.js';
import messageRoutes from './routes/message.routes.js';
import { app,io,server } from './lib/socket.js';

dotenv.config();




app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);



const PORT=process.env.PORT;

server.listen(PORT,()=>{

    console.log(`Server is running on port ${PORT}`)
    connectDB();

})