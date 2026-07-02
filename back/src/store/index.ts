import {
  Category,
  DeliveryConfig,
  District,
  Order,
  Product,
  ProductInput,
} from "../types";
import { config } from "../config";
import { MemoryStore } from "./memoryStore";
import { SupabaseStore } from "./supabaseStore";

export interface ProductFilter {
  categorySlug?: string;
  search?: string;
  onSale?: boolean;
  includeInactive?: boolean;
}

export interface Store {
  listCategories(): Promise<Category[]>;
  listProducts(filter: ProductFilter): Promise<Product[]>;
  getProduct(id: string): Promise<Product | null>;
  createProduct(input: ProductInput): Promise<Product>;
  updateProduct(id: string, input: Partial<ProductInput>): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
  listDistricts(): Promise<District[]>;
  getDeliveryConfig(): Promise<DeliveryConfig>;
  updateDeliveryConfig(cfg: DeliveryConfig): Promise<DeliveryConfig>;
  createOrder(order: Order): Promise<Order>;
  getOrder(id: string): Promise<Order | null>;
  updateOrderStatus(id: string, status: Order["status"]): Promise<Order | null>;
  listOrders(): Promise<Order[]>;
  /** Descuenta stock de las variantes vendidas (al confirmar el pago). */
  decrementStock(items: { productId: string; size: string; quantity: number }[]): Promise<void>;
}

let store: Store | null = null;

export function getStore(): Store {
  if (!store) {
    if (config.supabaseEnabled) {
      console.log("[store] usando Supabase");
      store = new SupabaseStore();
    } else {
      console.log(
        "[store] SUPABASE_URL no configurado: usando datos demo en memoria"
      );
      store = new MemoryStore();
    }
  }
  return store;
}
