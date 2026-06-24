# OnboardingShowcasePanel — Design

> Date: 2026-06-08
> Author: Emmanuel Amokuandoh (with Claude Code)
> Figma source: `Gh-Design-system-onboading`, Frame 141 — node `4540:33239`
> (file key `Bin8roWL8sloyc36IgFMuT`)

## 1. Problem

The onboarding right-hand "showcase" panel is duplicated across **7 pages**
(`OnboardingDobPage`, `OnboardingPersonalInfoPage`, `OnboardingContactPage`,
`OnboardingParentInfoPage`, `OnboardingAddressPage`, `OnboardingEducationPage`,
`OnboardingWelcomePage`). Each page declares its own near-identical
`*RightPanel` subcomponent (~90 lines each) built on the same brand-green
scaffold, and all of them stub the imagery as CSS-gradient placeholders.

Two issues:

1. **Duplication** — the constant scaffold (background, orbs, photos,
   compliance pill) is copied 7 times. Any change must be made 7 times.
2. **Fidelity gap** — the real Figma frame is a 3-photo composition with
   real photography, decorative sparkle sprites, and a faint grid texture.
   The current panels show gradient rectangles instead.

## 2. Goal

Extract one shared, faithful `OnboardingShowcasePanel` that renders the full
Figma composition once, and let each page compose only its step-specific
floating cards on top of it. Replace all 7 page-local panels with it.

## 3. What is constant vs variable

**Constant scaffold (identical on every page):**

- `aside`: brand-green (`#387440`) base, `border-l` `#E7E7E7`, `hidden lg:block`,
  `w-[42%]`, `min-h-[calc(100vh-160px)]`, `overflow-hidden`, `relative`.
- Two gradient orbs: cream `#F7EFDD` top-right, pink `#F9EBEA` bottom-left
  (kept as CSS blurred gradients, not SVG).
- Faint grid texture, bottom-right.
- Three decorative sparkle clusters (inline SVG): blob-stars (top-center),
  snow/drops pattern (top-left), spark-26 (mid-left, rotated).
- **Three tilted photos** with exact Figma styling (see §6).
- **Compliance pill** (top-right) — constant copy: "Ghana Data Protection Act
  compliant".

**Variable floating cards (differ per step):**

| Card                   | Appears on                            |
| ---------------------- | ------------------------------------- |
| `DataProtectedBadge`   | Dob (Basics), PersonalInfo (Profile)  |
| `OtpBadge`             | Contact, Address, Education           |
| `ParentalConsentBadge` | ParentInfo                            |
| `SavedBadge`           | Welcome                               |
| `PhonePreviewPill`     | Contact, ParentInfo, Address          |
| `ExperiencePickerCard` | Dob (Basics)                          |
| `WatchTutorialBadge`   | all (expanded w/ label, or collapsed) |

All 7 pages share the **same 3 photos** (the Basics/DOB set). A future
per-step photo set is out of scope; the scaffold bakes the photos in with no
`photos` prop for now.

## 4. Approach

**Chosen: scaffold + composable card slot (Approach A).**

`OnboardingShowcasePanel` renders the constant scaffold and exposes a
`children` slot. Per-step cards are exported primitives that each page
composes. Rejected alternatives: a fully-declarative flag-based props API
(buries positioning, grows an internal switch, less flexible) and
page-local-only rebuild (leaves the duplication in place).

## 5. File structure

```
src/components/shared/onboarding-panel/
├── OnboardingShowcasePanel.jsx   // scaffold + compliance pill + children slot
├── panelCards.jsx                // exported card primitives
├── panelSparkles.jsx             // 3 inline-SVG sparkle clusters
└── index.js                      // barrel re-exports

src/assets/onboarding/right-panel/
├── photo-1-library.webp          // converted from downloaded PNG
├── photo-2-students.webp
├── photo-3-studio.webp
└── grid.webp                     // grid texture (PNG acceptable if small)
```

The orb blobs stay CSS gradients; the downloaded `ellipse-*.svg` files are
reference-only and need not ship. Downloaded source PNGs live in
`src/assets/onboarding/right-panel/` already and are converted to WebP
during implementation (target: well under the ~2.3 MB-each originals).

