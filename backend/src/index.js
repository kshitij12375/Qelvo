import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth.routes.js';
import { connectDB } from './lib/db.js';
import messageRoutes from './routes/message.routes.js';
import { app, io, server } from './lib/socket.js';

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("/{*splat}", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

const startServer = async () => {
    try {
        await connectDB();
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
};

startServer();
