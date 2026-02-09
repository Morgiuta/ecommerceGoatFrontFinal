
import { Client, Product, Category, Order, Address, Bill, Review, HealthStatus, Status } from '../types';

export const MOCK_CLIENTS: Client[] = [
  { id: 1, first_name: 'Juan', last_name: 'Pérez', email: 'juan@example.com', phone: '555-0101', created_at: '2023-10-01', is_admin: false },
  { id: 2, first_name: 'María', last_name: 'García', email: 'maria@example.com', phone: '555-0102', created_at: '2023-10-02', is_admin: false },
  { id: 3, first_name: 'Carlos', last_name: 'Rodríguez', email: 'carlos@example.com', phone: '555-0103', created_at: '2023-10-03', is_admin: true },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Electrónica', description: 'Gadgets y dispositivos' },
  { id: 2, name: 'Ropa', description: 'Vestimenta para todos' },
  { id: 3, name: 'Hogar', description: 'Artículos para la casa' },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Smartphone X', description: 'Último modelo', price: 999.99, stock: 15, category_id: 1, category: MOCK_CATEGORIES[0], active: true },
  { id: 2, name: 'Camiseta Algodón', description: '100% natural', price: 19.99, stock: 5, category_id: 2, category: MOCK_CATEGORIES[1], active: true },
  { id: 3, name: 'Cafetera Pro', description: 'Café perfecto', price: 149.50, stock: 25, category_id: 3, category: MOCK_CATEGORIES[2], active: true },
];

export const MOCK_ORDERS: Order[] = [
  { 
    id: 101, client_id: 1, total: 1019.98, status: Status.DELIVERED, order_date: '2023-10-15', date: '2023-10-15',
    client: MOCK_CLIENTS[0],
    bill_id: 1,
    delivery_method: 3,
    details: [
      { id: 1, order_id: 101, product_id: 1, quantity: 1, price: 999.99, unit_price: 999.99, product: MOCK_PRODUCTS[0] },
      { id: 2, order_id: 101, product_id: 2, quantity: 1, price: 19.99, unit_price: 19.99, product: MOCK_PRODUCTS[1] }
    ]
  },
  { id: 102, client_id: 2, total: 149.50, status: Status.PENDING, order_date: '2023-10-16', date: '2023-10-16', client: MOCK_CLIENTS[1], bill_id: 2, delivery_method: 3 }
];

export const MOCK_ADDRESSES: Address[] = [
  { id: 1, client_id: 1, street: 'Calle Falsa 123', city: 'Madrid', state: 'Madrid', zip_code: '28001', is_default: true, client: MOCK_CLIENTS[0] },
];

export const MOCK_BILLS: Bill[] = [
  { id: 1, order_id: 101, bill_date: '2023-10-15', amount: 1019.98, tax: 214.19, order: MOCK_ORDERS[0], bill_number: 'V-101', date: '2023-10-15', total: 1019.98, payment_type: 2, client_id: 1, discount: 0 },
];

export const MOCK_REVIEWS: Review[] = [
  { id: 1, product_id: 1, user_name: 'TechLover', rating: 5, comment: 'Excelente producto!', status: 'approved', created_at: '2023-10-16', product: MOCK_PRODUCTS[0] },
  { id: 2, product_id: 2, user_name: 'Fashionista', rating: 2, comment: 'Se encoge al lavar.', status: 'pending', created_at: '2023-10-17', product: MOCK_PRODUCTS[1] },
];

export const MOCK_HEALTH: HealthStatus = {
  status: 'ok',
  timestamp: new Date().toISOString(),
  checks: {},
  database: 'connected',
  uptime: 3600
};
