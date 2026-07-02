"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export function Navbar() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-sand bg-cream/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="font-display text-2xl font-bold tracking-wide">
          Clothea
          <span className="ml-2 hidden text-xs font-normal uppercase tracking-[0.3em] text-ink-soft sm:inline">
            Lima · Perú
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link href="/" className="hidden text-ink-soft transition hover:text-rose sm:block">
            Tienda
          </Link>
          <Link href="/nosotros" className="text-ink-soft transition hover:text-rose">
            Nosotros
          </Link>
          <Link
            href="/carrito"
            className="relative flex items-center gap-2 rounded-full bg-rose px-4 py-2 font-medium text-white transition hover:bg-rose-dark"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6L5 3H2" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
            </svg>
            <span className="hidden sm:inline">Carrito</span>
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-xs font-bold">
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
