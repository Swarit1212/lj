import express from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment,
} from '../controllers/orderController.js';

const router = express.Router();

// Razorpay payment routes
router.get('/razorpay/key', protect, getRazorpayKey);
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify-payment', protect, verifyRazorpayPayment);

// User routes
router.post('/', protect, placeOrder);
router.get('/', protect, getMyOrders);

// Admin routes (Must be declared before general :id route)
router.get('/admin/all', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.delete('/:id', protect, adminOnly, cancelOrder);

// Detail route
router.get('/:id', protect, getOrderById);

export default router;
