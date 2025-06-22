/**
 * Integration tests for authentication routes (adaptados a backend orientado a vistas)
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { mockUsers } = require('../mocks/data');
const User = require('../../src/models/User');

// Mock User model
jest.mock('../../src/models/User');

// Mock userService antes de requerir el controlador
jest.mock('../../src/services/userService', () => ({
  getUserById: jest.fn(),
  getUserByEmail: jest.fn(),
}));

const userService = require('../../src/services/userService');

// Create a mock express app for testing
const express = require('express');
const session = require('express-session');
const authRoutes = require('../../src/routes/authRoutes');

describe('Authentication Routes', () => {
  let app;
  
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(session({
      secret: 'test-secret',
      resave: false,
      saveUninitialized: false
    }));
    // Mock render para capturar la vista y el mensaje
    app.response.render = jest.fn(function(view, options) {
      this.status(this.statusCode || 200);
      this.send(`<html><body>${options && options.error ? options.error : ''}</body></html>`);
    });
    app.use('/auth', authRoutes);
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('POST /auth/login', () => {
    test('debe renderizar error cuando falta el email', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ password: 'password123' });
      expect([400, 401]).toContain(response.status);
      expect(response.text).toContain('Email y contraseña son requeridos');
    });
    test('debe renderizar error cuando falta el password', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'test@example.com' });
      expect([400, 401]).toContain(response.status);
      expect(response.text).toContain('Email y contraseña son requeridos');
    });
    test('debe renderizar error cuando el usuario no existe', async () => {
      userService.getUserByEmail.mockResolvedValue(null);
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'noexiste@example.com', password: 'password123' });
      expect(userService.getUserByEmail).toHaveBeenCalled();
      expect([400, 401]).toContain(response.status);
      expect(response.text).toContain('Credenciales inválidas');
    });
    test('debe renderizar error cuando el password es incorrecto', async () => {
      userService.getUserByEmail.mockResolvedValue(mockUsers[0]);
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'admin@lectorvoraz.com', password: 'wrongpassword' });
      expect(userService.getUserByEmail).toHaveBeenCalled();
      expect([400, 401]).toContain(response.status);
      expect(response.text).toContain('Credenciales inválidas');
    });
    // No se puede testear login exitoso porque el backend no responde con JSON ni redirige
  });

  describe('GET /auth/logout', () => {
    test('debe redirigir a /login', async () => {
      const response = await request(app)
        .get('/auth/logout');
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe('/login');
    });
  });

  // Test refresh token route
  describe('POST /auth/refresh-token', () => {
    test('should return 400 when refresh token is missing', async () => {
      const response = await request(app)
        .post('/auth/refresh-token')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    test('should return 401 when refresh token is invalid', async () => {
      const response = await request(app)
        .post('/auth/refresh-token')
        .send({ refreshToken: 'invalid-token' });
      
      expect(response.status).toBe(401);
    });

    test('should return 200 when refresh token is valid', async () => {
      // Mockear verifyToken para devolver un objeto válido
      jest.mock('../../src/utils/jwt', () => ({
        ...jest.requireActual('../../src/utils/jwt'),
        verifyToken: jest.fn(() => ({ id: mockUsers[0]._id, type: 'refresh' }))
      }));
      userService.getUserById.mockResolvedValue(mockUsers[0]);
      
      const response = await request(app)
        .post('/auth/refresh-token')
        .send({ refreshToken: 'valid-refresh-token' });
      
      expect(userService.getUserById).toHaveBeenCalled();
      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });
  });
}); 