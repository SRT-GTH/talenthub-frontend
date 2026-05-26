# TalentHub — Frontend Development SOP

> **Document version:** 1.0
> **Date:** 2026-05-20
> **Project:** TalentHub Web Platform (talent + admin)
> **Stack:** Vite 7 · React 19 · Tailwind CSS 4 · React Router 6 · Redux Toolkit · axios · react-hook-form + zod · Playwright
> **Audience:** Frontend engineers (junior → senior) working with AI-augmented tooling (Claude Code + Figma MCP + Playwright MCP)

---

## Table of Contents

1. Project Overview & Architecture
2. Development Environment Setup
3. Directory Structure & Naming Conventions
4. Design System & Theming Reference (Tailwind v4 + `@theme`)
5. Component Development Standards
6. State Management with Redux Toolkit
7. API Integration with axios
8. Forms with react-hook-form + zod
9. Routing & Layout Architecture
10. Page Development Procedures
11. Wiki Discipline (the source of truth)
12. Debug-Log Discipline (mandatory)
13. AI-Augmented Workflow (Claude Code + MCP)
14. Testing & Verification
15. Git Workflow & Pre-Commit Hooks
16. Security & Performance Standards
17. Accessibility Standards
18. Code Review Framework
19. Figma Fidelity & Design Reference
20. Appendices

---

## 1. Project Overview & Architecture

### 1.1 What is TalentHub?

TalentHub is a Ghana-rooted talent and career-development platform. Talents discover career paths, build a portfolio, complete a guided onboarding journey, customise an in-platform avatar, earn XP / milestones, and surface themselves to recruiters and partners. A reserved `/admin/*` slot will host the back-office subsystem (lazy-loaded) when that product area lands.

The frontend in this repository ships the **talent-facing experience**:

- Landing page (`/`)
- Authentication surfaces (`/login`, `/get-started`)
- Onboarding journey (`/onboarding/talent/welcome` … `/onboarding/talent/review`)
- Profile engagement — identity map, milestone unlocks, avatar customiser (`/profile/engagement/*`)
- A design-system playground (`/components`)

### 1.2 Two Chrome Contexts

The platform has two distinct UI shells, driven by route inside `MainLayout`:

- **Main chrome** — full marketing `Navbar` + page + full `Footer` (logo, link columns, contact). Used by the landing, design-system, and post-onboarding surfaces.
- **Onboarding chrome** — slim cream `OnboardingNavbar` + page + **slim onboarding footer** (per Figma, the onboarding flow keeps a minimal footer — typically copyright + a short legal link row — so the user retains context without being pulled into the marketing nav). Used by `/login`, `/get-started`, and every `/onboarding/*` page.

> ⚠️ **Known drift (as of 2026-05-20):** The current `MainLayout.jsx` renders **no footer at all** on onboarding paths (`{onboarding ? null : <Footer />}`), based on an older reading of the design. Figma actually shows a slim onboarding footer. Track the fix under a small `feat(layout): slim onboarding footer` task, update the relevant wiki claim from `✅ VERIFIED` to `🪦 STALE` until the slim footer ships, then re-verify.

Profile engagement pages (`/profile/engagement/*`) own their own chrome and mount **outside** `MainLayout`.

### 1.3 Technology Stack

| Layer           | Tech                    | Version          | Purpose                                             |
| --------------- | ----------------------- | ---------------- | --------------------------------------------------- |
| Build           | Vite                    | ^7.0.4           | Dev server + production build                       |
| UI              | React                   | ^19.2.0          | Function components + hooks only                    |
| Language        | Plain JavaScript        | —                | No TypeScript                                       |
| Routing         | React Router DOM        | ^6.30.1          | Config-based routing in `src/App.jsx`               |
| State           | Redux Toolkit           | ^2.11.2          | Global state via slices                             |
| State (persist) | redux-persist           | ^6.0.0           | Auth + profile persistence (wire when auth lands)   |
| HTTP            | axios                   | ^1.12.2          | Single configured instance in `src/services/api.js` |
| Forms           | react-hook-form         | ^7.54.0          | Form state + validation orchestration               |
| Validation      | zod                     | ^3.24.1          | Schema-first validation                             |
| Form bridge     | @hookform/resolvers     | ^3.9.1           | Connects zod to react-hook-form                     |
| Styling         | Tailwind CSS            | ^4.1.11          | Utility-first; tokens in `src/index.css` `@theme`   |
| Cookies         | universal-cookie        | ^8.0.1           | Cookie read/write (auth-adjacent surfaces)          |
| Lint            | ESLint flat config      | ^9.30.1          | Code quality                                        |
| Format          | Prettier                | ^3.4.2           | Code style                                          |
| E2E             | Playwright              | ^1.49.1          | End-to-end tests in `tests/e2e/`                    |
| Hooks           | Husky + lint-staged     | ^9.1.7 / ^15.3.0 | Pre-commit + commit-msg hooks                       |
| Commits         | commitlint conventional | ^19.6.x          | Conventional-commit enforcement                     |

### 1.4 Architecture (Mental Model)

```
Browser
└── React App (Vite dev server / static build)
    ├── BrowserRouter (src/App.jsx)
    │   ├── MainLayout (Navbar | OnboardingNavbar  +  <Outlet/>  +  Footer?)
    │   │   ├── LandingPage          /
    │   │   ├── LoginPage            /login
    │   │   ├── GetStartedPage       /get-started
    │   │   ├── Onboarding flow      /onboarding/talent/*   (wrapped in OnboardingProvider)
    │   │   └── HomePage (DS playground)  /components
    │   └── Profile engagement (own chrome)  /profile/engagement/*
    │
    ├── Redux store (src/store/index.js)
    │   └── Slices (src/store/slices/* — add as features land)
    │       └── Thunks → axios (src/services/api.js) → Backend API
    │
    └── Tailwind v4 (@tailwindcss/vite)
        └── Design tokens (src/index.css @theme block)
```

### 1.5 Design Viewport

Figma designs live at the **1728 px desktop frame**. The `MainLayout` clamps the rendered tree to `max-w-[1728px]` and centres it on larger viewports. Mobile + tablet frames are **derived via `clamp()`** rather than separate static breakpoints — see §19 (Figma Fidelity) and the rules in `wiki/figma-fidelity.md`.

---

## 2. Development Environment Setup

### 2.1 Prerequisites

Required:

- **Node.js ≥ 18** (`node -v`) — `package.json` `engines` enforces this
- **npm ≥ 9** (`npm -v`)
- **Git** (`git --version`)

Recommended:

- **VS Code** with extensions: ESLint, Prettier, Tailwind CSS IntelliSense, ES7+ React/Redux snippets
- **Playwright extension** (`ms-playwright.playwright`) for spec running from the IDE
- **Figma desktop app** (required for Figma Dev Mode MCP — see §13.4)

### 2.2 Clone and Install

```bash
git clone <repository-url> talenthub-frontend
cd talenthub-frontend
npm install                  # installs deps; husky prepares git hooks via "prepare"
cp .env.example .env         # fill in VITE_API_BASE_URL
```

### 2.3 Environment Variables

Vite only exposes variables prefixed with `VITE_` to the client. Read them via `import.meta.env.VITE_*`.

| Variable            | Required | Example                            | Where it's read             |
| ------------------- | -------- | ---------------------------------- | --------------------------- |
| `VITE_API_BASE_URL` | yes      | `https://api.talenthub.example/v1` | `src/services/api.js`       |
| `VITE_APP_NAME`     | no       | `TalentHub`                        | UI strings (titles, labels) |

Restart the dev server after editing `.env` — Vite reads it only at startup.

### 2.4 Scripts

| Command                   | Purpose                                           |
| ------------------------- | ------------------------------------------------- |
| `npm run dev`             | Vite dev server on **http://localhost:5173**      |
| `npm run build`           | Production build to `dist/`                       |
| `npm run preview`         | Serve the production build on port 4173           |
| `npm run lint`            | ESLint (flat config) over the repo                |
| `npm run lint:fix`        | ESLint with auto-fix                              |
| `npm run format`          | Prettier write (whole repo)                       |
| `npm run format:check`    | Prettier check (CI-safe, no writes)               |
| `npm run test:e2e`        | Playwright suite (boots dev server automatically) |
| `npm run test:e2e:ui`     | Playwright UI mode                                |
| `npm run test:e2e:headed` | Playwright with a visible browser                 |

### 2.5 Build Pipeline (how the bytes flow)

The Tailwind v4 compiler runs as a **Vite plugin** (`@tailwindcss/vite`), not via PostCSS:

1. `src/index.css` imports Tailwind and declares the `@theme` block — the **single source of truth** for design tokens (colors, typography, radii, shadows, spacing).
2. `@tailwindcss/vite` reads the `@theme` block and generates every utility class (`bg-brand-green`, `text-display-md`, `rounded-pill`, …).
3. `tailwind.config.js` is _informational only_ — it exists for editor tooling. **Do not put tokens there.**
4. Vite serves the result in dev with HMR and bundles a chunked production build (vendor / router / redux split per `vite.config.js`).

### 2.6 MCP Servers (Claude Code sessions)

The project ships an `.mcp.json` declaring two MCP servers Claude Code loads at session start:

- **Playwright MCP** (`@playwright/mcp@latest`, npx-launched) — navigate, screenshot, inspect the browser console.
- **Figma MCP** (HTTP, `http://127.0.0.1:3845/mcp`) — read Figma design specs.

The Figma server is provided by the **official Figma desktop app**. Enable it under _Figma → Preferences → Enable Dev Mode MCP Server_ before starting a session that touches design extraction. If you change `.mcp.json`, restart Claude Code so the new server registers.

---

## 3. Directory Structure & Naming Conventions

### 3.1 Canonical Tree (current + reserved)

