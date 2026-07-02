"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { api } from "@/lib/api";
import { Category, Product } from "@/lib/types";

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
      className={`block w-full rounded-xl px-4 py-2.5 text-left text-sm transition ${
        selected === slug
          ? "bg-rose font-semibold text-white shadow"
          : "text-ink-soft hover:bg-blush hover:text-rose"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blush via-cream to-sand">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
            Nueva colección · Lima
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-tight sm:text-6xl">
            Moda que te encanta,{" "}
            <em className="text-rose">a precios que también</em>
          </h1>
          <p className="mt-4 max-w-xl text-ink-soft">
            Ropa femenina linda, cómoda y asequible con delivery a todos los
            distritos de Lima.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:flex lg:gap-8">
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
            <label className="flex cursor-pointer items-center gap-2 px-4 text-sm text-ink-soft">
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
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                    selected === slug
                      ? "bg-rose font-semibold text-white"
                      : "bg-white text-ink-soft ring-1 ring-sand"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <button
              onClick={() => setOnlySale(!onlySale)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                onlySale
                  ? "bg-terracotta font-semibold text-white"
                  : "bg-white text-ink-soft ring-1 ring-sand"
              }`}
            >
              % Ofertas
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
              className="w-full rounded-full border border-sand bg-white px-4 py-2 text-sm outline-none transition focus:border-rose sm:w-64"
            />
          </div>

          {error && (
            <p className="rounded-xl bg-blush p-4 text-sm text-rose">{error}</p>
          )}

          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-2xl bg-sand"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="py-12 text-center text-ink-soft">
              No encontramos productos con esos filtros.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
