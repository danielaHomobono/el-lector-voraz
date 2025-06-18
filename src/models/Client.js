const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
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
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
  },
  points: {
    type: Number,
    default: 0,
    min: [0, 'Los puntos no pueden ser negativos']
  },
  phone: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índices
clientSchema.index({ id: 1 }, { unique: true });
clientSchema.index({ email: 1 }, { unique: true });
clientSchema.index({ name: 'text' });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;