import Rate from '../models/rate.js';

/**
 * In-memory rate cache with 5-minute TTL per metal type.
 * Falls back to default reference rates when DB has no data.
 */
let cache = {
  gold: { value: null, expiresAt: 0 },
  silver: { value: null, expiresAt: 0 },
};

// Cache TTL: 5 minutes (market rates update slowly)
const TTL_MS = 5 * 60 * 1000;

const fetchRate = async (metalType) => {
  const normalizedType = metalType.toLowerCase();
  const rateDoc = await Rate.findOne({ material: normalizedType });
  if (rateDoc) {
    return rateDoc.pricePerGram;
  }
  // Fallback to default rates if not yet configured in database
  if (normalizedType === "gold") return 16000;
  if (normalizedType === "silver") return 300;
  throw new Error("Invalid metal type");
};

export const getRate = async (metalType) => {
  try {
    if (!["gold", "silver"].includes(metalType.toLowerCase())) {
      const err = new Error("Invalid metalType");
      err.statusCode = 400;
      throw err;
    }

    const now = Date.now();
    if (cache[metalType].value && cache[metalType].expiresAt > now) {
      return cache[metalType].value;
    }
    const rate = await fetchRate(metalType);
    if (typeof rate !== "number" || Number.isNaN(rate) || rate <= 0) {
      throw new Error("Rate provider returned invalid value");
    }
    cache[metalType] = { value: rate, expiresAt: now + TTL_MS };
    return rate;
  } catch (error) {
    if (cache[metalType].value !== null) return cache[metalType].value;
    throw error;
  }
};
