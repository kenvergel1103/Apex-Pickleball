"use client";

import Image from "next/image";
import type { AdminProduct } from "./ProductsTable";
import { useState, type FormEvent } from "react";

export default function ProductEditForm({
  product,
}: {
  product: AdminProduct;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [updatedAt, setUpdatedAt] = useState(product.updated_at);

  async function saveProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSaved(false);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch(
        `/api/admin/products/${encodeURIComponent(product.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            price: Number(formData.get("price")),
            stock: Number(formData.get("stock")),
            active: formData.get("active") === "on",
            expectedUpdatedAt: updatedAt,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not save product changes.");
      }

      setUpdatedAt(result.product.updated_at);
      setSaved(true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save product changes.",
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <form
      onSubmit={saveProduct}
      className="space-y-6 rounded-2xl border border-white/10 bg-surface p-6"
    >
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="flex size-20 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-background p-3">
          <Image
            src={product.image}
            alt=""
            width={56}
            height={56}
            className="size-14 object-contain"
          />
        </div>

        <div className="min-w-0">
          <h2 className="font-display text-xl font-semibold">{product.name}</h2>
          <p className="mt-1 text-sm text-muted">{product.category}</p>
          <p className="mt-2 break-all text-xs text-muted">
            Product ID: {product.id}
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium">Price (PHP)</span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product.price.toFixed(2)}
            required
            className="mt-2 block w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Stock quantity</span>
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            defaultValue={product.stock}
            required
            className="mt-2 block w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>
      </div>
      <fieldset className="rounded-xl border border-white/10 p-4">
        <legend className="px-2 text-sm font-medium">
          Storefront visibility
        </legend>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            name="active"
            type="checkbox"
            defaultChecked={product.active}
            className="mt-1 size-4 accent-accent"
          />
          <span>
            <span className="block text-sm font-medium">
              Show product in the storefront
            </span>
            <span className="mt-1 block text-xs leading-5 text-muted">
              Inactive products remain in the admin catalog. Stock availability
              is managed separately.
            </span>
          </span>
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-5">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-rose-300">
          {error}
        </p>
      )}
      {saved && (
        <p role="status" className="text-sm text-accent">
          Changes saved.
        </p>
      )}
    </form>
  );
}
