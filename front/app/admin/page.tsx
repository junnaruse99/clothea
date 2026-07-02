"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi, api, imgUrl } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Category, Product } from "@/lib/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.getProducts(), api.getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Eliminar "${product.name}"? Esta acción no se puede deshacer.`)) return;
    await adminApi.deleteProduct(product.id);
    load();
  };

  const categoryName = (id: string) =>
    categories.find((c) => c.id === id)?.name ?? id;

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-soft">
          {products.length} producto{products.length !== 1 && "s"}
        </p>
        <Link
          href="/admin/productos/nuevo"
          className="rounded-xl bg-rose px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-dark"
        >
          + Nuevo producto
        </Link>
      </div>

      {loading ? (
        <p className="mt-8 text-ink-soft">Cargando...</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm ring-1 ring-sand">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-sand text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Oferta</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const stock = p.variants.reduce((s, v) => s + v.quantity, 0);
                return (
                  <tr key={p.id} className="border-b border-sand/60 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.photos[0] && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imgUrl(p.photos[0])}
                            alt=""
                            className="h-12 w-10 rounded-lg object-cover"
                          />
                        )}
                        <span className="font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ink-soft">{p.code}</td>
                    <td className="px-4 py-3 text-ink-soft">
                      {categoryName(p.categoryId)}
                    </td>
                    <td className="px-4 py-3">{formatPrice(p.price)}</td>
                    <td className="px-4 py-3">
                      {p.salePrice !== null ? (
                        <span className="font-semibold text-terracotta">
                          {formatPrice(p.salePrice)}
                        </span>
                      ) : (
                        <span className="text-ink-soft">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={stock === 0 ? "font-semibold text-rose" : ""}>
                        {stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.active
                            ? "bg-blush text-rose"
                            : "bg-sand text-ink-soft"
                        }`}
                      >
                        {p.active ? "Activo" : "Oculto"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-3">
                        <Link
                          href={`/admin/productos/editar?id=${p.id}`}
                          className="text-rose hover:underline"
                        >
                          Editar
                        </Link>
                        <button
                          onClick={() => handleDelete(p)}
                          className="text-ink-soft hover:text-rose"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
