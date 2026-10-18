import { Suspense } from "react";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/admin";
import AdminShell from "@/components/admin/AdminShell";
import ProductsList from "@/components/admin/ProductsList";
import AdminLoading from "@/components/admin/AdminLoading";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<AdminLoading activePage="products" />}>
      <ProductsContent />
    </Suspense>
  );
}

async function ProductsContent() {
  await connection();
  const access = await getAdminAccess();

  if (access.status === "unauthenticated") {
    redirect("/admin/login");
  }

  if (access.status === "forbidden") {
    notFound();
  }

  return (
    <AdminShell activePage="products">
      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
        <header className="mb-8 border-b border-white/10 pb-6">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent">
            CATALOG MANAGEMENT
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Products & inventory
          </h1>
          <p className="mt-2 text-sm text-muted">
            Review product prices, stock levels, and storefront visibility.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface">
          <ProductsList />
        </div>
      </main>
    </AdminShell>
  );
}
