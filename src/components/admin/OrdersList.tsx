"use client";

import { useEffect, useState } from "react";
import OrdersTable, { type AdminOrder } from "./OrdersTable";

export default function OrdersList() {
  const [orders, setOrders] = useState<AdminOrder[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadOrders() {
      try {
        const response = await fetch("/api/admin/orders", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Could not load orders.");
        }

        const data = await response.json();

        if (active) setOrders(data.orders);
      } catch {
        if (active) setError("Could not load orders.");
      }
    }

    loadOrders();
    return () => {
      active = false;
    };
  }, []);

  if (error) return <p role="alert">{error}</p>;
  if (orders === null) return <p>Loading orders...</p>;

  return <OrdersTable orders={orders} />;
}
