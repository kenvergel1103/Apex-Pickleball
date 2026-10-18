
import "server-only";

import { supabaseAdmin } from "@/lib/supabase/admin";
import type { PaddleProduct } from "@/data/products";

export async function getProducts(): Promise<PaddleProduct[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(
      "id, name, category, price, description, specs, image, accent, badge",
    )
    .eq("active", true);

  if (error) {
    console.error("Failed to fetch products:", error.message);
    throw new Error("Unable to load products from Supabase.");
  }
  

  return (data ?? []).map((product) => ({
    ...product,
    price: Number(product.price),
    specs: product.specs as PaddleProduct["specs"],
  }));
}
