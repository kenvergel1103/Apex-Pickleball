"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { PaddleProduct } from "@/data/products";

type ProductCardProps = {
  product: PaddleProduct;
  onQuickView: (product: PaddleProduct) => void;
};

export default function ProductCard({
  product,
  onQuickView,
}: ProductCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="group overflow-hidden rounded-2xl border border-white/10 bg-[#111313] transition-colors duration-300 hover:border-white/25"
    >
      <button
        type="button"
        onClick={() => onQuickView(product)}
        className="relative flex w-full items-center justify-center overflow-hidden bg-white/[0.025] p-6 text-left sm:p-8"
        aria-label={`View ${product.name} details`}
      >
        <span className="absolute left-4 top-4 z-10 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[10px] font-semibold tracking-wider text-white/80">
          {product.badge}
        </span>

        <motion.img
          src={product.image}
          alt={product.name}
          whileHover={{ scale: 1.06, rotate: -2 }}
          transition={{ duration: 0.4 }}
          className="h-64 w-full object-contain sm:h-72"
        />

        <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-accent px-4 py-3 text-xs font-semibold !text-black opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
          Quick view <ArrowUpRight size={15} />
        </span>
      </button>

      <div className="p-5 sm:p-6">
        <p className="text-xs tracking-[0.2em] text-muted">
          {product.category}
        </p>

        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl font-bold">
              <Link
                href={`/products/${product.id}`}
                className="transition-colors hover:text-accent"
              ></Link>
              {product.name}
            </h3>
            <p className="text-muted mt-2 text-sm leading-6">
              {product.description}
            </p>
          </div>

          <span className="shrink-0 font-display text-lg font-semibold">
            ₱{product.price}
          </span>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 px-4 py-3 text-sm font-semibold transition-colors hover:border-accent hover:text-accent"
        >
          Explore paddle <ArrowUpRight size={16} />
        </Link>
      </div>
    </motion.article>
  );
}
