/**
 * Unit tests for validation middleware
 */

const { 
  validateBody, 
  validateQuery, 
  validateParams 
} = require('../../src/middleware/validationMiddleware');

// Mock validator
jest.mock('../../src/utils/validator', () => ({
  validateData: jest.fn()
}));

const { validateData } = require('../../src/utils/validator');

describe('Validation Middleware', () => {
  // Setup
  let mockReq;
  let mockRes;
  let mockNext;
  
  beforeEach(() => {
    // Create mock request, response, and next function
    mockReq = {
      body: {},
      query: {},
      params: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    
    mockNext = jest.fn();
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  // Test validateBody middleware
  describe('validateBody', () => {
    test('should call next when validation passes', () => {
      // Setup
      const schema = { name: { type: 'string', required: true } };
      const validData = { name: 'Test' };
      
      // Mock validateData to return no errors
      validateData.mockReturnValue({ error: null, data: validData });
      
      // Set request body
      mockReq.body = validData;
      
      // Create middleware
      const middleware = validateBody(schema);
      
      // Call middleware
      middleware(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(validateData).toHaveBeenCalledWith(validData, schema);
      expect(mockReq.body).toEqual(validData);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should return 400 when validation fails', () => {
      // Setup
      const schema = { name: { type: 'string', required: true } };
      const invalidData = {};
      const errors = { name: 'El campo name es obligatorio' };
      
      // Mock validateData to return errors
      validateData.mockReturnValue({ error: errors, data: {} });
      
      // Set request body
      mockReq.body = invalidData;
      
      // Create middleware
      const middleware = validateBody(schema);
      
      // Call middleware
      middleware(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(validateData).toHaveBeenCalledWith(invalidData, schema);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Datos inválidos',
        details: errors
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  // Test validateQuery middleware
  describe('validateQuery', () => {
    test('should call next when validation passes', () => {
      // Setup
      const schema = { page: { type: 'number', default: 1 } };
      const validData = { page: 2 };
      
      // Mock validateData to return no errors
      validateData.mockReturnValue({ error: null, data: validData });
      
      // Set request query
      mockReq.query = validData;
      
      // Create middleware
      const middleware = validateQuery(schema);
      
      // Call middleware
      middleware(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(validateData).toHaveBeenCalledWith(validData, schema);
      expect(mockReq.query).toEqual(validData);
      expect(mockNext).toHaveBeenCalled();
    });
    
    test('should return 400 when validation fails', () => {
      // Setup
      const schema = { page: { type: 'number' } };
      const invalidData = { page: 'abc' };
      const errors = { page: 'El campo page debe ser un number válido' };
      
      // Mock validateData to return errors
      validateData.mockReturnValue({ error: errors, data: {} });
      
      // Set request query
      mockReq.query = invalidData;
      
      // Create middleware
      const middleware = validateQuery(schema);
      
      // Call middleware
      middleware(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(validateData).toHaveBeenCalledWith(invalidData, schema);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Parámetros de consulta inválidos',
        details: errors
      });
    });
  });

  // Test validateParams middleware
  describe('validateParams', () => {
    test('should call next when validation passes', () => {
      // Setup
      const schema = { id: { type: 'string', required: true } };
      const validData = { id: '60d21b4667d0d8992e610c85' };
      
      // Mock validateData to return no errors
      validateData.mockReturnValue({ error: null, data: validData });
      
      // Set request params
      mockReq.params = validData;
      
      // Create middleware
      const middleware = validateParams(schema);
      
      // Call middleware
      middleware(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(validateData).toHaveBeenCalledWith(validData, schema);
      expect(mockReq.params).toEqual(validData);
      expect(mockNext).toHaveBeenCalled();
    });
    
    test('should return 400 when validation fails', () => {
      // Setup
      const schema = { id: { type: 'string', required: true } };
      const invalidData = { id: '' };
      const errors = { id: 'El campo id es obligatorio' };
      
      // Mock validateData to return errors
      validateData.mockReturnValue({ error: errors, data: {} });
      
      // Set request params
      mockReq.params = invalidData;
      
      // Create middleware
      const middleware = validateParams(schema);
      
      // Call middleware
      middleware(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(validateData).toHaveBeenCalledWith(invalidData, schema);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: 'Parámetros de ruta inválidos',
        details: errors
      });
    });
  });
});