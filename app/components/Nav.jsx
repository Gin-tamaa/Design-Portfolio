"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ⚠️  Drop the Google Drive share link here when you have it. The Resume
// nav item opens this URL in a new tab — never navigates in-page.
const RESUME_URL = "https://drive.google.com/file/d/1YDaJC0uXaVJeEifMTljxjJ_GUZcG4RHg/view";

// `external: true` renders as <a target="_blank" rel="noopener noreferrer">
// instead of a Next.js <Link>. Hash-anchored items keep using <Link> so the
// router resolves the hash inside the destination page (/about#contact).
const LINKS = [
  { href: "/about",           label: "About" },
  { href: RESUME_URL,         label: "Resume", external: true },
];

// Lives in app/layout.jsx so every route has a path home + visible nav.
// Mobile (<768px): hamburger toggles a stacked dropdown panel below the bar.

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";

  const isActive = (href) => {
    // strip hash for comparison so /about#contact never reads as active
    if (href.includes("#")) return false;
    if (href.startsWith("http")) return false; // external links never active
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Single render path for both desktop + mobile nav items — adds the
  // external-link attrs on external entries, uses next/link for the rest.
  const renderLink = (link, extraClass, onClick) => {
    const active = isActive(link.href);
    const className = `${extraClass} ${
      active
        ? "font-semibold text-[#0a0a0a]"
        : "font-normal text-[#0a0a0a] hover:text-[#525252]"
    }`;

    if (link.external) {
      return (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={className}
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {link.label}
        </a>
      );
    }
    return (
      <Link
        key={link.label}
        href={link.href}
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={className}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {link.label}
      </Link>
    );
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 h-16 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6 md:px-10">
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label="Sumedh Kamble — home"
            className="inline-flex items-center text-[#0a0a0a] transition-colors hover:text-[#525252]"
          >
            {/* Logo monogram, inlined so fill:currentColor inherits the
                nav's color cascade (black on the white nav, white on the
                ShopOS dark-hero inversion). viewBox is cropped to the
                glyph so the mark fills its box. */}
            <svg
              viewBox="180 154 270 367"
              aria-hidden="true"
              style={{ height: 26, width: "auto", display: "block" }}
              fill="currentColor"
            >
              <path d="M450 154.719V199.952H404.365V409.431H398.133L356.116 368.017V289.815C339.631 297.722 324.956 301.676 312.089 301.676C298.553 301.676 284.279 299.062 269.269 293.835C264.578 302.413 256.47 312.465 244.944 323.991C261.16 344.094 283.14 368.755 310.883 397.972L296.007 409.833C230.201 343.625 197.298 296.047 197.298 267.098C197.298 259.324 199.51 252.958 203.932 247.999C208.489 242.906 213.783 240.36 219.814 240.36C225.711 240.36 233.417 242.303 242.933 246.19C245.346 236.808 246.552 228.834 246.552 222.267C246.552 215.7 245.346 208.261 242.933 199.952H180.411V154.719H450ZM356.116 199.952H281.733C284.682 211.478 286.156 222.602 286.156 233.324C286.156 242.973 284.95 252.288 282.537 261.268C293.125 265.69 303.11 267.902 312.491 267.902C331.925 267.902 346.466 259.927 356.116 243.979V199.952Z" />
              <path d="M361.343 436.37L351.09 398.575C358.328 397.235 365.565 396.564 372.802 396.564C396.256 396.564 414.617 401.858 427.886 412.446C441.154 423.168 447.788 437.844 447.788 456.473C447.788 474.566 441.556 489.778 429.092 502.108C416.494 514.438 400.009 520.603 379.637 520.603C353.771 520.603 330.049 512.83 308.471 497.283C286.759 481.871 268.867 459.69 254.794 430.741H275.702C284.682 446.555 298.821 458.684 318.12 467.128C337.286 475.705 359.467 479.994 384.663 479.994C410.932 479.994 424.066 472.891 424.066 458.684C424.066 451.849 420.515 446.22 413.411 441.797C406.308 437.509 396.725 435.364 384.663 435.364C375.416 435.364 367.642 435.699 361.343 436.37Z" />
            </svg>
          </Link>

          <nav className="hidden items-center md:flex" style={{ gap: 28 }} aria-label="Primary">
            {LINKS.map((link) =>
              renderLink(link, "text-[14px] tracking-[0.02em] transition-colors")
            )}
          </nav>

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

      {open ? (
        <div
          id="nav-mobile-panel"
          className="fixed inset-x-0 top-16 z-30 border-b border-[#E5E5E5] bg-white md:hidden"
        >
          <nav className="flex flex-col py-2" aria-label="Primary mobile">
            {LINKS.map((link) =>
              renderLink(
                link,
                "px-6 py-4 text-[16px] tracking-[0.01em] transition-colors",
                () => setOpen(false)
              )
            )}
          </nav>
        </div>
      ) : null}
    </>
  );
}
