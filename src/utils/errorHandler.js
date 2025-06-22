/**
 * Error handler utility functions
 * @module utils/errorHandler
 */

/**
 * Handles API errors by logging and sending appropriate response
 * 
 * @param {Object} res - Express response object
 * @param {Error} error - Error object
 * @param {number} [status=500] - HTTP status code to return
 * @returns {void}
 */
function handleError(res, error, status = 500) {
  console.error('Error:', error.message);
  res.status(status).json({ error: error.message });
}

  module.exports = { handleError };