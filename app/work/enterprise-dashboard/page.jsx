// app/work/enterprise-dashboard/page.jsx
// Enterprise Dashboard case study. Same scaffold as the ShopOS and
// Brand Memory case studies: parallax hero with a wordmark, .cs-scope
// main with the editorial type primitives, the TL;DR table, the "My
// role" block, and the section pattern of eyebrow -> SectionHeader ->
// Lead -> Prose/bullets -> ImageSlot. Content comes from
// case-study-enterprise-dashboard.md; numbers are quoted verbatim.

"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import ChatLauncher from "../../components/ChatLauncher";

// PLACEHOLDER: reusing Mission Control art, swap with Enterprise Dashboard
// exports later. (Same sky bg the /work/shopos hero uses.)
const SKY_SRC = "/images/shopos-hero-sky.png";
// PLACEHOLDER: reusing Mission Control art, swap with Enterprise Dashboard
// exports later. (Same "eight heads" agents thumbnail the /work/shopos
// hero uses.)
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
// muted "Image coming" label, so the rhythm of every visual shows on
// the page without dropping in real assets yet.
function ImageSlot({ caption, src, alt = "", aspect = "video", className = "" }) {
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
          {/* PLACEHOLDER: reusing Mission Control art, swap with Enterprise
              Dashboard exports later. */}
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
          {/* PLACEHOLDER: reusing Mission Control art, swap with Enterprise
              Dashboard exports later. */}
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

      {/* ===== TOP, kicker + H1 + lede =================================== */}
      <Container className="reveal pt-16 md:pt-20">
        <ProseColumn>
          <p className="cs-eyebrow">
            ShopOS &middot; &ldquo;Enterprise Dashboard&rdquo; &middot;
            Product Design + Design Engineering
          </p>
          <h1 className="cs-thesis mt-4">
            From a two-week WhatsApp loop to an eight-day review inside
            the product
          </h1>
          <p className="cs-lede mt-6">
            How enterprise brands stopped rejecting 500 images to redo
            one, and started approving the 499 that were fine.
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
              Batch close time 14 days &rarr; 8 to 9. Roughly 20 to 25
              fewer SKU rejections per 100. 2 of 10 enterprise clients now
              buy credits to self-serve.
            </dd>
          </dl>
        </ProseColumn>
      </Container>

      {/* ===== My role + Team / Tools =================================== */}
      <Container className="reveal pt-16 md:pt-20">
        <ProseColumn>
          <p className="cs-eyebrow">My role</p>
          <p className="cs-body mt-3">
            <em>Owned:</em> product design and the React frontend, end to
            end (design and design engineering, so it ships faster, the
            same dual lens as the Mission Control case study).{" "}
            <em>Co-created:</em> the integration strategy with PM,
            engineering, and the account managers.
          </p>

          <dl
            className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:mt-12 md:grid-cols-3 md:gap-x-10"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {[
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
          <ProseColumn>
            <Eyebrow>The problem</Eyebrow>
            <SectionHeader>The batch lived in a WhatsApp thread.</SectionHeader>
            <Lead>
              An enterprise brand wants a summer collection: 100 to 500
              product images, each SKU placed against a generated
              background.
            </Lead>
            <Prose className="mt-8">
              <p>
                They brief the request to their account manager over
                WhatsApp. ShopOS generates the batch. Then the real work
                starts, and it also happens over WhatsApp: the client
                scrolls the outputs, flags the ones they don&rsquo;t
                like, types out what&rsquo;s wrong, waits, and the
                production team turns it around.
              </p>
              <p>
                The old enterprise dashboard sat next to all of this. It
                could track batches and show you what got generated. What
                it couldn&rsquo;t do was let you act on any of it. There
                was no way to compare a generated image against the
                garment it came from. No way to leave feedback where the
                work actually lived. And one rule made everything else
                worse: approval was all or nothing.
              </p>
              <p>
                Reject a single SKU and the entire batch went back to
                redo. Out of 500 images you could love 499 and lose all
                of them over one. For batches that already took two weeks
                to close, that was the most expensive button in the
                product.
              </p>
            </Prose>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Before: batches were briefed, reviewed, and rejected in a WhatsApp thread, with all-or-nothing approval." />
          </div>
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
            <Lead>
              As a standalone tool it could only make review faster. It
              could never make a batch better, because it had no access to
              the one thing that would: the brand&rsquo;s own context.
            </Lead>
            <Prose className="mt-8">
              <p>
                So the decision wasn&rsquo;t to redesign the dashboard. It
                was to fold it into ShopOS. Once an enterprise account
                lives inside the product, its Brand Memory, the voice,
                palette, rules, and past decisions, gets set up at
                onboarding and compounds with every batch. I called this{" "}
                <strong>Compounding Context</strong>: in a standalone
                tool, every batch starts from zero; integrated, each one
                starts smarter than the last. Better inputs make better
                outputs, and better outputs mean there is less to reject
                in the first place.
              </p>
              <p>
                Integration also unlocked things a separate dashboard
                structurally never could. Brands could create a batch
                inside the product instead of texting an AM. They could
                reach past the single lifestyle style the old dashboard
                allowed into the full range of Spaces, with far more batch
                types and variations. And they could spend enterprise
                credits on work of their own. The review fix was the
                visible part. The integration was the leverage.
              </p>
            </Prose>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Compounding Context: integrated into ShopOS, each batch starts from the brand's memory instead of from zero." />
          </div>
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
            <Lead>
              All-or-nothing approval treated a 500-SKU batch as a single
              object. But a brand doesn&rsquo;t experience a batch that
              way. They experience 500 individual calls.
            </Lead>
            <Prose className="mt-8">
              <p>
                So I decoupled the SKU from the batch. Approve the ones
                that work and download them now; only the rejected SKUs go
                back to refine. The batch stops being atomic. One bad
                image costs you one regeneration, not 499.
              </p>
              <p>
                This sounds small and it reshaped the entire state model.
                Every SKU now carries its own status, ready, approved,
                rejected, or refining, the batch becomes the sum of them,
                and the interface had to make that legible at a glance
                without drowning the operator in states. The variant rail
                tracks each SKU with a green or red dot; the batch view
                rolls them up.
              </p>
            </Prose>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Per-SKU approval: each SKU carries its own status (ready, approved, rejected, refining); the batch is the sum of them." />
          </div>
        </Container>
      </section>

      {/* ===== 04 · In-product review =================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>In-product review</Eyebrow>
            <SectionHeader>Moving the feedback out of WhatsApp.</SectionHeader>
            <Lead>
              &ldquo;The print is off and the color isn&rsquo;t right&rdquo;
              used to be a typed message with no image attached to it. I
              brought it into the product as two things.
            </Lead>
            <Prose className="mt-8">
              <p>
                First, a side-by-side. <strong>View Input</strong> puts
                the original garment image next to the generated output,
                so a reviewer judges the work against its source instead
                of from memory. The old dashboard never showed the input
                at all.
              </p>
              <p>
                Second, <strong>pinpoint annotations</strong>. Drop a
                numbered pin on the exact spot of the image and say
                what&rsquo;s wrong there, with multiple pins per image,
                each one specific. The vague WhatsApp paragraph becomes
                structured, located feedback the production team can act
                on without a single follow-up question. Whole-batch
                rejections follow the same logic with required reasons,
                poor quality, incorrect background, incorrect masking, or
                wrong output format, so &ldquo;redo it&rdquo; is never the
                entire instruction.
              </p>
            </Prose>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Full-screen review: input vs output comparison, an annotation layer with numbered pins, and per-SKU approve and reject." />
          </div>
        </Container>
      </section>

      {/* ===== 05 · What shipped ======================================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>What shipped</Eyebrow>
            <SectionHeader>What shipped.</SectionHeader>
            <Lead>
              All of it built in React and fit into the existing ShopOS
              ecosystem, so it reads as one product rather than a
              bolted-on dashboard.
            </Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>
                A redesigned enterprise home that replaced the old
                jargon-heavy stats with a clean status read: in progress,
                ready for review, approved, rejected
              </Bullet>
              <Bullet>
                A batch view tabbed by SKU state, with both bulk and
                per-SKU actions
              </Bullet>
              <Bullet>
                A full-screen review surface with zoom, the input vs
                output comparison, the annotation layer, and per-SKU
                approve and reject
              </Bullet>
              <Bullet>
                Partial download of the approved SKUs as well as the full
                batch, plus batch creation inside the tool
              </Bullet>
            </ul>
          </ProseColumn>
          <div className="mt-16 md:mt-20">
            <ImageSlot caption="Shipped: enterprise home, batch view tabbed by SKU state, and the full-screen review surface." />
          </div>
        </Container>
      </section>

      {/* ===== 06 · What happened (impact) ============================== */}
      <section className="reveal py-24 md:py-36">
        <Container>
          <ProseColumn>
            <Eyebrow>What happened</Eyebrow>
            <SectionHeader>What happened.</SectionHeader>
            <Lead>
              The numbers below are estimated from structured debriefs
              with the account managers who own these clients, not from
              instrumented analytics. I went to the people closest to the
              work for the most honest read available.
            </Lead>
            <ul className="mt-8 space-y-3">
              <Bullet>
                <strong>Batch close time: 14 days &rarr; 8 to 9 days.</strong>{" "}
                A batch that averaged two weeks to finalize now closes in
                a little over one. Less back-and-forth, faster decisions,
                and outputs that needed less fixing on the production
                side.
              </Bullet>
              <Bullet>
                <strong>Roughly 20 to 25 fewer SKU rejections per 100.</strong>{" "}
                Because Brand Memory was set up at onboarding, outputs came
                back on-brand from the first batch, so there was simply
                less to send back. Compounding Context, showing up as a
                lower reject rate.
              </Bullet>
              <Bullet>
                <strong>2 of 10 enterprise clients now buy credits</strong>{" "}
                to generate on their own, for edits and one-off work
                beyond their batches. A new revenue motion the standalone
                dashboard could never have created, because there was
                nothing else to spend credits on.
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
                Credits pull enterprise clients into Spaces and Cowork,
                more surfaces mean more batches, and more batches mean more
                credits. Two of ten clients have actually entered that
                loop. The motion is real, those two are spending beyond
                their batches, but I designed it as a system and it is
                behaving like an early signal.
              </p>
              <p>
                I still don&rsquo;t know whether the other eight
                haven&rsquo;t converted because of pricing, discovery, or
                simply timing, and the standalone-to-integrated move
                didn&rsquo;t ship with the instrumentation to tell me. If
                I did it again, I&rsquo;d ship the analytics alongside the
                feature, not behind it, so the flywheel could be read
                instead of estimated.
              </p>
            </Prose>
          </ProseColumn>
        </Container>
      </section>

      {/* ===== Closing paragraph + CTA =================================== */}
      <section className="reveal py-20 md:py-28">
        <Container>
          <ProseColumn>
            <Prose>
              <p>
                The enterprise dashboard used to be a window the brand
                looked through. Now it&rsquo;s a room the brand works
                inside, and because it shares walls with the rest of
                ShopOS, every batch they run makes the next one easier.
              </p>
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
