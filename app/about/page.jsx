"use client";

// About page. White editorial theme (the site canvas), left-aligned, my
// type system: Playfair Display italic accent, Inter UI, League Spartan
// small meta. Layout rhymes with the Joseph Zhang reference (header row,
// ABOUT / WORK / LINKS columns, a packed masonry feed) but in my palette.
//
// Client component because the workflow feed opens a lightbox carousel
// (zoom + keyboard + body-scroll lock), which needs state. Because of
// that, there is no metadata export here (client components can't); the
// title falls back to the root layout default.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

const EMAIL = "kamblesumedh39@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/sumedhux";
const DREAMCALL_URL =
  "https://www.figma.com/proto/rVZrlv1O9JKBFDgwjzkzVI/Presentation-DreamCall?node-id=1-106";

/* ---- Workflow feed data -------------------------------------------------
   PLACEHOLDER assets: real images/videos get swapped in later. Each item
   carries its intended filename (shown faint in the placeholder box) and a
   natural aspect ratio (w/h) so the masonry staggers. Aspect ratios are
   deliberately mixed (3:4, 1:1, 4:3, 16:9) so the column packing reads
   uneven, not like a uniform grid. */
const img = (src, w, h) => ({ type: "image", src, w, h });
const vid = (src, w, h) => ({ type: "video", src, w, h });

const WORKFLOWS = [
  {
    id: "cgi-ad",
    title: "CGI Ad Pipeline",
    caption: "Product Film",
    items: [
      vid("/images/wf-cgi-01.mp4", 3, 4),
      vid("/images/wf-cgi-02.mp4", 16, 9),
      vid("/images/wf-cgi-03.mp4", 1, 1),
      vid("/images/wf-cgi-04.mp4", 3, 4),
    ],
  },
  {
    id: "sneaker",
    title: "Sneaker Architect",
    caption: "Ecommerce Render System",
    items: [
      img("/images/wf-sneaker-01.png", 1, 1),
      img("/images/wf-sneaker-02.png", 3, 4),
      img("/images/wf-sneaker-03.png", 4, 3),
      img("/images/wf-sneaker-04.png", 1, 1),
      img("/images/wf-sneaker-05.png", 16, 9),
      img("/images/wf-sneaker-06.png", 3, 4),
    ],
  },
  {
    id: "fashion",
    title: "Fashion Engine",
    caption: "Garment Forensics to Editorial",
    items: [
      img("/images/wf-fashion-01.png", 3, 4),
      img("/images/wf-fashion-02.png", 1, 1),
      img("/images/wf-fashion-03.png", 3, 4),
      img("/images/wf-fashion-04.png", 4, 3),
      img("/images/wf-fashion-05.png", 3, 4),
      img("/images/wf-fashion-06.png", 16, 9),
    ],
  },
  {
    id: "spaces",
    title: "Spaces",
    caption: "Deterministic Photoshoots",
    items: [
      img("/images/wf-spaces-01.png", 16, 9),
      img("/images/wf-spaces-02.png", 4, 3),
      img("/images/wf-spaces-03.png", 1, 1),
      img("/images/wf-spaces-04.png", 3, 4),
      img("/images/wf-spaces-05.png", 4, 3),
      img("/images/wf-spaces-06.png", 16, 9),
    ],
  },
  {
    id: "character",
    title: "Character System",
    caption: "Anime Portrait Pipeline",
    items: [
      img("/images/wf-character-01.png", 4, 3),
      img("/images/wf-character-02.png", 3, 4),
      img("/images/wf-character-03.png", 1, 1),
      img("/images/wf-character-04.png", 3, 4),
    ],
  },
  {
    id: "shopos-film",
    title: "ShopOS Film",
    caption: "Voxel Announcement",
    items: [
      vid("/images/wf-shopos-01.mp4", 16, 9),
      vid("/images/wf-shopos-02.mp4", 1, 1),
      vid("/images/wf-shopos-03.mp4", 16, 9),
    ],
  },
];

/* ---- Small helpers ------------------------------------------------------ */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function FaintLabel({ children, className = "" }) {
  return (
    <p
      className={`text-[12px] uppercase tracking-[0.2em] text-[#aaaaaa] ${className}`}
      style={{ fontFamily: "'League Spartan', sans-serif", fontWeight: 400 }}
    >
      {children}
    </p>
  );
}

