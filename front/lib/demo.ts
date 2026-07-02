/**
 * Modo demo para GitHub Pages: replica el backend completo sobre
 * localStorage para que la tienda funcione sin API (catálogo, carrito,
 * checkout, pago, club y panel admin). Se activa con NEXT_PUBLIC_DEMO=true.
 */
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

const DB_KEY = "clothea_demo_db";

export const demoCategories: Category[] = [
  { id: "cat-vestidos", name: "Vestidos", slug: "vestidos" },
  { id: "cat-blusas", name: "Blusas", slug: "blusas" },
  { id: "cat-pantalones", name: "Pantalones", slug: "pantalones" },
  { id: "cat-faldas", name: "Faldas", slug: "faldas" },
  { id: "cat-polos", name: "Polos", slug: "polos" },
  { id: "cat-accesorios", name: "Accesorios", slug: "accesorios" },
];

const now = () => new Date().toISOString();

const demoProducts: Product[] = [
  {
    id: "prod-001",
    code: "VE-001",
    name: "Vestido Floral Primavera",
    description:
      "Vestido midi con estampado floral, tela fresca y ligera, ideal para el verano limeño. Corte que favorece todas las siluetas.",
    categoryId: "cat-vestidos",
    color: "Rosado floral",
    price: 89.9,
    salePrice: 69.9,
    photos: ["/demo/vestido-floral.svg"],
    variants: [
      { size: "S", quantity: 8 },
      { size: "M", quantity: 12 },
      { size: "L", quantity: 5 },
    ],
    active: true,
    createdAt: now(),
  },
  {
    id: "prod-002",
    code: "VE-002",
    name: "Vestido Negro Elegante",
    description:
      "El clásico vestido negro que no puede faltar. Perfecto para una cena o una reunión importante.",
    categoryId: "cat-vestidos",
    color: "Negro",
    price: 119.9,
    salePrice: null,
    photos: ["/demo/vestido-negro.svg"],
    variants: [
      { size: "S", quantity: 6 },
      { size: "M", quantity: 9 },
      { size: "L", quantity: 4 },
      { size: "XL", quantity: 3 },
    ],
    active: true,
    createdAt: now(),
  },
  {
    id: "prod-003",
    code: "BL-001",
    name: "Blusa Satinada Champagne",
    description:
      "Blusa de satén con caída elegante y botones perlados. Combina con jeans o falda para un look versátil.",
    categoryId: "cat-blusas",
    color: "Champagne",
    price: 59.9,
    salePrice: 45.9,
    photos: ["/demo/blusa-satinada.svg"],
    variants: [
      { size: "S", quantity: 10 },
      { size: "M", quantity: 14 },
      { size: "L", quantity: 7 },
    ],
    active: true,
    createdAt: now(),
  },
  {
    id: "prod-004",
    code: "BL-002",
    name: "Blusa Blanca Manga Bombacha",
    description:
      "Blusa blanca de algodón con mangas bombachas y cuello cuadrado. Fresca, cómoda y muy femenina.",
    categoryId: "cat-blusas",
    color: "Blanco",
    price: 49.9,
    salePrice: null,
    photos: ["/demo/blusa-blanca.svg"],
    variants: [
      { size: "S", quantity: 12 },
      { size: "M", quantity: 15 },
      { size: "L", quantity: 8 },
    ],
    active: true,
    createdAt: now(),
  },
  {
    id: "prod-005",
    code: "PA-001",
    name: "Jean Mom Fit Tiro Alto",
    description:
      "Jean mom fit de tiro alto, denim suave con stretch. El básico favorito de todas.",
    categoryId: "cat-pantalones",
    color: "Azul medio",
    price: 99.9,
    salePrice: 79.9,
    photos: ["/demo/jean-momfit.svg"],
    variants: [
      { size: "26", quantity: 6 },
      { size: "28", quantity: 10 },
      { size: "30", quantity: 8 },
      { size: "32", quantity: 4 },
    ],
    active: true,
    createdAt: now(),
  },
  {
    id: "prod-006",
    code: "PA-002",
    name: "Pantalón Palazzo Lino",
    description:
      "Pantalón palazzo de lino fresco color arena. Elegante y cómodo para el día a día.",
    categoryId: "cat-pantalones",
    color: "Arena",
    price: 79.9,
    salePrice: null,
    photos: ["/demo/pantalon-palazzo.svg"],
    variants: [
      { size: "S", quantity: 7 },
      { size: "M", quantity: 9 },
      { size: "L", quantity: 5 },
    ],
    active: true,
    createdAt: now(),
  },
  {
    id: "prod-007",
    code: "FA-001",
    name: "Falda Plisada Midi",
    description:
      "Falda plisada midi color terracota con cintura elástica. Movimiento y estilo en una sola prenda.",
    categoryId: "cat-faldas",
    color: "Terracota",
    price: 65.9,
    salePrice: 52.9,
    photos: ["/demo/falda-plisada.svg"],
    variants: [
      { size: "S", quantity: 9 },
      { size: "M", quantity: 11 },
      { size: "L", quantity: 6 },
    ],
    active: true,
    createdAt: now(),
  },
  {
    id: "prod-008",
    code: "PO-001",
    name: "Polo Básico Algodón Pima",
    description:
      "Polo de algodón pima peruano, suave y duradero. Disponible en color lila pastel.",
    categoryId: "cat-polos",
    color: "Lila",
    price: 35.9,
    salePrice: null,
    photos: ["/demo/polo-basico.svg"],
    variants: [
      { size: "S", quantity: 20 },
      { size: "M", quantity: 25 },
      { size: "L", quantity: 15 },
      { size: "XL", quantity: 10 },
    ],
    active: true,
    createdAt: now(),
  },
  {
    id: "prod-009",
    code: "PO-002",
    name: "Polo Crop Rib",
    description:
      "Polo crop acanalado de manga corta. Juvenil y combinable con jeans de tiro alto.",
    categoryId: "cat-polos",
    color: "Verde oliva",
    price: 29.9,
    salePrice: 24.9,
    photos: ["/demo/polo-crop.svg"],
    variants: [
      { size: "S", quantity: 14 },
      { size: "M", quantity: 16 },
      { size: "L", quantity: 9 },
    ],
    active: true,
    createdAt: now(),
  },
  {
    id: "prod-010",
    code: "AC-001",
    name: "Cartera Tote Vegana",
    description:
      "Cartera tote de cuero vegano color camel. Amplia, resistente y con bolsillo interior.",
    categoryId: "cat-accesorios",
    color: "Camel",
    price: 75.9,
    salePrice: null,
    photos: ["/demo/cartera-tote.svg"],
    variants: [{ size: "Única", quantity: 12 }],
    active: true,
    createdAt: now(),
  },
];

