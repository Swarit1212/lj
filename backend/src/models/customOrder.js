import mongoose from "mongoose";

const customOrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    material: {
      type: String,
      enum: ["gold", "silver", "other"],
      required: true,
      default: "gold",
    },
    purity: {
      type: String,
      trim: true,
      default: "",
    },
    weight: {
      type: Number,
      required: true,
    },
    designImageUrl: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "quoted", "approved", "in-production", "completed", "cancelled"],
      default: "pending",
    },
    quotedPrice: {
      type: Number,
      default: null,
    },
    adminNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

customOrderSchema.index({ user: 1 });
customOrderSchema.index({ status: 1 });
customOrderSchema.index({ createdAt: -1 });

const CustomOrder = mongoose.model("CustomOrder", customOrderSchema);
export default CustomOrder;
