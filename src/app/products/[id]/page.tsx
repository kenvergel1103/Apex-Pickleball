
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductPurchasePanel from "@/components/products/ProductPurchasePanel";
import { getProducts } from "@/lib/supabase/products";
import { paddleProducts } from "@/data/products";
import { Suspense } from "react";

export function generateStaticParams() {
  return paddleProducts.map((product) => ({
    id: product.id,
  }));
}

type ProductPageProps = {
  params: Promise<{ id: string }>;
};


async function ProductContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let products;

  try {
    products = await getProducts();
  } catch (error) {
    console.error(
      "Using local products because Supabase could not load:",
      error,
    );
    products = paddleProducts;
  }

  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <section className="container-main py-12 sm:py-20">
      <Link
        href="/collection"
        className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent"
      >
        <ArrowLeft size={16} />
        Back to collection
      </Link>

      <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:min-h-[520px]">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-[480px] w-full object-contain"
          />
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold tracking-[0.25em] text-accent">
            {product.category}
          </p>

          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl">
            {product.name}
          </h1>

          <p className="mt-5 text-3xl font-semibold">
            ₱{product.price.toLocaleString("en-PH")}
          </p>

          <p className="mt-6 max-w-xl leading-8 text-muted">
            {product.description}
          </p>

          <div className="mt-8 border-t border-white/10 pt-6">
            <h2 className="text-sm font-semibold">
              Product specifications
            </h2>

            <ul className="mt-4 space-y-3">
              {product.specs.map((spec) => (
                <li
                  key={spec.label}
                  className="flex items-start gap-3 text-sm text-muted"
                >
                  <Check
                    size={17}
                    className="mt-0.5 shrink-0 text-accent"
                  />
                  <span>
                    <span className="font-medium text-foreground">
                      {spec.label}:
                    </span>{" "}
                    {spec.value}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <ProductPurchasePanel product={product} />
          </div>

        </div>
      </div>
    </section>
  );
}

export default function ProductPage({
  params,
}: ProductPageProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <Suspense
        fallback={
          <section className="container-main min-h-[500px] py-24">
            <p className="text-muted">
              Loading product details...
            </p>
          </section>
        }
      >
        <ProductContent params={params} />
      </Suspense>

      <Footer />
    </main>
  );
}
