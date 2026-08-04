"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { imgUrl } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Tu carrito está vacío</h1>
        <p className="mt-3 text-ink-soft">
          Descubre nuestras prendas y encuentra tu próximo outfit favorito.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-rose px-6 py-3 font-semibold text-cream transition hover:bg-rose-dark"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold">Tu carrito</h1>

      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="flex gap-4 rounded-2xl bg-surface p-4 shadow-sm ring-1 ring-sand"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imgUrl(item.photo)}
              alt={item.name}
              className="h-24 w-20 rounded-xl object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Link
                    href={`/producto?id=${item.productId}`}
                    className="font-display font-semibold hover:text-rose"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-ink-soft">Talla {item.size}</p>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.size)}
                  className="text-sm text-ink-soft hover:text-rose"
                  aria-label="Quitar"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-lg bg-cream ring-1 ring-sand">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity - 1)
                    }
                    className="px-3 py-1 text-ink-soft hover:text-rose"
                  >
                    −
                  </button>
                  <span className="w-7 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.size, item.quantity + 1)
                    }
                    className="px-3 py-1 text-ink-soft hover:text-rose"
                  >
                    +
                  </button>
                </div>
                <p className="font-bold text-rose">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-sand">
        <div className="flex items-center justify-between text-lg">
          <span>Subtotal</span>
          <span className="font-bold">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-1 text-sm text-ink-soft">
          El costo de delivery se calcula en el checkout según tu distrito.
        </p>
        <Link
          href="/checkout"
          className="mt-4 block rounded-xl bg-rose py-3 text-center font-semibold text-cream transition hover:bg-rose-dark"
        >
          Continuar con la compra
        </Link>
      </div>
    </div>
  );
}
