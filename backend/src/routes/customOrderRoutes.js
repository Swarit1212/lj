import express from "express";
import {
  createCustomOrder,
  getMyCustomOrders,
  getCustomOrdersAdmin,
  updateCustomOrderAdmin,
} from "../controllers/customOrderController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

// User routes
router.post("/", protect, upload.single("image"), createCustomOrder);
router.get("/my", protect, getMyCustomOrders);

// Admin routes
router.get("/admin", protect, adminOnly, getCustomOrdersAdmin);
router.put("/admin/:id", protect, adminOnly, updateCustomOrderAdmin);

export default router;
