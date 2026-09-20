import OAuth2Client from'google-auth-library';
import dotenv from 'dotenv';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
dotenv.config();

const tokenGenerator=(user)=>
{
    return jwt.sign(
        {id:user._id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRATION}
    );
}
const client= new OAuth2Client.OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleLogin=async(req,res)=>{
    try{
        const { token }=req.body;
        const ticket=await client.verifyIdToken({
            idToken:token,
            audience:process.env.GOOGLE_CLIENT_ID
        })
        const payload=ticket.getPayload();
        const{sub, email , name}=payload;
        let user=await User.findOne({email});
        if(!user){
            user=await User.create({
                name,
                email,
                googleId:sub,
                provider:"google"
            });
        }
        res.json({
            id:user._id,
            name:user.name,
            email:user.email,
            token:tokenGenerator(user),
            role:user.role
        })
    }
    catch(e){
        res.status(401).json({message:"Google login failed"});
    }
}
export default googleLogin;