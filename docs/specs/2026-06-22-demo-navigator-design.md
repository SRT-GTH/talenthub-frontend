# Demo Navigator — Design Spec

**Date:** 2026-06-22
**Branch:** feat/onboarding-showcase-panel
**Status:** Approved, pending implementation

---

## Problem

The onboarding flows (talent + institution) have no API integration yet. For demos we need a way to step through every screen without filling out forms or hitting real endpoints.

---

## Solution

A `DemoNavigator` component — a floating toolbar that appears only in `import.meta.env.DEV` builds. It lets a presenter navigate forward/backward through either onboarding flow, and toggle adult/minor mode for the talent flow.

---

## Architecture

- **File:** `src/components/shared/DemoNavigator.jsx`
- Mounted **once** in `App.jsx`, outside all route definitions, so it persists across navigations without remounting.
- Returns `null` unless `import.meta.env.DEV === true` — zero footprint in production builds.
- Only renders its UI when `location.pathname.startsWith('/onboarding/')` — hidden on all other pages.
- No changes to existing pages, providers, layouts, or Redux store.

---

## Route Config (static, hardcoded)

### Talent — Adult (7 steps)

| #   | Label         | Path                               |
| --- | ------------- | ---------------------------------- |
| 1   | Welcome       | `/onboarding/talent/welcome`       |
| 2   | Date of Birth | `/onboarding/talent/dob`           |
| 3   | Personal Info | `/onboarding/talent/personal-info` |
| 4   | Contact       | `/onboarding/talent/contact`       |
| 5   | Address       | `/onboarding/talent/address`       |
| 6   | Education     | `/onboarding/talent/education`     |
| 7   | Review        | `/onboarding/talent/review`        |

### Talent — Minor (8 steps)

Same as adult with `parent-info` inserted at position 7:

| #   | Label       | Path                             |
| --- | ----------- | -------------------------------- |
| 7   | Parent Info | `/onboarding/talent/parent-info` |
| 8   | Review      | `/onboarding/talent/review`      |

### Institution (10 steps)

| #   | Label            | Path                                       |
| --- | ---------------- | ------------------------------------------ |
| 1   | Guidelines       | `/onboarding/institution/guidelines`       |
| 2   | Your Institution | `/onboarding/institution/your-institution` |
| 3   | Contact          | `/onboarding/institution/contact`          |
| 4   | Activate         | `/onboarding/institution/activate`         |
| 5   | Template Guide   | `/onboarding/institution/template-guide`   |
| 6   | Template         | `/onboarding/institution/template`         |
| 7   | Upload           | `/onboarding/institution/upload`           |
| 8   | Validate         | `/onboarding/institution/validate`         |
| 9   | Confirm          | `/onboarding/institution/confirm`          |
| 10  | Report           | `/onboarding/institution/report`           |

---

## State

All local `useState` inside `DemoNavigator`. No Redux, no context.

| State        | Type                        | Default    | Notes                                           |
| ------------ | --------------------------- | ---------- | ----------------------------------------------- |
| `activeFlow` | `'talent' \| 'institution'` | `'talent'` | Which flow's step list is active                |
| `isMinor`    | `boolean`                   | `false`    | Talent-only; inserts parent-info step when true |

`currentIndex` is **derived** — computed each render by matching `useLocation().pathname` against the active step list. This keeps the toolbar in sync even if the user navigates manually (e.g. via the browser back button).

When `isMinor` toggles, the step list is recomputed. If `currentIndex` would be out of range, it clamps to the last step.

---

## UI

**Position:** Fixed, bottom-center, `z-50` (or inline `zIndex: 9999`).

**Shape:** Semi-transparent dark pill / card, white text. Matches onboarding aesthetic without clashing with page content.

**Controls (left → right):**

1. **Flow switcher** — two pill buttons: `Talent` | `Institution`. Active one highlighted.
2. **Minor toggle** — checkbox + label `Minor`. Visible only when `activeFlow === 'talent'`.
3. **Step counter** — `{currentIndex + 1} / {steps.length} · {step.label}` (e.g. `3 / 7 · Contact`).
4. **Prev button** — `←`. Disabled on first step.
5. **Next button** — `→`. Disabled on last step.

---

## Behaviour Details

- **Prev / Next** call `useNavigate()(steps[currentIndex ± 1].path)`.
- **Flow switch** resets to step 1 of the new flow (`navigate(steps[0].path)`).
- **Minor toggle** recomputes step list; if current path no longer exists in new list, stays on nearest valid step.
- Toolbar is **not** shown on paths outside `/onboarding/` (e.g. `/login`, `/get-started`).

---

## Files Changed

| File                                      | Change                                                               |
| ----------------------------------------- | -------------------------------------------------------------------- |
| `src/components/shared/DemoNavigator.jsx` | **New** — the entire feature                                         |
| `src/App.jsx`                             | **+2 lines** — import + mount `<DemoNavigator />` outside route tree |

No other files touched.

---

## Out of Scope

- Bypassing form validation (pages still render their forms; presenter skips filling them in by using the toolbar)
- Mocking API calls
- Persisting demo state across page refreshes