```
talenthub-frontend/
├── .husky/                    # pre-commit + commit-msg hooks (Husky)
├── .mcp.json                  # Playwright + Figma MCP for Claude Code
├── .prettierrc                # Prettier config (semi true, singleQuote, printWidth 100)
├── .editorconfig              # cross-editor LF + 2-space indent
├── eslint.config.js           # ESLint flat config + prettier compatibility
├── playwright.config.js       # Playwright (boots dev server on :5173)
├── vite.config.js             # Vite + react + @tailwindcss/vite + chunk splitting
├── tailwind.config.js         # informational only (tokens live in src/index.css)
├── commitlint.config.js       # conventional-commits
├── vercel.json                # Vercel SPA rewrites
├── CLAUDE.md                  # engineering rules for Claude Code sessions
├── README.md                  # quick-start
├── docs/
│   ├── SOP.md                 # ← this document
│   └── user stories/          # GTH user-story DOCX bundles (per feature batch)
├── wiki/                      # living knowledge base (Karpathy LLM-Wiki pattern)
│   ├── INDEX.md
│   ├── architecture.md
│   ├── routing.md
│   ├── api.md
│   ├── components.md
│   ├── design-tokens.md
│   ├── figma-fidelity.md
│   ├── figma-node-map.md
│   ├── debugging-workflow.md
│   ├── pre-commit-workflow.md
│   └── log.md
├── public/                    # static assets served as-is
├── src/
│   ├── main.jsx               # StrictMode + createRoot + index.css
│   ├── App.jsx                # BrowserRouter + Routes (config-based)
│   ├── App.css                # minimal global resets
│   ├── index.css              # ★ Tailwind v4 @theme tokens (design system)
│   ├── admin/                 # reserved — future lazy-loaded admin subsystem
│   ├── assets/
│   │   ├── brand/             # logo PNG / SVG
│   │   ├── hero/              # landing-page hero assets
│   │   ├── login/             # auth-page aside imagery
│   │   ├── engagement/        # avatar + milestone assets
│   │   └── getStarted/        # role-select imagery
│   ├── components/
│   │   ├── ui/                # design-system primitives (Button, Card, Modal, …)
│   │   │   └── form/          # Field, TextInput, Textarea, Select, Checkbox, VerificationCode, Upload
│   │   ├── shared/            # cross-feature (Navbar, OnboardingNavbar, Footer, Logo, modals)
│   │   ├── sections/          # per-page composed sections (e.g. landing/HeroSection.jsx)
│   │   └── cards/             # specialised cards (EntryMethodCard, StageMapNode, …)
│   ├── constants/             # ROUTES (future), STORAGE_KEYS, PROFILE_STAGES, …
│   ├── hooks/                 # custom React hooks (useOnboarding, useDebounce, …)
│   ├── layout/                # MainLayout (and future AdminLayout)
│   ├── pages/                 # top-level routed pages (LandingPage, LoginPage, GetStartedPage, HomePage)
│   │   ├── onboarding/        # 8-step onboarding flow
│   │   └── engagement/        # profile engagement pages (identity map, avatar, milestones)
│   ├── providers/             # context providers (OnboardingProvider) + redux <Provider> wiring
│   ├── services/              # API clients (api.js axios instance + per-resource modules)
│   ├── store/
│   │   ├── index.js           # configureStore
│   │   └── slices/            # one slice per domain (auth, profile, engagement, …)
│   └── utils/                 # classNames, debug, figmaPosition (leaf utilities)
└── tests/
    └── e2e/                   # Playwright specs
```

### 3.2 Naming Conventions

| Kind                      | Convention                                      | Example                                |
| ------------------------- | ----------------------------------------------- | -------------------------------------- |
| Components / pages        | PascalCase `.jsx`                               | `Navbar.jsx`, `HomePage.jsx`           |
| Hooks                     | camelCase, `use` prefix, `.js`                  | `useOnboarding.js`, `useDebounce.js`   |
| Utilities                 | camelCase `.js`                                 | `classNames.js`, `debug.js`            |
| Constants (export name)   | UPPER_SNAKE_CASE                                | `STORAGE_KEYS`, `PROFILE_STAGES`       |
| Constants (file)          | camelCase                                       | `storageKeys.js`, `profileStages.js`   |
| Env vars                  | `VITE_*` UPPER_SNAKE                            | `VITE_API_BASE_URL`                    |
| Slices                    | `<domain>Slice.js`                              | `authSlice.js`, `profileSlice.js`      |
| Services                  | `<domain>Service.js` (re-exports from `api.js`) | `authService.js`, `profileService.js`  |
| Folders                   | camelCase or kebab-case for assets              | `engagement/`, `getStarted/`           |
| Component name (export)   | PascalCase, matches file name                   | `export default MainLayout;`           |
| Props                     | camelCase                                       | `isActive`, `onClick`, `className`     |
| Event handlers (internal) | `handle` + Event                                | `handleSubmit`, `handleChange`         |
| Event handlers (props)    | `on` + Event                                    | `onSubmit`, `onChange`                 |
| Boolean props             | `is` / `has` / `should` prefix                  | `isLoading`, `hasError`, `shouldFocus` |
| Test files                | `tests/e2e/<name>.spec.js`                      | `home.spec.js`                         |

### 3.3 Import Order Convention

Apply this order top-to-bottom in every file. Prettier won't reorder for you — discipline matters.

```javascript
// 1. React and framework
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// 2. Redux slices and actions
import { fetchProfile } from '../store/slices/profileSlice.js';

// 3. Services
import profileService from '../services/profileService.js';

// 4. Custom hooks
import { useOnboarding } from '../hooks/useOnboarding.js';

// 5. Components (shared → ui → cards/sections → page-local)
import Navbar from '../components/shared/Navbar.jsx';
import Button from '../components/ui/Button.jsx';
import EntryMethodCard from '../components/cards/EntryMethodCard.jsx';

// 6. Utilities and constants
import { classNames } from '../utils/classNames.js';
import { debug } from '../utils/debug.js';
import { STORAGE_KEYS } from '../constants/storageKeys.js';

// 7. Assets (icons, images)
import logo from '../assets/brand/gth-mark.png';
```

ESLint's flat config does not auto-sort imports today; if a future change adds `eslint-plugin-import` sort rules, follow that. Until then, the order above is enforced by review.

---

## 4. Design System & Theming Reference

### 4.1 Token Source of Truth

All design tokens live in **`src/index.css` inside the `@theme { }` block**. Tailwind v4 reads them at build time and emits utilities automatically. **Never hardcode hex values in component files** — if a colour isn't in the theme, add it to the theme first.

The tokens were extracted on **2026-05-04** from Figma file _"Gh Design system - onboading"_ (`Bin8roWL8sloyc36IgFMuT`). See `wiki/design-tokens.md` for the full table and `wiki/figma-node-map.md` for per-token Figma node IDs.

### 4.2 Colour Families

Every family follows the **same 10-step state ladder** so utilities are predictable.

| Suffix          | Figma swatch   | Use                                     |
| --------------- | -------------- | --------------------------------------- |
| `-light`        | Light          | subtle background fills                 |
| `-light-hover`  | Light :hover   |                                         |
| `-light-active` | Light :active  |                                         |
| _(none)_        | Normal         | default fill / button background        |
| `-hover`        | Normal :hover  |                                         |
| `-active`       | Normal :active |                                         |
| `-dark`         | Dark           | strong emphasis fill                    |
| `-dark-hover`   | Dark :hover    |                                         |
| `-dark-active`  | Dark :active   |                                         |
| `-darker`       | Darker         | deepest emphasis (omitted in `success`) |

Brand families:

- **`brand-green`** — Ghana-flag green, default action colour. `--color-brand-green` = `#387440`.
- **`accent`** — Gold accents. `--color-accent` = `#c8951a`.
- **`neutral`** — Grey-neutrals scale.
- **`black`** — Foreground / text scale. **`bg-black` is `#111111`, not pure `#000`** (Tailwind default overridden).
- **`yellow`** — Warm cream backgrounds (`--color-yellow` = `#fbf4e0`).

Semantic families (Figma `45:11090` _Colors – Semantic colors_):

- **`informative`** (blue) — informational UI
- **`success`** (green) — success states. **9 swatches only — no `darker`.**
- **`warning`** (orange) — warnings
- **`danger`** (red) — errors, destructive actions

Surface / content / border tokens:

| Token                        | Hex       | Use                       |
| ---------------------------- | --------- | ------------------------- |
| `--color-content-primary`    | `#272e35` | primary text              |
| `--color-content-secondary`  | `#555f6d` | secondary text            |
| `--color-content-tertiary`   | `#7e8b99` | tertiary text             |
| `--color-background-default` | `#ffffff` | default page background   |
| `--color-background-subtle`  | `#f5f7f9` | subtle section background |
| `--color-border-default`     | `#e9ecef` | default border            |
| `--color-border-neutral`     | `#555f6d` | stronger border           |

Usage:

```jsx
<button className="bg-brand-green hover:bg-brand-green-hover active:bg-brand-green-active text-white">
<p className="text-content-primary">
<div className="bg-background-subtle border border-border-default">
```

### 4.3 Typography

Two families:

- **Body / paragraphs** — `--font-sans` resolves to `'SF Pro Rounded', -apple-system, BlinkMacSystemFont, 'Nunito', system-ui, sans-serif`. SF Pro Rounded is **Apple's proprietary system font** — Apple devices use it natively; everything else falls back to Nunito (Google Fonts).
- **Display / headings** — `--font-display` resolves to `'Instrument Serif', Georgia, serif`. Loaded from Google Fonts.

The display family auto-applies to any `text-display-*` utility — no need to also write `font-display`.

| Display token         | Size / line-height | Weight                 |
| --------------------- | ------------------ | ---------------------- |
| `text-display-xl`     | 72 / 72            | 600                    |
| `text-display-lg`     | 52 / 52            | 600                    |
| `text-display-md`     | 36 / 40            | 600                    |
| `text-display-sm`     | 16 / 19            | 600                    |
| `text-display-italic` | 22 / 32            | 400 (Instrument Serif) |

Paragraph scale (3 weights × 9 sizes, all Inter):

| Weight family | Prefix          | font-weight | letter-spacing |
| ------------- | --------------- | ----------- | -------------- |
| Strong        | `text-strong-*` | 600         | 0.1 px         |
| Medium        | `text-medium-*` | 450         | 0.2 px         |
| Normal        | `text-normal-*` | 400         | 0.2 px         |

