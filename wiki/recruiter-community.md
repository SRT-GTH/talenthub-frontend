# Recruiter Community Engagement — overview (Figma "Recruiter - Community Engagement")

> Figma: file `OHG2xsfCCskT8xEn356njv`, canvas `10026:36840`, 48 frames at 1728 wide, built 2026-11-06, frontend only, mock data. `🔗 EXTERNAL`
> The canvas is "converted 1:1 from talent": the **same talent Community pages** serve both audiences. The variant is read from the URL (`/recruiter/community…`), so every frame reproduces from a fresh load. ✅ VERIFIED

## Architecture

- `talentCommunity/communityVariant.js`: `useCommunityVariant()` gives `{isRecruiter, base}`; `communityHref(base, rest)`. Every internal link uses `base`.
- `communityState.js` forces the drawn mock on recruiter paths (no recruiter API yet).
- `CommunityFrame` / `CircleFrame`: on recruiter paths render the recruiter `DashboardShell` (SF Pro Rounded via `useScopedRoundedFont('data-recruiter-ui')`, no Playful, no Ask Buddy). `?rail=collapsed` becomes `defaultSidebarCollapsed`.
- Copy and data per audience: `communityContent.js` (`useCommunityContent()`), `create/useCreateCommunityCopy.js`, `circle/useCircleVariantData.js`. Talent values are the untouched talent exports.
- Routes (`App.jsx`): `/recruiter/community`, `/:communityId`, `/:communityId/post/:postId`, `/create`, `/:communityId/manage`, `/people/:personId`. Sidebar Community item links to `/recruiter/community`.

## Areas (frame → URL tables and diff % are in each page)

| Area                | Frames                    | Page                                                             | Spec                                       |
| ------------------- | ------------------------- | ---------------------------------------------------------------- | ------------------------------------------ |
| Clubs               | RC-C01…C17 (3.1-10.6 %)   | [recruiter-community-clubs.md](recruiter-community-clubs.md)     | `recruiter-community-clubs.spec.js` (12)   |
| Host a company club | RC-CC02…CC17b (3.4-5.9 %) | [recruiter-community-host.md](recruiter-community-host.md)       | `recruiter-community-host.spec.js` (11)    |
| My network          | RC-NW01…NW11 (2.0-11.6 %) | [recruiter-community-network.md](recruiter-community-network.md) | `recruiter-community-network.spec.js` (12) |

## Lead verification 2026-11-06

- 3 new specs + `community-browse` (talent): 37 passed, 1 flaky (passed on retry).
- Responsive gate, 59 recruiter URLs at 320/390/1024/1440: all pass after one fix (toast action buttons were under 24 px: `CircleToast`); a few cold-load flakes pass on rerun.
- eslint clean; `npm run build` passes. Prettier: only pre-existing/other-session files warn (`App.jsx` recruiter-jobs lines, `communityData.js`, `live/*`).

## Known gaps / Figma inconsistencies

- **Login bounce (fixed 2026-11-06):** `CommunityFrame` called `useTalentHomeState()` on recruiter pages; the talent home API 401 then ran `navigate('/login')` (seen on `/create`, `…/manage?state=live`, intermittently). Now `useTalentHomeState({ enabled: !isRecruiter })` never calls it; regression: `recruiter-no-login-bounce.spec.js` (reproduced the bug with the fix off). A signed-in recruiter's real data is not checked: these pages are mock only.
- Top bar still reads "Kofi A." and "Search opportunities, skills, communities…" (Figma: "Joel K.", "Search talent, jobs and clubs…"). The recruiter `DashboardShell` is shared with every other recruiter flow, so it was left alone. ⚠️ needs a decision.
- Ask Assistant fab drawn only on RC-C01 in Figma; not rendered. Sidebar Community "3" badge and the "New" tag not drawn.
- Shell calls the talent-home API unauthenticated (401 console noise in demo).
- Dialogs centre in the real viewport; Figma centres them in a taller frame (RC-C08/C10/C17/NW02).
- RC-C09 is drawn over a copied talent chat page; ours sits over Clubs. Details of every other inconsistency and ⚠️ assumption are in the three area pages.
- Not verified: hover/focus states, phone-width pixel comparison (no phone frames), a real screen reader, a live backend.
