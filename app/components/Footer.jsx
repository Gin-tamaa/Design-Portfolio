// Global footer rendered from app/layout.jsx so every route gets the
// same trailing block under page content.
//
// Layout, per the user's "Oh, hello." reference:
//   - left: friendly greeting headline, a short one-liner, the mailto
//   - right: nav links, all in one row
//   - below: the existing DitheringShader wave (light grey, transparent
//     bg) as the bleeding-from-bottom accent
//
// Small and sweet: tight vertical padding, no copyright line, content
// stays on one row at md+ and stacks on mobile.

import Link from "next/link";
import DitheringShader from "./DitheringShader";

const RESUME_URL =
  "https://drive.google.com/file/d/1YDaJC0uXaVJeEifMTljxjJ_GUZcG4RHg/view";

const EMAIL = "kamblesumedh39@gmail.com";

const NAV_LINKS = [
  { label: "Work",    href: "/work",          external: false },
  { label: "About",   href: "/about",         external: false },
  { label: "Contact", href: "/about#contact", external: false },
  { label: "Résumé",  href: RESUME_URL,       external: true  },
];

function FooterLink({ link }) {
  const cls =
    "text-[15px] tracking-[0.01em] text-[#0a0a0a] transition-colors hover:text-[#525252]";
  if (link.external) {
    return (
      <a
        href={link.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {link.label}
      </a>
    );
  }
  return (
    <Link
      href={link.href}
      className={cls}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {link.label}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer role="contentinfo" className="bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-6 pt-14 md:px-10 md:pt-16">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-10">
          {/* Left, friendly greeting + mailto */}
          <div className="md:col-span-7">
            <h2
              className="text-[24px] font-semibold leading-tight text-[#0a0a0a] md:text-[28px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Oh, hello.
            </h2>
            <p
              className="mt-3 max-w-[42ch] text-[15px] leading-[1.6] text-[#525252]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Feel free to reach out for collaborations or just a
              friendly hello.
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-2 inline-block text-[15px] text-[#0a0a0a] underline decoration-[#0a0a0a]/30 underline-offset-[5px] transition-colors hover:decoration-[#0a0a0a]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {EMAIL}
            </a>
          </div>

          {/* Right, nav row */}
          <nav
            className="md:col-span-5 md:flex md:justify-end"
            aria-label="Footer navigation"
          >
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Light-grey dithering wave bleeds from the bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative mt-12 w-full md:mt-14"
        style={{ height: "clamp(120px, 16vh, 180px)" }}
      >
        <DitheringShader
          shape="wave"
          type="8x8"
          pxSize={3}
          speed={0.6}
          colorBack="#00000000"
          colorFront="#dddddd"
        />
      </div>
    </footer>
  );
}
