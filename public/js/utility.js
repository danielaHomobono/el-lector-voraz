/**
 * Utility functions for client-side JavaScript
 */

const Utility = {
  /**
   * Debounce function to limit how often a function can be called
   * 
   * @param {Function} func - Function to debounce
   * @param {number} wait - Time to wait in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  /**
   * Format price with currency symbol
   * 
   * @param {number|string} price - Price to format
   * @param {string} [currency='$'] - Currency symbol
   * @returns {string} Formatted price
   */
  formatPrice(price, currency = '$') {
    return `${currency}${parseFloat(price).toFixed(2)}`;
  },
  
  /**
   * Format date to locale string
   * 
   * @param {string|Date} date - Date to format
   * @returns {string} Formatted date
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  /**
   * Show a notification message
   * 
   * @param {string} message - Message to display
   * @param {string} [type='success'] - Message type (success, error, warning)
   * @param {number} [duration=3000] - Duration in milliseconds
   */
  showNotification(message, type = 'success', duration = 3000) {
    const container = document.getElementById('message-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `message ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Add animation class
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after duration
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        container.removeChild(notification);
      }, 300);
    }, duration);
  },
  
  /**
   * Fetch API wrapper with error handling
   * 
   * @param {string} url - URL to fetch
   * @param {Object} [options={}] - Fetch options
   * @returns {Promise<any>} Response data
   */
  async fetchAPI(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error en la solicitud');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en fetchAPI:', error);
      this.showNotification(error.message, 'error');
      throw error;
    }
  }
};

// Make utilities available globally
window.Utility = Utility;