Sizes (suffix → font/line in px):
`25` (10/16) · `50` (12/20) · `75` (14/24) · `100` (16/28) · `200` (18/32) · `300` (24/36) · `400` (32/44) · `500` (40/56) · `600` (48/64).

Example: `text-strong-100` = Inter SemiBold 16/28, letter-spacing 0.1 px.

### 4.4 Spacing, Radii, Shadows

- **Spacing** — `--spacing` = `0.25rem` (4 px). Class names map directly to Figma's 8-point grid: `p-1` (4 px), `p-2` (8 px), `p-4` (16 px), `p-6` (24 px), `p-8` (32 px), `p-10` (40 px), `p-12` (48 px), `p-16` (64 px), `p-20` (80 px). Prefer the documented values; skipped numbers (9, 11, 13–15) work mathematically but aren't part of the design vocabulary.
- **Radius** — `rounded-sm` (6 px), `rounded-md` (10 px), `rounded-lg` (16 px), `rounded-xl` (24 px), `rounded-pill` (100 px).
- **Shadows** — `shadow-sm` / `shadow-md` / `shadow-lg` (general), `shadow-bottom-100..400` (standard elevation ladder), `shadow-top-100..400` (above-surface), `shadow-green` (primary CTA glow), `shadow-button-shelf` (4 px "shelf" under primary buttons — Figma `50:8233`).

### 4.5 Layout Container

`MainLayout` clamps the column to 1728 px and centres it. Inside a section, the standard guide is:

```jsx
<section className="mx-auto w-full max-w-[1728px] px-[clamp(1rem,4vw,2rem)]">
  {/* content */}
</section>
```

Use `clamp()` for fluid horizontal padding rather than breakpoint-based static values (see §19).

---

## 5. Component Development Standards

### 5.1 The Component Pattern

Every UI primitive in `src/components/ui/` follows this shape. Replicate it for new primitives.

```jsx
import { forwardRef } from 'react';
import { classNames } from '../../utils/classNames.js';
import { debug } from '../../utils/debug.js';

const log = debug('Button');

const VARIANTS = {
  primary: 'bg-brand-green border-brand-green-dark text-white',
  secondary: 'bg-accent border-accent-dark text-accent-light',
  tertiary: 'bg-white border-black/30 text-black',
};

const SIZES = {
  lg: 'px-[34px] py-[16px] rounded-[14px]',
  md: 'px-[28px] py-[14px] rounded-[10px]',
  sm: 'px-[18px] py-[12px] rounded-[10px]',
};

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'lg',
    disabled = false,
    leftIcon,
    rightIcon,
    className = '',
    children,
    ...rest
  },
  ref
) {
  log('render', { variant, size, disabled });

  return (
    <button
      ref={ref}
      type="button"
      disabled={disabled}
      className={classNames(
        'inline-flex items-center justify-center gap-2 transition-all duration-300 ease-in',
        'shadow-button-shelf active:translate-y-1 active:shadow-none',
        VARIANTS[variant],
        SIZES[size],
        disabled && 'opacity-55 cursor-not-allowed',
        className
      )}
      {...rest}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  );
});

export default Button;
```

### 5.2 Mandatory Patterns

1. **`forwardRef`** — every UI primitive must forward its ref so parents can integrate with form libraries and focus management.
2. **`classNames()` utility** — never string-concatenate Tailwind classes; never use template literals for conditional classes. `classNames()` lives in `src/utils/classNames.js`.
3. **Variant / size objects** — flat lookup tables, not inline ternaries inside JSX. Makes diffs reviewable and Storybook-style showcases trivial.
4. **`...rest` spread on the root element** — so consumers can pass `aria-*`, `data-*`, `name`, `id`, etc.
5. **`className` last** — the consumer-passed `className` must be the last argument to `classNames()` so it overrides defaults.
6. **Controlled + uncontrolled support** — stateful primitives (TextInput, Select, VerificationCode, Checkbox) must accept both `value` (controlled) and `defaultValue` (uncontrolled). Use the `isControlled = value !== undefined` pattern.
7. **State derivation priority** — when multiple prop signals could change visuals, document the precedence ladder. The form primitives use:
   `forced state prop  →  disabled  →  error  →  verified  →  interactive (focus-within)`.
8. **Transitions** — `transition-all duration-300 ease-in` on every interactive element so hover, active, and disabled transitions feel consistent.
9. **Showcase-only `state` prop** — primitives expose a `state` prop (e.g. `'default' | 'hover' | 'selected' | …`) so the design-system playground (`/components`) can pin a visual without user interaction. **Production callers omit this** — `:hover` and `:active` drive state naturally.
10. **Single-file components** — one component per file, default export. Compound components (e.g. `Field` + form primitives) can share a folder with a barrel `index.js`.

### 5.3 Component Categories

| Folder                 | Examples                                                                                                                                                        | Purpose                                                                                                       |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `components/ui/`       | Button, Card, MiniCard, Tag, ProgressBar, ProgressRing, Loader, Modal, Breadcrumbs, Captions, StatusDot, ChatBubble, WatchTutorial, EngagementProgressIndicator | Design-system primitives. Pure, presentational, no app state.                                                 |
| `components/ui/form/`  | Field, TextInput, Textarea, Select, Checkbox, VerificationCode, Upload                                                                                          | Form primitives. Hybrid API (Field props + native `<input>` props). Plug into react-hook-form's `register()`. |
| `components/shared/`   | Navbar, OnboardingNavbar, OnboardingHeader, Footer, Logo, WavyDivider, modals (Privacy, Terms, Consent)                                                         | Cross-feature components. May call into app state.                                                            |
| `components/sections/` | `landing/HeroSection.jsx`, `landing/HeroPhotoCard.jsx`                                                                                                          | Composed page sections (one Figma frame = one section). Pages assemble these.                                 |
| `components/cards/`    | EntryMethodCard, ProfileStageCard, StageMapNode, MilestoneStatTile, UnlockedFeatureCard                                                                         | Specialised cards (often feature-specific, often referenced from sections).                                   |

### 5.4 New-Component Checklist

1. Open the Figma frame and capture the node ID (`wiki/figma-node-map.md`).
2. Enumerate **every visual state** (default, hover, active, focus, disabled, error, selected, loading, empty).
3. Create the file in the right folder per §3.1.
4. Implement using the pattern in §5.1.
5. Add a showcase to `src/pages/HomePage.jsx` covering all variant × size × state permutations.
6. Append a `wiki/components.md` row with props table, state derivation, and Figma source.
7. Take a Playwright MCP screenshot at 390 / 768 / 1440 widths and compare to Figma.
8. Add `log('render', { variant, size, disabled })` at minimum (see §12).

---

## 6. State Management with Redux Toolkit

### 6.1 Store

The store lives in `src/store/index.js`. It starts empty — add slices to `reducer` as features land.

```javascript
// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import profileReducer from './slices/profileSlice.js';
import engagementReducer from './slices/engagementSlice.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    engagement: engagementReducer,
  },
});

export default store;
```

When auth ships, wire **redux-persist** here. Pattern (whitelisted to `auth` + `profile`):

```javascript
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const persistConfig = { key: 'th-root', storage, whitelist: ['auth', 'profile'] };
const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  engagement: engagementReducer,
});

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefault) =>
    getDefault({ serializableCheck: { ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'] } }),
});
export const persistor = persistStore(store);
```

### 6.2 Slice Template

```javascript
// src/store/slices/profileSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from '../../services/profileService.js';
import { debug } from '../../utils/debug.js';

const log = debug('profileSlice');

export const fetchProfile = createAsyncThunk('profile/fetch', async (_, { rejectWithValue }) => {
  try {
    log('fetchProfile: requesting');
    const { data } = await profileService.getMe();
    log('fetchProfile: ok', { id: data?.id });
    return data;
  } catch (err) {
    log.error('fetchProfile: failed', {
      status: err.response?.status,
      message: err.message,
    });
    return rejectWithValue(err.response?.data?.message || 'Failed to load profile');
  }
});

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    me: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearProfile: (state) => {
      state.me = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.me = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
```

### 6.3 Custom Hook Wrapper (one per slice)

```javascript
// src/hooks/useProfile.js
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, clearError, clearProfile } from '../store/slices/profileSlice.js';

export const useProfile = () => {
  const dispatch = useDispatch();
  const { me, isLoading, error } = useSelector((s) => s.profile);

  return {
    me,
    isLoading,
    error,
    loadProfile: () => dispatch(fetchProfile()),
    clearError: () => dispatch(clearError()),
    clearProfile: () => dispatch(clearProfile()),
  };
};
```

**Components never call `useSelector` / `useDispatch` directly** — they consume the hook. This keeps slice internals replaceable and selectors centralised.

### 6.4 Planned Slices

Map each domain to a slice + service + hook (build as features land):

| Slice              | Service              | Hook             | Purpose                                                                   |
| ------------------ | -------------------- | ---------------- | ------------------------------------------------------------------------- |
| `authSlice`        | `authService`        | `useAuth`        | Sign up, log in, OTP, refresh, log out, user profile                      |
| `profileSlice`     | `profileService`     | `useProfile`     | Talent profile, completeness, persisted across reloads                    |
| `onboardingSlice`  | `onboardingService`  | `useOnboarding`  | (Currently a React Context — promote to Redux if cross-route state grows) |
| `engagementSlice`  | `engagementService`  | `useEngagement`  | XP, milestones, identity map, avatar selections                           |
| `highlightSlice`   | `highlightService`   | `useHighlight`   | Highlighting batches (per GTH_Highlighting user stories)                  |
| `prospectingSlice` | `prospectingService` | `useProspecting` | Job-prospecting flows (per GTH_JobProspecting)                            |

### 6.5 When to Use Redux vs Local vs Context

| Scope                                                | Choose        |
| ---------------------------------------------------- | ------------- |
| Single component, single screen                      | `useState`    |
| Multiple components, single screen                   | Lift state up |
| Shared across a route subtree (e.g. onboarding flow) | React Context |
| Shared across the whole app, async, persisted        | Redux slice   |

The onboarding flow uses **`OnboardingProvider`** (`src/providers/OnboardingProvider.jsx`) because DOB captured on step 01 drives the breadcrumb and the under-18 branch on later steps — that's a route-subtree scope, not whole-app. Don't promote to Redux unless data must outlive the route subtree.

