import { expect } from 'chai';
import {
  capitalize,
  reverseString,
  isPalindrome,
} from '../src/utils/stringUtils.js';

describe('String Utils', () => {
  describe('capitalize', () => {
    it('should capitalize the first letter of a string', () => {
      expect(capitalize('hello')).to.equal('Hello');
    });

    it('should capitalize single character', () => {
      expect(capitalize('a')).to.equal('A');
    });

    it('should handle already capitalized string', () => {
      expect(capitalize('Hello')).to.equal('Hello');
    });

    it('should handle string with all uppercase', () => {
      expect(capitalize('HELLO')).to.equal('HELLO');
    });

    it('should handle string with numbers', () => {
      expect(capitalize('hello123')).to.equal('Hello123');
    });

    it('should handle string with special characters', () => {
      expect(capitalize('hello world!')).to.equal('Hello world!');
    });

    it('should handle empty string', () => {
      expect(capitalize('')).to.equal('');
    });

    it('should handle string starting with number', () => {
      expect(capitalize('123hello')).to.equal('123hello');
    });

    it('should handle string starting with special character', () => {
      expect(capitalize('!hello')).to.equal('!hello');
    });

    it('should throw an error for non-string input', () => {
      expect(() => capitalize(123)).to.throw('Input must be a string');
      expect(() => capitalize(null)).to.throw('Input must be a string');
      expect(() => capitalize(undefined)).to.throw('Input must be a string');
      expect(() => capitalize({})).to.throw('Input must be a string');
      expect(() => capitalize([])).to.throw('Input must be a string');
    });
  });

  describe('reverseString', () => {
    it('should reverse a simple string', () => {
      expect(reverseString('hello')).to.equal('olleh');
    });

    it('should reverse a single character', () => {
      expect(reverseString('a')).to.equal('a');
    });

    it('should reverse an empty string', () => {
      expect(reverseString('')).to.equal('');
    });

    it('should reverse a palindrome', () => {
      expect(reverseString('racecar')).to.equal('racecar');
    });

    it('should reverse a string with spaces', () => {
      expect(reverseString('hello world')).to.equal('dlrow olleh');
    });

    it('should reverse a string with numbers', () => {
      expect(reverseString('123abc')).to.equal('cba321');
    });

    it('should reverse a string with special characters', () => {
      expect(reverseString('hello!')).to.equal('!olleh');
    });

    it('should reverse a string with unicode characters', () => {
      expect(reverseString('привет')).to.equal('тевирп');
    });

    it('should throw an error for non-string input', () => {
      expect(() => reverseString(123)).to.throw('Input must be a string');
      expect(() => reverseString(null)).to.throw('Input must be a string');
      expect(() => reverseString(undefined)).to.throw('Input must be a string');
      expect(() => reverseString({})).to.throw('Input must be a string');
      expect(() => reverseString([])).to.throw('Input must be a string');
    });
  });

  describe('isPalindrome', () => {
    it('should return true for simple palindrome', () => {
      expect(isPalindrome('racecar')).to.be.true;
    });

    it('should return true for single character', () => {
      expect(isPalindrome('a')).to.be.true;
    });

    it('should return true for empty string', () => {
      expect(isPalindrome('')).to.be.true;
    });

    it('should return false for non-palindrome', () => {
      expect(isPalindrome('hello')).to.be.false;
    });

    it('should return true for palindrome with even length', () => {
      expect(isPalindrome('abba')).to.be.true;
    });

    it('should return false for almost palindrome', () => {
      expect(isPalindrome('abca')).to.be.false;
    });

    it('should handle palindrome with mixed case', () => {
      expect(isPalindrome('Racecar')).to.be.false;
    });

    it('should handle palindrome with spaces', () => {
      expect(isPalindrome('race car')).to.be.false;
    });

    it('should handle palindrome with numbers', () => {
      expect(isPalindrome('12321')).to.be.true;
    });

    it('should handle palindrome with special characters', () => {
      expect(isPalindrome('a!a')).to.be.true;
    });

    it('should return false for palindrome with different special characters', () => {
      expect(isPalindrome('a!b')).to.be.false;
    });

    it('should throw an error for non-string input', () => {
      expect(() => isPalindrome(123)).to.throw('Input must be a string');
      expect(() => isPalindrome(null)).to.throw('Input must be a string');
      expect(() => isPalindrome(undefined)).to.throw('Input must be a string');
      expect(() => isPalindrome({})).to.throw('Input must be a string');
      expect(() => isPalindrome([])).to.throw('Input must be a string');
    });
  });
});
