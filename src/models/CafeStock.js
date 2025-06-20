const mongoose = require('mongoose');

const cafeStockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['food', 'beverage', 'ingredient', 'supply'],
    default: 'ingredient'
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String,
    required: true,
    default: 'unidades'
  },
  minStock: {
    type: Number,
    default: 5
  },
  supplier: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
cafeStockSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const CafeStock = mongoose.model('CafeStock', cafeStockSchema);

module.exports = CafeStock;