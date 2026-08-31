// app/work/enterprise-dashboard/page.jsx
// Enterprise Dashboard case study. Same scannable scaffold as the ShopOS
// and Brand Memory case studies: parallax hero with a wordmark, .cs-scope
// main with the editorial type primitives, the TL;DR table, the "My role"
// strip, and a section pattern of eyebrow -> SectionHeader -> short prose
// -> the scannable layer (bold-lead-in bullets, Contrast blocks, a pull
// quote, the impact stat list). Content from
// case-study-enterprise-dashboard.md; numbers quoted verbatim.

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ChatLauncher from "../../components/ChatLauncher";

const SKY_SRC = "/images/dashboard-hero-sky.png";
// Dashboard UI screenshot layered over the wordmark in the hero.
const AGENTS_SRC = "/images/dashboard-hero-ui.png";
// Full-resolution dashboard screen used across all flow-carousel slides.
const FLOW_IMG = "/images/dashboard-full.png";
// The screen the first slide's animation transitions to after the click.
const BATCH_IMG = "/images/batch-screen.png";
// Second slide animation: review screen, then the View Input comparison.
const REVIEW_IMG_A = "/images/review-screen-a.png";
const REVIEW_IMG_B = "/images/review-screen-b.png";
// Third slide animation: tap -> empty comment -> typed -> posted pin.
const ANNO_1 = "/images/annotate-1.png";
const ANNO_2 = "/images/annotate-2.png";
const ANNO_3 = "/images/annotate-3.png";
const ANNO_4 = "/images/annotate-4.png";

/* ============================================================================
   Primitives copied verbatim from the ShopOS / Brand Memory scaffold so the
   case studies stay in lockstep. If anything changes there, mirror it here.
============================================================================ */

function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1408px] px-6 md:px-16 ${className}`}>
      {children}
    </div>
  );
}

function ProseColumn({ children, className = "" }) {
  return (
    <div className={`max-w-[var(--cs-prose-col)] ${className}`}>{children}</div>
  );
}

function Eyebrow({ children, dark = false }) {
  return <p className={`cs-eyebrow ${dark ? "cs-on-dark" : ""}`}>{children}</p>;
}

function SectionHeader({ children, className = "", dark = false }) {
  return (
    <h2 className={`cs-section mt-6 ${dark ? "cs-on-dark" : ""} ${className}`}>
      {children}
    </h2>
  );
}

function Prose({ children, className = "" }) {
  return (
    <div className={`cs-body cs-prose max-w-[var(--cs-prose-col)] ${className}`}>
      {children}
    </div>
  );
}

function Lead({ children, className = "" }) {
  return (
    <p
      className={`mt-6 max-w-[var(--cs-prose-col)] text-[16px] italic leading-[1.7] text-[#525252] ${className}`}
    >
      {children}
    </p>
  );
}

function Pill({ href = "#", children, className = "", external = false }) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-2 rounded-full border border-[#E5E5E5] bg-white px-4 py-2 text-sm font-medium text-[#0a0a0a] transition-colors hover:bg-[#0a0a0a] hover:text-white ${className}`}
    >
      {children}
    </Link>
  );
}

function Bullet({ children }) {
  return (
    <li className="flex gap-4">
      <span
        aria-hidden="true"
        className="mt-[10px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-[#0a0a0a]/40"
      />
      <span>{children}</span>
    </li>
  );
}

// Contrast block: the same two-column card pattern as Brand Memory's
// Rejected/Chosen decision block, generalized to take its labels so it
// reads as Standalone/Integrated and Before/After here. Left card uses
// the rose accent (the old/limited state), right uses emerald (the new
// state), same as the case-study scale.
function Contrast({ leftLabel, left, rightLabel, right }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-[#E5DDD0] bg-white p-6 md:p-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-rose-700/80">
          {leftLabel}
        </p>
        <p className="mt-3 text-[15px] leading-[1.65] text-[#0a0a0a]/85 md:text-[16px]">
          {left}
        </p>
      </div>
      <div className="rounded-2xl border border-[#E5DDD0] bg-white p-6 md:p-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-700">
          {rightLabel}
        </p>
        <p className="mt-3 text-[15px] leading-[1.65] text-[#0a0a0a]/85 md:text-[16px]">
          {right}
        </p>
      </div>
    </div>
  );
}

