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

function Placeholder({ name, description, aspect = "video" }) {
  const aspectClass =
    aspect === "video"
      ? "aspect-video"
      : aspect === "portrait"
      ? "aspect-[4/5]"
      : aspect === "square"
      ? "aspect-square"
      : aspect === "wide"
      ? "aspect-[16/10]"
      : "aspect-video";
  return (
    <div
      className={`w-full ${aspectClass} overflow-hidden rounded-3xl border border-dashed border-[#E5E5E5] bg-white`}
    >
      <div className="flex h-full w-full flex-col items-center justify-center px-10 py-14 text-center">
        <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#525252]">
          {`▢  ${name}`}
        </div>
        {description ? (
          <p className="mt-4 max-w-md text-[15px] leading-[1.65] text-[#525252]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
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
          How a solo store owner went from doing every job themselves to
          opening one screen, briefing a department of named AI agents,
          and watching them hand work to each other in real time.
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
            A brand owner had AI that could write a caption or fake a
            product shot, but nothing that could <em>own</em> a function
            and run it. They were still personally on SEO, paid, email,
            reviews, and the numbers, all at once.
          </dd>

          <dt className="cs-eyebrow md:pt-1">Approach</dt>
          <dd className="cs-body max-w-[var(--cs-prose-col)]">
            Don&rsquo;t build a smarter chatbot. Model the team that
            already existed in our building (a paid lead, a CRM manager, a
            creative director), then design one surface where a founder
            can see that team, brief it, and watch it work.
          </dd>

          <dt className="cs-eyebrow md:pt-1">Solution</dt>
          <dd className="cs-body max-w-[var(--cs-prose-col)]">
            Mission Control: a single screen that opens on your team,
            lets you shape and brief any agent, surfaces only what needs
            you, and shows the work happening live.
          </dd>

          <dt className="cs-eyebrow md:pt-1">Impact</dt>
          <dd className="cs-body max-w-[var(--cs-prose-col)]">
            Eight agents live with 10+ enterprise brands, running real
            store work today. In a 15-day GEO pilot the agents took a
            brand from cited by zero AI engines to cited by all four. I
            designed the system end to end and built the frontend to
            near-production fidelity.
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
            <em>Owned:</em> the research loop, end-to-end product design,
            and the shipped frontend (onboarding, agent setup, Kanban,
            Mission Control, Cowork, the multi-agent thread).{" "}
            <em>Co-created:</em> the agent roster and what each agent
            owns, with the founding team and our CRM/sales people.{" "}
            <em>Guided:</em> production handoff with engineers.
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

      {/* ===== 01 · A founder running a store... =========================
           TooManyTasks lives here per its current page position. The
           italic task list paragraph is the verbal counterpart to the
           chip cluster; keeping them adjacent so they reinforce each
           other. */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <SectionHeader>
            A founder running a store is running eight jobs at once
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              By 2026, a brand owner had AI that could write a caption or
              generate a product shot. Useful, but it didn&rsquo;t run the
              store. They were still the one on SEO, on paid, on email,
              watching the numbers, answering reviews. One person wearing
              every hat, with no way to watch it all at once.
            </p>
            <p>
              <em>
                Write a launch email &middot; Generate a product shot
                &middot; Run a paid campaign &middot; Pull yesterday&rsquo;s
                ROAS &middot; Write a caption &middot; Check analytics
                &middot; Reply to customers &middot; Draft a video script
                &middot; SEO audit &middot; Post to social &middot;
                Restock alerts &middot; Send newsletter. Twelve jobs, one
                person.
              </em>
            </p>
            <p>
              Then agents changed what was possible. Not another tool to
              open, but something that could own a function and run it
              relentlessly, around the clock, without being checked ten
              times a day. The opening wasn&rsquo;t a better image
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
           No visual slot in the storyteller doc; this is the project's
           central reframe and stands as text alone. */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <SectionHeader>
            This wasn&rsquo;t a chat problem. It was an org problem.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              Plenty of products do single-agent chat. Nobody had a clean
              pattern for one agent recruiting specialists into a single
              conversation, reasoning out loud, handing work to itself,
              and reporting back without losing the human watching from
              outside.
            </p>
            <p>
              That reframe is the whole project. The design challenge
              wasn&rsquo;t the prompt box; it was{" "}
              <strong>Legible Orchestration</strong>: making a team of
              autonomous agents <em>watchable</em>, so a founder can trust
              work they never personally checked. An AI team that fails
              silently isn&rsquo;t a team. Trust was the product, and the
              rest of this is how one screen earns it.
            </p>
          </Prose>
        </Container>
      </section>

      {/* ===== 03 · We didn't invent the team... ========================= */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <SectionHeader>
            We didn&rsquo;t invent the team. We modeled it on our own.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              The roles already existed in the building: a paid lead, a
              CRM manager, a creative director. So I built an internal MVP
              and ran it through our own team, each person testing the
              agent for the role they actually do. Their feedback shaped
              what each agent owned.
            </p>
            <p>
              I leaned hardest on the people closest to the customer. Our
              CRM and sales team talk to users far more than design does,
              so I used them to pressure-test which agents mattered. Then
              I validated cheap and fast: a vibe-coded MVP first, because
              it was quickest to put in front of onboarded brands, with
              the Figma-designed version built in parallel as feedback
              came in. Real reactions before real build.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              name="Approach Process"
              description="Internal MVP → team feedback → user MVP → feedback → live. The validation loop shown end to end."
            />
          </div>
        </Container>
      </section>

      {/* ===== 04 · Divider: The product, the way a founder moves through
           it. Acts as a pivot from the "why" sections above to the "how
           the product is used" walkthrough below. Headline only, no
           visual slot. */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <SectionHeader>
            The product, the way a founder moves through it
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              Everything above is the <em>why</em>. What follows is
              Mission Control itself, in the order a founder actually
              meets it: open on the team, shape and brief an agent, watch
              the work happen, then read what needs you. Each screen
              below carries the one decision that earned it.
            </p>
          </Prose>
        </Container>
      </section>

      {/* ===== 05 · First, you meet your team ============================
           Three iterations of how to show a team. Each iteration has a
           short critique quote pulled from the storyteller doc. */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <SectionHeader>First, you meet your team</SectionHeader>
          <Prose className="mt-12">
            <p>
              Mission Control opens on the agents, not an empty prompt
              box. How to <em>show</em> a team took three iterations, each
              one killing a confusion the last had created.
            </p>
          </Prose>

          {/* ITERATION 01: v1 Kanban MVP */}
          <div className="mt-20 md:mt-24">
            <div className="flex items-baseline gap-5">
              <span className="text-[14px] font-medium tabular-nums text-[#525252]">
                01
              </span>
              <h3 className="cs-thesis">The Kanban MVP</h3>
            </div>
            <p className="mt-6 max-w-3xl text-[17px] leading-[1.72] text-[#525252] md:text-[18px]">
              The first wireframe put the agents down the left and their
              tasks in Kanban columns to the right. We ran it past our own
              team, our clients, and a red team, and the verdict was
              blunt: it didn&rsquo;t read as agents at all. You
              couldn&rsquo;t tell an agent from a task, couldn&rsquo;t
              tell what any one agent owned, and there was nowhere to
              connect your tools, connectors were buried in settings with
              nothing pointing you to them. A lean MVP that earned its
              keep by proving what not to build.
            </p>
            <blockquote className="mt-6 max-w-3xl border-l-2 border-[#0a0a0a]/30 pl-5 text-[17px] italic leading-[1.6] text-[#0a0a0a]/80 md:text-[18px]">
              &ldquo;This doesn&rsquo;t look like an agent experience.
              It&rsquo;s confusing.&rdquo;
            </blockquote>
            <div className="mt-12 md:mt-16">
              <Placeholder
                name="v1 Kanban MVP"
                description="Agents crammed down the left, tasks on the right, no clear line between who does the work and what the work is."
              />
            </div>
          </div>

          {/* ITERATION 02: Cards, with onboarding */}
          <div className="mt-24 md:mt-32">
            <div className="flex items-baseline gap-5">
              <span className="text-[14px] font-medium tabular-nums text-[#525252]">
                02
              </span>
              <h3 className="cs-thesis">Cards, with a real onboarding</h3>
            </div>
            <p className="mt-6 max-w-3xl text-[17px] leading-[1.72] text-[#525252] md:text-[18px]">
              So I rebuilt around agents you could actually read. Each
              agent became a card you open to see who it is, what it can
              do, and the jobs it runs. It also fixed the worst gap from
              v1: an onboarding that takes your connectors upfront, so
              the team unlocks the moment you connect, instead of leaving
              you to hunt through settings. Feedback flipped positive
              fast. But it surfaced a new gap: people liked the agents
              and still couldn&rsquo;t tell which one specialized in
              what, or how they related.
            </p>
            <blockquote className="mt-6 max-w-3xl border-l-2 border-[#0a0a0a]/30 pl-5 text-[17px] italic leading-[1.6] text-[#0a0a0a]/80 md:text-[18px]">
              &ldquo;These are cool. But we don&rsquo;t know what the
              agents <em>are</em>, or where each one fits.&rdquo;
            </blockquote>
            <div className="mt-12 md:mt-16">
              <Placeholder
                name="Cards view"
                description="Each agent legible on its own card; connectors unlocked through onboarding, not buried in settings."
              />
            </div>
          </div>

          {/* ITERATION 03: The org view */}
          <div className="mt-24 md:mt-32">
            <div className="flex items-baseline gap-5">
              <span className="text-[14px] font-medium tabular-nums text-[#525252]">
                03
              </span>
              <h3 className="cs-thesis">The org view</h3>
            </div>
            <p className="mt-6 max-w-3xl text-[17px] leading-[1.72] text-[#525252] md:text-[18px]">
              That last piece of feedback, <em>who specializes in what</em>,
              is exactly what the org view answers. The orchestrator sits
              at the top, the five lifecycle stages run across (Discover,
              Acquire, Convert, Retain, Grow), and each specialist groups
              under the stage it owns. Specialization became readable
              before you opened a single thread.
            </p>
            <p className="mt-4 max-w-3xl text-[17px] leading-[1.72] text-[#525252] md:text-[18px]">
              The move I&rsquo;m proudest of is small. In every earlier
              version the orchestrator was just another named agent. In
              the org view I put the <em>brand&rsquo;s own name</em> at
              the top. Now the brand sees itself as the orchestrator, the
              one who decides which agents run. The hierarchy stopped
              saying &ldquo;the software has a manager&rdquo; and started
              saying &ldquo;you run this team.&rdquo;
            </p>
            <div className="mt-12 md:mt-16">
              <Placeholder
                name="Org view"
                description="The brand at the top as orchestrator, branching into Discover / Acquire / Convert / Retain / Grow, specialists grouped beneath each stage."
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ===== 06 · The tradeoff I'd redo ================================
           Text-only, no visual slot. Updated copy now mentions the
           lifecycle funnel metaphor specifically. */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <SectionHeader>The tradeoff I&rsquo;d redo</SectionHeader>
          <Prose className="mt-12">
            <p>
              I went back and forth on the org view. A lifecycle funnel is
              a strong, almost heavy metaphor for something that should
              feel alive, and I worried it read too literal, more chart
              than team. I kept it because the comprehension win was real
              and measured: people understood the
              orchestrate-the-specialists model instantly with it and
              stumbled without it. I chose what taught users fastest over
              what I found most elegant. I&rsquo;d keep the hierarchy and
              keep refining how it&rsquo;s drawn.
            </p>
          </Prose>
        </Container>
      </section>

      {/* ===== 07 · Then you open an agent, and make it yours ============
           New section per the storyteller doc. soul.md graduates from a
           teammate-iteration bullet to its own product moment, sitting
           between meeting the team and assigning work. */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <SectionHeader>
            Then you open an agent, and make it yours
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              Click any agent and it expands: who it is, the jobs it
              runs, its connectors, and the thing that turns a stock
              agent into staff, its{" "}
              <code className="px-1 text-[0.92em]">soul.md</code>. A
              short persona file you name and edit, sitting right inside
              the agent&rsquo;s own panel. Russ, who runs the numbers,
              opens his with{" "}
              <em>&ldquo;Every statement includes a number.&rdquo;</em>{" "}
              One line, and he talks back to you differently forever.
            </p>
            <p>
              This is the difference between a tool and a teammate. The
              org view shows you the team.{" "}
              <code className="px-1 text-[0.92em]">soul.md</code> lets
              you write who each member is. From this same panel you can
              do the two things that matter next: talk to the agent, or
              hand it a job.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              name="Agent expanded view"
              description="Name, character, the jobs it does, connectors, and the editable soul.md, with Chat and Assign right there."
            />
          </div>
        </Container>
      </section>

      {/* ===== 08 · Two doors into one team... ===========================
           Order swapped per the new storyteller doc: Chat / Cowork
           leads (goal thinkers first), Jobs / Kanban follows. */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <SectionHeader>
            Two doors into one team, depending on how you think
          </SectionHeader>

          <div className="mt-16 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:gap-10">
            {/* Chat / Cowork, now leading */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#0d8a8a]">
                Chat / Cowork, for goal thinkers
              </p>
              <p className="mt-3 text-[15px] leading-[1.7] text-[#525252]">
                State the outcome in plain language. Talk to one agent,
                or let the orchestrator recruit the team into a single
                thread.
              </p>
            </div>
            {/* Jobs / Kanban, now second */}
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#0d8a8a]">
                Jobs / Kanban, for task thinkers
              </p>
              <p className="mt-3 text-[15px] leading-[1.7] text-[#525252]">
                Work moves across{" "}
                <em>
                  Needs Attention &rarr; In Progress &rarr; Completed
                </em>
                , tracked in the Tasks tab for the bigger pieces of
                work. One task, or one a few agents pick up together.
              </p>
            </div>
          </div>

          <Prose className="mt-12">
            <p>
              Same engine, two views. You brief the way your head already
              works.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              aspect="wide"
              name="Cowork + Kanban side by side"
              description="The two entry points to the same orchestration engine."
            />
          </div>
        </Container>
      </section>

      {/* ===== 09 · Then you watch the team think ========================
           Order in the new doc: this comes BEFORE "What needs you" (the
           swap from previous version). Picks up the Activity Hub as a
           second surface alongside the Arc thread. */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <SectionHeader>Then you watch the team think</SectionHeader>
          <Prose className="mt-12">
            <p>
              This is where Legible Orchestration stops being a thesis
              and becomes pixels. Assign a goal and you don&rsquo;t get a
              spinner, you get a window. You watch Gavin pull Monica into
              the thread when creative fatigues. Reasoning states
              (&ldquo;thinking for 8s&rdquo;) show the work happening.
              Multi-step Arcs expose the plan as it runs, not just the
              result. Long jobs notify you when they finish so you never
              sit and wait.
            </p>
            <p>
              Below it, the Activity Hub is the team&rsquo;s feed: what
              each agent is doing right now, in plain language, the
              moment they do it. Every state is designed, empty, loading,
              error, success, because an AI team that fails silently
              can&rsquo;t be trusted. The handoff happens in front of
              you, not behind a loading bar.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              name="Orchestration thread + Activity Hub"
              description="An Arc in flight (the plan, the current step, who's working) above the live feed of every agent's current move."
            />
          </div>
        </Container>
      </section>

      {/* ===== 10 · What needs you, in 60 seconds instead of six tabs ====
           Renamed from "A founder's morning". Same two visuals (Needs
           Attention pinned + SKU scatter), updated copy that frames
           Mission Control as the command center on top of the agents. */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <SectionHeader>
            What needs you, in 60 seconds instead of six tabs
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              Scroll Mission Control and it does the one job a tab-crawl
              never could: it tells you what needs a human. Needs
              Attention is pinned near the top, capped at three items,
              each naming the agent, the metric, and one action, never a
              vague &ldquo;performance is down.&rdquo; Below it, a chart
              plots every product by where ad spend goes versus where
              revenue comes from, so the gaps surface at a glance.
            </p>
            <p>
              Mission Control reads, surfaces, and alerts. It never
              generates, that happens inside the agents. It&rsquo;s the
              command center that points you to the two things that
              actually matter today.
            </p>
          </Prose>

          <div className="mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2">
            <Placeholder
              aspect="wide"
              name="Needs Attention"
              description="Pinned, capped at three, each item names the agent, the metric, and one action."
            />
            <Placeholder
              aspect="wide"
              name="SKU scatter"
              description="Every product plotted by ad spend × revenue; the gaps surface at a glance."
            />
          </div>
        </Container>
      </section>

      {/* ===== 11 · What shipped ========================================= */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <SectionHeader>What shipped</SectionHeader>
          <Prose className="mt-12">
            <p>
              Eight agents running real store work today, live with 10+
              enterprise brands. I designed the system end to end and
              built the frontend: onboarding, agent setup, the org view,
              the agent panels, Cowork, the Kanban board, and the Needs
              Attention and Activity Hub surfaces, every state built to
              near-production fidelity.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              name="Shipped surfaces"
              description="Onboarding, agent setup, org view, agent panel, Cowork thread, Kanban, Mission Control."
            />
          </div>
        </Container>
      </section>

      {/* ===== 11 · What we're measuring, live and honest about it =======
           Dark proof card. Structured per the storyteller doc:
           1) Real, today: the 8-agents stat + the 0 → 4 GEO pilot result
              with its full paragraph (GEO numbers preserved verbatim).
           2) Still being instrumented: two Goal / Signal / Metric bets.
           3) Pending-quote line. */}
      <section className="reveal pb-32 pt-12 md:pb-44 md:pt-16">
        <Container>
          <div className="rounded-3xl bg-[#0a0a0a] px-8 py-16 text-white md:px-14 md:py-20">
            <h2 className="cs-section cs-on-dark">
              What we&rsquo;re measuring, live and honest about it
            </h2>
            <p className="mt-8 max-w-[var(--cs-prose-col)] text-[17px] leading-[1.7] text-white/75">
              The product is live and the agents are already moving real
              numbers. Here is the proof that exists today, then the bets
              still being instrumented. No dressed-up data.
            </p>

            {/* Real, today */}
            <p className="mt-14 text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">
              Real, today
            </p>

            <div className="mt-10 grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-x-12">
              {/* 8 agents stat */}
              <div className="md:col-span-4">
                <div
                  className="font-semibold leading-none tracking-tight"
                  style={{ fontSize: "clamp(2.25rem, 1.8rem + 1.5vw, 3rem)" }}
                >
                  8
                </div>
                <p className="mt-5 max-w-[24ch] text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">
                  Agents live with 10+ enterprise brands, running real
                  store work
                </p>
              </div>

              {/* 0 → 4 GEO pilot */}
              <div className="md:col-span-8">
                <div
                  className="font-semibold leading-none tracking-tight"
                  style={{ fontSize: "clamp(2.25rem, 1.8rem + 1.5vw, 3rem)" }}
                >
                  0 &rarr; 4
                </div>
                <p className="mt-5 text-[14px] leading-[1.7] text-white/75">
                  In a 15-day GEO pilot for a denim DTC brand, the GEO
                  agent took the brand from cited by <em>zero</em> AI
                  engines to cited by <em>all four</em> (ChatGPT, Claude,
                  Perplexity, Gemini). In plain terms: from invisible
                  when a customer asks an AI, to present everywhere they
                  might ask. Perplexity citations rose 7% to 13%,
                  technical health 59% to 65%, with 20 articles published
                  as an owned content hub. One brand, fifteen days, early
                  and directional. But real, and run end to end by an
                  agent.
                </p>
              </div>
            </div>

            {/* Still being instrumented */}
            <p className="mt-16 text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">
              Still being instrumented
            </p>

            <div className="mt-10 grid grid-cols-1 gap-y-12 md:grid-cols-2 md:gap-x-12">
              {/* Bet 1: specialist hours */}
              <div>
                <dl className="space-y-3 text-[14px] leading-[1.7]">
                  <div className="flex gap-2">
                    <dt className="font-semibold text-white/85">Goal:</dt>
                    <dd className="text-white/70">
                      specialist hours collapse into agent minutes.
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-semibold text-white/85">Signal:</dt>
                    <dd className="text-white/70">
                      founders stop opening the six tabs and brief the
                      team instead.
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-semibold text-white/85">Metric:</dt>
                    <dd className="text-white/70">
                      hours run per agent, and the multiplier of
                      specialist-hours saved.
                    </dd>
                  </div>
                </dl>
                <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-white/35">
                  ⬚ Instrumented, pending real data
                </p>
              </div>

              {/* Bet 2: team feels like a team */}
              <div>
                <dl className="space-y-3 text-[14px] leading-[1.7]">
                  <div className="flex gap-2">
                    <dt className="font-semibold text-white/85">Goal:</dt>
                    <dd className="text-white/70">
                      the team feels like a team, not a feature list.
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-semibold text-white/85">Signal:</dt>
                    <dd className="text-white/70">
                      clients refer to agents by name, unprompted.
                    </dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="font-semibold text-white/85">Metric:</dt>
                    <dd className="text-white/70">
                      client-confirmed lift on the function the agents own.
                    </dd>
                  </div>
                </dl>
                <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-white/35">
                  ⬚ Instrumented, pending real data
                </p>
              </div>
            </div>

            {/* Pending quote line */}
            <div className="mt-16 border-t border-white/10 pt-10 md:mt-20 md:pt-12">
              <p className="text-[14px] italic leading-[1.7] text-white/55">
                Client quote pending real confirmation: the kind of line
                that proves the team feels like a team.
              </p>
            </div>
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
              The roster shipped exactly as designed, and it runs real
              stores today. The durable idea underneath it isn&rsquo;t
              eight agents or one dashboard. It&rsquo;s that an
              autonomous team only earns trust when a human can watch it
              think, and that a single surface can carry the whole arc
              from meeting your team to seeing what needs you. That&rsquo;s
              the pattern ShopOS now builds everything else on.
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
