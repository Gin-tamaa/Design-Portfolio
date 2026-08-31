// app/work/brand-memory/page.jsx
// Brand Memory case study. Same scaffold as the ShopOS and Enterprise
// Dashboard case studies: WebGL "Memory" hero, .cs-scope main with the
// editorial type primitives, the TL;DR table, the "My role" block, and a
// section pattern of eyebrow -> SectionHeader -> Lead (keyline) ->
// Prose/bullets/Contrast -> figures. Content from
// case-study-brand-memory-v2.md; numbers and role text are verbatim.
// Assets live in public/brand-memory-images.

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ChatLauncher from "../../components/ChatLauncher";
import NeuralNoise from "./NeuralNoise";

const IMG = "/brand-memory-images";

/* ============================================================================
   Primitives copied verbatim from the ShopOS scaffold so the case studies
   stay in lockstep. If anything changes there, mirror it here.
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

// Rejected / Chosen decision-contrast block (same as the other case
// studies): two columns, rose for the rejected path, emerald for chosen.
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

// Single image at its natural aspect, warm-bordered to match the case
// study's figure language, lazy-loaded, with an optional caption.
function Figure({ src, alt = "", caption, className = "" }) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl border border-[#E5DDD0] bg-[#F4F1EA]">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="block h-auto w-full"
          draggable={false}
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 max-w-[var(--cs-prose-col)] text-[13px] leading-[1.55] text-[#525252]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

// Responsive gallery grid of equal-aspect tiles, lazy-loaded.
function Gallery({ images, caption, colsClass = "md:grid-cols-3", aspect = "aspect-[4/3]" }) {
  return (
    <figure>
      <div className={`grid grid-cols-2 gap-3 ${colsClass} md:gap-4`}>
        {images.map((im, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-[#E5DDD0] bg-[#F4F1EA]"
          >
            <img
              src={im.src}
              alt={im.alt || ""}
              loading="lazy"
              className={`block ${aspect} w-full object-cover`}
              draggable={false}
            />
          </div>
        ))}
      </div>
      {caption ? (
        <figcaption className="mt-3 max-w-[var(--cs-prose-col)] text-[13px] leading-[1.55] text-[#525252]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

// Muted, looping, autoplaying clip for the sections that call for motion.
function VideoBlock({ src, caption, className = "" }) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl border border-[#E5DDD0] bg-black">
        <video
          src={src}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          className="block h-auto w-full"
        />
      </div>
      {caption ? (
        <figcaption className="mt-3 max-w-[var(--cs-prose-col)] text-[13px] leading-[1.55] text-[#525252]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

// Before / after pair (the problem section): same brief, both ways.
function BeforeAfter({ before, after, caption }) {
  return (
    <figure>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-rose-700/80">
            Without memory
          </p>
          <div className="overflow-hidden rounded-2xl border border-[#E5DDD0] bg-[#F4F1EA]">
            <img src={before} alt="" loading="lazy" className="block h-auto w-full" draggable={false} />
          </div>
        </div>
        <div>
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.22em] text-emerald-700">
            With memory
          </p>
          <div className="overflow-hidden rounded-2xl border border-[#E5DDD0] bg-[#F4F1EA]">
            <img src={after} alt="" loading="lazy" className="block h-auto w-full" draggable={false} />
          </div>
        </div>
      </div>
      {caption ? (
        <figcaption className="mt-3 max-w-[var(--cs-prose-col)] text-[13px] leading-[1.55] text-[#525252]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/* ---- Gallery asset lists ------------------------------------------------ */

