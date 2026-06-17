// Global footer rendered from app/layout.jsx so every route gets the
// same trailing nav + brand block beneath the page content.
//
// Surface matches the body bg in app/layout.jsx (#ffffff) so the
// footer reads as part of the same page rather than a separate
// shaded strip. A hairline black/10 top border carries the visual
// break since the colours are now identical.
//
// SOCIALS lives at the top of the file as an array so adding another
// platform is a one-line edit.

import Link from "next/link";
import DitheringShader from "./DitheringShader";

const RESUME_URL =
  "https://drive.google.com/file/d/1YDaJC0uXaVJeEifMTljxjJ_GUZcG4RHg/view";

const EMAIL = "kamblesumedh39@gmail.com";

const NAV_LINKS = [
  { label: "Work",    href: "/work",          external: false },
  { label: "About",   href: "/about",         external: false },
  { label: "Contact", href: "/about#contact", external: false },
  { label: "Resume",  href: RESUME_URL,       external: true  },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/isumedhux" },
];

function FooterLink({ link }) {
  const cls =
    "text-[14px] tracking-[0.02em] text-[#0a0a0a] transition-colors hover:text-[#525252]";
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
    <footer
      role="contentinfo"
      className="border-t border-black/10"
      style={{ background: "#ffffff" }}
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* Brand block — wordmark + mailto */}
          <div className="md:col-span-5">
            <Link
              href="/"
              aria-label="Sumedh Kamble — home"
              className="inline-block text-[18px] font-semibold tracking-[-0.02em] text-[#0a0a0a] transition-colors hover:text-[#525252]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              S&mdash;K
            </Link>
            <div className="mt-6">
              <a
                href={`mailto:${EMAIL}`}
                className="text-[14px] tracking-[0.01em] text-[#0a0a0a] transition-colors hover:text-[#525252]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {EMAIL}
              </a>
            </div>
          </div>

          {/* Site nav */}
          <nav className="md:col-span-4" aria-label="Footer site navigation">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#525252]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Site
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink link={link} />
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials — add more by appending to SOCIALS at the top */}
          <nav className="md:col-span-3" aria-label="Footer social links">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#525252]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Elsewhere
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] tracking-[0.02em] text-[#0a0a0a] transition-colors hover:text-[#525252]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

      </div>

      {/* Pink dithering wave, bleeds from the bottom edge of the
          footer. Taller canvas pushes the wave further up the
          page, transparent bg (#00000000) so only the pink dots
          land on the white surface — no black plate. Lighter
          pink (#f472b6 ~ tailwind pink-400) per user feedback. */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative w-full"
        style={{ height: "clamp(300px, 42vh, 460px)" }}
      >
        <DitheringShader
          shape="wave"
          type="8x8"
          pxSize={3}
          speed={0.6}
          colorBack="#00000000"
          colorFront="#f472b6"
        />
      </div>
    </footer>
  );
}
