/**
 * Form validation for El Lector Voraz
 */

// Login form validation rules
const loginRules = {
  email: {
    required: 'El correo electrónico es obligatorio',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Ingrese un correo electrónico válido'
  },
  password: {
    required: 'La contraseña es obligatoria'
  }
};

// Product form validation rules
const productRules = {
  title: {
    required: 'El título es obligatorio'
  },
  price: {
    required: 'El precio es obligatorio',
    pattern: /^\d+(\.\d{1,2})?$/,
    message: 'Ingrese un precio válido'
  },
  stock: {
    required: 'El stock es obligatorio',
    pattern: /^\d+$/,
    message: 'Ingrese un número entero'
  }
};

// Client form validation rules
const clientRules = {
  name: {
    required: 'El nombre es obligatorio'
  },
  email: {
    required: 'El correo electrónico es obligatorio',
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Ingrese un correo electrónico válido'
  }
};

// Initialize form validation
document.addEventListener('DOMContentLoaded', function() {
  // Login form validation
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      if (!validateForm('login-form', loginRules)) {
        e.preventDefault();
      }
    });
  }
  
  // Product form validation
  const productForm = document.getElementById('product-form');
  if (productForm) {
    productForm.addEventListener('submit', function(e) {
      if (!validateForm('product-form', productRules)) {
        e.preventDefault();
      }
    });
  }
  
  // Client form validation
  const clientForm = document.getElementById('client-form');
  if (clientForm) {
    clientForm.addEventListener('submit', function(e) {
      if (!validateForm('client-form', clientRules)) {
        e.preventDefault();
      }
    });
  }
});