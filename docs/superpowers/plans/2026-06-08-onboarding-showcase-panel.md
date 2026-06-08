# OnboardingShowcasePanel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract one shared, Figma-faithful `OnboardingShowcasePanel` (brand-green scaffold + 3 real photos + orbs + grid + sparkles + compliance pill) and migrate all 7 onboarding pages to compose it with their step-specific floating cards.

**Architecture:** A scaffold component renders everything constant and exposes a `children` slot. Repeated floating cards are exported as primitives (`DataProtectedBadge`, `OtpBadge`, `ExperiencePickerCard`, `WatchTutorialBadge`); genuinely page-specific cards (guardian summary, phone preview) stay inline as children. Photos are converted to WebP once and baked into the scaffold.

**Tech Stack:** React 19 (plain JS), Tailwind v4, Vite 7, Playwright e2e (no unit-test runner exists — TDD is done via Playwright e2e). `npx sharp-cli` for one-time image conversion.

**Spec:** [docs/superpowers/specs/2026-06-08-onboarding-showcase-panel-design.md](../specs/2026-06-08-onboarding-showcase-panel-design.md)

**Reference (Figma):** file `Bin8roWL8sloyc36IgFMuT`, Frame 141, node `4540:33239`. Source PNGs already downloaded to `src/assets/onboarding/right-panel/` (`photo-1-library.png`, `photo-2-students.png`, `photo-3-studio.png`, `grid.png`).

---

## Notes on deviations from spec §9

The spec proposed `OnboardingShowcasePanel.spec.jsx` render tests. There is **no unit-test runner** in this repo (only `@playwright/test`). This plan therefore implements the TDD test as a Playwright e2e spec at `tests/e2e/onboarding-panel.spec.js`, consistent with the existing `tests/e2e/home.spec.js` and CLAUDE.md's `npm run test:e2e`.

---

## Task 1: Convert photos to WebP

**Files:**

- Create: `src/assets/onboarding/right-panel/photo-1-library.webp`
- Create: `src/assets/onboarding/right-panel/photo-2-students.webp`
- Create: `src/assets/onboarding/right-panel/photo-3-studio.webp`

- [ ] **Step 1: Convert all three PNGs to WebP, downscaled to 740px wide (2× the ~370px display size)**

Run from repo root:

```bash
npx --yes sharp-cli@latest -i "src/assets/onboarding/right-panel/photo-1-library.png" -o "src/assets/onboarding/right-panel/" resize 740 --withoutEnlargement -f webp -q 82
npx --yes sharp-cli@latest -i "src/assets/onboarding/right-panel/photo-2-students.png" -o "src/assets/onboarding/right-panel/" resize 740 --withoutEnlargement -f webp -q 82
npx --yes sharp-cli@latest -i "src/assets/onboarding/right-panel/photo-3-studio.png" -o "src/assets/onboarding/right-panel/" resize 740 --withoutEnlargement -f webp -q 82
```

Expected: three `.webp` files created. If `sharp-cli` flag names differ on the resolved version, run `npx --yes sharp-cli@latest --help` and adapt (the operation needed: resize width 740, output format webp, quality ~82).

- [ ] **Step 2: Verify the WebP files exist and are meaningfully smaller**

Run:

```bash
ls -la src/assets/onboarding/right-panel/*.webp
```

Expected: three files, each well under the ~2.3 MB PNG originals (target < 150 KB each).

- [ ] **Step 3: Delete the source PNGs (photos only — keep grid.png)**

Run:

```bash
rm "src/assets/onboarding/right-panel/photo-1-library.png" "src/assets/onboarding/right-panel/photo-2-students.png" "src/assets/onboarding/right-panel/photo-3-studio.png"
```

Expected: only `.webp` photos + `grid.png` + the reference `ellipse-*.svg` / `compliance-check.svg` remain.

- [ ] **Step 4: Commit**

```bash
git add src/assets/onboarding/right-panel/
git commit -m "chore(onboarding): add optimized WebP photos for showcase panel"
```

---

## Task 2: Build the sparkle decorations

**Files:**

- Create: `src/components/shared/onboarding-panel/panelSparkles.jsx`

The Figma sprite clusters are ~30 micro-vectors. We recreate them as compact, hand-authored inline SVG approximations (faithful in spirit, not vector-exact) — scattered four-point stars and dots at low opacity, positioned at the Figma cluster coordinates. They are purely decorative (`aria-hidden`).

- [ ] **Step 1: Create the sparkles module**

