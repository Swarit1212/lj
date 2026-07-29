import express from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import { getRates, updateRate } from '../controllers/rateController.js';

const router = express.Router();

// Public/authenticated endpoint to get rates
router.get('/', getRates);

// Admin-only endpoint to update rates
router.put('/', protect, adminOnly, updateRate);

export default router;