export const demoDistricts: District[] = [
  { id: "dist-miraflores", name: "Miraflores", lat: -12.1211, lng: -77.0297, surcharge: 0 },
  { id: "dist-san-isidro", name: "San Isidro", lat: -12.0976, lng: -77.0365, surcharge: 0 },
  { id: "dist-barranco", name: "Barranco", lat: -12.14, lng: -77.021, surcharge: 0 },
  { id: "dist-surco", name: "Santiago de Surco", lat: -12.1355, lng: -76.993, surcharge: 0 },
  { id: "dist-la-molina", name: "La Molina", lat: -12.079, lng: -76.939, surcharge: 0 },
  { id: "dist-san-borja", name: "San Borja", lat: -12.1027, lng: -76.9989, surcharge: 0 },
  { id: "dist-jesus-maria", name: "Jesús María", lat: -12.0705, lng: -77.048, surcharge: 0 },
  { id: "dist-lince", name: "Lince", lat: -12.085, lng: -77.036, surcharge: 0 },
  { id: "dist-magdalena", name: "Magdalena del Mar", lat: -12.091, lng: -77.071, surcharge: 0 },
  { id: "dist-pueblo-libre", name: "Pueblo Libre", lat: -12.074, lng: -77.063, surcharge: 0 },
  { id: "dist-san-miguel", name: "San Miguel", lat: -12.077, lng: -77.091, surcharge: 0 },
  { id: "dist-cercado", name: "Cercado de Lima", lat: -12.0464, lng: -77.0428, surcharge: 0 },
  { id: "dist-brena", name: "Breña", lat: -12.057, lng: -77.05, surcharge: 0 },
  { id: "dist-la-victoria", name: "La Victoria", lat: -12.065, lng: -77.015, surcharge: 0 },
  { id: "dist-surquillo", name: "Surquillo", lat: -12.111, lng: -77.017, surcharge: 0 },
  { id: "dist-chorrillos", name: "Chorrillos", lat: -12.168, lng: -77.024, surcharge: 0 },
  { id: "dist-sjm", name: "San Juan de Miraflores", lat: -12.155, lng: -76.97, surcharge: 2 },
  { id: "dist-ves", name: "Villa El Salvador", lat: -12.213, lng: -76.939, surcharge: 3 },
  { id: "dist-sjl", name: "San Juan de Lurigancho", lat: -12.003, lng: -77.008, surcharge: 3 },
  { id: "dist-los-olivos", name: "Los Olivos", lat: -11.991, lng: -77.071, surcharge: 3 },
  { id: "dist-smp", name: "San Martín de Porres", lat: -12.009, lng: -77.085, surcharge: 3 },
  { id: "dist-comas", name: "Comas", lat: -11.943, lng: -77.062, surcharge: 4 },
  { id: "dist-ate", name: "Ate", lat: -12.026, lng: -76.921, surcharge: 3 },
  { id: "dist-santa-anita", name: "Santa Anita", lat: -12.043, lng: -76.971, surcharge: 2 },
  { id: "dist-callao", name: "Callao", lat: -12.056, lng: -77.118, surcharge: 3 },
  { id: "dist-rimac", name: "Rímac", lat: -12.029, lng: -77.028, surcharge: 2 },
];

