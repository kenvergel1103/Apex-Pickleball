"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  LockKeyhole,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type ShippingForm = {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  apartment: string;
  city: string;
  region: string;
  postalCode: string;
};

type PaymentMethod = "online" | "cash_on_delivery";

const initialForm: ShippingForm = {
  fullName: "",
  email: "",
  phone: "",
  country: "Philippines",
  address: "",
  apartment: "",
  city: "",
  region: "",
  postalCode: "",
};

const money = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState<ShippingForm>(initialForm);
  const [orderNumber, setOrderNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showOnlinePayment, setShowOnlinePayment] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("apex-cart");

      if (savedCart) {
        const parsed: unknown = JSON.parse(savedCart);

        if (Array.isArray(parsed)) {
          const validItems = parsed.filter(
            (item): item is CartItem =>
              item !== null &&
              typeof item === "object" &&
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.image === "string" &&
              typeof item.price === "number" &&
              Number.isFinite(item.price) &&
              item.price >= 0 &&
              Number.isInteger(item.quantity) &&
              item.quantity > 0,
          );

          setCart(validItems);
        }
      }
    } catch {
      setCart([]);
    }

    setLoaded(true);
  }, []);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  function updateField(field: keyof ShippingForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!cart.length) return;

    setErrorMessage("");
    if (!paymentMethod) {
      setErrorMessage("Please choose a payment method to continue.");
      return;
    }

    if (paymentMethod === "cash_on_delivery") {
      void createOrder("cash_on_delivery");
      return;
    }

    setShowOnlinePayment(true);
  }

  async function createOrder(method: PaymentMethod) {
    if (paymentProcessing) return;

    setPaymentProcessing(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod: method,
          customer: form,
          items: cart.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create order.");
      }

      localStorage.removeItem("apex-cart");
      setCart([]);
      setShowOnlinePayment(false);
      setOrderNumber(result.orderNumber);
    } catch (error) {
      console.error("Checkout failed:", error);

      const message =
        error instanceof Error ? error.message : "Something went wrong.";

      setShowOnlinePayment(false);
      setErrorMessage(
        message.toLowerCase().includes("insufficient stock")
          ? message
          : "We couldn't place your order. Please try again.",
      );
    } finally {
      setPaymentProcessing(false);
    }
  }

  function showPaymentFailure() {
    setShowOnlinePayment(false);
    setErrorMessage(
      "Online checkout wasn't completed. No order was created and stock was unchanged.",
    );
  }

  const fieldClass =
    "mt-2 w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#D7FF3F]";

  const labelClass = "block text-sm font-medium text-white/80";

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#080909] px-5 py-24 text-center text-white">
        Loading your checkout...
      </main>
    );
  }

  if (orderNumber) {
    return (
      <main className="min-h-screen bg-[#080909] px-5 py-20 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center sm:p-12">
          <CheckCircle2 size={56} className="mx-auto mb-6 text-[#D7FF3F]" />
          <p className="mb-3 text-xs tracking-[0.3em] text-[#D7FF3F]">
            ORDER CONFIRMED
          </p>
          <h1 className="font-display text-3xl font-bold">
            Order confirmed
          </h1>
          <p className="mt-3 text-white/70">
            {paymentMethod === "cash_on_delivery"
              ? "Your order is confirmed. Payment is due when your order arrives."
              : "Your order is confirmed. No online charge was made because a payment provider is not connected."}
          </p>
          <div className="my-8 rounded-2xl border border-white/10 p-5">
            <p className="text-xs text-white/50">Order reference</p>
            <p className="mt-2 font-semibold text-[#D7FF3F]">{orderNumber}</p>
          </div>
          <Link
            href="/collection"
            className="inline-flex items-center justify-center rounded-full bg-[#D7FF3F] px-6 py-3 font-semibold !text-black transition hover:opacity-80"
          >
            Continue shopping
          </Link>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-[#080909] px-5 py-24 text-center text-white">
        <ShoppingBag size={48} className="mx-auto mb-6 text-[#D7FF3F]" />

        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>

        <p className="mt-3 text-sm text-white/60">
          Add a paddle to your cart before proceeding to checkout.
        </p>

        <Link
          href="/collection"
          className="mt-8 inline-flex rounded-full bg-[#D7FF3F] px-6 py-3 font-semibold !text-black"
        >
          Browse paddles
        </Link>

        <div>
          <Link
            href="/cart"
            className="mt-5 inline-block text-sm text-white/50 hover:text-[#D7FF3F]"
          >
            Return to cart
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080909] px-5 py-12 text-white sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/cart"
          className="mb-10 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-[#D7FF3F]"
        >
          <ArrowLeft size={16} />
          Back to cart
        </Link>

        <div className="mb-10">
          <p className="mb-3 text-xs tracking-[0.3em] text-[#D7FF3F]">
            APEX PICKLEBALL
          </p>

          <h1 className="font-display text-4xl font-bold sm:text-5xl">
            Checkout
          </h1>

          <p className="mt-3 text-sm text-white/50">
            Your next game starts here.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-10 lg:grid-cols-[1fr_380px]"
        >
          <div className="space-y-8">
            <section className="rounded-2xl border border-white/10 p-5 sm:p-7">
              <h2 className="mb-6 text-xl font-semibold">
                01. Contact information
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Full name *
                  <input
                    required
                    autoComplete="name"
                    value={form.fullName}
                    onChange={(e) => updateField("fullName", e.target.value)}
                    className={fieldClass}
                    placeholder="Your full name"
                  />
                </label>

                <label className={labelClass}>
                  Email address *
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={fieldClass}
                    placeholder="you@example.com"
                  />
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                  Phone number *
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={fieldClass}
                    placeholder="+63 912 345 6789"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 p-5 sm:p-7">
              <h2 className="mb-6 text-xl font-semibold">
                02. Shipping address
              </h2>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className={`${labelClass} sm:col-span-2`}>
                  Country / region *
                  <select
                    required
                    autoComplete="country-name"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    className={fieldClass}
                  >
                    <option className="bg-[#111]" value="Philippines">
                      Philippines
                    </option>
                    <option className="bg-[#111]" value="United States">
                      United States
                    </option>
                    <option className="bg-[#111]" value="United Kingdom">
                      United Kingdom
                    </option>
                    <option className="bg-[#111]" value="Canada">
                      Canada
                    </option>
                    <option className="bg-[#111]" value="Australia">
                      Australia
                    </option>
                    <option className="bg-[#111]" value="Singapore">
                      Singapore
                    </option>
                    <option className="bg-[#111]" value="Japan">
                      Japan
                    </option>
                    <option className="bg-[#111]" value="Other">
                      Other country
                    </option>
                  </select>
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                  Street address *
                  <input
                    required
                    autoComplete="address-line1"
                    value={form.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    className={fieldClass}
                    placeholder="House number and street"
                  />
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                  Apartment, unit, etc. (optional)
                  <input
                    autoComplete="address-line2"
                    value={form.apartment}
                    onChange={(e) => updateField("apartment", e.target.value)}
                    className={fieldClass}
                    placeholder="Apartment, suite, unit"
                  />
                </label>

                <label className={labelClass}>
                  City *
                  <input
                    required
                    autoComplete="address-level2"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className={fieldClass}
                    placeholder="City"
                  />
                </label>

                <label className={labelClass}>
                  State / province / region *
                  <input
                    required
                    autoComplete="address-level1"
                    value={form.region}
                    onChange={(e) => updateField("region", e.target.value)}
                    className={fieldClass}
                    placeholder="State or province"
                  />
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                  Postal / ZIP code *
                  <input
                    required
                    autoComplete="postal-code"
                    value={form.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    className={fieldClass}
                    placeholder="Postal or ZIP code"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <LockKeyhole size={20} className="text-[#D7FF3F]" />
                <h2 className="text-xl font-semibold">03. Payment</h2>
              </div>

              <fieldset className="mt-5">
                <legend className="mb-3 text-sm font-medium text-white/80">
                  Choose a payment method *
                </legend>

                <div className="grid gap-3">
                  <label
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                      paymentMethod === "online"
                        ? "border-[#D7FF3F]/50 bg-[#D7FF3F]/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <input
                      required
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                    />
                    <span>
                      <span className="block font-medium">Online payment</span>
                      <span className="mt-1 block text-sm text-white/60">
                        No payment provider is connected. No charge will be
                        made.
                      </span>
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${
                      paymentMethod === "cash_on_delivery"
                        ? "border-[#D7FF3F]/50 bg-[#D7FF3F]/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <input
                      required
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={paymentMethod === "cash_on_delivery"}
                      onChange={() =>
                        setPaymentMethod("cash_on_delivery")
                      }
                    />
                    <span>
                      <span className="block font-medium">
                        Cash on delivery
                      </span>
                      <span className="mt-1 block text-sm text-white/60">
                        Payment is due when your order arrives.
                      </span>
                    </span>
                  </label>
                </div>
              </fieldset>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 p-5 sm:p-7 lg:sticky lg:top-28">
            <h2 className="text-xl font-semibold">Order summary</h2>

            <div className="mt-6 space-y-5">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain p-2"
                    />
                    <span className="absolute right-1 top-1 rounded-full bg-[#D7FF3F] px-2 py-0.5 text-xs font-bold !text-black">
                      {item.quantity}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="mt-2 text-xs text-white/50">
                      Qty: {item.quantity}
                    </p>
                    <p className="mt-1 text-sm text-[#D7FF3F]">
                      {money(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="my-6 border-t border-white/10" />

            <div className="flex justify-between text-sm text-white/60">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>

            <div className="mt-4 flex justify-between text-sm text-white/60">
              <span>Shipping</span>
              <span>Not calculated</span>
            </div>

            <p className="mt-3 text-xs leading-5 text-white/40">
              Shipping fees and any applicable taxes are not calculated at
              checkout and will be confirmed separately before fulfillment.
            </p>

            <div className="my-6 border-t border-white/10" />

            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold">Subtotal</span>
              <span className="text-xl font-bold text-[#D7FF3F]">
                {money(subtotal)}
              </span>
            </div>

            <button
              type="submit"
              disabled={paymentProcessing}
              aria-busy={paymentProcessing}
              className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#D7FF3F] px-5 py-4 text-sm font-bold !text-black transition hover:scale-[1.02] hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
            >
              <PackageCheck size={18} />
              {paymentProcessing
                ? "Placing order..."
                : paymentMethod === "cash_on_delivery"
                  ? "Place order"
                  : "Continue to payment"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-white/40">
              Online payment is not connected. No online charge will be made.
            </p>
          </aside>
        </form>
      </div>

      {showOnlinePayment && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="online-payment-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111212] p-6 text-white shadow-2xl"
          >
            <p className="text-xs tracking-[0.2em] text-[#D7FF3F]">
              PAYMENT
            </p>

            <h2 id="online-payment-title" className="mt-2 text-xl font-semibold">
              Online payment
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/60">
              No payment provider is connected, so no charge will be made.
              Choose an outcome to continue.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => void createOrder("online")}
                disabled={paymentProcessing}
                className="rounded-xl bg-[#D7FF3F] px-4 py-3 font-semibold text-black disabled:opacity-50"
              >
                {paymentProcessing
                  ? "Placing order..."
                  : "Complete checkout"}
              </button>

              <button
                type="button"
                onClick={showPaymentFailure}
                disabled={paymentProcessing}
                className="rounded-xl border border-white/10 px-4 py-3 font-semibold disabled:opacity-50"
              >
                Payment unsuccessful
              </button>

              <button
                type="button"
                onClick={() => setShowOnlinePayment(false)}
                disabled={paymentProcessing}
                className="rounded-xl px-4 py-3 text-sm text-white/60 disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </section>
        </div>
      )}
      {/* Checkout error modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="checkout-error-title"
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111212] p-6 shadow-2xl"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
              <span className="text-2xl">!</span>
            </div>

            <h2 id="checkout-error-title">Checkout not completed</h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              {errorMessage}
            </p>

            <p className="mt-2 text-sm text-gray-400">
              You can try again or return to your cart to review your items.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/cart"
                className="w-full rounded-xl border border-white/10 px-4 py-3 text-center font-semibold text-white transition hover:bg-white/5"
              >
                Return to cart
              </Link>

              <button
                type="button"
                onClick={() => setErrorMessage("")}
                className="w-full rounded-xl bg-[#D7FF3F] px-4 py-3 font-semibold text-black transition hover:bg-[#c5ed30]"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
