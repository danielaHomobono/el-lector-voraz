// Test script for CafeStock model
require('dotenv').config();
const mongoose = require('mongoose');
const CafeStock = require('../models/CafeStock');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Test function to create a sample stock item
async function createSampleStockItem() {
  try {
    // Create a sample stock item
    const stockItem = new CafeStock({
      name: 'Café en grano',
      type: 'ingredient',
      quantity: 5,
      unit: 'kg',
      minStock: 2,
      supplier: 'Proveedor de Café',
      notes: 'Café para espresso'
    });

    // Save to database
    await stockItem.save();
    console.log('Sample stock item created:', stockItem);

    // Find all stock items
    const allItems = await CafeStock.find();
    console.log('All stock items:', allItems);

    return stockItem;
  } catch (error) {
    console.error('Error creating sample stock item:', error);
  }
}

// Run the test
createSampleStockItem()
  .then(() => {
    console.log('Test completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });