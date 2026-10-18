import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type CheckoutRequest = {
  paymentMethod: "online" | "cash_on_delivery";
  customer: {
    fullName: string;
    email: string;
    phone: string;
    country: string;
    address: string;
    apartment?: string;
    city: string;
    region: string;
    postalCode: string;
  };
  items: {
    productId: string;
    quantity: number;
  }[];
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CheckoutRequest;
    const customer = body?.customer;
    const items = body?.items;
    const paymentMethod = body?.paymentMethod;

    if (paymentMethod !== "online" && paymentMethod !== "cash_on_delivery") {
      return NextResponse.json(
        { error: "Please select a valid payment method." },
        { status: 400 },
      );
    }

    if (
      !customer ||
      !isNonEmptyString(customer.fullName) ||
      !isNonEmptyString(customer.email) ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) ||
      !isNonEmptyString(customer.phone) ||
      !isNonEmptyString(customer.country) ||
      !isNonEmptyString(customer.address) ||
      !isNonEmptyString(customer.city) ||
      !isNonEmptyString(customer.region) ||
      !isNonEmptyString(customer.postalCode)
    ) {
      return NextResponse.json(
        { error: "Please provide valid customer and shipping details." },
        { status: 400 },
      );
    }

    if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
      return NextResponse.json(
        { error: "Your cart is empty or invalid." },
        { status: 400 },
      );
    }

    const combinedItems = new Map<string, number>();

    for (const item of items) {
      if (
        !item ||
        typeof item.productId !== "string" ||
        item.productId.trim() === "" ||
        !Number.isSafeInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 100
      ) {
        return NextResponse.json(
          { error: "One or more cart items are invalid." },
          { status: 400 },
        );
      }

      const productId = item.productId.trim();
      const quantity = (combinedItems.get(productId) ?? 0) + item.quantity;

      if (quantity > 100) {
        return NextResponse.json(
          { error: "The quantity for an item is too high." },
          { status: 400 },
        );
      }

      combinedItems.set(productId, quantity);
    }

    const rpcItems = Array.from(combinedItems, ([productId, quantity]) => ({
      productId,
      quantity,
    }));

    const { data, error } = await supabaseAdmin.rpc("create_store_order", {
      p_customer_name: customer.fullName.trim(),
      p_email: customer.email.trim(),
      p_phone: customer.phone.trim(),
      p_shipping_address: [customer.address.trim(), customer.apartment?.trim()]
        .filter(Boolean)
        .join(", "),
      p_shipping_city: customer.city.trim(),
      p_shipping_region: customer.region.trim(),
      p_shipping_postal_code: customer.postalCode.trim(),
      p_shipping_country: customer.country.trim(),
      p_items: rpcItems,
      p_payment_method: paymentMethod,
    });

    if (error) {
      console.error("Create order RPC failed:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return NextResponse.json(
        {
          error: error.message,
          code: error.code,
        },
        { status: 400 },
      );
    }
    const order = Array.isArray(data) ? data[0] : data;

    if (!order?.order_number) {
      return NextResponse.json(
        {
          error:
            "The order was not confirmed. Please contact support before retrying.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { orderNumber: order.order_number },
      { status: 201 },
    );
  } catch (error) {
    console.error("Unexpected checkout error:", error);

    return NextResponse.json(
      { error: "An unexpected error occurred while creating your order." },
      { status: 500 },
    );
  }
}
