"use client";

import { useEffect, useState } from "react";
import { adminApi, api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { DeliveryConfig, District } from "@/lib/types";

// Réplica del algoritmo del backend para previsualizar tarifas en vivo
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function AdminDeliveryPage() {
  const [cfg, setCfg] = useState<DeliveryConfig | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi.getDeliveryConfig().then(setCfg).catch(() => {});
    api.getDistricts().then(setDistricts).catch(() => {});
  }, []);

  if (!cfg) return <p className="text-ink-soft">Cargando...</p>;

  const setNum = (field: keyof DeliveryConfig) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCfg({ ...cfg, [field]: parseFloat(e.target.value) || 0 });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await adminApi.updateDeliveryConfig(cfg);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error guardando");
    }
  };

  const input =
    "mt-1 w-full rounded-xl border border-sand bg-surface px-4 py-2.5 text-sm outline-none focus:border-rose";

  const fields: { key: keyof DeliveryConfig; label: string; hint: string }[] = [
    { key: "originLat", label: "Latitud de la tienda", hint: "Punto de partida del delivery" },
    { key: "originLng", label: "Longitud de la tienda", hint: "" },
    { key: "baseFee", label: "Tarifa base (S/)", hint: "Costo fijo por pedido" },
    { key: "perKmFee", label: "Costo por km (S/)", hint: "Se multiplica por la distancia" },
    { key: "minFee", label: "Tarifa mínima (S/)", hint: "El envío nunca cuesta menos que esto" },
    { key: "freeThreshold", label: "Envío gratis desde (S/)", hint: "0 = nunca es gratis" },
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={handleSave} className="space-y-4">
        <h2 className="font-display text-xl font-semibold">
          Algoritmo de delivery
        </h2>
        <p className="text-sm text-ink-soft">
          El costo se calcula como{" "}
          <code className="rounded bg-sand px-1 text-xs">
            max(mínima, base + km × distancia) + recargo del distrito
          </code>{" "}
          usando la distancia en línea recta desde la tienda al distrito.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => (
            <label key={f.key} className="block text-sm">
              <span className="font-medium">{f.label}</span>
              <input
                type="number"
                step="any"
                value={cfg[f.key]}
                onChange={setNum(f.key)}
                className={input}
              />
              {f.hint && <span className="text-xs text-ink-soft">{f.hint}</span>}
            </label>
          ))}
        </div>

        {error && (
          <p className="rounded-xl bg-blush p-4 text-sm text-rose">{error}</p>
        )}

        <button
          type="submit"
          className="rounded-xl bg-rose px-6 py-3 font-semibold text-cream transition hover:bg-rose-dark"
        >
          {saved ? "✓ Guardado" : "Guardar configuración"}
        </button>
      </form>

      <div>
        <h2 className="font-display text-xl font-semibold">
          Vista previa de tarifas
        </h2>
        <div className="mt-4 max-h-[480px] overflow-y-auto rounded-2xl bg-surface shadow-sm ring-1 ring-sand">
          <table className="w-full text-left text-sm">
            <thead className="sticky top-0 border-b border-sand bg-surface text-xs uppercase tracking-wide text-ink-soft">
              <tr>
                <th className="px-4 py-3">Distrito</th>
                <th className="px-4 py-3">Distancia</th>
                <th className="px-4 py-3">Tarifa</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((d) => {
                const km = haversineKm(cfg.originLat, cfg.originLng, d.lat, d.lng);
                const fee =
                  Math.round(
                    (Math.max(cfg.minFee, cfg.baseFee + cfg.perKmFee * km) +
                      d.surcharge) *
                      10
                  ) / 10;
                return (
                  <tr key={d.id} className="border-b border-sand/60 last:border-0">
                    <td className="px-4 py-2.5">{d.name}</td>
                    <td className="px-4 py-2.5 text-ink-soft">
                      {km.toFixed(1)} km
                    </td>
                    <td className="px-4 py-2.5 font-medium">{formatPrice(fee)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
