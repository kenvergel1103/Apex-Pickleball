import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import { notFound, redirect } from "next/navigation";
import { getAdminAccess } from "@/lib/auth/admin";
import AdminShell from "@/components/admin/AdminShell";
import ProductEditor from "@/components/admin/ProductEditor";
import AdminLoading from "@/components/admin/AdminLoading";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function AdminProductPage({ params }: PageProps) {
  return (
    <Suspense fallback={<AdminLoading activePage="products" />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: PageProps) {
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
    <AdminShell activePage="products">
      <main className="mx-auto max-w-4xl px-6 py-8 lg:px-10 lg:py-10">
        <header className="mb-8 border-b border-white/10 pb-6">
          <Link
            href="/admin/products"
            className="mb-5 inline-flex text-sm !text-muted hover:!text-white"
          >
            ← Back to products
          </Link>

          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent">
            CATALOG MANAGEMENT
          </p>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Edit product
          </h1>
          <p className="mt-2 text-sm text-muted">
            Review pricing, inventory, and storefront visibility.
          </p>
        </header>

        <ProductEditor key={id} productId={id} />
      </main>
    </AdminShell>
  );
}
