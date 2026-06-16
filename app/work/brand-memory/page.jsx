// Brand Memory case study stub. Same scaffold as the top of the
// shopos page (cs-scope container, back link, then the editorial
// type stack), pared down so the route exists and the homepage
// link no longer dead-ends. Drop the real case study in here when
// it's ready.

import Link from "next/link";

export const metadata = {
  title: "Brand Memory — Sumedh Kamble",
};

export default function BrandMemoryPage() {
  return (
    <main className="cs-scope min-h-screen bg-white text-[#0a0a0a] antialiased">
      <div className="mx-auto w-full max-w-[1080px] px-6 pt-16 pb-32 md:px-10 md:pt-20 md:pb-40">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-[13px] font-medium text-[#525252] transition-colors hover:text-[#0a0a0a]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
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

        <h1 className="cs-thesis mt-10 max-w-[var(--cs-prose-col)]">
          Brand Memory
        </h1>
        <p className="cs-lede mt-6 max-w-[var(--cs-prose-col)]">
          Case study coming soon.
        </p>
      </div>
    </main>
  );
}
