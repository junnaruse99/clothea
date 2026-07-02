import { Router } from "express";
import { getStore } from "../store";

export const catalogRouter = Router();

// GET /api/categories
catalogRouter.get("/categories", async (_req, res, next) => {
  try {
    res.json(await getStore().listCategories());
  } catch (err) {
    next(err);
  }
});

// GET /api/products?category=vestidos&search=floral&sale=true
catalogRouter.get("/products", async (req, res, next) => {
  try {
    const products = await getStore().listProducts({
      categorySlug: req.query.category as string | undefined,
      search: req.query.search as string | undefined,
      onSale: req.query.sale === "true",
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
catalogRouter.get("/products/:id", async (req, res, next) => {
  try {
    const product = await getStore().getProduct(req.params.id);
    if (!product || !product.active) {
      res.status(404).json({ error: "Producto no encontrado" });
      return;
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});
