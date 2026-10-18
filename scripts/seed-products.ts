
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { paddleProducts } from "../src/data/products";

loadEnvConfig(process.cwd());

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

if (!url || !secretKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(url, secretKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedProducts() {
  const products = paddleProducts.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    description: product.description,
    price: product.price,
    image: product.image,
    specs: product.specs,
    accent: product.accent,
    badge: product.badge,
    stock: 0,
    active: true,
  }));

  const { error } = await supabase
    .from("products")
    .upsert(products, { onConflict: "id" });

  if (error) {
    console.error("Product import failed:", error.message);
    process.exitCode = 1;
    return;
  }

  console.log(`Successfully imported ${products.length} products.`);
}

seedProducts().catch((error) => {
  console.error("Product import failed:", error.message);
  process.exitCode = 1;
});
