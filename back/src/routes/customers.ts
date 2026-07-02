import { Router } from "express";
import { z } from "zod";
import { getStore } from "../store";

export const customersRouter = Router();

const subscribeSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  phone: z.string().optional(),
  districtId: z.string().optional(),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato esperado: YYYY-MM-DD")
    .optional(),
});

/**
 * POST /api/customers/subscribe
 * Alta en el "Club Clothea": guarda al cliente con consentimiento de
 * marketing para poder contactarlo con campañas y promociones.
 */
customersRouter.post("/subscribe", async (req, res, next) => {
  try {
    const parsed = subscribeSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
      return;
    }
    const customer = await getStore().upsertCustomer({
      ...parsed.data,
      acceptsMarketing: true,
    });
    res.status(201).json({ ok: true, id: customer.id });
  } catch (err) {
    next(err);
  }
});
