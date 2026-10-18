"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDownRight, ArrowLeft, ArrowRight } from "lucide-react";
import type { PaddleProduct } from "@/data/products";

export default function PaddleShowcase({
  products,
}: {
  products: PaddleProduct[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const featuredProducts = products.slice(0, 3);
  const activeProduct = featuredProducts[activeIndex];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : [-8, 0, 8],
  );

  const imageY = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduceMotion ? [0, 0, 0] : [45, 0, -35],
  );

  const goToProduct = (index: number) => {
    setActiveIndex((index + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative isolate overflow-hidden border-y border-white/10 bg-[#0b0d0c] py-20 sm:py-28"
    >
      {/* Ambient product lighting */}
      <motion.div
        aria-hidden="true"
        animate={{ backgroundColor: activeProduct.accent }}
        transition={{ duration: 0.6 }}
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.09] blur-[110px] sm:h-[500px] sm:w-[500px]"
      />

      <div className="container-main">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.3em] text-accent">
              THE APEX COLLECTION
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
              Find your edge.
            </h2>
          </div>

          <p className="text-muted max-w-sm text-sm leading-6">
            Three designs. Three ways to approach the game. Find the paddle that
            fits your style.
          </p>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Animated paddle image */}
          <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] sm:min-h-[520px]">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />

            <motion.div
              aria-hidden="true"
              animate={{ backgroundColor: activeProduct.accent }}
              transition={{ duration: 0.6 }}
              className="absolute h-48 w-48 rounded-full opacity-10 blur-[75px] sm:h-72 sm:w-72"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{
                  opacity: 0,
                  x: reduceMotion ? 0 : 45,
                  rotate: reduceMotion ? 0 : -5,
                  scale: reduceMotion ? 1 : 0.92,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  rotate: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  x: reduceMotion ? 0 : -35,
                  rotate: reduceMotion ? 0 : 4,
                  scale: reduceMotion ? 1 : 0.96,
                }}
                transition={{
                  duration: reduceMotion ? 0 : 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <motion.img
                  src={activeProduct.image}
                  alt={`${activeProduct.name} pickleball paddle`}
                  style={{ rotate, y: imageY }}
                  className="relative z-10 max-h-[430px] w-auto max-w-full object-contain drop-shadow-[0_25px_40px_rgba(0,0,0,0.6)] sm:max-h-[480px]"
                />
              </motion.div>
            </AnimatePresence>

            <span className="absolute left-5 top-5 z-20 text-xs tracking-[0.25em] text-white/40">
              0{activeIndex + 1} / 0{featuredProducts.length}
            </span>

            <span
              className="absolute bottom-5 right-5 z-20 text-xs font-semibold tracking-[0.2em]"
              style={{ color: activeProduct.accent }}
            >
              {activeProduct.category}
            </span>
          </div>

          {/* Product information */}
          <div className="flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
                transition={{ duration: reduceMotion ? 0 : 0.3 }}
              >
                <p className="text-xs font-semibold tracking-[0.3em] text-muted">
                  {activeProduct.category}
                </p>

                <h3 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em] sm:text-6xl">
                  {activeProduct.name}
                </h3>

                <p className="text-muted mt-5 max-w-lg text-base leading-8 sm:text-lg">
                  {activeProduct.description}
                </p>

                <p className="mt-7 font-display text-3xl font-semibold">
                  ₱{activeProduct.price}
                  <span className="text-muted ml-2 text-sm font-normal">
                    PHP
                  </span>
                </p>

                <div className="mt-8 flex flex-wrap gap-2">
                  {activeProduct.specs.map((spec) => (
                    <span
                      key={spec.label}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs text-muted"
                    >
                      {spec.label}: {spec.value}
                    </span>
                  ))}
                </div>

                <Link
                  href={`/products/${activeProduct.id}`}
                  className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold !text-black transition-transform hover:scale-[1.03]"
                >
                  Explore this paddle
                  <ArrowDownRight size={17} />
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Product selectors */}
            <div className="mt-10 border-t border-white/10 pt-6">
              <p className="mb-4 text-xs tracking-[0.2em] text-muted">
                SELECT YOUR PADDLE
              </p>

              <div className="flex flex-wrap gap-3">
                {featuredProducts.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    aria-pressed={activeIndex === index}
                    onClick={() => goToProduct(index)}
                    className={`rounded-full border px-4 py-3 text-xs font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] ${
                      activeIndex === index
                        ? "border-accent bg-accent !text-black"
                        : "border-white/15 text-muted hover:border-white/40 hover:text-white"
                    }`}
                  >
                    {product.name.replace("APEX ", "")}
                  </button>
                ))}
              </div>

              <div className="mt-7 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => goToProduct(activeIndex - 1)}
                  aria-label="Previous paddle"
                  className="rounded-full border border-white/15 p-3 transition-colors hover:border-accent hover:text-accent"
                >
                  <ArrowLeft size={18} />
                </button>

                <span className="text-xs tracking-[0.15em] text-muted">
                  {String(activeIndex + 1).padStart(2, "0")} —{" "}
                  {String(featuredProducts.length).padStart(2, "0")}
                </span>

                <button
                  type="button"
                  onClick={() => goToProduct(activeIndex + 1)}
                  aria-label="Next paddle"
                  className="rounded-full border border-white/15 p-3 transition-colors hover:border-accent hover:text-accent"
                >
                  <ArrowRight size={18} />
                </button>
              </div>

              <Link
                href="/products"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-accent"
              >
                Explore all paddles
                <ArrowDownRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
