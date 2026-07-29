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
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        console.log(user);

        if (!user) {
            return res.status(400).json({ message: "invalid email" });
        }

        if (!user.password) {
            return res.status(400).json({ message: "Use Google login" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "invalid password" });
        }

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            token: tokenGenerator(user),
            role: user.role
        });

    } catch (error) {
        console.error(error); // 🔥 ADD THIS
        return res.status(500).json({ message: "internal server error" });
    }
}
export default Login;