const IDEATION = ["a", "b", "c", "d", "e", "f", "g"].map((s) => ({
  src: `${IMG}/ideation-${s}.jpg`,
  alt: "Brand Memory ideation sketch",
}));
const PHASE1 = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({
  src: `${IMG}/phase1-gallery/screen-${n}.png`,
  alt: "Brand DNA onboarding screen",
}));
const PHASE2 = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
  src: `${IMG}/phase2-gallery/screen-${n}.png`,
  alt: "Moodboard and redesigned memory screen",
}));
const MOODBOARDS = [1, 2, 3, 4].map((n) => ({
  src: `${IMG}/moodboard-${n}.jpg`,
  alt: "Moodboard set piece",
}));
const PHASE3 = ["wiki", "units", "sources", "graph", "boards"].map((s) => ({
  src: `${IMG}/phase3-gallery/${s}.png`,
  alt: `Living memory ${s} view`,
}));

/* ============================================================================
   Page
============================================================================ */

export default function BrandMemoryPage() {
  const heroRef = useRef(null);
  const wordmarkRef = useRef(null);
  const bracketsRef = useRef(null);

  // Brackets at 0.50, "Memory" wordmark at 0.55 (fading out by 70% of
  // the hero height). The bg is the WebGL Neural Noise canvas, it
  // animates on its own, no parallax needed there. Reduced motion ->
  // static + visible.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mediaQuery.matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    // Mark the body so the global Nav goes seamless over the hero
    // (transparent, no backdrop) and solidifies past it.
    document.body.classList.add("brand-memory-hero");

    let rafId = null;
    let solid = false;

    const update = () => {
      const y = window.scrollY;
      const heroH = heroRef.current?.offsetHeight || 760;
      const navThreshold = heroH - 90;

      const shouldBeSolid = y > navThreshold;
      if (shouldBeSolid !== solid) {
        solid = shouldBeSolid;
        document.body.classList.toggle("brand-memory-nav-solid", solid);
      }

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
      document.body.classList.remove("brand-memory-hero", "brand-memory-nav-solid");
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <main className="cs-scope min-h-screen bg-white text-[#0a0a0a] antialiased">
      {/* ===== HERO, NeuralNoise canvas bg + wordmark (kept as-is). ====== */}
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

      {/* ===== OVERVIEW, kicker + H1 + subhead =========================== */}
      <Container className="reveal pt-16 md:pt-20">
        <ProseColumn>
          <p className="cs-eyebrow">
            ShopOS &middot; Brand Memory &middot; Product Design + Design
            Engineering &middot; Oct 2025 to Present
          </p>
          <h1 className="cs-thesis mt-4">
            Teaching AI to remember a brand, so no one explains it twice
          </h1>
          <p className="cs-lede mt-6">
            A persistent memory that holds a brand&rsquo;s look, voice, rules,
            and the decisions that actually worked, so every generation comes
            out on-brand without re-briefing the model.
          </p>
          <Lead>
            One memory the whole system reads from, instead of a brief retyped
            on every prompt.
          </Lead>
        </ProseColumn>
      </Container>

      {/* ===== TL;DR ==================================================== */}
      <Container className="reveal pt-20 md:pt-28">
        <ProseColumn>
          <p className="cs-eyebrow">TL;DR</p>
          <dl className="mt-8 grid grid-cols-1 gap-y-8 md:grid-cols-[160px_1fr] md:gap-x-10">
            <dt className="cs-eyebrow md:pt-1">Challenge</dt>
            <dd className="cs-body max-w-[var(--cs-prose-col)]">
              Generative AI could make a striking shot, never a branded one.
              With no memory of the brand, every prompt respelled the whole
              thing: palette, voice, rules, again and again.
            </dd>

            <dt className="cs-eyebrow md:pt-1">Approach</dt>
            <dd className="cs-body max-w-[var(--cs-prose-col)]">
              Stop briefing the model per prompt. Build it a memory that holds
              everything true about the brand and learns from every decision
              the brand makes.
            </dd>

            <dt className="cs-eyebrow md:pt-1">Solution</dt>
            <dd className="cs-body max-w-[var(--cs-prose-col)]">
              Brand Memory: paste a link and it extracts the brand&rsquo;s DNA,
              layer a moodboard for the moment, feed it approvals, edits, and
              rejections so it learns what works, and let every agent read from
              one shared memory.
            </dd>

            <dt className="cs-eyebrow md:pt-1">Impact</dt>
            <dd className="cs-body max-w-[var(--cs-prose-col)]">
              Live in production, onboarding real brands.
            </dd>
          </dl>
        </ProseColumn>
      </Container>

      {/* ===== My role (overview summary) =============================== */}
      <Container className="reveal pt-16 md:pt-20">
        <ProseColumn>
          <p className="cs-eyebrow">My role</p>
          <p className="cs-body mt-3">
            I owned the problem framing (reframing generation into memory), the
            information architecture of the memory, the memory-and-agent
            interaction models, and the memory-exploration UX, and I built the
            React front-end. I designed the system and shipped it. The backend
            memory engine was built by engineering.
          </p>

          <dl
            className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:mt-12 md:grid-cols-2 md:gap-x-10"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {[
              { k: "Team", v: "ShopOS product team + engineers" },
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

      {/* ===== Walkthrough (motion) ===================================== */}
      <Container className="reveal mt-12 md:mt-16">
        <ProseColumn>
          <VideoBlock
            src={`${IMG}/brand-memory-demo.mp4`}
            caption="Brand Memory, end to end: paste a link, watch the brand DNA come together, and generate on-brand from one shared memory."
          />
        </ProseColumn>
      </Container>

      {/* ===== 01 · The problem ========================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>The problem</Eyebrow>
            <SectionHeader>
              Every generation meant re-briefing the brand from scratch.
            </SectionHeader>
            <Lead>
              Generative AI could produce a striking shot, but never a branded
              one.
            </Lead>
            <Prose className="mt-8">
              <p>
                With no memory of the brand, every prompt had to spell out the
                whole thing: the palette, the voice, the rules. It took several
                tedious attempts before a generation lined up with the
                guidelines. The model had no idea who the brand was, so the
                designer became its memory, on every single prompt.
              </p>
            </Prose>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <BeforeAfter
              before={`${IMG}/before-without-memory.jpg`}
              after={`${IMG}/before-with-memory.jpg`}
              caption="The same brief, generated both ways: from memory of the garment, and against the brand's own memory."
            />
          </div>
        </Container>
      </section>

      {/* ===== 02 · The reframe ========================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>The reframe</Eyebrow>
            <SectionHeader>
              This wasn&rsquo;t a generation problem. It was a memory problem.
            </SectionHeader>
            <Lead>
              Most AI products ask how to generate better. I asked how to
              remember.
            </Lead>
            <Prose className="mt-8">
              <p>
                Give the model a memory and one line is enough. But the deeper
                insight came later: a brand&rsquo;s memory isn&rsquo;t its style
                guide, it&rsquo;s the accumulated record of its decisions, which
                image worked, which word got killed, and why.
              </p>
              <p>
                Consumer platforms compound behavioral traces: clicks, watches,
                scrolls. Brands compound <strong>decision traces</strong>. Build
                a memory that captures those and you stop generating merely
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
            <SectionHeader>First, the memory lived on a whiteboard.</SectionHeader>
            <Lead>
              What does a brand actually remember, and how would a model read it
              back?
            </Lead>
            <Prose className="mt-8">
              <p>
                I kept drawing the same idea five ways and crossing four of them
                out. The markers didn&rsquo;t survive the week. The thinking
                did. The arrows still standing when the caps ran dry became
                Phase 01.
              </p>
            </Prose>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <Gallery
              images={IDEATION}
              caption="The whiteboard: the whole brand-memory flow worked out by hand."
            />
          </div>
        </Container>
      </section>

      {/* ===== 04 · Phase 01 ============================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Phase 01</Eyebrow>
            <SectionHeader>Paste a link, it learns the whole brand.</SectionHeader>
            <Lead>
              A brand already lives on its website, so I let it read from there.
            </Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>
                Paste one URL; it studies the site the way a sharp new designer
                would
              </Bullet>
              <Bullet>
                Picks up the look, the voice, and the rules, with nothing
                briefed by hand
              </Bullet>
              <Bullet>
                Everything a model needs to build for the brand, captured
                automatically from one link
              </Bullet>
            </ul>
          </ProseColumn>
        </Container>

        {/* Full-bleed Brand DNA, edge to edge with no container chrome,
            inverted so the dark capture reads light on the white page. */}
        <img
          src={`${IMG}/brand-dna-extract.jpg`}
          alt="Brand DNA extracted from a single URL"
          loading="lazy"
          draggable={false}
          className="mt-16 block w-full md:mt-20"
          style={{ filter: "invert(1)" }}
        />

        <Container>
          <div className="mt-16 md:mt-20">
            <Gallery images={PHASE1} caption="The onboarding flow, screen by screen." />
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
              Brand DNA holds what a brand always is. A moodboard holds who it
              wants to be this campaign.
            </Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>Brand DNA is the long-term memory, always on</Bullet>
              <Bullet>
                A moodboard is a child memory: a focused layer a brand assembles
                for a launch or a drop
              </Bullet>
              <Bullet>
                The system reads it on top of the DNA, so the generation comes
                out specific to the moment, not just on-brand
              </Bullet>
            </ul>
            <Prose className="mt-8">
              <p>
                A redesign rode along: v1 worked, but this version made a brand
                team want to live in it. I rebuilt it darker and calmer, added
                moodboards as a flexible child memory, and cleared the
                navigation out of the way.
              </p>
            </Prose>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <Gallery
              images={MOODBOARDS}
              colsClass="md:grid-cols-4"
              aspect="aspect-[3/4]"
              caption="Moodboard set pieces turned into structured visual context."
            />
          </div>
          <div className="mt-6 md:mt-8">
            <VideoBlock
              src={`${IMG}/brand-memory-f4.mp4`}
              caption="The redesigned memory, darker and calmer, with moodboards as a flexible child layer."
            />
          </div>
          <div className="mt-6 md:mt-8">
            <Gallery images={PHASE2} caption="The rebuilt Phase 02 surface." />
          </div>
        </Container>
      </section>

      {/* ===== 06 · Phase 03 ============================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Phase 03</Eyebrow>
            <SectionHeader>Memory that learns what works.</SectionHeader>
            <Lead>Then I stopped treating memory as a fixed profile.</Lead>
            <DecisionContrast
              rejected="A static brand profile, set once at onboarding. Accurate on day one, stale by the next campaign, blind to whether anything it guided actually worked."
              chosen="A living memory fed by every interaction. Approvals, edits, rejections, and performance all refine it, so it holds not just what is on-brand but what works for the business."
            />
            <ul className="mt-10 space-y-3">
              <Bullet>
                <strong>An approval</strong> says an output worked
              </Bullet>
              <Bullet>
                <strong>An edit</strong> shows how the brand thinks
              </Bullet>
              <Bullet>
                <strong>A rejection</strong> says what to stop generating
              </Bullet>
            </ul>
            <Prose className="mt-8">
              <p>
                Over time it reads less like a style guide and more like a
                record of what gets results, the knowledge an agent pulls before
                it acts.
              </p>
            </Prose>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <Gallery
              images={PHASE3}
              colsClass="md:grid-cols-3"
              caption="The living memory: wiki, units, sources, the memory graph, and boards."
            />
          </div>
        </Container>
      </section>

      {/* ===== 07 · Phase 04 (live today) =============================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Phase 04 &middot; Live today</Eyebrow>
            <SectionHeader>One shared memory for every agent.</SectionHeader>
            <Lead>
              Then the ShopOS agents arrived, and memory became the thing they
              read first.
            </Lead>
            <DecisionContrast
              rejected="Independent agents, each holding its own context, drifting apart and duplicating the same brand knowledge."
              chosen="Every agent reads from and writes back to one shared memory, a single source of truth for organizational intelligence."
            />
            <ul className="mt-10 space-y-3">
              <Bullet>
                Design, copy, strategy, research, all reading from and writing
                back to one memory
              </Bullet>
              <Bullet>
                Less about guiding one generation, more about what works and
                what the business gets out of it
              </Bullet>
            </ul>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <Figure
              src={`${IMG}/ai-agents.webp`}
              alt="Every ShopOS agent reading from one shared memory"
              caption="The agents interlude: one shared memory, read first by every agent."
            />
          </div>
        </Container>
      </section>

      {/* ===== 08 · My role (detailed) ================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>My role</Eyebrow>
            <SectionHeader>I designed the system and built its front-end.</SectionHeader>
            <Lead>Calibrated, not inflated.</Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>
                <strong>Owned:</strong> the reframe (generation to memory), the
                information architecture of the memory, the memory-and-agent
                interaction models, the exploration UX, and the React front-end
                (designed and built it).
              </Bullet>
              <Bullet>
                <strong>Co-created:</strong> the phase roadmap and the
                feedback-loop model, with the product team.
              </Bullet>
              <Bullet>
                <strong>Guided:</strong> the backend memory engine and
                extraction pipeline, built by engineering.
              </Bullet>
            </ul>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 09 · The honest tradeoff ================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>The honest tradeoff</Eyebrow>
            <SectionHeader>
              A memory only gets smart after enough decisions flow through it.
            </SectionHeader>
            <Prose className="mt-8">
              <p>
                The living memory has a cold start. Early on, before enough
                approvals, edits, and rejections accumulate, it&rsquo;s closer
                to the static profile I argued against, a memory that
                doesn&rsquo;t remember much yet. I shipped it anyway because the
                loop compounds fast and a profile that never learns was worse.
                Given another pass, I&rsquo;d design the empty and early states
                more deliberately, so a brand on day one feels the memory
                forming, not a promise it hasn&rsquo;t earned.
              </p>
            </Prose>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 10 · Outcomes ============================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Outcomes</Eyebrow>
            <SectionHeader>Live, and onboarding real brands.</SectionHeader>
            <Lead>Honest about what is measured today.</Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>
                Brand DNA extraction from a URL, moodboards as child memory, the
                feedback loop, and one shared agent memory, in production today
              </Bullet>
            </ul>
            <p className="mt-6 max-w-[var(--cs-prose-col)] text-[13px] italic leading-[1.6] text-[#aaaaaa]">
              A directional number (prompt-time and re-explanation reduction,
              brands onboarded) is still being instrumented; the shipped
              capability above is what is true today.
            </p>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <Figure
              src={`${IMG}/outcomes-bg.png`}
              alt="Brand Memory in production"
              caption="Brand Memory, in production and onboarding real brands."
            />
          </div>
        </Container>
      </section>

      {/* ===== 11 · Where it's going ==================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Where it&rsquo;s going</Eyebrow>
            <SectionHeader>Each brand memory is a node. Connect them.</SectionHeader>
            <Lead>
              Direction, not yet built, labeled honestly so the shipped work
              stands on its own.
            </Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>The shipped product is one brand&rsquo;s memory</Bullet>
              <Bullet>
                The architecture points further: individual memories networked
                into a larger intelligence layer that surfaces patterns no
                single brand could see
              </Bullet>
              <Bullet>A continuously evolving memory for autonomous agents</Bullet>
            </ul>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== Closing, the key question + CTA ========================== */}
      <section className="reveal py-20 md:py-28">
        <Container>
          <ProseColumn>
            <Eyebrow>The key question</Eyebrow>
            <SectionHeader>The moat isn&rsquo;t the model. It&rsquo;s the memory.</SectionHeader>
            <Prose className="mt-8">
              <p>
                Most AI products ask how to generate better outputs. I asked how
                to remember, and that question turned a generation tool into a
                foundation for organizational intelligence.
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
