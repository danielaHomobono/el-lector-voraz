// src/utils/errorHandler.js
  function handleError(res, error, status = 500) {
    console.error('Error:', error.message);
    res.status(status).json({ error: error.message });
  }

  module.exports = { handleError };