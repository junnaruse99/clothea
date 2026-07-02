export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface ProductVariant {
  size: string;
  quantity: number;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  description: string;
  categoryId: string;
  color: string;
  price: number;
  salePrice: number | null;
  photos: string[];
  variants: ProductVariant[];
  active: boolean;
  createdAt: string;
}

export interface District {
  id: string;
  name: string;
  lat: number;
  lng: number;
  surcharge: number;
}

export interface DeliveryConfig {
  originLat: number;
  originLng: number;
  baseFee: number;
  perKmFee: number;
  minFee: number;
  freeThreshold: number;
}

export interface DeliveryQuote {
  districtId: string;
  districtName: string;
  distanceKm: number;
  fee: number;
  freeDelivery: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: "pending_payment" | "paid" | "cancelled";
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    districtId: string;
  };
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  districtId: string | null;
  birthday: string | null;
  acceptsMarketing: boolean;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
  lastOrderAt: string | null;
}

export interface PaymentSession {
  provider: string;
  paymentId: string;
  amount: number;
  currency: string;
}

export interface CartItem {
  productId: string;
  name: string;
  photo: string;
  size: string;
  quantity: number;
  unitPrice: number;
  maxQuantity: number;
}
