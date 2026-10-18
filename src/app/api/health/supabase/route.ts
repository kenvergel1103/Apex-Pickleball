import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const { error } = await supabaseAdmin
      .from("products")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Supabase connection test failed:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return NextResponse.json(
        { ok: false, message: "Database connection test failed." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Supabase connection successful.",
    });
  } catch (error) {
    console.error("Supabase connection test error:", error);

    return NextResponse.json(
      { ok: false, message: "Database connection test failed." },
      { status: 500 },
    );
  }
}
