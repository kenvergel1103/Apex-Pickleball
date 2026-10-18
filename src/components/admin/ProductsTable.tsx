import Image from "next/image";
import StockBadge from "./StockBadge";
import Link from "next/link";

export type AdminProduct = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  stock: number;
  active: boolean;
  updated_at: string;
};

export default function ProductsTable({
  products,
}: {
  products: AdminProduct[];
}) {
  if (products.length === 0) {
    return <p className="p-6 text-sm text-muted">No products found.</p>;
  }

  return (
    <table className="w-full min-w-[700px] border-collapse text-left text-sm [&_th]:px-6 [&_th]:py-4 [&_td]:px-6 [&_td]:py-5">
      <caption className="sr-only">Products and inventory</caption>
      <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-muted">
        <tr>
          <th scope="col">Product</th>
          <th scope="col" className="text-right">
            Price
          </th>
          <th scope="col" className="text-right">
            Stock
          </th>
          <th scope="col">Visibility</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-white/10">
        {products.map((product) => (
          <tr
            key={product.id}
            className="transition-colors hover:bg-white/[0.03]"
          >
            <td>
              <div className="flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-background p-2">
                  <Image
                    src={product.image}
                    alt=""
                    width={40}
                    height={40}
                    className="size-10 object-contain"
                  />
                </div>

                <div>
                  <Link
                    href={`/admin/products/${encodeURIComponent(product.id)}`}
                    className="font-medium !text-accent underline-offset-4 hover:underline"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted">{product.category}</p>
                </div>
              </div>
            </td>
            <td className="text-right tabular-nums">
              {product.price.toLocaleString("en-PH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </td>
            <td className="text-right">
              <StockBadge stock={product.stock} />
            </td>
            <td>
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${
                  product.active
                    ? "border-accent/20 bg-accent/10 text-accent"
                    : "border-white/10 bg-white/5 text-muted"
                }`}
              >
                {product.active ? "Active" : "Inactive"}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
