"use client";

import { useEffect, useState } from "react";
import { adminApi, api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { Customer, District } from "@/lib/types";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getCustomers(), api.getDistricts()])
      .then(([c, d]) => {
        setCustomers(c);
        setDistricts(d);
      })
      .finally(() => setLoading(false));
  }, []);

  const districtName = (id: string | null) =>
    districts.find((d) => d.id === id)?.name ?? "—";

  const optIns = customers.filter((c) => c.acceptsMarketing).length;

  const exportCsv = () => {
    const header = "nombre,email,telefono,distrito,cumpleaños,acepta_marketing,compras,total_gastado";
    const rows = customers.map((c) =>
      [
        `"${c.name}"`,
        c.email,
        c.phone,
        `"${districtName(c.districtId)}"`,
        c.birthday ?? "",
        c.acceptsMarketing ? "si" : "no",
        c.ordersCount,
        c.totalSpent.toFixed(2),
      ].join(",")
    );
    const blob = new Blob([[header, ...rows].join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clientes-hanae-atelier.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="text-ink-soft">Cargando...</p>;

  if (customers.length === 0) {
    return (
      <p className="py-12 text-center text-ink-soft">
        Aún no hay clientes. Se registran automáticamente con cada compra y
        cuando se unen al Club Hanae Atelier
      </p>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          {customers.length} cliente{customers.length !== 1 && "s"} ·{" "}
          <span className="font-semibold text-rose">{optIns}</span> acepta
          {optIns === 1 ? "" : "n"} promociones
        </p>
        <button
          onClick={exportCsv}
          className="rounded-xl bg-surface px-4 py-2 text-sm font-semibold text-rose ring-1 ring-rose/30 transition hover:bg-blush"
        >
          Exportar CSV
        </button>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-surface shadow-sm ring-1 ring-sand">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="border-b border-sand text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Contacto</th>
              <th className="px-4 py-3">Distrito</th>
              <th className="px-4 py-3">Cumpleaños</th>
              <th className="px-4 py-3">Promos</th>
              <th className="px-4 py-3">Compras</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Última compra</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-sand/60 last:border-0">
                <td className="px-4 py-3 font-medium">{c.name || "—"}</td>
                <td className="px-4 py-3 text-ink-soft">
                  <div>{c.email}</div>
                  {c.phone && <div>{c.phone}</div>}
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {districtName(c.districtId)}
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {c.birthday ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      c.acceptsMarketing
                        ? "bg-blush text-rose"
                        : "bg-sand text-ink-soft"
                    }`}
                  >
                    {c.acceptsMarketing ? "♥ Sí" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">{c.ordersCount}</td>
                <td className="px-4 py-3 font-medium">
                  {formatPrice(c.totalSpent)}
                </td>
                <td className="px-4 py-3 text-ink-soft">
                  {c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
