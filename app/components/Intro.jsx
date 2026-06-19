"use client";

import { useEffect, useRef, useState } from "react";

const SESSION_KEY = "sk-intro-shown";

const LINE1 = "imagine a designer that …";
const LINE2 = "why imagine?";

// Per-font tuning: family, body text, italic flag, weight, scale.
const FONTS = [
  { f: "'Poppins'",                t: "why imagine?",      w: 600, s: 1.0  },
  { f: "'Playfair Display'",       t: "why imagine?", i: 1, w: 700, s: 1.0  },
  { f: "'Space Mono'",             t: "why imagine?",      w: 700, s: 0.9  },
  { f: "'Bebas Neue'",             t: "why imagine?",      w: 400, s: 1.0  },
  { f: "'Caveat'",                 t: "why imagine?",      w: 700, s: 1.18 },
  { f: "'DM Serif Display'",       t: "why imagine?", i: 1, w: 400, s: 1.0  },
  { f: "'Tiro Devanagari Hindi'",  t: "व्हाय इमैजिन?",      w: 400, s: 0.78 },
  { f: "'Anton'",                  t: "why imagine?",      w: 400, s: 0.92 },
  { f: "'Pacifico'",               t: "why imagine?",      w: 400, s: 0.98 },
  { f: "'Syne'",                   t: "why imagine?",      w: 800, s: 0.95 },
  { f: "'Archivo Black'",          t: "why imagine?",      w: 400, s: 0.92 },
  { f: "'Unbounded'",              t: "why imagine?",      w: 800, s: 0.86 },
  { f: "'Fraunces'",               t: "why imagine?", i: 1, w: 500, s: 1.02 },
  { f: "'Zilla Slab'",             t: "why imagine?", i: 1, w: 600, s: 1.0  },
  { f: "'Yeseva One'",             t: "why imagine?",      w: 400, s: 1.04 },
  { f: "'Major Mono Display'",     t: "why imagine?",      w: 400, s: 0.72 },
];

// Preload list — hidden spans force the browser to fetch every font up front
// so the morph doesn't stutter while the loop is running.
const PRELOAD = [
  ["Playfair Display", "why imagine?"],
  ["Space Mono", "why imagine?"],
  ["Bebas Neue", "why imagine?"],
  ["Caveat", "why imagine?"],
  ["DM Serif Display", "why imagine?"],
  ["Anton", "why imagine?"],
  ["Pacifico", "why imagine?"],
  ["Syne", "why imagine?"],
  ["Archivo Black", "why imagine?"],
  ["Unbounded", "why imagine?"],
  ["Fraunces", "why imagine?"],
  ["Zilla Slab", "why imagine?"],
  ["Yeseva One", "why imagine?"],
  ["Major Mono Display", "why imagine?"],
  ["Tiro Devanagari Hindi", "व्हाय इमैजिन?"],
];

