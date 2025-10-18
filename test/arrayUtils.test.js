import { expect } from 'chai';
import { findMax, findMin, removeDuplicates } from '../src/utils/arrayUtils.js';

describe('Array Utils', () => {
  describe('findMax', () => {
    it('should return the maximum value from an array of numbers', () => {
      expect(findMax([1, 5, 3, 9, 2])).to.equal(9);
    });

    it('should return the maximum value from an array with negative numbers', () => {
      expect(findMax([-1, -5, -3, -9, -2])).to.equal(-1);
    });

    it('should return the same value for single element array', () => {
      expect(findMax([42])).to.equal(42);
    });

    it('should return the maximum value from an array with zeros', () => {
      expect(findMax([0, -1, 1])).to.equal(1);
    });

    it('should throw an error for non-array input', () => {
      expect(() => findMax('not an array')).to.throw('Input must be an array');
      expect(() => findMax(123)).to.throw('Input must be an array');
      expect(() => findMax(null)).to.throw('Input must be an array');
      expect(() => findMax(undefined)).to.throw('Input must be an array');
      expect(() => findMax({})).to.throw('Input must be an array');
    });

    it('should handle empty array', () => {
      expect(() => findMax([])).to.throw('Array cannot be empty');
    });
  });

  describe('findMin', () => {
    it('should return the minimum value from an array of numbers', () => {
      expect(findMin([1, 5, 3, 9, 2])).to.equal(1);
    });

    it('should return the minimum value from an array with negative numbers', () => {
      expect(findMin([-1, -5, -3, -9, -2])).to.equal(-9);
    });

    it('should return the same value for single element array', () => {
      expect(findMin([42])).to.equal(42);
    });

    it('should return the minimum value from an array with zeros', () => {
      expect(findMin([0, -1, 1])).to.equal(-1);
    });

    it('should throw an error for non-array input', () => {
      expect(() => findMin('not an array')).to.throw('Input must be an array');
      expect(() => findMin(123)).to.throw('Input must be an array');
      expect(() => findMin(null)).to.throw('Input must be an array');
      expect(() => findMin(undefined)).to.throw('Input must be an array');
      expect(() => findMin({})).to.throw('Input must be an array');
    });

    it('should handle empty array', () => {
      expect(() => findMin([])).to.throw('Array cannot be empty');
    });
  });

  describe('removeDuplicates', () => {
    it('should remove duplicate numbers from an array', () => {
      const result = removeDuplicates([1, 2, 2, 3, 3, 3, 4]);
      expect(result).to.deep.equal([1, 2, 3, 4]);
    });

    it('should remove duplicate strings from an array', () => {
      const result = removeDuplicates(['a', 'b', 'b', 'c', 'c', 'c', 'd']);
      expect(result).to.deep.equal(['a', 'b', 'c', 'd']);
    });

    it('should return the same array if no duplicates', () => {
      const result = removeDuplicates([1, 2, 3, 4]);
      expect(result).to.deep.equal([1, 2, 3, 4]);
    });

    it('should return empty array for empty input', () => {
      const result = removeDuplicates([]);
      expect(result).to.deep.equal([]);
    });

    it('should handle array with all same elements', () => {
      const result = removeDuplicates([5, 5, 5, 5]);
      expect(result).to.deep.equal([5]);
    });

    it('should preserve order of first occurrence', () => {
      const result = removeDuplicates([3, 1, 3, 2, 1, 3]);
      expect(result).to.deep.equal([3, 1, 2]);
    });

    it('should throw an error for non-array input', () => {
      expect(() => removeDuplicates('not an array')).to.throw('Input must be an array');
      expect(() => removeDuplicates(123)).to.throw('Input must be an array');
      expect(() => removeDuplicates(null)).to.throw('Input must be an array');
      expect(() => removeDuplicates(undefined)).to.throw('Input must be an array');
      expect(() => removeDuplicates({})).to.throw('Input must be an array');
    });
  });
});
