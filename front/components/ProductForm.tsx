"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminApi, api, imgUrl } from "@/lib/api";
import { Category, Product, ProductVariant } from "@/lib/types";

interface Props {
  productId?: string; // undefined = crear nuevo
}

const empty = {
  code: "",
  name: "",
  description: "",
  categoryId: "",
  color: "",
  price: "",
  salePrice: "",
  onSale: false,
  active: true,
};

export function ProductForm({ productId }: Props) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(empty);
  const [variants, setVariants] = useState<ProductVariant[]>([
    { size: "S", quantity: 0 },
    { size: "M", quantity: 0 },
    { size: "L", quantity: 0 },
  ]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
    if (productId) {
      adminApi.getProduct(productId).then((p: Product) => {
        setForm({
          code: p.code,
          name: p.name,
          description: p.description,
          categoryId: p.categoryId,
          color: p.color,
          price: String(p.price),
          salePrice: p.salePrice !== null ? String(p.salePrice) : "",
          onSale: p.salePrice !== null,
          active: p.active,
        });
        setVariants(p.variants.length ? p.variants : []);
        setPhotos(p.photos);
      });
    }
  }, [productId]);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const paths = await adminApi.uploadPhotos(files);
      setPhotos((prev) => [...prev, ...paths]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error subiendo fotos");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const price = parseFloat(form.price);
    const salePrice = form.onSale ? parseFloat(form.salePrice) : null;
    if (isNaN(price) || price <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }
    if (form.onSale && (salePrice === null || isNaN(salePrice) || salePrice <= 0)) {
      setError("El precio de oferta debe ser mayor a 0");
      return;
    }
    if (form.onSale && salePrice !== null && salePrice >= price) {
      setError("El precio de oferta debe ser menor al precio regular");
      return;
    }
    setSaving(true);
    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      categoryId: form.categoryId,
      color: form.color.trim(),
      price,
      salePrice,
      photos,
      variants: variants.filter((v) => v.size.trim() !== ""),
      active: form.active,
    };
    try {
      if (productId) {
        await adminApi.updateProduct(productId, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error guardando");
      setSaving(false);
    }
  };

  const input =
    "mt-1 w-full rounded-xl border border-sand bg-white px-4 py-2.5 text-sm outline-none focus:border-rose";

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Código</span>
          <input
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            required
            placeholder="VE-003"
            className={input}
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Nombre</span>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className={input}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium">Descripción</span>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={3}
          className={input}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Categoría</span>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
            className={input}
          >
            <option value="">Elige una categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="font-medium">Color</span>
          <input
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            placeholder="Rosado pastel"
            className={input}
          />
        </label>
      </div>

      {/* Precios */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-sand">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium">Precio regular (S/)</span>
            <input
              type="number"
              step="0.10"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className={input}
            />
          </label>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.onSale}
                onChange={(e) => setForm({ ...form, onSale: e.target.checked })}
                className="accent-rose"
              />
              En oferta
            </label>
            {form.onSale && (
              <input
                type="number"
                step="0.10"
                min="0"
                value={form.salePrice}
                onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                placeholder="Precio de oferta (S/)"
                className={input}
              />
            )}
          </div>
        </div>
      </div>

      {/* Tallas y stock */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-sand">
        <p className="text-sm font-medium">Tallas y stock</p>
        <div className="mt-3 space-y-2">
          {variants.map((v, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={v.size}
                onChange={(e) =>
                  setVariants(
                    variants.map((x, j) =>
                      j === i ? { ...x, size: e.target.value } : x
                    )
                  )
                }
                placeholder="Talla (S, M, 28...)"
                className="w-36 rounded-xl border border-sand bg-cream px-3 py-2 text-sm outline-none focus:border-rose"
              />
              <input
                type="number"
                min="0"
                value={v.quantity}
                onChange={(e) =>
                  setVariants(
                    variants.map((x, j) =>
                      j === i
                        ? { ...x, quantity: parseInt(e.target.value) || 0 }
                        : x
                    )
                  )
                }
                className="w-28 rounded-xl border border-sand bg-cream px-3 py-2 text-sm outline-none focus:border-rose"
              />
              <button
                type="button"
                onClick={() => setVariants(variants.filter((_, j) => j !== i))}
                className="px-2 text-ink-soft hover:text-rose"
                aria-label="Quitar talla"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setVariants([...variants, { size: "", quantity: 0 }])}
          className="mt-3 text-sm text-rose hover:underline"
        >
          + Agregar talla
        </button>
      </div>

      {/* Fotos */}
      <div className="rounded-2xl bg-white p-5 ring-1 ring-sand">
        <p className="text-sm font-medium">Fotos</p>
        <p className="mt-1 text-xs text-ink-soft">
          Por ahora se guardan en el servidor (repo). Al crecer, migrar a S3 o
          Supabase Storage sin cambiar este formulario.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {photos.map((photo) => (
            <div key={photo} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl(photo)}
                alt=""
                className="h-28 w-22 rounded-xl object-cover ring-1 ring-sand"
              />
              <button
                type="button"
                onClick={() => setPhotos(photos.filter((p) => p !== photo))}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-xs text-white"
                aria-label="Quitar foto"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <label className="mt-3 inline-block cursor-pointer rounded-xl bg-blush px-4 py-2 text-sm font-medium text-rose transition hover:bg-rose hover:text-white">
          {uploading ? "Subiendo..." : "Subir fotos"}
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp,.svg"
            multiple
            onChange={(e) => handleUpload(e.target.files)}
            className="hidden"
          />
        </label>
      </div>

      <label className="flex items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
          className="accent-rose"
        />
        Visible en la tienda
      </label>

      {error && (
        <p className="rounded-xl bg-blush p-4 text-sm text-rose">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-rose px-6 py-3 font-semibold text-white transition hover:bg-rose-dark disabled:bg-sand disabled:text-ink-soft"
        >
          {saving ? "Guardando..." : productId ? "Guardar cambios" : "Crear producto"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-xl px-6 py-3 text-ink-soft hover:text-rose"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
