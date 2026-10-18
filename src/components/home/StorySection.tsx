"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

export default function StorySection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="story" className="border-y border-white/10 bg-white/[0.02]">
      <div className="container-main grid gap-12 py-24 sm:py-32 md:grid-cols-2 md:items-center">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs font-semibold tracking-[0.3em] text-accent">
            THE APEX MINDSET
          </p>

          <h2 className="mt-5 font-display text-4xl font-bold leading-tight sm:text-6xl">
            The next point
            <br />
            is yours to take.
          </h2>

          <p className="text-muted mt-6 max-w-lg leading-8">
            Pickleball is a game of decisions. A soft touch, a quick reaction, a
            shot placed exactly where you intended. APEX brings together paddle
            options for players who want to keep learning, competing, and
            finding their edge.
          </p>

          <Link
            href="/collection"
            className="mt-8 inline-flex items-center gap-2 border-b border-accent pb-2 text-sm font-semibold transition-colors hover:text-accent"
          >
            Find your paddle
            <ArrowUpRight size={17} />
          </Link>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="relative flex min-h-[300px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#101212] p-8 sm:min-h-[420px]"
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, #D7FF3F22 0, transparent 65%)",
            }}
          />

          <div className="relative text-center">
            <p className="font-display text-7xl font-bold tracking-[-0.08em] sm:text-9xl">
              AP<span className="text-accent">E</span>X
            </p>

            <p className="mt-4 text-xs tracking-[0.35em] text-muted">
              FIND YOUR EDGE
            </p>
          </div>

          <span className="absolute bottom-5 right-5 text-xs tracking-widest text-muted">
            PLAY WITH INTENT.
          </span>
        </motion.div>
      </div>
    </section>
  );
}
