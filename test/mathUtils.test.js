import { expect } from 'chai';
import { add, subtract, multiply, divide } from '../src/utils/mathUtils.js';

describe('Math Utils', () => {
  describe('add', () => {
    it('should add two positive numbers', () => {
      expect(add(2, 3)).to.equal(5);
    });

    it('should add two negative numbers', () => {
      expect(add(-2, -3)).to.equal(-5);
    });

    it('should add positive and negative numbers', () => {
      expect(add(5, -3)).to.equal(2);
      expect(add(-5, 3)).to.equal(-2);
    });

    it('should add zero to a number', () => {
      expect(add(5, 0)).to.equal(5);
      expect(add(0, 5)).to.equal(5);
    });

    it('should add decimal numbers', () => {
      expect(add(1.5, 2.3)).to.equal(3.8);
    });

    it('should add very large numbers', () => {
      expect(add(Number.MAX_SAFE_INTEGER, 1)).to.equal(Number.MAX_SAFE_INTEGER + 1);
    });
  });

  describe('subtract', () => {
    it('should subtract two positive numbers', () => {
      expect(subtract(5, 3)).to.equal(2);
    });

    it('should subtract two negative numbers', () => {
      expect(subtract(-5, -3)).to.equal(-2);
    });

    it('should subtract positive and negative numbers', () => {
      expect(subtract(5, -3)).to.equal(8);
      expect(subtract(-5, 3)).to.equal(-8);
    });

    it('should subtract zero from a number', () => {
      expect(subtract(5, 0)).to.equal(5);
    });

    it('should subtract a number from zero', () => {
      expect(subtract(0, 5)).to.equal(-5);
    });

    it('should subtract decimal numbers', () => {
      expect(subtract(5.5, 2.3)).to.equal(3.2);
    });

    it('should handle negative results', () => {
      expect(subtract(3, 5)).to.equal(-2);
    });
  });

  describe('multiply', () => {
    it('should multiply two positive numbers', () => {
      expect(multiply(3, 4)).to.equal(12);
    });

    it('should multiply two negative numbers', () => {
      expect(multiply(-3, -4)).to.equal(12);
    });

    it('should multiply positive and negative numbers', () => {
      expect(multiply(3, -4)).to.equal(-12);
      expect(multiply(-3, 4)).to.equal(-12);
    });

    it('should multiply by zero', () => {
      expect(multiply(5, 0)).to.equal(0);
      expect(multiply(0, 5)).to.equal(0);
    });

    it('should multiply by one', () => {
      expect(multiply(5, 1)).to.equal(5);
      expect(multiply(1, 5)).to.equal(5);
    });

    it('should multiply decimal numbers', () => {
      expect(multiply(2.5, 4)).to.equal(10);
    });

    it('should handle very large numbers', () => {
      expect(multiply(Number.MAX_SAFE_INTEGER, 1)).to.equal(Number.MAX_SAFE_INTEGER);
    });
  });

  describe('divide', () => {
    it('should divide two positive numbers', () => {
      expect(divide(10, 2)).to.equal(5);
    });

    it('should divide two negative numbers', () => {
      expect(divide(-10, -2)).to.equal(5);
    });

    it('should divide positive and negative numbers', () => {
      expect(divide(10, -2)).to.equal(-5);
      expect(divide(-10, 2)).to.equal(-5);
    });

    it('should divide by one', () => {
      expect(divide(5, 1)).to.equal(5);
    });

    it('should divide decimal numbers', () => {
      expect(divide(7.5, 2.5)).to.equal(3);
    });

    it('should handle decimal results', () => {
      expect(divide(7, 2)).to.equal(3.5);
    });

    it('should throw an error when dividing by zero', () => {
      expect(() => divide(5, 0)).to.throw('Cannot divide by zero');
      expect(() => divide(-5, 0)).to.throw('Cannot divide by zero');
      expect(() => divide(0, 0)).to.throw('Cannot divide by zero');
    });

    it('should handle zero divided by non-zero', () => {
      expect(divide(0, 5)).to.equal(0);
    });

    it('should handle very small numbers', () => {
      expect(divide(1, Number.MAX_SAFE_INTEGER)).to.be.closeTo(0, 0.0001);
    });
  });
});
