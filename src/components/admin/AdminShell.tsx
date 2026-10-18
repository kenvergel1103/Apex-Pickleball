import type { ReactNode } from "react";
import Link from "next/link";
import { logout } from "@/app/admin/actions";

type AdminShellProps = {
  children: ReactNode;
  activePage: "overview" | "orders" | "products";
};

const links = [
  { label: "Overview", href: "/admin", key: "overview" },
  { label: "Orders", href: "/admin/orders", key: "orders" },
  { label: "Products", href: "/admin/products", key: "products" },
];

export default function AdminShell({ children, activePage }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <aside className="flex flex-col border-b border-white/10 bg-surface p-6 lg:fixed lg:inset-y-0 lg:w-64 lg:border-r lg:border-b-0">
        <Link href="/admin" className="font-display text-2xl font-bold">
          APEX<span className="text-accent">.</span>
        </Link>

        <p className="mt-2 text-xs tracking-[0.2em] text-muted">
          ADMIN WORKSPACE
        </p>

        <nav
          aria-label="Admin navigation"
          className="mt-8 grid grid-cols-2 gap-2 lg:grid-cols-1"
        >
          {links.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              aria-current={activePage === link.key ? "page" : undefined}
              className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                activePage === link.key
                  ? "bg-accent !text-black"
                  : "!text-muted hover:bg-white/5 hover:!text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 space-y-4 border-t border-white/10 pt-6 lg:mt-auto">
          <Link href="/" className="block text-sm">
            View storefront ↗
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-muted transition hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-64">{children}</div>
    </div>
  );
}
