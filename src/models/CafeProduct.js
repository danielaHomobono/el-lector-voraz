const mongoose = require('mongoose');

const cafeProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es obligatorio'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'La categoría es obligatoria'],
    enum: ['Bebida', 'Comida', 'Postre']
  },
  description: {
    type: String,
    trim: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices para búsquedas más eficientes
cafeProductSchema.index({ name: 'text' });
cafeProductSchema.index({ category: 1 });

const CafeProduct = mongoose.model('CafeProduct', cafeProductSchema);

module.exports = CafeProduct;