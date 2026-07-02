"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import { api, imgUrl } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { Product } from "@/lib/types";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState("");
  const [photoIdx, setPhotoIdx] = useState(0);
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    api
      .getProduct(id)
      .then((p) => {
        setProduct(p);
        const firstAvailable = p.variants.find((v) => v.quantity > 0);
        if (firstAvailable) setSize(firstAvailable.size);
      })
      .catch(() => setError("Producto no encontrado"));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-lg text-ink-soft">{error}</p>
        <Link href="/" className="mt-4 inline-block text-rose underline">
          Volver a la tienda
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <div className="aspect-[3/4] max-w-md animate-pulse rounded-2xl bg-sand" />
      </div>
    );
  }

  const onSale = product.salePrice !== null;
  const variant = product.variants.find((v) => v.size === size);
  const maxQty = variant?.quantity ?? 0;

  const handleAdd = () => {
    if (!variant || maxQty === 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      photo: product.photos[0] ?? "",
      size,
      quantity,
      unitPrice: product.salePrice ?? product.price,
      maxQuantity: maxQty,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link href="/" className="text-sm text-ink-soft hover:text-rose">
        ← Volver a la tienda
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        {/* Galería */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-sand ring-1 ring-sand">
            {product.photos[photoIdx] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgUrl(product.photos[photoIdx])}
                alt={product.name}
                className="aspect-[3/4] w-full object-cover"
              />
            )}
          </div>
          {product.photos.length > 1 && (
            <div className="mt-3 flex gap-2">
              {product.photos.map((photo, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={photo}
                  src={imgUrl(photo)}
                  alt=""
                  onClick={() => setPhotoIdx(i)}
                  className={`h-20 w-16 cursor-pointer rounded-lg object-cover ring-2 transition ${
                    i === photoIdx ? "ring-rose" : "ring-transparent"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Información */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink-soft">
            {product.code}
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-rose">
              {formatPrice(product.salePrice ?? product.price)}
            </span>
            {onSale && (
              <>
                <span className="text-lg text-ink-soft line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="rounded-full bg-terracotta px-3 py-1 text-xs font-bold uppercase text-white">
                  Oferta
                </span>
              </>
            )}
          </div>

          <p className="mt-4 leading-relaxed text-ink-soft">
            {product.description}
          </p>

          <p className="mt-4 text-sm">
            <span className="font-semibold">Color:</span>{" "}
            <span className="text-ink-soft">{product.color}</span>
          </p>

          {/* Tallas */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold">Talla</p>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.size}
                  disabled={v.quantity === 0}
                  onClick={() => {
                    setSize(v.size);
                    setQuantity(1);
                  }}
                  className={`min-w-12 rounded-xl px-4 py-2 text-sm font-medium transition ${
                    v.quantity === 0
                      ? "cursor-not-allowed bg-sand text-ink-soft/50 line-through"
                      : size === v.size
                        ? "bg-rose text-white shadow"
                        : "bg-white text-ink ring-1 ring-sand hover:ring-rose"
                  }`}
                >
                  {v.size}
                </button>
              ))}
            </div>
            {variant && (
              <p className="mt-2 text-xs text-ink-soft">
                {maxQty > 0
                  ? `${maxQty} disponibles`
                  : "Sin stock en esta talla"}
              </p>
            )}
          </div>

          {/* Cantidad + agregar */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-xl bg-white ring-1 ring-sand">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2.5 text-lg text-ink-soft hover:text-rose"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(maxQty, quantity + 1))}
                className="px-4 py-2.5 text-lg text-ink-soft hover:text-rose"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={maxQty === 0}
              className="flex-1 rounded-xl bg-rose px-6 py-3 font-semibold text-white shadow transition hover:bg-rose-dark disabled:cursor-not-allowed disabled:bg-sand disabled:text-ink-soft"
            >
              {added ? "✓ Agregado al carrito" : "Agregar al carrito"}
            </button>
          </div>

          <Link
            href="/carrito"
            className="mt-4 inline-block text-sm text-rose underline"
          >
            Ver carrito →
          </Link>
        </div>
      </div>
    </div>
  );
}
