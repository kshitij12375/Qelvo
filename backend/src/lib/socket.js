import {Server} from 'socket.io';
import http from 'http';
import express from 'express';

const app = express();
const server=http.createServer(app);

const io =new Server(server,{
    cors:{
        origin:["http://localhost:5173"]
    }
}

)

export function getRecieverSocketIds(userId){
    return userSocketMap[userId] ?? new Set();
}


const userSocketMap={};

io.on("connection",(socket)=>{
    console.log("A user conneceted",socket.id);

    const userId=socket.handshake.query.userId;

    if(userId){
        userSocketMap[userId] ??= new Set();
        userSocketMap[userId].add(socket.id);
    }

    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect", ()=>{
        console.log("User is disconnected",socket.id);
        const userSockets=userSocketMap[userId];
        userSockets?.delete(socket.id);
        if(userSockets?.size===0){
            delete userSocketMap[userId];
        }
        io.emit("getOnlineUsers",Object.keys(userSocketMap))

    })
})



export {app,io,server};
