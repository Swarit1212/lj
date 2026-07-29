import Rate from '../models/rate.js';
import { getRate } from '../utils/rates.js';
import asyncHandler from 'express-async-handler';

// GET /api/rates - Get current gold and silver rates
export const getRates = asyncHandler(async (req, res) => {
  const goldRate = await getRate('gold');
  const silverRate = await getRate('silver');
  res.json({
    gold: goldRate,
    silver: silverRate,
  });
});

// PUT /api/rates - Update rate (Admin only)
export const updateRate = asyncHandler(async (req, res) => {
  const { material, pricePerGram } = req.body;

  if (!material || !['gold', 'silver'].includes(material.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid material type. Must be gold or silver.' });
  }

  const price = Number(pricePerGram);
  if (isNaN(price) || price <= 0) {
    return res.status(400).json({ message: 'Price per gram must be a positive number.' });
  }

  const normalizedMaterial = material.toLowerCase();
  
  let rateDoc = await Rate.findOne({ material: normalizedMaterial });
  if (rateDoc) {
    rateDoc.pricePerGram = price;
    rateDoc.updatedBy = req.user._id;
    await rateDoc.save();
  } else {
    rateDoc = await Rate.create({
      material: normalizedMaterial,
      pricePerGram: price,
      updatedBy: req.user._id,
    });
  }

  res.json({
    message: `${normalizedMaterial.charAt(0).toUpperCase() + normalizedMaterial.slice(1)} rate updated successfully.`,
    rate: rateDoc,
  });
});
