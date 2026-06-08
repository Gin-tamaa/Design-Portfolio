"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
  { href: "/resume", label: "Resume" },
];

// Lives in app/layout.jsx so every route has a path home + visible nav.
// Mobile (<768px): hamburger toggles a stacked dropdown panel below the bar.

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";

  const isActive = (href) => {
    // strip hash for comparison so /#contact never reads as active
    if (href.includes("#")) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 h-16 bg-white/70 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6 md:px-10">
          {/* Wordmark — home */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="Sumedh Kamble — home"
            className="text-[18px] font-semibold tracking-[-0.02em] text-[#0a0a0a] transition-colors hover:text-[#525252]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            S&mdash;K
          </Link>

          {/* Desktop links */}
          <nav className="hidden items-center md:flex" style={{ gap: 28 }} aria-label="Primary">
            {LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-[14px] tracking-[0.02em] transition-colors ${
                    active
                      ? "font-semibold text-[#0a0a0a]"
                      : "font-normal text-[#0a0a0a] hover:text-[#525252]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="nav-mobile-panel"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md text-[#0a0a0a] transition-colors hover:bg-black/[0.04] md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M6 18L18 6"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile dropdown panel */}
      {open ? (
        <div
          id="nav-mobile-panel"
          className="fixed inset-x-0 top-16 z-30 border-b border-[#E5E5E5] bg-white md:hidden"
        >
          <nav className="flex flex-col py-2" aria-label="Primary mobile">
            {LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`px-6 py-4 text-[16px] tracking-[0.01em] transition-colors ${
                    active
                      ? "font-semibold text-[#0a0a0a]"
                      : "font-normal text-[#0a0a0a] hover:bg-black/[0.04]"
                  }`}
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </>
  );
}