```jsx
// Decorative sparkle clusters for OnboardingShowcasePanel. These are
// hand-authored approximations of the Figma sprite clusters (Frame 141
// nodes 2253:1329 blob-stars, 2253:1355 snow/drops, 2253:1324 spark-26):
// faithful in spirit, not vector-exact. Purely decorative.

// A single four-point sparkle star.
const Star = ({ x, y, size, opacity = 0.5 }) => (
  <path
    d={`M${x} ${y - size} C${x + size * 0.2} ${y - size * 0.2} ${x + size * 0.2} ${y - size * 0.2} ${x + size} ${y} C${x + size * 0.2} ${y + size * 0.2} ${x + size * 0.2} ${y + size * 0.2} ${x} ${y + size} C${x - size * 0.2} ${y + size * 0.2} ${x - size * 0.2} ${y + size * 0.2} ${x - size} ${y} C${x - size * 0.2} ${y - size * 0.2} ${x - size * 0.2} ${y - size * 0.2} ${x} ${y - size} Z`}
    fill="#FFFFFF"
    opacity={opacity}
  />
);

const Dot = ({ x, y, r = 1.4, opacity = 0.35 }) => (
  <circle cx={x} cy={y} r={r} fill="#FFFFFF" opacity={opacity} />
);

// Top-center cluster — a few crisp stars (Figma blob-stars).
export const SparkleBurst = ({ className }) => (
  <svg viewBox="0 0 100 102" fill="none" aria-hidden="true" className={className}>
    <Star x={20} y={30} size={9} opacity={0.85} />
    <Star x={62} y={22} size={6} opacity={0.6} />
    <Star x={44} y={70} size={7} opacity={0.7} />
    <Dot x={80} y={50} r={2} />
    <Dot x={30} y={78} r={1.6} />
  </svg>
);

// Top-left scattered field of faint dots/drops (Figma snow/drops).
export const SparkleField = ({ className }) => (
  <svg viewBox="0 0 447 359" fill="none" aria-hidden="true" className={className}>
    <Dot x={300} y={50} />
    <Dot x={330} y={95} />
    <Dot x={360} y={70} r={1.8} />
    <Dot x={400} y={40} />
    <Dot x={410} y={110} />
    <Dot x={380} y={140} r={1.8} />
    <Dot x={350} y={175} />
    <Dot x={430} y={185} />
    <Dot x={320} y={150} />
    <Dot x={290} y={120} r={1.2} />
    <Star x={300} y={20} size={4} opacity={0.4} />
    <Star x={420} y={70} size={4} opacity={0.4} />
  </svg>
);

// Mid-left small spark (Figma spark-26), rendered rotated by the caller.
export const SparkleSpark = ({ className }) => (
  <svg viewBox="0 0 77 74" fill="none" aria-hidden="true" className={className}>
    <Star x={35} y={37} size={10} opacity={0.6} />
    <Dot x={15} y={20} r={1.6} />
    <Dot x={60} y={55} r={1.6} />
    <Dot x={58} y={18} r={1.2} />
  </svg>
);
```

- [ ] **Step 2: Verify it parses (lint the new file)**

Run:

```bash
npx eslint src/components/shared/onboarding-panel/panelSparkles.jsx
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/onboarding-panel/panelSparkles.jsx
git commit -m "feat(onboarding): add sparkle decorations for showcase panel"
```

---

## Task 3: Build the reusable floating-card primitives

**Files:**

- Create: `src/components/shared/onboarding-panel/panelCards.jsx`

These are the cards that repeat verbatim across pages. Copy is carried over exactly from the existing page panels. Each is absolutely positioned and self-contained. (Page-specific one-offs — guardian summary, phone preview — are NOT here; they stay inline per page in Task 7+.)

- [ ] **Step 1: Create the cards module**

