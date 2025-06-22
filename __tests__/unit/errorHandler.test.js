/**
 * Unit tests for error handler utility
 */

const { handleError } = require('../../src/utils/errorHandler');

describe('Error Handler', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
  });

  describe('handleError', () => {
    test('should handle error and send JSON response', () => {
      const error = new Error('Test error');
      error.status = 500;

      handleError(mockRes, error, 500);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Test error' });
    });

    test('should use default status 500 when not provided', () => {
      const error = new Error('Test error');

      handleError(mockRes, error);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Test error' });
    });

    test('should handle custom status', () => {
      const error = new Error('Not found');

      handleError(mockRes, error, 404);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Not found' });
    });

    test('should handle validation error', () => {
      const error = new Error('Validation error');

      handleError(mockRes, error, 400);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Validation error' });
    });
  });
}); 