/**
 * Unit tests for authentication middleware
 */

const { 
  verifyApiKey, 
  restrictToAdmin, 
  restrictToStaff,
  requireAuth,
  requireAdmin,
  requireStaff
} = require('../../src/middleware/authMiddleware');

describe('Authentication Middleware', () => {
  // Setup
  let mockReq;
  let mockRes;
  let mockNext;
  
  beforeEach(() => {
    // Save original environment
    process.env.API_KEY = 'test-api-key';
    
    // Create mock request, response, and next function
    mockReq = {
      headers: {},
      session: {}
    };
    
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      redirect: jest.fn(),
      render: jest.fn()
    };
    
    mockNext = jest.fn();
  });

  // Test verifyApiKey middleware
  describe('verifyApiKey', () => {
    test('should call next when API key is valid', () => {
      // Setup
      mockReq.headers['x-voraz-key'] = 'test-api-key';
      
      // Call middleware
      verifyApiKey(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should return 401 when API key is missing', () => {
      // Call middleware
      verifyApiKey(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Clave API inválida' });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    test('should return 401 when API key is invalid', () => {
      // Setup
      mockReq.headers['x-voraz-key'] = 'invalid-key';
      
      // Call middleware
      verifyApiKey(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Clave API inválida' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  // Test restrictToAdmin middleware
  describe('restrictToAdmin', () => {
    test('should call next when user is admin', () => {
      // Setup
      mockReq.session.user = { role: 'admin' };
      
      // Call middleware
      restrictToAdmin(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should return 403 when user is not admin', () => {
      // Setup
      mockReq.session.user = { role: 'staff' };
      
      // Call middleware
      restrictToAdmin(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acceso denegado: Solo administradores' });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    test('should return 403 when user is not logged in', () => {
      // Call middleware
      restrictToAdmin(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acceso denegado: Solo administradores' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  // Test restrictToStaff middleware
  describe('restrictToStaff', () => {
    test('should call next when user is admin', () => {
      // Setup
      mockReq.session.user = { role: 'admin' };
      
      // Call middleware
      restrictToStaff(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should call next when user is staff', () => {
      // Setup
      mockReq.session.user = { role: 'staff' };
      
      // Call middleware
      restrictToStaff(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should return 403 when user is client', () => {
      // Setup
      mockReq.session.user = { role: 'client' };
      
      // Call middleware
      restrictToStaff(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acceso denegado: Solo personal autorizado' });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    test('should return 403 when user is not logged in', () => {
      // Call middleware
      restrictToStaff(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acceso denegado: Solo personal autorizado' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  // Test requireAuth middleware
  describe('requireAuth', () => {
    test('should call next when user is logged in', () => {
      // Setup
      mockReq.session.user = { role: 'client' };
      
      // Call middleware
      requireAuth(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.redirect).not.toHaveBeenCalled();
    });
    
    test('should redirect to login when user is not logged in', () => {
      // Call middleware
      requireAuth(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockRes.redirect).toHaveBeenCalledWith('/login');
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  // Test requireAdmin middleware
  describe('requireAdmin', () => {
    test('should call next when user is admin', () => {
      // Setup
      mockReq.session.user = { role: 'admin' };
      
      // Call middleware
      requireAdmin(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should render error page when user is not admin', () => {
      // Setup
      mockReq.session.user = { role: 'staff' };
      
      // Call middleware
      requireAdmin(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.render).toHaveBeenCalledWith('error', {
        title: 'Acceso Denegado',
        message: 'Solo los administradores pueden acceder a esta página'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  // Test requireStaff middleware
  describe('requireStaff', () => {
    test('should call next when user is admin', () => {
      // Setup
      mockReq.session.user = { role: 'admin' };
      
      // Call middleware
      requireStaff(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should call next when user is staff', () => {
      // Setup
      mockReq.session.user = { role: 'staff' };
      
      // Call middleware
      requireStaff(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should render error page when user is client', () => {
      // Setup
      mockReq.session.user = { role: 'client' };
      
      // Call middleware
      requireStaff(mockReq, mockRes, mockNext);
      
      // Assertions
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.render).toHaveBeenCalledWith('error', {
        title: 'Acceso Denegado',
        message: 'Solo el personal autorizado puede acceder a esta página'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});