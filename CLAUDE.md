# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository overview

A single-file static portfolio landing page for Sumedh Kamble (product designer & frontend developer working on ShopOS). The entire site is `index.html` — there is no build step, no package manager, no framework, and no test suite. Styles are inline `<style>`; fonts are loaded from Google Fonts.

This is currently a placeholder ("New portfolio soon.") with a one-line bio and contact links.

## Running locally

Open `index.html` directly in a browser, or serve the directory:

```bash
python3 -m http.server 8000
```

## Architecture notes

- `:root` CSS variables (`--bg`, `--ink`, `--muted`, `--line`) define the entire color palette — change them there, not at use sites.
- The layout is a single `.wrap` flex row with two children: `.mono` (the large italic "S—K" monogram in Cormorant Garamond) and `.copy` (the Inter-set bio block). The mobile breakpoint at 720px collapses to column.
- The `.mono sup` copyright glyph uses Inter (not the serif) and is hand-positioned with `top`/`left` offsets — any font-size change to `.mono` will require re-tuning those offsets.

## When extending this site

Because everything lives in one file, prefer keeping additions inline unless the page grows enough to justify splitting CSS/JS into separate files. If you introduce a build tool or framework, update this file.
