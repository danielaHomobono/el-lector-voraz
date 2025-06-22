/**
 * Unit tests for validator utility
 */

const { 
  isValidEmail, 
  isValidISBN, 
  isPositiveNumber,
  validateData 
} = require('../../src/utils/validator');

describe('Validator Utility', () => {
  // Test isValidEmail function
  describe('isValidEmail', () => {
    test('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    test('should return false for invalid email addresses', () => {
      expect(isValidEmail('test')).toBe(false);
      expect(isValidEmail('test@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('test@example')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  // Test isValidISBN function
  describe('isValidISBN', () => {
    test('should return true for valid ISBN numbers', () => {
      expect(isValidISBN('9788497592208')).toBe(true); // ISBN-13
      expect(isValidISBN('8497592204')).toBe(true);    // ISBN-10
    });

    test('should return false for invalid ISBN numbers', () => {
      expect(isValidISBN('978849759220')).toBe(false);  // Too short
      expect(isValidISBN('97884975922081')).toBe(false); // Too long
      expect(isValidISBN('abcdefghij')).toBe(false);     // Not numeric
      expect(isValidISBN('')).toBe(false);
      expect(isValidISBN(null)).toBe(false);
      expect(isValidISBN(undefined)).toBe(false);
    });
  });

  // Test isPositiveNumber function
  describe('isPositiveNumber', () => {
    test('should return true for positive numbers', () => {
      expect(isPositiveNumber(1)).toBe(true);
      expect(isPositiveNumber(100)).toBe(true);
      expect(isPositiveNumber(0.5)).toBe(true);
      expect(isPositiveNumber('10')).toBe(true);
    });

    test('should return false for non-positive numbers and non-numbers', () => {
      expect(isPositiveNumber(0)).toBe(false);
      expect(isPositiveNumber(-1)).toBe(false);
      expect(isPositiveNumber('abc')).toBe(false);
      expect(isPositiveNumber('')).toBe(false);
      expect(isPositiveNumber(null)).toBe(false);
      expect(isPositiveNumber(undefined)).toBe(false);
    });
  });

  // Test validateData function
  describe('validateData', () => {
    test('should validate data against schema correctly', () => {
      const schema = {
        name: {
          type: 'string',
          required: true,
          min: 2
        },
        age: {
          type: 'number',
          min: 18
        },
        email: {
          type: 'email'
        }
      };

      const validData = {
        name: 'John Doe',
        age: 25,
        email: 'john@example.com'
      };

      const result = validateData(validData, schema);
      expect(result.error).toBeNull();
      expect(result.data).toEqual(validData);
    });

    test('should return errors for invalid data', () => {
      const schema = {
        name: {
          type: 'string',
          required: true,
          min: 2
        },
        age: {
          type: 'number',
          min: 18
        },
        email: {
          type: 'email'
        }
      };

      const invalidData = {
        name: 'J', // Too short
        age: 16,   // Below minimum
        email: 'invalid-email' // Invalid email
      };

      const result = validateData(invalidData, schema);
      expect(result.error).toBeTruthy();
      expect(result.error.name).toBeDefined();
      expect(result.error.age).toBeDefined();
      expect(result.error.email).toBeDefined();
    });

    test('should handle missing required fields', () => {
      const schema = {
        name: {
          type: 'string',
          required: true
        },
        age: {
          type: 'number',
          required: true
        }
      };

      const missingData = {
        name: 'John'
        // age is missing
      };

      const result = validateData(missingData, schema);
      expect(result.error).toBeTruthy();
      expect(result.error.age).toBeDefined();
    });

    test('should apply default values for missing optional fields', () => {
      const schema = {
        name: {
          type: 'string',
          required: true
        },
        role: {
          type: 'string',
          default: 'user'
        }
      };

      const data = {
        name: 'John'
        // role is missing but has default
      };

      const result = validateData(data, schema);
      expect(result.error).toBeNull();
      expect(result.data.name).toBe('John');
      expect(result.data.role).toBe('user');
    });
  });
});