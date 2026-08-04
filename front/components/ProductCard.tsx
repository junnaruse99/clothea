import Link from "next/link";
import { imgUrl } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const onSale = product.salePrice !== null;
  const stock = product.variants.reduce((s, v) => s + v.quantity, 0);

  return (
    <Link
      href={`/producto?id=${product.id}`}
      className="group overflow-hidden rounded-3xl bg-surface shadow-sm ring-1 ring-sand transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-rose/10 hover:ring-rose/30"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-blush">
        {product.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgUrl(product.photos[0])}
            alt={product.name}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft">
            Sin foto
          </div>
        )}
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-rose shadow-sm backdrop-blur">
            ♥ Oferta
          </span>
        )}
        {stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-ink/85 px-3 py-1 text-[11px] font-bold text-cream backdrop-blur">
            Agotado
          </span>
        )}
        {/* Cinta "ver detalle" que sube al hacer hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/60 to-transparent p-4 pt-10 text-center text-sm font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
          Ver detalle →
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold leading-tight transition group-hover:text-rose">
          {product.name}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
          {product.color}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-rose-dark">
            {formatPrice(product.salePrice ?? product.price)}
          </span>
          {onSale && (
            <span className="text-sm text-ink-soft line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
