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
  price: number; // en soles (PEN)
  salePrice: number | null; // precio de oferta, null si no está en oferta
  photos: string[]; // rutas servidas por el API (/uploads/...)
  variants: ProductVariant[]; // tallas y stock
  active: boolean;
  createdAt: string;
}

export type ProductInput = Omit<Product, "id" | "createdAt">;

export interface District {
  id: string;
  name: string;
  lat: number;
  lng: number;
  surcharge: number; // recargo fijo opcional por distrito
}

export interface DeliveryConfig {
  originLat: number; // ubicación de la tienda/almacén
  originLng: number;
  baseFee: number; // tarifa base en soles
  perKmFee: number; // soles por km
  minFee: number; // tarifa mínima
  freeThreshold: number; // envío gratis a partir de este subtotal (0 = nunca)
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

export interface DeliveryQuote {
  districtId: string;
  districtName: string;
  distanceKm: number;
  fee: number;
  freeDelivery: boolean;
}
