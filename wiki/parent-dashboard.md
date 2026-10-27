# Parent dashboard (`/parent/*`)

> Figma: file `SCXc457vwiq6o7d9g4jVbh`, canvas "Parent · 01 Home and dashboard" `10057:530` (persona Emma Mensah, mother of Abena 16 and Elliot 15). Built 2026-10-26, Focused only, frontend only (mock data).

## Routes and states

One page, `src/pages/parent/ParentHomePage.jsx`, state chosen by `?state=`. Router `src/pages/parent/ParentApp.jsx` (outside `MainLayout`, mounted in `App.jsx` as `/parent/*`). Other sidebar pages (`/parent/wards`, `review`, `evaluate`, `wallets`, `notifications`, `settings`, `help`) land on a "not designed yet" note inside the chrome.

| URL                        | Figma frame           | State                                                                       |
| -------------------------- | --------------------- | --------------------------------------------------------------------------- |
| `/parent` or `?state=busy` | PD-01 `10027:1458`    | Everyday home, three wards, four things waiting                             |
| `?state=caught-up`         | PD-01d `10056:158090` | Nothing needs the parent                                                    |
| `?state=offline`           | PD-07 `10077:20066`   | Everyday home + "You're offline" banner                                     |
| `?state=first`             | PD-01b `10034:1556`   | First visit after Abena is linked                                           |
| `?state=none`              | PD-01c `10034:2499`   | No linked ward yet                                                          |
| `?state=loading`           | PD-05 `10047:147949`  | Skeleton while the wards load                                               |
| `?state=error`             | PD-06 `10047:148153`  | Couldn't load (offline note); "Try again" plays loading 1.2 s then the home |

## Files (`src/components/sections/parent/`)

- Chrome: `ParentFrame.jsx` (fixed viewport, grid bg, Ask Buddy icon), `ParentTopBar.jsx`, `ParentSidebar.jsx`, `data/parentCoreData.js` (persona, nav, `SIDEBAR_STATES` none / linked / caughtUp), `ParentButton.jsx` (3D button).
- States: `states/ParentNoWard.jsx`, `ParentFirstVisit.jsx`, `ParentHomeError.jsx`, `ParentHomeLoading.jsx` (skeleton sidebar / main / note; shimmer in `src/styles/parent.css`).
- Overview: `home/ParentOverview.jsx` (variant `busy` | `caughtUp`, `offline`), `ParentHero`, `WardsCard`, `WaitingCard`, `ActivityCard`, `ParentRail`, `HomeCardHead`, `data/parentHomeData.js`.
- Assets: `src/assets/parent/` (Figma exports; photos are small webp).

## Assumptions (⚠️ ASSUMPTION)

- Buttons, links, search, profile menu and the sidebar collapse toggle only `log(...)`: Figma draws none of the screens they open. The Ask Buddy icon (Focused look) only logs: no parent Buddy panel is drawn.
- Sidebar hidden under 1024 px; the "Parent view" chip hidden under 1280 px (it would sit on the search field).
- Abena / Elliot tabs only change the selected look. Hidden Figma cards (Streak and quests, More for you) are omitted.
- PD-05 prints the profile as "Emma A." in Figma (typo); every screen here says "Emma M.".
- Skeleton shimmer speed (1.6 s) is ours; Figma draws the gradient only. Some small icons (Review now, Evaluate my child, button user/arrow) were not exported by Figma and are drawn inline.
- Fonts use the repo `font-sans` fallback (SF Pro Rounded is not loaded), so a few labels wrap slightly more than in Figma.

## Canvas 02 · My wards and ward page (node `10057:560`, built 2026-10-27)

| URL                                                 | Figma frame                                                                      | Notes                                                          |
| --------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `/parent/wards`                                     | PW-01 `10033:5115`                                                               | My wards · All                                                 |
| `/parent/wards?unlinked=elliot`                     | PW-15b `10078:25861`                                                             | list without Elliot, sidebar "1 ward linked", toast            |
| `/parent/wards/abena` (`?tab=overview`)             | PW-02 `10034:3257`                                                               | Abena overview                                                 |
| `/parent/wards/elliot`                              | PW-02b `10041:3643`                                                              | Elliot overview                                                |
| `?tab=evaluations` / `wallet` / `activity` / `crew` | PW-11 `10049:769` / PW-12 `10049:1231` / PW-13 `10049:1713` / PW-16 `10105:2989` | tabs (Abena drawn; Elliot shows the same mock rows)            |
| `/parent/wards/abena?notice=turning18`              | PW-10 `10041:4106`                                                               | modal "Abena turns 18 on 12 March" over the overview           |
| `?modal=visibility`                                 | PW-14 `10049:2185`                                                               | Who can find Abena; Save shows the PW-14b `10056:530` toast    |
| `/parent/wards/elliot?modal=unlink`                 | PW-15 `10078:23842`                                                              | Unlink Elliot; confirm goes to `/parent/wards?unlinked=elliot` |

Files: `src/components/sections/parent/wards/` (`WardsAll`, `WardShell`, `WardOverview`, `Turning18Notice`, `WardChip`, `data/wardsData.js`, `tabs/*`, `dialogs/*`), pages `src/pages/parent/ParentWardsPage.jsx`, `ParentWardPage.jsx`.
Assumptions: the Profile and Flags tabs are drawn but have no page (buttons only log); Figma draws no trigger for the visibility dialog, so a small "Who can find Abena" button sits next to the Active chip; Review profile / Evaluate / Opt out / Top up / Decide only log; the unlink exists only in the URL (reload brings Elliot back); Undo on toasts only closes them; Activity and Crew filter chips only change which chip looks selected.
Shared-component pass (2026-10-27, additive so other sessions are unaffected): `ParentButton` is now a thin wrapper over `ui/Button` (primary / `tertiary`), and `ui/Button` gained an additive `to` prop (renders a router `Link`; callers without `to` are unchanged). `ParentToast` wraps the new shared `ui/ActionToast` (dark confirmation toast with an optional action) and `WardChip` wraps the new shared `ui/StatusPill`. Dialogs already use `AgencyDialog`; the home cards already use `ui/Button`.
Still to merge once the other flows settle: `ActionToast` vs `QueryToast` / `AgencySettingsToast` / `BriefingToast` (and `ui/Toast`), `StatusPill` vs `AgencyStatusChip`, `ParentSidebar` / `ParentTopBar` vs `TalentSidebar` / `DashboardTopNav`, the three `Spot` empty-state cards, the skeleton shimmer (`.pd-skeleton` vs `.buddy-shimmer`).
