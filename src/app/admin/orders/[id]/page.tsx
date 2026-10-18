import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/admin";
import OrderDetails from "@/components/admin/OrderDetails";
import AdminShell from "@/components/admin/AdminShell";
import AdminLoading from "@/components/admin/AdminLoading";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function AdminOrderPage({ params }: PageProps) {
  return (
    <Suspense fallback={<AdminLoading activePage="orders" />}>
      <OrderContent params={params} />
    </Suspense>
  );
}

async function OrderContent({ params }: PageProps) {
  await connection();
  const access = await getAdminAccess();

  if (access.status === "unauthenticated") {
    redirect("/admin/login");
  }

  if (access.status === "forbidden") {
    notFound();
  }

  const { id } = await params;

  return (
    <AdminShell activePage="orders">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <header className="mb-8 border-b border-white/10 pb-6">
          <Link
            href="/admin/orders"
            className="mb-5 inline-flex text-sm !text-muted transition hover:!text-white"
          >
            ← Back to orders
          </Link>

          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent">
            ORDER MANAGEMENT
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Order details
          </h1>
          <p className="mt-2 text-sm text-muted">
            Review customer information, purchased products, and fulfillment.
          </p>
        </header>

        <OrderDetails key={id} orderId={id} />
      </main>
    </AdminShell>
  );
}
