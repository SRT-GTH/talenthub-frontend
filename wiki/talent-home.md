# Talent home (`/home`) — Focused + Playful

> Figma: file `Bin8roWL8sloyc36IgFMuT`, canvas "Talents dashboard" `5686:95479`. Created 2026-10-17. Read [playful-mode.md](playful-mode.md) FIRST — its rules (Figma-exact colours, `playful:` variant only, no invented copy, add-only shared edits, scope attribute, verification protocol) apply here unchanged.

## Decisions (owner, 2026-10-17)

- Build **both styles in one build**: Focused is the default look, Playful through the existing style switch (`UiStyleScope` puts `data-ui-style` on `<html>`; every Playful rule uses the `playful:` variant). Focused frames (`8097:*`) and Playful frames (`7731:*` etc.) both exist in Figma and each is checked against its own frame.
- Route **`/home`**, outside `MainLayout` (same as the other dashboard screens).
- Chrome: **extend the recruiter shell** (`DashboardShell` / `DashboardTopNav` / mobile nav) with a talent variant (`role="talent"`). **Recruiter pages must stay pixel-identical** (strict visual baselines: `VISUAL_TOL=0.0003`). Edits to shared files are add-only.
- No backend: state is mock and chosen by URL params (`talentHomeState.js`), shaped so an API can replace it.

## State → URL → Figma frame (Playful / Focused)

| URL                                 | State                            | Playful                  | Focused                    |
| ----------------------------------- | -------------------------------- | ------------------------ | -------------------------- |
| `/home`                             | Day 1 (1 of 9)                   | `7731:530`               | `8097:4669`                |
| `/home?state=discoverable`          | Discoverable (5 of 9)            | `7732:530`               | `8097:6075`                |
| `…&journey=min`                     | Journey minimised                | `7756:182221`            | `8097:6467`                |
| `/home?state=complete`              | Just completed (9 of 9)          | `7756:182819`            | `8097:6860`                |
| `/home?state=top`                   | Top Talent (active job seeker)   | `7730:5351`              | `8097:7535`                |
| `/home?tab=assessment`              | MyAssessment                     | `7741:3318`              | `8097:8194`                |
| `/home?tab=recruiter`               | Recruiter activity               | `7742:3439`              | `8097:8716`                |
| `/home?search=1`                    | Global search                    | `7748:2357`              | `8097:9162`                |
| `/home?edit=1`                      | Edit home (customise)            | `7747:206563`            | `8097:9899`                |
| `/home?loading=1` (`empty`/`error`) | Loading / empty / error per card | `7733:731`               | `8097:10681`               |
| `/home?new=welcome`                 | NU-01 first-login welcome        | `7745:2187`              | `8097:3691`                |
| `/home?new=tour`                    | NU-02 guided tour (step 1 of 4)  | `7745:181414`            | `8097:4191`                |
| `/home?new=chat`                    | NU-04 Career Buddy first chat    | `7746:2685`              | `8097:5050`                |
| `/home?new=gate`                    | NU-03 apply-before-Discoverable  | `7745:181986`            | `8097:5570`                |
| `…&a11y=1` / nav toggle             | A11Y-01 spec, A11Y-02 a11y mode  | `7751:2581`, `7752:2799` | `8097:10843`, `8097:11539` |

Other nodes: `Sidebar · talent` `7740:11213`, `Nav` `8315:461634`, `GTH · Ask Buddy FAB` `7862:59664`, style `seg` `7843:14206`.

## File ownership (one agent per row — do not edit another row's files)

| Owner  | Files (all under `src/components/sections/talentHome/` unless noted)                                                                           |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Lead   | `talentHomeState.js`, `src/pages/talentHome/TalentHomePage.jsx`, route in `App.jsx`, this page, `scripts/playful-leak-check.mjs`               |
| Shell  | `src/components/sections/dashboard/DashboardShell.jsx`, `DashboardTopNav.jsx`, mobile nav files (add-only talent variant), `TalentSidebar.jsx` |
| Core   | `TalentHomeHero.jsx`, `JourneyCard.jsx`, `CareerBuddyIntroCard.jsx`, `FirstQuestsCard.jsx`, `UnlocksSection.jsx`, `ExploreRolesStrip.jsx`      |
| Tabs   | `MyAssessmentTab.jsx`, `RecruiterActivityTab.jsx`, `GlobalSearchOverlay.jsx`, `EditHomePanel.jsx`                                              |
| Flows  | `NewUserWelcome.jsx`, `GuidedTour.jsx`, `ApplyGateModal.jsx`, `CareerBuddyFirstChat.jsx`, Ask-Buddy FAB                                        |
| States | `TalentHomeLoading.jsx` (loading/empty/error per card), accessibility mode + landmarks/focus order (A11Y-01/02) across all files — last        |

