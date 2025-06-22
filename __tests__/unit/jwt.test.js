/**
 * Unit tests for JWT utility functions
 */

const jwt = require('jsonwebtoken');
const { generateToken, generateRefreshToken, verifyToken, extractTokenFromHeader } = require('../../src/utils/jwt');

// Mock jsonwebtoken
jest.mock('jsonwebtoken');

describe('JWT Utils', () => {
  const mockUser = {
    _id: '60d21b4667d0d8992e610c85',
    email: 'admin@lectorvoraz.com',
    role: 'admin'
  };
  const mockToken = 'mock.jwt.token';
  const mockSecret = 'test-secret';

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.JWT_SECRET = mockSecret;
  });

  describe('generateToken', () => {
    test('should generate a token with user data', () => {
      jwt.sign.mockReturnValue(mockToken);

      const result = generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role
        },
        mockSecret,
        { expiresIn: '24h' }
      );
      expect(result).toBe(mockToken);
    });

    test('should use default secret when JWT_SECRET is not set', () => {
      delete process.env.JWT_SECRET;
      jwt.sign.mockReturnValue(mockToken);

      const result = generateToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser._id,
          email: mockUser.email,
          role: mockUser.role
        },
        'tu-jwt-secret',
        { expiresIn: '24h' }
      );
      expect(result).toBe(mockToken);
    });
  });

  describe('generateRefreshToken', () => {
    test('should generate a refresh token', () => {
      jwt.sign.mockReturnValue(mockToken);

      const result = generateRefreshToken(mockUser);

      expect(jwt.sign).toHaveBeenCalledWith(
        {
          id: mockUser._id,
          type: 'refresh'
        },
        mockSecret,
        { expiresIn: '7d' }
      );
      expect(result).toBe(mockToken);
    });
  });

  describe('verifyToken', () => {
    test('should verify a valid token', () => {
      const mockPayload = { id: mockUser._id, email: mockUser.email, role: mockUser.role };
      jwt.verify.mockReturnValue(mockPayload);

      const result = verifyToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, mockSecret);
      expect(result).toEqual(mockPayload);
    });

    test('should throw error for invalid token', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => verifyToken(mockToken)).toThrow('Token inválido');
    });

    test('should use default secret when JWT_SECRET is not set', () => {
      delete process.env.JWT_SECRET;
      const mockPayload = { id: mockUser._id };
      jwt.verify.mockReturnValue(mockPayload);

      const result = verifyToken(mockToken);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'tu-jwt-secret');
      expect(result).toEqual(mockPayload);
    });
  });

  describe('extractTokenFromHeader', () => {
    test('should extract token from Bearer header', () => {
      const mockReq = {
        headers: {
          authorization: 'Bearer mock.jwt.token'
        }
      };

      const result = extractTokenFromHeader(mockReq);

      expect(result).toBe('mock.jwt.token');
    });

    test('should return null when no authorization header', () => {
      const mockReq = {
        headers: {}
      };

      const result = extractTokenFromHeader(mockReq);

      expect(result).toBeNull();
    });

    test('should return null when authorization header does not start with Bearer', () => {
      const mockReq = {
        headers: {
          authorization: 'Basic dXNlcjpwYXNz'
        }
      };

      const result = extractTokenFromHeader(mockReq);

      expect(result).toBeNull();
    });

    test('should return null when authorization header is malformed', () => {
      const mockReq = {
        headers: {
          authorization: 'Bearer'
        }
      };

      const result = extractTokenFromHeader(mockReq);

      expect(result).toBeNull();
    });
  });

  describe('Token validation scenarios', () => {
    test('should handle expired token', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      expect(() => verifyToken(mockToken)).toThrow('Token inválido');
    });

    test('should handle malformed token', () => {
      jwt.verify.mockImplementation(() => {
        throw new Error('jwt malformed');
      });

      expect(() => verifyToken(mockToken)).toThrow('Token inválido');
    });
  });
}); 