---

## 7. API Integration with axios

### 7.1 The single axios Instance

`src/services/api.js` exports a single configured axios instance. **Every service module imports from this file** — never call `axios.create()` elsewhere.

```javascript
import axios from 'axios';
import { STORAGE_KEYS } from '../constants/storageKeys.js';
import { debug } from '../utils/debug.js';

const log = debug('api');

const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';
log('baseURL:', baseURL);

export const api = axios.create({
  baseURL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.authToken);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  log('→', config.method?.toUpperCase(), config.url);
  return config;
});

api.interceptors.response.use(
  (response) => {
    log('←', response.status, response.config.url);
    return response;
  },
  (error) => {
    log.error('×', error.response?.status, error.config?.url, error.message);
    return Promise.reject(error);
  }
);

export default api;
```

### 7.2 Refresh-Token Flow (to wire when auth ships)

Add a 401-retry interceptor that:

1. Catches 401 on a non-refresh endpoint.
2. POSTs to the refresh endpoint with `STORAGE_KEYS.refreshToken`.
3. On success, updates `STORAGE_KEYS.authToken` and replays the original request.
4. On failure, clears all storage keys and dispatches a logout action that redirects to `/login`.

Track the implementation against `wiki/api.md` (Refresh-Token Flow section) and the relevant user stories in `docs/user stories/`.

### 7.3 Service Module Pattern

```javascript
// src/services/profileService.js
import { api } from './api.js';

const profileService = {
  getMe: () => api.get('/profile/me'),
  updateMe: (data) => api.patch('/profile/me', data),
  uploadAvatar: (formData) =>
    api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export default profileService;
```

### 7.4 Planned Services

Document as you add — keep this table mirrored in `wiki/api.md`.

| Service              | Endpoint       | Key methods                                                      |
| -------------------- | -------------- | ---------------------------------------------------------------- |
| `authService`        | `/auth`        | `signUp`, `login`, `verifyOtp`, `resendOtp`, `refresh`, `logout` |
| `profileService`     | `/profile`     | `getMe`, `updateMe`, `uploadAvatar`                              |
| `onboardingService`  | `/onboarding`  | `saveStep`, `submitFinal`, `getDraft`                            |
| `engagementService`  | `/engagement`  | `getMilestones`, `claimMilestone`, `saveAvatar`                  |
| `highlightService`   | `/highlights`  | `list`, `submit`, `attachMedia`                                  |
| `prospectingService` | `/prospecting` | `getMatches`, `applyToOpportunity`, `bookmark`                   |

### 7.5 Calling axios from Components

**Never call `api.get()` directly from a component.** Always go through a service module imported by a thunk, then expose state via a hook (see §6.3). The two-layer indirection makes mocking trivial for Playwright and keeps endpoint shape change-resilient.

---

## 8. Forms with react-hook-form + zod

react-hook-form orchestrates form state; zod validates. `@hookform/resolvers/zod` is the bridge.

### 8.1 Standard Form Pattern

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput } from '../components/ui/form';
import Button from '../components/ui/Button.jsx';
import { debug } from '../utils/debug.js';

const log = debug('LoginForm');

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

const LoginForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const submit = async (values) => {
    log('submit:', { email: values.email });
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-4">
      <TextInput
        label="Email"
        required
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <TextInput
        label="Password"
        required
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
};
```

### 8.2 Form Conventions

- **Schema lives next to the form** (or under `src/schemas/` for cross-page reuse). Always use zod — never roll a custom validator.
- **Use the `form/` primitives** — they expose Field props (`label`, `required`, `helperText`, `error`, `verified`) plus native `<input>` props so `register()` integrates cleanly. See `wiki/components.md` for state derivation per primitive.
- **`mode: 'onBlur'`** for most forms — fast feedback without thrashing on every keystroke. Use `'onChange'` for guided flows (OTP, password rules) where instant feedback is the UX intent.
- **Error display** — pass `error={errors.<field>?.message}` to the primitive; the primitive applies `aria-invalid` + `role="alert"` automatically.
- **Disable on submit** — gate the submit button on `isSubmitting` and show a `<Loader size="sm" />` inline.
- **No silent failures** — always surface server-side errors. For form-wide errors, set `setError('root', { message })` and render at the top of the form.

### 8.3 Onboarding Flow Specifics

The 8-step onboarding flow shares state across steps via `OnboardingProvider`. Each step page:

1. Reads its slice of state via `useOnboarding()`.
2. Renders the appropriate form primitives.
3. On submit, validates with zod, writes to the provider, and navigates to the next step.
4. The final review page submits the aggregated payload via `onboardingService.submitFinal()`.

DOB on step 01 drives downstream branching (Parent step appears for under-18 talents). Encode that branch in the route logic, not by hiding the step at render time — visibility-only solutions break breadcrumb math.

---

## 9. Routing & Layout Architecture

### 9.1 Routes Today

Config-based routing in `src/App.jsx`. **Not file-based**, no Next.js conventions.

| Path                                                   | Element                      | Layout                              |
| ------------------------------------------------------ | ---------------------------- | ----------------------------------- |
| `/`                                                    | `LandingPage`                | `MainLayout`                        |
| `/login`                                               | `LoginPage`                  | `MainLayout` (onboarding chrome)    |
| `/get-started`                                         | `GetStartedPage`             | `MainLayout` (onboarding chrome)    |
| `/onboarding/talent/welcome`                           | `OnboardingWelcomePage`      | `MainLayout` + `OnboardingProvider` |
| `/onboarding/talent/dob`                               | `OnboardingDobPage`          | same                                |
| `/onboarding/talent/personal-info`                     | `OnboardingPersonalInfoPage` | same                                |
| `/onboarding/talent/contact`                           | `OnboardingContactPage`      | same                                |
| `/onboarding/talent/address`                           | `OnboardingAddressPage`      | same                                |
| `/onboarding/talent/education`                         | `OnboardingEducationPage`    | same                                |
| `/onboarding/talent/parent-info`                       | `OnboardingParentInfoPage`   | same                                |
| `/onboarding/talent/review`                            | `OnboardingReviewPage`       | same                                |
| `/components`                                          | `HomePage` (DS playground)   | `MainLayout`                        |
| `/profile/engagement`                                  | `ProfileEngagementPage`      | own chrome                          |
| `/profile/engagement/identity`                         | `IdentityMapPage`            | own chrome                          |
| `/profile/engagement/milestone`                        | `MilestoneUnlockPage`        | own chrome                          |
| `/profile/engagement/milestone/top-20`                 | `Top20MilestonePage`         | own chrome                          |
| `/profile/engagement/avatar`                           | `AvatarCustomiserPage`       | own chrome                          |
| `/profile/engagement/avatar/{skin,hair,extras,outfit}` | `Avatar*Page`                | own chrome                          |

### 9.2 Reserved Routes

| Path       | Plan                                                                                                                                                              |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/admin/*` | Lazy-loaded admin subsystem (`const AdminApp = lazy(() => import('./admin/AdminApp'))` wrapped in `<Suspense fallback={<Loader />}>`). Mirrors elysium's pattern. |

### 9.3 MainLayout & Chrome Switching

`src/layout/MainLayout.jsx` renders different chrome based on `pathname`. Both the navbar **and the footer** switch — onboarding paths get the slim variants, everything else gets the full marketing chrome:

```jsx
const ONBOARDING_CHROME_PATHS = ['/onboarding/', '/login', '/get-started'];

const MainLayout = () => {
  const { pathname } = useLocation();
  const onboarding = ONBOARDING_CHROME_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p.endsWith('/') ? p : `${p}/`)
  );

  return (
    <div className="min-h-screen mx-auto flex w-full max-w-[1728px] flex-col">
      {onboarding ? <OnboardingNavbar /> : <Navbar />}
      <main className="flex-1">
        <Outlet />
      </main>
      {onboarding ? <OnboardingFooter /> : <Footer />}
    </div>
  );
};
```

> ⚠️ The current code renders `null` instead of `<OnboardingFooter />` on onboarding paths — that's an outstanding bug against the Figma spec (see §1.2). Add `src/components/shared/OnboardingFooter.jsx` (slim copyright + legal-link row), wire it here, and update `wiki/components.md` + `wiki/routing.md` + `wiki/log.md`.

If you add a route that should use onboarding chrome, append its prefix to `ONBOARDING_CHROME_PATHS`. Update `wiki/routing.md` and `wiki/log.md`.

### 9.4 Protected Routes (to wire when auth ships)

Pattern (place under `src/components/shared/` or `src/routes/`):

```jsx
// src/components/shared/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';

const ProtectedRoute = ({ allow = 'authenticated' }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (allow === 'admin' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
```

### 9.5 Adding a Route — Steps

1. Create the page file in `src/pages/<Name>Page.jsx` (or under a sub-folder for feature groupings).
2. (Optional) Add the path to `src/constants/routes.js` once that constants file is introduced.
3. Register the route in `src/App.jsx` under the right layout.
4. Add a nav-link in `Navbar.jsx` or `OnboardingNavbar.jsx` if user-facing.
5. Add a Playwright spec under `tests/e2e/` for non-trivial pages (one `.spec.js` per route minimum).
6. Update `wiki/routing.md` and `wiki/components.md`; append an entry to `wiki/log.md`.

---

## 10. Page Development Procedures

### 10.1 Page Structure Pattern

Pages compose **sections**. Page files contain almost no logic — they import section components and arrange them.

```jsx
// src/pages/LandingPage.jsx
import { debug } from '../utils/debug.js';
import HeroSection from '../components/sections/landing/HeroSection.jsx';
import HeroPhotoCard from '../components/sections/landing/HeroPhotoCard.jsx';

const log = debug('LandingPage');

const LandingPage = () => {
  log('mount');
  return (
    <>
      <HeroSection />
      {/* Future: <FeaturesSection /> <TestimonialSection /> <CTASection /> etc. */}
    </>
  );
};

export default LandingPage;
```

If a page needs data, it does so via slice hooks (§6.3) — never directly through axios.

### 10.2 Pages Inventory & Owners

Map each page to its source-of-truth user-story doc and Figma node. Keep this synced with `wiki/components.md`.

