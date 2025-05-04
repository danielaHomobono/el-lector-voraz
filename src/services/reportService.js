const SaleService = require('./saleService');

class ReportService {
  static async getSalesReport(startDate, endDate) {
    const sales = await SaleService.getAllSales();
    const filteredSales = sales.filter((sale) => {
      const saleDate = new Date(sale.date);
      return (!startDate || saleDate >= new Date(startDate)) &&
             (!endDate || saleDate <= new Date(endDate));
    });
    const total = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
    return {
      sales: filteredSales,
      total,
      count: filteredSales.length
    };
  }
}

module.exports = ReportService;