import { getProducts } from "@/lib/supabase/products";
import { paddleProducts } from "@/data/products";
import PaddleShowcase from "@/components/showcase/PaddleShowcase";

export default async function PaddleShowcaseLoader() {
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

  return <PaddleShowcase products={products} />;
}