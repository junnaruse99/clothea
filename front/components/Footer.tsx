"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle"
  );

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.subscribeCustomer({ email });
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <footer className="mt-20 border-t border-sand bg-gradient-to-b from-blush/60 to-lilac-soft/60">
      {/* Club Clothea */}
      <div className="mx-auto max-w-7xl px-4 pt-12 sm:px-6">
        <div className="rounded-3xl bg-white/70 p-8 text-center shadow-sm ring-1 ring-sand backdrop-blur sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-lilac">
            Club Clothea
          </p>
          <h3 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
            Ofertas y novedades, <em className="text-gradient">antes que nadie</em>
          </h3>
          {status === "done" ? (
            <p className="mt-4 text-rose">
              ¡Lista! Ya eres parte del club 💌
            </p>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mx-auto mt-5 flex max-w-md gap-2"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full rounded-full border border-sand bg-white px-5 py-2.5 text-sm outline-none transition focus:border-rose"
              />
              <button
                type="submit"
                disabled={status === "sending"}
                className="whitespace-nowrap rounded-full bg-gradient-to-r from-rose to-lilac px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose/20 transition hover:scale-105 disabled:opacity-60"
              >
                {status === "sending" ? "..." : "Unirme"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="mt-2 text-xs text-rose">
              No pudimos registrarte, inténtalo de nuevo.
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-xl font-bold">
            Clothea <span className="text-rose">✿</span>
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            Moda femenina asequible, con amor desde Lima, Perú.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Enlaces</p>
          <ul className="mt-2 space-y-1 text-ink-soft">
            <li>
              <Link href="/" className="transition hover:text-rose">Tienda</Link>
            </li>
            <li>
              <Link href="/nosotros" className="transition hover:text-rose">Nosotros</Link>
            </li>
            <li>
              <Link href="/carrito" className="transition hover:text-rose">Carrito</Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Contacto</p>
          <ul className="mt-2 space-y-1 text-ink-soft">
            <li>Lima, Perú</li>
            <li>hola@clothea.pe</li>
            <li>+51 999 999 999</li>
          </ul>
        </div>
      </div>
      <p className="pb-6 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} Clothea · Hecho con ♥ en Lima
      </p>
    </footer>
  );
}
