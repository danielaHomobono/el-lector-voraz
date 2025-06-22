/**
 * Validation middleware for request data
 * @module middleware/validationMiddleware
 */

const { validateData } = require('../utils/validator');

/**
 * Validates request body against a schema
 * 
 * @param {Object} schema - Validation schema object with field rules
 * @returns {Function} Express middleware function
 */
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error, data } = validateData(req.body, schema);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Datos inválidos', 
        details: error 
      });
    }
    
    // Replace request body with validated data
    req.body = data;
    next();
  };
};

/**
 * Validates request query parameters against a schema
 * 
 * @param {Object} schema - Validation schema object with field rules
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, data } = validateData(req.query, schema);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Parámetros de consulta inválidos', 
        details: error 
      });
    }
    
    // Replace request query with validated data
    req.query = data;
    next();
  };
};

/**
 * Validates request parameters against a schema
 * 
 * @param {Object} schema - Validation schema object with field rules
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, data } = validateData(req.params, schema);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Parámetros de ruta inválidos', 
        details: error 
      });
    }
    
    // Replace request params with validated data
    req.params = data;
    next();
  };
};

module.exports = {
  validateBody,
  validateQuery,
  validateParams
};