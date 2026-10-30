import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSocketIds, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const filteredUsers = await User.find({ _id: { $ne: req.user._id } }).select("-password");
        return res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error getting users for sidebar:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;

        if (!mongoose.isValidObjectId(userToChatId)) {
            return res.status(400).json({ message: "Invalid user id" });
        }

        const otherUser = await User.exists({ _id: userToChatId });
        if (!otherUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, recieverId: userToChatId },
                { senderId: userToChatId, recieverId: myId }
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json(messages);
    } catch (error) {
        console.error("Error getting messages:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body || {};
        const { id: recieverId } = req.params;
        const senderId = req.user._id;

        if (!mongoose.isValidObjectId(recieverId)) {
            return res.status(400).json({ message: "Invalid recipient id" });
        }

        if (String(senderId) === recieverId) {
            return res.status(400).json({ message: "You cannot message yourself" });
        }

        const recipientExists = await User.exists({ _id: recieverId });
        if (!recipientExists) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        const cleanText = typeof text === "string" ? text.trim() : "";
        const validImage = typeof image === "string" && image.startsWith("data:image/");

        if (cleanText.length > 5000) {
            return res.status(400).json({ message: "Message is too long" });
        }

        if (!cleanText && !validImage) {
            return res.status(400).json({ message: "A message or image is required" });
        }

        let imageUrl;
        if (validImage) {
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: "qelvo/messages",
                resource_type: "image"
            });
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = await Message.create({
            senderId,
            recieverId,
            text: cleanText,
            image: imageUrl
        });

        const receiverSocketIds = getRecieverSocketIds(recieverId);
        receiverSocketIds.forEach((socketId) => {
            io.to(socketId).emit("newMessage", newMessage);
        });

        return res.status(201).json(newMessage);
    } catch (error) {
        console.error("Error sending message:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
