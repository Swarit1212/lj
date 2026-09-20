import crypto from "crypto";
import Order from "../models/order.js";
import Cart from "../models/cart.js";
import { getRate } from "../utils/rates.js";
import priceCalculator from "../utils/priceCalculator.js";
import asyncHandler from "express-async-handler";
import { getRazorpayInstance, getRazorpayKeyId } from "../config/razorpay.js";

// Helper function to calculate cart item details with live rates
const calculateCartTotalWithLiveRates = async (cart) => {
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

  return { orderItems, totalAmount };
};

// GET /api/orders/razorpay/key — Get Razorpay Public Key ID
export const getRazorpayKey = asyncHandler(async (req, res) => {
  const keyId = getRazorpayKeyId();
  res.json({
    keyId: keyId || "rzp_test_mock_key",
    isLiveConfigured: Boolean(keyId),
  });
});

// POST /api/orders/razorpay/create-order — Create Razorpay order
export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate("products.product");
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const { orderItems, totalAmount } = await calculateCartTotalWithLiveRates(cart);

  if (orderItems.length === 0 || totalAmount <= 0) {
    return res.status(400).json({ message: "No valid products in cart to order" });
  }

  const razorpay = getRazorpayInstance();
  const amountInPaise = Math.round(totalAmount * 100);

  if (razorpay) {
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${req.user._id.toString().slice(-4)}`,
      notes: {
        userId: req.user._id.toString(),
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);
    return res.json({
      success: true,
      order: razorpayOrder,
      totalAmount,
      currency: "INR",
      keyId: getRazorpayKeyId(),
      isLiveConfigured: true,
    });
  } else {
    // Mock Razorpay order for development/testing when keys are not in .env
    const mockRazorpayOrder = {
      id: `order_mock_${Date.now()}`,
      amount: amountInPaise,
      currency: "INR",
      status: "created",
      receipt: `rcpt_mock_${Date.now()}`,
    };

    return res.json({
      success: true,
      order: mockRazorpayOrder,
      totalAmount,
      currency: "INR",
      keyId: "rzp_test_mock_key",
      isLiveConfigured: false,
      notice: "Running in mock mode. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env for live gateway.",
    });
  }
});

// POST /api/orders/razorpay/verify-payment — Verify payment signature and finalize order
export const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    shippingAddress,
  } = req.body;

  if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
    return res.status(400).json({ message: "Complete shipping address is required" });
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate("products.product");
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const { orderItems, totalAmount } = await calculateCartTotalWithLiveRates(cart);

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  let isSignatureValid = false;

  if (keySecret && razorpayOrderId && razorpayPaymentId && razorpaySignature) {
    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    isSignatureValid = generatedSignature === razorpaySignature;
  } else if (!keySecret || razorpayOrderId?.startsWith("order_mock_")) {
    // In mock mode or when keys are omitted, accept simulation verification
    isSignatureValid = true;
  }

  if (!isSignatureValid) {
    return res.status(400).json({
      success: false,
      message: "Payment verification failed. Invalid signature.",
    });
  }

  // Create order with verified payment status
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod: "razorpay",
    paymentStatus: "paid",
    orderStatus: "processing",
    paymentDetails: {
      razorpayOrderId: razorpayOrderId || "",
      razorpayPaymentId: razorpayPaymentId || `pay_mock_${Date.now()}`,
      razorpaySignature: razorpaySignature || "",
    },
  });

  // Clear cart
  cart.products = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Payment verified and order placed successfully!",
    order,
  });
});

// POST /api/orders — Place a new order (COD or simulated)
export const placeOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = "cod" } = req.body;

  // Validate shipping address
  if (
    !shippingAddress ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.zipCode ||
    !shippingAddress.country
  ) {
    return res.status(400).json({ message: "Complete shipping address is required" });
  }

  // Get user's cart
  const cart = await Cart.findOne({ user: req.user._id }).populate("products.product");
  if (!cart || cart.products.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const { orderItems, totalAmount } = await calculateCartTotalWithLiveRates(cart);

  if (orderItems.length === 0) {
    return res.status(400).json({ message: "No valid products in cart to order" });
  }

  const isPaid = paymentMethod === "simulated";

  // Create order
  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount,
    shippingAddress,
    paymentMethod,
    paymentStatus: isPaid ? "paid" : "pending",
    orderStatus: "processing",
  });

  // Clear the cart after placing order
  cart.products = [];
  await cart.save();

  res.status(201).json(order);
});

// GET /api/orders — Get all orders for the logged-in user
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "name imageUrl material")
    .sort({ createdAt: -1 });

  res.json(orders);
});

// GET /api/orders/:id — Get a single order by ID
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "items.product",
    "name imageUrl material purity weight"
  );

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  // Ensure users can only see their own orders (unless admin)
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(403).json({ message: "Not authorized" });
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
    .populate("user", "name email")
    .populate("items.product", "name imageUrl material purity weight")
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
    return res.status(404).json({ message: "Order not found" });
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
    return res.status(404).json({ message: "Order not found" });
  }

  order.orderStatus = "cancelled";
  await order.save();
  res.json({ message: "Order cancelled successfully", order });
});
