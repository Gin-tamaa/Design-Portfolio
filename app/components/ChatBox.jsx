"use client";

// Single source of truth for the chat composer pill. Rendered in two modes:
//
//   - mode="display"      Static pill that opens the takeover when clicked.
//                          Used by ChatLauncher on the case study page.
//   - mode="interactive"  Real textarea + send/stop button. Used inside the
//                          takeover by CaseStudyChat.
//
// Both modes render the SAME visual pill: 28px radius, white bg, #E5E5E5 1px
// border, 12px padding, 32×32 trailing CTA. Width is controlled by the
// parent (max-w-[48rem] in our layout).

export function ArrowUpIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

export function SquareIcon({ size = 12 }) {
  // lucide Square, filled — used as the Stop affordance while streaming
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="1.5" />
    </svg>
  );
}

export function ChevronDownIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function ChatBox({
  mode = "interactive",
  textareaRef,
  value,
  onChange,
  onKeyDown,
  placeholder = "Ask anything about the case study",
  disabled = false,
  streaming = false,
  onSend,
  onStop,
  onClick, // display mode only — open the takeover
}) {
  if (mode === "display") {
    // Same exact styling as interactive mode — only the inner content
    // differs (placeholder + decorative send icon instead of a real
    // textarea + dynamic send/stop). No drop shadow, no hover lift, so
    // there is zero visual transition when the takeover cross-fades over
    // this element.
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={placeholder}
        className="group csc-ease relative flex w-full items-end gap-2 rounded-[28px] border border-[#E5E5E5] bg-white p-3 text-left transition-all duration-200 hover:border-[#A3A3A3] hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)]"
      >
        <span
          className="flex-1 truncate self-center px-2 text-[16px] leading-[24px] text-[#A3A3A3]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {placeholder}
        </span>
        <span className="csc-ease flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[20px] bg-[#F3F3F2] text-[#525252] transition-colors duration-200 group-hover:bg-[#0A0A0A] group-hover:text-white">
          <ArrowUpIcon size={16} />
        </span>
      </button>
    );
  }

  // Interactive mode — real textarea + dynamic send/stop CTA
  const sendActive = !!(value || "").trim() && !disabled;
  return (
    <div className="csc-ease relative flex w-full items-end gap-2 rounded-[28px] border border-[#E5E5E5] bg-white p-3 transition-all duration-200 hover:border-[#A3A3A3] hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.18)] focus-within:border-[#0a0a0a] focus-within:shadow-[0_0_0_3px_rgba(10,10,10,0.06)]">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 resize-none self-center overflow-y-auto bg-transparent px-2 text-[16px] leading-[24px] text-[#0a0a0a] outline-none placeholder:text-[#A3A3A3] disabled:text-[#525252]"
        style={{ fontFamily: "Inter, sans-serif", maxHeight: 200 }}
      />
      {streaming ? (
        <button
          type="button"
          onClick={onStop}
          aria-label="Stop"
          className="csc-ease inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[20px] bg-[#0A0A0A] text-white transition-opacity duration-200 hover:opacity-80"
        >
          <SquareIcon size={12} />
        </button>
      ) : (
        <button
          type="button"
          onClick={onSend}
          disabled={!sendActive}
          aria-label="Send"
          className={`csc-ease inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[20px] transition-colors duration-200 ${
            sendActive
              ? "bg-[#0A0A0A] text-white hover:opacity-80"
              : "bg-[#F3F3F2] text-[#525252]"
          }`}
        >
          <ArrowUpIcon size={16} />
        </button>
      )}
    </div>
  );
}
