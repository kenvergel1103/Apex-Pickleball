"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { PaddleProduct } from "@/data/products";

type Props = {
  product: PaddleProduct;
};

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export default function ProductPurchasePanel({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  function addToCart() {
    try {
      const savedCart = localStorage.getItem("apex-cart");
      const cart: CartItem[] = savedCart ? JSON.parse(savedCart) : [];

      const existingItem = cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        });
      }

      localStorage.setItem("apex-cart", JSON.stringify(cart));
      setMessage(`${product.name} added to your cart.`);
    } catch {
      setMessage("Unable to save your cart. Please try again.");
    }
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium">Quantity</p>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center rounded-full border border-white/10">
          <button
            type="button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((current) => Math.max(1, current - 1))}
            className="rounded-l-full p-3 transition hover:text-accent disabled:opacity-30"
          >
            <Minus size={16} />
          </button>

          <span aria-live="polite" className="min-w-8 text-center text-sm">
            {quantity}
          </span>

          <button
            type="button"
            aria-label="Increase quantity"
            disabled={quantity >= 10}
            onClick={() => setQuantity((current) => Math.min(10, current + 1))}
            className="rounded-r-full p-3 transition hover:text-accent disabled:opacity-30"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={addToCart}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-accent px-6 py-4 text-sm font-semibold !text-black transition hover:opacity-80"
        >
          <ShoppingBag size={17} />
          Add to cart
        </button>
      </div>

      <p aria-live="polite" className="mt-3 min-h-5 text-sm text-accent">
        {message}
      </p>
    </div>
  );
}
