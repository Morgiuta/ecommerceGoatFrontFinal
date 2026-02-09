
export enum DeliveryMethod {
  DRIVE_THRU = 1,
  ON_HAND = 2,
  HOME_DELIVERY = 3
}

export enum Status {
  PENDING = 1,
  IN_PROGRESS = 2,
  DELIVERED = 3,
  CANCELED = 4
}

export enum PaymentType {
  CASH = 1,
  CARD = 2,
  DEBIT = 3,
  CREDIT = 4,
  BANK_TRANSFER = 5
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image_url?: string;
  category_id: number;
  category?: Category;
  active: boolean;
  description: string;
}

export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  is_admin: boolean;
  created_at?: string;
}

export interface Address {
  id: number;
  client_id: number;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  client?: Client;
}

export interface Bill {
  id: number;
  bill_number: string;
  discount: number;
  date: string;
  total: number;
  payment_type: PaymentType;
  client_id: number;
  order_id?: number;
  order?: Order;
  bill_date: string;
  amount: number;
  tax: number;
}

export interface Order {
  id: number;
  date: string;
  order_date: string;
  total: number;
  delivery_method: DeliveryMethod;
  status: Status;
  client_id: number;
  bill_id: number;
  client?: Client;
  bill?: Bill;
  details?: OrderDetail[];
}

export interface OrderDetail {
  id?: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  unit_price: number;
  product?: Product;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  product_id: number;
  user_name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  product?: Product;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  checks: any;
  database?: string;
  uptime?: number;
}
