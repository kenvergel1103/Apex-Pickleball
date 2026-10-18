import Link from "next/link";
import OrderStatusBadge from "./OrderStatusBadge";
import { getPaymentDisplay } from "@/lib/orders/payment-display";

export type AdminOrder = {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  payment_method: "online" | "cash_on_delivery";
  total: number;
  created_at: string;
};

export default function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <table className="w-full min-w-[640px] border-collapse text-left text-sm">
      <caption className="sr-only">Latest 20 orders</caption>
      <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-muted">
        <tr>
          <th className="border-b border-white/10 px-6 py-4" scope="col">
            Order reference
          </th>
          <th className="border-b border-white/10 px-6 py-4" scope="col">
            Status
          </th>
          <th className="border-b border-white/10 px-6 py-4" scope="col">
            Payment
          </th>
          <th className="border-b border-white/10 px-6 py-4" scope="col">
            Total
          </th>
          <th className="border-b border-white/10 px-6 py-4" scope="col">
            Date (Manila)
          </th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr
            key={order.id}
            className="transition-colors hover:bg-white/[0.03]"
          >
            <td className="border-b border-white/10 px-6 py-4">
              <Link
                href={`/admin/orders/${order.id}`}
                className="font-medium !text-accent underline-offset-4 hover:underline"
              >
                {order.order_number}
              </Link>
            </td>
            <td className="border-b border-white/10 px-6 py-4">
              <OrderStatusBadge status={order.status} />
            </td>
            <td className="border-b border-white/10 px-6 py-4">
              {getPaymentDisplay(order.payment_method, order.payment_status)
                .listLabel}
            </td>
            <td className="border-b border-white/10 px-6 py-4">
              {Number(order.total).toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
            <td className="whitespace-nowrap border-b border-white/10 px-6 py-4 text-muted">
              {new Date(order.created_at).toLocaleDateString("en-PH", {
                timeZone: "Asia/Manila",
              })}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
