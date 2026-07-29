import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: {
      type: String,
      required: true,
    },
    imageUrl: { type: String, required: true },
    material: {
      type: String,
      required: true,
      enum: ["gold", "silver", "other"],
      index: true,
    },
    category: { type: String, required: true, index: true },
    wearingType: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Unisex"],
      index: true,
    },
    purity: { type: Number, required: true, index: true },
    weight: { type: Number, required: true, index: true },

    makingCharge: { type: Number, required: true },
    makingChargeType: {
      type: String,
      enum: ["perGram", "fixed"],
      default: "perGram",
    },

    visitCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

productSchema.index({ material: 1, purity: 1 });
productSchema.index({ material: 1, weight: 1 });
productSchema.index({ visitCount: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', description: 'text' });

const productModel = mongoose.model("Product", productSchema);

export default productModel;