export default function Intro({ onFinish }) {
  const [show, setShow] = useState(true);

  const introRef = useRef(null);
  const stageRef = useRef(null);
  const zoomRef = useRef(null);
  const typeRef = useRef(null);
  const caretRef = useRef(null);

  const onFinishRef = useRef(onFinish);
  const runIdRef = useRef(0);
  const finishedRef = useRef(false);
  const skipFnRef = useRef(() => {});
  const replayFnRef = useRef(() => {});

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY) === "1"
    ) {
      setShow(false);
      onFinishRef.current?.();
      return;
    }

    const alive = (id) => id === runIdRef.current;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

    function apply(f) {
      const el = typeRef.current;
      if (!el) return;
      el.textContent = f.t;
      el.style.fontFamily = f.f + ", sans-serif";
      el.style.fontStyle = f.i ? "italic" : "normal";
      el.style.fontWeight = String(f.w || 500);
      el.style.transform = `scale(${f.s || 1})`;
    }

    async function typeStr(str, base, id) {
      for (const ch of str) {
        if (!alive(id)) return;
        if (!typeRef.current) return;
        typeRef.current.textContent += ch;
        await sleep(base + Math.random() * 45);
      }
    }

    async function erase(id, speed) {
      while (typeRef.current && typeRef.current.textContent.length) {
        if (!alive(id)) return;
        typeRef.current.textContent = typeRef.current.textContent.slice(0, -1);
        await sleep(speed);
      }
    }

    function notifyDone() {
      if (finishedRef.current) return;
      finishedRef.current = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
      onFinishRef.current?.();
    }

    async function morph(id) {
      const caret = caretRef.current;
      const zoom = zoomRef.current;
      const intro = introRef.current;
      if (!caret || !zoom || !intro) return;

      caret.style.opacity = "0";
      try {
        await document.fonts.ready;
      } catch {}

      // Build per-step delays — each step gets a little snappier than the last.
      const ds = [];
      let dur = 0;
      let d = 150;
      for (let i = 0; i < FONTS.length; i++) {
        ds.push(d);
        dur += d;
        d = Math.max(62, d - 9);
      }

      // Big continuous zoom on the type, decoupled from per-font scale.
      zoom.animate(
        [{ transform: "scale(1)" }, { transform: "scale(24)" }],
        {
          duration: dur + 140,
          easing: "cubic-bezier(.5,0,.82,.35)",
          fill: "forwards",
        }
      );

      for (let i = 0; i < FONTS.length; i++) {
        if (!alive(id)) return;
        apply(FONTS[i]);
        typeRef.current &&
          typeRef.current.animate(
            [{ opacity: 0.4 }, { opacity: 1 }],
            { duration: 80, easing: "ease-out" }
          );
        await sleep(ds[i]);
      }
      if (!alive(id)) return;

      // Cinematic handoff — start the homepage reveal while the overlay fades.
      notifyDone();

      zoom.style.transition = "opacity .4s ease-in";
      zoom.style.opacity = "0";
      intro.style.transition = "opacity .5s ease";
      intro.style.opacity = "0";

      setTimeout(() => {
        if (alive(id)) setShow(false);
      }, 600);
    }

    function resetVisuals() {
      const intro = introRef.current;
      const zoom = zoomRef.current;
      const type = typeRef.current;
      const caret = caretRef.current;
      if (intro) {
        intro.style.transition = "none";
        intro.style.opacity = "1";
        intro.style.pointerEvents = "auto";
      }
      if (zoom) {
        zoom.getAnimations().forEach((a) => a.cancel());
        zoom.style.transition = "none";
        zoom.style.transform = "scale(1)";
        zoom.style.opacity = "1";
      }
      if (type) {
        type.getAnimations().forEach((a) => a.cancel());
        type.style.transition = "none";
        type.style.transform = "scale(1)";
        type.style.opacity = "1";
        type.textContent = "";
        type.style.fontFamily = "'Poppins', sans-serif";
        type.style.fontStyle = "normal";
        type.style.fontWeight = "500";
      }
      if (caret) caret.style.opacity = "1";
    }

    async function run() {
      const id = ++runIdRef.current;
      finishedRef.current = false;
      resetVisuals();

      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        apply({ f: "'Poppins'", t: LINE2, w: 600, s: 1 });
        if (caretRef.current) caretRef.current.style.opacity = "0";
        notifyDone();
        setTimeout(() => {
          if (alive(id)) setShow(false);
        }, 600);
        return;
      }

      try {
        await document.fonts.load("500 1em 'Poppins'");
      } catch {}

      await sleep(550);
      if (!alive(id)) return;
      await typeStr(LINE1, 60, id);
      if (!alive(id)) return;
      await sleep(950);
      if (!alive(id)) return;
      await erase(id, 28);
      if (!alive(id)) return;
      await sleep(180);
      if (!alive(id)) return;
      await typeStr(LINE2, 72, id);
      if (!alive(id)) return;
      await sleep(470);
      if (!alive(id)) return;
      await morph(id);
    }

    function skip() {
      runIdRef.current += 1;
      notifyDone();
      const intro = introRef.current;
      if (intro) {
        intro.style.transition = "opacity .35s ease";
        intro.style.opacity = "0";
      }
      setTimeout(() => setShow(false), 380);
    }

    function replay() {
      // Replay resets the session flag so the page-reveal also re-runs.
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {}
      finishedRef.current = false;
      setShow(true);
      // Defer so the overlay re-mounts before run() touches the refs.
      requestAnimationFrame(() => run());
    }

    skipFnRef.current = skip;
    replayFnRef.current = replay;

    run();

    return () => {
      runIdRef.current += 1;
    };
  }, []);

  if (!show) return null;

  return (
    <div className="intro-overlay" ref={introRef}>
      <div className="intro-stage" ref={stageRef}>
        <span className="intro-zoom" ref={zoomRef}>
          <span className="intro-type" ref={typeRef} />
          <span className="intro-caret" ref={caretRef} />
        </span>
      </div>

      {/* Hidden preloader — forces every Google Font to fetch up front */}
      <div className="intro-pre" aria-hidden="true">
        {PRELOAD.map(([family, text]) => (
          <span key={family} style={{ fontFamily: `'${family}'` }}>
            {text}
          </span>
        ))}
      </div>

      <div className="intro-ui intro-ui--brand">s k © intro</div>
    </div>
  );
}
