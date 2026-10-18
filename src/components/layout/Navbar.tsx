"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";

const links = [
  { label: "Shop", href: "#products" },
  { label: "Technology", href: "#technology" },
  { label: "Our Story", href: "#story" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="sticky top-0 z-50 border-b border-white/10 bg-[#080909]/85 backdrop-blur-xl"
    >
      <nav
        aria-label="Main navigation"
        className="container-main flex h-20 items-center justify-between"
      >
        <a
          href="/"
          aria-label="Apex Pickleball home"
          className="font-display text-xl font-bold tracking-[0.18em]"
        >
          <span className="text-accent">△</span> APEX
          <span className="ml-2 text-[10px] tracking-[0.35em] text-muted">
            PICKLEBALL
          </span>
        </a>

        <div className="hidden items-center gap-10 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-muted transition-colors duration-300 hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/cart"
            aria-label="View shopping cart"
            className="relative inline-flex items-center justify-center rounded-full border border-white/10 p-3 transition hover:border-accent hover:text-accent"
          >
            <ShoppingBag size={20} />
          </Link>

          <a
            href="/collection"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold !text-black transition-transform hover:scale-105"
          >
            Shop Now
            <ArrowUpRight size={16} />
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <Link
            href="/cart"
            aria-label="View shopping cart"
            className="inline-flex items-center justify-center rounded-full border border-white/10 p-2 transition hover:border-accent hover:text-accent"
          >
            <ShoppingBag size={20} />
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-lg border border-white/10 p-2"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 md:hidden"
          >
            <div className="container-main flex flex-col gap-5 py-6">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-muted hover:text-accent"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/collection"
                onClick={() => setMenuOpen(false)}
                className="font-semibold text-accent"
              >
                Shop Now ↗
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
