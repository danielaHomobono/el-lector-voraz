/**
 * Unit tests for error handler utility
 */

const { handleError } = require('../../src/utils/errorHandler');

describe('Error Handler Utility', () => {
  // Setup
  let mockRes;
  
  beforeEach(() => {
    // Create a mock response object
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    // Spy on console.error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  afterEach(() => {
    // Restore console.error
    console.error.mockRestore();
  });

  // Test handleError function
  describe('handleError', () => {
    test('should set status code and return error message', () => {
      // Setup
      const error = new Error('Test error message');
      const status = 400;
      
      // Call the function
      handleError(mockRes, error, status);
      
      // Assertions
      expect(console.error).toHaveBeenCalledWith('Error:', error.message);
      expect(mockRes.status).toHaveBeenCalledWith(status);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
    
    test('should use default status code (500) when not provided', () => {
      // Setup
      const error = new Error('Test error message');
      
      // Call the function
      handleError(mockRes, error);
      
      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});