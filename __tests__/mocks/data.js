/**
 * Mock data for tests
 */

const mockUsers = [
  {
    _id: '60d21b4667d0d8992e610c85',
    id: 'user1',
    email: 'admin@lectorvoraz.com',
    password: '$2a$10$X/8.yjaxS.q0n/HEJVjBZeAJH0jB3Tp6vPnOWrJj2s/8oo.xz3rJi', // admin123
    role: 'admin',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    _id: '60d21b4667d0d8992e610c86',
    id: 'user2',
    email: 'staff@lectorvoraz.com',
    password: '$2a$10$X/8.yjaxS.q0n/HEJVjBZeAJH0jB3Tp6vPnOWrJj2s/8oo.xz3rJi', // staff123
    role: 'staff',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    _id: '60d21b4667d0d8992e610c87',
    id: 'user3',
    email: 'client@lectorvoraz.com',
    password: '$2a$10$X/8.yjaxS.q0n/HEJVjBZeAJH0jB3Tp6vPnOWrJj2s/8oo.xz3rJi', // client123
    role: 'client',
    isActive: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

const mockProducts = [
  {
    _id: '60d21b4667d0d8992e610c88',
    id: 'book1',
    title: 'El Quijote',
    author: 'Miguel de Cervantes',
    isbn: '9788420412146',
    price: 25.99,
    stock: 10,
    category: 'Clásicos',
    type: 'book',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    _id: '60d21b4667d0d8992e610c89',
    id: 'book2',
    title: 'Cien años de soledad',
    author: 'Gabriel García Márquez',
    isbn: '9788497592208',
    price: 19.99,
    stock: 5,
    category: 'Novela',
    type: 'book',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

const mockCafeProducts = [
  {
    _id: '60d21b4667d0d8992e610c8a',
    id: 'cafe1',
    name: 'Café Americano',
    description: 'Café negro tradicional',
    price: 2.50,
    stock: 100,
    category: 'bebida',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    _id: '60d21b4667d0d8992e610c8b',
    id: 'cafe2',
    name: 'Croissant',
    description: 'Croissant de mantequilla',
    price: 3.50,
    stock: 20,
    category: 'comida',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

const mockClients = [
  {
    _id: '60d21b4667d0d8992e610c8c',
    id: 'client1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '1234567890',
    points: 100,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    _id: '60d21b4667d0d8992e610c8d',
    id: 'client2',
    name: 'María López',
    email: 'maria@example.com',
    phone: '0987654321',
    points: 50,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  }
];

const mockSales = [
  {
    _id: '60d21b4667d0d8992e610c8e',
    id: 'sale1',
    clientId: '60d21b4667d0d8992e610c8c',
    userId: '60d21b4667d0d8992e610c85',
    items: [
      {
        productId: '60d21b4667d0d8992e610c88',
        quantity: 1,
        price: 25.99
      }
    ],
    total: 25.99,
    date: new Date('2023-01-15'),
    paymentMethod: 'efectivo',
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  }
];

module.exports = {
  mockUsers,
  mockProducts,
  mockCafeProducts,
  mockClients,
  mockSales
};