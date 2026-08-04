"use client";

import { useEffect, useState, type ReactNode } from "react";
import { adminApi, clearAdminKey, DEMO, getAdminKey, setAdminKey } from "@/lib/api";

/**
 * Puerta de acceso al panel admin del MVP: pide la clave (ADMIN_KEY del
 * backend) y la guarda en localStorage. Al crecer, migrar a Supabase Auth.
 */
export function AdminGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<"checking" | "locked" | "open">("checking");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const verify = async () => {
    try {
      await adminApi.getDeliveryConfig();
      setStatus("open");
    } catch {
      clearAdminKey();
      setStatus("locked");
    }
  };

  useEffect(() => {
    if (getAdminKey()) {
      verify();
    } else {
      setStatus("locked");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdminKey(input.trim());
    try {
      await adminApi.getDeliveryConfig();
      setStatus("open");
    } catch {
      clearAdminKey();
      setError("Clave incorrecta o backend no disponible");
    }
  };

  if (status === "checking") return null;

  if (status === "locked") {
    return (
      <div className="mx-auto max-w-sm px-4 py-24">
        <h1 className="text-center font-display text-3xl font-bold">
          Panel de administración
        </h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Clave de administrador"
            className="w-full rounded-xl border border-sand bg-surface px-4 py-3 outline-none focus:border-rose"
          />
          {error && <p className="text-sm text-rose">{error}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-rose py-3 font-semibold text-cream transition hover:bg-rose-dark"
          >
            Ingresar
          </button>
          <p className="text-center text-xs text-ink-soft">
            {DEMO ? (
              <>Versión demo: cualquier clave funciona ✿</>
            ) : (
              <>
                La clave por defecto en desarrollo es{" "}
                <code className="rounded bg-sand px-1">clothea-admin</code>
              </>
            )}
          </p>
        </form>
      </div>
    );
  }

  return <>{children}</>;
}
