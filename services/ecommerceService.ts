
//import api, {apiRoot} from './api';
import api from './api';
//import { apiRoot } from './api';

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
        id: p.id_key,                // lo transformamos para el frontend
        id_key: p.id_key,            // lo dejamos también si querés compatibilidad
        name: p.name,
        description: p.description ?? '',
        price: p.price,
        stock: p.stock,
        image_url: p.image_url ?? '',
        category_id: p.category_id,
        active: p.active,
        category: p.category ?? null,
        reviews: p.reviews ?? []
      }))
    };
  },
  
  createProduct: (data: any) => api.post('products/', data),
  updateProduct: (id: number, data: any) => api.put(`products/id/${id}`, data),
  deleteProduct: (id: number) => api.delete(`products/id/${id}`),
  async getFilteredProducts(filters: {
    search?: string;
    category_id?: number;
    min_price?: number;
    max_price?: number;
    in_stock_only?: boolean;
    active?: boolean;
    sort_by?: string;
    skip?: number;
    limit?: number;
  }) {
  
    const params = new URLSearchParams();
  
    if (filters.search) params.append("search", filters.search);
    if (filters.category_id) params.append("category_id", filters.category_id.toString());
    if (filters.min_price !== undefined) params.append("min_price", filters.min_price.toString());
    if (filters.max_price !== undefined) params.append("max_price", filters.max_price.toString());
    if (filters.in_stock_only !== undefined) params.append("in_stock_only", filters.in_stock_only.toString());
    if (filters.active !== undefined) params.append("active", filters.active.toString());
    if (filters.sort_by) params.append("sort_by", filters.sort_by);
    if (filters.skip !== undefined) params.append("skip", filters.skip.toString());
    if (filters.limit !== undefined) params.append("limit", filters.limit.toString());
  
    const res = await api.get(`/products/filter?${params.toString()}`);
  
    return {
      ...res,
      data: res.data.map((p: any) => ({
        id: p.id_key,
        name: p.name,
        description: p.description ?? '',
        price: p.price,
        stock: p.stock,
        image_url: p.image_url,
        category_id: p.category_id,
        category: p.category,
        active: p.active
      }))
    };
  },

  async getProductById(id: number) {
    const res = await api.get(`/products/id/${id}`);
  
    return {
      ...res,
      data: {
        id: res.data.id_key,
        name: res.data.name,
        description: res.data.description ?? '',
        price: res.data.price,
        stock: res.data.stock,
        image_url: res.data.image_url,
        category_id: res.data.category_id,
        active: res.data.active,
        category: res.data.category,
        reviews: res.data.reviews ?? []
      }
    };
  },
  
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
  async getOrderDetails() {
    return await api.get('/order_details');
  },
  async getOrderById(id: number) {
    return await api.get(`/orders/id/${id}`);
  },

  async cancelOrder(orderId: number) {
    return api.patch(`/orders/id/${orderId}/status`, {
      status: 4
    });
  },

  // Bills
  getBills: () => api.get<Bill[]>('bills/'),
  createBill: (data: any) => api.post('bills/', data),
  async getBillById(id: number) {
    return await api.get(`/bills/id/${id}`);
  },

  // Addresses
  getAddresses: () => api.get<Address[]>('addresses/'),
  getAddressesByClient: (clientId: number) => api.get<Address[]>(`addresses?client_id=${clientId}`),
  createAddress: (data: any) => api.post('addresses/', data),
  deleteAddress: (id: number) => api.delete(`addresses/id/${id}`),

  // Reviews
  getReviews: () => api.get<Review[]>('reviews/'),
  updateReviewStatus: (id: number, status: string) => api.patch(`reviews/id/${id}/status`, { status }),
  async createReview(data: {
    rating: number;
    comment: string;
    product_id: number;
  }) {
    return await api.post('/reviews', {
      rating: data.rating,
      comment: data.comment,
      product_id: data.product_id
    });
  },
  /// =========================
  // CART (Backend)
  // =========================

  getCart: (clientId: number) =>
    api.get(`/cart/${clientId}`),

  clearCart: (clientId: number) =>
    api.delete(`/cart/${clientId}`),

  addToCart: (clientId: number, productId: number, quantity: number) =>
    api.post(`/cart/${clientId}/items`, {
      product_id: productId,
      quantity
    }),

  updateCartItem: (clientId: number, productId: number, quantity: number) =>
    api.put(`/cart/${clientId}/items`, {
      product_id: productId,
      quantity
    }),

  removeCartItem: (clientId: number, productId: number) =>
    api.delete(`/cart/${clientId}/items/${productId}`),

  // Health check - Consistente con 127.0.0.1
  getHealth: () => api.get<HealthStatus>('http://127.0.0.1:8000/health_check/'),
  //getHealth: () => apiRoot.get<HealthStatus>('health_check/'),
};
