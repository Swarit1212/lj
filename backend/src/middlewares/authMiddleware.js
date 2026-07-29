import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';
dotenv.config();

const protect=async(req,res,next)=>{
    
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token=req.headers.authorization.split(' ')[1];
        try {
            const decoded=jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            res.status(401).json({message:"not authorized"});
        }
    }
    else{
        res.status(401).json({message:"not authorized, no token"});
    }
}
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}
export { protect, adminOnly };