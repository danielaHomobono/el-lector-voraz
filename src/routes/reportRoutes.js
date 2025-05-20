// src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.verifyApiKey, authMiddleware.restrictToAdmin, reportController.getSalesReport);

module.exports = router;