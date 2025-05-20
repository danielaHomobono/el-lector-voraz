// src/controllers/reportController.js
const reportService = require('../services/reportService');
const { handleError } = require('../utils/errorHandler');

async function getSalesReport(req, res) {
  try {
    const { startDate, endDate, groupBy } = req.query;
    
    // Validar fechas si se proporcionan
    if (startDate && !isValidDate(startDate)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de fecha inicial inválido. Use YYYY-MM-DD'
      });
    }
    
    if (endDate && !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        error: 'Formato de fecha final inválido. Use YYYY-MM-DD'
      });
    }

    const report = await reportService.generateSalesReport({
      startDate,
      endDate,
      groupBy: groupBy || 'day' // 'day', 'week', 'month'
    });
    
    // Verificar si es una petición API
    const isApiRequest = req.originalUrl.startsWith('/api/');
    
    if (isApiRequest) {
      return res.status(200).json({
        success: true,
        data: report
      });
    }
    
    // Si es una petición web, renderizar la vista
    res.render('financial', { 
      title: 'Reporte Financiero', 
      report,
      user: req.session.user,
      error: null,
      filters: { startDate, endDate, groupBy }
    });
  } catch (error) {
    console.error('Error en getSalesReport:', error);
    if (req.originalUrl.startsWith('/api/')) {
      handleError(res, error, 500);
    } else {
      res.render('financial', {
        title: 'Reporte Financiero',
        report: null,
        user: req.session.user,
        error: 'Error al generar el reporte financiero'
      });
    }
  }
}

// Función auxiliar para validar fechas
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

module.exports = { getSalesReport };