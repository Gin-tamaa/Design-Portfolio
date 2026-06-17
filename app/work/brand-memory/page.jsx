// app/work/brand-memory/page.jsx
// Brand Memory case study. Same scaffold as the ShopOS case study:
// parallax sky hero with a wordmark ("Memory" here, "Agents" there),
// .cs-scope main with the editorial type primitives, the TL;DR
// table, the "My role" block, and the section pattern of eyebrow →
// SectionHeader → Lead → Prose/bullets → ImageSlot.

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ChatLauncher from "../../components/ChatLauncher";
import PromptInput from "./PromptInput";
import NeuralNoise from "./NeuralNoise";

/* ============================================================================
   Primitives copied verbatim from the ShopOS scaffold so the two
   case studies stay in lockstep. If anything changes there, mirror
   it here.
============================================================================ */

// Shared case-study container. 1408px max-width with 24px mobile
// / 64px desktop padding, centered with mx-auto.
function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1408px] px-6 md:px-16 ${className}`}>
      {children}
    </div>
  );
}

// Narrow prose column for text content. LEFT-ALIGNED inside the
// wider Container so the prose shares its left edge with every
// full-width visual below.
function ProseColumn({ children, className = "" }) {
  return (
    <div className={`max-w-[var(--cs-prose-col)] ${className}`}>
      {children}
    </div>
  );
}

function Eyebrow({ children, dark = false }) {
  return (
    <p className={`cs-eyebrow ${dark ? "cs-on-dark" : ""}`}>{children}</p>
  );
}

function SectionHeader({ children, className = "", dark = false }) {
  return (
    <h2
      className={`cs-section mt-6 ${dark ? "cs-on-dark" : ""} ${className}`}
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

// Empty image placeholder. Cream-toned with a thin warm border and a
// muted "Image coming" label, so the rhythm of every ▢ marker in the
// markdown shows on the page without dropping in real assets yet.
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

function Lead({ children, className = "" }) {
  return (
    <p
      className={`mt-6 max-w-[var(--cs-prose-col)] text-[16px] italic leading-[1.7] text-[#525252] ${className}`}
    >
      {children}
    </p>
  );
}

// Bracket primitive: 24x24 SVG drawing the bottom-left L shape; the
// `pos` prop rotates it for the other three corners of the hero stage.
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

