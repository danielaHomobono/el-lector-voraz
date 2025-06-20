// Seed script for CafeStock model
require('dotenv').config();
const mongoose = require('mongoose');
const CafeStock = require('../models/CafeStock');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Sample stock items
const stockItems = [
  {
    name: 'Café en grano',
    type: 'ingredient',
    quantity: 5,
    unit: 'kg',
    minStock: 2,
    supplier: 'Proveedor de Café',
    notes: 'Café para espresso'
  },
  {
    name: 'Leche',
    type: 'ingredient',
    quantity: 10,
    unit: 'litros',
    minStock: 3,
    supplier: 'Lácteos del Valle',
    notes: 'Leche entera'
  },
  {
    name: 'Azúcar',
    type: 'ingredient',
    quantity: 2,
    unit: 'kg',
    minStock: 3,
    supplier: 'Distribuidora Dulce',
    notes: 'Azúcar blanca'
  },
  {
    name: 'Croissant',
    type: 'food',
    quantity: 15,
    unit: 'unidades',
    minStock: 5,
    supplier: 'Panadería La Esquina',
    notes: 'Croissants frescos'
  },
  {
    name: 'Vasos desechables',
    type: 'supply',
    quantity: 200,
    unit: 'unidades',
    minStock: 50,
    supplier: 'Suministros Café',
    notes: 'Vasos de 8oz'
  },
  {
    name: 'Té verde',
    type: 'ingredient',
    quantity: 30,
    unit: 'bolsitas',
    minStock: 10,
    supplier: 'Importadora de Tés',
    notes: 'Té verde orgánico'
  },
  {
    name: 'Chocolate caliente',
    type: 'beverage',
    quantity: 8,
    unit: 'kg',
    minStock: 2,
    supplier: 'Chocolates Finos',
    notes: 'Chocolate en polvo para bebidas'
  },
  {
    name: 'Galletas',
    type: 'food',
    quantity: 40,
    unit: 'unidades',
    minStock: 15,
    supplier: 'Panadería La Esquina',
    notes: 'Galletas de chocolate'
  }
];

// Seed function
async function seedCafeStock() {
  try {
    // Clear existing data
    await CafeStock.deleteMany({});
    console.log('Cleared existing cafe stock items');

    // Insert new data
    const result = await CafeStock.insertMany(stockItems);
    console.log(`Added ${result.length} cafe stock items`);

    return result;
  } catch (error) {
    console.error('Error seeding cafe stock:', error);
  }
}

// Run the seed
seedCafeStock()
  .then(() => {
    console.log('Seed completed successfully');
    process.exit(0);
  })
  .catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
  });