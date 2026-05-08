# Next session prompt

Underscore-prefixed because this is ephemeral session-handoff (not durable wiki knowledge). Delete after the next session uses it.

---

## Status as of 2026-05-06

The Figma design-system playground is **feature-complete** relative to the catalogued component frames. All 13 primitives are built, showcased on `HomePage.jsx`, and documented in `wiki/components.md`:

- ✅ Button (`50:6295`)
- ✅ Card (`50:8153`)
- ✅ Field / TextInput (`50:6914`)
- ✅ Select (`50:6275`)
- ✅ Checkbox (`2019:13564`)
- ✅ VerificationCode (`2021:911`)
- ✅ Textarea (`2021:950`)
- ✅ Loader (`2168:24062`)
- ✅ Tag (`3167:29034` + chips at `3179:29793` / `3179:29795`)
- ✅ MiniCard (`3384:76788`)
- ✅ Upload (`3014:57097`)
- ✅ ProgressBar (`2282:23906`)
- ✅ WatchTutorial + Breadcrumbs + Captions (frame `2255:8014`)

## Next likely directions

1. **Onboarding screens** — frames not yet catalogued in `figma-node-map.md`. Check the Figma file for top-level page frames that compose these primitives into actual onboarding flows.
2. **Routing + state for product surfaces** — wire React Router routes for the screens once they're identified. Redux Toolkit slices live under `src/store/slices/` and can be added per-feature.
3. **Real icon set** — the showcase uses inline hand-drawn / Figma-pulled SVGs. For production, swap in a real icon library (lucide / heroicons / phosphor) so consumers don't ship 13 inline `<svg>` definitions.
4. **Cleanup pass** — strip the design-system-playground Showcase from HomePage once real product pages exist; move it to a `/design-system` route gated to dev.

## Open follow-ups (still relevant)

- Select: full keyboard nav (↑/↓ to highlight + Enter to select)
- Select: grouped options with section headers (Figma `2047:9056`)
- Select: multi-select variant
- Card: optional `as="div"` to render as static container instead of button
- Forms: promote `#bfbfbf` / `#cccccc` literals to `--color-disabled-bg` / `--color-disabled-border` tokens (recurs across TextInput, Textarea, Select, VerificationCode, Upload)
- Forms: promote `#595959` placeholder grey to a token (recurs across TextInput, Textarea, Select)

## Workflow reminder (still applies)

1. Pull `get_design_context` on the Figma frame
2. Plan the API briefly
3. Implement
4. Update barrel + add showcase to HomePage
5. Verify (`npm run lint && npm run format:check && npm run build && npm run test:e2e` + Playwright MCP)
6. Update `wiki/components.md` + `wiki/figma-node-map.md` + `wiki/log.md`

### Conventions already established

- **Folder layout**: form primitives in `src/components/ui/form/`; non-form primitives flat in `src/components/ui/`
- **Hybrid pattern**: form components accept Field props directly
- **State derivation priority**: forced `state` prop → `disabled` → `error` → `verified` → interactive
- **Showcase `state` prop**: every primitive exposes a forced-state override for pinned documentation
- **Debug logging**: `import { debug } from '<n hops>/utils/debug.js'`; `const log = debug('ComponentName')`
- **Tailwind v4 JIT**: literal class strings only
- **Visual fidelity**: pull exact Figma values via MCP, no screenshot-guessing. For icons, fetch the Figma asset URL and inline the SVG paths so we're asset-free in production
- **A11y**: forward `ref`, set `aria-invalid` when error, semantic HTML
