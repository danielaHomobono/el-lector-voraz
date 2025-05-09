const FileService = require('./fileService'); 
const Sale = require('../models/Sale');
const ProductService = require('./productService');
const ClientService = require('./clientService');

class SaleService {
  static async getAllSales() {
    return await FileService.readFile('sales.json');
  }

  static async createSale(data) {
    const sales = await this.getAllSales();

    // Validar producto
    const product = await ProductService.getProductById(data.productId);
    if (!product) throw new Error('Producto no encontrado');
    if (product.stock < data.quantity) throw new Error('Stock insuficiente');

    // Validar cliente (NUEVO)
    const client = await ClientService.getClientById(data.clientId);
    if (!client) throw new Error('Cliente no encontrado');

    // Validar cantidad positiva
    if (data.quantity <= 0) throw new Error('Cantidad inválida');

    // Calcular total
    const total = product.price * data.quantity;

    // Crear venta
    const newSale = new Sale(data.productId, data.clientId, data.quantity, total);
    sales.push(newSale);

    // Actualizar stock
    product.stock -= data.quantity;
    await ProductService.updateProduct(product.id, product);

    // Agregar puntos
    client.points += Math.floor(total / 1000);
    await ClientService.updateClient(client.id, client);

    // Guardar ventas
    await FileService.writeFile('sales.json', sales);

    return newSale;
  }
}

module.exports = SaleService;