```jsx
import { PlayCircleIcon, UsersGroupIcon } from '../assets.jsx';

// Top-left trust banner — cream tint, MTN-style square icon + two lines.
// Carried from OnboardingDobPage DataProtectedCard (Figma 2282:9030).
export const DataProtectedBadge = () => (
  <div
    className="absolute rounded-[13px] bg-[#EBF1EC] p-[14px] shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
    style={{ left: 24, top: 320, width: 268, outline: '1px solid #FFFEFC', outlineOffset: '-1px' }}
  >
    <div className="flex items-center gap-[9px]">
      <span className="flex size-9 items-center justify-center rounded-[9px] bg-brand-green text-white">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M9 1.5l6.5 2.5v4c0 4-2.5 6.5-6.5 8-4-1.5-6.5-4-6.5-8V4L9 1.5z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M6.5 9l1.7 1.7L11.5 7.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-[12px] font-bold leading-[15px] text-[#595959]">Data Protected</p>
        <p className="text-[10px] leading-[14px] text-[#595959] opacity-[0.72]">
          Encrypted · Never shared without consent
        </p>
      </div>
    </div>
  </div>
);

// Top-left gold "OTP sent" banner. Carried from OnboardingContactPage
// (Figma 2385:38883). Uses the accent design tokens.
export const OtpBadge = () => (
  <div
    className="absolute rounded-[13px] border border-accent-light bg-accent shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
    style={{ left: 24, top: 296, width: 267, padding: 12 }}
  >
    <div className="flex items-center gap-[9px]">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-accent-light-active text-accent-darker">
        <span className="text-[10px] font-bold">MTN</span>
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-[12px] font-bold leading-[15px] text-white">OTP sent after this step</p>
        <p className="text-[10px] leading-[14px] text-white opacity-[0.72]">
          SMS + Email · expires in 10 min
        </p>
      </div>
    </div>
  </div>
);

// Top-left amber "Parental consent" banner. Carried from
// OnboardingParentInfoPage.
export const ParentalConsentBadge = () => (
  <div
    className="absolute rounded-[13px] p-3 shadow-[0_2px_1px_rgba(27,36,44,0.04),0_16px_12px_rgba(27,36,44,0.16)]"
    style={{ left: 24, top: 240, width: 268, background: '#C8951A', border: '1px solid #FAF4E8' }}
  >
    <div className="flex items-center gap-[9px]">
      <span
        className="flex size-9 shrink-0 items-center justify-center rounded-[9px]"
        style={{ background: '#EEDEB8' }}
        aria-hidden="true"
      >
        <span className="text-[#967014]">
          <UsersGroupIcon />
        </span>
      </span>
      <div className="flex flex-col gap-0.5">
        <p className="text-[12px] font-bold leading-[15px] text-[#FEFEFE]">
          Required for under-18s
        </p>
        <p className="text-[10px] leading-[14px] text-[#FEFEFE]" style={{ opacity: 0.72 }}>
          Ghana Data Protection Act, 2012
        </p>
      </div>
    </div>
  </div>
);

// "Adult experience / Youth experience" selector. Carried from
// OnboardingDobPage ExperiencePickerCard (Figma 2282:9050).
export const ExperiencePickerCard = () => (
  <div
    className="absolute rounded-[12px] bg-white p-4 shadow-[0_16px_24px_-6px_rgba(27,36,44,0.16),0_2px_2px_-1px_rgba(27,36,44,0.04)]"
    style={{ right: 24, top: 500, width: 235 }}
  >
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-green" />
      <span className="text-[12px] font-semibold leading-tight text-brand-green">
        Adult experience
      </span>
    </div>
    <div className="mt-3 flex items-center gap-3">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-[#D6D6D2]" />
      <span className="text-[12px] font-normal leading-tight text-[#959592]">Youth experience</span>
    </div>
  </div>
);

// Watch-tutorial control. With `label` it renders the expanded card;
// without, the collapsed circular play button (Figma 2385:38903).
export const WatchTutorialBadge = ({ label }) => {
  if (!label) {
    return (
      <button
        type="button"
        aria-label="Watch tutorial"
        className="absolute flex size-[72px] items-center justify-center rounded-full text-white"
        style={{ right: 36, bottom: 30, background: 'rgba(235,241,236,0.30)' }}
      >
        <PlayCircleIcon className="size-6" />
      </button>
    );
  }
  return (
    <button
      type="button"
      className="absolute inline-flex items-center gap-3 rounded-[12px] border border-black/5 bg-white px-4 py-3 shadow-[0_8px_16px_-4px_rgba(27,36,44,0.16)]"
      style={{ right: 24, bottom: 30, width: 211 }}
    >
      <span className="flex size-9 items-center justify-center rounded-full bg-brand-green-light text-brand-green">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M5 4l5 3-5 3V4z" fill="currentColor" />
        </svg>
      </span>
      <div className="flex flex-col text-left">
        <span className="text-[10px] font-medium uppercase tracking-wider text-[#959592]">
          Watch tutorial
        </span>
        <span
          className="text-[14px] font-semibold capitalize leading-tight text-brand-green"
          style={{ letterSpacing: '0.14px' }}
        >
          {label}
        </span>
      </div>
    </button>
  );
};
```

