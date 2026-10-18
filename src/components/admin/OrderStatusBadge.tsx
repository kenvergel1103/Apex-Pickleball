const statusStyles = new Map<string, string>([
  ["pending", "border-amber-400/20 bg-amber-400/10 text-amber-300"],
  ["confirmed", "border-sky-400/20 bg-sky-400/10 text-sky-300"],
  ["shipped", "border-violet-400/20 bg-violet-400/10 text-violet-300"],
  ["delivered", "border-accent/20 bg-accent/10 text-accent"],
  ["cancelled", "border-rose-400/20 bg-rose-400/10 text-rose-300"],
]);

export default function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize ${
        statusStyles.get(status) ??
        "border-white/10 bg-white/5 text-muted"
      }`}
    >
      {status}
    </span>
  );
}