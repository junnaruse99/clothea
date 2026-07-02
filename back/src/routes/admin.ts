import { Router } from "express";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import { z } from "zod";
import { getStore } from "../store";
import { adminAuth } from "../middleware/adminAuth";

export const adminRouter = Router();
adminRouter.use(adminAuth);

// ---------------------------------------------------------------------------
// Fotos: por ahora se guardan en el repo (back/uploads) y se sirven en
// /uploads. Al crecer, cambiar este storage de multer por un cliente S3
// (o Supabase Storage) manteniendo el mismo contrato: subir → devolver URL.
// ---------------------------------------------------------------------------
export const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${randomUUID().slice(0, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = [".jpg", ".jpeg", ".png", ".webp", ".svg"].includes(
      path.extname(file.originalname).toLowerCase()
    );
    cb(null, ok);
  },
});

// POST /api/admin/uploads (multipart, campo "photos")
adminRouter.post("/uploads", upload.array("photos", 6), (req, res) => {
  const files = (req.files as Express.Multer.File[]) ?? [];
  res.status(201).json({ paths: files.map((f) => `/uploads/${f.filename}`) });
});

// ---------------------------------------------------------------------------
// Productos
// ---------------------------------------------------------------------------
const productSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(2),
  description: z.string().default(""),
  categoryId: z.string().min(1),
  color: z.string().default(""),
  price: z.number().positive(),
  salePrice: z.number().positive().nullable().default(null),
  photos: z.array(z.string()).default([]),
  variants: z
    .array(z.object({ size: z.string().min(1), quantity: z.number().int().min(0) }))
    .default([]),
  active: z.boolean().default(true),
});

// GET /api/admin/products (incluye inactivos)
adminRouter.get("/products", async (_req, res, next) => {
  try {
    res.json(await getStore().listProducts({ includeInactive: true }));
  } catch (err) {
    next(err);
  }
});

adminRouter.get("/products/:id", async (req, res, next) => {
  try {
    const product = await getStore().getProduct(req.params.id);
    if (!product) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

adminRouter.post("/products", async (req, res, next) => {
  try {
    const parsed = productSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
      return;
    }
    res.status(201).json(await getStore().createProduct(parsed.data));
  } catch (err) {
    next(err);
  }
});

adminRouter.put("/products/:id", async (req, res, next) => {
  try {
    const parsed = productSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
      return;
    }
    const updated = await getStore().updateProduct(req.params.id, parsed.data);
    if (!updated) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

adminRouter.delete("/products/:id", async (req, res, next) => {
  try {
    const deleted = await getStore().deleteProduct(req.params.id);
    if (!deleted) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Configuración de delivery (el "algoritmo" personalizable)
// ---------------------------------------------------------------------------
const deliveryConfigSchema = z.object({
  originLat: z.number(),
  originLng: z.number(),
  baseFee: z.number().min(0),
  perKmFee: z.number().min(0),
  minFee: z.number().min(0),
  freeThreshold: z.number().min(0),
});

adminRouter.get("/delivery-config", async (_req, res, next) => {
  try {
    res.json(await getStore().getDeliveryConfig());
  } catch (err) {
    next(err);
  }
});

adminRouter.put("/delivery-config", async (req, res, next) => {
  try {
    const parsed = deliveryConfigSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
      return;
    }
    res.json(await getStore().updateDeliveryConfig(parsed.data));
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// Órdenes
// ---------------------------------------------------------------------------
adminRouter.get("/orders", async (_req, res, next) => {
  try {
    res.json(await getStore().listOrders());
  } catch (err) {
    next(err);
  }
});
