/**
 * Authentication routes
 * @module routes/authRoutes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateBody } = require('../middleware/validationMiddleware');
const { userSchemas } = require('../utils/validationSchemas');

router.post('/login', validateBody(userSchemas.login), authController.login);
router.post('/refresh-token', authController.refreshToken);
router.get('/logout', authController.logout);

module.exports = router;