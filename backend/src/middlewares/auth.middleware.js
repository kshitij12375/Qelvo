import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute=async (req,res,next)=>{


    try {
    console.log("Cookies:", req.cookies);
console.log("Token:", req.cookies?.jwt);
    const token=req.cookies.jwt;

    if(!token){
        return res.status(401).json({messaage:"Unauthorized "})
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET);

    if(!decoded){
        return res.status(401).json({messaage:"Invalid Token "})
    }

    const user=await User.findById(decoded.userId).select("-password");

    if(!user){
        return res.status(404).json({messaage:"User not found"})
    }

    req.user=user;

    next();
        
    } catch (error) {
          console.log("Error in protected route middleware",error.message);
         res.status(500).json({"message":"Internal Server error"});
    }

}