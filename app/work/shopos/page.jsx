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

      {/* ===== TOP — back link + lede ===================================== */}
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

        <p className="cs-thesis mt-10 max-w-[var(--cs-prose-col)]">
          An AI team that runs your store.
        </p>
        <p className="cs-lede mt-6 max-w-[var(--cs-prose-col)]">
          I led research, design, and the frontend for an AI-agent operating
          system, where a brand owner directs a department of named AI agents
          instead of hiring one specialist per function.
        </p>
      </Container>

      {/* ===== Agents fan-out thumbnail ====================================
           One agent stacked centre-screen; as the user scrolls into the
           thumbnail the agents fan out horizontally on a staggered ease.
           Replaces the placeholder intro video. */}
      <Container className="reveal pt-16 md:pt-24">
        <AgentsFanOut />
      </Container>

      {/* ===== Metadata strip ============================================
           Clean 5-column rail, Google-case-study style: small uppercase
           eyebrow + larger single-line value, no dividers, generous gaps.
           Values wrap naturally when long (Tools tends to spill to 2 lines
           on narrower viewports). */}
      <Container className="reveal pt-20 md:pt-28">
        <dl
          className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-5 md:gap-x-10"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {[
            { k: "My Role", v: "Research, Product Design, Frontend" },
            { k: "Team", v: "Founding team · engineers" },
            { k: "Company", v: "ShopOS" },
            { k: "Duration", v: "Mar 2026 – Present" },
            { k: "Tools", v: "Figma, Cursor, Claude Code" },
          ].map(({ k, v }) => (
            <div key={k}>
              <dt className="cs-eyebrow">{k}</dt>
              <dd className="cs-meta-value mt-3">{v}</dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* ===== 01 · CONTEXT ============================================== */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>Context</Eyebrow>
          <SectionHeader>
            A founder running a store is running eight jobs at once.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              By 2026, a brand owner had AI that could write a caption or make
              a product shot. Useful, but it didn&rsquo;t run the store. They
              were still the one on SEO, on paid, on email, watching the
              numbers, answering reviews. One person wearing every hat, with
              no way to watch it all at once.
            </p>
            <p>
              Then agents changed what was possible. Not another tool to open,
              but something that could own a function and run it relentlessly,
              around the clock, without being checked ten times a day. The
              opening wasn&rsquo;t a better image generator. It was the whole
              store, covered.
            </p>
          </Prose>

          {/* Context thumbnail — chips bloom in around the headline
              when the frame settles in view, mirroring the AgentsFanOut
              scroll trigger pattern. */}
          <div className="mt-16 md:mt-20">
            <TooManyTasks />
          </div>
        </Container>
      </section>

      {/* ===== 02 · APPROACH ============================================= */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>Approach</Eyebrow>
          <SectionHeader>
            We didn&rsquo;t invent the team. We modeled it on our own.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              The roles already existed in the building: a paid lead, a CRM
              manager, a creative director. So I built an internal MVP of the
              agents and ran it through our own team, each person testing the
              agent for the role they actually do. Their feedback shaped what
              each agent owned.
            </p>
            <p>
              I leaned hardest on the people closest to the customer. Our CRM
              and sales team talk to users far more than design does, so I
              used them to pressure-test which agents mattered.
            </p>
            <p>
              Then I validated cheap and fast. A vibe-coded MVP first, because
              it was quickest to put in front of onboarded brands, with the
              Figma-designed version built in parallel as their feedback came
              in. Real reactions before real build.
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

      {/* ===== 03 · THE SOLUTION ========================================= */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>The solution</Eyebrow>
          <SectionHeader>
            One AI team, eight functions, one place to direct them.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              Connect your tools once, and a roster of named agents spins up
              to cover the store. Gavin runs paid. Monica owns creative.
              Jian-Yang reads the market, Russ watches the numbers, Richard
              minds the store, with more on GEO, social, email, and brand
              intelligence.
            </p>
            <p>
              You don&rsquo;t prompt a model. You brief a team, all at once in
              one chat, or one agent at a time.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              name="Agent Roster / Mission Control"
              description="The home surface — the named roster and Mission Control side by side, where the team gets briefed."
            />
          </div>
        </Container>
      </section>

      {/* ===== 04 · THE HARD PART ======================================== */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>The hard part</Eyebrow>
          <SectionHeader>
            The novel problem wasn&rsquo;t the chat. It was the org.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              Plenty of products do single-agent chat. Nobody had a clean
              pattern for one agent recruiting specialists into a single
              conversation, reasoning out loud and reporting back without
              losing the user.
            </p>
            <p>
              It gets concrete. When Gavin spots a fatiguing ad, he briefs
              Monica, who generates replacements, while Jian-Yang feeds both.
              The team hands work to itself. My job was to make that legible
              to a human watching from outside.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              name="Orchestration Thread"
              description="A single thread where a lead agent recruits specialists, narrates its reasoning, and assembles the team in front of you — the page's central interaction pattern previewed."
            />
          </div>
        </Container>
      </section>

      {/* ===== 05 · DESIGNING THE AGENTS ================================= */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>Designing the agents</Eyebrow>
          <SectionHeader>
            How do you make an agent feel like a teammate, not a tool?
          </SectionHeader>
          <Prose className="mt-12">
            <p>Three versions. I&rsquo;ll be honest about all three.</p>
          </Prose>

          {/* ITERATION 01 */}
          <div className="mt-20 md:mt-24">
            <div className="flex items-baseline gap-5">
              <span className="text-[14px] font-medium tabular-nums text-[#525252]">
                01
              </span>
              <h3 className="cs-thesis">Cards</h3>
            </div>
            <p className="mt-6 max-w-3xl text-[17px] leading-[1.72] text-[#525252] md:text-[18px]">
              Each agent a tidy card. Clean, but it read like a feature list.
              Yours to <em>read</em>, not to <em>shape</em>.
            </p>
            <div className="mt-12 md:mt-16">
              <Placeholder
                name="Card Stack"
                description="The original card-stack — each function a tidy card. Scannable, but it read as a feature list."
              />
            </div>
          </div>

          {/* ITERATION 02 */}
          <div className="mt-24 md:mt-32">
            <div className="flex items-baseline gap-5">
              <span className="text-[14px] font-medium tabular-nums text-[#525252]">
                02
              </span>
              <h3 className="cs-thesis">
                Name plus <code className="px-1 text-[0.85em]">soul.md</code>
              </h3>
            </div>
            <p className="mt-6 max-w-3xl text-[17px] leading-[1.72] text-[#525252] md:text-[18px]">
              Every agent gets a name and a short persona file. Russ opens his
              with <em>&ldquo;Every statement includes a number.&rdquo;</em>{" "}
              The catalog became <em>your</em> team.
            </p>
            <div className="mt-12 md:mt-16">
              <Placeholder
                name="soul.md Editor"
                description="The agent's soul.md editor — name, persona, what it always carries. The screen that turns 'a stock agent' into 'your Russ who only talks in numbers.'"
              />
            </div>
          </div>

          {/* ITERATION 03 */}
          <div className="mt-24 md:mt-32">
            <div className="flex items-baseline gap-5">
              <span className="text-[14px] font-medium tabular-nums text-[#525252]">
                03
              </span>
              <h3 className="cs-thesis">The org view</h3>
            </div>
            <p className="mt-6 max-w-3xl text-[17px] leading-[1.72] text-[#525252] md:text-[18px]">
              People couldn&rsquo;t tell who reported to whom, so I added a
              bracketed org-chart view.
            </p>
            <div className="mt-12 md:mt-16">
              <Placeholder
                name="Org View"
                description="The bracketed org view — lead agents at the top, specialists grouped beneath, work flowing through the brackets."
              />
            </div>
          </div>

          {/* HONEST TRADEOFF — kept callout */}
          <div className="mt-20 max-w-3xl border-l-2 border-[#0a0a0a] pl-6 md:mt-24">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#525252]">
              The honest tradeoff
            </p>
            <p className="mt-4 text-[18px] leading-[1.7] text-[#0a0a0a]/90 md:text-[19px]">
              I&rsquo;m not sold on how I drew the org view. It reads more
              like a flowchart than a living team, and I pushed back on it
              internally. I kept it because the comprehension win was real
              and measured: people understood the model instantly with it,
              and stumbled without it. I chose what taught users fastest over
              what I found most elegant. I&rsquo;d keep the hierarchy and
              redraw how it&rsquo;s shown.
            </p>
          </div>
        </Container>
      </section>

      {/* ===== 06 · GIVING THE TEAM WORK ================================= */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>Giving the team work</Eyebrow>
          <SectionHeader>
            Two doors in, depending on how you think.
          </SectionHeader>

          <div className="mt-16 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:gap-10">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#0d8a8a]">
                Jobs / Kanban
              </p>
              <p className="mt-3 text-[19px] font-medium leading-snug text-[#0a0a0a] md:text-[20px]">
                For task thinkers.
              </p>
              <p className="mt-3 text-[15px] leading-[1.7] text-[#525252]">
                Work moves across <em>Needs Attention &rarr; In Progress
                &rarr; Completed</em>. A single task, or one a few agents pick
                up together.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#0d8a8a]">
                Chat / Cowork
              </p>
              <p className="mt-3 text-[19px] font-medium leading-snug text-[#0a0a0a] md:text-[20px]">
                For goal thinkers.
              </p>
              <p className="mt-3 text-[15px] leading-[1.7] text-[#525252]">
                State the outcome; talk to one agent, or let a lead agent
                recruit the team.
              </p>
            </div>
          </div>

          <Prose className="mt-12">
            <p>Two views of one team.</p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              aspect="wide"
              name="Kanban + Chat Side by Side"
              description="The two entry points to the same engine — Kanban board on one side, Cowork chat on the other."
            />
          </div>
        </Container>
      </section>

      {/* ===== 07 · MISSION CONTROL (with 2-up gallery) ================== */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>Mission Control</Eyebrow>
          <SectionHeader>
            What happened, what needs me, what my agents did, in 60 seconds.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              A founder&rsquo;s morning used to be six tabs. Mission Control
              replaces it with one check-in. It reads and surfaces; it never
              generates.
            </p>
            <p>
              Needs Attention is pinned at the top, capped at three items,
              each naming the agent, the metric, and one action. Below it, a
              chart sorts every product by where ad spend goes versus where
              revenue comes from, so the gaps surface at a glance.
            </p>
          </Prose>

          {/* 2-up gallery */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2">
            <Placeholder
              aspect="wide"
              name="Needs Attention"
              description="Pinned at top, capped at three — each item names the agent, the metric, and one action."
            />
            <Placeholder
              aspect="wide"
              name="SKU Scatter"
              description="Every product plotted by ad spend × revenue — gaps surface at a glance."
            />
          </div>
        </Container>
      </section>

      {/* ===== 08 · THE ORCHESTRATION THREAD (UI) ======================== */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>The orchestration thread</Eyebrow>
          <SectionHeader>
            Making &ldquo;thinking for 8 seconds&rdquo; feel like progress,
            not a spinner.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              You watch Gavin pull Monica into the thread. Reasoning states
              show the work. Multi-step Arcs expose the plan as it runs. Long
              jobs notify you when done.
            </p>
            <p>
              Every state, empty, loading, error, success, is designed. An AI
              team that fails silently isn&rsquo;t trustworthy. Trust was the
              whole product.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              name="Arc Execution"
              description="A multi-step Arc in flight — the plan, the current step, what's pending, who's working on what."
            />
          </div>
        </Container>
      </section>

      {/* ===== 09 · WHAT SHIPPED ========================================= */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>What shipped</Eyebrow>
          <SectionHeader>Live with real enterprise clients.</SectionHeader>
          <Prose className="mt-12">
            <p>
              Eight agents running real store work today. I designed the
              system end to end and built the frontend: onboarding, agent
              setup, the Kanban board, Mission Control, Cowork, and the
              multi-agent conversation, every state built to near-production
              fidelity.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              name="Shipped Surfaces"
              description="The shipped surfaces montage — onboarding, agent setup, Kanban, Mission Control, Cowork, multi-agent conversation."
            />
          </div>
        </Container>
      </section>

      {/* ===== 10 · BY THE NUMBERS (dark card, 3 stubbed + 1 real + quote)
           One real stat is shown ("8 / real enterprise clients"); the other
           three metrics + the client quote are styled placeholders until the
           PM has real numbers and a confirmed quote to publish. */}
      <section className="reveal pb-32 pt-12 md:pb-44 md:pt-16">
        <Container>
          <div className="rounded-3xl bg-[#0a0a0a] px-8 py-16 text-white md:px-14 md:py-20">
            <div className="flex flex-wrap items-baseline justify-between gap-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">
                  By the numbers
                </p>
                <h2 className="cs-section cs-on-dark mt-4">Proof</h2>
              </div>
              <p className="max-w-sm text-[14px] leading-[1.55] text-white/55">
                Three slots + a client quote are stubbed until real data is
                in hand — only the live-clients count is publishable today.
              </p>
            </div>

            {/* 4-up stat row — 1 real, 3 pending placeholders */}
            <div className="mt-14 grid grid-cols-2 gap-y-12 gap-x-8 md:mt-20 md:grid-cols-4">
              {[
                {
                  value: "8",
                  label: "Agents live with real enterprise clients",
                  pending: false,
                },
                {
                  value: "—",
                  label: "Most-used agents, by hours run",
                  pending: true,
                },
                {
                  value: "—×",
                  label: "Specialist hours collapsed to agent minutes",
                  pending: true,
                },
                {
                  value: "+—%",
                  label: "Metric the agents moved (client-confirmed)",
                  pending: true,
                },
              ].map((m) => (
                <div key={m.label}>
                  <div
                    className="font-semibold leading-none tracking-tight"
                    style={{ fontSize: "clamp(2.25rem, 1.8rem + 1.5vw, 3rem)" }}
                  >
                    {m.value}
                  </div>
                  <p className="mt-5 max-w-[22ch] text-[11px] font-medium uppercase tracking-[0.16em] text-white/60">
                    {m.label}
                  </p>
                  {m.pending ? (
                    <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-white/35">
                      ⬚ Pending real data
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            {/* Client quote — styled placeholder until a real, confirmed line
                from a brand lands. Kept on-card so the proof block reads as
                one composed unit. */}
            <div className="mt-16 border-t border-white/10 pt-12 md:mt-20 md:pt-14">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">
                Client quote
              </p>
              <blockquote
                className="mt-6 max-w-3xl text-[22px] font-medium italic leading-[1.35] text-white/85 md:text-[28px]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                &ldquo;[ One real line from a brand using ShopOS —
                anonymized is fine. The kind of quote that proves the team
                feels like a team. ]&rdquo;
              </blockquote>
              <div className="mt-8 flex items-center gap-4">
                <div
                  aria-hidden="true"
                  className="h-10 w-10 flex-shrink-0 rounded-full bg-white/15"
                />
                <div>
                  <div className="text-[14px] font-semibold text-white/90">
                    [Name]
                  </div>
                  <div className="text-[12px] text-white/55">
                    [Role · Brand]
                  </div>
                </div>
              </div>
              <p className="mt-8 text-[10px] uppercase tracking-[0.18em] text-white/35">
                ⬚ Quote + attribution pending real client confirmation
              </p>
            </div>
          </div>
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
