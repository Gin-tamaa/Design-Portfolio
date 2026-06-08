// app/api/chat/route.js
// Server-only proxy for the case-study chat.
//
// Security:
//   - OPENAI_API_KEY is read here and NEVER returned to the client.
//   - `project` is validated against an allowlist before any fs read
//     (prevents path traversal).
//   - Per-IP sliding-window rate limit (40 / hour) via Upstash. Falls back
//     to "open" in dev if Upstash env vars are missing, with a console.warn.
//
// Model: ONE constant below. Swap it when OpenAI ships a different name.

import fs from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = "gpt-5.4-mini";

const ALLOWED_PROJECTS = new Set(["shopos"]);
const VOICES = ["creative-head", "vibe-coder", "ai-tinkerer", "funny-side"];

// ---- Rate limiter (sliding window, 40 req / hour, per IP) -----------------
let ratelimit = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(40, "1 h"),
    analytics: false,
    prefix: "chat-shopos",
  });
} else if (process.env.NODE_ENV !== "production") {
  // dev convenience — surface the missing config so it doesn't silently
  // ship without a limiter.
  // eslint-disable-next-line no-console
  console.warn(
    "[api/chat] Upstash env vars not set — rate limiting is DISABLED in dev. " +
      "Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN before deploying."
  );
}

// ---- File cache (read brief + voices once per cold start) -----------------
const fileCache = new Map();
async function readMd(relPath) {
  if (fileCache.has(relPath)) return fileCache.get(relPath);
  const full = path.join(process.cwd(), relPath);
  const text = await fs.readFile(full, "utf8");
  fileCache.set(relPath, text);
  return text;
}

// ---- IP extraction --------------------------------------------------------
function getIp(request) {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "anonymous";
}

// ---- Robust JSON extraction -----------------------------------------------
// Handles the three malformed shapes we see in the wild:
//   1. Pure valid JSON (the happy path)
//   2. ```json {…} ``` markdown-fenced
//   3. {…} followed by extra prose (the "Unexpected non-whitespace character
//      after JSON at position N" error)
// Returns null if nothing parseable was found.
function extractJsonObject(text) {
  if (!text || typeof text !== "string") return null;

  let cleaned = text.trim();

  // Strip leading/trailing markdown code fences
  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?\s*```\s*$/i, "")
      .trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // fall through to balanced-brace extraction
  }

  // Walk the string to find the first balanced {…}, respecting string
  // literals (so escaped braces inside strings don't confuse the depth count)
  const start = cleaned.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < cleaned.length; i++) {
    const c = cleaned[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (c === "\\") {
      escape = true;
      continue;
    }
    if (c === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;

    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) {
        const candidate = cleaned.slice(start, i + 1);
        try {
          return JSON.parse(candidate);
        } catch {
          return null;
        }
      }
    }
  }

  return null;
}

// ---- POST -----------------------------------------------------------------
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "invalid JSON" }, { status: 400 });
  }

  const { project, message } = body || {};

  // Validate inputs
  if (typeof project !== "string" || !ALLOWED_PROJECTS.has(project)) {
    return Response.json({ error: "unknown project" }, { status: 400 });
  }
  if (typeof message !== "string" || !message.trim() || message.length > 1000) {
    return Response.json(
      { error: "message must be a non-empty string up to 1000 chars" },
      { status: 400 }
    );
  }

  // Per-IP rate limit
  if (ratelimit) {
    const ip = getIp(request);
    const { success, reset } = await ratelimit.limit(`ip:${ip}`);
    if (!success) {
      const retryAfter = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return Response.json(
        {
          error:
            "you've asked a lot in the last hour — give it a bit and try again, or reach out directly.",
          retryAfter,
        },
        { status: 429, headers: { "retry-after": String(retryAfter) } }
      );
    }
  }

  // Load content
  let shared, voices, brief;
  try {
    [shared, ...voices] = await Promise.all([
      readMd("content/agents/_shared.md"),
      ...VOICES.map((v) => readMd(`content/agents/${v}.md`)),
    ]);
    brief = await readMd(`content/projects/${project}.md`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[api/chat] failed to load content:", err);
    return Response.json(
      { error: "content not available" },
      { status: 500 }
    );
  }

  const voicesBlock = VOICES.map(
    (name, i) => `=== ${name} ===\n${voices[i]}`
  ).join("\n\n");

  const systemPrompt =
    shared.trim() +
    "\n\n" +
    "## Voices\n\n" +
    voicesBlock +
    "\n\n" +
    "## Brief (THE ONLY SOURCE OF TRUTH)\n\n" +
    brief.trim() +
    "\n\nReturn ONLY the JSON object specified in the Output section. No prose around it.";

  // OpenAI
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      { error: "server not configured (missing OPENAI_API_KEY)" },
      { status: 500 }
    );
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  let raw;
  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message.trim() },
      ],
      response_format: { type: "json_object" },
    });
    raw = completion.choices?.[0]?.message?.content || "";
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[api/chat] OpenAI error:", err?.message || err);
    return Response.json(
      { error: "model call failed — try again in a moment." },
      { status: 502 }
    );
  }

  // Parse defensively. Some models wrap their JSON in markdown fences
  // (```json … ```) or emit JSON followed by stray prose ("…} \n\nSome extra
  // note"). Strip fences, then either parse the whole string OR extract the
  // first balanced {…} substring.
  const parsed = extractJsonObject(raw) || {
    persona: "creative-head",
    domain: "general",
    answer: raw,
  };

  const persona = VOICES.includes(parsed.persona)
    ? parsed.persona
    : "creative-head";
  const domain =
    typeof parsed.domain === "string" ? parsed.domain.slice(0, 40) : "general";
  const answer =
    typeof parsed.answer === "string" && parsed.answer.trim()
      ? parsed.answer.trim()
      : "I don't have a clean answer for that from the brief — try a more specific question, or reach me directly.";

  return Response.json({ persona, domain, answer });
}
