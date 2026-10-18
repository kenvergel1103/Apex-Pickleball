"use client";

import { useEffect, useState } from "react";
import type { AdminOrder } from "./OrdersTable";
import OrderItemsTable, { type OrderItem } from "./OrderItemsTable";
import { getNextOrderStatus } from "@/lib/orders/status";
import { getPaymentDisplay } from "@/lib/orders/payment-display";
import OrderStatusBadge from "./OrderStatusBadge";

type OrderResponse = {
  order: AdminOrder & {
    customer_name: string;
    email: string;
    phone: string;
    shipping_address: string;
    shipping_city: string;
    shipping_region: string;
    shipping_postal_code: string;
    shipping_country: string;
    subtotal: number;
    shipping_fee: number;
    payment_status: string;
    payment_method: "online" | "cash_on_delivery";
  };
  items: OrderItem[];
};

function formatAmount(value: number) {
  return Number(value).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
export default function OrderDetails({ orderId }: { orderId: string }) {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");
  const [details, setDetails] = useState<OrderResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrder() {
      try {
        const response = await fetch(
          `/api/admin/orders/${encodeURIComponent(orderId)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? "Order not found."
              : "Could not load order details.",
          );
        }

        const data = await response.json();
        if (active) setDetails(data);
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error ? error.message : "Could not load order.",
          );
        }
      }
    }

    loadOrder();

    return () => {
      active = false;
    };
  }, [orderId]);

  async function updateStatus() {
    if (!details || updating) return;

    const nextStatus = getNextOrderStatus(details.order.status);
    if (!nextStatus) return;

    setUpdating(true);
    setUpdateError("");

    try {
      const response = await fetch(
        `/api/admin/orders/${encodeURIComponent(orderId)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedStatus: details.order.status,
            status: nextStatus,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Could not update order.");
      }

      setDetails((current) =>
        current
          ? {
              ...current,
              order: { ...current.order, status: nextStatus },
            }
          : current,
      );
    } catch (error) {
      setUpdateError(
        error instanceof Error ? error.message : "Could not update order.",
      );
    } finally {
      setUpdating(false);
    }
  }

  if (error) return <p role="alert">{error}</p>;
  if (!details) return <p>Loading order...</p>;

  const nextStatus = getNextOrderStatus(details.order.status);
  const paymentDisplay = getPaymentDisplay(
    details.order.payment_method,
    details.order.payment_status,
  );

  return (
    <section>
      <div className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-wide text-muted">
            Order reference
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {details.order.order_number}
            </h2>
            <OrderStatusBadge status={details.order.status} />
          </div>
        </div>

        {nextStatus && (
          <button
            type="button"
            onClick={updateStatus}
            disabled={updating}
            aria-busy={updating}
            className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-50"
          >
            {updating ? "Updating..." : `Mark as ${nextStatus}`}
          </button>
        )}
      </div>

      <section className="mt-6 rounded-2xl border border-white/10 bg-surface p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
          Payment
        </h3>

        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Method</dt>
            <dd className="mt-1 font-medium">{paymentDisplay.methodLabel}</dd>
          </div>

          <div>
            <dt className="text-muted">Collection</dt>
            <dd className="mt-1 font-medium">
              {paymentDisplay.collectionLabel}
            </dd>
          </div>
        </dl>
      </section>

      {updateError && <p role="alert">{updateError}</p>}

      <div className="my-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-surface p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Customer
          </h3>

          <div className="mt-4 space-y-2 text-sm">
            <p className="font-medium">{details.order.customer_name}</p>
            <p className="break-words text-muted">{details.order.email}</p>
            <p className="text-muted">{details.order.phone}</p>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-surface p-6">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
            Shipping address
          </h3>

          <address className="mt-4 space-y-2 text-sm not-italic">
            <p className="break-words font-medium">
              {details.order.shipping_address}
            </p>
            <p className="text-muted">
              {details.order.shipping_city}, {details.order.shipping_region}
            </p>
            <p className="text-muted">
              {details.order.shipping_postal_code},{" "}
              {details.order.shipping_country}
            </p>
          </address>
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
        <h3 className="border-b border-white/10 px-6 py-5 text-xs font-semibold uppercase tracking-wider text-muted">
          Purchased products
        </h3>
        <div className="overflow-x-auto">
          <OrderItemsTable items={details.items} />
        </div>
      </section>
      <section className="ml-auto mt-6 max-w-md rounded-2xl border border-white/10 bg-surface p-6">
        <h3 className="mb-5 text-xs font-semibold uppercase tracking-wider text-muted">
          Order summary
        </h3>

        <dl className="grid grid-cols-2 gap-y-4 text-sm">
          <dt className="text-muted">Subtotal</dt>
          <dd className="text-right tabular-nums">
            {formatAmount(details.order.subtotal)}
          </dd>

          <dt className="text-muted">Shipping fee</dt>
          <dd className="text-right tabular-nums">
            {formatAmount(details.order.shipping_fee)}
          </dd>

          <dt className="border-t border-white/10 pt-4 font-semibold">Total</dt>
          <dd className="border-t border-white/10 pt-4 text-right font-semibold text-accent tabular-nums">
            {formatAmount(details.order.total)}
          </dd>
        </dl>
      </section>

    </section>
  );
}
