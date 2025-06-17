const mongoose = require('mongoose');

const saleItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'El ID del producto es obligatorio'],
    refPath: 'type'
  },
  type: {
    type: String,
    required: [true, 'El tipo es obligatorio'],
    enum: ['book', 'cafe']
  },
  quantity: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [1, 'La cantidad debe ser al menos 1']
  },
  price: {
    type: Number,
    required: [true, 'El precio unitario es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  }
  
});

const saleSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: [true, 'El total es obligatorio'],
    min: [0, 'El total no puede ser negativo']
  },
  channel: {
    type: String,
    required: [true, 'El canal es obligatorio'],
    enum: ['online', 'store']
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    default: null
  },
  items: [saleItemSchema],
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  }
}, {
  timestamps: true
});

// Índices
saleSchema.index({ clientId: 1 });
saleSchema.index({ createdAt: -1 });
saleSchema.index({ channel: 1 });

const Sale = mongoose.model('Sale', saleSchema);

module.exports = Sale;