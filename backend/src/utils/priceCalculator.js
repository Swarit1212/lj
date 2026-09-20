/**
 * Calculate jewelry product price based on material, purity, weight and current market rates.
 *
 * Tax formula: GST = (metalPrice + makingCharge) × 0.03 (3% per PRC tax regulation)
 * Rate source: from ../utils/rates.js (caches for 5 minutes, falls back to defaults)
 */
const priceCalculator = (product, ratePerGram) => {
  // Gold purity normalized by 24K scale; silver by 1000 (PROMPT_PER_MILLE) scale
  const purityFactor = product.material === "gold"
    ? product.purity / 24
    : product.purity / 1000;
  const metalPrice = product.weight * purityFactor * ratePerGram;

  // Making charge: either per-gram or fixed
  const makingCharge = product.makingChargeType === "perGram"
    ? product.makingCharge * product.weight
    : product.makingCharge;

  const subTotal = metalPrice + makingCharge;
  const tax = subTotal * 0.03; // 3% GST per PRC regulations
  const totalPrice = subTotal + tax;

  return {
    rate: ratePerGram,
    purity: product.purity,
    metalPrice: Math.round(metalPrice),
    makingCharge: Math.round(makingCharge),
    subTotal: Math.round(subTotal),
    tax: Math.round(tax),
    totalPrice: Math.round(totalPrice)
  };
};

export default priceCalculator;