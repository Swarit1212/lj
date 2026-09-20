/**
 * Rate Utility Tests
 * Tests for backend/src/utils/rates.js
 */

import { getRate } from '../src/utils/rates.js';
import Rate from '../src/models/rate.js';

// Mock the Rate model
jest.mock('../src/models/rate.js', () => ({
  findOne: jest.fn()
}));

describe('rates.js - getRate', () => {
  beforeEach(() => {
    // Clear cache before each test
    jest.resetModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Valid metal types', () => {
    it('should return gold rate when found in database', async () => {
      const mockRateDoc = { pricePerGram: 16000 };
      Rate.findOne.mockResolvedValue(mockRateDoc);

      const result = await getRate('gold');

      expect(result).toBe(16000);
      expect(Rate.findOne).toHaveBeenCalledWith({ material: 'gold' });
    });

    it('should return silver rate when found in database', async () => {
      const mockRateDoc = { pricePerGram: 300 };
      Rate.findOne.mockResolvedValue(mockRateDoc);

      const result = await getRate('silver');

      expect(result).toBe(300);
      expect(Rate.findOne).toHaveBeenCalledWith({ material: 'silver' });
    });

    it('should handle case-insensitive material type', async () => {
      const mockRateDoc = { pricePerGram: 16000 };
      Rate.findOne.mockResolvedValue(mockRateDoc);

      await getRate('GOLD');
      expect(Rate.findOne).toHaveBeenCalledWith({ material: 'gold' });

      await getRate('SiLvEr');
      expect(Rate.findOne).toHaveBeenCalledWith({ material: 'silver' });
    });
  });

  describe('Fallback behavior', () => {
    it('should fallback to default gold rate when DB has no data', async () => {
      Rate.findOne.mockResolvedValue(null);

      const result = await getRate('gold');

      expect(result).toBe(16000);
    });

    it('should fallback to default silver rate when DB has no data', async () => {
      Rate.findOne.mockResolvedValue(null);

      const result = await getRate('silver');

      expect(result).toBe(300);
    });
  });

  describe('Error handling', () => {
    it('should throw error for invalid metal type', async () => {
      await expect(getRate('platinum')).rejects.toThrow('Invalid metalType');
    });

    it('should throw error when rate provider returns NaN', async () => {
      Rate.findOne.mockResolvedValue({ pricePerGram: NaN });

      await expect(getRate('gold')).rejects.toThrow('Rate provider returned invalid value');
    });

    it('should throw error when rate provider returns negative value', async () => {
      Rate.findOne.mockResolvedValue({ pricePerGram: -100 });

      await expect(getRate('gold')).rejects.toThrow('Rate provider returned invalid value');
    });

    it('should throw error when rate provider returns zero', async () => {
      Rate.findOne.mockResolvedValue({ pricePerGram: 0 });

      await expect(getRate('gold')).rejects.toThrow('Rate provider returned invalid value');
    });
  });

  describe('Caching behavior', () => {
    it('should cache results for 5 minutes', async () => {
      const mockRateDoc = { pricePerGram: 16000 };
      Rate.findOne.mockResolvedValue(mockRateDoc);

      // First call
      const firstResult = await getRate('gold');
      expect(firstResult).toBe(16000);

      // Second call should use cache (not call findOne again)
      const secondResult = await getRate('gold');
      expect(secondResult).toBe(16000);
      expect(Rate.findOne).toHaveBeenCalledTimes(1); // Only called once due to caching
    });

    it('should have separate cache for gold and silver', async () => {
      Rate.findOne
        .mockResolvedValueOnce({ pricePerGram: 16000 })
        .mockResolvedValueOnce({ pricePerGram: 300 });

      const goldRate = await getRate('gold');
      const silverRate = await getRate('silver');

      expect(goldRate).toBe(16000);
      expect(silverRate).toBe(300);
      expect(Rate.findOne).toHaveBeenCalledTimes(2);
    });
  });

  describe('Cache expiry fallback', () => {
    it('should return cached value when rate fetch fails after first success', async () => {
      // First call succeeds
      Rate.findOne.mockResolvedValue({ pricePerGram: 16000 });
      const firstResult = await getRate('gold');
      expect(firstResult).toBe(16000);

      // Second call fails, should return cached value
      Rate.findOne.mockRejectedValue(new Error('Database connection failed'));
      const cachedResult = await getRate('gold');
      expect(cachedResult).toBe(16000);
    });
  });
});
