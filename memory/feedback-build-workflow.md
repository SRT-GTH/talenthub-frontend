---
name: feedback-build-workflow
description: Mandatory build rules from the GTH init prompt — Figma-to-code, token discipline, asset rules, verification
metadata:
  type: feedback
---

These rules are from the GTH session init prompt and CLAUDE.md. Apply them to every section build.

**FIGMA MCP GIVES TOKENS ONLY — never embed SVG path data from MCP.** Extract dimensions, spacing, colour, font, radius, shadow, layout direction, gap. For visual assets: note name/purpose, use project asset pipeline. Hand-craft small UI icons (checkmarks, Xs, chevrons) from bounding box + colour only — never copy path data.

**REST API fallback:** When MCP is rate-limited, use `curl -s "https://api.figma.com/v1/files/{FILE_KEY}/nodes?ids={IDS}" -H "X-Figma-Token: {PAT}"`. Always use Python with UTF-8 guards when parsing JSON on Windows.

**SCREENSHOT IS THE VISUAL GROUND TRUTH.** MCP gives tokens; screenshot tells you what it should look like. If they conflict, trust the screenshot and flag the discrepancy.

**clamp() IS MANDATORY** for all scalable properties (font-size, padding, margin, gap, width, height). Never hardcode breakpoint-based static values.

**Figma text is sacred.** Every text string must be verbatim from Figma `characters` field. Never invent labels.

**TAILWIND TOKENS FIRST:** Before any colour/spacing/font/radius/shadow, look up the token table from index.css. If no token: check if it should be in config (design-system value → ADD to @theme first). If one-off: Tailwind arbitrary [value]. Raw CSS only for things Tailwind cannot express (complex animations, mask-image, clip-path).

**BUILD VERIFICATION IS MANDATORY before claiming done:**

1. `npm run build` — must show "✓ built in X.Xs" with 0 errors (chunk-size warning OK)
2. Playwright visual check — navigate, screenshot, compare to Figma, name specific elements verified

**WIKI UPDATES ARE PART OF EVERY DELIVERY:**

- wiki/components.md: add row for every new component
- wiki/figma-node-map.md: record every Figma node ID accessed
- wiki/log.md: append `## [YYYY-MM-DD] build | [section name]`

**Why:** These rules exist to maintain pixel fidelity, prevent SVG pollution, keep the token system clean, and ensure every delivery is verified before it's called done.

**How to apply:** Check every one of these before submitting a section as complete. The user has a zero-tolerance policy for skipping them.
