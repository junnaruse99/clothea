"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { Order } from "@/lib/types";

// Pétalos y corazones que suben suavemente detrás de la tarjeta
const petals = [
  { left: "6%", delay: "0s", char: "✿", size: "text-2xl", color: "text-rose/40" },
  { left: "18%", delay: "1.4s", char: "♥", size: "text-lg", color: "text-lilac/40" },
  { left: "32%", delay: "0.6s", char: "❀", size: "text-xl", color: "text-terracotta/40" },
  { left: "55%", delay: "2.2s", char: "♥", size: "text-2xl", color: "text-rose/30" },
  { left: "70%", delay: "0.9s", char: "✿", size: "text-lg", color: "text-lilac/50" },
  { left: "84%", delay: "1.8s", char: "❀", size: "text-2xl", color: "text-rose/40" },
  { left: "93%", delay: "3s", char: "♥", size: "text-base", color: "text-champagne" },
];

function OrderContent() {
  const id = useSearchParams().get("id") ?? "";
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  // Club Hanae Atelier: captura de datos para campañas y promociones
  const [birthday, setBirthday] = useState("");
  const [wantsPromos, setWantsPromos] = useState(true);
  const [clubStatus, setClubStatus] = useState<"idle" | "sending" | "done">(
    "idle"
  );

  useEffect(() => {
    api.getOrder(id).then(setOrder).catch(() => setError("Orden no encontrada"));
  }, [id]);

  const joinClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;
    setClubStatus("sending");
    try {
      await api.subscribeCustomer({
        email: order.customer.email,
        name: order.customer.name,
        phone: order.customer.phone,
        districtId: order.customer.districtId,
        birthday: birthday || undefined,
      });
      setClubStatus("done");
    } catch {
      setClubStatus("idle");
    }
  };

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center text-ink-soft">
        {error}
      </div>
    );
  }
  if (!order) return null;

  return (
    <div className="relative overflow-hidden">
      {/* pétalos animados de fondo */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        {petals.map((p, i) => (
          <span
            key={i}
            className={`animate-rise absolute bottom-0 select-none ${p.size} ${p.color}`}
            style={{ left: p.left, animationDelay: p.delay }}
          >
            {p.char}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="animate-fade-up rounded-3xl bg-surface/90 p-8 shadow-lg shadow-rose/10 ring-1 ring-sand backdrop-blur">
          <div className="text-center">
            <div className="animate-heartbeat mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blush to-lilac-soft text-3xl">
              {order.status === "paid" ? "🎀" : "⏳"}
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

          <div className="mt-6 rounded-2xl bg-cream p-4 text-sm text-ink-soft">
            <p className="font-semibold text-ink">Entrega</p>
            <p>{order.customer.name}</p>
            <p>{order.customer.address}</p>
            <p>{order.customer.phone}</p>
          </div>
        </div>

        {/* Club Hanae Atelier: cartera de clientes para campañas */}
        <div
          className="animate-fade-up mt-6 overflow-hidden rounded-3xl bg-gradient-to-br from-blush via-surface to-lilac-soft p-8 shadow-lg shadow-lilac/10 ring-1 ring-sand"
          style={{ animationDelay: "0.2s" }}
        >
          {clubStatus === "done" ? (
            <div className="py-4 text-center">
              <span className="text-4xl">💌</span>
              <h2 className="mt-3 font-display text-2xl font-bold">
                ¡Ya eres parte del club!
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                Te avisaremos primero de ofertas, novedades y sorpresas de
                cumpleaños.
              </p>
            </div>
          ) : (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-lilac">
                Club Hanae Atelier
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold">
                Un regalito antes de irte,{" "}
                <em className="text-gradient">{order.customer.name.split(" ")[0]}</em>
              </h2>
              <p className="mt-2 text-sm text-ink-soft">
                Únete al club y recibe promociones exclusivas, acceso anticipado
                a colecciones y una sorpresa en tu cumpleaños 🎁
              </p>

              <form onSubmit={joinClub} className="mt-5 space-y-4">
                <label className="block text-sm">
                  <span className="font-medium">
                    Tu cumpleaños{" "}
                    <span className="font-normal text-ink-soft">(opcional)</span>
                  </span>
                  <input
                    type="date"
                    value={birthday}
                    onChange={(e) => setBirthday(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-sand bg-surface px-4 py-2.5 outline-none transition focus:border-rose sm:w-60"
                  />
                </label>
                <label className="flex cursor-pointer items-start gap-2 text-sm text-ink-soft">
                  <input
                    type="checkbox"
                    checked={wantsPromos}
                    onChange={(e) => setWantsPromos(e.target.checked)}
                    className="mt-0.5 accent-rose"
                  />
                  Acepto recibir ofertas y novedades por email o WhatsApp al{" "}
                  {order.customer.phone}
                </label>
                <button
                  type="submit"
                  disabled={!wantsPromos || clubStatus === "sending"}
                  className="w-full rounded-full bg-gradient-to-r from-rose to-lilac py-3 font-semibold text-cream shadow-md shadow-rose/20 transition hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-8"
                >
                  {clubStatus === "sending" ? "Registrando..." : "Unirme al club ♥"}
                </button>
              </form>
            </>
          )}
        </div>

        <Link
          href="/"
          className="animate-fade-up mt-6 block rounded-full bg-surface py-3 text-center font-semibold text-rose ring-1 ring-rose/30 transition hover:bg-blush"
          style={{ animationDelay: "0.35s" }}
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense>
      <OrderContent />
    </Suspense>
  );
}
