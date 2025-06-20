/**
 * Main JavaScript file for El Lector Voraz
 */

// Show loading indicator
function showLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.add('active');
}

// Hide loading indicator
function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.classList.remove('active');
}

// Show feedback message
function showMessage(message, type = 'success') {
  const messageContainer = document.getElementById('message-container');
  if (!messageContainer) return;
  
  const messageElement = document.createElement('div');
  messageElement.className = `message ${type}`;
  messageElement.textContent = message;
  
  messageContainer.innerHTML = '';
  messageContainer.appendChild(messageElement);
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    messageElement.style.opacity = '0';
    setTimeout(() => {
      messageContainer.innerHTML = '';
    }, 300);
  }, 3000);
}

// Update cart count indicator
function updateCartCount() {
  const cartCountElement = document.querySelector('.cart-count');
  if (!cartCountElement) return;
  
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  
  cartCountElement.textContent = count;
  cartCountElement.style.display = count > 0 ? 'flex' : 'none';
}

// Form validation
function validateForm(formId, rules) {
  const form = document.getElementById(formId);
  if (!form) return true;
  
  let isValid = true;
  
  for (const field in rules) {
    const input = form.querySelector(`[name="${field}"]`);
    if (!input) continue;
    
    const value = input.value.trim();
    const rule = rules[field];
    
    // Clear previous error
    const errorElement = form.querySelector(`#${field}-error`);
    if (errorElement) errorElement.remove();
    
    // Check required
    if (rule.required && !value) {
      showFieldError(input, rule.required);
      isValid = false;
      continue;
    }
    
    // Check pattern
    if (rule.pattern && !rule.pattern.test(value)) {
      showFieldError(input, rule.message);
      isValid = false;
    }
  }
  
  return isValid;
}

// Show field error
function showFieldError(input, message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'field-error';
  errorElement.id = `${input.name}-error`;
  errorElement.textContent = message;
  
  input.parentNode.appendChild(errorElement);
  input.setAttribute('aria-invalid', 'true');
  input.focus();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Update cart count on page load
  updateCartCount();
  
  // Add loading indicator to the page
  if (!document.getElementById('loading')) {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading';
    loadingElement.className = 'loading';
    loadingElement.innerHTML = 'Cargando...';
    document.body.appendChild(loadingElement);
  }
  
  // Add message container to the page
  if (!document.getElementById('message-container')) {
    const messageContainer = document.createElement('div');
    messageContainer.id = 'message-container';
    messageContainer.className = 'message-container';
    document.querySelector('main').prepend(messageContainer);
  }
});