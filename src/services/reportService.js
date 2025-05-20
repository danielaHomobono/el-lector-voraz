// src/services/reportService.js
const fileService = require('./fileService');

async function generateSalesReport({ startDate, endDate, groupBy = 'day' } = {}) {
  try {
    const sales = await fileService.readFile('src/data/sales.json');
    
    // Validar que sales sea un array
    if (!Array.isArray(sales)) {
      throw new Error('El archivo de ventas no contiene un array válido');
    }

    // Filtrar ventas por fecha si se especifican
    let filteredSales = sales;
    if (startDate || endDate) {
      filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.date);
        if (startDate && saleDate < new Date(startDate)) return false;
        if (endDate && saleDate > new Date(endDate + 'T23:59:59')) return false;
        return true;
      });
    }

    const report = filteredSales.reduce((acc, sale) => {
      // Determinar la clave de agrupación según el parámetro groupBy
      let groupKey;
      const saleDate = new Date(sale.date);
      
      switch (groupBy) {
        case 'week':
          // Obtener el lunes de la semana
          const day = saleDate.getDay();
          const diff = saleDate.getDate() - day + (day === 0 ? -6 : 1);
          groupKey = new Date(saleDate.setDate(diff)).toISOString().split('T')[0];
          break;
        case 'month':
          groupKey = saleDate.toISOString().slice(0, 7); // YYYY-MM
          break;
        default: // 'day'
          groupKey = sale.date.split('T')[0];
      }
      
      if (!acc[groupKey]) {
        acc[groupKey] = {
          totalSales: 0,
          totalRevenue: 0,
          salesByChannel: {},
          salesByType: {},
          averageTicket: 0,
          salesCount: 0
        };
      }

      // Sumar el total de la venta
      acc[groupKey].totalRevenue += sale.total || 0;
      acc[groupKey].salesCount += 1;

      // Procesar items de la venta
      if (Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          // Incrementar contador de ventas
          acc[groupKey].totalSales += item.quantity || 0;

          // Agrupar por canal
          const channel = sale.channel || 'unknown';
          acc[groupKey].salesByChannel[channel] = (acc[groupKey].salesByChannel[channel] || 0) + (item.quantity || 0);

          // Agrupar por tipo de producto
          const type = item.type || 'unknown';
          acc[groupKey].salesByType[type] = (acc[groupKey].salesByType[type] || 0) + (item.quantity || 0);
        });
      }

      // Calcular ticket promedio
      acc[groupKey].averageTicket = acc[groupKey].totalRevenue / acc[groupKey].salesCount;

      return acc;
    }, {});

    // Convertir el objeto a un array ordenado por fecha
    const sortedReport = Object.entries(report)
      .map(([date, data]) => ({
        date,
        ...data
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calcular métricas generales
    const summary = {
      totalSales: sortedReport.reduce((sum, day) => sum + day.totalSales, 0),
      totalRevenue: sortedReport.reduce((sum, day) => sum + day.totalRevenue, 0),
      totalTransactions: sortedReport.reduce((sum, day) => sum + day.salesCount, 0),
      averageTicket: sortedReport.reduce((sum, day) => sum + day.averageTicket, 0) / sortedReport.length || 0,
      salesByChannel: sortedReport.reduce((acc, day) => {
        Object.entries(day.salesByChannel).forEach(([channel, count]) => {
          acc[channel] = (acc[channel] || 0) + count;
        });
        return acc;
      }, {}),
      salesByType: sortedReport.reduce((acc, day) => {
        Object.entries(day.salesByType).forEach(([type, count]) => {
          acc[type] = (acc[type] || 0) + count;
        });
        return acc;
      }, {})
    };

    return {
      summary,
      report: sortedReport,
      filters: {
        startDate,
        endDate,
        groupBy
      }
    };
  } catch (error) {
    console.error('Error generando reporte de ventas:', error);
    throw error;
  }
}

module.exports = { generateSalesReport };