import express from "express";
const router = express.Router();
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { protect } from "../middlewares/authMiddleware.js";
router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/:id", protect, updateCart);
router.delete("/clear", protect, clearCart);
router.delete("/:id", protect, removeFromCart);

export default router;
