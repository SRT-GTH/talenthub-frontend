# Responsive Master Plan — 320px → 1728px

> Status: **EXECUTED 2026-10-10 (phases 0–4 + perf; see `wiki/log.md`) — hardening/real-device checks open.** Originally **APPROVED 2026-10-08.** Decisions in §7 were resolved with the recommended options: (1) engineering defines mobile patterns, flagged `⚠️ ASSUMPTION` until a designer reviews; (2) `figma-fidelity.md` amended (desktop ≥1024px stays pixel-exact, below adapts); (3) dashboard uses a bottom tab bar; (4) performance work is in scope (Phase 6); (5) landscape phones are best-effort. Progress is tracked in `wiki/log.md`.
> Audit date: 2026-10-08. Owner: engineering + design. Floor: **320 CSS px** (iPhone SE 1st-gen / WCAG 1.4.10 reflow baseline).

## 1. Where we are `✅ VERIFIED` (automated audit + manual review)

**Method.** Headless Chromium visited all 73 concrete routes at **320 / 375 / 768 px** (219 loads). Per page it recorded: page-level horizontal overflow, elements poking past the viewport, content silently clipped by `overflow-hidden` shells, text < 12px, and interactive targets < 36px. 24 routes were then reviewed visually at 320px. **Not yet covered:** modals, dropdowns, hover/open states, landscape phones, real devices, 1024–1440 regressions.

| Signal                                                   | Result                                                                                                      |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Routes with page-level horizontal scroll @320            | **7 / 73** (`/components` dev playground, `/profile/engagement`+`/identity`, 3× milestone, `/skills-lab`)   |
| Routes with page-level horizontal scroll @768            | 1 (`/components`)                                                                                           |
| "Looks fine" ≠ fine: shells that clip instead of scroll  | `h-screen overflow-hidden` ×**37**, `100vh` ×6, `dvh/svh` ×**0** — Career Buddy clips ~480px of content     |
| Responsive prefixes (`sm: md: lg: xl:`) in 327 JSX files | ≈ **170 total**; **0** in `components/ui` (30 files), `cards`, `skillsLab` (23), `recruiterHome`, `landing` |
| Tap targets < 36px                                       | present on **every** route (15–26 per profile-filling page); many controls are 24px tall                    |
| Text < 12px                                              | 17–80 text nodes per page on profile-filling/engagement/institution screens                                 |
| Inputs / fields                                          | 56 `<input/textarea/select>`; 178 files use sub-16px type → iOS Safari auto-zooms on focus                  |
| Assets                                                   | 63 MB in `src/assets`, 22 files > 1 MB; single 2.4 MB JS bundle (644 KB gzip), no route splitting           |

**Positive baseline:** onboarding (talent / institution / parent, 34 routes), `get-started`, `login`, community and most recruiter pages already collapse to one column at 320. The problem is concentrated, not universal.

## 2. Root causes (8 patterns, not 73 bugs)

| #   | Pattern                                                                                                                                                                              | Evidence                                                                                                        | Severity |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | -------- |
| P1  | **Desktop layouts that shrink instead of re-flow.** Fixed two-column `main flex` (content + insight aside) using `clamp(vw)` type; at 320 the title column becomes a vertical sliver | `/profile/filling/*` (13 routes), Career Buddy chat + profile panel, avatar stage                               | Critical |
| P2  | **No mobile navigation.** Dashboard rail is `hidden lg:flex` with no replacement; marketing `Navbar` has no menu at all; landing page itself is an unbuilt stub (`return null`)      | `DashboardShell`, `Navbar.jsx`, `LandingPage.jsx` — recruiter/community users cannot switch sections on a phone | Critical |
| P3  | **Header action clusters that don't collapse** (logo + Switch Modes + Save & Exit + avatar + progress strip)                                                                         | `EngagementTopNav`, `SkillsLabNav`, milestone pages (+184px), profile-filling progress strip, breadcrumbs       | High     |
| P4  | **Grids/rows that squeeze rather than stack or scroll**                                                                                                                              | Recruiter home KPI cards (4 slivers), Job Postings filter row (search runs off-screen), pipeline, talent cards  | High     |
| P5  | **Fixed overlays that cover content on small screens**                                                                                                                               | 100px `CareerBuddyFloatingButton` (~31% of 320px), guidelines toast, 22 files using `fixed inset-0`             | Medium   |
| P6  | **Viewport-height model** — nested `h-screen` scrollers break under iOS URL-bar collapse and the on-screen keyboard (chat composers!)                                                | 37 `h-screen`, 0 `dvh`                                                                                          | High     |
| P7  | **Ergonomics floor not enforced** — 24px controls, 10–11px labels, sub-16px inputs                                                                                                   | audit; Figma desktop values copied 1:1                                                                          | High     |
| P8  | **No system**: no breakpoint policy, ad-hoc `clamp(vw)`, no responsive tests, so regressions are invisible                                                                           | prefix counts above; `tests/e2e` has 1 spec                                                                     | Systemic |

