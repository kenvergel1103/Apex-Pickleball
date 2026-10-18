import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Collection", href: "/collection" },
  { label: "Technology", href: "/#technology" },
  { label: "Our Story", href: "/#story" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080909]">
      <div className="container-main py-14 sm:py-20">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-2xl font-bold tracking-tight"
            >
              APEX
              <span className="text-accent">.</span>
            </Link>

            <p className="text-muted mt-5 max-w-sm text-sm leading-7">
              Equipment for players who demand more. Find your rhythm, sharpen
              your precision, and own every point.
            </p>

            <Link
              href="/collection"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold !text-black transition hover:opacity-80"
            >
              Explore the collection
              <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="md:justify-self-end">
            <p className="text-xs font-semibold tracking-[0.25em] text-accent">
              EXPLORE APEX
            </p>

            <nav
              aria-label="Footer navigation"
              className="mt-5 flex flex-col items-start gap-4"
            >
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted text-sm transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 APEX Pickleball. All rights reserved.</p>

          <p>BUILT FOR THE NEXT POINT.</p>
        </div>
      </div>
    </footer>
  );
}
