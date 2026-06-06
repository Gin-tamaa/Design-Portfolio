// app/work/shopos/page.jsx
// Case study. Next.js (App Router) + Tailwind.
// Design system ported from the site: Inter, 12px metadata labels (weight 400),
// 12-col grid, font-black uppercase headings, cream #F4F1EA, black ink, hairline rules.
//
// Voice: dual lens —
//   [PD]  Senior Product Designer  → decisions, tradeoffs, the operator's trust
//   [DE]  Senior Design Engineer    → the build was non-trivial; design survived code
//
// Thesis: AI gave brands image generation. Brands wanted the marketing department.
//         generator → department → can you trust the department.
//
// PROOF SLOTS still owed by you are marked  {/* ⬚ TODO */}  — page works without them (9/10),
// filling them makes it a 10. Search "TODO" to find all four.

import Link from "next/link";

/* ----------------------------------------------------------------------------
   Small shared primitives — keep the page editorial and consistent
---------------------------------------------------------------------------- */

const Container = ({ children, className = "" }) => (
  <div className={`mx-auto w-full max-w-[1280px] px-4 ${className}`}>{children}</div>
);

// the metadata label style from your snippet: Inter 12px / 400 / 1.5
const Label = ({ children }) => (
  <p className="m-0 text-[12px] font-normal leading-[1.5] text-black">{children}</p>
);

// section eyebrow — tiny, letterspaced, sits above each big heading
const Eyebrow = ({ n, children }) => (
  <div className="flex items-center gap-3 text-[12px] font-normal tracking-[0.14em] uppercase text-black/40">
    <span className="tabular-nums">{n}</span>
    <span className="h-px w-8 bg-black/20" />
    <span>{children}</span>
  </div>
);

// lens tag — makes the dual read explicit and scannable for a hiring panel
const Lens = ({ kind, children }) => {
  const isDE = kind === "DE";
  return (
    <div className="flex gap-4 border-l border-black/10 pl-5">
      <span
        className={`mt-[3px] shrink-0 select-none rounded-full px-2 py-[2px] text-[10px] font-semibold uppercase tracking-wider ${
          isDE ? "bg-black text-[#F4F1EA]" : "bg-black/5 text-black"
        }`}
      >
        {isDE ? "Design Eng" : "Product Design"}
      </span>
      <p className="max-w-[48ch] text-[15px] leading-[1.6] text-black/70">{children}</p>
    </div>
  );
};

const StatusDot = ({ state }) => {
  const color =
    state === "active" ? "bg-emerald-500" : state === "gated" ? "bg-amber-500" : "bg-black/25";
  return <span className={`inline-block h-[7px] w-[7px] rounded-full ${color}`} />;
};

/* ----------------------------------------------------------------------------
   PAGE
---------------------------------------------------------------------------- */

