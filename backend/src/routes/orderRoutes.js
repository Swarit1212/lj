import express from 'express';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';

const router = express.Router();

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
