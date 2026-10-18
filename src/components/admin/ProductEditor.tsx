"use client";

import { useEffect, useState } from "react";
import type { AdminProduct } from "./ProductsTable";
import ProductEditForm from "./ProductEditForm";

export default function ProductEditor({ productId }: { productId: string }) {
  const [product, setProduct] = useState<AdminProduct | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        const response = await fetch(
          `/api/admin/products/${encodeURIComponent(productId)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Product not found."
              : "Could not load product.",
          );
        }

        const data = await response.json();
        if (active) setProduct(data.product);
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error ? error.message : "Could not load product.",
          );
        }
      }
    }

    loadProduct();

    return () => {
      active = false;
    };
  }, [productId]);

  if (error) {
    return (
      <p role="alert" className="p-6 text-sm text-rose-300">
        {error}
      </p>
    );
  }

  if (!product) {
    return <p className="p-6 text-sm text-muted">Loading product...</p>;
  }

  return <ProductEditForm key={product.id} product={product} />;
}
