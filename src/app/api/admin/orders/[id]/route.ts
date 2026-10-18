import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/auth/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getNextOrderStatus } from "@/lib/orders/status";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const access = await getAdminAccess();

  if (access.status === "unauthenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (access.status === "forbidden") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid order ID." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
  id,
  order_number,
  status,
  payment_status,
  payment_method,
  customer_name,
  email,
  phone,
  shipping_address,
  shipping_city,
  shipping_region,
  shipping_postal_code,
  shipping_country,
  subtotal,
  shipping_fee,
  total,
  created_at
`,
    )
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Could not load orders:", error);
    return NextResponse.json(
      { error: "Could not load orders." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("order_items")
    .select("id, product_name, unit_price, quantity, line_total")
    .eq("order_id", id)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (itemsError) {
    console.error("Could not load order items:", itemsError);
    return NextResponse.json(
      { error: "Could not load order items." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { order: data, items: items ?? [] },
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

  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "Invalid order ID." }, { status: 400 });
  }

  const body: unknown = await request.json().catch(() => null);

  if (
    !body ||
    typeof body !== "object" ||
    !("expectedStatus" in body) ||
    !("status" in body) ||
    typeof body.expectedStatus !== "string" ||
    typeof body.status !== "string" ||
    getNextOrderStatus(body.expectedStatus) !== body.status
  ) {
    return NextResponse.json(
      { error: "Invalid status change." },
      { status: 400 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status: body.status })
    .eq("id", id)
    .eq("status", body.expectedStatus)
    .select("id, status")
    .maybeSingle();

  if (error) {
    console.error("Could not update order status:", error);
    return NextResponse.json(
      { error: "Could not update order status." },
      { status: 500 },
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "Order changed or was removed. Refresh before trying again." },
      { status: 409 },
    );
  }

  return NextResponse.json(
    { order: data },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