- [ ] **Step 2: Verify `PlayCircleIcon` and `UsersGroupIcon` exist in the assets module**

Run:

```bash
grep -nE "PlayCircleIcon|UsersGroupIcon" src/components/shared/assets.jsx
```

Expected: both names are exported. If `PlayCircleIcon` is missing, the existing pages import it from `assets.jsx` already (Contact/Parent pages) — confirm the import path is `../assets.jsx` relative to `onboarding-panel/`.

- [ ] **Step 3: Lint the new file**

Run:

```bash
npx eslint src/components/shared/onboarding-panel/panelCards.jsx
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/onboarding-panel/panelCards.jsx
git commit -m "feat(onboarding): add reusable floating-card primitives for showcase panel"
```

---

## Task 4: Build the scaffold component + barrel

**Files:**

- Create: `src/components/shared/onboarding-panel/OnboardingShowcasePanel.jsx`
- Create: `src/components/shared/onboarding-panel/index.js`

- [ ] **Step 1: Create the scaffold component**

```jsx
import { Children } from 'react';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { SparkleBurst, SparkleField, SparkleSpark } from './panelSparkles.jsx';
import photo1 from '../../../assets/onboarding/right-panel/photo-1-library.webp';
import photo2 from '../../../assets/onboarding/right-panel/photo-2-students.webp';
import photo3 from '../../../assets/onboarding/right-panel/photo-3-studio.webp';

const log = debug('OnboardingShowcasePanel');

const PHOTO_SHADOW = '0px 16px 24px -6px rgba(27,36,44,0.16), 0px 2px 2px -1px rgba(27,36,44,0.04)';

// A single tilted, bordered photo. `border` is the Figma frame colour.
const Photo = ({ src, style, border }) => (
  <div
    className="absolute overflow-hidden rounded-[40px]"
    style={{ ...style, border: `10px solid ${border}`, boxShadow: PHOTO_SHADOW }}
  >
    <img src={src} alt="" className="size-full object-cover" />
  </div>
);

/*
 * OnboardingShowcasePanel — the brand-green showcase aside shared by every
 * onboarding step. Renders the constant Figma composition (Frame 141,
 * node 4540:33239): green base, cream/pink orbs, grid texture, three
 * decorative sparkle clusters, three tilted photos, and the Ghana DPA
 * compliance pill. Per-step floating cards are passed as children.
 *
 * Hidden below lg; aria-hidden because it is decorative marketing chrome.
 */
const OnboardingShowcasePanel = ({ children, className }) => {
  log('mount', { cards: Children.count(children) });
  return (
    <aside
      aria-hidden="true"
      data-testid="onboarding-showcase-panel"
      className={classNames(
        'relative hidden min-h-[calc(100vh-160px)] w-[42%] shrink-0 self-stretch overflow-hidden border-l border-[#E7E7E7] bg-brand-green lg:block',
        className
      )}
    >
      {/* Gradient orbs */}
      <div
        className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[100px]"
        style={{ right: '-180px', top: '-200px', background: '#F7EFDD' }}
      />
      <div
        className="pointer-events-none absolute size-[473px] rounded-full opacity-50 blur-[150px]"
        style={{ left: '-170px', bottom: '-220px', background: '#F9EBEA' }}
      />

      {/* Sparkle clusters */}
      <SparkleField className="pointer-events-none absolute left-[-12%] top-[-3%] h-[39%] w-[60%] opacity-90" />
      <SparkleBurst className="pointer-events-none absolute right-[8%] top-[2%] h-[11%] w-[14%]" />
      <SparkleSpark className="pointer-events-none absolute left-[36%] top-[48%] h-[11%] w-[14%] rotate-[32deg]" />

      {/* Three tilted photos (percentages so they scale with the 42% panel) */}
      <Photo
        src={photo1}
        border="#EBC2BD"
        style={{ left: '6%', top: '4%', width: '50%', aspectRatio: '1', transform: 'rotate(7deg)' }}
      />
      <Photo
        src={photo2}
        border="#EEDEB8"
        style={{
          right: '4%',
          top: '28%',
          width: '54%',
          aspectRatio: '1',
          transform: 'rotate(5deg)',
        }}
      />
      <Photo
        src={photo3}
        border="#C1D4C4"
        style={{
          left: '4%',
          bottom: '4%',
          width: '56%',
          aspectRatio: '1',
          transform: 'rotate(-13deg)',
        }}
      />

      {/* Compliance pill (constant) */}
      <div
        className="absolute inline-flex items-center gap-2 rounded-[10px] border border-black/5 bg-white px-2.5 py-2 shadow-[0_2px_0_rgba(0,0,0,0.05),0_8px_32px_rgba(0,0,0,0.1)]"
        style={{ right: 24, top: 200 }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <circle cx="7" cy="7" r="5.5" stroke="#387440" />
          <path
            d="M4.5 7l1.7 2 3.3-3.2"
            stroke="#387440"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className="text-[14px] font-semibold leading-6 text-brand-green"
          style={{ letterSpacing: '0.1px' }}
        >
          Ghana Data Protection Act compliant
        </span>
      </div>

      {/* Per-step floating cards */}
      {children}
    </aside>
  );
};

export default OnboardingShowcasePanel;
```

