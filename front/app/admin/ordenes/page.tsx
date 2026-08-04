"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { Order } from "@/lib/types";

const statusLabels: Record<Order["status"], { label: string; className: string }> = {
  paid: { label: "Pagada", className: "bg-blush text-rose" },
  pending_payment: { label: "Pendiente", className: "bg-sand text-ink-soft" },
  cancelled: { label: "Cancelada", className: "bg-sand text-ink-soft line-through" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-ink-soft">Cargando...</p>;

  if (orders.length === 0) {
    return <p className="py-12 text-center text-ink-soft">Aún no hay órdenes.</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((o) => {
        const status = statusLabels[o.status];
        return (
          <div
            key={o.id}
            className="rounded-2xl bg-surface p-5 shadow-sm ring-1 ring-sand"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-mono text-sm text-ink-soft">
                  #{o.id.slice(0, 8)}
                </span>
                <span
                  className={`ml-3 rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.className}`}
                >
                  {status.label}
                </span>
              </div>
              <span className="text-sm text-ink-soft">
                {formatDate(o.createdAt)}
              </span>
            </div>

            <div className="mt-3 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="font-semibold">{o.customer.name}</p>
                <p className="text-ink-soft">{o.customer.address}</p>
                <p className="text-ink-soft">
                  {o.customer.phone} · {o.customer.email}
                </p>
              </div>
              <div>
                <ul className="space-y-0.5 text-ink-soft">
                  {o.items.map((i) => (
                    <li key={`${i.productId}-${i.size}`}>
                      {i.name} · {i.size} × {i.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-6 border-t border-sand pt-3 text-sm">
              <span className="text-ink-soft">
                Delivery: {o.deliveryFee === 0 ? "Gratis" : formatPrice(o.deliveryFee)}
              </span>
              <span className="font-bold text-rose">
                Total: {formatPrice(o.total)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
