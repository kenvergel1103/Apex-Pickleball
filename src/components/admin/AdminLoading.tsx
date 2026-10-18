import AdminShell from "@/components/admin/AdminShell";

type AdminLoadingProps = {
  activePage: "overview" | "orders" | "products";
};

export default function AdminLoading({ activePage }: AdminLoadingProps) {
  return (
    <AdminShell activePage={activePage}>
      <main
        aria-label="Loading admin workspace"
        aria-busy="true"
        className="mx-auto min-h-screen max-w-7xl px-6 py-8 lg:px-10 lg:py-10"
      >
        <div className="mb-8 border-b border-white/10 pb-6">
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-accent">
            ADMIN WORKSPACE
          </p>
          <div className="h-9 w-56 animate-pulse rounded-lg bg-white/10" />
          <p className="mt-3 text-sm text-muted">Loading your workspace...</p>
        </div>

        <div className="animate-pulse space-y-4" aria-hidden="true">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="h-32 rounded-2xl border border-white/10 bg-surface" />
            <div className="h-32 rounded-2xl border border-white/10 bg-surface" />
            <div className="h-32 rounded-2xl border border-white/10 bg-surface" />
          </div>
          <div className="h-56 rounded-2xl border border-white/10 bg-surface" />
        </div>
      </main>
    </AdminShell>
  );
}
