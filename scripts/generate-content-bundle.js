#!/usr/bin/env node
// Reads content/agents/*.md and content/projects/*.md and writes
// content/bundle.js with the content inlined as escaped string literals.
//
// Why this exists: Next.js's serverless function tracer doesn't include
// .md files in the function bundle by default, so an fs.readFile at
// request time on Vercel fails with ENOENT. Inlining at build time
// removes the runtime fs read entirely.
//
// When the .md content changes, re-run:
//   node scripts/generate-content-bundle.js
// or via npm:
//   npm run content:bundle

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const VOICES = ["_shared", "creative-head", "vibe-coder", "ai-tinkerer", "funny-side"];
const PROJECTS = ["shopos", "brand-memory"];

const AGENTS = {};
for (const v of VOICES) {
  AGENTS[v] = fs.readFileSync(path.join(ROOT, "content", "agents", `${v}.md`), "utf8");
}

const PROJ = {};
for (const p of PROJECTS) {
  PROJ[p] = fs.readFileSync(path.join(ROOT, "content", "projects", `${p}.md`), "utf8");
}

// Per-project deep brief + guardrails. The brief is what the agent answers
// FROM; the guardrails are what it must NOT claim, and OVERRIDE the brief
// when they conflict. Same read pattern as everything else above. One pair
// per case-study chat surface — add a new pair when wiring up a new project.
const SHOPOS_BRIEF = fs.readFileSync(
  path.join(ROOT, "content", "projects", "shopos.md"),
  "utf8"
);
const SHOPOS_GUARDRAILS = fs.readFileSync(
  path.join(ROOT, "content", "projects", "shopos.guardrails.md"),
  "utf8"
);
const BRAND_MEMORY_BRIEF = fs.readFileSync(
  path.join(ROOT, "content", "projects", "brand-memory.md"),
  "utf8"
);
const BRAND_MEMORY_GUARDRAILS = fs.readFileSync(
  path.join(ROOT, "content", "projects", "brand-memory.guardrails.md"),
  "utf8"
);

const out = [
  "// AUTO-GENERATED from content/agents/*.md and content/projects/*.md.",
  "// Do not edit by hand — edit the .md files and regenerate via",
  "//   node scripts/generate-content-bundle.js",
  "// (or `npm run content:bundle`). Inlined at build time so Vercel's",
  "// serverless runtime doesn't need to fs.readFile at request time.",
  "",
  `export const AGENTS = ${JSON.stringify(AGENTS, null, 2)};`,
  "",
  `export const PROJECTS = ${JSON.stringify(PROJ, null, 2)};`,
  "",
  `export const SHOPOS_BRIEF = ${JSON.stringify(SHOPOS_BRIEF)};`,
  "",
  `export const SHOPOS_GUARDRAILS = ${JSON.stringify(SHOPOS_GUARDRAILS)};`,
  "",
  `export const BRAND_MEMORY_BRIEF = ${JSON.stringify(BRAND_MEMORY_BRIEF)};`,
  "",
  `export const BRAND_MEMORY_GUARDRAILS = ${JSON.stringify(BRAND_MEMORY_GUARDRAILS)};`,
  "",
].join("\n");

fs.writeFileSync(path.join(ROOT, "content", "bundle.js"), out);
console.log(
  `Wrote content/bundle.js (${out.length} bytes, ${VOICES.length} voices, ` +
    `${PROJECTS.length} projects, +SHOPOS_BRIEF +SHOPOS_GUARDRAILS ` +
    `+BRAND_MEMORY_BRIEF +BRAND_MEMORY_GUARDRAILS)`
);
