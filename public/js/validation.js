/**
 * Client-side form validation utilities
 */

// Validation patterns
const patterns = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password: /^.{6,}$/,
  name: /^[a-zA-Z\s]{2,}$/,
  phone: /^[0-9]{10}$/,
  isbn: /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/,
  price: /^[0-9]+(\.[0-9]{1,2})?$/,
  stock: /^[0-9]+$/
};

// Error messages
const errorMessages = {
  email: 'Por favor ingresa un email válido',
  password: 'La contraseña debe tener al menos 6 caracteres',
  name: 'Por favor ingresa un nombre válido (mínimo 2 caracteres)',
  phone: 'Por favor ingresa un número de teléfono válido (10 dígitos)',
  isbn: 'Por favor ingresa un ISBN válido',
  price: 'Por favor ingresa un precio válido (formato: 00.00)',
  stock: 'Por favor ingresa una cantidad válida',
  required: 'Este campo es obligatorio'
};

// Initialize validation for a form
function initFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  
  // Add validation to all required inputs
  const inputs = form.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    // Skip submit buttons and hidden fields
    if (input.type === 'submit' || input.type === 'button' || input.type === 'hidden') {
      return;
    }
    
    // Add blur event for validation
    input.addEventListener('blur', () => {
      validateInput(input);
    });
    
    // Add input event for real-time validation
    input.addEventListener('input', () => {
      // If the field was previously marked as invalid, validate on input
      if (input.getAttribute('aria-invalid') === 'true') {
        validateInput(input);
      }
    });
  });
  
  // Add submit event to validate all fields
  form.addEventListener('submit', (event) => {
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      event.preventDefault();
      // Focus the first invalid field
      const firstInvalid = form.querySelector('[aria-invalid="true"]');
      if (firstInvalid) {
        firstInvalid.focus();
      }
    }
  });
}

// Validate a single input
function validateInput(input) {
  // Skip disabled fields
  if (input.disabled) return true;
  
  const value = input.value.trim();
  const type = input.dataset.validate || input.type;
  const isRequired = input.hasAttribute('required');
  
  // Clear previous error
  clearError(input);
  
  // Check if required field is empty
  if (isRequired && value === '') {
    showError(input, errorMessages.required);
    return false;
  }
  
  // Skip validation if field is empty and not required
  if (value === '' && !isRequired) {
    return true;
  }
  
  // Validate based on type
  if (patterns[type] && !patterns[type].test(value)) {
    showError(input, errorMessages[type]);
    return false;
  }
  
  return true;
}

// Show error message
function showError(input, message) {
  input.setAttribute('aria-invalid', 'true');
  
  // Create error message element if it doesn't exist
  let errorElement = input.nextElementSibling;
  if (!errorElement || !errorElement.classList.contains('field-error')) {
    errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.id = `${input.id}-error`;
    input.setAttribute('aria-describedby', errorElement.id);
    input.parentNode.insertBefore(errorElement, input.nextSibling);
  }
  
  errorElement.textContent = message;
}

// Clear error message
function clearError(input) {
  input.removeAttribute('aria-invalid');
  
  const errorElement = input.nextElementSibling;
  if (errorElement && errorElement.classList.contains('field-error')) {
    errorElement.textContent = '';
  }
}

// Export functions for use in other scripts
window.FormValidator = {
  initFormValidation,
  validateInput,
  patterns
};