// Problem card: horizontal constraint card adapted from the reference — a
// teal line glyph in its own left rail, then a bold ink lead-in flowing into
// the secondary body. White case-study theme (white bg, warm #E5DDD0 hairline)
// to match the Contrast cards. Hand-drawn SVG icons, same as Bracket; the teal
// accent echoes the hero sky. Stacked vertically at the use site.
function ProblemCard({ icon, title, children }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-[#E5DDD0] bg-white px-6 py-5 md:gap-5 md:px-7 md:py-6">
      <span aria-hidden="true" className="mt-[3px] shrink-0 text-[#0d9488]">
        {icon}
      </span>
      <p className="text-[14px] leading-[1.65] text-[#525252] md:text-[15px]">
        <strong className="font-semibold text-[#0a0a0a]">{title}.</strong>{" "}
        {children}
      </p>
    </div>
  );
}

// The three line glyphs for the problem cards, drawn to match the reference's
// thin emerald outline style.
const ICON_COMPARE = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="7.5" height="14" rx="1.6" />
    <rect x="13.5" y="5" width="7.5" height="14" rx="1.6" />
  </svg>
);
const ICON_FEEDBACK = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="13" rx="3" />
    <path d="M8 17v3.5L13 17" />
  </svg>
);
const ICON_APPROVAL = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="4.5" />
    <path d="M7.5 12.2l3 3 6-6.4" />
  </svg>
);

// Deduction quote: a quiet editorial pull-quote for an observation the
// reader is meant to sit with, not an alarm. Left-aligned on the warm
// case-study card, a muted quotation-mark glyph instead of the old amber
// warning triangle, and the line set in the italic muted-lead voice (the
// same treatment as the section leads) at a calmer size than the section
// headers, so it reads as a remark rather than a headline.
function DeductionQuote({ children }) {
  return (
    <div className="mt-12 rounded-3xl border border-[#E5DDD0] bg-[#FBFAF8] px-6 py-10 md:px-12 md:py-12">
      {/* muted quotation-mark glyph */}
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        className="text-[#0a0a0a]/15"
      >
        <path d="M9.4 6.2c-3 1.3-4.9 4-4.9 7.4 0 2.6 1.5 4.2 3.5 4.2 1.7 0 3-1.3 3-3 0-1.6-1.1-2.8-2.6-2.8-.3 0-.7 0-1 .1.3-1.6 1.6-3 3.3-3.8l-1.3-2.1zm8.5 0c-3 1.3-4.9 4-4.9 7.4 0 2.6 1.5 4.2 3.5 4.2 1.7 0 3-1.3 3-3 0-1.6-1.1-2.8-2.6-2.8-.3 0-.7 0-1 .1.3-1.6 1.6-3 3.3-3.8l-1.3-2.1z" />
      </svg>

      <p className="mt-4 max-w-[640px] text-[18px] italic leading-[1.6] text-[#3a3a3a] md:text-[20px]">
        {children}
      </p>
    </div>
  );
}

// Faint meta line (#aaaaaa) for the "Addresses:" tags and the
// AM-estimate caveat, so the bold stats and bullets carry the scan.
function FaintMeta({ children, className = "" }) {
  return (
    <p
      className={`max-w-[var(--cs-prose-col)] text-[13px] italic leading-[1.6] text-[#aaaaaa] ${className}`}
    >
      {children}
    </p>
  );
}

/* ============================================================================
   Flow carousel: the five-step walkthrough rendered as a peeking carousel
   (one slide centered, neighbours dimmed at the edges), modeled on the
   reference — big watermark number, copy on the left, the product image on
   the right, circular arrow controls and dot pagination. Kept in the warm
   case-study palette (#F4F1EC card, #E5DDD0 hairline) so it reads as one
   product. Image is a placeholder (the hero dashboard UI) for now.
============================================================================ */

const FLOW_STEPS = [
  {
    n: "01",
    title: "Create the batch in-product.",
    body: "No WhatsApp brief. The brand sets up the batch inside ShopOS, against its Brand Memory and a moodboard.",
    tag: null,
  },
  {
    n: "02",
    title: "Review against the source.",
    body: "Every generated image sits side by side with its input garment (View Input), so the brand judges the work against what it came from, not from memory.",
    tag: "Fixes friction one.",
  },
  {
    n: "03",
    title: "Mark exactly what’s wrong.",
    body: "Drop numbered pins on the precise spot, “the print is off, here,” instead of typing a vague paragraph into chat. Structured, located feedback the production team can act on without a follow-up question.",
    tag: "Fixes friction two.",
  },
  {
    n: "04",
    title: "Approve per SKU, not all or nothing.",
    body: "Keep and download the SKUs that work now; only the rejected ones go back to refine. One bad image costs one regeneration, not 499. Under the hood this reshaped the whole state model: every SKU carries its own status (ready / approved / rejected / refining), the batch becomes the sum of them, and a green/red rail makes that legible at a glance.",
    tag: "Fixes friction three.",
  },
  {
    n: "05",
    title: "Go further when ready.",
    body: "The same brand can now spin up new batch types in Spaces or spend credits in Cowork, without leaving the product.",
    tag: null,
  },
];

