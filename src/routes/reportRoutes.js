const express = require('express');
const router = express.Router();
const ReportService = require('../services/reportService');
const authMiddleware = require('../middleware/authMiddleware');

// Obtener reporte de ventas
router.get('/sales', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const report = await ReportService.getSalesReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;