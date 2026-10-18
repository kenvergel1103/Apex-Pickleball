import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/auth/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const access = await getAdminAccess();

  if (access.status !== "authorized") {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: access.status === "unauthenticated" ? 401 : 403 },
    );
  }

  const { data, count, error } = await supabaseAdmin
    .from("products")
    .select("id, name, category, image, price, stock, active, updated_at", {
      count: "exact",
    })
    .order("name", { ascending: true })
    .order("id", { ascending: true })
    .limit(100);

  if (error) {
    console.error("Could not load admin products:", error);
    return NextResponse.json(
      { error: "Could not load products." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      products: (data ?? []).map((product) => ({
        ...product,
        price: Number(product.price),
      })),
      totalProducts: count ?? 0,
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
