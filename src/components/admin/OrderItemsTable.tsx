export type OrderItem = {
  id: string;
  product_name: string;
  unit_price: number;
  quantity: number;
  line_total: number;
};

function formatAmount(value: number) {
  return Number(value).toLocaleString("en-PH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export default function OrderItemsTable({ items }: { items: OrderItem[] }) {
  if (items.length === 0) {
    return <p>No items found for this order.</p>;
  }

  return (
    <table className="w-full min-w-[600px] border-collapse text-left text-sm [&_th]:px-6 [&_th]:py-4 [&_td]:px-6 [&_td]:py-5">
      <caption className="sr-only">Purchased products</caption>
      <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-muted">
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Quantity</th>
          <th scope="col">Unit price</th>
          <th scope="col">Line total</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-white/10">
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.product_name}</td>
            <td>{item.quantity}</td>
            <td>{formatAmount(item.unit_price)}</td>
            <td>{formatAmount(item.line_total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
