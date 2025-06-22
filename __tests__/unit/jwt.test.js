/**
 * Unit tests for JWT utility
 */

const jwt = require('jsonwebtoken');
const { 
  generateToken, 
  generateRefreshToken, 
  verifyToken, 
  extractTokenFromHeader 
} = require('../../src/utils/jwt');

// Mock jwt module
jest.mock('jsonwebtoken');

describe('JWT Utility', () => {
  // Setup
  const mockUser = {
    _id: '60d21b4667d0d8992e610c85',
    email: 'test@example.com',
    role: 'admin'
  };

  const mockToken = 'mock.jwt.token';
  const mockDecodedToken = {
    id: '60d21b4667d0d8992e610c85',
    email: 'test@example.com',
    role: 'admin'
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Test generateToken function
  describe('generateToken', () => {
    test('should call jwt.sign with correct parameters', () => {
      // Setup mock implementation
      jwt.sign.mockReturnValue(mockToken);

      // Call the function
      const token = generateToken(mockUser);

      // Assertions
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role
        },
        expect.any(String),
        { expiresIn: '24h' }
      );
      expect(token).toBe(mockToken);
    });
  });

  // Test generateRefreshToken function
  describe('generateRefreshToken', () => {
    test('should call jwt.sign with correct parameters', () => {
      // Setup mock implementation
      jwt.sign.mockReturnValue(mockToken);

      // Call the function
      const token = generateRefreshToken(mockUser);

      // Assertions
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser._id,
          type: 'refresh'
        },
        expect.any(String),
        { expiresIn: '7d' }
      );
      expect(token).toBe(mockToken);
    });
  });

  // Test verifyToken function
  describe('verifyToken', () => {
    test('should call jwt.verify and return decoded token', () => {
      // Setup mock implementation
      jwt.verify.mockReturnValue(mockDecodedToken);

      // Call the function
      const decoded = verifyToken(mockToken);

      // Assertions
      expect(jwt.verify).toHaveBeenCalledTimes(1);
      expect(jwt.verify).toHaveBeenCalledWith(mockToken, expect.any(String));
      expect(decoded).toEqual(mockDecodedToken);
    });

    test('should throw error when token is invalid', () => {
      // Setup mock implementation to throw error
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      // Assertions
      expect(() => verifyToken(mockToken)).toThrow('Token inválido');
    });
  });

  // Test extractTokenFromHeader function
  describe('extractTokenFromHeader', () => {
    test('should extract token from Authorization header', () => {
      // Setup mock request
      const req = {
        headers: {
          authorization: 'Bearer ' + mockToken
        }
      };

      // Call the function
      const token = extractTokenFromHeader(req);

      // Assertions
      expect(token).toBe(mockToken);
    });

    test('should return null when Authorization header is missing', () => {
      // Setup mock request without Authorization header
      const req = { headers: {} };

      // Call the function
      const token = extractTokenFromHeader(req);

      // Assertions
      expect(token).toBeNull();
    });

    test('should return null when Authorization header does not start with Bearer', () => {
      // Setup mock request with invalid Authorization header
      const req = {
        headers: {
          authorization: 'Basic ' + mockToken
        }
      };

      // Call the function
      const token = extractTokenFromHeader(req);

      // Assertions
      expect(token).toBeNull();
    });
  });
});