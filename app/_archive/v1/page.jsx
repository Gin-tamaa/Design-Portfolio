// ----------------------------------------------------------------------------
// HOMEPAGE BACKUP — checkpoint at first Next.js production push.
// Folders prefixed with "_" are private to Next.js — this file does NOT
// generate a route. To revert: copy the contents below over app/page.jsx.
// ----------------------------------------------------------------------------

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Intro from "./components/Intro";
import Carousel from "./components/Carousel";

export default function Home() {
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <Intro onFinish={() => setRevealed(true)} />
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }}
        animate={
          revealed
            ? { scale: 1, opacity: 1 }
            : { scale: 1.06, opacity: 0 }
        }
        transition={{
          scale: { duration: 1.0, ease: [0.2, 0.7, 0.2, 1] },
          opacity: { duration: 0.55, ease: "easeOut" },
        }}
        style={{ transformOrigin: "center center" }}
      >
        {/* ===== NavBar ====================================================== */}
        <nav
          className="sticky top-0 z-40 bg-white"
          style={{ padding: "18px 80px" }}
        >
          <div
            className="flex h-[44px] w-full items-center justify-between"
            style={{ gap: 16 }}
          >
            <Link
              href="/"
              className="rounded-md px-1.5 py-1 text-[14px] font-medium leading-6 text-[#525252] hover:text-black transition-colors"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              S-K Proto
            </Link>
            <div className="flex items-center" style={{ gap: 12 }}>
              <Link
                href="#about"
                className="rounded-md px-1.5 py-1 text-[14px] font-medium leading-6 text-[#525252] hover:text-black transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                About
              </Link>
              <Link
                href="#contact"
                className="rounded-md px-1.5 py-1 text-[14px] font-medium leading-6 text-[#525252] hover:text-black transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Contact Me
              </Link>
              <Link
                href="#resume"
                className="rounded-md px-1.5 py-1 text-[14px] font-medium leading-6 text-[#525252] hover:text-black transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Resume
              </Link>
            </div>
          </div>
        </nav>

        {/* ===== Hero ======================================================== */}
        <section className="flex h-[720px] w-full items-center justify-center bg-white">
          <div className="flex w-[540px] max-w-[92vw] flex-col" style={{ gap: 24 }}>
            <div className="flex flex-col" style={{ gap: 8 }}>
              <h1
                className="m-0 text-[56px] italic leading-none text-[#0a0a0a]"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 400,
                  letterSpacing: "-0.005em",
                }}
              >
                Here&rsquo;s Sumedh
              </h1>
              <div className="flex items-center" style={{ gap: 8 }}>
                {[
                  "Design",
                  "Front End Dev",
                  "AI Agents",
                  "AI Workflows",
                ].map((label, i, arr) => (
                  <span key={label} className="flex items-center" style={{ gap: 8 }}>
                    <span
                      className="text-[14px] text-[#525252]"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {label}
                    </span>
                    {i < arr.length - 1 && (
                      <span
                        aria-hidden="true"
                        className="inline-block bg-[#d9d9d9]"
                        style={{ width: 4, height: 4 }}
                      />
                    )}
                  </span>
                ))}
              </div>
            </div>
            <p
              className="m-0 text-[12px] leading-normal text-[#525252]"
              style={{
                fontFamily: "'League Spartan', sans-serif",
                fontWeight: 400,
              }}
            >
              brings 6 years of design experience, builds front-ends, ships AI
              workflows, and understands AI agents
            </p>
          </div>
        </section>

        {/* ===== Carousel ==================================================== */}
        <Carousel />
      </motion.div>
    </>
  );
}
