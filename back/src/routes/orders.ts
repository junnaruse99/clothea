import { randomUUID } from "crypto";
import { Router } from "express";
import { z } from "zod";
import { computeDeliveryQuote } from "../delivery";
import { getStore } from "../store";
import { Order, OrderItem } from "../types";

export const ordersRouter = Router();

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        size: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  customer: z.object({
    name: z.string().min(2),
    phone: z.string().min(6),
    email: z.string().email(),
    address: z.string().min(5),
    districtId: z.string(),
  }),
});

/**
 * POST /api/orders
 * Valida stock, calcula precios en el servidor (nunca confiar en el cliente),
 * cotiza el delivery y crea la orden en estado pending_payment.
 * Devuelve la orden + una sesión de pago del gateway (mock para el MVP).
 */
ordersRouter.post("/", async (req, res, next) => {
  try {
    const parsed = createOrderSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Datos inválidos", details: parsed.error.flatten() });
      return;
    }
    const store = getStore();
    const { items, customer } = parsed.data;

    const orderItems: OrderItem[] = [];
    for (const item of items) {
      const product = await store.getProduct(item.productId);
      if (!product || !product.active) {
        res.status(400).json({ error: `Producto no disponible: ${item.productId}` });
        return;
      }
      const variant = product.variants.find((v) => v.size === item.size);
      if (!variant || variant.quantity < item.quantity) {
        res.status(400).json({
          error: `Stock insuficiente para ${product.name} talla ${item.size}`,
        });
        return;
      }
      orderItems.push({
        productId: product.id,
        name: product.name,
        size: item.size,
        quantity: item.quantity,
        unitPrice: product.salePrice ?? product.price,
      });
    }

    const subtotal =
      Math.round(
        orderItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0) * 100
      ) / 100;

    const districts = await store.listDistricts();
    const district = districts.find((d) => d.id === customer.districtId);
    if (!district) {
      res.status(400).json({ error: "Distrito de entrega no válido" });
      return;
    }
    const cfg = await store.getDeliveryConfig();
    const quote = computeDeliveryQuote(cfg, district, subtotal);

    const order: Order = {
      id: randomUUID(),
      items: orderItems,
      subtotal,
      deliveryFee: quote.fee,
      total: Math.round((subtotal + quote.fee) * 100) / 100,
      status: "pending_payment",
      customer,
      createdAt: new Date().toISOString(),
    };
    await store.createOrder(order);

    // Sesión del gateway de pago. Para producción, reemplazar por Culqi,
    // MercadoPago o Stripe: aquí se crearía el charge/preference y se
    // devolvería su checkoutUrl o token real.
    res.status(201).json({
      order,
      payment: {
        provider: "mock",
        paymentId: `pay_${order.id.slice(0, 8)}`,
        amount: order.total,
        currency: "PEN",
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id — para la página de confirmación
ordersRouter.get("/:id", async (req, res, next) => {
  try {
    const order = await getStore().getOrder(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Orden no encontrada" });
      return;
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/orders/:id/pay
 * Confirmación del pago (mock). En producción esto sería el webhook del
 * gateway (Culqi/MercadoPago) verificando la firma antes de marcar pagado.
 */
ordersRouter.post("/:id/pay", async (req, res, next) => {
  try {
    const store = getStore();
    const order = await store.getOrder(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Orden no encontrada" });
      return;
    }
    if (order.status !== "pending_payment") {
      res.status(409).json({ error: `La orden ya está en estado ${order.status}` });
      return;
    }
    await store.decrementStock(order.items);
    const updated = await store.updateOrderStatus(order.id, "paid");
    res.json(updated);
  } catch (err) {
    next(err);
  }
});