// Decision contrast block for the "Rejected vs Chosen" pairs in
// Phase 03 and Phase 04. Reuses the existing emerald/rose accents
// from the case-study scale (same hues as PlusMinus on the ShopOS
// page); two columns on desktop, stacks on mobile.
function DecisionContrast({ rejected, chosen }) {
  return (
    <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-[#E5DDD0] bg-white p-6 md:p-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-rose-700/80">
          Rejected
        </p>
        <p className="mt-3 text-[15px] leading-[1.65] text-[#0a0a0a]/85 md:text-[16px]">
          {rejected}
        </p>
      </div>
      <div className="rounded-2xl border border-[#E5DDD0] bg-white p-6 md:p-7">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-700">
          Chosen
        </p>
        <p className="mt-3 text-[15px] leading-[1.65] text-[#0a0a0a]/85 md:text-[16px]">
          {chosen}
        </p>
      </div>
    </div>
  );
}

/* ============================================================================
   Page
============================================================================ */

export default function BrandMemoryPage() {
  const heroRef = useRef(null);
  const wordmarkRef = useRef(null);
  const bracketsRef = useRef(null);

  // Brackets at 0.50, "Memory" wordmark at 0.55 (fading out by 70% of
  // the hero height). The bg is the WebGL Neural Noise canvas, it
  // animates on its own, no parallax needed there. Reduced motion →
  // static + visible.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mediaQuery.matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    let rafId = null;

    const update = () => {
      const y = window.scrollY;
      const heroH = heroRef.current?.offsetHeight || 760;

      if (!reduced && y < heroH) {
        const mult = isMobile ? 0.5 : 1;

        if (bracketsRef.current) {
          bracketsRef.current.style.transform = `translate3d(0, ${y * 0.5 * mult}px, 0)`;
        }
        if (wordmarkRef.current) {
          wordmarkRef.current.style.transform = `translate3d(-50%, ${y * 0.55 * mult}px, 0)`;
          wordmarkRef.current.style.opacity = String(
            Math.max(0, 1 - y / (heroH * 0.7))
          );
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
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <main className="cs-scope min-h-screen bg-white text-[#0a0a0a] antialiased">
      {/* ===== HERO, NeuralNoise canvas bg + brackets + wordmark.
           Light-theme adaptation: page bg stays white, the canvas
           draws soft graphite traces, wordmark + brackets render in
           near-black. ===================================================== */}
      <section
        ref={heroRef}
        className="relative w-full overflow-hidden bg-white"
        style={{ height: "min(820px, calc(100vh + 60px))", minHeight: "640px" }}
      >
        {/* Layer 1, WebGL neural-noise bg (animates on its own) */}
        <NeuralNoise />

        {/* Layer 2, wordmark "Memory" (parallax 0.55, fades) */}
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
            color: "#0a0a0a",
            whiteSpace: "nowrap",
            margin: 0,
          }}
        >
          Memory
        </h1>

        {/* Bottom fade overlay, smooths into the white content below */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[230px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 84.8%)",
          }}
        />
      </section>

      {/* ===== TOP, kicker + H1 + lede =================================== */}
      <Container className="reveal pt-16 md:pt-20">
        <ProseColumn>
          <p className="cs-eyebrow">
            ShopOS &middot; &ldquo;Brand Memory&rdquo; &middot;
            Product Design
          </p>
          <h1 className="cs-thesis mt-4">
            Teaching AI to remember a brand, so no one explains it
            twice
          </h1>
          <p className="cs-lede mt-6">
            How we built a memory that holds a brand&rsquo;s look,
            voice, rules, and the decisions that actually worked, so
            every generation comes out on-brand without re-briefing
            the model.
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
            Generative AI could make a striking shot, never a branded
            one. With no memory of the brand, every prompt had to
            respell the whole thing: palette, voice, rules, again and
            again.
          </dd>

          <dt className="cs-eyebrow md:pt-1">Approach</dt>
          <dd className="cs-body max-w-[var(--cs-prose-col)]">
            Stop briefing the model per prompt. Build it a memory: a
            context graph that holds everything true about the brand
            and learns from every decision the brand makes.
          </dd>

          <dt className="cs-eyebrow md:pt-1">Solution</dt>
          <dd className="cs-body max-w-[var(--cs-prose-col)]">
            Brand Memory. Paste a link and it extracts the brand&rsquo;s
            DNA, layer a moodboard for the moment, feed it approvals,
            edits, and rejections so it learns what works, and let
            every agent read from one shared graph.
          </dd>

          <dt className="cs-eyebrow md:pt-1">Impact</dt>
          <dd className="cs-body max-w-[var(--cs-prose-col)]">
            Live in production, onboarding real brands.
          </dd>
        </dl>
        </ProseColumn>
      </Container>

      {/* ===== My role + Team / Tools =================================== */}
      <Container className="reveal pt-16 md:pt-20">
        <ProseColumn>
          <p className="cs-eyebrow">My role</p>
          <p className="cs-body mt-3">
            <em>Owned:</em> problem framing (reframing generation into
            memory), the information architecture of the context graph,
            the memory-and-agent interaction models, and the
            graph-exploration UX. I designed the system and reasoned
            about how it shipped, the seam between design intent and
            production code. <em>Built by engineering.</em>
          </p>

          <dl
            className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:mt-12 md:grid-cols-2 md:gap-x-10"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {[
              { k: "Team", v: "ShopOS product team + engineers" },
              { k: "Tools", v: "Figma" },
            ].map(({ k, v }) => (
              <div key={k}>
                <dt className="cs-eyebrow">{k}</dt>
                <dd className="cs-meta-value mt-3">{v}</dd>
              </div>
            ))}
          </dl>
        </ProseColumn>
      </Container>

      {/* ===== Vimeo walkthrough — sits between My Role and the
           first content section. Responsive embed: wrapper holds
           a 4:3 aspect via padding-top, iframe fills absolutely.
           Vimeo's player.js script isn't required for the basic
           embed to work; only needed if we want to listen to
           player events. */}
      <Container className="reveal mt-12 md:mt-16">
        <ProseColumn>
          <div
            style={{
              position: "relative",
              paddingTop: "75%",
            }}
            className="overflow-hidden rounded-2xl bg-[#0a0a0a]"
          >
            <iframe
              src="https://player.vimeo.com/video/1201996722?badge=0&autopause=0&player_id=0&app_id=58479"
              title="Brand Memory walkthrough"
              loading="lazy"
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              frameBorder="0"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        </ProseColumn>
      </Container>

      {/* ===== 01 · The problem ========================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>The problem</Eyebrow>
            <SectionHeader>
              Every generation meant re-briefing the brand from
              scratch.
            </SectionHeader>
            <Lead>
              Generative AI could produce a striking shot, but never a
              branded one.
            </Lead>
            <Prose className="mt-8">
              <p>
                With no memory of the brand, every prompt had to spell
                out the whole thing: the palette, the voice, the
                rules. On average it took several tedious attempts
                before a generation lined up with the guidelines. The
                model had no idea who the brand was, so the designer
                became its memory, on every single prompt.
              </p>
            </Prose>
          </ProseColumn>
          {/* PromptInput kept at 560 centered (user preference). */}
          <figure className="mx-auto mt-12 max-w-[560px] md:mt-14">
            <PromptInput />
            <figcaption className="mt-4 text-[13px] leading-[1.55] text-[#525252]">
              Toggle off: the brief that had to spell the whole brand
              out, every time. Toggle on: the shorter prompt Brand
              Memory makes possible once the context is in the system.
            </figcaption>
          </figure>
        </Container>
      </section>

      {/* ===== 02 · The reframe ========================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>The reframe</Eyebrow>
            <SectionHeader>
              This wasn&rsquo;t a generation problem. It was a memory
              problem.
            </SectionHeader>
            <Lead>
              Most AI products ask how to generate better outputs.
              This one asked something else: how do you design a
              system that remembers?
            </Lead>
            <Prose className="mt-8">
              <p>
                Give the model a memory and one line is enough. But
                the deeper insight came later: a brand&rsquo;s memory
                isn&rsquo;t its style guide, it&rsquo;s the
                accumulated record of its decisions, which image
                worked, which word got killed, and why. Consumer
                platforms compound behavioral traces: clicks, watches,
                scrolls. Brands compound{" "}
                <strong>decision traces</strong>. Build a memory that
                captures those, and you stop generating merely
                on-brand and start generating what works.
              </p>
            </Prose>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 03 · Ideation ============================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Ideation</Eyebrow>
            <SectionHeader>
              First, the memory lived on a whiteboard.
            </SectionHeader>
            <Prose className="mt-12">
              <p>
                Before Brand Memory was a context graph, it was a
                context wall. We kept asking the same question in
                louder ink: what does a brand actually remember, and
                how would a model read it back? The same idea got
                drawn five ways, and four got crossed out. The markers
                didn&rsquo;t survive the week. The thinking did. The
                arrows still standing when the caps ran dry became
                Phase 01.
              </p>
            </Prose>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="The whiteboard: the whole brand-memory flow worked out on a board." />
          </div>
        </Container>
      </section>

      {/* ===== 04 · Phase 01 ============================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Phase 01</Eyebrow>
            <SectionHeader>
              Paste a link, it learns the whole brand.
            </SectionHeader>
            <Lead>
              A brand already lives on its website, so we let it read
              from there.
            </Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>
                Paste one URL; it studies the site the way a sharp new
                designer would
              </Bullet>
              <Bullet>
                Picks up the look, the voice, and the rules, with
                nothing briefed by hand
              </Bullet>
              <Bullet>
                Everything a model needs to build for the brand,
                captured automatically from one link
              </Bullet>
            </ul>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Onboarding: from brand URL to structured Brand DNA." />
          </div>
        </Container>
      </section>

      {/* ===== 05 · Phase 02 ============================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Phase 02</Eyebrow>
            <SectionHeader>
              A moodboard, for who the brand wants to be this season.
            </SectionHeader>
            <Lead>
              Brand DNA holds what a brand always is. A moodboard
              holds who it wants to be this campaign.
            </Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>
                Brand DNA is the long-term memory, always on
              </Bullet>
              <Bullet>
                A moodboard is a child memory: a focused layer a brand
                assembles for a launch or a drop
              </Bullet>
              <Bullet>
                The system reads it on top of the DNA, so the
                generation comes out specific to the moment, not just
                on-brand
              </Bullet>
            </ul>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Moodboard: surreal minimal set pieces turned into structured visual context." />
          </div>
        </Container>
      </section>

      {/* ===== 06 · The redesign ======================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>The redesign</Eyebrow>
            <SectionHeader>
              From a tool that worked to one a brand team wanted to
              live in.
            </SectionHeader>
            <Lead>
              v1 worked. This version made people want to use it.
            </Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>Rebuilt the platform in dark mode</Bullet>
              <Bullet>
                Gave brands moodboards as a flexible child memory
              </Bullet>
              <Bullet>Cleared the navigation out of the way</Bullet>
            </ul>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="The redesign: dark by default, moodboards, cleaner navigation." />
          </div>
        </Container>
      </section>

      {/* ===== 07 · Phase 03 ============================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Phase 03</Eyebrow>
            <SectionHeader>Memory that learns what works.</SectionHeader>
            <Lead>
              Then we stopped treating memory as a fixed profile.
            </Lead>

            <DecisionContrast
              rejected="A static brand profile, set once at onboarding. Accurate on day one, stale by the next campaign, and blind to whether anything it guided actually worked."
              chosen="A living memory fed by every interaction. Approvals, edits, rejections, and performance all refine it, so it holds not just what is on-brand but what works for the business."
            />

            <ul className="mt-10 space-y-3">
              <Bullet>An approval says an output worked</Bullet>
              <Bullet>An edit shows how the brand thinks</Bullet>
              <Bullet>A rejection says what to stop generating</Bullet>
            </ul>

            <Prose className="mt-8">
              <p>
                The memory weights all of it, so over time it reads
                less like a style guide and more like a record of
                what gets results, the knowledge an agent pulls
                before it acts.
              </p>
            </Prose>
          </ProseColumn>

          <div className="mt-16 md:mt-20">
            <ImageSlot caption="The feedback loop: approved and rejected outputs feeding back into a memory entry, with provenance for what was learned and when." />
          </div>
        </Container>
      </section>

      {/* ===== 08 · Phase 04, live today ================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Phase 04, live today</Eyebrow>
            <SectionHeader>
              One shared memory for every agent.
            </SectionHeader>
            <Lead>
              Then the ShopOS agents arrived, and memory became the
              thing they read first.
            </Lead>

            <DecisionContrast
              rejected="Independent agents, each holding its own context. They would drift apart and duplicate the same brand knowledge."
              chosen="Every agent reads from and writes back to one context graph, a single source of truth for organizational intelligence."
            />

            <ul className="mt-10 space-y-3">
              <Bullet>
                Design, copy, strategy, research, all reading from and
                writing back to one graph
              </Bullet>
              <Bullet>
                Less about guiding one generation, more about what
                works and what the business gets out of it
              </Bullet>
            </ul>
          </ProseColumn>

          <div className="mt-16 md:mt-20">
            <ImageSlot caption='Agent layer: an agent at work with a "context retrieved from memory" panel.' />
          </div>
        </Container>
      </section>

      {/* ===== 09 · One brand, end to end =============================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>One brand, end to end</Eyebrow>
            <SectionHeader>
              Extraction to on-brand output, no one re-explains a
              thing.
            </SectionHeader>
            <ul className="mt-12 space-y-3">
              <Bullet>
                Brand DNA extracted automatically: personality, tone,
                visual style, color system, audience
              </Bullet>
              <Bullet>
                A moodboard turned into structured visual context the
                system can act on
              </Bullet>
              <Bullet>
                A generation that comes out on-brand with no manual
                context supplied
              </Bullet>
            </ul>
          </ProseColumn>

          <div className="mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-3">
            <ImageSlot caption="Brand DNA, extracted." />
            <ImageSlot caption="Moodboard turned into structured context." />
            <ImageSlot caption="On-brand generation, no manual context supplied." />
          </div>
        </Container>
      </section>

      {/* ===== 10 · What shipped ======================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>What shipped</Eyebrow>
            <SectionHeader>
              Live, and onboarding real brands.
            </SectionHeader>
            <Lead>
              The shipped product is a single brand&rsquo;s memory,
              working end to end.
            </Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>
                Brand DNA extraction from a URL, moodboards as child
                memory, the feedback loop, and one shared agent graph
              </Bullet>
              <Bullet>
                In production today, onboarding real brands
              </Bullet>
            </ul>
          </ProseColumn>

          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Shipped: the brand-memory flow end to end." />
          </div>
        </Container>
      </section>

      {/* ===== 11 · Proof =============================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Proof</Eyebrow>
            <SectionHeader>By the numbers.</SectionHeader>
            <Lead>Honest about what is measured today.</Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>Live in production, onboarding brands</Bullet>
            </ul>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 12 · Where it's going ==================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Where it&rsquo;s going</Eyebrow>
            <SectionHeader>
              Each brand memory is a node. Connect them.
            </SectionHeader>
            <Lead>
              Direction, not yet built, labeled honestly so the
              shipped work stands on its own.
            </Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>
                The shipped product is one brand&rsquo;s memory
              </Bullet>
              <Bullet>
                The architecture points further: individual context
                graphs networked into a larger intelligence layer
                that surfaces patterns no single brand could see
              </Bullet>
              <Bullet>
                A continuously evolving &ldquo;super memory&rdquo; for
                autonomous agents
              </Bullet>
            </ul>
          </ProseColumn>

          <div className="mt-16 md:mt-20">
            <ImageSlot caption="The arc: Prompting → Context → Memory → Context Graph → Agentic Intelligence → Networked Graphs → Super Memory. Filled is shipped, outlined is roadmap." />
          </div>
        </Container>
      </section>

      {/* ===== Closing paragraph + CTA =================================== */}
      <section className="reveal py-20 md:py-28">
        <Container>
          <ProseColumn>
            <Prose>
              <p>
                Most AI products ask how to generate better outputs.
                This one asked how to remember, and that question
                turned a generation tool into a foundation for
                organizational intelligence. The moat is not the
                model. The moat is the memory.
              </p>
              <p>
                Want to see a brand move through it end to end?{" "}
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
              href="/work/shopos"
              className="inline-flex items-center gap-4 text-[15px] font-medium text-[#525252] transition-colors hover:text-[#0a0a0a]"
            >
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#525252]">
                Next
              </span>
              <span className="text-[20px] font-black uppercase tracking-tight text-[#0a0a0a] md:text-[24px]">
                ShopOS Agents
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
      <ChatLauncher project="brand-memory" />
    </main>
  );
}
