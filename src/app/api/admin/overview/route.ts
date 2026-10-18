import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/auth/admin";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const access = await getAdminAccess();

  if (access.status === "unauthenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (access.status === "forbidden") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { count, error } = await supabaseAdmin
    .from("orders")
    .select("id", { count: "exact" })
    .limit(1);

  if (error) {
    console.error("Could not count orders:", {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });

    return NextResponse.json(
      { error: "Could not load the admin overview." },
      { status: 500 },
    );
  }

  const { count: pendingCount, error: pendingError } = await supabaseAdmin
    .from("orders")
    .select("id", { count: "exact" })
    .eq("status", "pending")
    .limit(1);

  if (pendingError) {
    console.error("Could not count pending orders:", pendingError);
    return NextResponse.json(
      { error: "Could not load the admin overview." },
      { status: 500 },
    );
  }

  const { count: onlineCheckoutCount, error: onlineCheckoutError } =
    await supabaseAdmin
      .from("orders")
      .select("id", { count: "exact" })
      .eq("payment_method", "online")
      .eq("payment_status", "simulated_paid")
      .limit(1);

  if (onlineCheckoutError) {
    console.error("Could not count online checkouts:", onlineCheckoutError);
    return NextResponse.json(
      { error: "Could not load the admin overview." },
      { status: 500 },
    );
  }

  const { count: lowStockCount, error: lowStockError } = await supabaseAdmin
    .from("products")
    .select("id", { count: "exact" })
    .eq("active", true)
    .lte("stock", 5)
    .limit(1);

  if (lowStockError) {
    console.error("Could not count low-stock products:", lowStockError);
    return NextResponse.json(
      { error: "Could not load the admin overview." },
      { status: 500 },
    );
  }

  const { data: orderTotal, error: valueError } = await supabaseAdmin.rpc(
    "get_admin_test_order_value",
  );

  if (valueError) {
    console.error("Could not calculate order total:", valueError);
    return NextResponse.json(
      { error: "Could not load the admin overview." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      totalOrders: count ?? 0,
      pendingOrders: pendingCount ?? 0,
      onlineCheckouts: onlineCheckoutCount ?? 0,
      lowStockProducts: lowStockCount ?? 0,
      orderTotal: Number(orderTotal),
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
