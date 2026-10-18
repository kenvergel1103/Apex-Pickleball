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

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      "id, order_number, status, payment_status, payment_method, total, created_at",
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Could not load orders:", error);
    return NextResponse.json(
      { error: "Could not load orders." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { orders: data ?? [] },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
