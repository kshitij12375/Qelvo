import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import jwt from 'jsonwebtoken';

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";

const io = new Server(server, {
    cors: {
        origin: allowedOrigin,
        credentials: true
    }
});

const userSocketMap = {};

export function getRecieverSocketIds(userId) {
    return userSocketMap[userId] ?? new Set();
}

io.use((socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers.cookie || "";
        const tokenCookie = cookieHeader.split(";").map((cookie) => cookie.trim())
            .find((cookie) => cookie.startsWith("jwt="));

        if (!tokenCookie) {
            return next(new Error("Unauthorized"));
        }

        const token = decodeURIComponent(tokenCookie.slice(4));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.userId) {
            return next(new Error("Unauthorized"));
        }

        socket.userId = decoded.userId;
        next();
    } catch {
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => {
    const userId = socket.userId;

    userSocketMap[userId] ??= new Set();
    userSocketMap[userId].add(socket.id);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        const userSockets = userSocketMap[userId];
        userSockets?.delete(socket.id);

        if (userSockets?.size === 0) {
            delete userSocketMap[userId];
        }

        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
