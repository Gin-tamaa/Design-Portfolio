"use client";

// Full-screen chat for a case study. Empty state shows the four voices +
// routing-showoff prompts. After the first message the conversation takes
// over. Token-by-token streaming is simulated client-side from the full
// /api/chat response so we don't change the existing API contract.
//
// Bubble motion: user bubble springs from input, assistant bubble springs in
// after a routed handoff chip (avatar + persona color + domain).
// Near-bottom auto-scroll, stop-to-abort, 20/session cap, contact CTA on cap.
// Reduced motion: all springs collapse, everything renders static.

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ChatBox, { ChevronDownIcon } from "./ChatBox";
import ThinkingIndicator from "./ThinkingIndicator";
import AgentAvatar from "./AgentAvatar";

// Two-state 8-bit avatar atlas (Figma 162:1223): every persona has a
// `default` portrait and a `thinking` variant. Default is what shows in
// the chat message header and empty state; the ThinkingIndicator cycles
// between default ↔ thinking so the agent looks alive while it thinks.
// Source PNGs are 18×18 pixel art — render with image-rendering:pixelated
// so they scale up clean at 24/108px without smoothing the pixels away.
const PERSONAS = {
  "creative-head": {
    label: "Creative Head",
    short: "Creative head",
    color: "#7C5CFF",
    avatar: "/images/agents-chat/creative-head.png",
    avatarThinking: "/images/agents-chat/creative-head-thinking.png",
    domain: "design",
  },
  "vibe-coder": {
    label: "Vibe Coder",
    short: "Vibe Coder",
    color: "#3D6BE5",
    avatar: "/images/agents-chat/vibe-coder.png",
    avatarThinking: "/images/agents-chat/vibe-coder-thinking.png",
    domain: "build",
  },
  "ai-tinkerer": {
    label: "AI Tinkerer",
    short: "AI Tinkerer",
    color: "#0E9FB8",
    avatar: "/images/agents-chat/ai-tinkerer.png",
    avatarThinking: "/images/agents-chat/ai-tinkerer-thinking.png",
    domain: "agents",
  },
  "funny-side": {
    label: "Funny Side",
    short: "Funny Side",
    color: "#E0A93B",
    avatar: "/images/agents-chat/funny-side.png",
    avatarThinking: "/images/agents-chat/funny-side-thinking.png",
    domain: "everything else",
  },
};

// Suggested prompts — matches Figma 102:1510 (3 chips, exact text). Icons are
// lucide stroke icons inlined as SVG (shadcn's standard icon set) chosen for
// topical relevance to each prompt.
function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" />
      <path d="M22 5h-4" />
      <path d="M4 17v2" />
      <path d="M5 18H3" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function CopyIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}
function CheckIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

const SUGGESTED_PROMPTS = [
  { text: "Summarise for me", Icon: SparklesIcon },
  { text: "What are the pain points", Icon: TargetIcon },
  { text: "What was the user research", Icon: UsersIcon },
];

const SESSION_CAP = 20;
const CONTACT_EMAIL = "kamblesumedh39@gmail.com";
const STREAM_MS_PER_TICK = 16;
const STREAM_CHARS_PER_TICK = 3;
// Minimum time the persona-flavored thinking indicator is shown. Even when
// the answer arrives faster, we hold the reveal until this floor passes,
// so the team-assemble → handoff → persona beat is never skipped.
const MIN_THINKING = 1200;

/* ---- Avatar (image with initial-circle fallback) ------------------------- */