- [ ] **Step 2: Create the barrel**

```js
export { default as OnboardingShowcasePanel } from './OnboardingShowcasePanel.jsx';
export {
  DataProtectedBadge,
  OtpBadge,
  ParentalConsentBadge,
  ExperiencePickerCard,
  WatchTutorialBadge,
} from './panelCards.jsx';
```

- [ ] **Step 3: Lint both files**

Run:

```bash
npx eslint src/components/shared/onboarding-panel/
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/shared/onboarding-panel/OnboardingShowcasePanel.jsx src/components/shared/onboarding-panel/index.js
git commit -m "feat(onboarding): add OnboardingShowcasePanel scaffold + barrel"
```

---

## Task 5: TDD — wire the DOB page to the shared panel

**Files:**

- Create: `tests/e2e/onboarding-panel.spec.js`
- Modify: `src/pages/onboarding/OnboardingDobPage.jsx` (remove local panel + subcomponents, lines ~73-232; import + use shared panel)

- [ ] **Step 1: Write the failing e2e test**

```js
import { test, expect } from '@playwright/test';

test('onboarding DOB page renders the shared showcase panel', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 }); // lg+ so the panel shows
  await page.goto('/onboarding/dob');

  const panel = page.getByTestId('onboarding-showcase-panel');
  await expect(panel).toBeVisible();

  // Constant compliance pill copy.
  await expect(panel.getByText('Ghana Data Protection Act compliant')).toBeVisible();

  // DOB-specific cards passed as children.
  await expect(panel.getByText('Adult experience')).toBeVisible();
  await expect(panel.getByText('Data Protected')).toBeVisible();

  // Three photos render inside the panel.
  await expect(panel.locator('img')).toHaveCount(3);
});
```

- [ ] **Step 2: Run it to confirm it fails**

Run:

```bash
npx playwright test tests/e2e/onboarding-panel.spec.js --project=chromium
```

Expected: FAIL — `getByTestId('onboarding-showcase-panel')` not found (DOB page still uses the old local `BasicsRightPanel`).

- [ ] **Step 3: Replace the DOB page panel**

In `src/pages/onboarding/OnboardingDobPage.jsx`:

a) Delete the local subcomponents `DataProtectedCard`, `CompliancePill`, `ExperiencePickerCard`, `WatchTutorialCard`, and `BasicsRightPanel` (the block from the `// ---- right panel` comment through the end of `BasicsRightPanel`, ~lines 73-232).

b) Add the import near the other imports:

```jsx
import {
  OnboardingShowcasePanel,
  DataProtectedBadge,
  ExperiencePickerCard,
} from '../../components/shared/onboarding-panel';
```

c) Replace `<BasicsRightPanel />` (the render site) with:

```jsx
<OnboardingShowcasePanel>
  <DataProtectedBadge />
  <ExperiencePickerCard />
</OnboardingShowcasePanel>
```

- [ ] **Step 4: Run the test to confirm it passes**

Run:

```bash
npx playwright test tests/e2e/onboarding-panel.spec.js --project=chromium
```

Expected: PASS.

- [ ] **Step 5: Lint the modified page**

Run:

```bash
npx eslint src/pages/onboarding/OnboardingDobPage.jsx
```

Expected: no errors (no unused imports left behind).

- [ ] **Step 6: Commit**

```bash
git add tests/e2e/onboarding-panel.spec.js src/pages/onboarding/OnboardingDobPage.jsx
git commit -m "feat(onboarding): migrate DOB page to OnboardingShowcasePanel"
```

---

## Task 6: Migrate the PersonalInfo (Profile) page

**Files:**

- Modify: `src/pages/onboarding/OnboardingPersonalInfoPage.jsx`

- [ ] **Step 1: Replace the panel**

a) Delete the local `ProfileRightPanel` subcomponent (from `// ---- right panel` / the `const ProfileRightPanel = (` block through its closing `);`).

