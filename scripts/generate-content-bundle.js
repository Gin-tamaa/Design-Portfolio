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
const PROJECTS = ["shopos"];

const AGENTS = {};
for (const v of VOICES) {
  AGENTS[v] = fs.readFileSync(path.join(ROOT, "content", "agents", `${v}.md`), "utf8");
}

const PROJ = {};
for (const p of PROJECTS) {
  PROJ[p] = fs.readFileSync(path.join(ROOT, "content", "projects", `${p}.md`), "utf8");
}

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
].join("\n");

fs.writeFileSync(path.join(ROOT, "content", "bundle.js"), out);
console.log(`Wrote content/bundle.js (${out.length} bytes, ${VOICES.length} voices + ${PROJECTS.length} projects)`);
