
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, ArrowRight } from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("apex-cart");
      const parsed: unknown = savedCart ? JSON.parse(savedCart) : [];

      if (Array.isArray(parsed)) {
        setCart(parsed);
      }
    } catch {
      setCart([]);
    } finally {
      setLoaded(true);
    }
  }, []);

  function saveCart(updatedCart: CartItem[]) {
    setCart(updatedCart);
    localStorage.setItem("apex-cart", JSON.stringify(updatedCart));
  }

  function updateQuantity(id: string, change: number) {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.max(1, Math.min(10, item.quantity + change)),
          }
        : item,
    );

    saveCart(updatedCart);
  }

  function removeItem(id: string) {
    saveCart(cart.filter((item) => item.id !== id));
  }

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-background px-6 py-24 text-foreground">
        <p className="text-center text-muted">Loading your cart...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full overflow-x-clip bg-background px-5 pt-12 pb-44 text-foreground sm:px-8 sm:py-20 lg:pb-20">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="text-sm text-muted transition hover:text-accent"
        >
          ← Back to home
        </Link>

        <div className="mb-10 mt-8">
          <p className="text-xs font-semibold tracking-[0.3em] text-accent">
            APEX PICKLEBALL
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Your Cart
          </h1>
          <p className="mt-3 text-sm text-muted">
            Review your paddles before checkout.
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-6 py-16 text-center">
            <ShoppingBag size={42} className="mx-auto text-muted" />
            <h2 className="mt-5 text-xl font-semibold">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-muted">
              Find a paddle that matches your game.
            </p>
            <Link
              href="/collection"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-bold !text-black transition hover:opacity-80"
            >
              Browse paddles
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_340px]">
            <section className="space-y-4">
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:flex-row sm:items-center sm:p-6"
                >
                  <div className="flex h-32 items-center justify-center rounded-xl bg-white/[0.03] sm:w-32 sm:shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full max-w-full object-contain p-3"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold">{item.name}</h2>
                    <p className="mt-2 text-sm text-muted">
                      ₱{item.price.toLocaleString("en-PH")}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center rounded-full border border-white/10">
                        <button
                          type="button"
                          aria-label={`Decrease ${item.name} quantity`}
                          disabled={item.quantity <= 1}
                          onClick={() => updateQuantity(item.id, -1)}
                          className="rounded-l-full p-2.5 transition hover:text-accent disabled:opacity-30"
                        >
                          <Minus size={15} />
                        </button>

                        <span className="min-w-9 text-center text-sm">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase ${item.name} quantity`}
                          disabled={item.quantity >= 10}
                          onClick={() => updateQuantity(item.id, 1)}
                          className="rounded-r-full p-2.5 transition hover:text-accent disabled:opacity-30"
                        >
                          <Plus size={15} />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-red-400"
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="font-semibold sm:text-right">
                    ₱{(item.price * item.quantity).toLocaleString("en-PH")}
                  </p>
                </article>
              ))}

              <Link
                href="/collection"
                className="inline-flex items-center gap-2 py-3 text-sm text-muted transition hover:text-accent"
              >
                <ArrowRight size={16} className="rotate-180" />
                Continue shopping
              </Link>
            </section>

            <aside className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:sticky lg:top-8">
              <h2 className="text-lg font-semibold">Order Summary</h2>

              <div className="mt-6 flex justify-between gap-4 text-sm">
                <span className="text-muted">
                  Subtotal ({totalItems} items)
                </span>
                <span className="font-medium">
                  ₱{subtotal.toLocaleString("en-PH")}
                </span>
              </div>

              <div className="mt-4 flex justify-between gap-4 text-sm">
                <span className="text-muted">Shipping</span>
                <span className="text-right text-muted">
                  Calculated at checkout
                </span>
              </div>

              <div className="my-6 border-t border-white/10" />

              <div className="flex items-center justify-between gap-4">
                <span className="font-semibold">Subtotal</span>
                <span className="font-display text-2xl font-bold">
                  ₱{subtotal.toLocaleString("en-PH")}
                </span>
              </div>

              <p className="mt-4 text-center text-xs leading-5 text-muted">
                Shipping and payment details will be confirmed during checkout.
              </p>
            </aside>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#080909]/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] backdrop-blur-lg lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:pb-0 lg:backdrop-blur-none">
          <div className="mx-auto max-w-6xl lg:flex lg:justify-end">
            <Link
              href="/checkout"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-bold !text-black transition hover:opacity-80 lg:w-[340px]"
            >
              Proceed to checkout
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}