## 3. Design principles (senior UX call) `⚠️ ASSUMPTION` until §7 is signed off

1. **Desktop stays pixel-exact; below `lg` we adapt.** Figma only ships ~1728px frames. At ≥1024 the existing "exact Figma values" rule in `figma-fidelity.md` still wins; under 1024 we apply the patterns below. (This amends the fidelity rule — see §7.)
2. **Mobile-first authoring for new/rewritten components** (unprefixed = 320), widen with prefixes. Existing `lg:` is already the desktop cut — keep it.
3. **Reflow, don't shrink.** Layout changes at breakpoints; `clamp()` is for fine-tuning _within_ a layout, never a substitute for re-flow. Clamp floors: body ≥ 14px, secondary ≥ 12px, **form fields 16px**.
4. **Thumb-first.** Primary actions in the bottom 40% of the screen; targets **≥ 44×44** (24px absolute floor per WCAG 2.5.8), 8px spacing between.
5. **One scroll container on mobile.** Below `lg`, use normal document scroll with sticky headers; keep a fixed-viewport shell only for chat/composer screens, using `dvh` + keyboard-aware padding.
6. **Nothing hover-only.** Every hover reveal needs a tap/focus equivalent (`@media (hover:hover)` for pure enhancement).

## 3a. Owner direction added 2026-10-09 — density & mobile-native appearance `✅ VERIFIED` (owner feedback)

After the first pass the owner reviewed real phone renders and set the quality bar. These override any earlier "bigger is safer" instinct:

1. **Mobile is not shrunken desktop.** Below `lg` appearance may differ from Figma whenever it looks better on a phone (flat lists instead of container cards, hairline dividers instead of nested bordered boxes, slimmer headers, hidden decorative elements).
2. **Density target: ~2½ cards visible** between pinned chrome on a standard phone (360×800 / 390×844). Measured by `npm run audit:density` (`scripts/density-audit.mjs`); median list-card height ≲ 230–250px.
3. **Smaller elements and text than a thumb-first reading suggests**: page h1 24–26px, card titles 16–17px, body 14px (13px in dense cards), labels/meta 12px (the 12px floor stays), buttons 14px; gutters 16px, card padding 12–14px, gaps 8–12px. Visual button height 40–44px primary / 32–36px secondary with an invisible ≥44px hit area (the gate hard-requires only 24px).
4. **Pinned chrome budget**: sticky/fixed bars together ≤ ~30% of the viewport; a sticky row holds ONE slim purpose (never chips + search + arrows squeezed together).
5. The rule that **≥ lg stays pixel-identical** is unchanged.

### Breakpoints

| Token      | Min width | Role                                                                         |
| ---------- | --------- | ---------------------------------------------------------------------------- |
| _(base)_   | 320       | Single column, bottom nav, sheets, 16px inputs                               |
| `xs` (new) | 400       | Large phones: allow 2-up chips/cards where they fit                          |
| `sm`       | 640       | Landscape phones / small tablets                                             |
| `md`       | 768       | Tablets: icon rail, 2-col grids                                              |
| `lg`       | 1024      | **Desktop shell** (full rail, split panes, fixed-viewport pages) — unchanged |
| `xl`/`2xl` | 1280/1536 | Existing scaling up to the 1728 Figma frame                                  |

