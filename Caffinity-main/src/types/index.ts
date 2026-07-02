export type Category = "Hot Drinks" | "Cold Drinks" | "Fresh Juices" | "Smoothies" | "Milkshakes" | "Specialty Drinks" | "Energy Drinks";

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  ratingsAverage: number;
  ratingsQuantity: number;
  category: Category | string;
  image: string;
  isAvailable: boolean;
  slug: string;
  __v: number;
}

export type CartItem = Product & {
  quantity: number;
};

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface Review {
  _id: string;
  review: string;
  rating: number; // minimum: 1, maximum: 5
  product: string;
  user: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export interface OrderItem {
  product: Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: string;
  items: OrderItem[];
  totalPrice: number;
  currency: 'usd';
  stripeSessionId: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | string;
  orderStatus: 'processing' | 'shipped' | 'delivered' | 'cancelled' | string;
  createdAt: string;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface MockUser {
  id: string;
  email: string;
}

export interface ItokenData {
  id: string;
  iat: number;
  exp: number;
}