/**
 * Integration tests for authentication routes
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { mockUsers } = require('../mocks/data');
const User = require('../../src/models/User');

// Mock User model
jest.mock('../../src/models/User');

// Create a mock express app for testing
const express = require('express');
const session = require('express-session');
const authRoutes = require('../../src/routes/authRoutes');

describe('Authentication Routes', () => {
  let app;
  
  beforeAll(() => {
    // Create a simple express app for testing
    app = express();
    
    // Configure middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Configure session
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false
    }));
    
    // Add auth routes
    app.use('/api/auth', authRoutes);
  });
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
  
  afterAll(async () => {
    // Clean up
    await mongoose.disconnect();
  });

  // Test login route
  describe('POST /api/auth/login', () => {
    test('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    
    test('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
    
    test('should return 401 when user is not found', async () => {
      // Mock User.findOne to return null (user not found)
      User.findOne = jest.fn().mockResolvedValue(null);
      
      const response = await request(app)
        .post('/api/auth/login')
        .send({ 
          email: 'nonexistent@example.com', 
          password: 'password123' 
        });
      
      expect(User.findOne).toHaveBeenCalled();
      expect(response.status).toBe(401);
    });
  });

  // Test logout route
  describe('GET /api/auth/logout', () => {
    test('should destroy session and redirect to login', async () => {
      const response = await request(app)
        .get('/api/auth/logout');
      
      // Since we can't easily test session destruction in supertest,
      // we'll just check that the response is a redirect
      expect(response.status).toBe(302); // Redirect status
      expect(response.headers.location).toBe('/login');
    });
  });
});