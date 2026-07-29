import authcontroller from '../controllers/authcontroller.js';
import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { validationRegister,validateLogin } from '../middlewares/validators.js';

const router = express.Router();
router.post('/register',validationRegister, authcontroller.register);
router.post('/login',validateLogin, authcontroller.Login);
router.post('/google', authcontroller.googleLogin);
router.get('/profile', protect, authcontroller.getProfile);
router.put('/profile', protect, authcontroller.updateProfile);
router.put('/change-password', protect, authcontroller.changePassword);

export default router;