Each section component receives `home` (see `useTalentHomeState`): `{ snapshot, stateKey, tab, loading, newUser, journeyMin, searchOpen, editOpen, a11yMode, update(patch) }`. Add fields to `SNAPSHOTS` only by appending; never rename. `update({ key: value })` edits the URL.

## Status (2026-10-17)

| Piece                                                                                                        | Status                                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route `/home`, page, state source, scope, font loader, leak check                                            | `✅ VERIFIED` (`/home` renders, `data-ui-style` set, console clean; leak check allows Career Buddy + `/home` only)                                                            |
| Chrome — `TalentDashboardShell`, top nav (add-only in `DashboardTopNav`), `TalentSidebar`, `TalentMobileNav` | built; Playful HM-01/02 + Focused HM-03 chrome compared by eye `✅ VERIFIED`; Focused sidebar white backing block unconfirmed `🔶 LIKELY`                                     |
| Home states Day 1 / Discoverable / minimised / complete / Top Talent                                         | built; Day 1 Playful + Focused compared by eye `✅ VERIFIED`; others by agents only `🔶 LIKELY`                                                                               |
| MyAssessment, Recruiter activity, Global search                                                              | built, compared by eye (1728) `✅ VERIFIED`                                                                                                                                   |
| Edit home (HM-05)                                                                                            | wired on complete/top states only; Playful compared `✅ VERIFIED`, Focused not compared. Defaults: all cards shown (the frame's hidden Recent activity/Badges are not seeded) |
| NU-01 welcome, NU-03 gate, NU-04 chat, Ask Buddy FAB                                                         | built, compared by eye `✅ VERIFIED`                                                                                                                                          |
| NU-02 guided tour                                                                                            | step 1 of 4 only — Figma draws only step 1 (`TOUR_STEPS` in `GuidedTour.jsx`) — NOT BUILT beyond step 1                                                                       |
| HM-04 loading                                                                                                | skeleton built `✅ VERIFIED`; per-card empty/error NOT drawn in Figma — pieces exist (`TalentHomeStates.jsx`, no default copy), not mounted                                   |
| A11Y-01/02                                                                                                   | built (below)                                                                                                                                                                 |
| Gates (2026-10-17)                                                                                           | lint 0 errors, build OK, leak check clean, `/home` responsive 10/10, strict recruiter+community visual pass (exit 0 on a quiet tree)                                          |

**Decisions / assumptions for the owner:** Playful Top Talent/complete sidebar frames show a flat lime sidebar while Day 1/2 use the shelf look — shelf used everywhere; Skills Lab / My Learning nav icons hand-drawn (Figma export empty); phone layouts are our design (no phone frames); nav destinations other than Home/My Assessment only log; "Create my avatar" -> `/profile/engagement/identity`, "Continue: Interests" -> `/profile/filling/interests`, "Start chat"/"Continue" -> Career Buddy; percentile copy "72th"/"41th" is verbatim Figma; the skip-link "Enter" chip is hidden below lg (11px < the 12px mobile floor).

**Assets:** SVGs are named components in `src/components/shared/assets.jsx` under five `// ---- Talent home · …` headers; media are descriptive kebab-case files in `src/assets/talent-home/{home,tabs,flows,a11y}/` plus the shared `career-buddy-robot.png`.

## A11Y (A11Y-01 / A11Y-02) — built 2026-10-17

- Landmarks `✅ VERIFIED`: `<header>` (top nav), `<nav aria-label="Main">` (+ "More") in the rail, `<main id="main" tabIndex=-1>`, `<aside aria-label="For you">` (right column, `HomeColumns.jsx`). Skip link "Skip to main content · Enter" is the first tab stop (`TalentDashboardShell.jsx`, Figma 7751:3305).
- Focus ring `✅ VERIFIED`: 3px `#111`, 2px offset, keyboard only, `html[data-talent-home]` (`src/styles/talentA11y.css`). The 2px white gap is an outline-offset (not a white box-shadow).
- A11Y-02 (`?a11y=1`): `TalentA11yMenu.jsx` (trigger ring + panel, prefs in `useA11yPrefs.js`, localStorage `gth:a11y-prefs`). Shell sets `data-a11y-contrast|motion|links`; CSS sweeps in `talentA11y.css`: text `#595959`→`#2b2b2b` (not chips), `#e7e7e7` borders→`#767676` + no soft shadow, links underlined (`data-link`), blobs/doodle stars hidden, stickers upright, animations off. `prefers-reduced-motion` honoured for all talent-home motion.
- Not applied: text-size A/small/large has no drawn page effect (control stores the choice only); the stray 38px trigger drawn above the panel in the frame is omitted.
