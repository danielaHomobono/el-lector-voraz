// src/utils/validator.js
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function isValidISBN(isbn) {
    const isbnRegex = /^(?:\d{10}|\d{13})$/;
    return isbnRegex.test(isbn);
  }

  module.exports = { isValidEmail, isValidISBN };