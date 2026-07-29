import express from 'express';
import {protect , adminOnly} from '../middlewares/authMiddleware.js';
const router = express.Router();

router.get('/test', protect, (req, res) => {
    res.json({message:"This is a protected route", user:req.user});
});
router.get('/admin', protect, adminOnly, (req, res) => {
    res.json({message:"This is an admin route", user:req.user});
});
export default router;