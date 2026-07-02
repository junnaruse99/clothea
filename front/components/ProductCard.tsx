import Link from "next/link";
import { imgUrl } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Product } from "@/lib/types";

export function ProductCard({ product }: { product: Product }) {
  const onSale = product.salePrice !== null;
  const stock = product.variants.reduce((s, v) => s + v.quantity, 0);

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-sand transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
        {product.photos[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgUrl(product.photos[0])}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-ink-soft">
            Sin foto
          </div>
        )}
        {onSale && (
          <span className="absolute left-3 top-3 rounded-full bg-terracotta px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
            Oferta
          </span>
        )}
        {stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-ink px-3 py-1 text-xs font-bold text-white">
            Agotado
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold leading-tight">
          {product.name}
        </h3>
        <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
          {product.color}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-rose">
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