b) Add import:

```jsx
import {
  OnboardingShowcasePanel,
  DataProtectedBadge,
  WatchTutorialBadge,
} from '../../components/shared/onboarding-panel';
```

c) Replace `<ProfileRightPanel />` with:

```jsx
<OnboardingShowcasePanel>
  <DataProtectedBadge />
  <WatchTutorialBadge label="The Basics (Profile)" />
</OnboardingShowcasePanel>
```

> If the existing page's watch-tutorial copy differs, use that exact string instead.

- [ ] **Step 2: Lint**

Run: `npx eslint src/pages/onboarding/OnboardingPersonalInfoPage.jsx`
Expected: no errors (remove any now-unused icon imports the old panel used).

- [ ] **Step 3: Commit**

```bash
git add src/pages/onboarding/OnboardingPersonalInfoPage.jsx
git commit -m "refactor(onboarding): migrate PersonalInfo page to OnboardingShowcasePanel"
```

---

## Task 7: Migrate the Contact page

**Files:**

- Modify: `src/pages/onboarding/OnboardingContactPage.jsx`

The Contact panel has a **bespoke phone-preview pill** (specific number `+233 24 123 4567`) that is not a shared primitive — keep it inline as a child.

- [ ] **Step 1: Replace the panel**

a) Delete the local `ContactRightPanel` subcomponent block.

b) Add import:

```jsx
import {
  OnboardingShowcasePanel,
  OtpBadge,
  WatchTutorialBadge,
} from '../../components/shared/onboarding-panel';
```

c) Replace `<ContactRightPanel />` with the shared panel, moving the existing phone-preview pill JSX in verbatim as a child:

```jsx
<OnboardingShowcasePanel>
  <OtpBadge />
  {/* Phone preview pill — bespoke to Contact (Figma 2396:19978) */}
  <div
    className="absolute rounded-[10px] border border-accent-light-active bg-accent-light p-2"
    style={{
      right: 36,
      bottom: 140,
      width: 230,
      transform: 'rotate(2deg)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 3px 0 #967014, 0 8px 28px rgba(200, 149, 26, 0.14)',
    }}
  >
    <div className="flex items-center gap-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-[5px] bg-accent-light-active text-accent-darker">
        <span className="text-[9px] font-bold">MTN</span>
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-[12px] font-bold leading-tight text-[#111111]">Phone</p>
        <p className="text-[11px] leading-[15px] text-[#70706E]" style={{ letterSpacing: '0.1px' }}>
          +233 24 123 4567
        </p>
      </div>
    </div>
  </div>
  <WatchTutorialBadge />
</OnboardingShowcasePanel>
```

- [ ] **Step 2: Lint**

Run: `npx eslint src/pages/onboarding/OnboardingContactPage.jsx`
Expected: no errors. Keep `PlayCircleIcon`/`PhoneIcon` imports only if still used elsewhere on the page; remove if now-unused.

- [ ] **Step 3: Commit**

```bash
git add src/pages/onboarding/OnboardingContactPage.jsx
git commit -m "refactor(onboarding): migrate Contact page to OnboardingShowcasePanel"
```

---

## Task 8: Migrate the ParentInfo page

**Files:**

- Modify: `src/pages/onboarding/OnboardingParentInfoPage.jsx`

The Parent panel has a **bespoke guardian-summary card** — keep it inline.

- [ ] **Step 1: Replace the panel**

a) Delete the local `ParentRightPanel` subcomponent block.

b) Add import:

```jsx
import {
  OnboardingShowcasePanel,
  ParentalConsentBadge,
  WatchTutorialBadge,
} from '../../components/shared/onboarding-panel';
```

c) Replace `<ParentRightPanel />` with the shared panel, moving the existing guardian-summary card JSX in verbatim as a child:

```jsx
<OnboardingShowcasePanel>
  <ParentalConsentBadge />
  {/* Guardian summary — bespoke to Parent (Figma 2858:28903) */}
  <div
    className="absolute rounded-[12px] p-3"
    style={{
      left: '38%',
      bottom: 144,
      width: 260,
      background: '#FAF4E8',
      border: '1px solid #EEDEB8',
      transform: 'rotate(2deg)',
      boxShadow: '0 3px 0 #967014, 0 8px 28px rgba(200,149,26,0.14)',
      backdropFilter: 'blur(8px)',
    }}
  >
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span
          className="text-[12px] leading-[18px] text-[#575755]"
          style={{ letterSpacing: '0.2px' }}
        >
          Guardian Name
        </span>
        <span
          className="text-[12px] font-semibold leading-5"
          style={{ color: '#C8951A', letterSpacing: '0.2px' }}
        >
          Mother
        </span>
      </div>
      <div className="text-[12px] leading-[18px] text-[#575755]" style={{ letterSpacing: '0.2px' }}>
        Relationship
      </div>
      <span
        className="text-[12px] font-semibold leading-5"
        style={{ color: '#C8951A', letterSpacing: '0.2px' }}
      >
        SMS (+233 24 52..) + Email
      </span>
    </div>
  </div>
  <WatchTutorialBadge />
</OnboardingShowcasePanel>
```