function UpRight() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="ml-1 inline-block translate-y-[-1px] text-[#aaaaaa] transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[-3px]"
    >
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Placeholder asset box: #f6f6f6 fill at the item's natural aspect, with
// its intended filename centered faint. PLACEHOLDER: when real assets
// exist, render <img>/<video> here instead. Images stay zoomable in the
// lightbox; videos render as <video controls playsInline> and do not zoom.
function PlaceholderBox({ item, rounded = true, style }) {
  return (
    <div
      className={`relative w-full bg-[#f6f6f6] ${rounded ? "rounded-[4px]" : ""}`}
      style={{ aspectRatio: `${item.w} / ${item.h}`, ...style }}
    >
      <span
        className="absolute inset-0 flex items-center justify-center px-4 text-center text-[11px] text-[#aaaaaa]"
        style={{ fontFamily: "Inter, sans-serif" }}
      >
        {item.type === "video" ? "video, " : ""}
        {item.src}
      </span>
    </div>
  );
}

/* ---- Lightbox carousel -------------------------------------------------- */

function Lightbox({ workflow, index, onIndex, onClose }) {
  const items = workflow.items;
  const item = items[index];
  const total = items.length;
  const reduced = usePrefersReducedMotion();
  const closeRef = useRef(null);
  const touchX = useRef(null);

  // {x,y} in percent when zoomed, null when not. Images only.
  const [zoom, setZoom] = useState(null);

  const go = useCallback(
    (next) => onIndex(Math.max(0, Math.min(total - 1, next))),
    [onIndex, total]
  );

  // Reset zoom whenever the visible item changes.
  useEffect(() => setZoom(null), [index]);

  // Focus the close button on open.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Lock body scroll while open; restore on close.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Esc closes; arrows navigate (clamped at the ends).
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(index - 1);
      else if (e.key === "ArrowRight") go(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, go, onClose]);

  const isImage = item.type === "image";
  const aspect = item.w / item.h;
  const transition = reduced ? "none" : "transform 0.25s ease";

  function toggleZoom(e) {
    if (!isImage) return;
    if (zoom) {
      setZoom(null);
      return;
    }
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  }

  function onTouchStart(e) {
    touchX.current = e.changedTouches[0]?.clientX ?? null;
  }
  function onTouchEnd(e) {
    if (touchX.current == null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX.current;
    if (Math.abs(dx) > 48) go(index + (dx < 0 ? 1 : -1));
    touchX.current = null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${workflow.title} gallery`}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex flex-col"
      style={{ background: "rgba(0,0,0,0.92)" }}
    >
      {/* Top bar: title left, close top-right */}
      <div
        className="flex items-center justify-between px-5 py-4 md:px-8"
        onClick={(e) => e.stopPropagation()}
      >
        <span
          className="text-[14px] text-white/85"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {workflow.title}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* Center: current item + prev/next */}
      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-4 md:px-16"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Prev */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(index - 1);
          }}
          aria-label="Previous"
          disabled={index === 0}
          className="absolute left-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-25 md:left-6"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Asset */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: `min(90vw, ${aspect * 82}vh)`,
            maxWidth: "90vw",
          }}
        >
          {isImage ? (
            <div
              onClick={toggleZoom}
              className={zoom ? "cursor-zoom-out" : "cursor-zoom-in"}
              style={{
                transform: zoom ? "scale(2)" : "scale(1)",
                transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center",
                transition,
              }}
            >
              <PlaceholderBox item={item} />
            </div>
          ) : (
            // PLACEHOLDER: swap for <video src controls playsInline> later.
            <PlaceholderBox item={item} />
          )}
        </div>

        {/* Next */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            go(index + 1);
          }}
          aria-label="Next"
          disabled={index === total - 1}
          className="absolute right-3 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-25 md:right-6"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Counter */}
      <div
        className="pb-6 text-center text-[12px] tracking-[0.06em] text-white/55"
        style={{ fontFamily: "Inter, sans-serif" }}
        onClick={(e) => e.stopPropagation()}
      >
        {index + 1} / {total}
      </div>
    </div>
  );
}

/* ---- Page --------------------------------------------------------------- */

export default function AboutPage() {
  const [open, setOpen] = useState(null); // { id, index } or null
  const rootRef = useRef(null);

  const openWorkflow = (id) => setOpen({ id, index: 0 });
  const close = () => setOpen(null);

  // Scroll-reveal, same .reveal / is-visible pattern as the homepage feed
  // and the case study pages. Reduced motion is handled by the .reveal CSS.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = Array.from(
      (rootRef.current || document).querySelectorAll(".reveal")
    );
    if (reduced || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const activeWorkflow = open ? WORKFLOWS.find((w) => w.id === open.id) : null;

  return (
    <main
      ref={rootRef}
      className="min-h-screen bg-white text-[#0a0a0a]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* ===== ABOUT / WORK / LINKS ================================= */}
      <section className="mx-auto w-full max-w-[1400px] px-6 pt-20 md:px-10 md:pt-28">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* ABOUT */}
          <div className="reveal md:col-span-6">
            <FaintLabel>About</FaintLabel>
            <p
              className="mt-5 text-[#0a0a0a]"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(1.05rem, 1.6vw, 1.35rem)",
                lineHeight: 1.5,
              }}
            >
              I design AI products and build the front-end myself, so the
              thing I draw is the thing that ships. Right now I&rsquo;m
              Founding Product Designer at{" "}
              <Link href="/work/shopos" className="underline underline-offset-[3px] decoration-[#0a0a0a]/30 transition-colors hover:text-[#525252]">
                ShopOS
              </Link>
              , an AI-agent operating system for commerce brands, where I
              designed the system end to end and built its React front-end.
              I care most about the unglamorous half of AI products: making
              an autonomous system legible and trustworthy. The states where
              it&rsquo;s thinking, the moments it could fail, the org you can
              actually see. Off the clock I build generative workflows and
              treat each one like a small product of its own. If you&rsquo;re
              working on something where design and engineering
              shouldn&rsquo;t be two different people,{" "}
              <a
                href={`mailto:${EMAIL}`}
                className="underline underline-offset-[3px] decoration-[#0a0a0a]/30 transition-colors hover:text-[#525252]"
              >
                get in touch
              </a>
              .
            </p>
          </div>

          {/* WORK */}
          <nav className="reveal md:col-span-3" aria-label="Work">
            <FaintLabel>Work</FaintLabel>
            <ol className="mt-5 space-y-3">
              {[
                { n: 1, label: "Mission Control", href: "/work/shopos" },
                { n: 2, label: "Brand Memory", href: "/work/brand-memory" },
                {
                  n: 3,
                  label: "Enterprise Dashboard",
                  href: "/work/enterprise-dashboard",
                },
                { n: 4, label: "DreamCall", href: DREAMCALL_URL, external: true },
              ].map(({ n, label, href, external }) => {
                const cls =
                  "group inline-flex items-baseline gap-2 text-[15px] text-[#0a0a0a] transition-colors hover:text-[#525252]";
                const inner = (
                  <>
                    <sup className="text-[10px] text-[#aaaaaa]">{n}</sup>
                    <span className="underline-offset-[3px] group-hover:underline">
                      {label}
                    </span>
                  </>
                );
                return (
                  <li key={label}>
                    {external ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                        {inner}
                      </a>
                    ) : (
                      <Link href={href} className={cls}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>

          {/* LINKS */}
          <nav className="reveal md:col-span-3" aria-label="Links">
            <FaintLabel>Links</FaintLabel>
            <ul className="mt-5 space-y-3">
              {[
                // PLACEHOLDER: future write-up, point at the real URL later.
                { label: "How I build workflows", href: "#" },
                {
                  label: "LinkedIn",
                  href: LINKEDIN_URL,
                  external: true,
                },
                // PLACEHOLDER: real Twitter URL later.
                { label: "Twitter", href: "#", external: true },
                // PLACEHOLDER: real Instagram URL later.
                { label: "Instagram", href: "#", external: true },
              ].map(({ label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    className="group inline-flex items-center text-[15px] text-[#0a0a0a] transition-colors hover:text-[#525252]"
                  >
                    <span className="underline-offset-[3px] group-hover:underline">
                      {label}
                    </span>
                    <UpRight />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      {/* ===== Workflow masonry feed =============================== */}
      <section className="mx-auto w-full max-w-[1400px] px-6 pb-32 pt-24 md:px-10 md:pt-36">
        <FaintLabel className="reveal">Workflows</FaintLabel>
        {/* CSS columns masonry: tiles keep their natural height and pack
            tightly, so the feed reads uneven rather than as a grid. */}
        <div className="mt-8 columns-1 [column-gap:24px] sm:columns-2 lg:columns-3">
          {WORKFLOWS.map((wf) => {
            const cover = wf.items[0];
            return (
              <button
                key={wf.id}
                type="button"
                onClick={() => openWorkflow(wf.id)}
                aria-label={`Open ${wf.title} gallery`}
                className="reveal mb-6 block w-full cursor-zoom-in break-inside-avoid text-left"
              >
                <PlaceholderBox item={cover} />
                <h3
                  className="mt-3 text-[16px] font-semibold text-[#0a0a0a]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {wf.title}
                </h3>
                <p
                  className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#aaaaaa]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {wf.caption}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* ===== Lightbox ============================================ */}
      {activeWorkflow ? (
        <Lightbox
          workflow={activeWorkflow}
          index={open.index}
          onIndex={(i) => setOpen((o) => ({ ...o, index: i }))}
          onClose={close}
        />
      ) : null}
    </main>
  );
}
