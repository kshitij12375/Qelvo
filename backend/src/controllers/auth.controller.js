import cloudinary from "../lib/cloudinary.js";
import { cookieOptions, generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body || {};

    try {
        if (!fullName?.trim() || !email?.trim() || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullName: fullName.trim(),
            email: normalizedEmail,
            password: hashedPassword
        });

        generateToken(newUser._id, res);

        return res.status(201).json({
            _id: newUser._id,
            fullName: newUser.fullName,
            email: newUser.email,
            profilePic: newUser.profilePic
        });
    } catch (error) {
        console.error("Error in signup controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body || {};

    try {
        if (!email?.trim() || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        generateToken(user._id, res);

        return res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.error("Error in login controller:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const logout = (_req, res) => {
    res.clearCookie("jwt", cookieOptions);
    return res.status(200).json({ message: "Logout successfully" });
};

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body || {};

        if (typeof profilePic !== "string" || !profilePic.startsWith("data:image/")) {
            return res.status(400).json({ message: "A valid profile image is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic, {
            folder: "qelvo/profile-pictures",
            resource_type: "image"
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { profilePic: uploadResponse.secure_url },
            { new: true, runValidators: true }
        ).select("-password");

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error updating profile:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

export const checkAuth = (req, res) => {
    return res.status(200).json(req.user);
};
