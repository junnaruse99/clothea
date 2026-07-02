import { Router } from "express";
import { z } from "zod";
import { computeDeliveryQuote } from "../delivery";
import { getStore } from "../store";

export const deliveryRouter = Router();

// GET /api/delivery/districts
deliveryRouter.get("/districts", async (_req, res, next) => {
  try {
    res.json(await getStore().listDistricts());
  } catch (err) {
    next(err);
  }
});

const quoteSchema = z.object({
  districtId: z.string(),
  subtotal: z.number().nonnegative().default(0),
});

// POST /api/delivery/quote  { districtId, subtotal }
deliveryRouter.post("/quote", async (req, res, next) => {
  try {
    const parsed = quoteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
      return;
    }
    const store = getStore();
    const districts = await store.listDistricts();
    const district = districts.find((d) => d.id === parsed.data.districtId);
    if (!district) {
      res.status(404).json({ error: "Distrito no encontrado" });
      return;
    }
    const cfg = await store.getDeliveryConfig();
    res.json(computeDeliveryQuote(cfg, district, parsed.data.subtotal));
  } catch (err) {
    next(err);
  }
});
