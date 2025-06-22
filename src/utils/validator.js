/**
 * Data validation utilities
 * @module utils/validator
 */

/**
 * Validates if a string is a valid email
 * 
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates if a string is a valid ISBN (10 or 13 digits)
 * 
 * @param {string} isbn - ISBN to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isValidISBN(isbn) {
  const isbnRegex = /^(?:\d{10}|\d{13})$/;
  return isbnRegex.test(isbn);
}

/**
 * Validates if a value is a positive number
 * 
 * @param {number|string} value - Value to validate
 * @returns {boolean} True if valid, false otherwise
 */
function isPositiveNumber(value) {
  const num = Number(value);
  return !isNaN(num) && num > 0;
}

/**
 * Validates data against a schema
 * 
 * @param {Object} data - Data to validate
 * @param {Object} schema - Schema with validation rules
 * @returns {Object} Object with error and validated data
 */
function validateData(data, schema) {
  const errors = {};
  const validatedData = {};
  
  // Process each field in the schema
  Object.keys(schema).forEach(field => {
    const rules = schema[field];
    const value = data[field];
    
    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[field] = `El campo ${field} es obligatorio`;
      return;
    }
    
    // Skip validation for undefined optional fields
    if (value === undefined || value === null || value === '') {
      if (rules.default !== undefined) {
        validatedData[field] = rules.default;
      }
      return;
    }
    
    // Type validation
    if (rules.type) {
      let valid = true;
      let typedValue = value;
      
      switch (rules.type) {
        case 'string':
          typedValue = String(value);
          break;
        case 'number':
          typedValue = Number(value);
          valid = !isNaN(typedValue);
          break;
        case 'boolean':
          if (typeof value === 'string') {
            typedValue = value.toLowerCase() === 'true';
          } else {
            typedValue = Boolean(value);
          }
          break;
        case 'email':
          valid = isValidEmail(value);
          break;
        case 'isbn':
          valid = isValidISBN(value);
          break;
        default:
          valid = true;
      }
      
      if (!valid) {
        errors[field] = `El campo ${field} debe ser un ${rules.type} válido`;
        return;
      }
      
      validatedData[field] = typedValue;
    } else {
      validatedData[field] = value;
    }
    
    // Min/max validation for strings and arrays
    if (rules.min !== undefined && (value.length < rules.min)) {
      errors[field] = `El campo ${field} debe tener al menos ${rules.min} caracteres`;
      return;
    }
    
    if (rules.max !== undefined && (value.length > rules.max)) {
      errors[field] = `El campo ${field} debe tener como máximo ${rules.max} caracteres`;
      return;
    }
    
    // Min/max validation for numbers
    if (rules.type === 'number') {
      if (rules.min !== undefined && (validatedData[field] < rules.min)) {
        errors[field] = `El campo ${field} debe ser mayor o igual a ${rules.min}`;
        return;
      }
      
      if (rules.max !== undefined && (validatedData[field] > rules.max)) {
        errors[field] = `El campo ${field} debe ser menor o igual a ${rules.max}`;
        return;
      }
    }
    
    // Enum validation
    if (rules.enum && !rules.enum.includes(value)) {
      errors[field] = `El campo ${field} debe ser uno de: ${rules.enum.join(', ')}`;
      return;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
      errors[field] = rules.message || `El campo ${field} tiene un formato inválido`;
      return;
    }
  });
  
  return {
    error: Object.keys(errors).length > 0 ? errors : null,
    data: validatedData
  };
}

module.exports = { 
  isValidEmail, 
  isValidISBN, 
  isPositiveNumber,
  validateData 
};