- [ ] **Step 2: Lint**

Run: `npx eslint src/pages/onboarding/OnboardingParentInfoPage.jsx`
Expected: no errors (drop now-unused `UsersGroupIcon`/`PlayCircleIcon` imports if the page no longer references them outside the panel).

- [ ] **Step 3: Commit**

```bash
git add src/pages/onboarding/OnboardingParentInfoPage.jsx
git commit -m "refactor(onboarding): migrate ParentInfo page to OnboardingShowcasePanel"
```

---

## Task 9: Migrate the Address page

**Files:**

- Modify: `src/pages/onboarding/OnboardingAddressPage.jsx`

Address has the OTP badge + a bespoke phone-preview pill (matches Contact's). Keep the phone pill inline.

- [ ] **Step 1: Replace the panel**

a) Delete the local `AddressRightPanel` subcomponent block.

b) Add import:

```jsx
import {
  OnboardingShowcasePanel,
  OtpBadge,
  WatchTutorialBadge,
} from '../../components/shared/onboarding-panel';
```

c) Replace `<AddressRightPanel />` with:

```jsx
<OnboardingShowcasePanel>
  <OtpBadge />
  {/* Phone preview pill — bespoke to Address */}
  <div
    className="absolute rounded-[10px] border border-accent-light-active bg-accent-light p-2"
    style={{
      right: 36,
      bottom: 140,
      width: 230,
      transform: 'rotate(2deg)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 3px 0 #967014, 0 8px 28px rgba(200, 149, 26, 0.14)',
    }}
  >
    <div className="flex items-center gap-2">
      <span className="flex size-7 shrink-0 items-center justify-center rounded-[5px] bg-accent-light-active text-accent-darker">
        <span className="text-[9px] font-bold">MTN</span>
      </span>
      <div className="flex flex-col gap-1">
        <p className="text-[12px] font-bold leading-tight text-[#111111]">Phone</p>
        <p className="text-[11px] leading-[15px] text-[#70706E]" style={{ letterSpacing: '0.1px' }}>
          +233 24 123 4567
        </p>
      </div>
    </div>
  </div>
  <WatchTutorialBadge />
</OnboardingShowcasePanel>
```

> If the existing Address phone-pill copy/number differs, use the page's existing values verbatim.

- [ ] **Step 2: Lint**

Run: `npx eslint src/pages/onboarding/OnboardingAddressPage.jsx`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/onboarding/OnboardingAddressPage.jsx
git commit -m "refactor(onboarding): migrate Address page to OnboardingShowcasePanel"
```

---

## Task 10: Migrate the Education page

**Files:**

- Modify: `src/pages/onboarding/OnboardingEducationPage.jsx`

- [ ] **Step 1: Replace the panel**

a) Delete the local `EducationRightPanel` subcomponent block (and its preceding "Byte-identical…" comment).

b) Add import:

```jsx
import {
  OnboardingShowcasePanel,
  OtpBadge,
  WatchTutorialBadge,
} from '../../components/shared/onboarding-panel';
```

c) Replace `<EducationRightPanel />` with:

```jsx
<OnboardingShowcasePanel>
  <OtpBadge />
  <WatchTutorialBadge />
</OnboardingShowcasePanel>
```

- [ ] **Step 2: Lint**

Run: `npx eslint src/pages/onboarding/OnboardingEducationPage.jsx`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/onboarding/OnboardingEducationPage.jsx
git commit -m "refactor(onboarding): migrate Education page to OnboardingShowcasePanel"
```

---

## Task 11: Migrate the Welcome page

**Files:**

- Modify: `src/pages/onboarding/OnboardingWelcomePage.jsx`

The Welcome panel takes a `showToast` prop and has a bespoke "Saved" badge. Keep the Saved badge inline; the panel itself does not need `showToast` unless a child uses it — pass it through to the inline child if required.

