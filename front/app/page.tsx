"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { api } from "@/lib/api";
import { Category, Product } from "@/lib/types";

const marqueeItems = [
  "Envíos a toda Lima",
  "Nueva colección",
  "Moda asequible",
  "Cambios fáciles",
  "Algodón pima peruano",
  "Hecho con amor",
];

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [onlySale, setOnlySale] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    const timer = setTimeout(() => {
      api
        .getProducts({
          category: selected || undefined,
          sale: onlySale || undefined,
          search: search || undefined,
        })
        .then(setProducts)
        .catch(() =>
          setError(
            "No pudimos cargar los productos. ¿Está corriendo el backend en el puerto 4000?"
          )
        )
        .finally(() => setLoading(false));
    }, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [selected, onlySale, search]);

  const categoryButton = (slug: string, label: string) => (
    <button
      key={slug || "todo"}
      onClick={() => setSelected(slug)}
      className={`block w-full rounded-2xl px-4 py-2.5 text-left text-sm transition-all duration-300 ${
        selected === slug
          ? "translate-x-1 bg-gradient-to-r from-rose to-terracotta font-semibold text-white shadow-md shadow-rose/20"
          : "text-ink-soft hover:translate-x-1 hover:bg-blush hover:text-rose"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blush via-cream to-lilac-soft" />
        {/* manchas de color flotando */}
        <div className="animate-blob absolute -left-24 -top-24 h-96 w-96 rounded-full bg-rose/15 blur-3xl" />
        <div className="animate-blob-slow absolute -right-20 top-10 h-80 w-80 rounded-full bg-lilac/20 blur-3xl" />
        <div className="animate-blob absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-champagne/20 blur-3xl" />
        {/* destellos */}
        <span className="animate-twinkle absolute left-[12%] top-16 text-2xl text-rose/60 select-none">✦</span>
        <span className="animate-twinkle absolute right-[18%] top-24 text-lg text-lilac/70 select-none" style={{ animationDelay: "1s" }}>✦</span>
        <span className="animate-twinkle absolute bottom-16 right-[10%] text-xl text-champagne select-none" style={{ animationDelay: "2s" }}>✦</span>
        <span className="animate-float absolute right-[28%] bottom-10 text-3xl text-rose/40 select-none">✿</span>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
            Nueva colección · Lima
          </p>
          <h1
            className="animate-fade-up mt-4 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-6xl"
            style={{ animationDelay: "0.15s" }}
          >
            Moda que te encanta,{" "}
            <span className="relative inline-block">
              <em className="text-gradient">a precios que también</em>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 320 12"
                fill="none"
                aria-hidden
              >
                <path
                  d="M4 8.5C60 3.5 180 2 316 7"
                  stroke="#c08497"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="animate-draw"
                />
              </svg>
            </span>
          </h1>
          <p
            className="animate-fade-up mt-6 max-w-xl text-lg text-ink-soft"
            style={{ animationDelay: "0.3s" }}
          >
            Ropa femenina linda, cómoda y asequible con delivery a todos los
            distritos de Lima.
          </p>
          <div
            className="animate-fade-up mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "0.45s" }}
          >
            <a
              href="#catalogo"
              className="rounded-full bg-gradient-to-r from-rose to-lilac px-7 py-3 font-semibold text-white shadow-lg shadow-rose/25 transition hover:scale-105 hover:shadow-xl hover:shadow-rose/30 active:scale-95"
            >
              Ver colección
            </a>
            <button
              onClick={() => {
                setOnlySale(true);
                document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
              }}
              className="rounded-full bg-white/80 px-7 py-3 font-semibold text-rose ring-1 ring-rose/30 backdrop-blur transition hover:scale-105 hover:bg-white active:scale-95"
            >
              ♥ Solo ofertas
            </button>
          </div>
        </div>
      </section>

      {/* Cinta marquee */}
      <div className="overflow-hidden border-y border-sand bg-white/60 py-3 backdrop-blur">
        <div className="animate-marquee flex w-max gap-10">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.25em] text-ink-soft"
            >
              {item} <span className="text-rose">✿</span>
            </span>
          ))}
        </div>
      </div>

      <div
        id="catalogo"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-10 sm:px-6 lg:flex lg:gap-8"
      >
        {/* Sidebar de categorías (columna en desktop, chips en móvil) */}
        <aside className="lg:w-56 lg:shrink-0">
          <h2 className="mb-3 hidden font-display text-lg font-semibold lg:block">
            Categorías
          </h2>

          {/* Desktop */}
          <div className="hidden space-y-1 lg:block">
            {categoryButton("", "Todo")}
            {categories.map((c) => categoryButton(c.slug, c.name))}
            <div className="my-4 border-t border-sand" />
            <label className="flex cursor-pointer items-center gap-2 px-4 text-sm text-ink-soft transition hover:text-rose">
              <input
                type="checkbox"
                checked={onlySale}
                onChange={(e) => setOnlySale(e.target.checked)}
                className="accent-rose"
              />
              Solo ofertas
            </label>
          </div>

          {/* Móvil */}
          <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 lg:hidden">
            {["", ...categories.map((c) => c.slug)].map((slug) => {
              const label = slug
                ? categories.find((c) => c.slug === slug)?.name ?? slug
                : "Todo";
              return (
                <button
                  key={slug || "todo"}
                  onClick={() => setSelected(slug)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-all ${
                    selected === slug
                      ? "bg-gradient-to-r from-rose to-terracotta font-semibold text-white shadow-md shadow-rose/20"
                      : "bg-white text-ink-soft ring-1 ring-sand"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <button
              onClick={() => setOnlySale(!onlySale)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition-all ${
                onlySale
                  ? "bg-lilac font-semibold text-white shadow-md shadow-lilac/20"
                  : "bg-white text-ink-soft ring-1 ring-sand"
              }`}
            >
              ♥ Ofertas
            </button>
          </div>
        </aside>

        {/* Grid de productos */}
        <section className="mt-4 flex-1 lg:mt-0">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-2xl font-semibold">
              {selected
                ? categories.find((c) => c.slug === selected)?.name
                : "Todos los productos"}
            </h2>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar prendas..."
              className="w-full rounded-full border border-sand bg-white px-4 py-2 text-sm outline-none transition focus:border-rose focus:shadow-md focus:shadow-rose/10 sm:w-64"
            />
          </div>

          {error && (
            <p className="rounded-2xl bg-blush p-4 text-sm text-rose">{error}</p>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton aspect-[3/4] rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {products.map((p, i) => (
                <Reveal key={p.id} delay={(i % 3) * 90}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="py-12 text-center text-ink-soft">
              No encontramos productos con esos filtros ✿
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