## 4. Pattern catalogue (what each component _becomes_ on small screens)

| Pattern                                                           | < md (phone)                                                                                             | md–lg (tablet)                   | ≥ lg           |
| ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------- | -------------- |
| Marketing `Navbar`                                                | Logo + hamburger → full-height sheet; CTA pinned at bottom                                               | Inline links                     | Existing       |
| Dashboard nav (`DashboardSidebar`)                                | **Bottom tab bar** (Home · Talent · Postings · Messages · More→drawer)                                   | Collapsed icon rail              | Existing rail  |
| App headers (Engagement, Skills Lab, profile-filling)             | Logo · title · **Save & Exit** · `⋯` overflow (Switch Modes, Help, Profile)                              | Inline cluster w/o labels        | Existing       |
| Progress strip / breadcrumb                                       | Single "Step 4 of 9 · 44%" line + bar; breadcrumb → current step only                                    | Truncated crumbs                 | Existing       |
| Content + insight aside (profile-filling stages, community rails) | Aside becomes collapsible "Why this matters" accordion _below_ content                                   | Aside under content, 2-col cards | Existing split |
| Chat + side panel (Career Buddy)                                  | Segmented switch **Chat / Profile**; composer pinned above keyboard                                      | Chat full width, panel as drawer | Existing       |
| List ⇄ detail (Messages)                                          | List screen → thread screen with back arrow (master-detail)                                              | Existing stacked → side-by-side  | Existing       |
| Filters / search rows                                             | Search full-width; filters in a **bottom sheet** with count badge                                        | Inline chips, wrap               | Existing       |
| KPI / stat cards                                                  | 1-up, or horizontal scroll-snap row                                                                      | 2-up                             | 4-up           |
| Kanban (pipeline)                                                 | Horizontal scroll-snap columns + stage chips as jump nav                                                 | 2 visible columns                | Existing       |
| Modals (43 files)                                                 | **Full-screen sheet**, sticky action footer, safe-area padding                                           | Centered, `max-h-dvh`            | Existing       |
| Toasts                                                            | Full-width, top, `calc(100vw - 32px)`                                                                    | Existing                         | Existing       |
| Floating Career Buddy                                             | 56px, safe-area offset, auto-hides on keyboard / on Career Buddy page; main gets matching bottom padding | 72px                             | 100px (Figma)  |
| Avatar customiser                                                 | Preview pinned top (~38dvh), option tabs + grid scroll below                                             | Side-by-side                     | Existing       |
| Game boards (Skills Lab)                                          | Per-game portrait layout; board scales to `min(100vw-32px, …)`                                           | Existing                         | Existing       |

## 5. Phased execution

Order = leverage first: **~8 shared components unlock ~50 of 73 routes**. Every phase ends with the Phase-0 gate green.

