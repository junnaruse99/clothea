"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AdminGate } from "@/components/AdminGate";
import { clearAdminKey } from "@/lib/api";

const links = [
  { href: "/admin", label: "Productos" },
  { href: "/admin/envios", label: "Delivery" },
  { href: "/admin/ordenes", label: "Órdenes" },
  { href: "/admin/clientes", label: "Clientes" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AdminGate>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-2xl font-bold">Administración</h1>
          <button
            onClick={() => {
              clearAdminKey();
              window.location.reload();
            }}
            className="text-sm text-ink-soft hover:text-rose"
          >
            Cerrar sesión
          </button>
        </div>
        <nav className="mt-4 flex gap-2 border-b border-sand pb-3">
          {links.map((l) => {
            const active =
              l.href === "/admin"
                ? pathname === "/admin" || pathname.startsWith("/admin/productos")
                : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-4 py-1.5 text-sm transition ${
                  active
                    ? "bg-rose font-semibold text-cream"
                    : "text-ink-soft hover:bg-blush"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-6">{children}</div>
      </div>
    </AdminGate>
  );
}