- [ ] **Step 1: Inspect the existing WelcomeRightPanel to capture its unique cards**

Run:

```bash
sed -n '201,260p' src/pages/onboarding/OnboardingWelcomePage.jsx
```

Expected: shows the `WelcomeRightPanel` body — note the "Saved" badge JSX and any element that uses `showToast`.

- [ ] **Step 2: Replace the panel**

a) Delete the local `WelcomeRightPanel` subcomponent block.

b) Add import:

```jsx
import {
  OnboardingShowcasePanel,
  WatchTutorialBadge,
} from '../../components/shared/onboarding-panel';
```

c) Replace `<WelcomeRightPanel showToast={showToast} />` with the shared panel, moving the existing "Saved" badge JSX in verbatim as a child (wire its `onClick`/`showToast` exactly as before):

```jsx
<OnboardingShowcasePanel>
  {/* Saved badge — bespoke to Welcome (Figma 2858:23720); paste the
      existing Saved-badge JSX here verbatim, preserving its showToast wiring */}
  <WatchTutorialBadge />
</OnboardingShowcasePanel>
```

- [ ] **Step 3: Lint**

Run: `npx eslint src/pages/onboarding/OnboardingWelcomePage.jsx`
Expected: no errors. If `showToast` is now unused on the page, remove it; if still used by the Saved badge child, keep it.

- [ ] **Step 4: Commit**

```bash
git add src/pages/onboarding/OnboardingWelcomePage.jsx
git commit -m "refactor(onboarding): migrate Welcome page to OnboardingShowcasePanel"
```

---

## Task 12: Full verification + docs

**Files:**

- Modify: `wiki/log.md`
- Modify: relevant wiki page if one documents onboarding panels (check `wiki/INDEX.md`)

- [ ] **Step 1: Lint, format-check, and build the whole project**

Run:

```bash
npm run lint && npm run format:check && npm run build
```

Expected: all pass. Fix any issues (commonly: prettier formatting, unused imports left from deleted panels).

- [ ] **Step 2: Run the full e2e suite**

Run:

```bash
npm run test:e2e
```

Expected: all pass, including `onboarding-panel.spec.js` and the existing `home.spec.js`.

- [ ] **Step 3: Visual verification via Playwright MCP**

Start the dev server (`npm run dev`), then with the Playwright MCP:

- Navigate to `http://localhost:5173/onboarding/dob`.
- Take a screenshot; compare side-by-side against the Figma frame screenshot (3 bordered photos: rose top-left, cream mid-right, sage bottom-left; compliance pill top-right; Data Protected bottom-left; Adult/Youth picker lower-right).
- Open the console; confirm no errors and that the `[OnboardingShowcasePanel] mount` debug log appears.
- Spot-check `/onboarding/contact` and `/onboarding/parent-info` for their bespoke cards.
- Adjust photo `top`/`left`/`width`/`rotate` percentages in `OnboardingShowcasePanel.jsx` if the composition drifts from Figma, then re-screenshot.

- [ ] **Step 4: Update the wiki log**

Append to `wiki/log.md`:

```markdown
## [2026-06-08] refactor | shared OnboardingShowcasePanel

Extracted the duplicated onboarding right-panel into
`src/components/shared/onboarding-panel/OnboardingShowcasePanel.jsx` with
exported card primitives. Migrated all 7 onboarding pages. Photos converted
to WebP. Rebuilt to the full Figma Frame 141 (node 4540:33239) 3-photo
composition. ✅ VERIFIED via Playwright e2e + MCP screenshot.
```

- [ ] **Step 5: Commit**

```bash
git add wiki/log.md
git commit -m "docs(onboarding): log OnboardingShowcasePanel extraction"
```

---

## Self-review checklist (completed by plan author)

- **Spec coverage:** scaffold (Task 4), photos→WebP (Task 1), sparkles inline SVG (Task 2), card primitives (Task 3), compliance pill baked in (Task 4), all 7 migrations (Tasks 5-11), testing + visual verify (Tasks 5, 12), debug log (Task 4). ✅
- **Deviation flagged:** spec §9 render-tests → Playwright e2e (no unit runner). ✅
- **Type/name consistency:** `OnboardingShowcasePanel`, `DataProtectedBadge`, `OtpBadge`, `ParentalConsentBadge`, `ExperiencePickerCard`, `WatchTutorialBadge` used identically in barrel, component, and all migration tasks. ✅
- **Bespoke cards** (phone preview, guardian summary, Saved badge) explicitly kept inline rather than forced into primitives. ✅
