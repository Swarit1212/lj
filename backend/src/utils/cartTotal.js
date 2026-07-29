import { getRate } from './rates.js';
import priceCalculator from './priceCalculator.js';

const calcCartTotal = async (cart) => {
  let totalItems = 0;
  let totalPrice = 0;

  for (const item of cart.products) {
    if (!item.product) continue;
    
    try {
      const rate = await getRate(item.product.material);
      const priceDetails = priceCalculator(item.product, rate);
      
      totalItems += item.quantity;
      totalPrice += item.quantity * priceDetails.totalPrice;
    } catch (error) {
      console.error(`Error calculating price for product ${item.product._id}:`, error);
    }
  }

  return { totalItems, totalPrice };
};

export default calcCartTotal;