// Pointer cursor glyph for the Create-a-Batch click animation.
const CURSOR_SVG = (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 2.5 L4 18.5 L8.4 14.4 L11.4 20.6 L13.9 19.5 L11 13.4 L17 13.4 Z"
      fill="#ffffff"
      stroke="#0a0a0a"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>
);

// Animated screen used on flow slides that demonstrate a click: loops a zoom
// into a target button (originX / originY, as % of the screenshot), a cursor
// click, and a crossfade swap to the next screen. Pure CSS keyframes live in
// globals.css; the target point is passed through as --fa-x / --fa-y.
function AnimatedScreen({ image, nextImage, originX = "32%", originY = "44%" }) {
  return (
    <div
      className="flow-anim overflow-hidden rounded-2xl"
      style={{ "--fa-x": originX, "--fa-y": originY }}
    >
      <div className="flow-anim__zoom">
        <img
          src={image}
          alt=""
          className="flow-anim__screen"
          draggable={false}
        />
        {/* next screen, crossfades in after the click */}
        <img
          src={nextImage || image}
          alt=""
          className="flow-anim__screen flow-anim__screen--b"
          draggable={false}
        />
      </div>
      <span className="flow-anim__ring" aria-hidden="true" />
      <span className="flow-anim__flash" aria-hidden="true" />
      <span className="flow-anim__cursor" aria-hidden="true">
        {CURSOR_SVG}
      </span>
    </div>
  );
}

