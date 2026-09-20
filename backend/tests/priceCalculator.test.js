/**
 * Price Calculator Tests
 * Tests for backend/src/utils/priceCalculator.js
 */

import priceCalculator from '../src/utils/priceCalculator.js';

describe('priceCalculator', () => {
  describe('Gold products', () => {
    const goldProduct = {
      material: 'gold',
      purity: 22,
      weight: 10,
      makingChargeType: 'perGram',
      makingCharge: 500
    };
    const ratePerGram = 16000;

    it('should calculate correct metal price for 22k gold', () => {
      const result = priceCalculator(goldProduct, ratePerGram);

      // purityFactor = 22/24 = 0.9167
      // metalPrice = 10 * 0.9167 * 16000 = 146,667 (rounded)
      expect(result.purity).toBe(22);
      expect(result.rate).toBe(16000);
      expect(result.metalPrice).toBeCloseTo(Math.round(10 * (22 / 24) * 16000));
    });

    it('should calculate making charge correctly for perGram type', () => {
      const result = priceCalculator(goldProduct, ratePerGram);

      // makingCharge = 500 * 10 = 5000
      expect(result.makingCharge).toBe(5000);
    });

    it('should calculate sub total correctly', () => {
      const result = priceCalculator(goldProduct, ratePerGram);

      // subTotal = metalPrice + makingCharge
      expect(result.subTotal).toBe(result.metalPrice + result.makingCharge);
    });

    it('should apply 3% GST tax correctly', () => {
      const result = priceCalculator(goldProduct, ratePerGram);

      // tax = subTotal * 0.03
      expect(result.tax).toBeCloseTo(Math.round(result.subTotal * 0.03));
    });

    it('should calculate total price correctly', () => {
      const result = priceCalculator(goldProduct, ratePerGram);

      // totalPrice = subTotal + tax
      expect(result.totalPrice).toBe(result.subTotal + result.tax);
    });
  });

  describe('Silver products', () => {
    const silverProduct = {
      material: 'silver',
      purity: 925,
      weight: 50,
      makingChargeType: 'fixed',
      makingCharge: 2500
    };
    const ratePerGram = 300;

    it('should calculate correct metal price for 925 silver', () => {
      const result = priceCalculator(silverProduct, ratePerGram);

      // purityFactor = 925/1000 = 0.925
      // metalPrice = 50 * 0.925 * 300 = 13,875
      expect(result.purity).toBe(925);
      expect(result.rate).toBe(300);
      expect(result.metalPrice).toBeCloseTo(Math.round(50 * (925 / 1000) * 300));
    });

    it('should use fixed making charge', () => {
      const result = priceCalculator(silverProduct, ratePerGram);

      // makingCharge = 2500 (fixed, not multiplied by weight)
      expect(result.makingCharge).toBe(2500);
    });
  });

  describe('Edge cases', () => {
    it('should handle zero weight', () => {
      const product = {
        material: 'gold',
        purity: 24,
        weight: 0,
        makingChargeType: 'perGram',
        makingCharge: 0
      };
      const result = priceCalculator(product, 16000);

      expect(result.metalPrice).toBe(0);
      expect(result.totalPrice).toBe(0);
    });

    it('should handle 24k gold', () => {
      const product = {
        material: 'gold',
        purity: 24,
        weight: 1,
        makingChargeType: 'fixed',
        makingCharge: 100
      };
      const result = priceCalculator(product, 16000);

      // purityFactor = 24/24 = 1
      // metalPrice = 1 * 1 * 16000 = 16000
      expect(result.metalPrice).toBe(16000);
      expect(result.makingCharge).toBe(100);
    });

    it('should round all values to integers', () => {
      const product = {
        material: 'gold',
        purity: 18,
        weight: 7.5,
        makingChargeType: 'perGram',
        makingCharge: 750
      };
      const result = priceCalculator(product, 16000);

      expect(Number.isInteger(result.metalPrice)).toBe(true);
      expect(Number.isInteger(result.makingCharge)).toBe(true);
      expect(Number.isInteger(result.subTotal)).toBe(true);
      expect(Number.isInteger(result.tax)).toBe(true);
      expect(Number.isInteger(result.totalPrice)).toBe(true);
    });
  });

  describe('Return value structure', () => {
    const product = {
      material: 'gold',
      purity: 22,
      weight: 10,
      makingChargeType: 'perGram',
      makingCharge: 500
    };

    it('should return an object with all required properties', () => {
      const result = priceCalculator(product, 16000);

      expect(result).toHaveProperty('rate');
      expect(result).toHaveProperty('purity');
      expect(result).toHaveProperty('metalPrice');
      expect(result).toHaveProperty('makingCharge');
      expect(result).toHaveProperty('subTotal');
      expect(result).toHaveProperty('tax');
      expect(result).toHaveProperty('totalPrice');
    });

    it('should return correct rate', () => {
      const result = priceCalculator(product, 16000);
      expect(result.rate).toBe(16000);
    });

    it('should preserve original purity value', () => {
      const result = priceCalculator(product, 16000);
      expect(result.purity).toBe(22);
    });
  });
});
