# CLAUDE.md — TalentHub Frontend

> Engineering rules for Claude Code sessions on this codebase.
> Read this on every session start, then read [`wiki/INDEX.md`](wiki/INDEX.md).

---

## 1. Project at a glance

- **Stack:** Vite 7 + React 19 + plain JavaScript (no TypeScript), Tailwind CSS v4, React Router v6, Redux Toolkit, axios, react-hook-form + zod
- **Run:** `npm run dev` → `http://localhost:5173`
- **Wiki:** [`wiki/`](wiki/) — see [`wiki/INDEX.md`](wiki/INDEX.md)
- **MCP servers:** Playwright (visual verification, console inspection) + Figma (design extraction). See [`.mcp.json`](.mcp.json).

---

## 2. Wiki is the source of truth

**Session-start ritual (mandatory):** at the start of EVERY new Claude Code session — before answering questions about the codebase or touching any code — read [`wiki/INDEX.md`](wiki/INDEX.md) in full, then read the wiki page(s) relevant to the task at hand (e.g. [`wiki/routing.md`](wiki/routing.md) for route work, [`wiki/components.md`](wiki/components.md) for UI work). This is how a fresh session assimilates the codebase efficiently instead of re-exploring `src/` from scratch. Skim the top of [`wiki/log.md`](wiki/log.md) for what changed recently.

Before changing non-trivial code:

1. **Read** [`wiki/INDEX.md`](wiki/INDEX.md) and the relevant page.
2. **Trust but verify.** Wiki claims carry confidence tags — re-check if the tag is anything other than `✅ VERIFIED`.
3. **After significant changes**, append an entry to [`wiki/log.md`](wiki/log.md) (`## [YYYY-MM-DD] action | subject`) and update the affected wiki page(s). Keep tags accurate.

### Confidence tags (use on every claim)

| Tag                      | Meaning                                                                      |
| ------------------------ | ---------------------------------------------------------------------------- |
| `✅ VERIFIED`            | Confirmed by reading current source code or authoritative docs               |
| `🔶 LIKELY`              | Inferred from code patterns or adjacent evidence, not directly confirmed     |
| `❓ NEEDS-CLARIFICATION` | Ambiguous — needs human input                                                |
| `⚠️ ASSUMPTION`          | Educated guess, may be wrong                                                 |
| `🪦 STALE`               | Was true at one point, may no longer be accurate                             |
| `🔗 EXTERNAL`            | Depends on external system (API, Figma, design notes) — verify before acting |

---

## 3. Engineering workflow — use Superpowers

Superpowers skills are not optional in this codebase. The following are mandatory for the situations they describe:

- **`superpowers:brainstorming`** — invoke **before** any new feature, component, or behavioral change. Don't write code until requirements and approach are agreed.
- **`superpowers:writing-plans`** — after brainstorming, for any multi-step work.
- **`superpowers:test-driven-development`** — write tests before implementation. Don't skip the discipline because "the change is small."
- **`superpowers:systematic-debugging`** — invoke for any bug, test failure, or unexpected behavior. Find root cause, not just a fix that makes the symptom go away.
- **`superpowers:verification-before-completion`** — before claiming work is done, run the relevant verification commands (`npm run lint`, `npm run build`, `npm run test:e2e`, browser check via Playwright MCP) and quote the output. Evidence before assertions.
- **`superpowers:requesting-code-review`** / **`receiving-code-review`** — for major features, before merging.

When multiple skills could apply, prefer process skills (brainstorming, debugging) before implementation skills.

---

## 4. Debug-log discipline (mandatory)

Adapted from the MangoTV convention. Full details in [`wiki/debugging-workflow.md`](wiki/debugging-workflow.md).

### Format

Use the `debug` helper from `src/utils/debug.js` so prod stays silent:

```javascript
import { debug } from '../utils/debug.js';
const log = debug('ComponentName');

log('fetching content...');
log('categories loaded:', categories.length);
log.error('failed to load:', err);
```

If you must use raw `console.log`, follow the same prefix pattern: `console.log('[ComponentName] step:', data)`.

### Required at every:

1. **Async call** — log before, log response shape, log errors with context
2. **Component mount** — log key props/state
3. **Conditional branch** — log which branch fired and why
4. **Redux dispatch** — log action type + key payload fields
5. **API response** — log status, data shape (not full payload)
6. **Style-affecting calculation** — log computed values (widths, item counts)

### Verification after writing code

