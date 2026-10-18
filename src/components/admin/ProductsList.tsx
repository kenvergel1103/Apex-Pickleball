"use client";

import { useEffect, useState } from "react";
import ProductsTable, { type AdminProduct } from "./ProductsTable";

type ProductsResponse = {
  products: AdminProduct[];
  totalProducts: number;
};

export default function ProductsList() {
  const [result, setResult] = useState<ProductsResponse | null>(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [stockFilter, setStockFilter] = useState("all");

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      try {
        const response = await fetch("/api/admin/products", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Could not load products.");
        }

        const data = await response.json();
        if (active) setResult(data);
      } catch {
        if (active) setError("Could not load products.");
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  if (error) {
    return (
      <p role="alert" className="p-6 text-sm text-rose-300">
        {error}
      </p>
    );
  }

  if (!result) {
    return <p className="p-6 text-sm text-muted">Loading products...</p>;
  }

  const query = search.trim().toLowerCase();

  const filteredProducts = result.products.filter((product) => {
    const matchesSearch = [product.name, product.category, product.id]
      .join(" ")
      .toLowerCase()
      .includes(query);

    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "available" && product.stock > 0) ||
      (stockFilter === "low" && product.stock <= 5) ||
      (stockFilter === "out" && product.stock === 0);

    return matchesSearch && matchesStock;
  });

  return (
    <div>
      <div className="grid gap-4 border-b border-white/10 px-6 py-5 md:grid-cols-[minmax(0,1fr)_240px]">
        <label className="block min-w-0">
          <span className="mb-2 block text-xs font-medium text-muted">
            Search products
          </span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, category, or product ID"
            className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <label className="block min-w-0">
          <span className="mb-2 block text-xs font-medium text-muted">
            Stock level
          </span>
          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-white outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="all">All stock levels</option>
            <option value="available">In stock</option>
            <option value="low">Low stock — 5 or fewer</option>
            <option value="out">Out of stock</option>
          </select>
        </label>
      </div>
      <p className="border-b border-white/10 px-6 py-4 text-xs text-muted">
        Showing {filteredProducts.length} of {result.products.length} loaded
        products ({result.totalProducts} total)
      </p>
      <div className="overflow-x-auto">
        <ProductsTable products={filteredProducts} />
      </div>
    </div>
  );
}
