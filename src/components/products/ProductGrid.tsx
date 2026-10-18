"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { PaddleProduct } from "@/data/products";
import ProductCard from "./ProductCard";

const categories = ["All", "Control", "Power", "Speed", "Beginner"] as const;

type Category = (typeof categories)[number];

type ProductGridProps = {
  products: PaddleProduct[];
};

export default function ProductGrid({ products }: ProductGridProps) {
  const [category, setCategory] = useState<Category>("All");
  const [selectedProduct, setSelectedProduct] = useState<PaddleProduct | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (category !== "All") {
      filtered = filtered.filter((product) =>
        product.category.toLowerCase().includes(category.toLowerCase()),
      );
    }

    // Search by product name, category, or description
    const searchTerm = search.trim().toLowerCase();

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        `${product.name} ${product.category} ${product.description}`
          .toLowerCase()
          .includes(searchTerm),
      );
    }

    // Sort products
    if (sort === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [products, category, search, sort]);

  return (
    <section id="collection" className="container-main py-24 sm:py-32">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-accent">
            FIND YOUR EDGE
          </p>

          <h2 className="mt-4 font-display text-4xl font-bold sm:text-6xl">
            The collection.
          </h2>

          <p className="text-muted mt-4 max-w-lg leading-7">
            Purpose-built paddle designs for the way you play. Find the right
            fit for your game.
          </p>
        </div>

        <p className="text-sm text-muted">{filteredProducts.length} models</p>
      </div>

      {/* Category filters */}
      <div
        className="mt-10 flex flex-wrap gap-2"
        aria-label="Filter products by category"
      >
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={category === item}
            onClick={() => setCategory(item)}
            className={`rounded-full border px-5 py-3 text-sm transition-colors ${
              category === item
                ? "border-accent bg-accent !text-black"
                : "border-white/10 text-muted hover:border-white/30 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Search and sort */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search paddles..."
          aria-label="Search paddles"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none transition focus:border-accent sm:flex-1"
        />

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value)}
          aria-label="Sort products"
          className="rounded-xl border border-white/10 bg-[#111313] px-4 py-3 text-sm outline-none focus:border-accent"
        >
          <option value="featured">Featured</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="name">Name: A to Z</option>
        </select>
      </div>

      {/* Product grid */}
      <motion.div
        layout
        className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setSelectedProduct}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty search/filter state */}
      {filteredProducts.length === 0 && (
        <p className="text-muted py-16 text-center">
          No paddles match your search. Try another keyword or category.
        </p>
      )}

      {/* Quick-view modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="quick-view-title"
              className="relative my-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-[#111313] p-6 sm:p-10"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close product details"
                className="absolute right-4 top-4 rounded-full border border-white/10 p-2 hover:border-accent hover:text-accent"
              >
                <X size={18} />
              </button>

              <div className="grid gap-6 sm:grid-cols-2 sm:items-center">
                <div className="flex min-h-64 items-center justify-center rounded-xl bg-white/[0.025] p-4">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="max-h-80 w-full object-contain"
                  />
                </div>

                <div>
                  <p className="text-xs tracking-[0.2em] text-accent">
                    {selectedProduct.category}
                  </p>

                  <h3
                    id="quick-view-title"
                    className="mt-4 font-display text-3xl font-bold"
                  >
                    {selectedProduct.name}
                  </h3>

                  <p className="text-muted mt-4 text-sm leading-7">
                    {selectedProduct.description}
                  </p>

                  <p className="mt-5 text-2xl font-semibold">
                    ₱{selectedProduct.price.toLocaleString("en-PH")}
                  </p>

                  <ul className="text-muted mt-5 space-y-2 text-sm">
                    {selectedProduct.specs.map((spec) => (
                      <li key={spec.label}>
                        ↗ {spec.label}: {spec.value}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
