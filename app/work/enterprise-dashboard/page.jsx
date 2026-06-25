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

// PLACEHOLDER: reusing Mission Control hero, swap later. (Same sky bg the
// /work/shopos hero uses.)
const SKY_SRC = "/images/shopos-hero-sky.png";
// PLACEHOLDER: reusing Mission Control hero, swap later. (Same "eight
// heads" agents thumbnail the /work/shopos hero uses.)
const AGENTS_SRC = "/images/agents-hero.png";

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
    <div className="flex gap-4 rounded-2xl border border-[#E5DDD0] bg-white p-5 md:gap-5 md:p-6">
      <span aria-hidden="true" className="mt-[2px] shrink-0 text-[#0d9488]">
        {icon}
      </span>
      <p className="text-[14px] leading-[1.6] text-[#525252] md:text-[15px]">
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

// Challenge card: a centered "key tension" moment, adapted from the reference
// treatment (warning glyph -> eyebrow -> headline) onto the white case-study
// theme — white bg, warm #E5DDD0 hairline, ink headline at the --cs-thesis
// scale, the standard cs-eyebrow. The only new ink is the amber caution
// accent on the glyph.
function ChallengeCard({ label = "The challenge", children }) {
  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-[#E5DDD0] bg-white px-6 py-12 text-center md:px-10 md:py-14">
      {/* amber warning glyph in a soft ring (hand-drawn, same as Bracket) */}
      <span
        aria-hidden="true"
        className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-[#C0851A]/35"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(192,133,26,0.14), rgba(192,133,26,0.02) 70%)",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3.5 L21.5 20 L2.5 20 Z"
            stroke="#C0851A"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M12 9.5 V14"
            stroke="#C0851A"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16.7" r="0.95" fill="#C0851A" />
        </svg>
      </span>

      <p className="cs-eyebrow mt-5">{label}</p>

      <p
        className="mx-auto mt-4 max-w-[620px] text-[#0a0a0a]"
        style={{
          fontFamily: "'Inter', sans-serif",
          fontWeight: 500,
          fontSize: "var(--cs-thesis)",
          lineHeight: 1.35,
          letterSpacing: "-0.01em",
        }}
      >
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
   Page
============================================================================ */

export default function EnterpriseDashboardPage() {
  const heroRef = useRef(null);
  const skyRef = useRef(null);
  const bracketsRef = useRef(null);
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
          {/* PLACEHOLDER: reusing Mission Control hero, swap later. */}
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

        {/* Layer 2: brackets (parallax 0.50), 4 corners */}
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
          {/* PLACEHOLDER: reusing Mission Control hero, swap later. */}
          <img
            src={AGENTS_SRC}
            alt=""
            className="mx-auto block h-auto w-[80vw] max-w-[1145px] select-none"
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
            Enterprise Dashboard &middot; ShopOS &middot; Product Design +
            Design Engineering &middot; 2026
          </p>
          <h1 className="cs-thesis mt-4">
            From a two-week WhatsApp loop to an eight-day review inside the
            product
          </h1>
          <p className="cs-lede mt-6">
            How enterprise brands stopped rejecting 500 images to redo one,
            and started approving the 499 that were fine.
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
              Enterprise brands ran batches of 100 to 500 SKUs, but every
              approval and every &ldquo;this one&rsquo;s wrong&rdquo;
              happened over WhatsApp, and rejecting a single SKU sent the
              whole batch back to redo.
            </dd>

            <dt className="cs-eyebrow md:pt-1">Approach</dt>
            <dd className="cs-body max-w-[var(--cs-prose-col)]">
              Fold the standalone enterprise dashboard into ShopOS, so
              brand context could make batches <em>better</em>, not just
              let people review them <em>faster</em>.
            </dd>

            <dt className="cs-eyebrow md:pt-1">Solution</dt>
            <dd className="cs-body max-w-[var(--cs-prose-col)]">
              Per-SKU approval, in-product input vs output review with
              pinpoint annotations, batch creation inside the tool, and
              Brand Memory set up at onboarding.
            </dd>

            <dt className="cs-eyebrow md:pt-1">Impact</dt>
            <dd className="cs-body max-w-[var(--cs-prose-col)]">
              Batch close 14 days &rarr; 8 to 9. ~20 to 25 fewer SKU
              rejections per 100. 2 of 10 clients now buy credits to
              self-serve.
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
              { k: "My role", v: "User Research, Design, Front End" },
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

      {/* ===== 01 · The problem ========================================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <Eyebrow>The problem</Eyebrow>
          <SectionHeader>The batch lived in a WhatsApp thread.</SectionHeader>

          {/* Two-column editorial block: a short umbrella heading on the left
              (sticky on desktop), the narrative + the three constraint cards
              on the right — same shape as the reference. */}
          <div className="mt-12 grid grid-cols-1 gap-x-16 gap-y-8 md:mt-16 md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]">
            <h3 className="text-[20px] font-semibold leading-snug tracking-[-0.01em] text-[#0a0a0a] md:sticky md:top-28 md:self-start md:text-[22px]">
              Three holes made the work slow.
            </h3>

            <div>
              <Prose>
                <p>
                  An enterprise brand wants a summer collection: 100 to 500
                  product images, each SKU placed against a generated
                  background. They brief the request to their account manager
                  over WhatsApp. ShopOS generates the batch. Then the real
                  work starts, and it also happens over WhatsApp: the client
                  scrolls the outputs, flags the ones they dislike, types out
                  what&rsquo;s wrong, waits.
                </p>
                <p>
                  The old enterprise dashboard sat next to all of this. It
                  could <em>track</em> batches and <em>show</em> you what got
                  generated. It couldn&rsquo;t let you act on any of it.
                </p>
              </Prose>

              <div className="mt-8 space-y-4">
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
          </div>

          <ChallengeCard>
            Out of 500 images you could love 499 and lose all of them over
            one. For batches that already took two weeks to close, that was
            the most expensive button in the product.
          </ChallengeCard>
        </Container>
      </section>

      {/* ===== 02 · The reframe ========================================= */}
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
                more useful read was that its biggest problem lived{" "}
                <em>outside</em> of it.
              </p>
              <p>
                As a standalone tool, the dashboard could only ever make{" "}
                <strong>review</strong> faster. It could never make a batch{" "}
                <strong>better</strong>, because it had no access to the one
                thing that would: the brand&rsquo;s own context. So the
                decision wasn&rsquo;t to redesign it. It was to fold it into
                ShopOS.
              </p>
            </Prose>

            <p className="cs-body mt-10 max-w-[var(--cs-prose-col)]">
              <strong>Compounding Context, the core bet:</strong>
            </p>
            <Contrast
              leftLabel="Standalone"
              left="Every batch starts from zero."
              rightLabel="Integrated"
              right="The brand's Brand Memory (voice, palette, rules, past decisions) is set up at onboarding and compounds with every batch, so each one starts smarter than the last."
            />

            <Prose className="mt-10">
              <p>
                Better inputs make better outputs. Better outputs mean less
                to reject in the first place. The review fix was the visible
                part. The integration was the leverage.
              </p>
            </Prose>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 03 · Per-SKU approval ==================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>Per-SKU approval</Eyebrow>
            <SectionHeader>
              A batch isn&rsquo;t one decision. It&rsquo;s hundreds.
            </SectionHeader>
            <Lead>The decision I&rsquo;d defend hardest.</Lead>
            <Prose className="mt-8">
              <p>
                All-or-nothing approval treated a 500-SKU batch as a single
                object. But a brand doesn&rsquo;t experience a batch that
                way. They experience 500 individual calls. So I decoupled
                the SKU from the batch.
              </p>
            </Prose>

            <Contrast
              leftLabel="Before"
              left={
                <>
                  Reject one SKU &rarr; the whole batch (up to 500) goes back
                  to redo.
                </>
              }
              rightLabel="After"
              right={
                <>
                  Approve and download the SKUs that work <em>now</em>. Only
                  the rejected ones go to refine.
                </>
              }
            />

            <Prose className="mt-10">
              <p>One bad image costs one regeneration, not 499.</p>
              <p>
                It sounds small and it reshaped the entire state model:
                every SKU now carries its own status (ready / approved /
                rejected / refining), the batch becomes the <em>sum</em> of
                them, and the interface had to make that legible at a
                glance. The variant rail tracks each SKU with a green or red
                dot; the batch view rolls them up.
              </p>
            </Prose>

            <FaintMeta className="mt-8">
              Addresses: the all-or-nothing rejection that wasted whole
              batches.
            </FaintMeta>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 04 · In-product review =================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>In-product review</Eyebrow>
            <SectionHeader>
              The feedback was trapped in chat. I built it into the image.
            </SectionHeader>
            <Prose className="mt-8">
              <p>
                The old &ldquo;redo it&rdquo; was a vague paragraph in
                WhatsApp. I replaced it with three things that live on the
                work itself:
              </p>
            </Prose>
            <ul className="mt-6 space-y-3">
              <Bullet>
                <strong>View Input.</strong> The original garment image, side
                by side with the generated output, so a reviewer judges the
                work against its source instead of from memory. The old
                dashboard never showed the input at all.
              </Bullet>
              <Bullet>
                <strong>Pinpoint annotations.</strong> Drop a numbered pin on
                the exact spot and say what&rsquo;s wrong <em>there</em>.
                Multiple pins per image, each one specific. The vague
                paragraph becomes located, structured feedback the
                production team can act on without a follow-up question.
              </Bullet>
              <Bullet>
                <strong>Structured batch rejection.</strong> Whole-batch
                rejections require a reason (poor quality / incorrect
                background / incorrect masking / wrong output format) plus
                written detail, so &ldquo;redo it&rdquo; is never the entire
                instruction.
              </Bullet>
            </ul>

            <FaintMeta className="mt-8">
              Addresses: feedback that lived in chat, detached from the image
              it described.
            </FaintMeta>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 05 · What shipped ======================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>What shipped</Eyebrow>
            <SectionHeader>What shipped.</SectionHeader>
            <ul className="mt-8 space-y-3">
              <Bullet>
                A redesigned enterprise home: the old jargon stats replaced
                with a clean status read (in progress / ready for review /
                approved / rejected).
              </Bullet>
              <Bullet>
                A batch view tabbed by SKU state, with both bulk and per-SKU
                actions.
              </Bullet>
              <Bullet>
                A full-screen review surface: zoom, input vs output
                comparison, the annotation layer, per-SKU approve and reject.
              </Bullet>
              <Bullet>
                Partial download of approved SKUs, plus full-batch download.
              </Bullet>
              <Bullet>
                Batch creation inside the tool, instead of texting an AM.
              </Bullet>
            </ul>
            <Prose className="mt-8">
              <p>
                All built in React and fit into the existing ShopOS
                ecosystem, so it reads as one product, not a bolted-on
                dashboard.
              </p>
            </Prose>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 06 · What happened (impact stat list) ==================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>What happened</Eyebrow>
            <SectionHeader>What happened.</SectionHeader>
            <FaintMeta className="mt-6">
              The numbers below are estimated from structured debriefs with
              the account managers who own these clients, not from
              instrumented analytics. I went to the people closest to the
              work for the most honest read available.
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
                on-brand from the first batch, so there was less to send
                back. Compounding Context, showing up as a lower reject
                rate.
              </Bullet>
              <Bullet>
                <strong>2 of 10 enterprise clients now buy credits</strong>{" "}
                to generate on their own, for edits and one-off work beyond
                batches. A new revenue motion the standalone dashboard could
                never have created, because there was nothing else to spend
                credits on.
              </Bullet>
            </ul>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== 07 · What I'd do differently ============================= */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>What I&rsquo;d do differently</Eyebrow>
            <SectionHeader>I designed a flywheel. Two of ten entered it.</SectionHeader>
            <Prose className="mt-8">
              <p>
                I designed for a flywheel: credits pull enterprise clients
                into Spaces and Cowork, more surfaces mean more batches, more
                batches mean more credits. Two of ten clients have actually
                entered that loop. The motion is real, those two are
                spending beyond their batches, but I designed it as a system
                and it&rsquo;s behaving like an early signal. I still
                don&rsquo;t know whether the other eight haven&rsquo;t
                converted because of pricing, discovery, or simply timing,
                and the move from standalone to integrated didn&rsquo;t ship
                with the instrumentation to tell me. If I did it again,
                I&rsquo;d ship the analytics alongside the feature, not
                behind it, so the flywheel could be read instead of
                estimated.
              </p>
              <p>
                The enterprise dashboard used to be a window the brand looked
                through. Now it&rsquo;s a room the brand works inside, and
                because it shares walls with the rest of ShopOS, every batch
                they run makes the next one easier.
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
