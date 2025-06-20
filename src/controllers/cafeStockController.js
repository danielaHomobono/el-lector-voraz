const CafeStock = require('../models/CafeStock');

// Get all cafe stock items
exports.getAllCafeStock = async (req, res) => {
  try {
    const stock = await CafeStock.find().sort({ name: 1 });
    res.status(200).json(stock);
  } catch (error) {
    console.error('Error getting cafe stock:', error);
    res.status(500).json({ error: 'Error al obtener el stock de cafetería' });
  }
};

// Get a single cafe stock item by ID
exports.getCafeStockById = async (req, res) => {
  try {
    const stock = await CafeStock.findById(req.params.id);
    if (!stock) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.status(200).json(stock);
  } catch (error) {
    console.error('Error getting cafe stock item:', error);
    res.status(500).json({ error: 'Error al obtener el item de stock' });
  }
};

// Create a new cafe stock item
exports.createCafeStock = async (req, res) => {
  try {
    const stock = new CafeStock(req.body);
    await stock.save();
    res.status(201).json(stock);
  } catch (error) {
    console.error('Error creating cafe stock item:', error);
    res.status(400).json({ error: 'Error al crear el item de stock' });
  }
};

// Update a cafe stock item
exports.updateCafeStock = async (req, res) => {
  try {
    const stock = await CafeStock.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!stock) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.status(200).json(stock);
  } catch (error) {
    console.error('Error updating cafe stock item:', error);
    res.status(400).json({ error: 'Error al actualizar el item de stock' });
  }
};

// Delete a cafe stock item
exports.deleteCafeStock = async (req, res) => {
  try {
    const stock = await CafeStock.findByIdAndDelete(req.params.id);
    if (!stock) {
      return res.status(404).json({ error: 'Item no encontrado' });
    }
    res.status(200).json({ message: 'Item eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting cafe stock item:', error);
    res.status(500).json({ error: 'Error al eliminar el item de stock' });
  }
};