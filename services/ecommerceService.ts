
import api from './api';
import { 
  Client, Product, Category, Order, 
  Address, Bill, Review, HealthStatus, OrderDetail
} from '../types';

export const ecommerceService = {
  // Auth
  login: (credentials: any) => api.post('clients/login', credentials),

  // Clients
  getClients: () => api.get<Client[]>('clients/'),
  createClient: (data: any) => api.post('clients/', data),
  updateClient: (id: number, data: any) => api.put(`clients/id/${id}`, data),
  deleteClient: (id: number) => api.delete(`clients/id/${id}`),

  // Products
  async getProducts() {
    const res = await api.get('/products');
  
    return {
      ...res,
      data: res.data.map((p: any) => ({
        id: p.id_key,
        name: p.name,
        description: p.description ?? '',
        price: p.price,
        stock: p.stock,
        category_id: p.category_id,
        category: p.category,
        active: p.active
      }))
    };
  },
  
  createProduct: (data: any) => api.post('products/', data),
  updateProduct: (id: number, data: any) => api.put(`products/id/${id}`, data),
  deleteProduct: (id: number) => api.delete(`products/id/${id}`),

  // Categories
  async getCategories() {
    const res = await api.get('/categories');
  
    return {
      ...res,
      data: res.data.map((c: any) => ({
        id: c.id_key,
        name: c.name
      }))
    };
  },
  createCategory: (data: any) => api.post('categories/', data),
  updateCategory: (id: number, data: any) => api.put(`categories/id/${id}`, data),
  deleteCategory: (id: number) => api.delete(`categories/id/${id}`),

  // Orders & Details
  getOrders: () => api.get<Order[]>('orders/'),
  getOrdersByClient: (clientId: number) => api.get<Order[]>(`orders/client/${clientId}`),
  createOrder: (data: any) => api.post('orders/', data),
  updateOrderStatus: (id: number, status: number) => api.patch(`orders/id/${id}/status`, { status }),
  createOrderDetail: (data: any) => api.post('order_details/', data),

  // Bills
  getBills: () => api.get<Bill[]>('bills/'),
  createBill: (data: any) => api.post('bills/', data),

  // Addresses
  getAddresses: () => api.get<Address[]>('addresses/'),
  getAddressesByClient: (clientId: number) => api.get<Address[]>(`addresses?client_id=${clientId}`),
  createAddress: (data: any) => api.post('addresses/', data),
  deleteAddress: (id: number) => api.delete(`addresses/id/${id}`),

  // Reviews
  getReviews: () => api.get<Review[]>('reviews/'),
  updateReviewStatus: (id: number, status: string) => api.patch(`reviews/id/${id}/status`, { status }),

  // Cart (Backend-side)
  getCart: (clientId: number) => api.get(`cart/${clientId}`),
  addToCart: (clientId: number, item: any) => api.post(`cart/${clientId}/items`, item),

  // Health check - Consistente con 127.0.0.1
  // getHealth: () => api.get<HealthStatus>('http://127.0.0.1:8000/health_check/'),
  getHealth: () => api.get<HealthStatus>('/health_check/'),


};