| Page                                             | User-story doc                           | Notes                                                         |
| ------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------- |
| LandingPage                                      | (marketing)                              | Hero + dark-green bg + photo card composition + trust marquee |
| LoginPage                                        | `GTH_Onboarding_v1.3_POST_REVIEW_1.docx` | Aside imagery + email/password form. Slim onboarding chrome.  |
| GetStartedPage                                   | `GTH_Onboarding_v1.3_POST_REVIEW_1.docx` | Role select (Card components in radiogroup pattern).          |
| OnboardingWelcomePage                            | `GTH_Onboarding_v1.3_POST_REVIEW_1.docx` | Intro / consent.                                              |
| OnboardingDobPage                                | same                                     | DOB capture — drives under-18 branch.                         |
| OnboardingPersonalInfoPage                       | same                                     | Name + identity fields.                                       |
| OnboardingContactPage                            | same                                     | Email, phone, OTP verification.                               |
| OnboardingAddressPage                            | same                                     | Region + town.                                                |
| OnboardingEducationPage                          | same                                     | Level + grade (cascading Selects).                            |
| OnboardingParentInfoPage                         | same                                     | Conditional — only renders for under-18 talents.              |
| OnboardingReviewPage                             | same                                     | Aggregated payload review + submit.                           |
| HomePage                                         | (internal — DS playground)               | Renders all primitives × all states for visual QA.            |
| ProfileEngagementPage                            | `GTH_Engagement_Batch1_v1_0.docx`        | Stage card + identity map entry + milestone strip.            |
| IdentityMapPage                                  | `GTH_Engagement_Batch1_v1_0.docx`        | Identity map mosaic + entry method cards.                     |
| MilestoneUnlockPage                              | `GTH_Engagement_Batch2_v1_0.docx`        | Stat tiles + unlocked features.                               |
| Top20MilestonePage                               | `GTH_Engagement_Batch2_v1_0.docx`        | Top-20 milestone celebration.                                 |
| AvatarCustomiserPage (+ skin/hair/extras/outfit) | `GTH_Engagement_Batch3_v1_1.docx`        | Avatar customiser with hero stage + customiser panel.         |

### 10.3 Building a Page — End-to-End

1. **Read the user-story doc** in `docs/user stories/`. Note the acceptance criteria and edge cases.
2. **Pull design specs** from Figma via Figma MCP `get_design_context` / `get_metadata` (see §19). Save outputs to a temp scratch file if the frame is large.
3. **List the sections** the page comprises and what state each needs (local, context, or Redux per §6.5).
4. **Build the sections** in `src/components/sections/<page>/`. Add `debug(scope)` logs (§12).
5. **Compose the page** under `src/pages/`.
6. **Add the route** (§9.5).
7. **Verify**:
   - `npm run lint` clean
   - `npm run format:check` clean
   - `npm run build` clean
   - Playwright spec passes for the route
   - Playwright MCP screenshot at 390 / 768 / 1440 matches Figma
8. **Update the wiki** — append component rows, route rows, and a `log.md` entry.
9. **Commit + push** following §15.

---

## 11. Wiki Discipline (the source of truth)

### 11.1 Why a Wiki

This repo follows the [Karpathy LLM-Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): a **living, persistent, compounding artifact** that captures verified knowledge so future sessions (human or AI) start from a higher floor. **Read `wiki/INDEX.md` at the start of every non-trivial change.**

### 11.2 Confidence Tags (mandatory on every claim)

| Tag                      | Meaning                                                                  |
| ------------------------ | ------------------------------------------------------------------------ |
| `✅ VERIFIED`            | Confirmed by reading current source code or authoritative docs           |
| `🔶 LIKELY`              | Inferred from code patterns or adjacent evidence, not directly confirmed |
| `❓ NEEDS-CLARIFICATION` | Ambiguous — needs human input                                            |
| `⚠️ ASSUMPTION`          | Educated guess, may be wrong                                             |
| `🪦 STALE`               | Was true at one point, may no longer be accurate                         |
| `🔗 EXTERNAL`            | Depends on external system (API, Figma, etc.) — verify before acting     |

**Trust but verify.** If a wiki claim has any tag other than `✅ VERIFIED`, re-check it against current source before acting on it. After verification, upgrade the tag.

### 11.3 When to Update the Wiki

After any significant change:

1. Append an entry to `wiki/log.md` in the format `## [YYYY-MM-DD] action | subject` followed by a short paragraph of context.
2. Update the affected wiki page(s).
3. Keep confidence tags accurate. A change that broke a `✅ VERIFIED` claim demotes it to `🪦 STALE` until re-verified.

### 11.4 Wiki Pages

| Page                     | Owns                                                    |
| ------------------------ | ------------------------------------------------------- |
| `INDEX.md`               | Table of contents + confidence-tag legend               |
| `architecture.md`        | Stack, directory tree, entry points                     |
| `routing.md`             | Route map, layouts, future auth guards                  |
| `api.md`                 | axios client, interceptors, env vars, planned endpoints |
| `components.md`          | Component catalog (props, state, Figma source)          |
| `design-tokens.md`       | Tailwind v4 tokens (colors, type, spacing, radii)       |
| `figma-fidelity.md`      | Pixel-perfect rules + `clamp()` + MCP workflow          |
| `figma-node-map.md`      | Figma frame → node-ID lookup                            |
| `debugging-workflow.md`  | Debug-log discipline + Playwright verification          |
| `pre-commit-workflow.md` | Husky, lint-staged, commitlint, lint fixes              |
| `log.md`                 | Chronological record of changes                         |

---

## 12. Debug-Log Discipline (mandatory)

Adapted from the MangoTV / sibling-project convention. Full details in `wiki/debugging-workflow.md`.

### 12.1 The `debug` Helper

Use `debug(scope)` from `src/utils/debug.js`. It auto-prefixes lines and **only fires in dev** — production bundles stay silent because `import.meta.env.DEV` is `false`.

```javascript
import { debug } from '../utils/debug.js';
const log = debug('HomePage');

log('mount');
log('fetching content...');
log('categories loaded:', categories.length);
log.warn('unexpected branch');
log.error('failed to load:', { error: err.message, endpoint });
```

If you absolutely must use raw `console`, mirror the format: `console.log('[ComponentName] step:', data)`.

### 12.2 Where Logs are Required

1. **Async operations** — log before, log response shape (not full payload), log errors with context (id, type, endpoint).
2. **Component mount** — log key props/state.
3. **Conditional branches** — log which branch was taken and why.
4. **Redux dispatch** — log action type + key payload fields.
5. **API response** — log status + URL + data shape.
6. **Style-affecting calculations** — log computed values (widths, item counts, derived states).

### 12.3 Verifying with Playwright MCP

After writing code:

1. Start the dev server (`npm run dev`) or rely on Playwright's `webServer` auto-boot.
2. Use Playwright MCP `browser_navigate` to the affected page.
3. Use `browser_console_messages` to verify logs appear in the expected order with expected payloads.
4. Use `browser_take_screenshot` for visual verification.
5. Compare against Figma if a design exists.

**Browser console errors are real bugs — never treat them as background noise.**

### 12.4 Log Lifecycle

- **Keep logs during active development.** They're the audit trail when something breaks.
- **Cleanup pass before release** strips redundant logs in one sweep — not piecemeal during the build-out.
- Production builds are silent (no flag-flip needed), so logs that survive cleanup are zero-cost in prod.

---

## 13. AI-Augmented Workflow (Claude Code + MCP)

### 13.1 The Development Cycle

Follow this end-to-end for any non-trivial change.

```
Step 1 — RECEIVE TASK
  • Read the user-story doc in docs/user stories/.
  • Read the linked Figma frame.
  • Identify acceptance criteria & edge cases.

Step 2 — READ THE WIKI
  • wiki/INDEX.md, then the relevant page(s).
  • Note any non-VERIFIED claims that could derail you — re-verify if so.

Step 3 — BRAINSTORM (with Claude)
  • Describe the task, paste the user story, link the Figma node.
  • Ask Claude for an approach. Push back; don't accept the first idea.
  • Decide: where does state live? What primitives are reused? What's new?

Step 4 — WRITE THE PLAN
  • Multi-step work needs a written plan (phases, files touched, tests).
  • For greenfield components, plan the showcase entries too.

Step 5 — TDD WHERE PRACTICAL
  • Write Playwright specs / unit tests first for behaviour you can express.
  • Don't skip because "the change is small." Smell-test: if you'd ship this
    without testing it, the test was probably the most important part.

Step 6 — IMPLEMENT IN PHASES
  1. File scaffolding (folders, exports, route wiring).
  2. Markup + Tailwind styling.
  3. State + thunks + service calls.
  4. Interactive states + transitions + event handlers.
  5. Edge cases — loading, error, empty, disabled, error-recovery.
  Add debug() logs throughout.

Step 7 — VERIFY (Verification-Before-Completion)
  Run and quote the output of:
    • npm run lint
    • npm run format:check
    • npm run build
    • npm run test:e2e (or the targeted spec)
    • Playwright MCP browser_navigate + browser_console_messages + browser_take_screenshot
  Evidence before assertions. Don't claim "done" without quoting at least lint + build + a screenshot.

Step 8 — DEBUG SYSTEMATICALLY (if anything failed in step 7)
  • Find the root cause, not a symptom patch.
  • Add more debug() logs. Compare actual vs expected.
  • Read the relevant slice / interceptor / wiki page before guessing.

Step 9 — UPDATE THE WIKI
  • Update components.md / routing.md / api.md / design-tokens.md as needed.
  • Append a log.md entry.

Step 10 — COMMIT & PUSH
  • Small, logical commits. Conventional-commits format.
  • Husky + commitlint will block if the message or staged files don't pass.

Step 11 — CODE REVIEW
  • Request review for major features (see §18).
  • For trivial changes, self-review against the §18 checklist before merge.
```

### 13.2 Prompt Template — Implementation Plan

Copy + fill in:

