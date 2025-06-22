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
  let mockReq;
  let mockRes;
  let mockNext;
  
  beforeEach(() => {
    process.env.API_KEY = 'test-api-key';
    
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

  describe('verifyApiKey', () => {
    test('should call next when API key is valid', () => {
      mockReq.headers['x-voraz-key'] = 'test-api-key';
      
      verifyApiKey(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should return 401 when API key is missing', () => {
      verifyApiKey(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Clave API inválida' });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    test('should return 401 when API key is invalid', () => {
      mockReq.headers['x-voraz-key'] = 'invalid-key';
      
      verifyApiKey(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Clave API inválida' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('restrictToAdmin', () => {
    test('should call next when user is admin', () => {
      mockReq.session.user = { role: 'admin' };
      
      restrictToAdmin(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should return 403 when user is not admin', () => {
      mockReq.session.user = { role: 'staff' };
      
      restrictToAdmin(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acceso denegado: Solo administradores' });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    test('should return 403 when user is not logged in', () => {
      restrictToAdmin(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acceso denegado: Solo administradores' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('restrictToStaff', () => {
    test('should call next when user is admin', () => {
      mockReq.session.user = { role: 'admin' };
      
      restrictToStaff(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should call next when user is staff', () => {
      mockReq.session.user = { role: 'staff' };
      
      restrictToStaff(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
    
    test('should return 403 when user is client', () => {
      mockReq.session.user = { role: 'client' };
      
      restrictToStaff(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acceso denegado: Solo personal autorizado' });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    test('should return 403 when user is not logged in', () => {
      restrictToStaff(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Acceso denegado: Solo personal autorizado' });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireAuth', () => {
    test('should call next when user is logged in', () => {
      mockReq.session.user = { role: 'client' };
      
      requireAuth(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.redirect).not.toHaveBeenCalled();
    });
    
    test('should redirect to login when user is not logged in', () => {
      requireAuth(mockReq, mockRes, mockNext);
      
      expect(mockRes.redirect).toHaveBeenCalledWith('/login');
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    test('should call next when user is admin', () => {
      mockReq.session.user = { role: 'admin' };
      
      requireAdmin(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.render).not.toHaveBeenCalled();
    });
    
    test('should render error page when user is not logged in', () => {
      requireAdmin(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.render).toHaveBeenCalledWith('error', {
        title: 'Acceso Denegado',
        message: 'Solo los administradores pueden acceder a esta página'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    test('should render error page when user is not admin', () => {
      mockReq.session.user = { role: 'staff' };
      
      requireAdmin(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.render).toHaveBeenCalledWith('error', {
        title: 'Acceso Denegado',
        message: 'Solo los administradores pueden acceder a esta página'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('requireStaff', () => {
    test('should call next when user is admin', () => {
      mockReq.session.user = { role: 'admin' };
      
      requireStaff(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.render).not.toHaveBeenCalled();
    });
    
    test('should call next when user is staff', () => {
      mockReq.session.user = { role: 'staff' };
      
      requireStaff(mockReq, mockRes, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.render).not.toHaveBeenCalled();
    });
    
    test('should render error page when user is not logged in', () => {
      requireStaff(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.render).toHaveBeenCalledWith('error', {
        title: 'Acceso Denegado',
        message: 'Solo el personal autorizado puede acceder a esta página'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
    
    test('should render error page when user is client', () => {
      mockReq.session.user = { role: 'client' };
      
      requireStaff(mockReq, mockRes, mockNext);
      
      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.render).toHaveBeenCalledWith('error', {
        title: 'Acceso Denegado',
        message: 'Solo el personal autorizado puede acceder a esta página'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
}); 