const defaultConfig: DeliveryConfig = {
  originLat: -12.1211,
  originLng: -77.0297,
  baseFee: 8,
  perKmFee: 1.2,
  minFee: 8,
  freeThreshold: 200,
};

// ------------------------------ "Base de datos" ------------------------------

interface DemoDb {
  products: Product[];
  deliveryConfig: DeliveryConfig;
  orders: Order[];
  customers: Customer[];
}

function loadDb(): DemoDb {
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(DB_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // base corrupta: se regenera
    }
  }
  return {
    products: demoProducts.map((p) => ({ ...p, variants: p.variants.map((v) => ({ ...v })) })),
    deliveryConfig: { ...defaultConfig },
    orders: [],
    customers: [],
  };
}

function saveDb(db: DemoDb) {
  if (typeof window !== "undefined") {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
}

/** Pequeña pausa para que skeletons y animaciones se aprecien. */
const wait = (ms = 200) => new Promise((r) => setTimeout(r, ms));

// ------------------------------ Algoritmo delivery ------------------------------

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function computeQuote(
  cfg: DeliveryConfig,
  district: District,
  subtotal: number
): DeliveryQuote {
  const distanceKm = haversineKm(cfg.originLat, cfg.originLng, district.lat, district.lng);
  const raw = Math.max(cfg.minFee, cfg.baseFee + cfg.perKmFee * distanceKm);
  const fee = Math.round((raw + district.surcharge) * 10) / 10;
  const freeDelivery = cfg.freeThreshold > 0 && subtotal >= cfg.freeThreshold;
  return {
    districtId: district.id,
    districtName: district.name,
    distanceKm: Math.round(distanceKm * 10) / 10,
    fee: freeDelivery ? 0 : fee,
    freeDelivery,
  };
}

function upsertCustomer(
  db: DemoDb,
  input: {
    email: string;
    name?: string;
    phone?: string;
    districtId?: string;
    birthday?: string;
    acceptsMarketing?: boolean;
    orderTotal?: number;
  }
): Customer {
  const email = input.email.trim().toLowerCase();
  let customer = db.customers.find((c) => c.email === email);
  if (!customer) {
    customer = {
      id: crypto.randomUUID(),
      name: input.name ?? "",
      email,
      phone: input.phone ?? "",
      districtId: input.districtId ?? null,
      birthday: input.birthday ?? null,
      acceptsMarketing: input.acceptsMarketing ?? false,
      ordersCount: 0,
      totalSpent: 0,
      createdAt: now(),
      lastOrderAt: null,
    };
    db.customers.push(customer);
  } else {
    if (input.name) customer.name = input.name;
    if (input.phone) customer.phone = input.phone;
    if (input.districtId) customer.districtId = input.districtId;
    if (input.birthday) customer.birthday = input.birthday;
    if (input.acceptsMarketing) customer.acceptsMarketing = true;
  }
  if (input.orderTotal !== undefined) {
    customer.ordersCount += 1;
    customer.totalSpent = Math.round((customer.totalSpent + input.orderTotal) * 100) / 100;
    customer.lastOrderAt = now();
  }
  return customer;
}

// ------------------------------ API pública ------------------------------

export const demoApi = {
  async getCategories(): Promise<Category[]> {
    await wait();
    return demoCategories;
  },

  async getProducts(params?: {
    category?: string;
    search?: string;
    sale?: boolean;
  }): Promise<Product[]> {
    await wait();
    const db = loadDb();
    let result = db.products.filter((p) => p.active);
    if (params?.category) {
      const cat = demoCategories.find((c) => c.slug === params.category);
      result = result.filter((p) => p.categoryId === cat?.id);
    }
    if (params?.sale) result = result.filter((p) => p.salePrice !== null);
    if (params?.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
      );
    }
    return result;
  },

  async getProduct(id: string): Promise<Product> {
    await wait();
    const product = loadDb().products.find((p) => p.id === id && p.active);
    if (!product) throw new Error("Producto no encontrado");
    return product;
  },

  async getDistricts(): Promise<District[]> {
    await wait();
    return demoDistricts;
  },

  async quoteDelivery(districtId: string, subtotal: number): Promise<DeliveryQuote> {
    await wait(120);
    const district = demoDistricts.find((d) => d.id === districtId);
    if (!district) throw new Error("Distrito no encontrado");
    return computeQuote(loadDb().deliveryConfig, district, subtotal);
  },

  async createOrder(payload: {
    items: { productId: string; size: string; quantity: number }[];
    customer: Order["customer"];
  }): Promise<{ order: Order; payment: PaymentSession }> {
    await wait(350);
    const db = loadDb();
    const items: Order["items"] = [];
    for (const item of payload.items) {
      const product = db.products.find((p) => p.id === item.productId && p.active);
      if (!product) throw new Error(`Producto no disponible: ${item.productId}`);
      const variant = product.variants.find((v) => v.size === item.size);
      if (!variant || variant.quantity < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name} talla ${item.size}`);
      }
      items.push({
        productId: product.id,
        name: product.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: product.salePrice ?? product.price,
      });
    }
    const subtotal =
      Math.round(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 100) / 100;
    const district = demoDistricts.find((d) => d.id === payload.customer.districtId);
    if (!district) throw new Error("Distrito de entrega no válido");
    const quote = computeQuote(db.deliveryConfig, district, subtotal);
    const order: Order = {
      id: crypto.randomUUID(),
      items,
      subtotal,
      deliveryFee: quote.fee,
      total: Math.round((subtotal + quote.fee) * 100) / 100,
      status: "pending_payment",
      customer: payload.customer,
      createdAt: now(),
    };
    db.orders.push(order);
    saveDb(db);
    return {
      order,
      payment: {
        provider: "demo",
        paymentId: `pay_${order.id.slice(0, 8)}`,
        amount: order.total,
        currency: "PEN",
      },
    };
  },

  async payOrder(orderId: string): Promise<Order> {
    await wait(500);
    const db = loadDb();
    const order = db.orders.find((o) => o.id === orderId);
    if (!order) throw new Error("Orden no encontrada");
    if (order.status !== "pending_payment") {
      throw new Error(`La orden ya está en estado ${order.status}`);
    }
    for (const item of order.items) {
      const product = db.products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.size === item.size);
      if (variant) variant.quantity = Math.max(0, variant.quantity - item.quantity);
    }
    order.status = "paid";
    upsertCustomer(db, {
      email: order.customer.email,
      name: order.customer.name,
      phone: order.customer.phone,
      districtId: order.customer.districtId,
      orderTotal: order.total,
    });
    saveDb(db);
    return order;
  },

  async getOrder(id: string): Promise<Order> {
    await wait();
    const order = loadDb().orders.find((o) => o.id === id);
    if (!order) throw new Error("Orden no encontrada");
    return order;
  },

  async subscribeCustomer(payload: {
    email: string;
    name?: string;
    phone?: string;
    districtId?: string;
    birthday?: string;
  }): Promise<{ ok: boolean }> {
    await wait(300);
    const db = loadDb();
    upsertCustomer(db, { ...payload, acceptsMarketing: true });
    saveDb(db);
    return { ok: true };
  },
};

// ------------------------------ API admin ------------------------------

export const demoAdminApi = {
  async getProducts(): Promise<Product[]> {
    await wait();
    return loadDb().products;
  },

  async getProduct(id: string): Promise<Product> {
    await wait();
    const product = loadDb().products.find((p) => p.id === id);
    if (!product) throw new Error("Producto no encontrado");
    return product;
  },

  async createProduct(input: Omit<Product, "id" | "createdAt">): Promise<Product> {
    await wait(250);
    const db = loadDb();
    const product: Product = { ...input, id: crypto.randomUUID(), createdAt: now() };
    db.products.push(product);
    saveDb(db);
    return product;
  },

  async updateProduct(
    id: string,
    input: Partial<Omit<Product, "id" | "createdAt">>
  ): Promise<Product> {
    await wait(250);
    const db = loadDb();
    const product = db.products.find((p) => p.id === id);
    if (!product) throw new Error("Producto no encontrado");
    Object.assign(product, input);
    saveDb(db);
    return product;
  },

  async deleteProduct(id: string): Promise<void> {
    await wait(250);
    const db = loadDb();
    db.products = db.products.filter((p) => p.id !== id);
    saveDb(db);
  },

  async uploadPhotos(files: FileList): Promise<string[]> {
    // Sin servidor, las fotos se guardan como data URLs en localStorage
    const paths: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 400 * 1024) {
        throw new Error(`"${file.name}" pesa más de 400KB (límite del modo demo)`);
      }
      paths.push(
        await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Error leyendo el archivo"));
          reader.readAsDataURL(file);
        })
      );
    }
    return paths;
  },

  async getDeliveryConfig(): Promise<DeliveryConfig> {
    await wait();
    return loadDb().deliveryConfig;
  },

  async updateDeliveryConfig(cfg: DeliveryConfig): Promise<DeliveryConfig> {
    await wait(250);
    const db = loadDb();
    db.deliveryConfig = { ...cfg };
    saveDb(db);
    return db.deliveryConfig;
  },

  async getOrders(): Promise<Order[]> {
    await wait();
    return [...loadDb().orders].reverse();
  },

  async getCustomers(): Promise<Customer[]> {
    await wait();
    return [...loadDb().customers].reverse();
  },
};
