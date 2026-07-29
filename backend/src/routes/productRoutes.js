import express from "express";
import {
  getProducts,
  getProductById,
  getProductMeta,
  postProduct,
  putProduct,
  deleteProduct,
  searchProducts,
} from "../controllers/productController.js";

import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();
router.get("/meta", getProductMeta);
router.get("/search", searchProducts);
router.get("/", getProducts);
router.get("/:id", getProductById);

router.post("/", protect, adminOnly, upload.single('image'), postProduct);
router.put("/:id", protect, adminOnly, upload.single('image'), putProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
