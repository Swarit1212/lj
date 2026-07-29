/**
 * Calculate total product price based on weight, live material rate per gram, and making charges.
 * @param {Object} product - Product data containing weight, makingCharge, material, etc.
 * @param {number} ratePerGram - Current live price of metal per gram
 * @returns {Object} { basePrice, makingCharge, totalPrice }
 */
export const calculateProductPrice = (product, ratePerGram = 0) => {
  if (!product) return { basePrice: 0, makingCharge: 0, totalPrice: 0 };
  
  const weight = Number(product.weight) || 0;
  const rate = Number(ratePerGram) || 0;
  const makingCharge = Number(product.makingCharge) || 0;

  const basePrice = Math.round(weight * rate);
  const totalPrice = basePrice + makingCharge;

  return {
    basePrice,
    makingCharge,
    totalPrice: Math.max(0, totalPrice),
  };
};

export default calculateProductPrice;
