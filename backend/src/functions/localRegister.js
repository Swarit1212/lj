import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import dotenv from 'dotenv';
dotenv.config();

const tokenGenerator=(user)=>
{
    return jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION}
    );
}

const register=async(req,res)=>
{
    try {
        const {name,email,password}=req.body;
        const user =await User.findOne({email});
        if(user){
            return res.status(400).json({message:"user already exists"});
        }

        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=await User.create(
            {
                name,
                email,
                password:hashedPassword
            }
        )
        res.status(200).json(
            {
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                token:tokenGenerator(newUser),
                role:newUser.role
            }
        )
    } catch (error) {
        res.status(500).json({message:"internal server error"});
    }
}
export default register;