import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema(
  {
    material: {
      type: String,
      enum: ['gold', 'silver'],
      unique: true,
      required: true,
    },
    pricePerGram: {
      type: Number,
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Rate = mongoose.model('Rate', rateSchema);
export default Rate;