## 6. Component API

```jsx
import {
  OnboardingShowcasePanel,
  DataProtectedBadge,
  ExperiencePickerCard,
} from '../../components/shared/onboarding-panel';

<OnboardingShowcasePanel>
  <DataProtectedBadge />
  <ExperiencePickerCard />
</OnboardingShowcasePanel>;
```

`OnboardingShowcasePanel` props:

- `children` — the per-step floating cards (absolutely positioned).
- `className` — optional passthrough merged onto the `aside`.

Exported card primitives (each absolutely positioned, self-contained):

- `DataProtectedBadge`, `OtpBadge`, `ParentalConsentBadge`, `SavedBadge`
- `PhonePreviewPill`
- `ExperiencePickerCard`
- `WatchTutorialBadge` — `label?: string`; collapsed (play-only) when omitted.

## 7. Fidelity & positioning

Figma frame is 739×916 absolute. To stay faithful **and** scale with the 42%
panel width:

- Photos positioned in **percentages** (matches the working current pattern).
- Cards anchored to panel edges in px offsets.
- Font sizes use `clamp()` per CLAUDE.md figma-fidelity rules.

Exact tokens from Figma:

- Photo borders: cream `#EEDEB8`, rose `#EBC2BD`, sage `#C1D4C4`;
  `border-[10px]`, `rounded-[40px]`.
- Photo shadow: `0px 16px 24px -6px rgba(27,36,44,0.16),
0px 2px 2px -1px rgba(27,36,44,0.04)`.
- Photo rotations: ~`+5°`, `+7°`/`-8.5°`, `-13°`/`-18°` (tuned to match the
  Figma render during visual verification).
- Compliance pill: `bg-white`, `rounded-[10px]`, `px-2.5 py-2`, text 14px
  `#387440`, `leading-6`, `tracking-[0.1px]`.
- Experience picker: `bg-[rgba(255,255,255,0.92)]` + `backdrop-blur-[8px]`,
  `rounded-[16px]`, active row `bg-[#E1EAE2]` w/ 6px green dot, inactive 6px
  `#575755` dot, label 12px.

## 8. Migration

Replace all 7 page-local panels with `OnboardingShowcasePanel` + the page's
cards:

| Page                         | Cards composed                                                   |
| ---------------------------- | ---------------------------------------------------------------- |
| `OnboardingDobPage`          | `DataProtectedBadge`, `ExperiencePickerCard`                     |
| `OnboardingPersonalInfoPage` | `DataProtectedBadge`, `WatchTutorialBadge`                       |
| `OnboardingContactPage`      | `OtpBadge`, `PhonePreviewPill`, `WatchTutorialBadge`             |
| `OnboardingParentInfoPage`   | `ParentalConsentBadge`, `PhonePreviewPill`, `WatchTutorialBadge` |
| `OnboardingAddressPage`      | `OtpBadge`, `PhonePreviewPill`, `WatchTutorialBadge`             |
| `OnboardingEducationPage`    | `OtpBadge`, `WatchTutorialBadge`                                 |
| `OnboardingWelcomePage`      | `SavedBadge`, `WatchTutorialBadge`                               |

Delete the dead local subcomponents and their now-unused imports after each
swap. The `WatchTutorialBadge` label per page is carried over verbatim from
the existing copy (e.g. DOB: "Start (Date of Birth)").

## 9. Testing

Per CLAUDE.md (TDD + Playwright verification):

- **Render tests** (`OnboardingShowcasePanel.spec.jsx`): scaffold renders;
  all 3 photos present (by alt/role); compliance pill copy present; `children`
  render inside the panel.
- **Playwright MCP visual check**: navigate to `/onboarding/dob`, screenshot,
  compare against the Figma frame, confirm clean console.

## 10. Debug logging

Presentational, so logging is minimal: one `debug('OnboardingShowcasePanel')`
mount log noting the child-card count, per the debug-log discipline.

## 11. Out of scope

- Per-step photo sets (all pages share the same 3 photos for now).
- Mobile rendering of the panel (it remains `hidden lg:block`).
- Re-exporting the orb blobs as SVG assets.
