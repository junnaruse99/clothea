"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ProductForm } from "@/components/ProductForm";

function EditProductContent() {
  const id = useSearchParams().get("id") ?? "";
  return (
    <div>
      <h2 className="mb-6 font-display text-xl font-semibold">Editar producto</h2>
      <ProductForm productId={id} />
    </div>
  );
}

export default function EditProductPage() {
  return (
    <Suspense>
      <EditProductContent />
    </Suspense>
  );
}
