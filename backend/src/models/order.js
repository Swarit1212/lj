import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["delivered", "shipped", "processing", "cancelled"],
      default: "processing",
    },
    shippingAddress: {
      address: String,
      city: String,
      zipCode: String,
      country: String,
    },
  },
  { timestamps: true },
);

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
