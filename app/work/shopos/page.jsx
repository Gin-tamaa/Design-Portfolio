// app/work/shopos/page.jsx
// Aperture-style ShopOS case study. Client component because of the scroll-
// driven parallax hero + nav transition + intersection-observer reveals.
//
// Hero layers (each parallaxes at a different rate):
//   • Sky bg + clouds         (0.35)
//   • Wordmark "Agents"       (0.55, fades to 0 by 70% hero height)
//   • Brackets (4 corners)    (0.50)
//   • Agents transparent PNG  (0.22, moves slowest = stays longest)
//
// Reduced motion → everything static + visible.
// Mobile (<768px) → halve the parallax multipliers.

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import VideoBlock from "./VideoBlock";
import ChatLauncher from "../../components/ChatLauncher";
import AgentsFanOut from "./AgentsFanOut";
import TooManyTasks from "./TooManyTasks";
import CardsVersionSwitcher from "./CardsVersionSwitcher";
import AgentsJoinLoop from "./AgentsJoinLoop";

const SKY_SRC = "/images/shopos-hero-sky.png";
const AGENTS_SRC = "/images/agents-hero.png";

/* ============================================================================
   Primitives
============================================================================ */

function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1080px] px-6 md:px-10 ${className}`}>
      {children}
    </div>
  );
}

// Type helpers driven by the .cs-scope variables in globals.css. Adjust
// the scale once in globals.css; these stay layout-only.

function Eyebrow({ children, dark = false }) {
  return (
    <p className={`cs-eyebrow ${dark ? "cs-on-dark" : ""}`}>{children}</p>
  );
}

function SectionHeader({ children, className = "", dark = false }) {
  return (
    <h2
      className={`cs-section mt-6 max-w-[32ch] ${dark ? "cs-on-dark" : ""} ${className}`}
    >
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

// One reusable image slot. Cream-toned box with a thin warm border and a
// muted "Image coming" empty state when no src is passed; the caption
// renders BELOW the box in small muted body type. Accepts an optional
// src so a real 2x export can be dropped in later without layout change.
function ImageSlot({
  caption,
  src,
  alt = "",
  aspect = "video",
  className = "",
}) {
  const aspectClass =
    aspect === "portrait"
      ? "aspect-[4/5]"
      : aspect === "square"
      ? "aspect-square"
      : aspect === "wide"
      ? "aspect-[16/10]"
      : "aspect-video";
  return (
    <figure className={className}>
      <div
        className={`w-full ${aspectClass} overflow-hidden rounded-2xl border border-[#E5DDD0] bg-[#F4F1EA]`}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center px-8">
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#857d6d]">
              Image coming
            </span>
          </div>
        )}
      </div>
      {caption ? (
        <figcaption className="mt-3 max-w-[var(--cs-prose-col)] text-[13px] leading-[1.55] text-[#525252]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

// Italic, muted one-line lead used directly under section H2s. Slightly
// smaller than body (16px vs body's 17px) to read as orientation, not
// body copy.
function Lead({ children, className = "" }) {
  return (
    <p
      className={`mt-6 max-w-[var(--cs-prose-col)] text-[16px] italic leading-[1.7] text-[#525252] ${className}`}
    >
      {children}
    </p>
  );
}

// Liquid-glass pill used inside the Figma 184:2156 gradient card. All
// styling lives in globals.css under .glass-pill — pseudo-elements
// stack the layers (refraction ::after under highlight ::before under
// label). The macOS-reference technique applies the SVG filter via
// filter: url() on a ::after that snapshots the backdrop via
// backdrop-filter: blur(0), so the gradient actually bends.
function GlassPill({ children }) {
  return (
    <span className="glass-pill">
      <span className="glass-pill__label">{children}</span>
    </span>
  );
}

function PlusMinus({ type, text }) {
  const isPlus = type === "+";
  const sigil = isPlus ? "+" : "−";
  const sigilColor = isPlus ? "text-emerald-700" : "text-rose-700/80";
  return (
    <li className="flex gap-3">
      <span className={`mt-[1px] flex-shrink-0 font-semibold ${sigilColor}`}>
        {sigil}
      </span>
      <span className="text-[#0a0a0a]/85">{text}</span>
    </li>
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

/* Bracket — single 24×24 SVG drawing the bottom-left L shape; rotated for the
   other three corners via a `pos` prop. */
function Bracket({ pos, className = "" }) {
  const rot = { tl: 90, tr: 180, br: -90, bl: 0 }[pos] ?? 0;
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute h-6 w-6 ${className}`}
      style={{ transform: `rotate(${rot}deg)` }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M0 0 L0 23 L24 23"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </svg>
    </span>
  );
}

/* ============================================================================
   Page
============================================================================ */

export default function ShopOSCaseStudy() {
  const heroRef = useRef(null);
  const skyRef = useRef(null);
  const wordmarkRef = useRef(null);
  const bracketsRef = useRef(null);
  const agentsRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mediaQuery.matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // Mark the body so the global Nav inverts to white-over-hero
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
        if (bracketsRef.current) {
          bracketsRef.current.style.transform = `translate3d(0, ${y * 0.5 * mult}px, 0)`;
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
    update(); // initial position + nav state

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
      {/* ===== HERO — parallax stage ===================================== */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden"
        style={{ height: "min(820px, calc(100vh + 60px))", minHeight: "640px" }}
      >
        {/* Layer 1: sky + clouds bg (parallax 0.35) */}
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
          {/* Fallback CSS gradient in case the sky asset 404s — same teal→white */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10"
            style={{
              background:
                "linear-gradient(180deg, #2aa3a8 0%, #66bdc1 28%, #b8dbdc 60%, #ffffff 100%)",
            }}
          />
        </div>

        {/* Layer 2: brackets (parallax 0.50) — 4 corners */}
        <div
          ref={bracketsRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 text-white will-change-transform"
        >
          <Bracket pos="tl" className="top-[17.2%] left-[23.75%]" />
          <Bracket pos="tr" className="top-[17.2%] right-[23.75%]" />
          <Bracket pos="bl" className="top-[50.1%] left-[23.75%]" />
          <Bracket pos="br" className="top-[50.1%] right-[23.75%]" />
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
            fontSize: "clamp(96px, 17vw, 240px)",
            lineHeight: 1.08,
            letterSpacing: "-0.06em",
            color: "#ffffff",
            whiteSpace: "nowrap",
            margin: 0,
          }}
        >
          Agents
        </h1>

        {/* Layer 4: agents transparent PNG (parallax 0.22 — moves slowest) */}
        <div
          ref={agentsRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 will-change-transform"
          style={{ top: "calc(332/760 * 100%)" }}
        >
          <img
            src={AGENTS_SRC}
            alt=""
            className="mx-auto block h-auto w-[80vw] max-w-[1145px] select-none"
            draggable={false}
          />
        </div>

        {/* Bottom fade overlay — smooths into the white content below */}
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

      {/* ===== TOP, back link + kicker + H1 + lede =====================
           New entry per the storyteller doc:
           - kicker line of project metadata
           - the storyteller H1 ("From wearing eight hats to directing
             eight agents")
           - storyteller lede paragraph
           Type scale untouched: cs-eyebrow / cs-thesis / cs-lede are the
           same classes used previously. */}
      <Container className="reveal pt-16 md:pt-20">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#525252] transition-colors hover:text-[#0a0a0a]"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M19 12H5M11 6l-6 6 6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Work
        </Link>

        <p className="cs-eyebrow mt-10">
          ShopOS &middot; &ldquo;Mission Control&rdquo; &middot; Research
          &middot; Product Design &middot; Frontend &middot; Mar 2026
          &ndash; Present
        </p>
        <h1 className="cs-thesis mt-4 max-w-[var(--cs-prose-col)]">
          From wearing eight hats to directing eight agents
        </h1>
        <p className="cs-lede mt-6 max-w-[var(--cs-prose-col)]">
          How an under-resourced brand went from doing every job by hand
          to directing a department of named AI agents that hand work to
          each other in real time.
        </p>
      </Container>

      {/* ===== Agents fan-out thumbnail ====================================
           One agent stacked centre-screen; as the user scrolls into the
           thumbnail the agents fan out horizontally on a staggered ease.
           Replaces the placeholder intro video. */}
      <Container className="reveal pt-16 md:pt-24">
        <AgentsFanOut />
      </Container>

      {/* ===== TL;DR =====================================================
           Storyteller markdown opens with a Challenge / Approach /
           Solution / Impact summary table. Rendered here as a labelled
           definition grid (eyebrow label left, prose right) so it reads
           as a structured abstract, not a body section. */}
      <Container className="reveal pt-20 md:pt-28">
        <p className="cs-eyebrow">TL;DR</p>
        <dl className="mt-8 grid grid-cols-1 gap-y-8 md:grid-cols-[160px_1fr] md:gap-x-10">
          <dt className="cs-eyebrow md:pt-1">Challenge</dt>
          <dd className="cs-body max-w-[var(--cs-prose-col)]">
            A brand had AI that could write a caption or fake a product
            shot, but nothing that could <em>own</em> a function and run
            it. Someone was still personally on SEO, paid, email,
            reviews, and the numbers, all at once.
          </dd>

          <dt className="cs-eyebrow md:pt-1">Approach</dt>
          <dd className="cs-body max-w-[var(--cs-prose-col)]">
            Don&rsquo;t build a smarter chatbot. Model the team that
            already existed in our building, then design one surface
            where a brand can see that team, brief it, and watch it work.
          </dd>

          <dt className="cs-eyebrow md:pt-1">Solution</dt>
          <dd className="cs-body max-w-[var(--cs-prose-col)]">
            Mission Control: a single screen that opens on your team,
            lets you shape and brief any agent, surfaces only what needs
            you, and shows the work happening live.
          </dd>

          <dt className="cs-eyebrow md:pt-1">Impact</dt>
          <dd className="cs-body max-w-[var(--cs-prose-col)]">
            Eight agents live with 10+ enterprise brands. In a 15-day
            GEO pilot, the agents took a brand from cited by zero AI
            engines to cited by all four. Designed end to end, frontend
            built to near-production fidelity.
          </dd>
        </dl>
      </Container>

      {/* ===== My role + Timeline / Team / Tools =========================
           My role is the Owned / Co-created / Guided split (the
           storyteller doc explicitly lists what was personally owned
           versus co-created versus guided). The thinner Timeline / Team
           / Tools triplet sits in a 3-up rail below it. */}
      <Container className="reveal pt-16 md:pt-20">
        <div className="max-w-[var(--cs-prose-col)]">
          <p className="cs-eyebrow">My role</p>
          <p className="cs-body mt-3">
            <em>Owned:</em> research loop, end-to-end product design, the
            shipped frontend (onboarding, agent setup, Kanban, Mission
            Control, Cowork, the multi-agent thread).{" "}
            <em>Co-created:</em> the agent roster and what each agent
            owns. <em>Guided:</em> production handoff with engineers.
          </p>
        </div>

        <dl
          className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:mt-12 md:grid-cols-3 md:gap-x-10"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {[
            { k: "Timeline", v: "Mar 2026 – Present" },
            { k: "Team", v: "Founding team + engineers" },
            { k: "Tools", v: "Figma, Cursor, Claude Code" },
          ].map(({ k, v }) => (
            <div key={k}>
              <dt className="cs-eyebrow">{k}</dt>
              <dd className="cs-meta-value mt-3">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* ===== 01 · A brand running a store... ===========================
           Kept as PROSE per spec (context opening). TooManyTasks is one
           of the two existing thumbnails that stay exactly where they
           are; it lives in this section and is left untouched. */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Context</Eyebrow>
          <SectionHeader>
            A brand running a store is running eight jobs at once
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              By 2026, a brand had AI that could write a caption or
              generate a product shot. Useful, but it didn&rsquo;t run
              the store. Someone was still on SEO, on paid, on email,
              watching the numbers, answering reviews. Every hat worn at
              once, with no way to watch it all.
            </p>
            <p>
              <em>
                Launch email &middot; product shot &middot; paid campaign
                &middot; yesterday&rsquo;s ROAS &middot; caption &middot;
                analytics &middot; customer replies &middot; video script
                &middot; SEO audit &middot; social post &middot; restock
                alerts &middot; newsletter.
              </em>
            </p>
            <p>
              Then agents changed what was possible. Not another tool to
              open, but something that could own a function and run it
              around the clock. The opening wasn&rsquo;t a better image
              generator. It was the whole store, covered.
            </p>
          </Prose>

          {/* Existing TooManyTasks thumbnail, kept in its current
              section, untouched. */}
          <div className="mt-16 md:mt-20">
            <TooManyTasks />
          </div>
        </Container>
      </section>

      {/* ===== 02 · This wasn't a chat problem. It was an org problem. ===
           Outer bordered card (rounded-[30px], border-#E5E5E5,
           bg-white, p-8 md:p-12). Image (chat-problem-bubbles.png,
           extracted from Figma 210:10057) on the left at col-span-7,
           sized to fill min-h-[420px]/md:min-h-[520px] via object-cover
           so it matches Section 4's blue card visual weight. Text
           on the right at col-span-5. */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <div className="rounded-[30px] border border-[#E5E5E5] bg-white p-8 md:p-12">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-center md:gap-16">
              {/* LEFT, peach gradient + bubbles, straight from Figma */}
              <div className="overflow-hidden rounded-3xl md:col-span-7">
                <img
                  src="/images/shopos/chat-problem-bubbles.png"
                  alt="A peach gradient mini-card holding three chat bubble pills: 'ShopOS Thought for 12s' with the sparkle mark, 'Who will manage my store?' with a brown-haired user avatar, and 'Who handles branding?' with a pink-haired user avatar."
                  width={718}
                  height={654}
                  className="block h-full min-h-[420px] w-full object-cover md:min-h-[520px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>

              {/* RIGHT, eyebrow + headline + body */}
              <div className="md:col-span-5">
                <div className="flex flex-col gap-4">
                  <p className="cs-eyebrow">The reframe</p>
                  <h2 className="cs-section max-w-[18ch]">
                    This wasn&rsquo;t a chat problem. It was an org
                    problem.
                  </h2>
                </div>
                <p className="mt-6 max-w-[var(--cs-prose-col)] text-[16px] italic leading-[1.7] text-[#525252]">
                  Single-agent chat is solved. Nobody had a pattern
                  for one agent recruiting specialists into a
                  conversation, reasoning out loud, and reporting
                  back without losing the human watching.
                </p>
                <p className="cs-body mt-6 max-w-[var(--cs-prose-col)]">
                  That reframe is the whole project. The challenge
                  wasn&rsquo;t the prompt box. It was{" "}
                  <strong>Legible Orchestration</strong>: making a team
                  of autonomous agents <em>watchable</em>, so a brand
                  can trust work it never personally checked. An AI
                  team that fails silently isn&rsquo;t a team. Trust
                  was the product, and the rest of this is how one
                  screen earns it.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== 03 · We didn't invent the team... =========================
           Layout per Figma 210:5115. The four approach steps render as
           a 4-column numbered row on desktop (big number + small body
           text below each), collapsing to 2x2 on tablet and a single
           column on mobile. Pure HTML, no image — all copy stays
           selectable. */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>The approach</Eyebrow>
          <SectionHeader>
            We didn&rsquo;t invent the team. We modeled it on our own.
          </SectionHeader>
          <Lead>
            The roles already existed in our building. I built the team
            on people we had, then pressure-tested it on the ones closest
            to the customer.
          </Lead>

          <ol className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 md:mt-16 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Modeled each agent on a real role: paid lead, CRM manager, creative director",
              "Built an internal MVP, ran it through our own team, each person testing the agent for the job they actually do",
              "Leaned hardest on CRM and sales, the people closest to users, to pressure-test which agents mattered",
              "Validated cheap: a vibe-coded MVP in front of onboarded brands first, the Figma version built in parallel as feedback came in",
            ].map((text, i) => (
              <li key={i} className="flex flex-col">
                <span className="text-[24px] font-medium leading-none tabular-nums text-[#0a0a0a] md:text-[28px]">
                  {i + 1}
                </span>
                <p className="mt-6 text-[15px] leading-[1.65] text-[#525252] md:text-[16px]">
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* ===== 04 · Divider, Figma 184:2156 ==============================
           5/7 grid: text on the left, gradient card with four step
           rows on the right. The eyebrow lives in the left column
           above the headline (16px gap). Step rows are fixed
           max-w-[400px], centered. Pills use a real liquid-glass
           treatment (.glass-pill in globals.css) backed by an SVG
           displacement filter inlined below for refraction. */}
      <section className="reveal py-24 md:py-36">
        {/* Inline SVG filter for the liquid-glass refraction. zero-size
            + absolute + pointer-events: none so it doesn't take any
            layout. fractalNoise + feDisplacementMap produces the gentle
            bending of the gradient that the .glass-pill applies via
            backdrop-filter: url(#liquid-glass-pill). */}
        <svg
          aria-hidden="true"
          width="0"
          height="0"
          style={{
            position: "absolute",
            width: 0,
            height: 0,
            pointerEvents: "none",
          }}
        >
          <defs>
            {/* Figma Glass: Refraction 80 → feDisplacementMap scale 70.
                feTurbulence baseFrequency is intentionally low so the
                refraction reads as smooth waves rather than grain. */}
            <filter
              id="liquid-glass-pill"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.01 0.01"
                numOctaves="2"
                seed="92"
                result="noise"
              />
              <feGaussianBlur in="noise" stdDeviation="0.5" result="softNoise" />
              <feDisplacementMap
                in="SourceGraphic"
                in2="softNoise"
                scale="70"
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
        <Container>
          {/* Outer rounded card with a hairline light border, matching
              the Figma container (rounded-[30px], bg-white). Sits
              around both the text column and the gradient card so the
              whole section reads as one boxed unit. */}
          <div className="rounded-[30px] border border-[#E5E5E5] bg-white p-8 md:p-12">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:items-center md:gap-16">
              {/* LEFT, eyebrow + headline (tight) + body. h2 is
                  inlined here instead of using <SectionHeader> so we
                  can control the spacing precisely (the helper
                  hardcodes mt-6). */}
              <div className="md:col-span-5">
                <div className="flex flex-col gap-4">
                  <p className="cs-eyebrow">The hard part</p>
                  <h2 className="cs-section max-w-[32ch]">
                    The product, the way you actually move through it
                  </h2>
                </div>
                <p className="mt-6 max-w-[var(--cs-prose-col)] text-[16px] italic leading-[1.7] text-[#525252]">
                  Built for founders, but the founder rarely sits in it
                  all day. A founder buys a super team for the org; the
                  brand&rsquo;s own marketing, CRM, and ops people run
                  it, each working the agents they own.
                </p>
                <p className="cs-body mt-6 max-w-[var(--cs-prose-col)]">
                  The walk below is that surface, in the order you move
                  through it: meet the team &rarr; shape and brief an
                  agent &rarr; watch the work &rarr; read what needs
                  you. Each screen carries the one decision that earned
                  it.
                </p>
              </div>

              {/* RIGHT, gradient card. Gradient angle/stops are from
                  Figma node 186:2041 verbatim. Inner ul uses
                  items-center so the fixed-width rows centre
                  horizontally in the card; justify-between distributes
                  the four rows vertically. */}
              <div
                className="md:col-span-7 overflow-hidden rounded-3xl"
                style={{
                  background:
                    "linear-gradient(137.67deg, #026DDB 0%, #4EEEC2 100%)",
                }}
              >
                <ul className="flex min-h-[420px] flex-col items-center justify-between gap-8 px-8 py-14 md:min-h-[520px] md:gap-10 md:px-10 md:py-20">
                  {[
                    ["Step 1", "Meet the team"],
                    ["Step 2", "Shape and brief an agent"],
                    ["Step 3", "Watch the work"],
                    ["Step 4", "Review what needs you"],
                  ].map(([n, label]) => (
                    <li
                      key={n}
                      className="flex w-full max-w-[400px] items-center gap-2"
                    >
                      <GlassPill>{n}</GlassPill>
                      <GlassPill>{label}</GlassPill>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== 05 · First, you meet your team ============================
           Three labelled iterations. Each block: "0X . Title -> tag"
           header, tight bullet stack, ImageSlot. */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Meet the team</Eyebrow>
          <SectionHeader>First, you meet your team</SectionHeader>
          <Lead>
            Mission Control opens on the team, not a prompt box. Showing
            a team took three iterations, each one killing the
            last&rsquo;s confusion.
          </Lead>

          {/* ITERATION 01: Kanban MVP -> what not to build. */}
          <div className="mt-16 md:mt-20">
            <h3 className="text-[18px] font-semibold leading-tight md:text-[20px]">
              Version <span className="tabular-nums">1</span> - Kanban
            </h3>
            <div className="mt-10 md:mt-12">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/images/shopos/kanban-mvp.png"
                  alt="v1 Kanban MVP: agents listed down the left, tasks in Kanban columns on the right. Four critique callouts overlaid: agents and tasks indistinguishable, ownership unclear, no connector path, red team feedback that it didn't read as an agent experience."
                  width={3840}
                  height={2160}
                  className="block h-auto w-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>

          {/* ITERATION 02: Cards. Same treatment as the Kanban MVP
              iteration. The bullet content is baked into the Figma
              frames, so the standalone bullet list is omitted. The
              CardsVersionSwitcher renders an interactive 2-frame
              switcher (Kanban view <-> Cards-grid view) that
              auto-cycles every 5s and lets the user click the
              right-side callouts or the bottom dots to lock onto
              a frame. */}
          <div className="mt-20 md:mt-24">
            <h3 className="text-[18px] font-semibold leading-tight md:text-[20px]">
              Version <span className="tabular-nums">2</span> - Cards
              view
            </h3>
            <div className="mt-10 md:mt-12">
              <CardsVersionSwitcher />
            </div>
          </div>

          {/* ITERATION 03: Org view. Same treatment as v1 and v2 — the
              two bullet points are baked into the Figma export as
              glass-pill callouts on the left of the composition, so
              the standalone bullet list above is omitted. */}
          <div className="mt-20 md:mt-24">
            <h3 className="text-[18px] font-semibold leading-tight md:text-[20px]">
              Version <span className="tabular-nums">3</span> - Org view
            </h3>
            <div className="mt-10 md:mt-12">
              <div className="overflow-hidden rounded-2xl">
                <img
                  src="/images/shopos/cards-v3.png"
                  alt="v3 Org view: brand-as-orchestrator at the top, branching into Discover / Acquire / Convert / Retain / Grow with specialist agents grouped under each lifecycle stage. Two glass-pill callouts on the left explain the structure: 'Orchestrator at top, five lifecycle stages across, specialists grouped beneath each' and 'The proud move: the brand's own name sits at the top, so it reads you run this team, not the software has a manager.'"
                  width={3840}
                  height={2160}
                  className="block h-auto w-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* ===== 06 · The tradeoff I'd redo ================================
           Kept as prose per spec. No visual slot. */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>The honest tradeoff</Eyebrow>
          <SectionHeader>The tradeoff I&rsquo;d redo</SectionHeader>
          <Prose className="mt-12">
            <p>
              I went back and forth on the org view. A lifecycle funnel
              is a heavy metaphor for something that should feel alive,
              and I worried it read too literal. I kept it because the
              comprehension win was real and measured: people understood
              the model instantly with it, and stumbled without it. I
              chose what taught users fastest over what I found most
              elegant. I&rsquo;d keep the hierarchy and keep refining
              how it&rsquo;s drawn.
            </p>
          </Prose>
        </Container>
      </section>

      {/* ===== 07 · Then you open an agent, and make it yours ============
           Three Figma panels (206:6535) rendered as a real grid: two
           panels side-by-side on top, full-width panel below. Bullet
           copy is baked into each panel's gradient so the standalone
           bullet list above is intentionally absent — same pattern as
           v1/v2/v3. The dark gaps that lived between the panels in
           the raw Figma export are gone; gap-6 page bg sits there
           instead. */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Make it yours</Eyebrow>
          <SectionHeader>
            Then you open an agent, and make it yours
          </SectionHeader>
          <Lead>
            Click any agent and it expands. This is where a stock agent
            becomes staff.
          </Lead>

          <div className="mt-10 grid grid-cols-1 gap-6 md:mt-12 md:grid-cols-2">
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/images/shopos/agent-panel-1.png"
                alt="'Inside: who it is, the jobs it runs, its connectors, and its editable soul.md' shown next to the expanded GEO agent panel, listing the four jobs (AI engine query tool, GEO visibility scorer, JSON-LD generator, Keyword research tool), the soul.md block, and connectors (Shopify, Google Search Console)."
                width={1840}
                height={1660}
                className="block h-auto w-full"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="overflow-hidden rounded-2xl">
              <img
                src="/images/shopos/agent-panel-2.png"
                alt="'soul.md is a short persona file you name and write. Russ opens his with Every statement includes a number. One line, and he answers differently forever' shown next to the soul.md editor for the GEO & SEO Strategist agent."
                width={1840}
                height={1660}
                className="block h-auto w-full"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="overflow-hidden rounded-2xl md:col-span-2">
              <img
                src="/images/shopos/agent-panel-3.png"
                alt="'From the same panel: chat with the agent, or hand it a job' shown above the A/B Test Setup screen mid-flow."
                width={3840}
                height={1660}
                className="block h-auto w-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ===== 08 · Two doors into one team ==============================
           Layout per Figma 210:5610. Two side-by-side cards, each one
           a peach-pink CSS gradient panel with the heading + body text
           rendered as real HTML on top, plus a small cropped UI
           screenshot (chat input pill / kanban columns) docked at the
           bottom. Mobile stacks single-column.

           The text is selectable, the gradient is editable in CSS,
           and only the actual product-UI bits are images — total
           image payload for this section is ~150KB instead of the
           ~1.5MB it would be if I had pasted the whole Figma frame. */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Briefing</Eyebrow>
          <SectionHeader>Two doors into one team</SectionHeader>
          <Lead>
            Same engine, two entry points. You brief the way your head
            already works.
          </Lead>

          <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2">
            {/* LEFT card: Chat / Cowork */}
            <article
              className="relative flex flex-col overflow-hidden rounded-3xl p-7 md:p-9"
              style={{
                background:
                  "linear-gradient(160deg, #fcdece 0%, #fcb88f 45%, #fc8870 75%, #fc6972 100%)",
              }}
            >
              <h3 className="text-[18px] font-semibold leading-tight text-[#0a0a0a] md:text-[20px]">
                Chat / Cowork
              </h3>
              <p className="mt-3 max-w-[34ch] text-[14px] leading-[1.55] text-[#0a0a0a] md:text-[15px]">
                For goal thinkers: state the outcome, talk to one agent
                or let the orchestrator recruit the team into one
                thread.
              </p>
              {/* Chat input pill, sourced from Figma 210:9547 (trimmed
                  of the dark canvas margin). */}
              <div className="mt-auto pt-10">
                <img
                  src="/images/shopos/two-doors-chat.png"
                  alt="A chat input pill reading 'Get me my emails from the connectors, create a theme-based mail for our upcoming shoe and send an email for the pre-hype phase of our sneaker' with a + attach button, Brand Memory toggle, and a send arrow."
                  width={603}
                  height={120}
                  className="block h-auto w-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </article>

            {/* RIGHT card: Jobs / Kanban */}
            <article
              className="relative flex flex-col overflow-hidden rounded-3xl p-7 md:p-9"
              style={{
                background:
                  "linear-gradient(160deg, #fcdece 0%, #fcb88f 45%, #fc8870 75%, #fc6972 100%)",
              }}
            >
              <h3 className="text-[18px] font-semibold leading-tight text-[#0a0a0a] md:text-[20px]">
                Jobs / Kanban
              </h3>
              <p className="mt-3 max-w-[34ch] text-[14px] leading-[1.55] text-[#0a0a0a] md:text-[15px]">
                For task thinkers: work moves Needs Attention &rarr; In
                Progress &rarr; Completed, tracked in the Tasks tab for
                bigger pieces
              </p>
              {/* Kanban board. Wrapped in a frosted-glass surface
                  (same recipe as the Section 4 glass pills) so the
                  kanban reads as sitting on a translucent pane over
                  the peach gradient, with a 1.5px white inset
                  highlight on the top-left and a faint inner glow.
                  Outer container negative margins + max-h still
                  keep the kanban bleeding out of the card's bottom
                  + right edges without growing card height. */}
              <div className="mt-auto -mb-7 -mr-7 max-h-[180px] overflow-hidden pt-8 md:-mb-9 md:-mr-9 md:max-h-[240px]">
                <div
                  className="rounded-tl-2xl"
                  style={{
                    background: "rgba(255, 255, 255, 0.10)",
                    backdropFilter: "blur(12px) saturate(160%)",
                    WebkitBackdropFilter: "blur(12px) saturate(160%)",
                    boxShadow:
                      "inset 1.5px 0 0 -0.5px rgba(255,255,255,0.7), inset 1.5px 1.5px 0 -0.5px rgba(255,255,255,0.7), inset 0 0 4px 1px rgba(255,255,255,0.25)",
                  }}
                >
                  <img
                    src="/images/shopos/two-doors-kanban.png"
                    alt="Scheduled (TOFU Static Ad with Monica), Need Attention (Pulling ad performance from Meta Ads with Gavin, Creative Brief with Richard, Ad Copy Variants partially visible), and In Progress (A/B Test Setup with Erlich) columns of the Kanban board, with the rest of the board bleeding out of the card's right and bottom edges."
                    width={1212}
                    height={660}
                    className="block h-auto w-[125%] max-w-none"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* ===== 09 · Then you watch the team think ========================
           Scaffolded: italic lead + tight bullet stack + ImageSlot. */}
      {/* ===== 09 · Then you watch the team think ========================
           2x2 grid of peach gradient cards, same recipe as Two doors
           (Section 8). Each card carries one of the four points as a
           heading + body + a small inline UI element built in JSX.
           Card 4 is the only one that uses a real asset (the pixel
           portrait photo bleeding off the bottom) because it's a
           photographic element, not a UI primitive. */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Watching</Eyebrow>
          <SectionHeader>Then you watch the team think</SectionHeader>
          <Lead>
            Legible Orchestration, made into pixels. Assign a goal and
            you get a window, not a spinner.
          </Lead>

          <div className="mt-12 grid grid-cols-1 gap-5 md:mt-16 md:auto-rows-fr md:grid-cols-2 md:gap-6">
            {/* Card 1, Agents join in */}
            <article
              className="relative flex flex-col overflow-hidden rounded-3xl p-7 md:p-9"
              style={{
                background:
                  "linear-gradient(160deg, #fcdece 0%, #fcb88f 45%, #fc8870 75%, #fc6972 100%)",
                minHeight: 420,
              }}
            >
              <h3 className="text-[18px] font-semibold leading-tight text-[#0a0a0a] md:text-[20px]">
                Agents join in
              </h3>
              <p className="mt-3 max-w-[32ch] text-[14px] leading-[1.55] text-[#0a0a0a] md:text-[15px]">
                Watch one agent pull another into the thread when work
                demands it
              </p>
              {/* "Adding agents..." indicator — cycles through the
                  four Figma 224:6051 states (sparkle → sparkle +
                  Richard → sparkle + curly → sparkle + curly +
                  green). Wrapper takes the remaining vertical space
                  and centers the loop, so the indicator sits halfway
                  between the body copy above and the card bottom. */}
              <div className="flex flex-1 items-center">
                <AgentsJoinLoop />
              </div>
            </article>

            {/* Card 2, They think out loud */}
            <article
              className="relative flex flex-col overflow-hidden rounded-3xl p-7 md:p-9"
              style={{
                background:
                  "linear-gradient(160deg, #fcdece 0%, #fcb88f 45%, #fc8870 75%, #fc6972 100%)",
                minHeight: 420,
              }}
            >
              <h3 className="text-[18px] font-semibold leading-tight text-[#0a0a0a] md:text-[20px]">
                They think out loud
              </h3>
              <p className="mt-3 max-w-[32ch] text-[14px] leading-[1.55] text-[#0a0a0a] md:text-[15px]">
                Reasoning states (&ldquo;thinking for 8s&rdquo;) show
                the work happening, not a frozen spinner
              </p>
              {/* Chat row: avatar + name | status + chevron, on a
                  white rounded pill */}
              <div className="mt-auto pt-10">
                <div
                  className="flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[13px] md:text-[14px]"
                  style={{
                    boxShadow:
                      "0 1px 2px rgba(0,0,0,0.06), 0 6px 18px rgba(0,0,0,0.06)",
                  }}
                >
                  <img
                    src="/images/shopos/agent-other.png"
                    alt="Richard avatar"
                    width={72}
                    height={72}
                    className="block h-7 w-7 flex-shrink-0 rounded-full"
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="font-medium text-[#0a0a0a]">
                    Richard (Store Manager)
                  </span>
                  <span className="text-[#bdbdbd]" aria-hidden="true">
                    |
                  </span>
                  <span className="truncate text-[#9a9a9a]">
                    Checking Meta ad
                    <span className="inline-flex">
                      <span className="ml-[2px]">.</span>
                      <span>.</span>
                      <span>.</span>
                    </span>
                  </span>
                  <svg
                    aria-hidden="true"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="ml-auto flex-shrink-0 text-[#9a9a9a]"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </article>

            {/* Card 3, The plan is visible */}
            <article
              className="relative flex flex-col overflow-hidden rounded-3xl p-7 md:p-9"
              style={{
                background:
                  "linear-gradient(160deg, #fcdece 0%, #fcb88f 45%, #fc8870 75%, #fc6972 100%)",
                minHeight: 420,
              }}
            >
              <h3 className="text-[18px] font-semibold leading-tight text-[#0a0a0a] md:text-[20px]">
                The plan is visible
              </h3>
              <p className="mt-3 max-w-[32ch] text-[14px] leading-[1.55] text-[#0a0a0a] md:text-[15px]">
                Multi-step Arcs show each step as it runs, not just the
                final result
              </p>
              {/* Arc plan card — exported from Figma as a transparent
                  PNG so the white card and the pink sparkle keep the
                  exact spec without rebuilding. Centered horizontally
                  so the empty card area balances on both sides. */}
              <div className="mt-auto flex justify-center pt-6">
                <img
                  src="/images/shopos/the-plan-is-visible.png"
                  alt="An Arc plan card with three steps: Research websites with a magnifying-glass icon, Analyse results with a framed search icon, and Create report with a notebook icon. A pink sparkle floats at the top-right of the card."
                  width={400}
                  height={320}
                  className="block h-auto w-[85%] max-w-[300px]"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </article>

            {/* Card 4, Nothing fails silently */}
            <article
              className="relative flex flex-col overflow-hidden rounded-3xl p-7 md:p-9"
              style={{
                background:
                  "linear-gradient(160deg, #fcdece 0%, #fcb88f 45%, #fc8870 75%, #fc6972 100%)",
                minHeight: 420,
              }}
            >
              <h3 className="text-[18px] font-semibold leading-tight text-[#0a0a0a] md:text-[20px]">
                Nothing fails silently
              </h3>
              <p className="mt-3 max-w-[34ch] text-[14px] leading-[1.55] text-[#0a0a0a] md:text-[15px]">
                Every state is designed, empty, loading, error, success,
                because trust dies the moment work disappears without a
                word
              </p>
              {/* Pixel portrait of the team, transparent PNG so it
                  sits directly on the card gradient. The only baked
                  image in this section because it's photographic
                  content, not a UI primitive. */}
              <div className="mt-auto -mb-7 -ml-7 -mr-7 pt-6 md:-mb-9 md:-ml-9 md:-mr-9">
                <img
                  src="/images/shopos/watching-people.png"
                  alt="A pixel-art illustration of five team members standing together: a person in plaid holding a coffee, a person holding a laptop, a person in a blazer, a person in a striped shirt, and a person in a dark suit holding a coffee."
                  width={683}
                  height={400}
                  className="block h-auto w-full"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </article>
          </div>
        </Container>
      </section>

      {/* ===== 10 · What needs you, in 60 seconds instead of six tabs ====
           Scaffolded: italic lead + 2-bullet stack + two ImageSlots. */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Mission Control</Eyebrow>
          <SectionHeader>
            What needs you, in 60 seconds instead of six tabs
          </SectionHeader>
          <Lead>
            Same surface, scrolled down. Above this sits the org view
            you already met; below it, Mission Control does the one
            job a tab-crawl never could: tell you what needs a human.
          </Lead>
          <ul className="mt-8 space-y-3 max-w-[var(--cs-prose-col)]">
            <Bullet>
              <strong>Needs Attention</strong>, pinned and capped at
              three: each item names the agent, the metric, and one
              action. Never a vague &ldquo;performance is down&rdquo;
            </Bullet>
            <Bullet>
              <strong>Activity</strong>: the live feed of what each
              agent is doing right now, in plain language, the moment
              they do it
            </Bullet>
          </ul>

          <div className="mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2">
            <ImageSlot
              aspect="wide"
              caption="Needs Attention: pinned, capped at three, agent + metric + action."
            />
            <ImageSlot
              aspect="wide"
              caption="Activity feed: each agent's current move, in plain language, as it happens."
            />
          </div>
        </Container>
      </section>

      {/* ===== 11 · What shipped =========================================
           Scaffolded: italic lead + 3-bullet stack + ImageSlot. */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>What shipped</Eyebrow>
          <SectionHeader>What shipped</SectionHeader>
          <Lead>
            Eight agents running real store work today, live with 10+
            enterprise brands. Designed end to end, frontend built
            across the full surface.
          </Lead>
          <ul className="mt-8 space-y-3 max-w-[var(--cs-prose-col)]">
            <Bullet>
              Onboarding, agent setup, the org view, the agent panels
            </Bullet>
            <Bullet>
              Cowork, the multi-agent thread, the Kanban board
            </Bullet>
            <Bullet>
              Needs Attention and Activity, every state to
              near-production fidelity
            </Bullet>
          </ul>

          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Shipped surfaces: onboarding, agent setup, org view, agent panel, Cowork, Kanban, Mission Control." />
          </div>
        </Container>
      </section>

      {/* ===== 12 · What we're measuring, live and honest about it =======
           Distinct scaffold block: dark card with italic lead, then
           two sub-sections (Real today + Still being instrumented),
           then the pending-quote line. Emojis and arrows kept as
           written. Old stub markers and bracketed name/role
           placeholders have been removed. */}
      <section className="reveal pb-24 pt-10 md:pb-36 md:pt-14">
        <Container>
          <div className="rounded-3xl bg-[#0a0a0a] px-8 py-16 text-white md:px-14 md:py-20">
            <Eyebrow dark>Proof</Eyebrow>
            <h2 className="cs-section cs-on-dark mt-6">
              What we&rsquo;re measuring, live and honest about it
            </h2>
            <p className="mt-6 max-w-[var(--cs-prose-col)] text-[16px] italic leading-[1.7] text-white/65">
              The product is live and already moving real numbers.
              Here&rsquo;s the proof that exists today, then the bets
              still being instrumented. No dressed-up data.
            </p>

            {/* Real, today */}
            <p className="mt-14 text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">
              Real, today
            </p>
            <ul className="mt-6 space-y-5 max-w-[var(--cs-prose-col)]">
              <li className="flex gap-3 text-[17px] leading-[1.65] text-white/90">
                <span
                  aria-hidden="true"
                  className="mt-[10px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-white/40"
                />
                <span>
                  <strong className="font-semibold">8</strong> agents
                  live with 10+ enterprise brands, running real store
                  work
                </span>
              </li>
              <li className="flex gap-3 text-[17px] leading-[1.65] text-white/90">
                <span
                  aria-hidden="true"
                  className="mt-[10px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-white/40"
                />
                <span>
                  <strong className="font-semibold">0 &rarr; 4</strong>{" "}
                  AI engines: in a 15-day GEO pilot for a denim DTC
                  brand, the GEO agent took the brand from cited by{" "}
                  <em>zero</em> engines to cited by <em>all four</em>{" "}
                  (ChatGPT, Claude, Perplexity, Gemini). Perplexity
                  citations 7% &rarr; 13%, technical health 59% &rarr;
                  65%, 20 articles published. One brand, fifteen days,
                  early and directional, but real and run end to end by
                  an agent
                </span>
              </li>
            </ul>

            {/* Still being instrumented */}
            <p className="mt-14 text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">
              Still being instrumented
            </p>
            <ul className="mt-6 space-y-5 max-w-[var(--cs-prose-col)]">
              <li className="flex gap-3 text-[15px] leading-[1.7] text-white/85">
                <span
                  aria-hidden="true"
                  className="mt-[10px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-white/40"
                />
                <span>
                  <span aria-hidden="true">🎯</span>{" "}
                  <strong className="font-semibold">Goal:</strong>{" "}
                  specialist hours collapse into agent minutes ·{" "}
                  <span aria-hidden="true">📢</span>{" "}
                  <strong className="font-semibold">Signal:</strong>{" "}
                  brands stop opening six tabs and brief the team
                  instead ·{" "}
                  <span aria-hidden="true">📊</span>{" "}
                  <strong className="font-semibold">Metric:</strong>{" "}
                  hours run per agent, specialist-hours saved
                </span>
              </li>
              <li className="flex gap-3 text-[15px] leading-[1.7] text-white/85">
                <span
                  aria-hidden="true"
                  className="mt-[10px] h-[5px] w-[5px] flex-shrink-0 rounded-full bg-white/40"
                />
                <span>
                  <span aria-hidden="true">🎯</span>{" "}
                  <strong className="font-semibold">Goal:</strong> the
                  team feels like a team ·{" "}
                  <span aria-hidden="true">📢</span>{" "}
                  <strong className="font-semibold">Signal:</strong>{" "}
                  clients name agents unprompted ·{" "}
                  <span aria-hidden="true">📊</span>{" "}
                  <strong className="font-semibold">Metric:</strong>{" "}
                  client-confirmed lift on the owned function
                </span>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* ===== Closing paragraph + CTA ===================================
           The storyteller doc closes with a one-paragraph payoff and a
           "Say hello" CTA pointing at /about#contact. */}
      <section className="reveal py-20 md:py-28">
        <Container>
          <Prose>
            <p>
              The roster shipped as designed, and runs real stores today.
              The durable idea underneath it isn&rsquo;t eight agents or
              one dashboard. It&rsquo;s that an autonomous team only
              earns trust when a human can watch it think, and that a
              single surface can carry the whole arc from meeting your
              team to seeing what needs you. That&rsquo;s the pattern
              ShopOS now builds everything else on.
            </p>
            <p>
              Curious how the orchestration thread actually behaves?{" "}
              <Link
                href="/about#contact"
                className="underline decoration-[#0a0a0a]/40 underline-offset-[5px] transition-colors hover:decoration-[#0a0a0a]"
              >
                Say hello
              </Link>{" "}
              and I&rsquo;ll walk you through it.
            </p>
          </Prose>
        </Container>
      </section>

      {/* ===== Footer ===================================================== */}
      <section className="border-t border-[#E5E5E5] py-24">
        <Container>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <Pill href="/work">
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
              href="/work"
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

      {/* Per-case-study chat — FAB launcher + full-screen takeover */}
      <ChatLauncher project="shopos" />
    </main>
  );
}