| Phase                                                                   | Scope                                                                                                                                                                                                                                                                                                                                                                                          | Routes unlocked  | Effort (rough)              |
| ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | --------------------------- |
| **0 · Foundations + gate**                                              | Breakpoint tokens (`xs`), `dvh`/safe-area/`--tap-min` utilities, `useBreakpoint` hook; **promote the audit harness to `scripts/responsive-audit.mjs` + a Playwright spec** that fails on: horizontal overflow, clipped CTAs, tap < 24px, text < 12px, at 320/375/768/1024/1440 over every route; visual baselines; make DemoNavigator (DEV-only) collapsible so it stops polluting screenshots | all (safety net) | 2–3 d                       |
| **1 · Shared chrome**                                                   | `Navbar` mobile menu · dashboard bottom-tab/drawer · unified `AppHeader` w/ overflow menu (Engagement/SkillsLab/profile-filling) · progress strip + breadcrumbs · Modal→sheet shell · Toast · floating Career Buddy                                                                                                                                                                            | ~50              | 5–7 d                       |
| **2 · Profile-filling + engagement + Skills Lab** (the critical family) | New `StageLayout` (content + aside → stack/accordion); migrate 9 intro/stage pairs; Career Buddy Chat/Profile switch + keyboard-safe composer; avatar customiser; milestone pages; Skills Lab nav + 23 components get a mobile pass                                                                                                                                                            | ~30              | 8–12 d                      |
| **3 · Recruiter dashboard + community**                                 | KPI grid, filter sheet, pipeline scroll-snap, talent-search cards, Messages master-detail (list↔thread), Job Postings/Templates/Screening rows, community 3-col → tabs, Create/Report/Share modals                                                                                                                                                                                             | ~11              | 5–7 d                       |
| **4 · Onboarding polish**                                               | Breadcrumb compaction, 16px fields + `autocomplete`/`inputmode`, sticky primary CTA bars, tap-target pass, upload dropzone, Excel-template mockup overflow, review-card grids                                                                                                                                                                                                                  | ~34              | 3–4 d (already mostly good) |
| **5 · Landing + footer**                                                | Landing is an unbuilt stub → build **mobile-first** when Figma lands; Footer 2-col at 320                                                                                                                                                                                                                                                                                                      | 2                | with landing build          |
| **6 · Hardening**                                                       | Perf budget (compress/convert 22 heavy PNGs to WebP/AVIF + `srcset`, `React.lazy` route splitting, target < 300 KB gz initial), a11y (200% text, 400% zoom reflow, focus order in sheets), landscape 568×320, real-device matrix (iPhone SE/13, Pixel 7, iPad)                                                                                                                                 | all              | 4–5 d                       |

Rough total ≈ **27–38 engineering days**; phases 1–3 deliver ~90% of the visible value. Estimates are `⚠️ ASSUMPTION` — they firm up after Phase 0.

## 6. Definition of done (per route)

1. No horizontal scroll and nothing clipped/unreachable from **320 → 1920**.
2. Body ≥ 14px, **inputs 16px**, interactive targets ≥ 44px (never < 24px).
3. Primary CTA reachable without zoom; on-screen keyboard never hides the focused field or composer.
4. Usable at 200% text scale and 400% browser zoom (WCAG 1.4.4 / 1.4.10).
5. No hover-only affordances; modals trap focus and fit `100dvh`.
6. Desktop (≥ lg) visually unchanged vs. baseline screenshots (diff reviewed).
7. Responsive Playwright gate green; `npm run lint`, `build` pass; wiki updated (`log.md`, `components.md`, this page).

## 7. Decisions needed before Phase 1

1. **Mobile design source.** Figma has no mobile frames. Proposal: I define the patterns in §4, a designer approves them (or supplies frames) before each phase; until then they're `⚠️ ASSUMPTION`. _Who signs off?_
2. **Amend `figma-fidelity.md`** so "pixel-exact" applies at ≥ lg and §3 principles apply below. OK?
3. **Dashboard mobile nav:** bottom tab bar (recommended — thumb reach, 5 destinations fit) vs. top hamburger drawer.
4. **Scope of Phase 6 perf work:** in this effort, or a separate track? (Heavy assets matter for Ghana mobile data costs.)
5. **Landscape phones (568×320):** supported target or best-effort?

## 8. Known risks

- Converting `h-screen` shells touches 37 files — highest regression risk; mitigated by desktop visual-diff in the gate.
- `clamp(vw)` typography has hidden coupling to layout widths; change floors, not the fluid slope, to keep desktop identical.
- The audit page-level overflow metric under-reports clipped content; the gate must also check "CTA in viewport / scrollable" (Phase 0).
- Port `5173` on this machine currently serves a _different_ app (redirects to `/admin/`); run this project on an explicit port (`npx vite --port 5199`) when auditing or Playwright's `reuseExistingServer` will hit the wrong app. `✅ VERIFIED` 2026-10-08.
