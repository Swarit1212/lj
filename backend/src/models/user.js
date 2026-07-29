import mongoose from 'mongoose';
const userSchema=new mongoose.Schema(
    {
        name:String,
        email:{
            type:String,
            unique:true,

        },
        password:{
            type:String,
            select:false
        },
        provider:{
            type:String,
            default:'local',
            enum:['local','google']
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user"
        },
        googleId:String,
        avatar:String
    }
)
const User=mongoose.model('User',userSchema);
export default User;