```
I'm working on the TalentHub frontend (Vite 7, React 19, Tailwind v4, React Router 6,
Redux Toolkit, axios, react-hook-form + zod, Playwright).

TASK: [e.g. "Build the OnboardingEducationPage with cascading Level→Grade selects"]

WIKI CONTEXT (already read):
- wiki/architecture.md
- wiki/routing.md
- wiki/components.md (Select details, Field details)
- wiki/design-tokens.md
- wiki/figma-fidelity.md
USER STORY: docs/user stories/GTH_Onboarding_v1.3_POST_REVIEW_1.docx
FIGMA NODES: [e.g. 2849:66712, …] (verified via get_design_context)

PROJECT CONVENTIONS:
- forwardRef + classNames() + variant objects + ...props spread
- Tailwind v4 tokens (bg-brand-green, text-display-md, rounded-pill, …)
- clamp() for all scalable spacing/sizing
- debug(scope) logs at every async/branch/dispatch/calc
- react-hook-form + zod schemas
- Service modules → thunks → custom hook (no direct useSelector/useDispatch in components)

FILES TO CREATE/MODIFY:
- src/pages/onboarding/OnboardingEducationPage.jsx
- src/schemas/educationSchema.js
- (maybe) extension to OnboardingProvider for education state

REQUIREMENTS:
- [acceptance criteria from user story]
- Handle loading / error / empty states
- Cascading Select pattern (Grade disabled until Level chosen)
- Under-18 branch propagation to ParentInfo step on submit

Please give me a phased plan with code for each phase. After the plan,
list the verification commands you'd run.
```

### 13.3 Prompt Template — Debugging

```
I'm seeing [symptom] on [page or component].

EXPECTED: [what should happen]
ACTUAL: [what's happening]
CONSOLE OUTPUT:
[paste relevant log lines from browser_console_messages]
NETWORK:
[relevant requests + statuses]

What I've already tried:
- [thing 1]
- [thing 2]

Please diagnose the root cause and propose a fix. Add debug() logs if needed
to isolate the data flow.
```

### 13.4 MCP Tools Cheat Sheet

