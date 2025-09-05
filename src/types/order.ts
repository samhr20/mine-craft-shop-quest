// Order-related TypeScript types and interfaces

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
}

export interface BillingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export type OrderStatus = 'pending' | 'pending_payment_verification' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'returned' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentMethod = 'upi' | 'cod';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  price: number;
  product_image?: string;
  quantity: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  total_amount: number;
  shipping_address: string | ShippingAddress;
  shipping_pincode?: string;
  customer_name?: string;
  customer_phone?: string;
  customer_email?: string;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  status_history?: OrderStatusHistory[];
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes?: string;
  created_at: string;
  created_by?: string;
}

export interface CreateOrderData {
  shipping_address: string | ShippingAddress;
  billing_address?: string | BillingAddress;
  shipping_pincode: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  payment_method: PaymentMethod;
  notes?: string;
}

export interface OrderSummary {
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  created_at: string;
  item_count: number;
}

// Order context types
export interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  createOrder: (orderData: CreateOrderData) => Promise<Order>;
  getOrder: (orderId: string) => Promise<Order | null>;
  getUserOrders: () => Promise<Order[]>;
  updateOrderStatus: (orderId: string, status: OrderStatus, notes?: string) => Promise<void>;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
}

// Admin order management types
export interface AdminOrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface OrderFilters {
  status?: OrderStatus;
  payment_status?: PaymentStatus;
  date_from?: string;
  date_to?: string;
  search?: string;
}
