"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { Order } from "@/lib/types";

export default function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getOrder(id).then(setOrder).catch(() => setError("Orden no encontrada"));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center text-ink-soft">
        {error}
      </div>
    );
  }
  if (!order) return null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-sand">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blush text-3xl">
            {order.status === "paid" ? "🎉" : "⏳"}
          </div>
          <h1 className="mt-4 font-display text-3xl font-bold">
            {order.status === "paid"
              ? "¡Gracias por tu compra!"
              : "Orden pendiente de pago"}
          </h1>
          <p className="mt-2 text-sm text-ink-soft">
            Orden #{order.id.slice(0, 8)} · {formatDate(order.createdAt)}
          </p>
        </div>

        <ul className="mt-6 space-y-2 border-t border-sand pt-6 text-sm">
          {order.items.map((i) => (
            <li key={`${i.productId}-${i.size}`} className="flex justify-between">
              <span className="text-ink-soft">
                {i.name} · Talla {i.size} × {i.quantity}
              </span>
              <span>{formatPrice(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 space-y-1 border-t border-sand pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>
              {order.deliveryFee === 0 ? "Gratis" : formatPrice(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between pt-2 text-base font-bold">
            <span>Total</span>
            <span className="text-rose">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-cream p-4 text-sm text-ink-soft">
          <p className="font-semibold text-ink">Entrega</p>
          <p>{order.customer.name}</p>
          <p>{order.customer.address}</p>
          <p>{order.customer.phone}</p>
        </div>

        <Link
          href="/"
          className="mt-6 block rounded-xl bg-rose py-3 text-center font-semibold text-white transition hover:bg-rose-dark"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}
