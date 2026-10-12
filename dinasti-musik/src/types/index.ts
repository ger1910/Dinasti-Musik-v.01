/**
 * Dinasti Musik - Core TypeScript Type Definitions
 */

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'Gitar' | 'Keyboard & Piano' | 'Drum & Perkusi' | 'Audio & Studio' | string;
  price: number;
  stock: number;
  image: string;
  rating?: number;
  status: 'In Stock' | 'Out of Stock';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'customer';
  phone?: string;
  createdAt?: string;
}

export interface Session {
  id: string;
  userId: string;
  role: 'owner' | 'customer';
  createdAt: string;
  expiresAt: string;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress?: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost?: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'Unpaid' | 'Paid' | 'Failed' | 'Refunded';
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled';
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StoreConfig {
  name: string;
  ownerName: string;
  ownerRole: string;
  whatsapp: string;
  email: string;
  address: string;
  city?: string;
  ownerPhoto: string;
  bio: string;
  established: number;
  openingHours?: string;
}

export interface OwnerStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  totalCustomers: number;
  recentOrders: Order[];
  pendingOrders: number;
  completedOrders: number;
}

export interface Notification {
  id: string;
  type: 'order' | 'payment' | 'stock' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  entityId?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdBy: string;
  createdAt: string;
}

export interface DatabaseSchema {
  storeConfig: StoreConfig;
  users: (User & { password?: string })[];
  sessions: Session[];
  products: Product[];
  orders: Order[];
  carts?: Record<string, OrderItem[]>;
  notifications: Notification[];
  auditLogs: AuditLog[];
  expenses: Expense[];
  wishlists?: Record<string, string[]>;
}

// Audit action constants
export const AUDIT_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  REGISTER: 'REGISTER',
  LOGOUT: 'LOGOUT',
  PRODUCT_CREATED: 'PRODUCT_CREATED',
  PRODUCT_UPDATED: 'PRODUCT_UPDATED',
  PRODUCT_DELETED: 'PRODUCT_DELETED',
  STOCK_UPDATED: 'STOCK_UPDATED',
  ORDER_CREATED: 'ORDER_CREATED',
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  EXPENSE_CREATED: 'EXPENSE_CREATED',
  EXPENSE_UPDATED: 'EXPENSE_UPDATED',
  USER_ROLE_CHANGED: 'USER_ROLE_CHANGED',
} as const;

