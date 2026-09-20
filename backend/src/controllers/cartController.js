import cart from "../models/cart.js";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Product from "../models/product.js";
import calcCartTotal from "../utils/cartTotal.js";

const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

const getOrCreateCart = async (userId) => {
  let cartItems = await cart.findOne({ user: userId });
  if (!cartItems) {
    cartItems = await cart.create({ user: userId, products: [] });
  }
  return cartItems;
};

const populateCartProducts = async (cartItems) => {
  await cartItems.populate("products.product");
  return cartItems;
};

export const getCart = async (req, res) => {
  try {
    const cartItems = await getOrCreateCart(req.user._id);
    if (cartItems.products.length === 0) {
      res.json({ products: [], totalItems: 0, totalPrice: 0 });
      return;
    }
    await populateCartProducts(cartItems);
    const before = cartItems.products.length;
    cartItems.products = cartItems.products.filter(
      (item) => item.product !== null,
    );
    if (cartItems.products.length !== before) cartItems.save();
    const { totalItems, totalPrice } = await calcCartTotal(cartItems);
    res.json({
      products: cartItems.products,
      totalItems,
      totalPrice,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Server error" });
  }
};

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId || !isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }
  const qty = Number(quantity ?? 1);
  if (!Number.isInteger(qty) || qty < 1) {
    return res
      .status(400)
      .json({ message: "Quantity must be an integer >= 1" });
  }
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  const cartItems = await getOrCreateCart(req.user._id);
  const index = cartItems.products.findIndex((item) => {
    return item.product.toString() === productId;
  });
  const currentQty = index < 0 ? 0 : cartItems.products[index].quantity;
  const nextQty = currentQty + qty;
  if (index >= 0) {
    cartItems.products[index].quantity = nextQty;
  } else cartItems.products.push({ product: productId, quantity: qty });

  await cartItems.save();
  await populateCartProducts(cartItems);
  const { totalItems, totalPrice } = await calcCartTotal(cartItems);
  res.json({
    products: cartItems.products,
    totalItems,
    totalPrice,
  });
});

export const updateCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  if (!productId || !isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }
  const qty = Number(quantity);
  if (!Number.isInteger(qty) || qty < 1) {
    return res
      .status(400)
      .json({ message: "Quantity must be an integer greater than 0" });
  }
  const cart = await getOrCreateCart(req.user._id);
  const index = cart.products.findIndex(
    (item) => item.product.toString() === productId,
  );
  if (index < 0) {
    return res.status(404).json({ message: "Product not found in cart" });
  }
  cart.products[index].quantity = qty;
  await cart.save();
  await populateCartProducts(cart);
  const { totalItems, totalPrice } = await calcCartTotal(cart);
  res.json({
    products: cart.products,
    totalItems,
    totalPrice,
  });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  if (!productId || !isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid productId" });
  }
  const cart = await getOrCreateCart(req.user._id);
  const before = cart.products.length;
  cart.products = cart.products.filter(
    (item) => item.product.toString() !== productId,
  );
  if (cart.products.length === before) {
    return res.status(404).json({ message: "Product not found in cart" });
  }
  await cart.save();
  await populateCartProducts(cart);
  const { totalItems, totalPrice } = await calcCartTotal(cart);
  res.json({
    products: cart.products,
    totalItems,
    totalPrice,
  });
});
export const clearCart = asyncHandler(async (req, res) => {
  const cartItems = await getOrCreateCart(req.user._id);
  cartItems.products = [];
  await cartItems.save();
  res.json({ message: "Cart cleared" });
});
