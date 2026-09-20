import product from "../models/product.js";
import { getRate } from "../utils/rates.js";
import priceCalculator from "../utils/priceCalculator.js";

/**
 * Validate that material is a supported type (gold or silver).
 * Returns true if valid, false otherwise.
 */
export const validateMaterial = (material) => {
  if (!material || !["gold", "silver"].includes(material.toLowerCase())) {
    return false;
  }
  return true;
};

/**
 * Resolve the image URL from an uploaded file.
 * Handles both Cloudinary (HTTPS) and local disk storage paths.
 */
export const resolveImageUrl = (file) => {
  if (!file) return null;
  return file.path.startsWith('http')
    ? file.path
    : `/uploads/${file.filename}`;
};

export const getProductMeta = async (req, res, next) => {
  try {
    const { material } = req.query;
    if (!validateMaterial(material)) {
      return res.status(400).json({ error: "Invalid or missing material parameter" });
    }
    const filter = { material };
    const categories = await product.distinct("category", filter);
    const wearingTypes = await product.distinct("wearingType", filter);
    const purities = await product.distinct("purity", filter);

    const weightRanges = await product.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          minWeight: { $min: "$weight" },
          maxWeight: { $max: "$weight" },
        },
      },
    ]);
    res.json({
      material,
      categories,
      wearingTypes,
      purities,
      weightRange: weightRanges[0] || { minWeight: 0, maxWeight: 0 },
    });
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const {
      material,
      category,
      wearingType,
      purity,
      minWeight,
      maxWeight,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;
    if (!validateMaterial(material)) {
      return res.status(400).json({ error: "Invalid or missing material parameter" });
    }
    const filter = { material };
    if (category) filter.category = category;
    if (wearingType) filter.wearingType = wearingType;
    if (purity) filter.purity = Number(purity);

    if (minWeight || maxWeight) {
      filter.weight = {};
      if (minWeight) filter.weight.$gte = Number(minWeight);
      if (maxWeight) filter.weight.$lte = Number(maxWeight);
    }
    const sortOptions = ["createdAt", "visitCount", "weight", "price"];
    if (!sortOptions.includes(sortBy)) {
      return res.status(400).json({ error: "Invalid sortBy parameter" });
    }
    const order = sortOrder === "asc" ? 1 : -1;
    const pageNumber = Math.max(1, Number(page));
    const pageSize = Math.max(1, Math.min(30, Number(limit)));
    const skip = (pageNumber - 1) * pageSize;

    const dbSort = sortBy === "price" ? { createdAt: -1 } : { [sortBy]: order };
    const totalProducts = await product.countDocuments(filter);
    const allProducts = await product
      .find(filter)
      .sort(dbSort)
      .skip(skip)
      .limit(pageSize)
      .lean();

    const rate = await getRate(material);
    allProducts.forEach((p) => {
      const priceDetails = priceCalculator(p, rate);
      p.priceDetails = priceDetails;
    });
    if (sortBy === "price") {
      allProducts.sort((a, b) =>
        order === 1 ? a.price - b.price : b.price - a.price,
      );
    }
    res.json({
      material,
      rate,
      allProducts,
      totalProducts,
      totalPages: Math.ceil(totalProducts / pageSize),
      currentPage: pageNumber,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productData = await product
      .findByIdAndUpdate(id, { $inc: { visitCount: 1 } }, { new: true })
      .lean();
    if (!productData) {
      return res.status(404).json({ error: "Product not found" });
    }
    const rate = await getRate(productData.material);
    const priceDetails = priceCalculator(productData, rate);
    productData.priceDetails = priceDetails;
    res.json(productData);
  } catch (error) {
    next(error);
  }
};

export const postProduct = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.imageUrl = resolveImageUrl(req.file);
    }
    const newProduct = await product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
};

export const putProduct = async (req, res, next) => {
  try {
    if (req.file) {
      req.body.imageUrl = resolveImageUrl(req.file);
    }
    const updatedProduct = await product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res) => {
  const deletedProduct = await product.findByIdAndDelete(req.params.id);
  if (!deletedProduct) {
    return res.status(404).json({ error: "Product not found" });
  }
  res.json({ message: "Product deleted successfully" });
};

export const searchProducts = async (req, res, next) => {
  try {
    const { q, material, page = 1, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const filter = { $text: { $search: q } };
    if (material) filter.material = material;

    const pageNum = Math.max(1, Number(page));
    const pageSize = Math.max(1, Math.min(30, Number(limit)));

    const total = await product.countDocuments(filter);
    const results = await product
      .find(filter, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .lean();

    // Add price details
    for (const p of results) {
      const rate = await getRate(p.material);
      p.priceDetails = priceCalculator(p, rate);
    }

    res.json({ 
      results, 
      total, 
      totalPages: Math.ceil(total / pageSize), 
      currentPage: pageNum 
    });
  } catch (error) {
    next(error);
  }
};

export const getPopularProducts = async (req, res, next) => {
  try {
    const popular = await product.find().sort({ visitCount: -1 }).limit(5).lean();
    res.json(popular);
  } catch (error) {
    next(error);
  }
};
