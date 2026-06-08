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

function Eyebrow({ children, dark = false }) {
  return (
    <p
      className={`text-[11px] font-medium uppercase tracking-[0.22em] ${
        dark ? "text-white/55" : "text-[#0d8a8a]"
      }`}
    >
      {children}
    </p>
  );
}

function SectionHeader({ children, className = "", dark = false }) {
  return (
    <h2
      className={`mt-6 max-w-[22ch] text-4xl font-black uppercase leading-[1.04] tracking-tight md:text-5xl lg:text-6xl ${
        dark ? "text-white" : "text-[#0a0a0a]"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

function Prose({ children, className = "" }) {
  return (
    <div
      className={`max-w-[68ch] space-y-6 text-[17px] leading-[1.72] text-[#525252] md:text-[18px] ${className}`}
    >
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
    <main className="min-h-screen bg-white text-[#0a0a0a] antialiased">
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

        <p className="mt-10 max-w-3xl text-2xl font-medium leading-tight text-[#0a0a0a] md:text-3xl">
          An AI team that runs your store.
        </p>
        <p className="mt-6 max-w-3xl text-[17px] leading-[1.7] text-[#525252] md:text-[18px]">
          I designed the system and built its frontend for an AI-agent operating
          system where a brand owner directs a team of named AI agents &mdash;
          an entire marketing and ops department, staffed by agents instead of
          hires.
        </p>
        <div className="mt-10">
          <Pill href="#" external>
            Visit ShopOS
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Pill>
        </div>
      </Container>

      {/* ===== Intro video ================================================ */}
      <Container className="reveal pt-16 md:pt-24">
        <VideoBlock
          src="/videos/shopos-intro.mp4"
          name="Intro video"
          description="A 30–60s walkthrough — the moment a brand owner briefs the team and watches a multi-agent thread assemble around the request."
        />
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
            { k: "My Role", v: "Founding Product Designer & Design Engineer" },
            { k: "Team", v: "Founding team · engineers" },
            { k: "Company", v: "ShopOS" },
            { k: "Duration", v: "Mar 2026 – Present" },
            { k: "Tools", v: "Figma, React, Next.js, Tailwind, OpenAI" },
          ].map(({ k, v }) => (
            <div key={k}>
              <dt className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#525252]">
                {k}
              </dt>
              <dd className="mt-3 text-[16px] leading-[1.5] text-[#0a0a0a]">
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* ===== 01 · CONTEXT ============================================== */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>Context</Eyebrow>
          <SectionHeader>
            AI gave brands image generation. Brands wanted the marketing
            department.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              By early 2026, every DTC brand had access to AI that could write a
              caption or generate a product shot. None of it added up to running
              a store. A founder still needed someone to own SEO, someone for
              paid, someone for email, someone watching the numbers &mdash; and
              most small brands can&rsquo;t hire one specialist per function,
              let alone eight.
            </p>
            <p>
              The gap wasn&rsquo;t <em>capability</em>. It was{" "}
              <em>coordination</em>. Brands didn&rsquo;t want another chatbot to
              prompt. They wanted a team that already knew the store and got on
              with the work.
            </p>
          </Prose>
        </Container>
      </section>

      {/* ===== 02 · THE SOLUTION ========================================= */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>The solution</Eyebrow>
          <SectionHeader>
            One AI team, eight functions, one place to direct them.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              ShopOS lets a brand owner connect their tools once, and a roster
              of named agents spins up to cover the whole store: Gavin on paid,
              Monica on creative, Jian-Yang reading the market, Russ watching
              the numbers, Richard minding the store &mdash; plus agents for
              GEO, social, email, and brand intelligence. Eight functions, eight
              teammates.
            </p>
            <p>
              You don&rsquo;t prompt a model. You hand work to a team, the way
              you&rsquo;d brief a department.
            </p>
          </Prose>

          <p className="mt-12 max-w-3xl border-l-2 border-[#0a0a0a] pl-6 text-[19px] font-medium leading-[1.5] text-[#0a0a0a] md:text-[21px]">
            Connect your tools &rarr; agents provision themselves &rarr; you
            give them work &rarr; a lead agent pulls the right specialists into
            one thread, reasons through it, and ships the output.
          </p>

          <Prose className="mt-12">
            <p>
              The home surface is Mission Control: the one screen where a
              founder sees what their team is doing and what needs them.
            </p>
          </Prose>
        </Container>
      </section>

      {/* ===== 03 · THE HARD PART ======================================== */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>The hard part</Eyebrow>
          <SectionHeader>
            The novel problem wasn&rsquo;t the chat. It was the org.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              Plenty of products can do single-agent chat. The thing nobody had
              a clean pattern for was{" "}
              <em>one agent recruiting specialists into a single conversation</em>{" "}
              &mdash; reasoning out loud, running multi-step &ldquo;Arcs&rdquo;
              (like a TOFU A/B test loop), and reporting back without the user
              losing the thread.
            </p>
            <p>
              It gets concrete fast. When Gavin (paid) detects a creative
              fatiguing, he doesn&rsquo;t just flag it &mdash; he briefs Monica
              (creative), who generates replacements, while Jian-Yang (brand
              intelligence) feeds both. The team hands work to itself. My job
              was to make that legible to a human watching from the outside
              &mdash; who&rsquo;s leading, who just joined, what they&rsquo;re
              doing right now &mdash; without drowning them in logs.
            </p>
            <p>
              That orchestration UX was the real design problem. Everything else
              served it.
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

      {/* ===== 04 · DESIGNING THE AGENTS ================================= */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>Designing the agents</Eyebrow>
          <SectionHeader>
            How do you make an agent feel like a teammate, not a tool?
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              This is the part I iterated on most, and the part I want to be
              honest about. I worked through three distinct versions of how a
              brand sees and shapes its team.
            </p>
          </Prose>

          {/* ITERATION 01 */}
          <div className="mt-24 md:mt-32">
            <div className="flex items-baseline gap-5">
              <span className="text-[14px] font-medium tabular-nums text-[#525252]">
                01
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
                The card stack
              </h3>
            </div>
            <p className="mt-4 text-[15px] italic text-[#525252]">
              The first version.
            </p>
            <p className="mt-6 max-w-3xl text-[17px] leading-[1.72] text-[#525252] md:text-[18px]">
              Agents lived as a stack of cards: one card per function, each a
              tidy summary of what that agent owned.
            </p>
            <ul className="mt-8 max-w-3xl space-y-3 text-[16px] leading-[1.6]">
              <PlusMinus type="+" text="Clean, scannable, dead simple to read at a glance" />
              <PlusMinus type="+" text="Mapped one-to-one with the store's functions" />
              <PlusMinus
                type="-"
                text="Felt like a feature list, not a team — the cards were yours to read, not yours to shape"
              />
              <PlusMinus
                type="-"
                text={`No sense that any of these were "your" agents`}
              />
            </ul>

            <div className="mt-14 md:mt-20">
              <Placeholder
                name="Agent Setup"
                description="The original card-stack: each function shown as a tidy card the user reads. Scannable, but the user has nothing to do — only consume."
              />
            </div>
          </div>

          {/* ITERATION 02 */}
          <div className="mt-32 md:mt-40">
            <div className="flex items-baseline gap-5">
              <span className="text-[14px] font-medium tabular-nums text-[#525252]">
                02
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
                Personalization: name +{" "}
                <code className="px-1 text-[0.85em]">soul.md</code>
              </h3>
            </div>
            <p className="mt-4 text-[15px] italic text-[#525252]">
              Making them yours.
            </p>
            <p className="mt-6 max-w-3xl text-[17px] leading-[1.72] text-[#525252] md:text-[18px]">
              So I made them ownable: every agent gets a name and a{" "}
              <code className="px-1 text-[0.92em]">soul.md</code> &mdash; a
              short persona file that defines how it talks, what it prioritizes,
              the context it always carries. Russ, the finance agent, opens his
              with &ldquo;Every statement includes a number.&rdquo; Monica,
              creative, with &ldquo;You have opinions.&rdquo; Suddenly the card
              stack wasn&rsquo;t a catalog. It was <em>your</em> team, with your
              names and your voices.
            </p>
            <ul className="mt-8 max-w-3xl space-y-3 text-[16px] leading-[1.6]">
              <PlusMinus
                type="+"
                text="The agents became personal — owners started referring to them by name"
              />
              <PlusMinus
                type="+"
                text={`soul.md gave real, persistent control over behavior without a settings maze`}
              />
              <PlusMinus
                type="+"
                text="This is the differentiator: editable personalities, not generic chat"
              />
            </ul>

            <blockquote className="mt-14 max-w-3xl border-l-2 border-[#0a0a0a] pl-6 text-[22px] italic leading-[1.45] text-[#0a0a0a] md:text-[26px]">
              The moment an owner renames an agent and writes its soul, it stops
              being software and starts being staff.
            </blockquote>

            <div className="mt-14 md:mt-20">
              <Placeholder
                name="Agent Personalization"
                description="The agent's soul.md editor — name, persona, what it always carries. The screen that turns 'a stock agent' into 'your Gavin who only talks in numbers.'"
              />
            </div>
          </div>

          {/* ITERATION 03 */}
          <div className="mt-32 md:mt-40">
            <div className="flex items-baseline gap-5">
              <span className="text-[14px] font-medium tabular-nums text-[#525252]">
                03
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight md:text-3xl">
                The bracketed org view
              </h3>
            </div>
            <p className="mt-4 text-[15px] italic text-[#525252]">
              Where I have a real tradeoff.
            </p>
            <p className="mt-6 max-w-3xl text-[17px] leading-[1.72] text-[#525252] md:text-[18px]">
              Testing showed people couldn&rsquo;t always tell{" "}
              <em>who reports to whom</em> or{" "}
              <em>which agents work together</em> on a given job. So I added a
              bracketed, org-chart-style view: the lead agent at the top,
              specialists grouped beneath, work flowing through the brackets.
            </p>
            <ul className="mt-8 max-w-3xl space-y-3 text-[16px] leading-[1.6]">
              <PlusMinus
                type="+"
                text="Comprehension jumped — people finally understood the lead-orchestrates-specialists model"
              />
              <PlusMinus
                type="+"
                text="Made the multi-agent thread legible before you opened it"
              />
              <PlusMinus
                type="-"
                text="Honestly? I'm not sold on the bracketing UI. It reads a little like a flowchart, and brackets are a heavy visual metaphor for something that should feel alive."
              />
            </ul>

            <div className="mt-14 max-w-3xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#525252]">
                My honest take
              </p>
              <p className="mt-4 text-[18px] leading-[1.7] text-[#0a0a0a]/85 md:text-[19px]">
                I pushed back on the bracketed view internally, and I&rsquo;d
                still rethink the visual language &mdash; the <em>structure</em>{" "}
                it communicates is right, but the <em>execution</em> leans more
                diagram than team. I kept it because the comprehension win was
                real and measured; users understood the org instantly with it
                and stumbled without it. That&rsquo;s the tradeoff: I chose the
                version that taught users fastest over the version I found most
                elegant. Given another cycle, I&rsquo;d keep the hierarchy it
                conveys and redesign how it&rsquo;s drawn &mdash; less bracket,
                more living team.
              </p>
            </div>

            <div className="mt-14 md:mt-20">
              <Placeholder
                name="Memory System"
                description="The bracketed org view — how agents see each other, who reports to whom, and which specialists are co-working on a job right now. Shared organizational memory, visualized."
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ===== 05 · GIVING THE TEAM WORK ================================= */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>Giving the team work</Eyebrow>
          <SectionHeader>
            Two doors in, depending on how you think.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              Not everyone briefs work the same way, so I designed two entry
              points into the same engine:
            </p>
          </Prose>

          <div className="mt-16 grid grid-cols-1 gap-12 md:mt-20 md:grid-cols-2 md:gap-10">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#0d8a8a]">
                Jobs / Kanban
              </p>
              <p className="mt-3 text-[19px] font-medium leading-snug text-[#0a0a0a] md:text-[20px]">
                For people who think in tasks.
              </p>
              <p className="mt-3 text-[15px] leading-[1.7] text-[#525252]">
                Work moves across <em>Needs Attention &rarr; In Progress &rarr;
                Completed &rarr; Scheduled</em>. Structured, trackable,
                familiar.
              </p>
              <div className="mt-8">
                <Placeholder
                  aspect="wide"
                  name="Jobs Board"
                  description="A Kanban of agent work — needs attention, in progress, completed, scheduled — at a glance, drag-and-drop where useful."
                />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#0d8a8a]">
                Chat / Cowork
              </p>
              <p className="mt-3 text-[19px] font-medium leading-snug text-[#0a0a0a] md:text-[20px]">
                For people who think in goals.
              </p>
              <p className="mt-3 text-[15px] leading-[1.7] text-[#525252]">
                State the outcome in plain language; a lead agent figures out
                who to recruit and what steps to run.
              </p>
              <div className="mt-8">
                <Placeholder
                  aspect="wide"
                  name="Chat Interface"
                  description="A goal-led conversation — say what you want in plain language, watch the lead agent pick the right specialists for it."
                />
              </div>
            </div>
          </div>

          <Prose className="mt-16">
            <p>
              Both feed the same orchestration layer. The board and the chat are
              two views of one team.
            </p>
          </Prose>
        </Container>
      </section>

      {/* ===== 06 · MISSION CONTROL (with 2-up gallery) ================== */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <div className="flex flex-wrap items-center gap-3">
            <Eyebrow>Mission Control</Eyebrow>
            <span className="inline-flex items-center rounded-full border border-[#E5E5E5] bg-white px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#0a0a0a]">
              Product Design
            </span>
          </div>
          <SectionHeader>
            Tell me what happened, what needs me, and what my agents did
            &mdash; in 60 seconds.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              A founder&rsquo;s morning used to be six tabs: Meta Ads, Shopify,
              the agency&rsquo;s WhatsApp thread, a spreadsheet from last week.
              By the time the picture came together it was 10am, and half the
              day&rsquo;s decisions were already reactive. Mission Control
              replaces that with a single morning check-in. It{" "}
              <em>reads and surfaces</em>; it never generates &mdash; generation
              lives in Cowork. Two design rules held it together.
            </p>
            <p>
              <strong className="font-semibold text-[#0a0a0a]">
                Needs Attention is pinned at the top, capped at two or three
                items.
              </strong>{" "}
              Every item names the agent who flagged it, the specific metric,
              what&rsquo;s already been done, and exactly one action &mdash;{" "}
              <em>Open in Cowork</em>. No vague &ldquo;performance is
              down.&rdquo; If it can&rsquo;t be made specific and actionable, it
              doesn&rsquo;t surface.
            </p>
            <p>
              <strong className="font-semibold text-[#0a0a0a]">
                The SKU scatter chart was the standout.
              </strong>{" "}
              Every product is plotted by Meta spend against Shopify revenue and
              sorted into four quadrants &mdash;{" "}
              <em>Scale, Untapped, Drain, Inactive</em>. The gap between where
              Meta spends and where Shopify makes money is exactly where value
              is hiding or bleeding. It turned a spreadsheet nobody opens into a
              glance you can&rsquo;t unsee.
            </p>
            <p>
              Mission Control is the status surface; Cowork is the action
              surface. One button bridges them &mdash; so you never read about a
              problem without a one-tap way to act on it.
            </p>
          </Prose>

          {/* 2-up gallery */}
          <div className="mt-16 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-2">
            <Placeholder
              aspect="wide"
              name="Needs Attention"
              description="The pinned top block — two or three items, each with the agent who flagged it, the metric, and a one-tap Open-in-Cowork action."
            />
            <Placeholder
              aspect="wide"
              name="SKU Scatter"
              description="Meta spend × Shopify revenue, every product sorted into Scale / Untapped / Drain / Inactive. The standout chart."
            />
          </div>
        </Container>
      </section>

      {/* ===== 07 · THE ORCHESTRATION THREAD (UI) ======================== */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>The orchestration thread</Eyebrow>
          <SectionHeader>
            Making &ldquo;an AI is thinking for 8 seconds&rdquo; feel like
            progress, not a spinner.
          </SectionHeader>
          <Prose className="mt-12">
            <p>
              When a lead agent recruits specialists and runs a multi-step Arc,
              a lot happens that the user can&rsquo;t see. The design job was to
              make that legible without burying them in logs.
            </p>
          </Prose>

          <ul className="mt-12 max-w-3xl space-y-4 text-[16px] leading-[1.7] md:text-[17px]">
            <Bullet>
              <strong className="font-semibold text-[#0a0a0a]">
                Reasoning states
              </strong>{" "}
              <span className="text-[#525252]">
                (&ldquo;Thoughts for 8s&rdquo;) that show the system working,
                not stalling
              </span>
            </Bullet>
            <Bullet>
              <strong className="font-semibold text-[#0a0a0a]">
                Agents joining the thread
              </strong>{" "}
              <span className="text-[#525252]">
                visibly &mdash; you watch Gavin pull Monica in, so the team
                assembles around your request in front of you
              </span>
            </Bullet>
            <Bullet>
              <strong className="font-semibold text-[#0a0a0a]">Arcs</strong>{" "}
              <span className="text-[#525252]">
                that expose the multi-step plan as it runs, not just the final
                output
              </span>
            </Bullet>
            <Bullet>
              <strong className="font-semibold text-[#0a0a0a]">
                Completion notifications
              </strong>{" "}
              <span className="text-[#525252]">
                for long-latency work, so hours-long jobs don&rsquo;t force
                users to sit and wait
              </span>
            </Bullet>
          </ul>

          <Prose className="mt-14">
            <p>
              Every state &mdash; empty, loading, error, success &mdash; is
              designed, because an AI team that occasionally fails silently
              isn&rsquo;t trustworthy. Trust was the whole product.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              name="Arc Execution"
              description="A multi-step Arc in flight — the plan, the current step, what's pending, who's working on what. Designed so an hour-long run reads as progress, not a spinner."
            />
          </div>
        </Container>
      </section>

      {/* ===== 08 · DARK SYSTEM SECTION ================================== */}
      <section className="reveal bg-[#0a0a0a] py-32 md:py-44">
        <Container>
          <Eyebrow dark>The system</Eyebrow>
          <SectionHeader dark>Goal in. Output out.</SectionHeader>

          <div className="mt-20 flex flex-col items-center text-center md:mt-28">
            {[
              {
                label: "Goal",
                copy: "You state what needs to happen, in plain language.",
              },
              {
                label: "Lead Agent",
                copy: "Reads the goal, decides which specialists are needed, and opens one thread.",
              },
              {
                label: "Specialists",
                copy: "Each owns a function. They join the thread and contribute what only they can.",
              },
              {
                label: "Arc",
                copy: "A multi-step plan executes — visible as it runs, not just at the end.",
              },
              {
                label: "Output",
                copy: "The result lands back in front of you, with a record of how it got there.",
              },
            ].map((node, i, arr) => (
              <div key={node.label} className="flex w-full flex-col items-center">
                <div>
                  <div className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/45">
                    {`Step ${String(i + 1).padStart(2, "0")}`}
                  </div>
                  <p className="mt-4 text-3xl font-black uppercase tracking-tight text-white md:text-5xl">
                    {node.label}
                  </p>
                  <p className="mx-auto mt-4 max-w-md text-[15px] leading-[1.65] text-white/55 md:text-[16px]">
                    {node.copy}
                  </p>
                </div>
                {i < arr.length - 1 ? (
                  <div
                    aria-hidden="true"
                    className="my-12 h-16 w-px bg-white/20 md:my-16"
                  />
                ) : null}
              </div>
            ))}
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
              ShopOS is live with real enterprise clients &mdash; eight agents
              actively running real store work today. I designed the system
              end-to-end and built the frontend in React: the full surface
              across onboarding, agent setup and customization, the Jobs/Kanban
              board, Mission Control, Cowork, and the multi-agent conversation,
              with every empty / loading / error / success state built out to
              near-production fidelity.
            </p>
          </Prose>

          <div className="mt-16 md:mt-20">
            <Placeholder
              name="Notifications"
              description="The completion + attention surface — long-running jobs land here when they're done, attention-needed items surface here when the team can't move without you."
            />
          </div>
        </Container>
      </section>

      {/* ===== 10 · REFLECTION (2×2 editorial) =========================== */}
      <section className="reveal py-32 md:py-44">
        <Container>
          <Eyebrow>Reflection</Eyebrow>
          <SectionHeader>What I learned building an AI workforce.</SectionHeader>

          <div className="mt-20 grid grid-cols-1 gap-x-12 gap-y-20 md:mt-28 md:grid-cols-2 md:gap-y-24">
            <article>
              <h3 className="text-2xl font-black uppercase leading-[1.1] tracking-tight text-[#0a0a0a] md:text-3xl">
                The interface problem was an org problem.
              </h3>
              <p className="mt-6 text-[17px] leading-[1.7] text-[#525252] md:text-[18px]">
                I came in expecting to design chat. The real work was designing{" "}
                <em>hierarchy you can see</em> &mdash; who manages whom,
                who&rsquo;s working right now, what needs you. The product only
                clicked once the team felt like a team.
              </p>
            </article>
            <article>
              <h3 className="text-2xl font-black uppercase leading-[1.1] tracking-tight text-[#0a0a0a] md:text-3xl">
                Comprehension can outrank elegance.
              </h3>
              <p className="mt-6 text-[17px] leading-[1.7] text-[#525252] md:text-[18px]">
                The bracketed view taught me to separate &ldquo;the design
                I&rsquo;m proudest of&rdquo; from &ldquo;the design that
                works.&rdquo; Sometimes the slightly-too-literal solution is the
                one that lets a user understand a brand-new mental model in five
                seconds. I&rsquo;d refine it, not remove it.
              </p>
            </article>
            <article>
              <h3 className="text-2xl font-black uppercase leading-[1.1] tracking-tight text-[#0a0a0a] md:text-3xl">
                Designing trust is mostly designing the unhappy path.
              </h3>
              <p className="mt-6 text-[17px] leading-[1.7] text-[#525252] md:text-[18px]">
                Anyone can design the success screen. With autonomous agents
                running for hours, the empty states, the failures, and the
                &ldquo;here&rsquo;s what I&rsquo;m doing right now&rdquo;
                moments are where trust is actually won or lost.
              </p>
            </article>
            <article>
              <h3 className="text-2xl font-black uppercase leading-[1.1] tracking-tight text-[#0a0a0a] md:text-3xl">
                Building it made me a better designer of it.
              </h3>
              <p className="mt-6 text-[17px] leading-[1.7] text-[#525252] md:text-[18px]">
                Shipping the React myself meant every interaction state I
                designed, I also had to make real. No handing off a happy-path
                mock and hoping. That loop &mdash; design it, build it, feel
                where it breaks &mdash; is the way I want to keep working.
              </p>
            </article>
          </div>
        </Container>
      </section>

      {/* ===== 11 · PROOF (dark card, 4-up stat row) ===================== */}
      <section className="reveal pb-32 pt-12 md:pb-44 md:pt-16">
        <Container>
          <div className="rounded-3xl bg-[#0a0a0a] px-8 py-16 text-white md:px-14 md:py-20">
            <div className="flex flex-wrap items-baseline justify-between gap-6">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/55">
                  By the numbers
                </p>
                <h2 className="mt-4 text-3xl font-black uppercase tracking-tight md:text-4xl">
                  Proof
                </h2>
              </div>
              <p className="max-w-sm text-[14px] leading-[1.55] text-white/55">
                Data pending — three slots stubbed until I have real numbers in
                hand.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-y-12 gap-x-8 md:mt-20 md:grid-cols-4">
              {[
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
                {
                  value: "8",
                  label: "Agents live with real enterprise clients",
                  pending: false,
                },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-5xl font-black leading-none tracking-tight md:text-6xl">
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
          </div>
        </Container>
      </section>

      {/* ===== 12 · TESTIMONIAL (placeholder) ============================ */}
      <section className="reveal pb-32 md:pb-44">
        <Container>
          <div className="rounded-3xl border border-[#E5E5E5] bg-white px-8 py-14 md:px-14 md:py-20">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#0d8a8a]">
              Testimonial
            </p>
            <blockquote
              className="mt-8 max-w-3xl text-[28px] font-medium italic leading-[1.3] text-[#0a0a0a] md:text-[36px]"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              &ldquo;[ One real line from a brand using ShopOS &mdash;
              anonymized is fine. The kind of quote that proves the team feels
              like a team. ]&rdquo;
            </blockquote>
            <div className="mt-10 flex items-center gap-4">
              <div
                aria-hidden="true"
                className="h-12 w-12 flex-shrink-0 rounded-full bg-[#E5E5E5]"
              />
              <div>
                <div className="text-[15px] font-semibold text-[#0a0a0a]">
                  [Name]
                </div>
                <div className="text-[13px] text-[#525252]">
                  [Role · Brand]
                </div>
              </div>
            </div>
            <p className="mt-10 text-[10px] uppercase tracking-[0.18em] text-[#525252]/60">
              ⬚ Quote + attribution pending real client confirmation
            </p>
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
