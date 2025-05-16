const express = require('express');
const router = express.Router();
const reportService = require('../services/reportService');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/inventory', authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const report = await reportService.getInventoryReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/financial', authMiddleware.restrictToAdmin, async (req, res) => {
  try {
    const report = await reportService.getFinancialReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;