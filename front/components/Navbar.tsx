"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export function Navbar() {
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-sand/70 bg-cream/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold tracking-wide transition group-hover:text-rose">
            Hey Hey!
          </span>
          <span className="text-rose transition group-hover:rotate-12">✿</span>
          <span className="hidden text-[11px] font-medium uppercase tracking-[0.3em] text-ink-soft sm:inline">
            Lima · Perú
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/"
            className="hidden text-ink-soft transition hover:text-rose sm:block"
          >
            Tienda
          </Link>
          <Link href="/nosotros" className="text-ink-soft transition hover:text-rose">
            Nosotros
          </Link>
          <Link
            href="/carrito"
            className="relative flex items-center gap-2 rounded-full bg-gradient-to-r from-rose to-lilac px-4 py-2 font-medium text-white shadow-md shadow-rose/20 transition hover:scale-105 hover:shadow-lg hover:shadow-rose/30 active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6L5 3H2" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="17" cy="20" r="1.5" />
            </svg>
            <span className="hidden sm:inline">Carrito</span>
            {count > 0 && (
              <span
                key={count}
                className="animate-pop absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-xs font-bold text-white"
              >
                {count}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
