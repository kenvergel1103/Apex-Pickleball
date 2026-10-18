import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/auth/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  isValidProductPrice,
  isValidProductStock,
} from "@/lib/products/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await getAdminAccess();

  if (access.status !== "authorized") {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: access.status === "unauthenticated" ? 401 : 403 },
    );
  }

  const { id } = await params;

  const { data, error } = await supabaseAdmin
    .from("products")
    .select(
      "id, name, category, image, price, stock, active, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Could not load admin product:", error);
    return NextResponse.json(
      { error: "Could not load product." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json(
    { product: { ...data, price: Number(data.price) } },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await getAdminAccess();

  if (access.status !== "authorized") {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: access.status === "unauthenticated" ? 401 : 403 },
    );
  }

  const { id } = await params;
  const body: unknown = await request.json().catch(() => null);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { price, stock, active, expectedUpdatedAt } = body as Record<
    string,
    unknown
  >;

  if (
    !isValidProductPrice(price) ||
    !isValidProductStock(stock) ||
    typeof active !== "boolean" ||
    typeof expectedUpdatedAt !== "string" ||
    expectedUpdatedAt.length === 0
  ) {
    return NextResponse.json(
      { error: "Enter a valid price, stock quantity, and visibility setting." },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("products")
    .update({
      price,
      stock,
      active,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("updated_at", expectedUpdatedAt)
    .select("id, name, category, image, price, stock, active, updated_at")
    .maybeSingle();

  if (error) {
    console.error("Could not update admin product:", error);
    return NextResponse.json(
      { error: "Could not save product changes." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      {
        error:
          "This product changed since it was loaded. Refresh and try again.",
      },
      { status: 409 },
    );
  }

  return NextResponse.json(
    { product: { ...data, price: Number(data.price) } },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
