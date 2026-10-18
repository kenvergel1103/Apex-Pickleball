export default function StockBadge({ stock }: { stock: number }) {
  const label =
    stock <= 0 ? "Out of stock" : stock <= 5 ? "Low stock" : "In stock";

  const color =
    stock <= 0
      ? "border-rose-400/20 bg-rose-400/10 text-rose-300"
      : stock <= 5
        ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
        : "border-accent/20 bg-accent/10 text-accent";

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1 text-xs font-medium ${color}`}
    >
      <span className="tabular-nums">{stock}</span>
      <span>· {label}</span>
    </span>
  );
}