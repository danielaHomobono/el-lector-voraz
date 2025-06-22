/**
 * Jest setup file for El Lector Voraz
 * Sets up environment variables and global mocks for testing
 */

// Set up environment variables for testing
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.API_KEY = 'test-api-key';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.MONGODB_URI = 'mongodb://localhost:27017/el-lector-voraz-test';

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  // Comment these out to see the respective logs during tests
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  // Keep error and warn for debugging
  // error: jest.fn(),
  // warn: jest.fn(),
}; 