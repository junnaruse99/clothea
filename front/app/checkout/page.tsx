"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { DeliveryQuote, District, Order, PaymentSession } from "@/lib/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();

  const [districts, setDistricts] = useState<District[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    districtId: "",
  });
  const [quote, setQuote] = useState<DeliveryQuote | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Estado del "gateway de pago" (mock para el MVP)
  const [payment, setPayment] = useState<{
    order: Order;
    session: PaymentSession;
  } | null>(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api.getDistricts().then(setDistricts).catch(() => {});
  }, []);

  // Cotiza el delivery cada vez que cambia el distrito
  useEffect(() => {
    if (!form.districtId) {
      setQuote(null);
      return;
    }
    api
      .quoteDelivery(form.districtId, subtotal)
      .then(setQuote)
      .catch(() => setQuote(null));
  }, [form.districtId, subtotal]);

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [field]: e.target.value });

  const total = subtotal + (quote?.fee ?? 0);
  const formReady =
    form.name.length >= 2 &&
    form.phone.length >= 6 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    form.address.length >= 5 &&
    form.districtId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { order, payment: session } = await api.createOrder({
        items: items.map((i) => ({
          productId: i.productId,
          size: i.size,
          quantity: i.quantity,
        })),
        customer: form,
      });
      setPayment({ order, session });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando la orden");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePay = async () => {
    if (!payment) return;
    setPaying(true);
    try {
      await api.payOrder(payment.order.id);
      clear();
      router.push(`/orden/${payment.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error procesando el pago");
      setPaying(false);
    }
  };

  if (items.length === 0 && !payment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-lg text-ink-soft">Tu carrito está vacío.</p>
        <Link href="/" className="mt-4 inline-block text-rose underline">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Finalizar compra</h1>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Datos de entrega */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-display text-xl font-semibold">
            Datos de entrega
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-medium">Nombre completo</span>
              <input
                value={form.name}
                onChange={set("name")}
                required
                className="mt-1 w-full rounded-xl border border-sand bg-white px-4 py-2.5 outline-none focus:border-rose"
              />
            </label>
            <label className="block text-sm">
              <span className="font-medium">Celular</span>
              <input
                value={form.phone}
                onChange={set("phone")}
                required
                placeholder="999 999 999"
                className="mt-1 w-full rounded-xl border border-sand bg-white px-4 py-2.5 outline-none focus:border-rose"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="font-medium">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={set("email")}
              required
              className="mt-1 w-full rounded-xl border border-sand bg-white px-4 py-2.5 outline-none focus:border-rose"
            />
          </label>
          <label className="block text-sm">
            <span className="font-medium">Distrito</span>
            <select
              value={form.districtId}
              onChange={set("districtId")}
              required
              className="mt-1 w-full rounded-xl border border-sand bg-white px-4 py-2.5 outline-none focus:border-rose"
            >
              <option value="">Elige tu distrito</option>
              {districts.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-medium">Dirección</span>
            <input
              value={form.address}
              onChange={set("address")}
              required
              placeholder="Av. Ejemplo 123, Dpto 201"
              className="mt-1 w-full rounded-xl border border-sand bg-white px-4 py-2.5 outline-none focus:border-rose"
            />
          </label>

          {quote && (
            <div className="rounded-xl bg-blush p-4 text-sm">
              <p>
                Delivery a <strong>{quote.districtName}</strong> (~
                {quote.distanceKm} km):{" "}
                <strong className="text-rose">
                  {quote.freeDelivery ? "¡Gratis!" : formatPrice(quote.fee)}
                </strong>
              </p>
              {quote.freeDelivery && (
                <p className="mt-1 text-ink-soft">
                  Por compras que superan el monto de envío gratis 🎉
                </p>
              )}
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-blush p-4 text-sm text-rose">{error}</p>
          )}

          <button
            type="submit"
            disabled={!formReady || submitting}
            className="w-full rounded-xl bg-rose py-3 font-semibold text-white transition hover:bg-rose-dark disabled:cursor-not-allowed disabled:bg-sand disabled:text-ink-soft"
          >
            {submitting ? "Procesando..." : `Pagar ${formatPrice(total)}`}
          </button>
        </form>

        {/* Resumen */}
        <aside className="h-fit rounded-2xl bg-white p-6 shadow-sm ring-1 ring-sand">
          <h2 className="font-display text-xl font-semibold">Resumen</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {items.map((i) => (
              <li
                key={`${i.productId}-${i.size}`}
                className="flex justify-between gap-2"
              >
                <span className="text-ink-soft">
                  {i.name} · {i.size} × {i.quantity}
                </span>
                <span className="font-medium">
                  {formatPrice(i.unitPrice * i.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-sand pt-4 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery</span>
              <span>
                {quote
                  ? quote.freeDelivery
                    ? "Gratis"
                    : formatPrice(quote.fee)
                  : "—"}
              </span>
            </div>
            <div className="flex justify-between border-t border-sand pt-2 text-base font-bold">
              <span>Total</span>
              <span className="text-rose">{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal del gateway de pago (mock; reemplazar por Culqi/MercadoPago) */}
      {payment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-soft">
              Pasarela de pago · demo
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold">
              Pagar {formatPrice(payment.order.total)}
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Orden {payment.session.paymentId} · En producción aquí se abre
              Culqi o MercadoPago.
            </p>

            <div className="mt-5 space-y-3">
              <input
                disabled
                value="4111 1111 1111 1111"
                className="w-full rounded-xl border border-sand bg-cream px-4 py-2.5 text-sm text-ink-soft"
              />
              <div className="flex gap-3">
                <input
                  disabled
                  value="12/28"
                  className="w-1/2 rounded-xl border border-sand bg-cream px-4 py-2.5 text-sm text-ink-soft"
                />
                <input
                  disabled
                  value="123"
                  className="w-1/2 rounded-xl border border-sand bg-cream px-4 py-2.5 text-sm text-ink-soft"
                />
              </div>
            </div>

            <button
              onClick={handlePay}
              disabled={paying}
              className="mt-5 w-full rounded-xl bg-rose py-3 font-semibold text-white transition hover:bg-rose-dark disabled:bg-sand disabled:text-ink-soft"
            >
              {paying ? "Confirmando..." : "Confirmar pago"}
            </button>
            <button
              onClick={() => setPayment(null)}
              disabled={paying}
              className="mt-2 w-full rounded-xl py-2 text-sm text-ink-soft hover:text-rose"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
