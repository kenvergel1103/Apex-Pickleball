import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/admin";
import { connection } from "next/server";
import OrderCount from "@/components/admin/OrderCount";
import AdminShell from "@/components/admin/AdminShell";
import AdminLoading from "@/components/admin/AdminLoading";

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading activePage="overview" />}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  await connection();
  const access = await getAdminAccess();

  if (access.status === "unauthenticated") {
    redirect("/admin/login");
  }

  if (access.status === "forbidden") {
    notFound();
  }

  return (
  <AdminShell activePage="overview">
    <main className="mx-auto max-w-7xl px-6 py-8 lg:px-10 lg:py-10">
      <header className="mb-8 border-b border-white/10 pb-6">
        <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent">
          STORE MANAGEMENT
        </p>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Dashboard overview
        </h1>
        <p className="mt-2 text-sm text-muted">
          Monitor your orders and inventory.
        </p>
        <p className="mt-4 text-xs text-muted">
          Signed in as {access.email}
        </p>
      </header>

      <OrderCount />
    </main>
  </AdminShell>
);
}
