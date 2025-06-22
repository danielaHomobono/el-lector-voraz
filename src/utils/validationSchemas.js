/**
 * Validation schemas for API requests
 * @module utils/validationSchemas
 */

// User schemas
const userSchemas = {
  login: {
    email: {
      type: 'email',
      required: true,
      message: 'Por favor ingresa un email válido'
    },
    password: {
      type: 'string',
      required: true,
      min: 6,
      message: 'La contraseña debe tener al menos 6 caracteres'
    }
  },
  
  register: {
    email: {
      type: 'email',
      required: true,
      message: 'Por favor ingresa un email válido'
    },
    password: {
      type: 'string',
      required: true,
      min: 6,
      message: 'La contraseña debe tener al menos 6 caracteres'
    },
    role: {
      type: 'string',
      enum: ['admin', 'staff', 'client'],
      default: 'client'
    }
  },
  
  update: {
    email: {
      type: 'email',
      message: 'Por favor ingresa un email válido'
    },
    password: {
      type: 'string',
      min: 6,
      message: 'La contraseña debe tener al menos 6 caracteres'
    },
    role: {
      type: 'string',
      enum: ['admin', 'staff', 'client']
    },
    isActive: {
      type: 'boolean'
    }
  }
};

// Product schemas
const productSchemas = {
  create: {
    title: {
      type: 'string',
      required: true,
      min: 2,
      max: 100
    },
    author: {
      type: 'string',
      required: true,
      min: 2,
      max: 100
    },
    isbn: {
      type: 'isbn',
      required: true
    },
    price: {
      type: 'number',
      required: true,
      min: 0
    },
    stock: {
      type: 'number',
      required: true,
      min: 0
    },
    category: {
      type: 'string',
      required: true
    },
    type: {
      type: 'string',
      enum: ['book'],
      default: 'book'
    }
  },
  
  update: {
    title: {
      type: 'string',
      min: 2,
      max: 100
    },
    author: {
      type: 'string',
      min: 2,
      max: 100
    },
    isbn: {
      type: 'isbn'
    },
    price: {
      type: 'number',
      min: 0
    },
    stock: {
      type: 'number',
      min: 0
    },
    category: {
      type: 'string'
    }
  },
  
  idParam: {
    id: {
      type: 'string',
      required: true,
      pattern: /^[0-9a-fA-F]{24}$/,
      message: 'ID de producto inválido'
    }
  }
};

// Cafe product schemas
const cafeSchemas = {
  create: {
    name: {
      type: 'string',
      required: true,
      min: 2,
      max: 100
    },
    description: {
      type: 'string',
      required: true,
      min: 10,
      max: 500
    },
    price: {
      type: 'number',
      required: true,
      min: 0
    },
    stock: {
      type: 'number',
      required: true,
      min: 0
    },
    category: {
      type: 'string',
      required: true,
      enum: ['bebida', 'comida', 'postre']
    }
  },
  
  update: {
    name: {
      type: 'string',
      min: 2,
      max: 100
    },
    description: {
      type: 'string',
      min: 10,
      max: 500
    },
    price: {
      type: 'number',
      min: 0
    },
    stock: {
      type: 'number',
      min: 0
    },
    category: {
      type: 'string',
      enum: ['bebida', 'comida', 'postre']
    }
  }
};

// Sale schemas
const saleSchemas = {
  create: {
    clientId: {
      type: 'string',
      pattern: /^[0-9a-fA-F]{24}$/,
      message: 'ID de cliente inválido'
    },
    items: {
      required: true,
      // Custom validation will be handled in controller
    },
    total: {
      type: 'number',
      required: true,
      min: 0
    },
    paymentMethod: {
      type: 'string',
      required: true,
      enum: ['efectivo', 'tarjeta', 'transferencia']
    }
  }
};

// Client schemas
const clientSchemas = {
  create: {
    name: {
      type: 'string',
      required: true,
      min: 2,
      max: 100
    },
    email: {
      type: 'email',
      required: true
    },
    phone: {
      type: 'string',
      pattern: /^[0-9]{10}$/,
      message: 'El teléfono debe tener 10 dígitos'
    },
    address: {
      type: 'string',
      max: 200
    }
  },
  
  update: {
    name: {
      type: 'string',
      min: 2,
      max: 100
    },
    email: {
      type: 'email'
    },
    phone: {
      type: 'string',
      pattern: /^[0-9]{10}$/,
      message: 'El teléfono debe tener 10 dígitos'
    },
    address: {
      type: 'string',
      max: 200
    },
    points: {
      type: 'number',
      min: 0
    }
  }
};

module.exports = {
  userSchemas,
  productSchemas,
  cafeSchemas,
  saleSchemas,
  clientSchemas
};