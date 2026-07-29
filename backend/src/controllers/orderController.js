import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';
import { getRate } from '../utils/rates.js';
import priceCalculator from '../utils/priceCalculator.js';
import asyncHandler from 'express-async-handler';

// POST /api/orders — Place a new order from cart
export const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  // Validate shipping address
  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || 
      !shippingAddress.zipCode || !shippingAddress.country) {
    return res.status(400).json({ message: 'Complete shipping address is required' });
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  // Calculate prices for each item
  const orderItems = [];
  let totalAmount = 0;

  for (const item of cart.products) {
    if (!item.product) continue;

    const rate = await getRate(item.product.material);
    const priceDetails = priceCalculator(item.product, rate);
    const itemTotal = priceDetails.totalPrice * item.quantity;

    orderItems.push({
      product: item.product._id,
      quantity: item.quantity,
      price: priceDetails.totalPrice,
    });

    totalAmount += itemTotal;
  }

  if (orderItems.length === 0) {
    return res.status(400).json({ message: 'No valid products in cart to order' });
  }

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentStatus: 'pending',
    orderStatus: 'processing',
  });

  // Clear the cart after placing order
  cart.products = [];
  await cart.save();

  res.status(201).json(order);
});

// GET /api/orders — Get all orders for the logged-in user
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('items.product', 'name imageUrl material')
    .sort({ createdAt: -1 });

  res.json(orders);
});

// GET /api/orders/:id — Get a single order by ID
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product', 'name imageUrl material purity weight');

  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  // Ensure users can only see their own orders (unless admin)
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  res.json(order);
});

// GET /api/orders/admin/all — Admin: Get all orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status } = req.query;
  const filter = {};
  if (status) filter.orderStatus = status;

  const pageNum = Math.max(1, Number(page));
  const pageSize = Math.max(1, Math.min(50, Number(limit)));

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .populate('items.product', 'name imageUrl')
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize);

  res.json({
    orders,
    total,
    totalPages: Math.ceil(total / pageSize),
    currentPage: pageNum,
  });
});

// PUT /api/orders/:id/status — Admin: Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, paymentStatus } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  if (orderStatus) order.orderStatus = orderStatus;
  if (paymentStatus) order.paymentStatus = paymentStatus;

  await order.save();
  res.json(order);
});

// DELETE /api/orders/:id — Admin: Cancel/delete an order
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }

  order.orderStatus = 'cancelled';
  await order.save();
  res.json({ message: 'Order cancelled successfully', order });
});
