// app/work/brand-memory/page.jsx
// Brand Memory case study. Same scaffold as the ShopOS case study:
// .cs-scope main, the editorial type primitives, the TL;DR table, the
// "My role" block, and section pattern of eyebrow → SectionHeader →
// Lead → Prose/bullets → ImageSlot. No parallax hero on this one
// because the project doesn't have an equivalent wordmark composition;
// the page opens straight on the back link + kicker.

"use client";

import { useEffect } from "react";
import Link from "next/link";
import ChatLauncher from "../../components/ChatLauncher";

/* ============================================================================
   Primitives copied verbatim from the ShopOS scaffold so the two
   case studies stay in lockstep. If anything changes there, mirror
   it here.
============================================================================ */

function Container({ children, className = "" }) {
  return (
    <div className={`mx-auto w-full max-w-[1080px] px-6 md:px-10 ${className}`}>
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
  // Reveal observer copied from the ShopOS scaffold so .reveal blocks
  // ease in as the user scrolls. No parallax hero on this page, so the
  // scroll handler the ShopOS effect manages isn't needed here.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = mediaQuery.matches;

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
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <main className="cs-scope min-h-screen bg-white text-[#0a0a0a] antialiased">
      {/* ===== TOP, back link + kicker + H1 + lede ====================== */}
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
          ShopOS &middot; &ldquo;Brand Memory&rdquo; &middot; Product Design
        </p>
        <h1 className="cs-thesis mt-4 max-w-[var(--cs-prose-col)]">
          Teaching AI to remember a brand, so no one explains it twice
        </h1>
        <p className="cs-lede mt-6 max-w-[var(--cs-prose-col)]">
          How we built a memory that holds a brand&rsquo;s look, voice,
          rules, and the decisions that actually worked, so every
          generation comes out on-brand without re-briefing the model.
        </p>
      </Container>

      {/* ===== TL;DR ==================================================== */}
      <Container className="reveal pt-20 md:pt-28">
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
      </Container>

      {/* ===== My role + Team / Tools =================================== */}
      <Container className="reveal pt-16 md:pt-20">
        <div className="max-w-[var(--cs-prose-col)]">
          <p className="cs-eyebrow">My role</p>
          <p className="cs-body mt-3">
            <em>Owned:</em> problem framing (reframing generation into
            memory), the information architecture of the context graph,
            the memory-and-agent interaction models, and the
            graph-exploration UX. I designed the system and reasoned
            about how it shipped, the seam between design intent and
            production code. <em>Built by engineering.</em>
          </p>
        </div>

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
      </Container>

      {/* ===== 01 · The problem ========================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>The problem</Eyebrow>
          <SectionHeader>
            Every generation meant re-briefing the brand from scratch.
          </SectionHeader>
          <Lead>
            Generative AI could produce a striking shot, but never a
            branded one.
          </Lead>
          <Prose className="mt-8">
            <p>
              With no memory of the brand, every prompt had to spell
              out the whole thing: the palette, the voice, the rules.
              On average it took several tedious attempts before a
              generation lined up with the guidelines. The model had
              no idea who the brand was, so the designer became its
              memory, on every single prompt.
            </p>
          </Prose>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Without Memory vs With Memory: the same PDP brief, generated." />
          </div>
        </Container>
      </section>

      {/* ===== 02 · The reframe ========================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>The reframe</Eyebrow>
          <SectionHeader>
            This wasn&rsquo;t a generation problem. It was a memory
            problem.
          </SectionHeader>
          <Lead>
            Most AI products ask how to generate better outputs. This
            one asked something else: how do you design a system that
            remembers?
          </Lead>
          <Prose className="mt-8">
            <p>
              Give the model a memory and one line is enough. But the
              deeper insight came later: a brand&rsquo;s memory
              isn&rsquo;t its style guide, it&rsquo;s the accumulated
              record of its decisions, which image worked, which word
              got killed, and why. Consumer platforms compound
              behavioral traces: clicks, watches, scrolls. Brands
              compound <strong>decision traces</strong>. Build a memory
              that captures those, and you stop generating merely
              on-brand and start generating what works.
            </p>
          </Prose>
        </Container>
      </section>

      {/* ===== 03 · Ideation ============================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Ideation</Eyebrow>
          <SectionHeader>
            First, the memory lived on a whiteboard.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              Before Brand Memory was a context graph, it was a context
              wall. We kept asking the same question in louder ink:
              what does a brand actually remember, and how would a
              model read it back? The same idea got drawn five ways,
              and four got crossed out. The markers didn&rsquo;t
              survive the week. The thinking did. The arrows still
              standing when the caps ran dry became Phase 01.
            </p>
          </Prose>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="The whiteboard: the whole brand-memory flow worked out on a board." />
          </div>
        </Container>
      </section>

      {/* ===== 04 · Phase 01 ============================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Phase 01</Eyebrow>
          <SectionHeader>
            Paste a link, it learns the whole brand.
          </SectionHeader>
          <Lead>
            A brand already lives on its website, so we let it read
            from there.
          </Lead>
          <ul className="mt-8 max-w-[var(--cs-prose-col)] space-y-3">
            <Bullet>
              Paste one URL; it studies the site the way a sharp new
              designer would
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
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Onboarding: from brand URL to structured Brand DNA." />
          </div>
        </Container>
      </section>

      {/* ===== 05 · Phase 02 ============================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Phase 02</Eyebrow>
          <SectionHeader>
            A moodboard, for who the brand wants to be this season.
          </SectionHeader>
          <Lead>
            Brand DNA holds what a brand always is. A moodboard holds
            who it wants to be this campaign.
          </Lead>
          <ul className="mt-8 max-w-[var(--cs-prose-col)] space-y-3">
            <Bullet>Brand DNA is the long-term memory, always on</Bullet>
            <Bullet>
              A moodboard is a child memory: a focused layer a brand
              assembles for a launch or a drop
            </Bullet>
            <Bullet>
              The system reads it on top of the DNA, so the generation
              comes out specific to the moment, not just on-brand
            </Bullet>
          </ul>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Moodboard: surreal minimal set pieces turned into structured visual context." />
          </div>
        </Container>
      </section>

      {/* ===== 06 · The redesign ======================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>The redesign</Eyebrow>
          <SectionHeader>
            From a tool that worked to one a brand team wanted to live
            in.
          </SectionHeader>
          <Lead>v1 worked. This version made people want to use it.</Lead>
          <ul className="mt-8 max-w-[var(--cs-prose-col)] space-y-3">
            <Bullet>Rebuilt the platform in dark mode</Bullet>
            <Bullet>
              Gave brands moodboards as a flexible child memory
            </Bullet>
            <Bullet>Cleared the navigation out of the way</Bullet>
          </ul>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="The redesign: dark by default, moodboards, cleaner navigation." />
          </div>
        </Container>
      </section>

      {/* ===== 07 · Phase 03 ============================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Phase 03</Eyebrow>
          <SectionHeader>Memory that learns what works.</SectionHeader>
          <Lead>
            Then we stopped treating memory as a fixed profile.
          </Lead>

          <DecisionContrast
            rejected="A static brand profile, set once at onboarding. Accurate on day one, stale by the next campaign, and blind to whether anything it guided actually worked."
            chosen="A living memory fed by every interaction. Approvals, edits, rejections, and performance all refine it, so it holds not just what is on-brand but what works for the business."
          />

          <ul className="mt-10 max-w-[var(--cs-prose-col)] space-y-3">
            <Bullet>An approval says an output worked</Bullet>
            <Bullet>An edit shows how the brand thinks</Bullet>
            <Bullet>A rejection says what to stop generating</Bullet>
          </ul>

          <Prose className="mt-8">
            <p>
              The memory weights all of it, so over time it reads less
              like a style guide and more like a record of what gets
              results, the knowledge an agent pulls before it acts.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <ImageSlot caption="The feedback loop: approved and rejected outputs feeding back into a memory entry, with provenance for what was learned and when." />
          </div>
        </Container>
      </section>

      {/* ===== 08 · Phase 04, live today ================================ */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Phase 04, live today</Eyebrow>
          <SectionHeader>One shared memory for every agent.</SectionHeader>
          <Lead>
            Then the ShopOS agents arrived, and memory became the thing
            they read first.
          </Lead>

          <DecisionContrast
            rejected="Independent agents, each holding its own context. They would drift apart and duplicate the same brand knowledge."
            chosen="Every agent reads from and writes back to one context graph, a single source of truth for organizational intelligence."
          />

          <ul className="mt-10 max-w-[var(--cs-prose-col)] space-y-3">
            <Bullet>
              Design, copy, strategy, research, all reading from and
              writing back to one graph
            </Bullet>
            <Bullet>
              Less about guiding one generation, more about what works
              and what the business gets out of it
            </Bullet>
          </ul>

          <div className="mt-16 md:mt-20">
            <ImageSlot caption='Agent layer: an agent at work with a "context retrieved from memory" panel.' />
          </div>
        </Container>
      </section>

      {/* ===== 09 · One brand, end to end =============================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>One brand, end to end</Eyebrow>
          <SectionHeader>
            Extraction to on-brand output, no one re-explains a thing.
          </SectionHeader>
          <ul className="mt-12 max-w-[var(--cs-prose-col)] space-y-3">
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
          <Eyebrow>What shipped</Eyebrow>
          <SectionHeader>Live, and onboarding real brands.</SectionHeader>
          <Lead>
            The shipped product is a single brand&rsquo;s memory,
            working end to end.
          </Lead>
          <ul className="mt-8 max-w-[var(--cs-prose-col)] space-y-3">
            <Bullet>
              Brand DNA extraction from a URL, moodboards as child
              memory, the feedback loop, and one shared agent graph
            </Bullet>
            <Bullet>In production today, onboarding real brands</Bullet>
          </ul>

          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Shipped: the brand-memory flow end to end." />
          </div>
        </Container>
      </section>

      {/* ===== 11 · Proof =============================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Proof</Eyebrow>
          <SectionHeader>By the numbers.</SectionHeader>
          <Lead>Honest about what is measured today.</Lead>
          <ul className="mt-8 max-w-[var(--cs-prose-col)] space-y-3">
            <Bullet>Live in production, onboarding brands</Bullet>
          </ul>
        </Container>
      </section>

      {/* ===== 12 · Where it's going ==================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>Where it&rsquo;s going</Eyebrow>
          <SectionHeader>
            Each brand memory is a node. Connect them.
          </SectionHeader>
          <Lead>
            Direction, not yet built, labeled honestly so the shipped
            work stands on its own.
          </Lead>
          <ul className="mt-8 max-w-[var(--cs-prose-col)] space-y-3">
            <Bullet>The shipped product is one brand&rsquo;s memory</Bullet>
            <Bullet>
              The architecture points further: individual context graphs
              networked into a larger intelligence layer that surfaces
              patterns no single brand could see
            </Bullet>
            <Bullet>
              A continuously evolving &ldquo;super memory&rdquo; for
              autonomous agents
            </Bullet>
          </ul>

          <div className="mt-16 md:mt-20">
            <ImageSlot caption="The arc: Prompting → Context → Memory → Context Graph → Agentic Intelligence → Networked Graphs → Super Memory. Filled is shipped, outlined is roadmap." />
          </div>
        </Container>
      </section>

      {/* ===== Closing paragraph + CTA =================================== */}
      <section className="reveal py-20 md:py-28">
        <Container>
          <Prose>
            <p>
              Most AI products ask how to generate better outputs. This
              one asked how to remember, and that question turned a
              generation tool into a foundation for organizational
              intelligence. The moat is not the model. The moat is the
              memory.
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
