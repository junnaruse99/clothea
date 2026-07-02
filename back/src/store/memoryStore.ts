import { randomUUID } from "crypto";
import {
  Category,
  Customer,
  CustomerUpsert,
  DeliveryConfig,
  District,
  Order,
  Product,
  ProductInput,
} from "../types";
import { ProductFilter, Store } from "./index";
import {
  seedCategories,
  seedDeliveryConfig,
  seedDistricts,
  seedProducts,
} from "./seed";

/**
 * Almacenamiento en memoria para desarrollo/demostración.
 * Se usa automáticamente cuando no hay credenciales de Supabase.
 */
export class MemoryStore implements Store {
  private categories: Category[] = [...seedCategories];
  private products: Product[] = seedProducts.map((p) => ({ ...p }));
  private districts: District[] = [...seedDistricts];
  private deliveryConfig: DeliveryConfig = { ...seedDeliveryConfig };
  private orders: Order[] = [];
  private customers: Customer[] = [];

  async listCategories(): Promise<Category[]> {
    return this.categories;
  }

  async listProducts(filter: ProductFilter): Promise<Product[]> {
    let result = this.products;
    if (!filter.includeInactive) {
      result = result.filter((p) => p.active);
    }
    if (filter.categorySlug) {
      const cat = this.categories.find((c) => c.slug === filter.categorySlug);
      result = result.filter((p) => p.categoryId === cat?.id);
    }
    if (filter.onSale) {
      result = result.filter((p) => p.salePrice !== null);
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
      );
    }
    return result;
  }

  async getProduct(id: string): Promise<Product | null> {
    return this.products.find((p) => p.id === id) ?? null;
  }

  async createProduct(input: ProductInput): Promise<Product> {
    const product: Product = {
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.products.push(product);
    return product;
  }

  async updateProduct(
    id: string,
    input: Partial<ProductInput>
  ): Promise<Product | null> {
    const product = this.products.find((p) => p.id === id);
    if (!product) return null;
    Object.assign(product, input);
    return product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const before = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    return this.products.length < before;
  }

  async listDistricts(): Promise<District[]> {
    return this.districts;
  }

  async getDeliveryConfig(): Promise<DeliveryConfig> {
    return this.deliveryConfig;
  }

  async updateDeliveryConfig(cfg: DeliveryConfig): Promise<DeliveryConfig> {
    this.deliveryConfig = { ...cfg };
    return this.deliveryConfig;
  }

  async createOrder(order: Order): Promise<Order> {
    this.orders.push(order);
    return order;
  }

  async getOrder(id: string): Promise<Order | null> {
    return this.orders.find((o) => o.id === id) ?? null;
  }

  async updateOrderStatus(
    id: string,
    status: Order["status"]
  ): Promise<Order | null> {
    const order = this.orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    return order;
  }

  async listOrders(): Promise<Order[]> {
    return [...this.orders].reverse();
  }

  async upsertCustomer(input: CustomerUpsert): Promise<Customer> {
    const email = input.email.trim().toLowerCase();
    const now = new Date().toISOString();
    let customer = this.customers.find((c) => c.email === email);
    if (!customer) {
      customer = {
        id: randomUUID(),
        name: input.name ?? "",
        email,
        phone: input.phone ?? "",
        districtId: input.districtId ?? null,
        birthday: input.birthday ?? null,
        acceptsMarketing: input.acceptsMarketing ?? false,
        ordersCount: 0,
        totalSpent: 0,
        createdAt: now,
        lastOrderAt: null,
      };
      this.customers.push(customer);
    } else {
      if (input.name) customer.name = input.name;
      if (input.phone) customer.phone = input.phone;
      if (input.districtId) customer.districtId = input.districtId;
      if (input.birthday) customer.birthday = input.birthday;
      // el consentimiento solo se activa, nunca se apaga silenciosamente
      if (input.acceptsMarketing) customer.acceptsMarketing = true;
    }
    if (input.orderTotal !== undefined) {
      customer.ordersCount += 1;
      customer.totalSpent =
        Math.round((customer.totalSpent + input.orderTotal) * 100) / 100;
      customer.lastOrderAt = now;
    }
    return customer;
  }

  async listCustomers(): Promise<Customer[]> {
    return [...this.customers].reverse();
  }

  async decrementStock(
    items: { productId: string; size: string; quantity: number }[]
  ): Promise<void> {
    for (const item of items) {
      const product = this.products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.size === item.size);
      if (variant) {
        variant.quantity = Math.max(0, variant.quantity - item.quantity);
      }
    }
  }
}
