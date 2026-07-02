import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  Category,
  DeliveryConfig,
  District,
  Order,
  Product,
  ProductInput,
} from "../types";
import { config } from "../config";
import { ProductFilter, Store } from "./index";
import { seedDeliveryConfig } from "./seed";

interface ProductRow {
  id: string;
  code: string;
  name: string;
  description: string;
  category_id: string;
  color: string;
  price: number;
  sale_price: number | null;
  photos: string[];
  variants: { size: string; quantity: number }[];
  active: boolean;
  created_at: string;
}

interface OrderRow {
  id: string;
  items: Order["items"];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: Order["status"];
  customer: Order["customer"];
  created_at: string;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    categoryId: row.category_id,
    color: row.color,
    price: Number(row.price),
    salePrice: row.sale_price === null ? null : Number(row.sale_price),
    photos: row.photos ?? [],
    variants: row.variants ?? [],
    active: row.active,
    createdAt: row.created_at,
  };
}

function productToRow(input: Partial<ProductInput>): Partial<ProductRow> {
  const row: Partial<ProductRow> = {};
  if (input.code !== undefined) row.code = input.code;
  if (input.name !== undefined) row.name = input.name;
  if (input.description !== undefined) row.description = input.description;
  if (input.categoryId !== undefined) row.category_id = input.categoryId;
  if (input.color !== undefined) row.color = input.color;
  if (input.price !== undefined) row.price = input.price;
  if (input.salePrice !== undefined) row.sale_price = input.salePrice;
  if (input.photos !== undefined) row.photos = input.photos;
  if (input.variants !== undefined) row.variants = input.variants;
  if (input.active !== undefined) row.active = input.active;
  return row;
}

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    items: row.items,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    status: row.status,
    customer: row.customer,
    createdAt: row.created_at,
  };
}

export class SupabaseStore implements Store {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
  }

  async listCategories(): Promise<Category[]> {
    const { data, error } = await this.client
      .from("categories")
      .select("*")
      .order("name");
    if (error) throw error;
    return data as Category[];
  }

  async listProducts(filter: ProductFilter): Promise<Product[]> {
    let query = this.client.from("products").select("*").order("created_at", {
      ascending: false,
    });
    if (!filter.includeInactive) {
      query = query.eq("active", true);
    }
    if (filter.categorySlug) {
      const { data: cat } = await this.client
        .from("categories")
        .select("id")
        .eq("slug", filter.categorySlug)
        .single();
      query = query.eq("category_id", cat?.id ?? "__none__");
    }
    if (filter.onSale) {
      query = query.not("sale_price", "is", null);
    }
    if (filter.search) {
      query = query.or(
        `name.ilike.%${filter.search}%,description.ilike.%${filter.search}%,code.ilike.%${filter.search}%`
      );
    }
    const { data, error } = await query;
    if (error) throw error;
    return (data as ProductRow[]).map(rowToProduct);
  }

  async getProduct(id: string): Promise<Product | null> {
    const { data, error } = await this.client
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToProduct(data as ProductRow) : null;
  }

  async createProduct(input: ProductInput): Promise<Product> {
    const { data, error } = await this.client
      .from("products")
      .insert(productToRow(input))
      .select()
      .single();
    if (error) throw error;
    return rowToProduct(data as ProductRow);
  }

  async updateProduct(
    id: string,
    input: Partial<ProductInput>
  ): Promise<Product | null> {
    const { data, error } = await this.client
      .from("products")
      .update(productToRow(input))
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data ? rowToProduct(data as ProductRow) : null;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const { error, count } = await this.client
      .from("products")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw error;
    return (count ?? 0) > 0;
  }

  async listDistricts(): Promise<District[]> {
    const { data, error } = await this.client
      .from("districts")
      .select("*")
      .order("name");
    if (error) throw error;
    return (data as any[]).map((d) => ({
      id: d.id,
      name: d.name,
      lat: Number(d.lat),
      lng: Number(d.lng),
      surcharge: Number(d.surcharge),
    }));
  }

  async getDeliveryConfig(): Promise<DeliveryConfig> {
    const { data, error } = await this.client
      .from("settings")
      .select("value")
      .eq("key", "delivery_config")
      .maybeSingle();
    if (error) throw error;
    return (data?.value as DeliveryConfig) ?? seedDeliveryConfig;
  }

  async updateDeliveryConfig(cfg: DeliveryConfig): Promise<DeliveryConfig> {
    const { error } = await this.client
      .from("settings")
      .upsert({ key: "delivery_config", value: cfg });
    if (error) throw error;
    return cfg;
  }

  async createOrder(order: Order): Promise<Order> {
    const row: OrderRow = {
      id: order.id,
      items: order.items,
      subtotal: order.subtotal,
      delivery_fee: order.deliveryFee,
      total: order.total,
      status: order.status,
      customer: order.customer,
      created_at: order.createdAt,
    };
    const { data, error } = await this.client
      .from("orders")
      .insert(row)
      .select()
      .single();
    if (error) throw error;
    return rowToOrder(data as OrderRow);
  }

  async getOrder(id: string): Promise<Order | null> {
    const { data, error } = await this.client
      .from("orders")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return data ? rowToOrder(data as OrderRow) : null;
  }

  async updateOrderStatus(
    id: string,
    status: Order["status"]
  ): Promise<Order | null> {
    const { data, error } = await this.client
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw error;
    return data ? rowToOrder(data as OrderRow) : null;
  }

  async listOrders(): Promise<Order[]> {
    const { data, error } = await this.client
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as OrderRow[]).map(rowToOrder);
  }

  async decrementStock(
    items: { productId: string; size: string; quantity: number }[]
  ): Promise<void> {
    // Para el MVP se actualiza el jsonb de variantes producto por producto.
    // Con más volumen conviene mover variantes a su propia tabla con
    // update atómico (o una función RPC en Postgres).
    for (const item of items) {
      const product = await this.getProduct(item.productId);
      if (!product) continue;
      const variants = product.variants.map((v) =>
        v.size === item.size
          ? { ...v, quantity: Math.max(0, v.quantity - item.quantity) }
          : v
      );
      await this.updateProduct(item.productId, { variants });
    }
  }
}
