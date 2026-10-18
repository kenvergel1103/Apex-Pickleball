"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import Link from "next/link";

export default function AdminLoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    null,
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12 font-sans">
      <section
        aria-labelledby="admin-login-title"
        className="w-full max-w-md rounded-3xl border border-white/10 bg-surface p-6 shadow-2xl sm:p-10"
      >
        <Link
          href="/"
          aria-label="APEX storefront"
          className="inline-flex font-display text-2xl font-bold"
        >
          APEX<span className="text-accent">.</span>
        </Link>

        <header className="my-8">
          <p className="mb-2 text-xs font-semibold tracking-[0.2em] text-accent">
            ADMIN WORKSPACE
          </p>
          <h1
            id="admin-login-title"
            className="font-display text-3xl font-bold tracking-tight"
          >
            Welcome back
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Sign in to manage your store, orders, and inventory.
          </p>
        </header>

        <form action={formAction} className="space-y-4">
          <label className="block">
            <span>Email</span>
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              className="mt-2 block w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>

          <label className="block">
            <span>Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="mt-2 block w-full rounded-xl border border-white/10 bg-background px-4 py-3 text-sm text-white outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>

          {state?.error && (
            <p
              role="alert"
              className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300"
            >
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="w-full rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-wait disabled:opacity-50"
          >
            {pending ? "Signing in..." : "Sign in"}
          </button>
        </form>
        <p className="mt-6 text-center text-xs text-muted">
          Authorized administrators only
        </p>
      </section>
    </main>
  );
}
