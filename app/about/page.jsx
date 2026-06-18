// About page — single column on the white site canvas, uses the same .cs-scope
// type scale as the ShopOS case study so the editorial voice rhymes.
//
// The Contact section is anchored at #contact so the global nav's
// "Contact" item can deep-link to /about#contact and land cleanly under
// the fixed top bar (scroll-mt offsets the 64px header).

export const metadata = {
  title: "About — Sumedh Kamble",
  description:
    "Senior design engineer working at the intersection of product design and frontend.",
};

const EMAIL = "kamblesumedh39@gmail.com";
const LINKEDIN_URL = "https://www.linkedin.com/in/sumedhux";
const LINKEDIN_LABEL = "linkedin.com/in/sumedhux";

export default function AboutPage() {
  return (
    <main
      className="cs-scope min-h-screen"
      style={{ background: "#ffffff" }}
    >
      <div className="mx-auto w-full max-w-[760px] px-6 py-24 md:px-8 md:py-32">
        {/* Page label */}
        <p className="cs-eyebrow">About</p>

        {/* Headline */}
        <h1 className="cs-section mt-6 max-w-[20ch]">
          Hello, I&rsquo;m Sumedh.
        </h1>

        {/* Intro copy — PLACEHOLDER block. Drop your bio in once it's
            written; the styling is already wired to cs-body so it'll
            inherit the case study's editorial scale. */}
        <div className="cs-prose cs-body mt-12">
          <p
            className="rounded-2xl border border-dashed border-[#0a0a0a]/15 bg-white/40 px-6 py-8 text-[15px] leading-[1.7] text-[#525252]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            <span
              className="block text-[10px] font-medium uppercase tracking-[0.22em] text-[#525252]/80"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              ⬚ Intro copy placeholder
            </span>
            <span className="mt-3 block">
              A short paragraph about Sumedh goes here — what you do, what
              you care about, what you&rsquo;re working on right now. Replace
              this block with the real intro when it&rsquo;s ready.
            </span>
          </p>
        </div>

        {/* Contact — id="contact" so /about#contact lands cleanly.
            scroll-margin-top offsets the 64px fixed nav so the section
            header isn't tucked under the bar after the anchor jump. */}
        <section
          id="contact"
          className="mt-28 md:mt-36"
          style={{ scrollMarginTop: "96px" }}
        >
          <p className="cs-eyebrow">Contact</p>
          <h2 className="cs-section mt-6 max-w-[22ch]">
            The fastest ways to reach me.
          </h2>

          <ul className="mt-12 space-y-8">
            <ContactRow
              kind="Email"
              href={`mailto:${EMAIL}`}
              label={EMAIL}
            />
            <ContactRow
              kind="LinkedIn"
              href={LINKEDIN_URL}
              label={LINKEDIN_LABEL}
              external
            />
          </ul>
        </section>
      </div>
    </main>
  );
}

function ContactRow({ kind, href, label, external = false }) {
  const externalAttrs = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  return (
    <li>
      <a
        href={href}
        {...externalAttrs}
        className="group flex flex-col gap-1"
      >
        <span
          className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#525252]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {kind}
        </span>
        <span
          className="inline-flex items-center gap-2 text-[clamp(20px,2.6vw,28px)] font-medium leading-[1.2] text-[#0a0a0a] transition-colors group-hover:text-[#525252]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <span className="underline-offset-4 group-hover:underline">
            {label}
          </span>
          <span
            aria-hidden="true"
            className="text-[#525252] transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </a>
    </li>
  );
}