| MCP              | Purpose                                                                                  | Notable tools                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Playwright MCP   | Drive a real browser for visual + console verification                                   | `browser_navigate`, `browser_console_messages`, `browser_take_screenshot`, `browser_resize` |
| Figma MCP (HTTP) | Read design specs from the Figma file (must be started via Figma desktop's Dev Mode MCP) | `get_design_context`, `get_metadata`, `get_variable_defs`, `get_screenshot`                 |

Start Figma MCP under _Figma → Preferences → Enable Dev Mode MCP Server_ before any task that needs design extraction. Restart Claude Code whenever you edit `.mcp.json`.

### 13.5 What to Delegate vs Drive Yourself

| Delegate to AI                                       | Drive yourself                                         |
| ---------------------------------------------------- | ------------------------------------------------------ |
| Boilerplate scaffolding, repetitive variant tables   | Architecture decisions (where does state live?)        |
| Migration mechanics, refactors, rename passes        | API contracts, security boundaries                     |
| Test scaffolding, fixture creation                   | Final review of generated code (always)                |
| Pulling Figma specs into Tailwind classes via MCP    | Anything touching auth / payment / personal data flows |
| Cleanup passes (debug-log stripping, unused imports) | Decisions about adding new dependencies                |

---

## 14. Testing & Verification

### 14.1 Playwright E2E (primary safety net)

`playwright.config.js` boots the dev server on `:5173` and runs Chromium-only by default. Specs live under `tests/e2e/`.

Add a spec for every new route at minimum:

```javascript
// tests/e2e/login.spec.js
import { test, expect } from '@playwright/test';

test.describe('LoginPage', () => {
  test('renders the email + password form', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/enter a valid email/i)).toBeVisible();
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
  });
});
```

Run modes:

- `npm run test:e2e` — headless, full suite (CI-compatible)
- `npm run test:e2e:headed` — visible browser
- `npm run test:e2e:ui` — Playwright UI mode (best for authoring + debugging)

The dev server is reused across tests when `process.env.CI` is unset (see `playwright.config.js`).

### 14.2 Per-Component Manual QA Checklist

Before pushing any UI change:

- [ ] All variant styles render correctly in the design-system playground (`/components`).
- [ ] Hover, active, focus, and disabled states behave per Figma.
- [ ] Component scales correctly at 390 / 768 / 1024 / 1440 widths (`browser_resize` via Playwright MCP).
- [ ] No errors or warnings in the browser console (`browser_console_messages`).
- [ ] Fonts and colors match design tokens (DevTools → Computed → font-family + colors should be CSS variable references).
- [ ] Keyboard navigation works (Tab to focus, Enter/Space to activate).
- [ ] ARIA attributes present where required (see §17).
- [ ] `debug()` logs fire in the expected order (`browser_console_messages` shows the breadcrumbs).

### 14.3 Common Issues Reference

| Symptom                             | Likely cause                                   | Fix                                                                         |
| ----------------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------- |
| Component not rendering             | Wrong import path or wrong export              | Check casing on the file path; check default vs named export                |
| Styles not applying                 | Token missing from `@theme`                    | Add the token to `src/index.css`; restart dev server                        |
| Hover effect missing                | Missing `hover:` prefix                        | Add the variant explicitly (`hover:bg-brand-green-hover`)                   |
| Redux state is `undefined`          | Slice not added to `store.reducer`             | Wire the reducer in `src/store/index.js`                                    |
| API returns 401                     | Token missing or expired                       | Inspect `localStorage[STORAGE_KEYS.authToken]`; verify interceptor attaches |
| Infinite re-render loop             | `useEffect` missing deps / new ref each render | Stabilise refs with `useMemo` / `useCallback`; provide a correct dep array  |
| `VITE_API_BASE_URL` undefined       | `.env` missing or dev server not restarted     | Confirm `.env` exists; restart `npm run dev`                                |
| Blank page after route change       | Missing `<Outlet />` in layout                 | Ensure `MainLayout` renders `<main><Outlet /></main>`                       |
| Playwright `webServer` never starts | Port 5173 in use                               | Kill the existing process or change the port in `playwright.config.js`      |
| Husky hooks not running             | `.husky/_` directory missing                   | Re-run `npm install` (Husky's `prepare` script re-installs hooks)           |

---

## 15. Git Workflow & Pre-Commit Hooks

### 15.1 Branch Strategy

```
main (protected — production-ready)
└── develop (integration branch)
    ├── feat/landing-hero
    ├── feat/onboarding-education
    ├── feat/avatar-customiser
    ├── feat/auth-flow
    ├── fix/onboarding-dob-validation
    └── chore/wiki-tokens-refresh
```

Rules:

1. Never push directly to `main` or `develop`. Always branch.
2. Branch naming: `feat/<short-name>`, `fix/<short-name>`, `chore/<short-name>`, `docs/<short-name>`, `refactor/<short-name>`.
3. Pull from `develop` before starting (`git pull origin develop --rebase` or merge — pick one and stick to it).
4. Small, frequent pushes. One logical change per commit.
5. Always open a PR for review before merging to `develop`.

### 15.2 Pre-Commit (Husky + lint-staged)

`.husky/pre-commit` runs `npx lint-staged`, which is configured in `package.json` to run:

| File pattern      | Action                                 |
| ----------------- | -------------------------------------- |
| `*.{js,jsx}`      | `eslint --fix` then `prettier --write` |
| `*.{json,css,md}` | `prettier --write`                     |

### 15.3 Commit-Msg (commitlint)

`.husky/commit-msg` runs `npx --no-install commitlint --edit "$1"`. Commits must match conventional-commits format:

```
type(scope): subject

[optional body]

[optional footer]
```

| Type       | When                                     |
| ---------- | ---------------------------------------- |
| `feat`     | new feature or component                 |
| `fix`      | bug fix                                  |
| `chore`    | config, deps, tooling                    |
| `docs`     | documentation only                       |
| `refactor` | code restructuring (no behaviour change) |
| `test`     | adding / fixing tests                    |
| `style`    | CSS / styling only                       |
| `perf`     | performance improvement                  |
| `ci`       | CI config                                |
| `build`    | build pipeline                           |
| `revert`   | reverting a prior commit                 |

Header limit is **100 chars** (raised from the default 72 in `commitlint.config.js`).

Examples:

```
feat(onboarding): add cascading Level → Grade selects on education step
fix(api): retry on 401 with refresh token before clearing storage
chore(deps): bump vite to 7.1.0
docs(wiki): record design-token refresh from Figma 2026-05-04
refactor(layout): extract onboarding-chrome predicate to its own helper
test(landing): cover hero CTA scroll behaviour at 1440 width
```

### 15.4 Before Pushing — Mandatory Verification

Run all four clean:

```bash
npm run lint
npm run format:check
npm run build
npm run test:e2e
```

If anything fails, **fix the underlying issue**. Don't bypass with `--no-verify`. Quote the passing output in the PR description so reviewers see the evidence.

### 15.5 Recovering From a Bad Commit

```bash
# See the last 10 commits
git log --oneline -10

# Option A — undo last commit, keep changes staged
git reset --soft HEAD~1

# Option B — undo last commit AND discard changes (destructive)
git reset --hard HEAD~1

# Option C — create a new "undo" commit for an arbitrary commit (safest on shared branches)
git revert <commit-hash>

# Option D — restore a single file from an earlier commit
git checkout <commit-hash> -- src/components/ui/Button.jsx
```

After a Husky hook failure, **don't `git commit --amend`** — make a new commit instead. Amending after a hook failure can leave the index in a confusing state.

---

## 16. Security & Performance Standards

### 16.1 Security Checklist

- **No hardcoded secrets.** Every secret lives in `.env` with a `VITE_` prefix (and only if it's safe to ship to the client). Server-only secrets never go into `VITE_*`.
- **Auth tokens** live in `localStorage` today (via `STORAGE_KEYS.authToken`). When the backend supports `httpOnly` cookies, migrate via the universal-cookie helper that's already a dependency. Document the migration in `wiki/api.md`.
- **Never use `dangerouslySetInnerHTML`** with user-generated content. If you must render HTML, sanitise via a vetted library before render.
- **Validate every form input** client-side via a zod schema (§8). Server validation is non-negotiable too — never trust the client alone.
- **HTTPS only** for production API endpoints. The axios instance honours `VITE_API_BASE_URL` — set it to an HTTPS URL in production builds.
- **No sensitive data in logs.** The `debug()` helper auto-silences in prod, but you must still avoid logging passwords, tokens, OTPs, or full PII payloads even in dev. Log shapes (`{ status, id }`), not values.
- **No `eval()`, `new Function()`, or dynamic-string `import()`.** ESLint won't catch all of these — discipline matters.
- **Dependencies**: review every new package against its size, maintenance, and trust footprint before adding. `npm audit` after every install; resolve `high` / `critical` findings before pushing.

### 16.2 Performance Checklist

- **Code splitting** — lazy-load heavy or admin-only subtrees:

  ```jsx
  import { lazy, Suspense } from 'react';
  const AdminApp = lazy(() => import('./admin/AdminApp.jsx'));
  <Suspense fallback={<Loader size="lg" />}>
    <AdminApp />
  </Suspense>;
  ```

  Vendor / router / redux are already chunked separately in `vite.config.js`.

- **Memoise expensive renders** — `React.memo` for pure presentational components rendered in lists; `useMemo` for computed/filtered arrays; `useCallback` for handlers passed to memoised children.

- **Avoid inline objects/arrays in JSX**:

  ```jsx
  // BAD — new object every render
  <Card style={{ padding: 10 }} />;

  // GOOD — stable reference
  const cardStyle = useMemo(() => ({ padding: 10 }), []);
  <Card style={cardStyle} />;
  ```

- **Debounce inputs** that trigger searches or API calls (`useDebounce` lives in `src/hooks/` — add it when needed).

- **Paginate** all list endpoints. Don't fetch full collections.

- **Images**: prefer WebP / AVIF, set explicit `width` + `height` or `aspect-ratio` to prevent layout shift. Use `loading="lazy"` for below-the-fold images.

- **Fonts**: preconnect to Google Fonts in `index.html`; subset SF Pro Rounded fallback to avoid layout shift between Apple and non-Apple.

- **Tailwind purge** is automatic in v4 via the Vite plugin — don't manually configure content paths unless you add file types Vite doesn't already index.

---

## 17. Accessibility Standards

WCAG 2.1 AA is the floor, not the ceiling.

- **Semantic HTML first.** `<nav>`, `<main>`, `<section>`, `<article>`, `<button>`, `<form>`, `<ol>`/`<ul>`/`<li>`. Don't render an interactive element as a `<div>` with `onClick`.
- **Every `<img>` has meaningful `alt` text.** Use `alt=""` for purely decorative images.
- **Icon-only buttons get `aria-label`.** Same for icon-only links.
- **Form fields have associated labels.** The `Field` primitive does this for you via `htmlFor` + auto-generated `id`. If you compose Field manually, supply both.
- **Errors get `role="alert"`** (the form primitives already do).
- **Focus management** — visible focus rings are mandatory. Tailwind's default focus utilities are fine; the form primitives apply `focus-within` styles automatically.
- **Keyboard support** — every interactive element is focusable and activatable with Enter or Space. Use the `Tag` of `<button>` for actions and `<a>` for navigation; don't swap them.
- **Live regions** — character counters, OTP completion announcements, etc. use `aria-live="polite"` (Textarea does this).
- **Colour contrast** — the documented palette meets AA when used as intended (foreground tokens on background tokens). Avoid `text-content-tertiary` on light yellow surfaces — verify.
- **Reduced motion** — respect `prefers-reduced-motion`. Wrap entrance animations and large parallax effects in a media query.

---

## 18. Code Review Framework

### 18.1 How to Conduct a Review

1. `git fetch && git checkout <branch>` and pull.
2. `npm install` if dependencies changed.
3. Run **every verification command** the author should have run:
   - `npm run lint`
   - `npm run format:check`
   - `npm run build`
   - `npm run test:e2e`
4. `npm run dev` and visually inspect the affected pages in a browser at 390 / 768 / 1440 widths. Optionally drive via Playwright MCP for a recorded walkthrough.
5. Walk through the checklist below. Mark each item **P** (pass), **F** (fail), or **N/A**.
6. For each `F`, write a review comment in the format in §18.3.
7. If all `P`, approve. Otherwise, request changes.

### 18.2 Review Checklist

#### A. File structure & naming

| #   | Check                                     | P/F/NA |
| --- | ----------------------------------------- | ------ |
| A1  | File is in the correct folder per §3.1    |        |
| A2  | File name follows the convention per §3.2 |        |
| A3  | Import order follows §3.3                 |        |
| A4  | No unused imports                         |        |
| A5  | Component / export name matches file name |        |

#### B. Component patterns

| #   | Check                                                               | P/F/NA |
| --- | ------------------------------------------------------------------- | ------ |
| B1  | UI primitive uses `forwardRef`                                      |        |
| B2  | Uses `classNames()` (no manual string concatenation)                |        |
| B3  | Variants / sizes are flat lookup tables, not nested ternaries       |        |
| B4  | `...rest` spread on the root element                                |        |
| B5  | Consumer `className` is the LAST argument to `classNames()`         |        |
| B6  | Sensible default values for every prop                              |        |
| B7  | Boolean props use `is` / `has` / `should` prefix                    |        |
| B8  | Event-handler props use `on` prefix; internal handlers use `handle` |        |
| B9  | Stateful primitive supports both controlled + uncontrolled          |        |

#### C. Tailwind & design system

| #   | Check                                                                         | P/F/NA |
| --- | ----------------------------------------------------------------------------- | ------ |
| C1  | Uses design-token colours (no raw `#387440` etc.)                             |        |
| C2  | Uses design-token typography (`text-display-md`, `text-medium-100`)           |        |
| C3  | Hover / active / disabled implemented with `hover:` / `active:` / `disabled:` |        |
| C4  | Transitions use `transition-all duration-300 ease-in`                         |        |
| C5  | No inline styles except CSS-variable references or computed `clamp()`         |        |
| C6  | Scalable properties use `clamp()` (not breakpoint-based static px)            |        |
| C7  | New tokens added to `@theme`, not hardcoded                                   |        |

#### D. Redux & state

| #   | Check                                                                        | P/F/NA |
| --- | ---------------------------------------------------------------------------- | ------ |
| D1  | Slice follows the template (initial state with isLoading / error)            |        |
| D2  | Async thunks use `createAsyncThunk` with `rejectWithValue`                   |        |
| D3  | Component consumes a custom hook, not `useSelector` / `useDispatch` directly |        |
| D4  | Loading state renders a loader / skeleton                                    |        |
| D5  | Error state renders an error message                                         |        |
| D6  | Empty state is handled                                                       |        |

#### E. API integration

| #   | Check                                                            | P/F/NA |
| --- | ---------------------------------------------------------------- | ------ |
| E1  | Uses the centralised `api.js` instance                           |        |
| E2  | No hardcoded API URLs (`import.meta.env.VITE_API_BASE_URL`)      |        |
| E3  | Error handling present in thunks (try/catch + `rejectWithValue`) |        |
| E4  | Service is one module per resource, default-exported             |        |
| E5  | Parameters sanitised / validated before send                     |        |

#### F. Forms

| #   | Check                                                           | P/F/NA |
| --- | --------------------------------------------------------------- | ------ |
| F1  | zod schema present and exhaustive                               |        |
| F2  | `react-hook-form` with `zodResolver`                            |        |
| F3  | Submit button disabled on `isSubmitting`                        |        |
| F4  | Errors surface via the form primitives' `error` prop            |        |
| F5  | Server-side errors mapped to `setError('root', …)` or per-field |        |

#### G. Security & performance

| #   | Check                                                            | P/F/NA |
| --- | ---------------------------------------------------------------- | ------ |
| G1  | No hardcoded secrets / tokens / keys                             |        |
| G2  | No `dangerouslySetInnerHTML` with user content                   |        |
| G3  | No sensitive data in `debug()` logs (no passwords, tokens, OTPs) |        |
| G4  | No unnecessary re-renders (deps arrays correct, stable refs)     |        |
| G5  | Lists paginated                                                  |        |
| G6  | Images sized + lazy-loaded where appropriate                     |        |
| G7  | Lazy-loaded subtrees use `<Suspense>` with a `Loader` fallback   |        |

#### H. Accessibility

| #   | Check                                            | P/F/NA |
| --- | ------------------------------------------------ | ------ |
| H1  | Semantic HTML elements used                      |        |
| H2  | `alt` on every `<img>` (`alt=""` for decorative) |        |
| H3  | `aria-label` on icon-only buttons / links        |        |
| H4  | Keyboard-only operability verified               |        |
| H5  | Visible focus rings preserved                    |        |
| H6  | `aria-invalid` + `role="alert"` on error rows    |        |
| H7  | Color contrast meets AA on used token pairings   |        |

#### I. Debug logs & wiki

| #   | Check                                                                 | P/F/NA |
| --- | --------------------------------------------------------------------- | ------ |
| I1  | `debug(scope)` logs present at every async / branch / dispatch / calc |        |
| I2  | Raw `console.log` calls follow the same `[scope]` prefix              |        |
| I3  | No sensitive data in any log                                          |        |
| I4  | `wiki/components.md` (or relevant page) updated                       |        |
| I5  | `wiki/log.md` entry appended with date + summary                      |        |
| I6  | Confidence tags accurate; demoted to `🪦 STALE` if changed under foot |        |

#### J. Tests

| #   | Check                                                           | P/F/NA |
| --- | --------------------------------------------------------------- | ------ |
| J1  | New route has at least one Playwright spec                      |        |
| J2  | Specs use `getByRole` / `getByLabel` (no brittle CSS selectors) |        |
| J3  | Specs pass locally and (if CI is wired) in CI                   |        |
| J4  | Author quoted the verification output in the PR description     |        |

### 18.3 Review-Comment Format

```
[FAIL — B2] File: src/components/cards/EntryMethodCard.jsx, Line 24
ISSUE: Class names concatenated with template literals instead of classNames()
EXPECTED: classNames(baseStyles, variants[variant], className)
ACTUAL:   `${baseStyles} ${variant === 'active' ? 'bg-brand-green' : ''}`
ACTION:   Refactor to use classNames() per SOP §5.2.
```

---

## 19. Figma Fidelity & Design Reference

### 19.1 The Rule

**Every Figma spec value must be implemented exactly as seen.** No rounding, no "close enough", no substitutions. Applies to: typography (size, weight, family, line-height, letter-spacing), spacing (padding, margin, gap), sizing (width, height, min/max), layout (display, alignment, flex/grid), visuals (border-radius, border, background, opacity, box-shadow).

### 19.2 Fluid Sizing with `clamp()`

**All scalable properties must use `clamp()`** to interpolate between mobile and desktop reference values. **Do not** hardcode breakpoint-static px with media queries for sizing.

Formula:

```
preferred = min_px + (max_px - min_px) * (100vw - MIN_VW) / (MAX_VW - MIN_VW)
```

Default `MIN_VW = 390`, `MAX_VW = 1440`. Example for `14 px @ 390 → 24 px @ 1440`:

```css
font-size: clamp(0.875rem, 0.399rem + 1.905vw, 1.5rem);
```

Helper (use as inline-style values or in `cssText`):

```javascript
const fluid = (minPx, maxPx, minVw = 390, maxVw = 1440) => {
  const minRem = minPx / 16;
  const maxRem = maxPx / 16;
  const slope = (maxPx - minPx) / (maxVw - minVw);
  const intercept = minPx - slope * minVw;
  const interceptRem = intercept / 16;
  const slopeVw = slope * 100;
  return `clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem)`;
};

// Usage:
style={{ fontSize: fluid(14, 24), padding: fluid(8, 16) }}
```

Reserve `@media` for **layout changes only** (flex-direction, grid column count, show/hide, navigation collapse) — not for sizing.

### 19.3 Figma MCP Workflow (CRITICAL)

**Always use node-detail tools. Never screenshot-guess.**

```
1. Get the node-id from wiki/figma-node-map.md or the Figma URL.
2. get_design_context(nodeId)  → returns CSS properties (font-size, weight, fill, padding, …).
3. Read the exact values.
4. Implement in JSX/CSS using clamp() where applicable.
5. Take a Playwright MCP screenshot at 390 / 768 / 1440 to visually verify.
```

For hero-style frames with **free-floating decoration** (orbs, scribbles, sparkles), `get_design_context` flattens the absolute geometry into auto-layout approximations and may drop rotation. Workflow:

1. `get_metadata` first — raw geometry (x, y, width, height, `relativeTransform`).
2. Cross-validate with `get_design_context` + `get_variable_defs` + `get_screenshot`. Save outputs to a temp file if the frame is large.
3. Keep selections under ~12,000 tokens (subtrees, not whole frames).
4. Round-trip decorative SVGs as exported assets in `src/assets/` — don't ask the LLM to redraw the path.
5. Use `src/utils/figmaPosition.js` to convert metadata into Tailwind / inline-style numbers (`relativeTo`, `rotationFromMatrix`, `relativePercent`).

Rotation gotcha: Figma stores CCW; CSS `rotate()` is CW. The helper flips the sign — **don't double-negate**.

### 19.4 Figma File & Node Map

- File: _"Gh Design system - onboading"_ — file key `Bin8roWL8sloyc36IgFMuT`
- Top-level URL: `https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT`
- Per-frame node IDs: `wiki/figma-node-map.md` (populate as designs land; demote to `🪦 STALE` when frames are restructured).

To open a specific frame in Figma, construct:

```
https://www.figma.com/design/Bin8roWL8sloyc36IgFMuT?node-id=NODE_ID
```

(Replace `:` with `-` in the URL, or URL-encode it as `%3A`.)

### 19.5 Generating a Figma Personal Access Token

For programmatic access (scripts, image exports):

1. Open Figma → click the Figma icon (top-left) → **Help and account**.
2. **Account settings** → **Security** tab.
3. Scroll to **Personal access tokens** → **Generate new token**.
4. Name it descriptively (e.g. `talenthub-dev-token`).
5. Scopes: **`file_content:read`** at minimum; optionally `file_content:write` for posting comments.
6. **Copy the token immediately** — Figma shows it only once. Store in your password manager or a local `.env` (never committed) as `FIGMA_TOKEN`.

Curl example:

```bash
curl -H "X-Figma-Token: $FIGMA_TOKEN" \
  "https://api.figma.com/v1/files/Bin8roWL8sloyc36IgFMuT/nodes?ids=2849:66712&depth=3"
```

Without `file_content:read`, `/v1/files/` and `/v1/images/` return 403 _Invalid scope(s)_. Regenerate with the right scope if so.

---

## 20. Appendices

### Appendix A — Quick Reference: Tailwind Utilities

```
Colors      bg-{brand-green|accent|neutral|black|yellow}-{light|hover|active|dark|dark-hover|dark-active|darker}
            bg-{informative|success|warning|danger}-{…same ladder…}
            text-{content-primary|content-secondary|content-tertiary}
            bg-{background-default|background-subtle}
            border-{border-default|border-neutral}

Typography  font-sans   font-display
            text-display-xl | text-display-lg | text-display-md | text-display-sm | text-display-italic
            text-{strong|medium|normal}-{25|50|75|100|200|300|400|500|600}

Radius      rounded-sm (6px) | rounded-md (10px) | rounded-lg (16px) | rounded-xl (24px) | rounded-pill (100px)

Spacing     p-1 (4px) … p-2 (8px) … p-4 (16px) … p-8 (32px) … p-12 (48px) … p-20 (80px)

Shadows     shadow-sm  shadow-md  shadow-lg  shadow-green
            shadow-top-{100..400}  shadow-bottom-{100..400}  shadow-button-shelf

Layout      mx-auto w-full max-w-[1728px]    (page column)
            transition-all duration-300 ease-in   (interactive elements)
```

### Appendix B — Recommended `.vscode/settings.json`

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [["classNames\\(([^)]*)\\)", "'([^']*)'"]],
  "emmet.includeLanguages": { "javascript": "javascriptreact" },
  "files.associations": { "*.jsx": "javascriptreact" },
  "eslint.format.enable": true,
  "playwright.reuseBrowser": true
}
```

### Appendix C — Key Dependencies Cheat Sheet

| Package                       | Import                                                                                 | Common usage                              |
| ----------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------- |
| `react-router-dom`            | `import { useNavigate, useParams, useLocation, Link, Outlet } from 'react-router-dom'` | Navigation & routing                      |
| `react-redux`                 | `import { useSelector, useDispatch, Provider } from 'react-redux'`                     | Redux access (prefer custom hooks)        |
| `@reduxjs/toolkit`            | `import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit'`     | Redux setup                               |
| `axios`                       | `import { api } from '../services/api.js'`                                             | HTTP — always use the configured instance |
| `universal-cookie`            | `import Cookies from 'universal-cookie'`                                               | Cookie read/write                         |
| `redux-persist`               | `import { persistStore, persistReducer } from 'redux-persist'`                         | State persistence                         |
| `react-hook-form`             | `import { useForm } from 'react-hook-form'`                                            | Form state                                |
| `zod` + `@hookform/resolvers` | `import { zodResolver } from '@hookform/resolvers/zod'; import { z } from 'zod'`       | Schema validation                         |
| `@playwright/test`            | `import { test, expect } from '@playwright/test'`                                      | E2E tests                                 |

### Appendix D — Glossary

| Term                | Meaning                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------- |
| Component           | A reusable piece of UI. A React function that returns JSX.                               |
| Props               | Data passed into a component from its parent.                                            |
| State               | Data that can change over time in a component or in Redux.                               |
| Slice               | A self-contained chunk of Redux state with its reducers and actions.                     |
| Thunk               | An async function that can dispatch Redux actions (used for API calls).                  |
| Interceptor         | axios middleware that runs before every request or after every response.                 |
| Hook                | A React function (prefix `use`) that gives access to state and lifecycle features.       |
| `forwardRef`        | A React wrapper that lets a parent get a ref to a child's DOM element.                   |
| Tailwind utility    | A small CSS class that does one thing (e.g. `bg-brand-green`).                           |
| CSS custom property | A variable defined in CSS (e.g. `--color-brand-green: #387440`).                         |
| Variant             | A visual variation of a component (e.g. primary vs secondary).                           |
| Token               | A named design value (color, type size, spacing) defined once and reused everywhere.     |
| `@theme`            | Tailwind v4's in-CSS block where tokens are declared.                                    |
| `clamp()`           | CSS function that interpolates a value between a min and max relative to viewport width. |
| MCP                 | Model Context Protocol — how Claude Code connects to external tools (Playwright, Figma). |
| Figma node ID       | A unique identifier for any element in a Figma design file.                              |
| Layout shell        | A wrapper component (Navbar + Outlet + Footer) that surrounds page content.              |
| Outlet              | React Router's placeholder for child-route content inside a layout.                      |
| Confidence tag      | A marker on a wiki claim indicating how reliable it is.                                  |
| Wiki                | The persistent, compounding knowledge base in `wiki/`.                                   |

### Appendix E — Onboarding Checklist for New Devs

Day 1 — environment

- [ ] Clone the repo, `npm install`, copy `.env.example` to `.env`.
- [ ] Run `npm run dev` and confirm `http://localhost:5173` renders the landing page.
- [ ] Run `npm run test:e2e` and confirm at least one spec passes.
- [ ] Read `CLAUDE.md`, then `wiki/INDEX.md`, then `wiki/architecture.md`.

Day 2 — orientation

- [ ] Read `wiki/components.md` end-to-end. Open `/components` and click through every primitive.
- [ ] Read `wiki/design-tokens.md`. Open `src/index.css` and find the `@theme` block.
- [ ] Read `wiki/figma-fidelity.md` and `wiki/debugging-workflow.md`.
- [ ] Open one user story under `docs/user stories/` and trace it through the code.

Day 3 — first PR

- [ ] Pick a small `chore/` or `docs/` task. Branch from `develop`.
- [ ] Follow the full §13.1 cycle including verification (§14, §15.4).
- [ ] Open a PR. Quote the verification output in the description.

---

> **This SOP is a living document.** Update it as patterns evolve, components ship, or the team finds better ways to work. The wiki is its complement — what's true _right now_ lives in the wiki with a confidence tag; what should be true _for every change_ lives here.
