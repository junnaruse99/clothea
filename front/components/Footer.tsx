import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-sand bg-sand/50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6">
        <div>
          <p className="font-display text-xl font-bold">Clothea</p>
          <p className="mt-2 text-sm text-ink-soft">
            Moda femenina asequible, con amor desde Lima, Perú.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Enlaces</p>
          <ul className="mt-2 space-y-1 text-ink-soft">
            <li>
              <Link href="/" className="hover:text-rose">Tienda</Link>
            </li>
            <li>
              <Link href="/nosotros" className="hover:text-rose">Nosotros</Link>
            </li>
            <li>
              <Link href="/carrito" className="hover:text-rose">Carrito</Link>
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
        © {new Date().getFullYear()} Clothea · Hecho en Lima
      </p>
    </footer>
  );
}
