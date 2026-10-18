"use client";

import { useEffect, useState } from "react";

export default function OrderCount() {
  const [total, setTotal] = useState<number | null>(null);
  const [pending, setPending] = useState<number | null>(null);
  const [onlineCheckouts, setOnlineCheckouts] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [lowStock, setLowStock] = useState<number | null>(null);
  const [orderTotal, setOrderTotal] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCount() {
      try {
        const response = await fetch("/api/admin/overview", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Could not load the order count.");
        }

        const data = await response.json();

        if (active) {
          setTotal(data.totalOrders);
          setPending(data.pendingOrders);
          setLowStock(data.lowStockProducts);
          setOrderTotal(data.orderTotal);
          setOnlineCheckouts(data.onlineCheckouts);
        }
      } catch {
        if (active) setError("Could not load the order count.");
      }
    }

    loadCount();
    return () => {
      active = false;
    };
  }, []);

  if (error) return <p role="alert">{error}</p>;

  const metrics = [
    {
      label: "Total orders",
      value: total?.toLocaleString("en-PH") ?? "—",
      description: "All saved orders",
    },
    {
      label: "Pending orders",
      value: pending?.toLocaleString("en-PH") ?? "—",
      description: "Awaiting confirmation",
    },

    {
      label: "Online checkouts",
      value: onlineCheckouts?.toLocaleString("en-PH") ?? "—",
      description: "No online charge was collected",
    },
    {
      label: "Low-stock products",
      value: lowStock?.toLocaleString("en-PH") ?? "—",
      description: "5 or fewer units, including zero",
    },
    {
      label: "Order total",
      value:
        orderTotal?.toLocaleString("en-PH", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) ?? "—",
      description: "Order totals only · not collected revenue",
    },
  ];

  return (
    <section aria-label="Store overview" aria-busy={total === null}>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map((metric, index) => (
          <article
            key={metric.label}
            className={`min-w-0 rounded-2xl border p-6 ${
              index === 0
                ? "border-accent/30 bg-accent/5"
                : "border-white/10 bg-surface"
            }`}
          >
            <h2 className="text-xs font-medium tracking-wide text-muted">
              {metric.label}
            </h2>
            <p className="mt-4 font-display text-3xl font-bold tracking-tight tabular-nums">
              {metric.value}
            </p>
            <p className="mt-3 text-xs leading-5 text-muted">
              {metric.description}
            </p>
          </article>
        ))}
      </div>

      <p className="mt-5 text-xs text-muted">
        Online payment is not connected; no online charges are collected.
      </p>
    </section>
  );
}
