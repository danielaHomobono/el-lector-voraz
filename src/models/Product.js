const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'El tipo es obligatorio'],
    enum: ['book', 'magazine']
  },
  title: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'El autor es obligatorio'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'El ISBN es obligatorio'],
    unique: true,
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
    enum: ['Novela', 'Ficción', 'Clasicos', 'Drama', 'Relatos']
  },
  consignment: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Índices para búsquedas más eficientes
productSchema.index({ title: 'text', author: 'text' });
productSchema.index({ type: 1, category: 1 });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;