// Send (up-arrow) glyph for the comment input.
const SEND_SVG = (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 19V6M6 12l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Annotate animation (slide 03), driven by a single rAF loop. The comment
// input popup is real DOM (rebuilt from the Container assets) so the comment
// types for real, char by char, the send button activates once there's text,
// then the posted screen (s4) crossfades in. The cursor taps at (x, y).
function AnnotateScreen({
  s1,
  s4,
  x = 42,
  y = 57,
  text = "Print is not correct, even the color is off",
  placeholder = "What's not working here?",
  popLeft = 38,
  popTop = 53,
  popWidth = 30,
}) {
  const wrapRef = useRef(null);
  const popRef = useRef(null);
  const textRef = useRef(null);
  const caretRef = useRef(null);
  const sendRef = useRef(null);
  const s4Ref = useRef(null);
  const curRef = useRef(null);
  const rngRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const DUR = 9000;
    let startT = null;
    let raf = null;
    const clamp01 = (v) => Math.max(0, Math.min(1, v));
    const seg = (t, a, b) => clamp01((t - a) / (b - a));
    const ease = (u) => u * u * (3 - 2 * u);

    const loop = (now) => {
      if (startT == null) startT = now;
      const t = ((now - startT) % DUR) / DUR;

      // cursor: fade in, glide to (x,y), tap, fade out
      const cur = curRef.current;
      if (cur) {
        const m = ease(seg(t, 0.06, 0.15));
        let op = 0;
        if (t < 0.06) op = ease(seg(t, 0, 0.06));
        else if (t < 0.2) op = 1;
        else if (t < 0.24) op = 1 - ease(seg(t, 0.2, 0.24));
        let sc = 1;
        if (t >= 0.15 && t < 0.19) sc = 0.78 + 0.22 * Math.abs((t - 0.15) / 0.04 * 2 - 1);
        cur.style.left = 74 + (x - 74) * m + "%";
        cur.style.top = 88 + (y - 88) * m + "%";
        cur.style.opacity = op;
        cur.style.transform = `scale(${sc})`;
      }

      // tap ring
      const rng = rngRef.current;
      if (rng) {
        const u = seg(t, 0.15, 0.3);
        rng.style.left = x + "%";
        rng.style.top = y + "%";
        rng.style.transform = `scale(${u})`;
        rng.style.opacity = t >= 0.15 && t < 0.3 ? 0.6 * (1 - u) : 0;
      }

      // comment popup: appears on tap, holds, fades as the post comes in
      const pop = popRef.current;
      const txt = textRef.current;
      const caret = caretRef.current;
      const send = sendRef.current;
      if (pop && txt) {
        let o = 0;
        if (t >= 0.18 && t < 0.24) o = ease(seg(t, 0.18, 0.24));
        else if (t >= 0.24 && t < 0.62) o = 1;
        else if (t >= 0.62 && t < 0.66) o = 1 - ease(seg(t, 0.62, 0.66));
        pop.style.opacity = o;
        const cw = wrapRef.current ? wrapRef.current.clientWidth : 0;
        pop.style.fontSize = (cw * 14) / 1280 + "px";

        const n = Math.round(clamp01(seg(t, 0.32, 0.55)) * text.length);
        const typed = text.slice(0, n);
        const content = n > 0 ? typed : placeholder;
        if (txt.textContent !== content) txt.textContent = content;
        txt.style.color = n > 0 ? "#171717" : "#9ca3af";
        if (send) send.classList.toggle("is-active", n > 0);
        if (caret) {
          const show = t >= 0.3 && t < 0.6 && Math.floor(now / 500) % 2 === 0;
          caret.style.opacity = show ? 1 : 0;
        }
      }

      // s4 posted state
      const s4el = s4Ref.current;
      if (s4el) {
        let o = 0;
        if (t < 0.6) o = 0;
        else if (t < 0.67) o = ease(seg(t, 0.6, 0.67));
        else if (t < 0.86) o = 1;
        else if (t < 0.96) o = 1 - ease(seg(t, 0.86, 0.96));
        s4el.style.opacity = o;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => raf && cancelAnimationFrame(raf);
  }, [x, y, text, placeholder]);

  return (
    <div ref={wrapRef} className="anno overflow-hidden rounded-2xl">
      <img src={s1} alt="" className="anno__s1" draggable={false} />

      {/* comment input popup (real DOM) */}
      <div
        ref={popRef}
        className="anno__popup"
        style={{ left: `${popLeft}%`, top: `${popTop}%`, width: `${popWidth}%` }}
      >
        <span className="anno__badge">1</span>
        <span className="anno__field">
          <span ref={textRef} className="anno__txt">
            {placeholder}
          </span>
          <span ref={caretRef} className="anno__caret">
            |
          </span>
        </span>
        <span ref={sendRef} className="anno__send">
          {SEND_SVG}
        </span>
      </div>

      <img
        ref={s4Ref}
        src={s4}
        alt=""
        className="anno__layer"
        draggable={false}
        style={{ opacity: 0 }}
      />
      <span ref={rngRef} className="anno__rng" aria-hidden="true" />
      <span ref={curRef} className="anno__cur" aria-hidden="true">
        {CURSOR_SVG}
      </span>
    </div>
  );
}

// Scroll-driven horizontal carousel. The section pins (sticky) while the
// reader scrolls; vertical scroll progress is mapped to a horizontal
// translate so the cards slide right -> left, one centered at a time with
// the neighbours peeking and dimmed. Once the last card is reached the wrap
// scrolls past and the rest of the case study continues. No arrows or dots:
// the scroll itself is the control. Card styling is the same as the rest of
// the page (Inter title, neutral grey card, faint watermark number).
function FlowCarousel({ image }) {
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const cardsRef = useRef([]);
  const count = FLOW_STEPS.length;
  // Each card is CARD_VW of the viewport wide. The track is padded on the left
  // to the page content gutter, so the first card's left edge lines up with the
  // section title; the next card peeks past the right edge.
  const CARD_VW = 80;

  useEffect(() => {
    let rafId = null;

    const update = () => {
      rafId = null;
      const wrap = wrapRef.current;
      const track = trackRef.current;
      if (!wrap || !track) return;

      const vh = window.innerHeight;
      const total = wrap.offsetHeight - vh; // scrollable distance while pinned
      const top = wrap.getBoundingClientRect().top;
      const scrolled = Math.min(Math.max(-top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;

      // left gutter = the page content edge (matches Container: max-w 1408,
      // mx-auto, px-6 / md:px-16). Uses clientWidth so the scrollbar is
      // excluded, so the first card lines up exactly with the section title.
      const cw = document.documentElement.clientWidth;
      const pad = cw < 768 ? 24 : 64;
      const gutter = Math.max(pad, (cw - Math.min(cw, 1408)) / 2 + pad);
      track.style.paddingLeft = `${gutter}px`;

      const pos = progress * (count - 1); // 0 .. count-1
      track.style.transform = `translateX(${-(pos * CARD_VW)}vw)`;

      const nearest = Math.round(pos);
      for (let i = 0; i < cardsRef.current.length; i++) {
        const el = cardsRef.current[i];
        if (el) el.style.opacity = i === nearest ? "1" : "0.35";
      }
    };

    const onScroll = () => {
      if (rafId == null) rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [count, CARD_VW]);

  return (
    <div
      ref={wrapRef}
      className="relative mt-10"
      style={{ height: `${count * 80}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div
          ref={trackRef}
          className="flex will-change-transform pl-6 md:pl-[max(64px,calc((100vw-1408px)/2+64px))]"
          style={{ transform: "translateX(0vw)" }}
        >
          {FLOW_STEPS.map((s, i) => (
            <div
              key={s.n}
              ref={(el) => (cardsRef.current[i] = el)}
              className="shrink-0 pr-5 motion-safe:transition-opacity motion-safe:duration-300 md:pr-7"
              style={{ width: `${CARD_VW}vw`, opacity: i === 0 ? 1 : 0.35 }}
            >
              <div className="relative overflow-hidden rounded-[28px] bg-[#EFEFEF] md:min-h-[74vh]">
                {/* copy, top-left, small. max-width is kept left of where the
                    image begins (image is 64% wide, so it starts at 36%) so
                    the text never bleeds onto the screenshot. */}
                <div className="relative z-20 p-8 md:max-w-[34%] md:p-11 lg:p-14">
                  <h3
                    className="text-[21px] leading-[1.18] tracking-[-0.02em] text-[#0a0a0a] md:text-[26px]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 400 }}
                  >
                    {s.title}
                  </h3>
                  <p className="mt-4 max-w-[40ch] text-[14px] leading-[1.7] text-[#6b6b6b] md:mt-5 md:text-[15px]">
                    {s.body}
                  </p>
                  {s.tag && (
                    <p className="mt-4 text-[12px] italic leading-[1.6] text-[#b3b3b3]">
                      ({s.tag})
                    </p>
                  )}
                </div>

                {/* product image (placeholder): the full Figma screen, shown
                    in its entirety, anchored big in the bottom-right corner
                    (no bleed, nothing cropped) */}
                <div className="px-8 pb-8 md:absolute md:bottom-0 md:right-0 md:z-10 md:w-[64%] md:p-5 md:pl-0 md:pt-0 lg:p-6 lg:pl-0 lg:pt-0">
                  {i === 0 ? (
                    <AnimatedScreen
                      image={image}
                      nextImage={BATCH_IMG}
                      originX="32%"
                      originY="44%"
                    />
                  ) : i === 1 ? (
                    <AnimatedScreen
                      image={REVIEW_IMG_A}
                      nextImage={REVIEW_IMG_B}
                      originX="88%"
                      originY="4.5%"
                    />
                  ) : i === 2 ? (
                    <AnnotateScreen s1={ANNO_1} s4={ANNO_4} />
                  ) : (
                    <img
                      src={image}
                      alt=""
                      className="block w-full rounded-2xl"
                      draggable={false}
                    />
                  )}
                </div>

                {/* faint watermark number, bottom-left corner */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-2 left-7 z-0 select-none font-semibold leading-none tracking-[-0.04em] text-[#0a0a0a]/[0.05] md:left-11"
                  style={{ fontSize: "clamp(72px, 9vw, 150px)" }}
                >
                  {s.n}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   Page
============================================================================ */

export default function EnterpriseDashboardPage() {
  const heroRef = useRef(null);
  const skyRef = useRef(null);
  const wordmarkRef = useRef(null);
  const agentsRef = useRef(null);

  // Identical parallax + nav-inversion behaviour to the ShopOS hero. The
  // hero reuses the ShopOS teal sky, so the global Nav inverts to white
  // over it via the existing body.shopos-hero rules (reused as-is, not a
  // new pattern), then solidifies past the hero.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mediaQuery.matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    document.body.classList.add("shopos-hero");

    let rafId = null;
    let solid = false;

    const update = () => {
      const y = window.scrollY;
      const heroH = heroRef.current?.offsetHeight || 760;
      const navThreshold = heroH - 90;

      const shouldBeSolid = y > navThreshold;
      if (shouldBeSolid !== solid) {
        solid = shouldBeSolid;
        document.body.classList.toggle("shopos-nav-solid", solid);
      }

      if (!reduced && y < heroH) {
        const mult = isMobile ? 0.5 : 1;

        if (skyRef.current) {
          skyRef.current.style.transform = `translate3d(0, ${y * 0.35 * mult}px, 0)`;
        }
        if (wordmarkRef.current) {
          wordmarkRef.current.style.transform = `translate3d(-50%, ${y * 0.55 * mult}px, 0)`;
          wordmarkRef.current.style.opacity = String(
            Math.max(0, 1 - y / (heroH * 0.7))
          );
        }
        if (agentsRef.current) {
          agentsRef.current.style.transform = `translate3d(0, ${y * 0.22 * mult}px, 0)`;
        }
      }

      rafId = null;
    };

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();

    // Reveals
    const revealEls = Array.from(document.querySelectorAll(".reveal"));
    let observer = null;
    if (!reduced && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealEls.forEach((el) => observer.observe(el));
    } else {
      revealEls.forEach((el) => el.classList.add("is-visible"));
    }

    return () => {
      document.body.classList.remove("shopos-hero", "shopos-nav-solid");
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <main className="cs-scope min-h-screen bg-white text-[#0a0a0a] antialiased">
      {/* ===== HERO, parallax stage (reuses the ShopOS composition) ===== */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ height: "min(820px, calc(100vh + 60px))", minHeight: "640px" }}
      >
        {/* Layer 1: sky bg (parallax 0.35) */}
        <div
          ref={skyRef}
          className="absolute inset-0 will-change-transform"
          style={{ top: "-60px", height: "calc(100% + 120px)" }}
        >
          <img
            src={SKY_SRC}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            draggable={false}
          />
          {/* Fallback CSS gradient in case the sky asset 404s, same teal->white */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(180deg, #2aa3a8 0%, #66bdc1 28%, #b8dbdc 60%, #ffffff 100%)",
            }}
          />
        </div>

        {/* Layer 3: wordmark (parallax 0.55, fades) */}
        <h1
          ref={wordmarkRef}
          className="absolute left-1/2 will-change-transform"
          style={{
            top: "129px",
            transform: "translate3d(-50%, 0, 0)",
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(72px, 13vw, 200px)",
            lineHeight: 1.08,
            letterSpacing: "-0.06em",
            color: "#ffffff",
            whiteSpace: "nowrap",
            margin: 0,
          }}
        >
          Dashboard
        </h1>

        {/* Layer 4: agents transparent PNG (parallax 0.22, moves slowest) */}
        <div
          ref={agentsRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 will-change-transform"
          style={{ top: "calc(332/760 * 100%)" }}
        >
          {/* Dashboard UI screenshot, floats as a rounded card over the wordmark */}
          <img
            src={AGENTS_SRC}
            alt=""
            className="mx-auto block h-auto w-[66vw] max-w-[1000px] select-none rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.45)]"
            draggable={false}
          />
        </div>

        {/* Bottom fade overlay, smooths into the white content below */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[230px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 84.8%)",
            backdropFilter: "blur(2px)",
          }}
        />
      </section>

      {/* ===== TOP, kicker + H1 + subhead =============================== */}
      <Container className="reveal pt-16 md:pt-20">
        <ProseColumn>
          <p className="cs-eyebrow">
            Enterprise Dashboard &middot; ShopOS &middot; Design + Front End
            &middot; 2026
          </p>
          <h1 className="cs-thesis mt-4">
            From a delivery window to the front door of the product
          </h1>
          <p className="cs-lede mt-6">
            Enterprise brands used to <em>receive</em> bulk image batches
            through a standalone dashboard and run everything else over
            WhatsApp. I folded it into ShopOS, so the same dashboard became
            how they use the whole product.
          </p>
        </ProseColumn>
      </Container>

      {/* ===== TL;DR ==================================================== */}
      <Container className="reveal pt-20 md:pt-28">
        <ProseColumn>
          <p className="cs-eyebrow">TL;DR</p>
          <dl className="mt-8 grid grid-cols-1 gap-y-8 md:grid-cols-[160px_1fr] md:gap-x-10">
            <dt className="cs-eyebrow md:pt-1">Challenge</dt>
            <dd className="cs-body max-w-[var(--cs-prose-col)]">
              Enterprise brands ran 100 to 500-SKU batches, but they lived
              outside ShopOS: a standalone dashboard delivered the work, and
              briefing, feedback, and approval all happened over WhatsApp.
              They received batches; they never touched the rest of the
              product.
            </dd>

            <dt className="cs-eyebrow md:pt-1">Approach</dt>
            <dd className="cs-body max-w-[var(--cs-prose-col)]">
              Stop treating it as a dashboard to redesign. Fold it into
              ShopOS, so brand context makes every batch <em>better</em> and
              the client comes inside the whole product.
            </dd>

            <dt className="cs-eyebrow md:pt-1">Solution</dt>
            <dd className="cs-body max-w-[var(--cs-prose-col)]">
              In-product batch creation and review (input vs output,
              pinpoint annotations), per-SKU approval, Brand Memory at
              onboarding, and credits that open up Spaces and Cowork.
            </dd>

            <dt className="cs-eyebrow md:pt-1">Impact</dt>
            <dd className="cs-body max-w-[var(--cs-prose-col)]">
              Batch close 14 days &rarr; 8 to 9. ~20 to 25 fewer SKU
              rejections per 100. 2 of 10 clients now work inside the
              product beyond their batches.
            </dd>
          </dl>
        </ProseColumn>
      </Container>

      {/* ===== My role / Timeline / Team / Tools ======================== */}
      <Container className="reveal pt-16 md:pt-20">
        <ProseColumn>
          <dl
            className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 md:gap-x-10"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {[
              { k: "My role", v: "Design, Front End" },
              { k: "Timeline", v: "2026" },
              {
                k: "Team",
                v: "ShopOS founding team, PM, engineers, account managers, me",
              },
              { k: "Tools", v: "Figma, React" },
            ].map(({ k, v }) => (
              <div key={k}>
                <dt className="cs-eyebrow">{k}</dt>
                <dd className="cs-meta-value mt-3">{v}</dd>
              </div>
            ))}
          </dl>
        </ProseColumn>
      </Container>

      {/* ===== 01 · Context ============================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Context</Eyebrow>
            <SectionHeader>
              Enterprise brands used ShopOS without ever being inside it.
            </SectionHeader>
            <Prose className="mt-8">
              <p>
                An enterprise brand wants a summer collection: 100 to 500
                product images, each SKU on a generated background. They
                brief it to an account manager over WhatsApp, ShopOS
                generates the batch, and a standalone dashboard delivers it
                back.
              </p>
              <p>
                The brand handed over a
                request and received images. Everything that mattered,
                briefing the work, judging it, asking for changes, approving
                it, happened in a chat thread, outside the product. The rest
                of ShopOS, the part that could actually make their work
                better, they never saw.
              </p>
            </Prose>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 02 · The friction ======================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>The friction</Eyebrow>
          <SectionHeader>
            The review loop lived in a chat thread, and one reject killed the
            batch.
          </SectionHeader>

          {/* Two-column editorial block, faithful to the reference: a short
              umbrella heading on the left (top-aligned, sticky on desktop),
              the narrative + the three constraint cards stacked on the right. */}
          <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-8 md:mt-16 md:grid-cols-[minmax(0,1fr)_minmax(0,640px)]">
            <h3 className="text-[20px] font-semibold leading-snug tracking-[-0.01em] text-[#0a0a0a] md:sticky md:top-28 md:self-start md:text-[22px]">
              Three things made the work slow.
            </h3>

            <div className="space-y-4">
              <ProblemCard icon={ICON_COMPARE} title="No input to compare against">
                You judged a generated image from memory of the garment,
                never side by side with it.
              </ProblemCard>
              <ProblemCard icon={ICON_FEEDBACK} title="No feedback where the work lived">
                &ldquo;The print is off&rdquo; was a typed WhatsApp message
                with no image attached to it.
              </ProblemCard>
              <ProblemCard icon={ICON_APPROVAL} title="All-or-nothing approval">
                Reject one SKU and the entire batch went back to redo.
              </ProblemCard>
            </div>
          </div>

          <DeductionQuote>
            Out of 500 images you could love 499 and lose all of them over
            one. For batches that already took two weeks to close, that was
            the most expensive button in the product.
          </DeductionQuote>
        </Container>
      </section>

      {/* ===== 03 · The reframe ========================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>The reframe</Eyebrow>
            <SectionHeader>
              The dashboard wasn&rsquo;t broken. It was alone.
            </SectionHeader>
            <Prose className="mt-8">
              <p>
                The easy read was &ldquo;redesign the dashboard.&rdquo; The
                more useful read: its biggest problem wasn&rsquo;t on the
                screen at all.
              </p>
              <p>
                The dashboard was an island. Standalone, it could only ever
                make review faster. It could never make the batch{" "}
                <em>better</em>, and it could never pull the brand toward the
                rest of the product, because it was cut off from both. So the
                move wasn&rsquo;t to redesign the island. It was to connect it
                to the mainland: fold it into ShopOS.
              </p>
            </Prose>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 04 · The bet ============================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>The bet</Eyebrow>
            <SectionHeader>
              Fold it in, and the whole product starts to compound.
            </SectionHeader>
            <Prose className="mt-8">
              <p>
                Once the dashboard lives inside ShopOS, three things compound
                that a standalone tool structurally couldn&rsquo;t:
              </p>
            </Prose>
            <ul className="mt-6 space-y-3">
              <Bullet>
                <strong>Better batches.</strong> The brand&rsquo;s Brand
                Memory (voice, palette, rules, past decisions) is set up at
                onboarding and reads into every generation, so outputs come
                back on-brand from the first batch.
              </Bullet>
              <Bullet>
                <strong>More batches.</strong> Inside the product, the brand
                reaches past the single lifestyle style the old dashboard
                allowed into the full range of Spaces, many more batch types
                and variations.
              </Bullet>
              <Bullet>
                <strong>A reason to stay.</strong> Credits let them work
                beyond batches, edits, one-off generations, Cowork, so the
                dashboard stops being a delivery window and becomes the front
                door to the whole product.
              </Bullet>
            </ul>

            <Prose className="mt-10">
              <p>
                The review fix was the visible part. The integration was the
                leverage.
              </p>
            </Prose>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 05 · The solution (merged: the loop + what shipped) ====== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>The solution</Eyebrow>
            <SectionHeader>
              The whole loop, now inside the product.
            </SectionHeader>
            <Prose className="mt-8">
              <p>
                Walk it the way a brand does. Every step that used to live in
                a chat thread now lives on the work itself:
              </p>
            </Prose>
          </ProseColumn>
        </Container>

        {/* scroll-driven horizontal carousel: pins, slides cards right -> left
            as the reader scrolls, then releases to the rest of the case study */}
        <FlowCarousel image={FLOW_IMG} />

        <Container className="mt-16 md:mt-20">
          <ProseColumn>
            <Prose>
              <p>
                I designed and built the full surface in React, from the
                redesigned enterprise home to the per-SKU review screen, so it
                reads as one product, not a dashboard bolted on beside it.
              </p>
            </Prose>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 07 · The results (impact stat list) ===================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>The results</Eyebrow>
            <SectionHeader>
              The loop got faster, the work got better, and brands started
              staying.
            </SectionHeader>
            <FaintMeta className="mt-6">
              Estimated from structured debriefs with the account managers
              who own these clients, not from instrumented analytics. I went
              to the people closest to the work for the most honest read
              available.
            </FaintMeta>
            <ul className="mt-8 space-y-4">
              <Bullet>
                <strong>Batch close time: 14 days &rarr; 8 to 9 days.</strong>{" "}
                A batch that averaged two weeks to finalize now closes in a
                little over one. Less back-and-forth, faster decisions,
                outputs that needed less fixing.
              </Bullet>
              <Bullet>
                <strong>~20 to 25 fewer SKU rejections per 100.</strong>{" "}
                Brand Memory set up at onboarding meant outputs came back
                on-brand from the first batch. Compounding Context, showing
                up as a lower reject rate.
              </Bullet>
              <Bullet>
                <strong>
                  2 of 10 enterprise clients now work inside the product
                  beyond their batches
                </strong>
                , spending credits on edits and one-off generations. The
                clearest proof the bet landed: clients who used to only
                receive deliverables are now using ShopOS itself, a revenue
                motion the standalone dashboard could never have created.
              </Bullet>
            </ul>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 08 · What I'd do differently ============================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>What I&rsquo;d do differently</Eyebrow>
            <SectionHeader>
              Opening the door wasn&rsquo;t the same as inviting people in.
            </SectionHeader>
            <Prose className="mt-8">
              <p>
                I assumed that once enterprise clients were inside the
                product, they&rsquo;d naturally explore the rest of it. Most
                didn&rsquo;t. They came for batches and stayed on batches. The
                integration made the whole product reachable, but reachable
                isn&rsquo;t the same as inviting, and I under-designed the
                nudges that would pull a brand from &ldquo;my batch is
                done&rdquo; into &ldquo;let me try this in Spaces.&rdquo; The
                door was open. I just hadn&rsquo;t built enough reasons to
                walk through it.
              </p>
              <p>
                The enterprise dashboard used to be a window the brand looked
                through. Now it&rsquo;s the front door they walk in through,
                and because it opens onto the rest of ShopOS, every batch they
                run makes the next one easier.
              </p>
            </Prose>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== Closing CTA ============================================== */}
      <section className="reveal py-20 md:py-28">
        <Container>
          <ProseColumn>
            <Prose>
              <p>
                Want to see how a batch moves through it end to end?{" "}
                <Link
                  href="/about#contact"
                  className="underline decoration-[#0a0a0a]/40 underline-offset-[5px] transition-colors hover:decoration-[#0a0a0a]"
                >
                  Say hello
                </Link>
                .
              </p>
            </Prose>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== Footer ==================================================== */}
      <section className="border-t border-[#E5E5E5] py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <Pill href="/">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M19 12H5M11 6l-6 6 6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Back to Work
            </Pill>
            <Link
              href="/work/brand-memory"
              className="inline-flex items-center gap-4 text-[15px] font-medium text-[#525252] transition-colors hover:text-[#0a0a0a]"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#525252]">
                Next
              </span>
              <span className="text-[20px] font-black uppercase tracking-tight text-[#0a0a0a] md:text-[24px]">
                Brand Memory
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </Container>
      </section>

      {/* Per-case-study chat, FAB launcher + full-screen takeover */}
      <ChatLauncher project="enterprise-dashboard" />
    </main>
  );
}
