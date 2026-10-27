import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import cors from 'cors';
import path from 'path';


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


const PORT=process.env.PORT;
const __dirname=path.resolve();


app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"))
    })
    
   
}


server.listen(PORT,()=>{

    console.log(`Server is running on port ${PORT}`)
    connectDB();

})