function Avatar({ src, label, color, size = 96 }) {
  const [failed, setFailed] = useState(false);
  if (failed || !src) {
    return (
      <div
        className="flex items-center justify-center rounded-full font-semibold text-white select-none"
        style={{
          width: size,
          height: size,
          background: color,
          fontSize: Math.round(size * 0.36),
          lineHeight: 1,
        }}
        aria-label={label}
      >
        {label.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={label}
      onError={() => setFailed(true)}
      className="rounded-full object-cover select-none"
      style={{
        width: size,
        height: size,
        background: color,
      }}
      draggable={false}
    />
  );
}

/* ---- Helpers ------------------------------------------------------------- */

function isNearBottom(el, threshold = 96) {
  if (!el) return true;
  return el.scrollHeight - (el.scrollTop + el.clientHeight) <= threshold;
}

/* ---- Component ----------------------------------------------------------- */

export default function CaseStudyChat({ project = "shopos", onClose }) {
  const [messages, setMessages] = useState([]); // {id, role, ...}
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [activePersona, setActivePersona] = useState(null);
  const [asked, setAsked] = useState(0);
  const [hardStopped, setHardStopped] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  // followBottom = "should the view chase the latest message?" Defaults to
  // true, flips false when the user manually scrolls up, flips back to true
  // when they scroll near the bottom OR send a new message.
  const [followBottom, setFollowBottom] = useState(true);

  const scrollRef = useRef(null);
  const streamCancelRef = useRef(null);
  const abortRef = useRef(null);
  const textareaRef = useRef(null);
  // Distinguish OUR scrollTo() calls from a user wheel/touch/key scroll so
  // programmatic scrolls don't accidentally flip followBottom off.
  const programmaticScrollRef = useRef(false);
  const lastScrollTopRef = useRef(0);

  const capped = asked >= SESSION_CAP;
  const disabledForInput = pending || streaming || capped || hardStopped;

  // Programmatic scroll helper — sets the flag, scrolls, clears flag after
  // the browser is done. During streaming we use "auto" (instant) so each
  // tick snaps to the new bottom without the previous smooth scroll lagging.
  const scrollToBottom = useCallback((behavior = "smooth") => {
    const el = scrollRef.current;
    if (!el) return;
    programmaticScrollRef.current = true;
    el.scrollTo({ top: el.scrollHeight, behavior });
    setTimeout(
      () => {
        programmaticScrollRef.current = false;
        lastScrollTopRef.current = el.scrollTop;
      },
      behavior === "smooth" ? 600 : 60
    );
  }, []);

  // Detect user-driven scrolls. Up = pause auto-follow. Back-to-bottom =
  // resume. Ignores our own programmatic scrolls.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (programmaticScrollRef.current) return;
      const top = el.scrollTop;
      const dist = el.scrollHeight - top - el.clientHeight;
      if (top < lastScrollTopRef.current - 4) {
        setFollowBottom(false);
      } else if (dist < 24) {
        setFollowBottom(true);
      }
      lastScrollTopRef.current = top;
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // The scroll-to-bottom chevron mirrors followBottom: visible iff we're NOT
  // currently following the live edge.
  useEffect(() => {
    setShowScrollBtn(!followBottom);
  }, [followBottom]);

  // Auto-follow effect — chase the bottom on every content change, but only
  // when the user is in "follow" mode. Instant scroll during streaming so
  // the smooth-scroll easing doesn't trail behind the rapidly-growing text.
  useEffect(() => {
    if (!followBottom) return;
    scrollToBottom(streaming ? "auto" : "smooth");
  }, [messages, pending, streaming, followBottom, scrollToBottom]);

  // Auto-grow textarea — height tracks content up to 200px, then scrolls
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0px";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  // Auto-focus the composer AFTER the takeover transition completes
  // (~620ms for the opacity fade). Doing this mid-fade would trigger the
  // focus-within border darken + soft glow halfway through the cross-fade,
  // which reads as another visual change. preventScroll keeps the layout
  // anchored even if the browser tries to scroll the input into view.
  useEffect(() => {
    const t = setTimeout(() => {
      textareaRef.current?.focus({ preventScroll: true });
    }, 660);
    return () => clearTimeout(t);
  }, []);

  // Clean up any pending stream / fetch on unmount
  useEffect(() => () => {
    if (streamCancelRef.current) streamCancelRef.current();
    if (abortRef.current) abortRef.current.abort();
  }, []);

  function send(text) {
    const trimmed = text.trim();
    if (!trimmed || disabledForInput) return;

    // Sending = explicit re-engagement: bring them back to the live edge
    // even if they had scrolled up earlier. The auto-follow effect will
    // then chase the response as it streams in.
    setFollowBottom(true);

    const userId = `u-${Date.now()}`;
    setMessages((m) => [...m, { id: userId, role: "user", text: trimmed }]);
    setInput("");
    setPending(true);
    setActivePersona(null);

    // Record when the thinking indicator started so we can enforce MIN_THINKING.
    const thinkingStart = Date.now();
    // prefers-reduced-motion bypasses the artificial delay entirely.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Commits the assistant message + hides the thinking indicator. Used
    // by both the happy path (after the floor) and the error paths.
    const reveal = (data) => {
      const persona = PERSONAS[data.persona] ? data.persona : "creative-head";
      const fullText = data.answer || "";
      const domain = data.domain || PERSONAS[persona].domain;
      const id = `a-${Date.now()}`;
      setMessages((m) => [
        ...m,
        { id, role: "assistant", persona, domain, text: "", full: fullText },
      ]);
      setPending(false);
      setAsked((n) => n + 1);
      startStream(id, fullText);
    };

    const controller = new AbortController();
    abortRef.current = controller;

    fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ project, message: trimmed }),
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status === 429) {
          const d = await res.json().catch(() => ({}));
          setHardStopped(true);
          setMessages((m) => [
            ...m,
            { id: `s-${Date.now()}`, role: "system", text: d.error || "Rate limit hit — try again later, or reach me directly." },
          ]);
          setPending(false);
          return null;
        }
        if (!res.ok) {
          const d = await res.json().catch(() => ({}));
          setMessages((m) => [
            ...m,
            { id: `s-${Date.now()}`, role: "system", text: d.error || "Something went wrong on my end." },
          ]);
          setPending(false);
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!data) return;

        // Flip the persona NOW so the thinking indicator can transition
        // from team → handoff → single. The answer itself is held until
        // the MIN_THINKING floor elapses, so the persona beat plays out.
        const persona = PERSONAS[data.persona] ? data.persona : "creative-head";
        setActivePersona(persona);

        const elapsed = Date.now() - thinkingStart;
        const remaining = Math.max(0, MIN_THINKING - elapsed);

        if (reduced || remaining === 0) {
          reveal(data);
          return;
        }

        const t = setTimeout(() => reveal(data), remaining);
        // park the timer on the same abort controller so an unmount or
        // a fresh send cancels it cleanly
        controller.signal.addEventListener("abort", () => clearTimeout(t));
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          setPending(false);
          return;
        }
        setMessages((m) => [
          ...m,
          { id: `s-${Date.now()}`, role: "system", text: "Network hiccup. Try again in a moment." },
        ]);
        setPending(false);
      });
  }

  function startStream(messageId, fullText) {
    setStreaming(true);
    let i = 0;
    let timer = null;
    const tick = () => {
      i = Math.min(fullText.length, i + STREAM_CHARS_PER_TICK);
      setMessages((m) =>
        m.map((msg) =>
          msg.id === messageId ? { ...msg, text: fullText.slice(0, i) } : msg
        )
      );
      if (i >= fullText.length) {
        streamCancelRef.current = null;
        setStreaming(false);
        return;
      }
      timer = setTimeout(tick, STREAM_MS_PER_TICK);
    };
    streamCancelRef.current = () => {
      if (timer) clearTimeout(timer);
      // commit the full text on abort so it doesn't appear cut off
      setMessages((m) =>
        m.map((msg) =>
          msg.id === messageId ? { ...msg, text: fullText } : msg
        )
      );
      streamCancelRef.current = null;
      setStreaming(false);
    };
    timer = setTimeout(tick, STREAM_MS_PER_TICK);
  }

  function stopStream() {
    if (streamCancelRef.current) streamCancelRef.current();
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  }

  const isEmpty = messages.length === 0;

  return (
    <div className="csc-thread relative flex h-full flex-col">
      {/* Top bar — mirrors the global site Nav exactly: 64px tall,
          max-w-1400 inner column, px-6 md:px-10 horizontal padding,
          items-center, bottom border. Back-to-Case-Study replaces the
          wordmark on the left; session counter on the right. */}
      <header className="h-16 border-b border-[#E5E5E5]">
        <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between px-6 md:px-10">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-2 text-[14px] tracking-[0.02em] text-[#0a0a0a] transition-colors hover:text-[#525252]"
            style={{ fontFamily: "Inter, sans-serif" }}
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
            Back to Case Study
          </button>
          <p
            className="text-[14px] tracking-[0.02em] text-[#525252]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {asked}/{SESSION_CAP}
          </p>
        </div>
      </header>

      {/* Scroll area — the outer takeover (.csc-thread) is the inline-size
          query container; this just scrolls. */}
      <div ref={scrollRef} className="relative flex-1 overflow-y-auto">
        {isEmpty ? (
          <div className="flex min-h-full items-center justify-center pb-[200px]">
            <EmptyState />
          </div>
        ) : (
          <div className="csc-thread-inner pb-[20vh]">
            <div className="mx-auto w-full max-w-[48rem] py-12">
            {messages.map((msg, idx) => {
              const prev = messages[idx - 1];
              const tightWithPrev = !!prev && prev.role === msg.role && msg.role !== "system";
              return (
                <Message
                  key={msg.id}
                  msg={msg}
                  streamingId={streaming ? messages[messages.length - 1]?.id : null}
                  tightWithPrev={tightWithPrev}
                  isFirst={idx === 0}
                />
              );
            })}

            {pending ? (
              // Persona-flavored two-phase thinking indicator. Replaces the
              // old dots bubble. `activePersona` is null during Phase 1
              // (team assembling) and flips to the routed persona when the
              // classify result lands, which kicks off the handoff → Phase 2.
              <div className="mt-8 flex justify-start">
                <ThinkingIndicator persona={activePersona} />
              </div>
            ) : null}
            </div>
          </div>
        )}

        {/* Fade-out mask — sticks at the bottom of the visible scroll area,
            so messages dissolve into white as they pass behind the dock */}
        {!isEmpty ? (
          <div
            aria-hidden="true"
            className="csc-fade-mask sticky bottom-0 -mt-16 h-16 pointer-events-none"
          />
        ) : null}
      </div>

      {/* Bottom dock — same csc-thread-inner padding as the message thread
          above so the chat box left edge aligns with the assistant bubbles
          (the "content rail"). Width caps at 48rem to match. */}
      <div className="csc-thread-inner pb-6">
        <div className="mx-auto flex w-full max-w-[48rem] flex-col items-start gap-3">
          {/* Chips — only on empty state, never on capped/hard-stopped */}
          {isEmpty && !capped && !hardStopped ? (
            <div className="flex flex-wrap items-center gap-3">
              {SUGGESTED_PROMPTS.map(({ text, Icon }) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => send(text)}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#E5E5E5] bg-white py-2 pl-3 pr-4 text-[14px] leading-[20px] text-[#34322D] transition-all hover:-translate-y-[1px] hover:border-[#0A0A0A]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  <Icon />
                  {text}
                </button>
              ))}
            </div>
          ) : null}

          {/* #thread-bottom-container — relative wrapper that holds the
              floating scroll-to-bottom button, the composer, and the
              disclaimer. The button is positioned 12px above the composer's
              top edge via -top-11 (32px button + 12px gap). */}
          <div id="thread-bottom-container" className="relative w-full">
            {/* Floating scroll-to-bottom — pop-in transition (scale 0.5 →
                1, translate-y 8px → 0, opacity 0 → 1) over 300ms */}
            <button
              type="button"
              onClick={() => {
                setFollowBottom(true);
                scrollToBottom("smooth");
              }}
              aria-label="Scroll to latest"
              aria-hidden={!showScrollBtn || isEmpty}
              tabIndex={showScrollBtn && !isEmpty ? 0 : -1}
              className="absolute -top-11 left-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#E5E5E5] bg-white text-[#0a0a0a] shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)]"
              style={{
                transition: "transform 300ms ease, opacity 300ms ease",
                transform:
                  showScrollBtn && !isEmpty
                    ? "translate(-50%, 0) scale(1)"
                    : "translate(-50%, 8px) scale(0.5)",
                opacity: showScrollBtn && !isEmpty ? 1 : 0,
                pointerEvents: showScrollBtn && !isEmpty ? "auto" : "none",
              }}
            >
              <ChevronDownIcon size={16} />
            </button>

            {/* Composer / capped state — shared ChatBox component */}
            {capped || hardStopped ? (
              <div className="flex w-full flex-wrap items-center justify-between gap-3 rounded-[28px] border border-[#E5E5E5] bg-white px-5 py-3">
                <p className="text-[14px] text-[#0a0a0a]" style={{ fontFamily: "Inter, sans-serif" }}>
                  {capped
                    ? "You've asked a lot — that's the session cap."
                    : "I'm tapped out for now."}{" "}
                  Want to keep talking?
                </p>
                <Link
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Reach me directly
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
            ) : (
              <ChatBox
                mode="interactive"
                textareaRef={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={disabledForInput}
                streaming={streaming}
                onSend={() => send(input)}
                onStop={stopStream}
              />
            )}

            {/* Helper line — same 12px / #525252 in both states. The
                "Scroll Down to read" affordance only belongs on the
                launcher (case study page); inside the takeover the user
                is already engaged, so we just keep the lead-in. */}
            <p
              className="mt-2 text-center text-[12px] leading-[16px] text-[#525252]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Chat with our agents to know more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Empty state --------------------------------------------------------- */
// Figma node 102:1128 (takeover). Headline 102:1495 → avatar row 102:1359 →
// gap-40 between them (outer container is items-center / justify-center
// gap-40). Avatar order matches Figma. Labels use Inter Light 14/24.

const EMPTY_AVATAR_ORDER = ["creative-head", "ai-tinkerer", "vibe-coder", "funny-side"];

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-10 text-center">
      {/* Headline — Figma 102:1495: Inter Medium black, always single line.
          Font scales 14→24px with viewport so the line never breaks. */}
      <h2
        className="font-medium leading-normal text-black whitespace-nowrap"
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "clamp(14px, 2vw, 24px)",
        }}
      >
        My Agents are here to answer any of your questions. Just shoot em&rsquo;
      </h2>

      {/* Avatar row — Figma 102:1359: gap-40 between items, each item is
          flex-col gap-16 (avatar 108px + label below). */}
      <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-8">
        {EMPTY_AVATAR_ORDER.map((id) => {
          const p = PERSONAS[id];
          return (
            <div key={id} className="flex w-[108px] flex-col items-center gap-4">
              <AgentAvatar persona={id} size={108} />
              <p
                className="text-[14px] leading-[24px] text-black"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 300 }}
              >
                {p.short}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- Single message render ---------------------------------------------- */
// Spacing rules: 32px between turns (mt-8), 4px between same-sender bubbles
// (mt-1), 0 for the first message. System messages get the same spacing as
// a turn break since they interrupt the flow.

function Message({ msg, streamingId, tightWithPrev, isFirst }) {
  const spacing = isFirst ? "" : tightWithPrev ? "mt-1" : "mt-8";

  if (msg.role === "system") {
    return (
      <div className={`${spacing} text-center text-[13px] italic text-[#525252]`}>
        {msg.text}
      </div>
    );
  }

  if (msg.role === "user") {
    // User bubble — right, translucent grey, 22px radius, max-w 70%, Inter
    return (
      <div className={`${spacing} flex justify-end`}>
        <div
          className="csc-bubble-in min-w-0 max-w-[70%] break-words rounded-[22px] bg-[rgba(233,233,233,0.5)] px-4 py-2.5 text-[15px] leading-[24px] text-[#0a0a0a]"
          style={{ fontFamily: "Inter, sans-serif", whiteSpace: "pre-wrap", textAlign: "start" }}
        >
          {msg.text}
        </div>
      </div>
    );
  }

  // Assistant — left, transparent, full width, with a subtle persona meta
  // line and a hover-revealed action bar (Copy) below the bubble.
  return <AssistantMessage msg={msg} spacing={spacing} streamingId={streamingId} />;
}

function AssistantMessage({ msg, spacing, streamingId }) {
  const p = PERSONAS[msg.persona] || PERSONAS["creative-head"];
  const isStreaming = msg.id === streamingId;
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    if (typeof navigator === "undefined" || !navigator.clipboard) return;
    navigator.clipboard.writeText(msg.text || "").then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <div className={`${spacing} group flex flex-col items-start`}>
      <div className="csc-chip-in mb-2 flex items-center gap-2">
        <AgentAvatar persona={msg.persona || "creative-head"} size={20} />
        <span
          className="text-[12px] leading-[16px] text-[#525252]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {p.short} · {msg.domain}
        </span>
      </div>
      <div
        className="csc-bubble-in min-w-0 w-full break-words text-[15px] leading-[24px] text-[#0a0a0a]"
        style={{ fontFamily: "Inter, sans-serif", whiteSpace: "pre-wrap" }}
      >
        {msg.text}
        {isStreaming ? (
          <span className="csc-caret ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-[#0a0a0a] align-middle" />
        ) : null}
      </div>

      {/* Hover action bar — Copy + (future: regenerate/up/down). Invisible
          until you hover the message turn. Apple-ease 0.4/0/0.2/1. */}
      {!isStreaming && msg.text ? (
        <div className="csc-ease mt-2 flex items-center gap-1 opacity-0 transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100">
          <button
            type="button"
            onClick={handleCopy}
            aria-label={copied ? "Copied" : "Copy message"}
            className="csc-ease inline-flex h-7 w-7 items-center justify-center rounded-md text-[#525252] transition-colors hover:bg-[#F3F3F2] hover:text-[#0a0a0a]"
          >
            {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
          </button>
        </div>
      ) : null}
    </div>
  );
}

/* ---- Typing dots --------------------------------------------------------- */

function Dot({ delay }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-1.5 w-1.5 rounded-full bg-[#525252]"
      style={{
        animation: "csc-dot 1s infinite ease-in-out",
        animationDelay: `${delay}ms`,
      }}
    />
  );
}
