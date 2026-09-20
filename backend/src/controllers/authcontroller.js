import register from '../functions/localRegister.js';
import Login from '../functions/localLogin.js';
import googleLogin from '../functions/googleLogin.js';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/user.js';

dotenv.config();

const getProfile = (req, res) => {
    res.json(req.user);
}

const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const updates = {};
    if (name) updates.name = name;
    if (avatar) updates.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

/**
 * Change user password. Validates current password and enforces minimum strength on new password.
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Enforce minimum password strength
    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user.password) {
      return res.status(400).json({ message: 'Google accounts cannot change password' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password' });
  }
};

export default { register, Login, googleLogin, getProfile, updateProfile, changePassword };


