
import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductGrid from "@/components/products/ProductGrid";
import { getProducts } from "@/lib/supabase/products";
import { paddleProducts } from "@/data/products";

async function CollectionContent() {
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

  return <ProductGrid products={products} />;
}

export default function CollectionPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />

      <Suspense
        fallback={
          <section className="container-main min-h-[500px] py-24 sm:py-32">
            <p className="text-muted">Loading the paddle collection...</p>
          </section>
        }
      >
        <CollectionContent />
      </Suspense>

      <Footer />
    </main>
  );
}