export default function ShopOSCaseStudy() {
  return (
    <main className="min-h-screen bg-[#F4F1EA] text-black antialiased">
      {/* ===== 01 · HERO ===================================================== */}
      <Container className="pt-28 md:pt-40">
        <p className="text-[12px] font-normal tracking-[0.14em] uppercase text-black/40">
          Case study
        </p>

        <h1 className="mt-6 max-w-[15ch] text-[13vw] font-black uppercase leading-[0.92] tracking-[-0.03em] md:text-[120px]">
          The team,
          <br />
          not the tool
        </h1>

        {/* thesis / deck */}
        <p className="mt-8 max-w-[60ch] text-[18px] leading-[1.55] text-black/70 md:text-[22px]">
          Everyone shipped the same thing: a prompt box that returns an image. A{" "}
          <em className="not-italic underline decoration-black/20 underline-offset-4">generator</em>.
          Brands didn&rsquo;t want a generator. They wanted the marketing department that uses
          one. ShopOS is the leap from a tool you operate to a team that operates itself — and the
          design problem that leap creates.
        </p>
      </Container>

      {/* ===== METADATA STRIP (your snippet, in Tailwind) =================== */}
      <Container className="pt-40 md:pt-52">
        <div className="grid grid-cols-1 gap-2 border-t border-black/10 pt-5 md:grid-cols-12">
          <div className="flex gap-[14px] md:col-span-4">
            <Label>ShopOS</Label>
            <Label>Founding Product Designer</Label>
          </div>
          <div className="hidden md:col-span-4 md:block" />
          <div className="flex justify-between md:col-span-4">
            <Label>Product Design, Frontend Engineering</Label>
            <Label>Mar 2026&mdash;Present</Label>
          </div>
        </div>
      </Container>

      {/* ===== 02 · THE SHIFT =============================================== */}
      <section className="pt-40 md:pt-56">
        <Container>
          <Eyebrow n="02">The shift</Eyebrow>
          <h2 className="mt-6 max-w-[20ch] text-4xl font-black uppercase leading-[1.0] tracking-tight md:text-6xl">
            A generator answers one question. A brand has eight.
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-16 gap-y-10 md:grid-cols-2">
            <p className="max-w-[52ch] text-[17px] leading-[1.7] text-black/70">
              Hand a brand owner a freshly generated ad and watch what happens next. They don&rsquo;t
              say thank you. They ask: <span className="text-black">who runs it?</span> Who reads the
              ROAS? Who notices when it fatigues and makes the next one? Who writes the email off the
              same campaign? Who tells me if a competitor just undercut us?
            </p>
            <p className="max-w-[52ch] text-[17px] leading-[1.7] text-black/70">
              A generator can&rsquo;t answer any of them. The image was never the product — it was
              one output of a department that doesn&rsquo;t exist yet. So we built the department:
              eight named agents, each owning a function a real marketing team owns, working off
              shared brand memory and handing off to one another.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            <Lens kind="PD">
              The reframe was the whole job. &ldquo;Better image generation&rdquo; is a feature race
              you lose on model quality. &ldquo;The marketing department, as agents&rdquo; is a
              category — and it turns the design problem from <em className="not-italic">prompt → image</em>{" "}
              into <em className="not-italic">org → outcomes</em>, which no one had a UI language for.
            </Lens>
            <Lens kind="DE">
              That reframe is also a build spec. A generator is a textarea and an image tag. A
              department is persistent agent state, status and scheduling per agent, connector auth,
              cross-agent handoff, and a thread that streams a manager recruiting specialists in real
              time. The hard surface area is orchestration, not generation.
            </Lens>
          </div>
        </Container>
      </section>

      {/* ===== 03 · THE ROSTER ============================================= */}
      <section className="pt-40 md:pt-56">
        <Container>
          <Eyebrow n="03">The roster</Eyebrow>
          <h2 className="mt-6 max-w-[24ch] text-4xl font-black uppercase leading-[1.0] tracking-tight md:text-6xl">
            Eight agents. Two shapes.
          </h2>
          <p className="mt-8 max-w-[60ch] text-[17px] leading-[1.7] text-black/70">
            A department is legible because roles are. Five agents are{" "}
            <span className="text-black">operators</span> — they hold connectors and take action.
            Three are <span className="text-black">analysts</span> — zero connectors, they only make
            the others smarter. The shape of an agent tells you what it can do before you read a word.
          </p>

          {/* roster table */}
          <div className="mt-12 overflow-hidden rounded-xl border border-black/10 bg-white/40">
            <div className="grid grid-cols-12 gap-2 border-b border-black/10 px-5 py-3 text-[11px] uppercase tracking-wider text-black/40">
              <div className="col-span-4 md:col-span-3">Agent</div>
              <div className="col-span-5 md:col-span-4">Function</div>
              <div className="hidden md:col-span-3 md:block">Shape</div>
              <div className="col-span-3 md:col-span-2 text-right md:text-left">Status</div>
            </div>
            {[
              ["Big Head", "GEO Optimizer", "Analyst", "active"],
              ["Erlich", "Social & Content", "Operator", "paused"],
              ["Jian-Yang", "Brand Intelligence", "Analyst", "paused"],
              ["Gavin", "Performance Marketing", "Operator", "active"],
              ["Monica", "Creative Director", "Operator", "active"],
              ["Dinesh", "Email & CRM", "Operator", "paused"],
              ["Russ", "Finance & Growth", "Operator", "paused"],
              ["Richard", "Shopify Store Manager", "Operator", "gated"],
            ].map(([name, fn, shape, state]) => (
              <div
                key={name}
                className="grid grid-cols-12 items-center gap-2 border-b border-black/5 px-5 py-3.5 text-[14px] last:border-0"
              >
                <div className="col-span-4 font-semibold md:col-span-3">{name}</div>
                <div className="col-span-5 text-black/70 md:col-span-4">{fn}</div>
                <div className="hidden text-black/50 md:col-span-3 md:block">{shape}</div>
                <div className="col-span-3 flex items-center justify-end gap-2 text-black/50 md:col-span-2 md:justify-start">
                  <StatusDot state={state} />
                  <span className="text-[12px] capitalize">{state}</span>
                </div>
              </div>
            ))}
          </div>

          {/* soul.md — personality as a product surface */}
          <h3 className="mt-20 text-2xl font-black uppercase tracking-tight md:text-3xl">
            Personality is a product surface
          </h3>
          <p className="mt-5 max-w-[60ch] text-[17px] leading-[1.7] text-black/70">
            Every agent ships with an editable <code className="rounded bg-black/5 px-1.5 py-0.5 text-[14px]">soul.md</code>{" "}
            — its operating personality, exposed and editable, not buried in a hidden system prompt.
            The brand owner can read it, trust it, and change it. The voices are deliberately
            different:
          </p>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              ["Gavin", "Performance", "Talk in numbers. Every observation is a metric and a delta. If it can't be measured, don't say it. When creative fatigues, say so plainly — and brief the Creative Director."],
              ["Monica", "Creative", "You have opinions. Don't ask for a brief if you have performance data — generate from the signal. Every output links to a hypothesis. If a brief is weak, say so. Then write a better one."],
              ["Jian-Yang", "Brand Intel", "Surface facts, don't spin them. Use the exact language customers use. Feed findings to Monica and Gavin automatically. Don't hoard intelligence. Make the team smarter — not reports."],
            ].map(([name, role, soul]) => (
              <figure key={name} className="rounded-xl border border-black/10 bg-black/[0.03] p-5">
                <figcaption className="mb-3 flex items-baseline justify-between">
                  <span className="font-semibold">{name}</span>
                  <span className="text-[11px] uppercase tracking-wider text-black/40">{role}</span>
                </figcaption>
                <p className="font-mono text-[13px] leading-[1.7] text-black/75">&ldquo;{soul}&rdquo;</p>
              </figure>
            ))}
          </div>

          <div className="mt-12 space-y-6">
            <Lens kind="PD">
              Exposing <code className="text-[13px]">soul.md</code> is a trust decision. A black-box
              agent asks for blind faith; an editable personality you can read and rewrite turns the
              agent into something a non-technical owner can actually direct and feel ownership over.
            </Lens>
            <Lens kind="DE">
              Each agent is its own interactive surface — entity, status toggle (active/paused
              gates scheduled jobs), connector auth states, a job list, and the live
              <code className="mx-1 text-[13px]">soul.md</code> editor. One agent built as a
              configurable template; eight instances differ only by data.
            </Lens>
          </div>
        </Container>
      </section>

      {/* ===== 04 · ORCHESTRATION GRAPH — centerpiece ====================== */}
      <section className="pt-40 md:pt-56">
        <Container>
          <Eyebrow n="04">The orchestration graph</Eyebrow>
          <h2 className="mt-6 max-w-[22ch] text-4xl font-black uppercase leading-[1.0] tracking-tight md:text-6xl">
            The team hands off to itself
          </h2>
          <p className="mt-8 max-w-[60ch] text-[17px] leading-[1.7] text-black/70">
            This is the thing a generator structurally cannot do. Intelligence feeds the people who
            act on it; performance briefs creative; creative briefs the human. The handoffs are real
            and written into each agent&rsquo;s soul — not a diagram I drew after the fact.
          </p>
        </Container>

        {/* loud moment #1 — scalable viewBox SVG so it stays crisp + responsive */}
        <Container className="mt-14">
          <div className="rounded-2xl border border-black/10 bg-white/50 p-4 md:p-10">
            <svg viewBox="0 0 1000 420" className="w-full" role="img"
                 aria-label="Orchestration graph: Jian-Yang feeds Monica and Gavin; Gavin briefs Monica; Monica briefs the human.">
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" fill="#111" />
                </marker>
              </defs>

              {/* edges (drawn first, behind nodes) */}
              <g stroke="#111" strokeWidth="1.5" fill="none" markerEnd="url(#arrow)">
                {/* Jian-Yang -> Gavin */}
                <path d="M250,120 C420,120 430,120 600,120" />
                {/* Jian-Yang -> Monica */}
                <path d="M250,150 C420,230 430,300 600,300" />
                {/* Gavin -> Monica (fatigue brief) */}
                <path d="M700,165 C700,230 700,235 700,255" />
                {/* Monica -> Human */}
                <path d="M810,300 C880,300 880,300 920,300" />
              </g>

              {/* edge labels */}
              <g fontFamily="ui-monospace, monospace" fontSize="12" fill="#6b6b66">
                <text x="360" y="108">feeds intel</text>
                <text x="330" y="250">feeds intel</text>
                <text x="712" y="225">fatigue brief</text>
                <text x="828" y="288">review</text>
              </g>

              {/* nodes */}
              {/* Jian-Yang */}
              <g>
                <rect x="60" y="95" width="190" height="60" rx="10" fill="#fff" stroke="#111" strokeWidth="1.5" />
                <text x="78" y="122" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="700" fill="#111">Jian-Yang</text>
                <text x="78" y="142" fontFamily="Inter, sans-serif" fontSize="12" fill="#6b6b66">Brand Intelligence · analyst</text>
              </g>
              {/* Gavin */}
              <g>
                <rect x="600" y="90" width="200" height="60" rx="10" fill="#fff" stroke="#111" strokeWidth="1.5" />
                <text x="618" y="117" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="700" fill="#111">Gavin</text>
                <text x="618" y="137" fontFamily="Inter, sans-serif" fontSize="12" fill="#6b6b66">Performance · operator</text>
              </g>
              {/* Monica */}
              <g>
                <rect x="600" y="270" width="210" height="60" rx="10" fill="#111" />
                <text x="618" y="297" fontFamily="Inter, sans-serif" fontSize="16" fontWeight="700" fill="#F4F1EA">Monica</text>
                <text x="618" y="317" fontFamily="Inter, sans-serif" fontSize="12" fill="#cfcfca">Creative Director · operator</text>
              </g>
              {/* Human */}
              <g>
                <rect x="920" y="272" width="74" height="56" rx="10" fill="none" stroke="#111" strokeWidth="1.5" strokeDasharray="4 4" />
                <text x="935" y="305" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="600" fill="#111">Human</text>
              </g>
            </svg>
          </div>
        </Container>

        <Container className="mt-12">
          <div className="space-y-6">
            <Lens kind="PD">
              Most &ldquo;multi-agent&rdquo; products are a dropdown of bots that never talk. The
              design bet here was to make the handoff the visible center of the product, so the owner
              sees a team working — not a tool rack. That&rsquo;s what earns the word
              &ldquo;department.&rdquo;
            </Lens>
            <Lens kind="DE">
              The orchestration UI was the hardest build: a manager recruiting specialists into one
              thread, live reasoning states (&ldquo;Thoughts for 8s&rdquo;), streamed multi-step
              runs, and a conversation model where authorship switches between agents mid-thread.
              No off-the-shelf chat pattern covers it — it was designed and built from primitives.
            </Lens>
          </div>
        </Container>
      </section>

      {/* ===== 05 · TRUST SPECTRUM — design maturity ====================== */}
      <section className="pt-40 md:pt-56">
        <Container>
          <Eyebrow n="05">The trust spectrum</Eyebrow>
          <h2 className="mt-6 max-w-[24ch] text-4xl font-black uppercase leading-[1.0] tracking-tight md:text-6xl">
            Autonomy is earned by reversibility
          </h2>
          <p className="mt-8 max-w-[62ch] text-[17px] leading-[1.7] text-black/70">
            An agent that can spend money or change a live storefront is not the same risk as one
            that reads Reddit. So autonomy isn&rsquo;t a global setting — it&rsquo;s tuned per agent,
            tracking how reversible its actions are. The closer an agent gets to irreversible public
            action, the harder it&rsquo;s gated.
          </p>
        </Container>

        {/* loud moment #2 — autonomy axis */}
        <Container className="mt-16">
          <div className="rounded-2xl border border-black/10 bg-white/50 p-6 md:p-12">
            <div className="mb-10 flex justify-between text-[12px] uppercase tracking-wider text-black/40">
              <span>Hard-gated · asks first</span>
              <span>Autonomous · fires on threshold</span>
            </div>

            <div className="relative h-px w-full bg-black/15">
              {/* ticks */}
              {[0, 25, 50, 75, 100].map((p) => (
                <span key={p} className="absolute top-[-3px] h-[7px] w-px bg-black/20" style={{ left: `${p}%` }} />
              ))}

              {/* agent chips placed by autonomy */}
              {[
                { name: "Richard", note: "never edits live store w/o approval", pos: 6, state: "gated" },
                { name: "Big Head", note: "never auto-runs unless asked", pos: 20, state: "active" },
                { name: "Monica", note: "drafts, human reviews", pos: 48, state: "active" },
                { name: "Dinesh", note: "drafts copy + flows", pos: 58, state: "paused" },
                { name: "Gavin", note: "auto-fires fatigue brief", pos: 84, state: "active" },
                { name: "Russ", note: "auto-fires scaling brief", pos: 94, state: "paused" },
              ].map((a, i) => (
                <div
                  key={a.name}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${a.pos}%`, top: i % 2 === 0 ? "14px" : "-92px" }}
                >
                  <div className="flex flex-col items-center">
                    <span className="h-2 w-2 rounded-full bg-black" />
                    <div className={`mt-2 w-[120px] rounded-lg border border-black/10 bg-white p-2 text-center ${i % 2 === 0 ? "" : "order-first mb-2 mt-0"}`}>
                      <div className="flex items-center justify-center gap-1.5 text-[13px] font-semibold">
                        <StatusDot state={a.state} />
                        {a.name}
                      </div>
                      <div className="mt-0.5 text-[10.5px] leading-tight text-black/50">{a.note}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="h-24" /> {/* spacer so chips don't clip on mobile */}
          </div>
        </Container>

        <Container className="mt-12">
          <div className="space-y-6">
            <Lens kind="PD">
              This is the part that says I thought about consequences, not just features. Trust in an
              autonomous product isn&rsquo;t a toggle you bolt on at the end — it&rsquo;s a spectrum
              you design into each role from the start, anchored to what happens if the agent is
              wrong.
            </Lens>
            <Lens kind="DE">
              In the UI this is a per-agent autonomy threshold plus approval gates on
              irreversible actions — publish, spend, edit-live. The same component renders an
              auto-run agent and a draft-only agent; the gate is configuration, enforced in the
              action layer, not a different screen.
            </Lens>
          </div>
        </Container>
      </section>

      {/* ===== 06 · PROOF (the 9→10 inputs) ================================ */}
      <section className="pt-40 md:pt-56">
        <Container>
          <Eyebrow n="06">Proof</Eyebrow>
          <h2 className="mt-6 text-4xl font-black uppercase leading-[1.0] tracking-tight md:text-6xl">
            What it actually moved
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* ⬚ TODO #1 — before → after (specialist hours → agent minutes) */}
            <div className="rounded-xl border border-dashed border-black/25 bg-black/[0.02] p-7">
              <p className="text-[11px] uppercase tracking-wider text-black/40">Before → after</p>
              <p className="mt-3 text-[28px] font-black leading-tight text-black/30 md:text-[34px]">
                [ specialist hours&nbsp;→&nbsp;agent minutes ]
              </p>
              <p className="mt-2 text-[13px] text-black/40">⬚ TODO: one real before/after you witnessed.</p>
            </div>

            {/* ⬚ TODO #2 — one metric moved */}
            <div className="rounded-xl border border-dashed border-black/25 bg-black/[0.02] p-7">
              <p className="text-[11px] uppercase tracking-wider text-black/40">Metric moved</p>
              <p className="mt-3 text-[28px] font-black leading-tight text-black/30 md:text-[34px]">
                [ +__% / __→__ ]
              </p>
              <p className="mt-2 text-[13px] text-black/40">⬚ TODO: one number that changed (ROAS, time-to-ship, etc.).</p>
            </div>
          </div>

          {/* ⬚ TODO #3 — client quote */}
          <figure className="mt-5 rounded-xl border border-dashed border-black/25 bg-black/[0.02] p-7">
            <blockquote className="text-[22px] font-medium leading-[1.5] text-black/30 md:text-[26px]">
              &ldquo;[ one real line from a brand using it — anonymized is fine ]&rdquo;
            </blockquote>
            <figcaption className="mt-3 text-[13px] text-black/40">⬚ TODO: client quote + role/brand or anonymized label.</figcaption>
          </figure>

          <p className="mt-6 max-w-[60ch] text-[15px] leading-[1.6] text-black/50">
            ShopOS is live with real enterprise brands; several agents (Gavin, Monica, Big Head) are
            active in production today. Designed and built end-to-end by one person.
          </p>
        </Container>
      </section>

      {/* ===== 07 · TRADEOFF ============================================== */}
      <section className="pt-40 md:pt-56">
        <Container>
          <Eyebrow n="07">The honest tradeoff</Eyebrow>
          {/* ⬚ TODO #4 — one real thing that got harder/worse because of this approach */}
          <h2 className="mt-6 max-w-[26ch] text-3xl font-black uppercase leading-[1.05] tracking-tight md:text-5xl text-black/30">
            [ one real thing that&rsquo;s harder because it&rsquo;s a team, not a tool ]
          </h2>
          <p className="mt-6 max-w-[58ch] text-[16px] leading-[1.7] text-black/40">
            ⬚ TODO: e.g. legibility cost (more surface to learn than a prompt box), or onboarding
            friction (connectors + souls before value), or the orchestration latency tradeoff. Pick
            the truest one and say what you&rsquo;d change next.
          </p>
        </Container>
      </section>

      {/* ===== 08 · CLOSE ================================================= */}
      <section className="pt-40 pb-32 md:pt-56">
        <Container>
          <div className="border-t border-black/10 pt-10">
            <p className="max-w-[44ch] text-[20px] font-medium leading-[1.5] md:text-[24px]">
              Designed the product and built the frontend — the roster, the orchestration thread,
              the trust model, all of it.
            </p>
            <Link
              href="/work"
              className="mt-8 inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 text-[14px] font-medium transition-colors hover:bg-black hover:text-[#F4F1EA]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All work
            </Link>
          </div>
        </Container>
      </section>
    </main>
  );
}
