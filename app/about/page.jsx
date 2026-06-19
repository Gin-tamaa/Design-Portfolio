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
   Real generative-workflow outputs (public/workflow-outputs), grouped into
   categories with a subtitle each. Each item carries its natural aspect
   (w/h) so the masonry staggers; videos default to a portrait tile and the
   cover plays in-view (object-cover crops to fill regardless of true ratio).
   items[0] is the masonry cover. */
const WF = "/workflow-outputs";
const im = (n, w, h) => ({ type: "image", src: `${WF}/img-${n}.jpg`, w, h });
const vd = (n, w, h) => ({
  type: "video",
  src: `${WF}/vid-${n}.mp4`,
  poster: `${WF}/posters/vid-${n}.jpg`,
  w,
  h,
});

const WORKFLOWS = [
  {
    id: "speedcat-ads",
    title: "Speedcat Campaign",
    caption: "AI ad films and posters",
    items: [
      im("23", 1024, 1536),
      im("08", 1536, 2752),
      im("18", 1024, 1536),
      im("21", 1024, 1536),
      im("25", 1024, 1536),
      im("28", 1024, 1536),
      im("29", 1024, 1536),
      im("02", 1024, 1536),
      im("04", 1536, 2752),
    ],
  },
  {
    id: "ecommerce",
    title: "Ecommerce Renders",
    caption: "Deterministic product photoshoots",
    items: [
      im("24", 1024, 1024),
      im("09", 2048, 2048),
      im("10", 1024, 1024),
      im("11", 1024, 1024),
      im("12", 1024, 1024),
      im("13", 1024, 1024),
      im("20", 1024, 1536),
      im("26", 1536, 2752),
    ],
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    caption: "On-model and street",
    items: [
      im("17", 768, 1376),
      im("16", 1024, 1536),
      im("06", 1024, 1536),
      im("14", 1024, 1024),
      im("15", 1024, 1024),
      im("19", 1536, 2752),
      im("27", 1536, 2752),
      im("30", 1024, 1024),
    ],
  },
  {
    id: "material",
    title: "Material Studies",
    caption: "Macro texture and detail",
    items: [
      im("01", 1536, 2752),
      im("05", 1536, 2752),
      im("03", 1536, 2752),
      im("07", 1536, 2752),
      im("22", 1024, 1536),
    ],
  },
  {
    id: "product-films",
    title: "Product Films",
    caption: "Render to motion",
    items: [
      vd("01", 3, 4),
      vd("02", 3, 4),
      vd("03", 3, 4),
      vd("04", 3, 4),
      vd("05", 3, 4),
      vd("06", 3, 4),
      vd("07", 3, 4),
      vd("08", 3, 4),
      vd("09", 3, 4),
    ],
  },
  {
    id: "campaign-films",
    title: "Campaign Films",
    caption: "Hero spots, generated",
    items: [
      vd("12", 3, 4),
      vd("13", 3, 4),
      vd("14", 3, 4),
      vd("15", 3, 4),
      vd("16", 3, 4),
      vd("17", 3, 4),
    ],
  },
];

// Every output, flattened in feed order. Each masonry tile opens the
// lightbox at its flatIndex, so Next/Prev pages through the WHOLE feed,
// not just one category. SECTIONS keeps the category headers and buckets
// each category's items round-robin into 3 flex columns (row-major, so
// Next follows the visual masonry order).
const FLAT = [];
const SECTIONS = WORKFLOWS.map((wf) => {
  const cols = [[], [], []];
  wf.items.forEach((it, i) => {
    const entry = { ...it, wfTitle: wf.title, flatIndex: FLAT.length };
    FLAT.push(entry);
    cols[i % 3].push(entry);
  });
  return { id: wf.id, title: wf.title, caption: wf.caption, cols };
});

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

// A muted, looping video cover. A real generated poster shows instantly as
// the first-frame thumbnail (reliable, unlike the #t fragment which paints
// black on many browsers), and the clip only plays while on-screen.
// preload="none" means nothing but the poster loads until it plays.
function VideoCover({ src, poster, className }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play?.().catch(() => {});
        else v.pause?.();
      },
      { rootMargin: "100px" }
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      className={className}
      draggable={false}
    />
  );
}

// Masonry cover tile: real image or in-view-playing video, cropped to the
// item's declared aspect so the columns stagger.
function CoverMedia({ item }) {
  const cls = "block h-full w-full object-cover";
  return (
    <div
      className="overflow-hidden rounded-[4px] bg-[#f6f6f6]"
      style={{ aspectRatio: `${item.w} / ${item.h}` }}
    >
      {item.type === "video" ? (
        <VideoCover src={item.src} poster={item.poster} className={cls} />
      ) : (
        <img
          src={item.src}
          alt=""
          loading="lazy"
          draggable={false}
          className={cls}
        />
      )}
    </div>
  );
}

/* ---- Lightbox carousel -------------------------------------------------- */

function Lightbox({ items, index, onIndex, onClose }) {
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
      aria-label={`${item.wfTitle} gallery`}
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
          {item.wfTitle}
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

        {/* Asset: zoomable image, or a playing video with controls. */}
        <div onClick={(e) => e.stopPropagation()}>
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
              <img
                src={item.src}
                alt=""
                draggable={false}
                className="block h-auto max-h-[82vh] w-auto max-w-[90vw] rounded-[4px]"
              />
            </div>
          ) : (
            <video
              src={item.src}
              poster={item.poster}
              controls
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="block h-auto max-h-[82vh] w-auto max-w-[90vw] rounded-[4px]"
            />
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
  // Flat index of the open output (or null). Next/Prev walk FLAT.
  const [open, setOpen] = useState(null);
  const rootRef = useRef(null);

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

  return (
    <main
      ref={rootRef}
      className="min-h-screen bg-white text-[#0a0a0a]"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* ===== ABOUT / WORK / LINKS ================================= */}
      <section className="mx-auto w-full max-w-[1800px] px-5 pt-20 md:pt-28">
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
      {/* Every output is shown, grouped under its category header. Each
          category is a grid-cols-3 shell (12px gutter) of flex columns
          (24px vertical gap) so tiles stagger. Tiles open the lightbox at
          their flat index; Next/Prev walk the whole feed in order. */}
      <section className="mx-auto w-full max-w-[1800px] px-5 pb-32 pt-24 md:pt-36">
        <FaintLabel className="reveal">Workflows</FaintLabel>
        {SECTIONS.map((section) => (
          <div key={section.id} className="mt-14 first:mt-9">
            <div className="reveal mb-5">
              <h3
                className="text-[16px] font-semibold text-[#0a0a0a]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {section.title}
              </h3>
              <p
                className="mt-1 text-[11px] uppercase tracking-[0.18em] text-[#aaaaaa]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {section.caption}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {section.cols.map((col, ci) => (
                <div key={ci} className="flex flex-col gap-6">
                  {col.map((it) => (
                    <button
                      key={it.flatIndex}
                      type="button"
                      onClick={() => setOpen(it.flatIndex)}
                      aria-label={`Open ${section.title} output`}
                      className="reveal block w-full cursor-zoom-in"
                    >
                      <CoverMedia item={it} />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ===== Lightbox (pages the whole feed) ===================== */}
      {open !== null ? (
        <Lightbox
          items={FLAT}
          index={open}
          onIndex={setOpen}
          onClose={close}
        />
      ) : null}
    </main>
  );
}
