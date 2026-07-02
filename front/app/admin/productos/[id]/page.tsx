"use client";

import { use } from "react";
import { ProductForm } from "@/components/ProductForm";

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold">Editar producto</h2>
      <ProductForm productId={id} />
    </div>
  );
}