Use the **Playwright MCP** to navigate to the affected page, open the console, verify logs appear in expected order, and screenshot for visual check. (Browser console errors are real bugs — don't treat them as background noise.)

### Lifecycle

Logs **stay** during active development. Cleanup pass before release strips them in one sweep — not piecemeal. Production builds are silent because `debug()` is dev-gated.

---

## 5. Pre-commit checks (mandatory)

Husky enforces these on every commit via `.husky/pre-commit` and `.husky/commit-msg`. Don't disable them with `--no-verify` — fix the underlying issue.

| Check                         | Command                | When           |
| ----------------------------- | ---------------------- | -------------- |
| Lint + format on staged files | `lint-staged`          | pre-commit     |
| Conventional commit message   | `commitlint`           | commit-msg     |
| Full lint                     | `npm run lint`         | before pushing |
| Format check                  | `npm run format:check` | before pushing |
| Production build              | `npm run build`        | before pushing |
| E2E tests                     | `npm run test:e2e`     | before pushing |

Common lint fixes are catalogued in [`wiki/pre-commit-workflow.md`](wiki/pre-commit-workflow.md).

Conventional commit format: `type(scope): subject`. Types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `style`, `perf`, `ci`, `build`, `revert`.

---

## 6. Figma fidelity

When implementing from Figma, see [`wiki/figma-fidelity.md`](wiki/figma-fidelity.md). Short version:

- **Use Figma MCP `get_design_context`** to extract exact CSS values. **Never screenshot-guess.**
- **Use `clamp()`** for all scalable properties (font-size, padding, margin, gap, width/height) so designs scale fluidly between mobile and desktop frames. Don't hardcode breakpoint-based static values.
- Take a screenshot via Playwright MCP **after** implementing to visually verify.

The TalentHub Figma file key is currently `❓ NEEDS-CLARIFICATION` — populate [`wiki/figma-node-map.md`](wiki/figma-node-map.md) when provided.

---

## 7. MCP tools (`.mcp.json`)

- **Playwright MCP** (`@playwright/mcp@latest`, npx-launched) — navigate pages, inspect console, take screenshots, verify viewport behavior.
- **Figma MCP** (HTTP at `127.0.0.1:3845/mcp`) — extract design specs from the Figma file. **You must start Figma's official Dev Mode MCP server locally** (Figma desktop app → Preferences → Enable Dev Mode MCP Server) before invoking Figma tools.

MCP servers are loaded at session start, so if you change `.mcp.json` you must restart Claude Code for the new server to register. If the Figma server is running but its tools still don't appear, fall back to direct HTTP calls to `127.0.0.1:3845/mcp`.

---

## 8. File naming conventions

| Kind               | Convention                                                      | Example                      |
| ------------------ | --------------------------------------------------------------- | ---------------------------- |
| Components / pages | PascalCase `.jsx`                                               | `Navbar.jsx`, `HomePage.jsx` |
| Hooks              | camelCase prefixed `use`                                        | `useDebounce.js`             |
| Utilities          | camelCase                                                       | `classNames.js`, `debug.js`  |
| Constants          | UPPER_SNAKE in code, camelCase filename                         | `ROUTES`, `routes.js`        |
| Env vars           | `VITE_*` UPPER_SNAKE                                            | `VITE_API_BASE_URL`          |
| Test files         | co-located `.spec.js` next to subject **or** under `tests/e2e/` | `home.spec.js`               |

(Elysium was inconsistent on file naming. Pick from this table and stick to it.)

---

## 9. Directory map

See [`wiki/architecture.md`](wiki/architecture.md) for the canonical tree. Quick reference:

- `src/components/{ui,shared,sections,cards}/` — components by role
- `src/pages/` — top-level routed pages
- `src/layout/` — layout shells
- `src/admin/` — reserved (future lazy-loaded admin subsystem)
- `src/services/` — API clients
- `src/store/` + `src/store/slices/` — Redux Toolkit
- `src/hooks/` — shared React hooks
- `src/providers/` — context providers
- `src/utils/`, `src/constants/` — leaf utilities

---

## 10. References

- Elysium Tours frontend (sibling project, structure reference): `C:\Users\DELL PRECISION 5530\OneDrive\Desktop\js_files\elysium-clone\elysiumtours-frontend`
- MangoTV (sibling project, MCP + wiki reference): `C:\Users\DELL PRECISION 5530\OneDrive\Desktop\js_files\mangotv\mangotv-main`
- Karpathy's LLM Wiki Pattern: <https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f>
