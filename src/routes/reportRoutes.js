const express = require('express');
const router = express.Router();
const ReportService = require('../services/reportService');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/sales', authMiddleware, async (req, res) => {
  try {
    const report = await ReportService.getSalesReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/inventory', authMiddleware, async (req, res) => {
  try {
    const report = await ReportService.getInventoryReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/financial', authMiddleware, async (req, res) => {
  try {
    const report = await ReportService.getFinancialReport();
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;