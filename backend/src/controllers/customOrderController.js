import CustomOrder from "../models/customOrder.js";

// Create a new custom order request
export const createCustomOrder = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a jewelry design sketch or image" });
    }

    const { phone, material, purity, weight, notes } = req.body;

    if (!phone || !material || !weight) {
      return res.status(400).json({ error: "Required fields (phone, material, weight) are missing" });
    }

    const designImageUrl = req.file.path.startsWith("http")
      ? req.file.path
      : `/uploads/${req.file.filename}`;

    const newCustomOrder = await CustomOrder.create({
      user: req.user._id,
      phone,
      material,
      purity,
      weight: Number(weight),
      notes,
      designImageUrl,
      status: "pending",
    });

    res.status(201).json(newCustomOrder);
  } catch (error) {
    next(error);
  }
};

// Retrieve custom orders for the logged-in customer
export const getMyCustomOrders = async (req, res, next) => {
  try {
    const orders = await CustomOrder.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Retrieve all custom orders for administrators
export const getCustomOrdersAdmin = async (req, res, next) => {
  try {
    const orders = await CustomOrder.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Update custom order pricing quote, admin notes, and status (Admin Only)
export const updateCustomOrderAdmin = async (req, res, next) => {
  try {
    const { status, quotedPrice, adminNotes } = req.body;
    const { id } = req.params;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (quotedPrice !== undefined) updateFields.quotedPrice = quotedPrice === "" ? null : Number(quotedPrice);
    if (adminNotes !== undefined) updateFields.adminNotes = adminNotes;

    const updatedOrder = await CustomOrder.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate("user", "name email");

    if (!updatedOrder) {
      return res.status(404).json({ error: "Custom order request not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    next(error);
  }
};
