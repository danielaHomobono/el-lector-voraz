/**
 * Unit tests for validation utility functions
 */

const { isValidEmail, isValidISBN } = require('../../src/utils/validator');

describe('Validator Utils', () => {
  describe('isValidEmail', () => {
    test('should return true for valid email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('admin@lectorvoraz.com')).toBe(true);
    });

    test('should return false for invalid email', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidISBN', () => {
    test('should return true for valid ISBN-10', () => {
      expect(isValidISBN('0123456789')).toBe(true);
      expect(isValidISBN('1234567890')).toBe(true);
    });

    test('should return true for valid ISBN-13', () => {
      expect(isValidISBN('9780123456789')).toBe(true);
      expect(isValidISBN('9781234567890')).toBe(true);
    });

    test('should return false for invalid ISBN', () => {
      expect(isValidISBN('123456789')).toBe(false); // too short
      expect(isValidISBN('12345678901')).toBe(false); // 11 digits
      expect(isValidISBN('123456789012')).toBe(false); // 12 digits
      expect(isValidISBN('12345678901234')).toBe(false); // too long
      expect(isValidISBN('123456789a')).toBe(false); // contains letters
      expect(isValidISBN('')).toBe(false);
      expect(isValidISBN(null)).toBe(false);
      expect(isValidISBN(undefined)).toBe(false);
    });
  });

  describe('Integration tests', () => {
    test('should validate book data', () => {
      const bookData = {
        title: 'Test Book',
        author: 'Test Author',
        isbn: '9780123456789',
        email: 'publisher@example.com'
      };

      expect(isValidEmail(bookData.email)).toBe(true);
      expect(isValidISBN(bookData.isbn)).toBe(true);
    });

    test('should validate user data', () => {
      const userData = {
        name: 'Test User',
        email: 'user@example.com'
      };

      expect(isValidEmail(userData.email)).toBe(true);
    });
  });
}); 