import { demoAdminApi, demoApi } from "./demo";
import {
  Category,
  Customer,
  DeliveryConfig,
  DeliveryQuote,
  District,
  Order,
  PaymentSession,
  Product,
} from "./types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

/** Modo demo (GitHub Pages): todo corre en el navegador, sin backend. */
export const DEMO = process.env.NEXT_PUBLIC_DEMO === "true";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Resuelve la URL de una foto según su origen. */
export function imgUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  // assets estáticos del propio front (modo demo en GitHub Pages)
  if (path.startsWith("/demo/")) return `${BASE_PATH}${path}`;
  return `${API_URL}${path}`;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Error ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ------------------------- Catálogo público -------------------------

export const api = {
  getCategories: () =>
    DEMO ? demoApi.getCategories() : request<Category[]>("/api/categories"),

  getProducts: (params?: { category?: string; search?: string; sale?: boolean }) => {
    if (DEMO) return demoApi.getProducts(params);
    const qs = new URLSearchParams();
    if (params?.category) qs.set("category", params.category);
    if (params?.search) qs.set("search", params.search);
    if (params?.sale) qs.set("sale", "true");
    const suffix = qs.toString() ? `?${qs}` : "";
    return request<Product[]>(`/api/products${suffix}`);
  },

  getProduct: (id: string) =>
    DEMO ? demoApi.getProduct(id) : request<Product>(`/api/products/${id}`),

  getDistricts: () =>
    DEMO ? demoApi.getDistricts() : request<District[]>("/api/delivery/districts"),

  quoteDelivery: (districtId: string, subtotal: number) =>
    DEMO
      ? demoApi.quoteDelivery(districtId, subtotal)
      : request<DeliveryQuote>("/api/delivery/quote", {
          method: "POST",
          body: JSON.stringify({ districtId, subtotal }),
        }),

  createOrder: (payload: {
    items: { productId: string; size: string; quantity: number }[];
    customer: Order["customer"];
  }) =>
    DEMO
      ? demoApi.createOrder(payload)
      : request<{ order: Order; payment: PaymentSession }>("/api/orders", {
          method: "POST",
          body: JSON.stringify(payload),
        }),

  payOrder: (orderId: string) =>
    DEMO
      ? demoApi.payOrder(orderId)
      : request<Order>(`/api/orders/${orderId}/pay`, { method: "POST" }),

  getOrder: (id: string) =>
    DEMO ? demoApi.getOrder(id) : request<Order>(`/api/orders/${id}`),

  subscribeCustomer: (payload: {
    email: string;
    name?: string;
    phone?: string;
    districtId?: string;
    birthday?: string;
  }) =>
    DEMO
      ? demoApi.subscribeCustomer(payload)
      : request<{ ok: boolean }>("/api/customers/subscribe", {
          method: "POST",
          body: JSON.stringify(payload),
        }),
};

// ------------------------- Panel admin -------------------------

const ADMIN_KEY_STORAGE = "clothea_admin_key";

export function getAdminKey(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ADMIN_KEY_STORAGE) ?? "";
}

export function setAdminKey(key: string) {
  localStorage.setItem(ADMIN_KEY_STORAGE, key);
}

export function clearAdminKey() {
  localStorage.removeItem(ADMIN_KEY_STORAGE);
}

function adminHeaders(): Record<string, string> {
  return { "x-admin-key": getAdminKey() };
}

export const adminApi = {
  getProducts: () =>
    DEMO
      ? demoAdminApi.getProducts()
      : request<Product[]>("/api/admin/products", { headers: adminHeaders() }),

  getProduct: (id: string) =>
    DEMO
      ? demoAdminApi.getProduct(id)
      : request<Product>(`/api/admin/products/${id}`, { headers: adminHeaders() }),

  createProduct: (input: Omit<Product, "id" | "createdAt">) =>
    DEMO
      ? demoAdminApi.createProduct(input)
      : request<Product>("/api/admin/products", {
          method: "POST",
          headers: adminHeaders(),
          body: JSON.stringify(input),
        }),

  updateProduct: (id: string, input: Partial<Omit<Product, "id" | "createdAt">>) =>
    DEMO
      ? demoAdminApi.updateProduct(id, input)
      : request<Product>(`/api/admin/products/${id}`, {
          method: "PUT",
          headers: adminHeaders(),
          body: JSON.stringify(input),
        }),

  deleteProduct: (id: string) =>
    DEMO
      ? demoAdminApi.deleteProduct(id)
      : request<void>(`/api/admin/products/${id}`, {
          method: "DELETE",
          headers: adminHeaders(),
        }),

  uploadPhotos: async (files: FileList): Promise<string[]> => {
    if (DEMO) return demoAdminApi.uploadPhotos(files);
    const form = new FormData();
    Array.from(files).forEach((f) => form.append("photos", f));
    const res = await fetch(`${API_URL}/api/admin/uploads`, {
      method: "POST",
      headers: adminHeaders(),
      body: form,
    });
    if (!res.ok) throw new Error("Error subiendo fotos");
    const data = await res.json();
    return data.paths;
  },

  getDeliveryConfig: () =>
    DEMO
      ? demoAdminApi.getDeliveryConfig()
      : request<DeliveryConfig>("/api/admin/delivery-config", {
          headers: adminHeaders(),
        }),

  updateDeliveryConfig: (cfg: DeliveryConfig) =>
    DEMO
      ? demoAdminApi.updateDeliveryConfig(cfg)
      : request<DeliveryConfig>("/api/admin/delivery-config", {
          method: "PUT",
          headers: adminHeaders(),
          body: JSON.stringify(cfg),
        }),

  getOrders: () =>
    DEMO
      ? demoAdminApi.getOrders()
      : request<Order[]>("/api/admin/orders", { headers: adminHeaders() }),

  getCustomers: () =>
    DEMO
      ? demoAdminApi.getCustomers()
      : request<Customer[]>("/api/admin/customers", { headers: adminHeaders() }),
};
