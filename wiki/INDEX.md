# TalentHub Wiki — Index

> Living knowledge base for the TalentHub frontend. Maintained by Claude Code.
> Follows the [Karpathy LLM Wiki Pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): a persistent, compounding artifact with confidence tags.

## Confidence Tags

Every claim in this wiki carries a tag:

| Tag                      | Meaning                                                                  |
| ------------------------ | ------------------------------------------------------------------------ |
| `✅ VERIFIED`            | Confirmed by reading current source code or authoritative docs           |
| `🔶 LIKELY`              | Inferred from code patterns or adjacent evidence, not directly confirmed |
| `❓ NEEDS-CLARIFICATION` | Ambiguous — could go either way, needs human input                       |
| `⚠️ ASSUMPTION`          | Educated guess, may be wrong                                             |
| `🪦 STALE`               | Was true at one point, may no longer be accurate                         |
| `🔗 EXTERNAL`            | Depends on external system (API, Figma, etc.) — verify before acting     |

## Pages

### Architecture

- [architecture.md](architecture.md) — Stack, directory tree, entry points, state conventions (NB: Redux store is unwired scaffold; state lives in route-level contexts)
- [routing.md](routing.md) — Full route map (talent / institution / parent A+B / engagement / avatar), 4 layout shells, auth-CTA helpers
- [api.md](api.md) — axios client, dev proxy, service modules, endpoint table, env vars (login, talent onboarding, institution bulk upload wired to staging)

### Components & Styling

- [components.md](components.md) — Component catalog (grows as components ship)
- [design-tokens.md](design-tokens.md) — Tailwind v4 theme tokens (colors, typography, spacing, radii)

### Workflow

- [debugging-workflow.md](debugging-workflow.md) — Console-log convention + Playwright verification
- [figma-fidelity.md](figma-fidelity.md) — Pixel-perfect implementation rules (`clamp()`, `get_design_context`)
- [pre-commit-workflow.md](pre-commit-workflow.md) — Lint, format, build, husky hooks
- [onboarding-redesign.md](onboarding-redesign.md) — Recruiter onboarding flow (R01-R09, mock), shared responsive `OnboardingPanel`, talent/entry corrections to the 8027 frames, Figma-export asset rule, demo triggers, **open items** (read this first when resuming)
- [responsive-plan.md](responsive-plan.md) — Master plan to make every page responsive down to 320px (audit findings, patterns, phases) — EXECUTED 2026-10-10

### External

- [figma-node-map.md](figma-node-map.md) — Figma frame → node-ID mapping (placeholder until file lands)

### Operations

- [log.md](log.md) — Chronological record of wiki updates and notable changes

---

_Last updated: 2026-10-16 (recruiter onboarding + talent/entry corrections; backend wiring for login / talent onboarding / institution; responsive pass executed)_
