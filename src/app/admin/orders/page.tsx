import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/admin";
import OrdersList from "@/components/admin/OrdersList";
import AdminShell from "@/components/admin/AdminShell";
import AdminLoading from "@/components/admin/AdminLoading";

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={<AdminLoading activePage="orders" />}
    >
      <OrdersContent />
    </Suspense>
  );
}

async function OrdersContent() {
  await connection();
  const access = await getAdminAccess();

  if (access.status === "unauthenticated") {
    redirect("/admin/login");
  }

  if (access.status === "forbidden") {
    notFound();
  }

  return (
    <AdminShell activePage="orders">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent">
            ORDER MANAGEMENT
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Orders
          </h1>
          <p className="mt-2 text-sm text-muted">
            Review your latest 20 orders and manage their fulfillment.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
          <div className="overflow-x-auto">
            <OrdersList />
          </div>
        </div>

        <p className="mt-5 text-xs text-muted">
          Payment method and collection status are shown separately from fulfillment.
        </p>
      </main>
    </AdminShell>
  );
}
