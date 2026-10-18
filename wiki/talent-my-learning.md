# Talent My Learning (`/learning`) — Focused + Playful

> Figma file `Bin8roWL8sloyc36IgFMuT` ("Gh-Design-system--Talents"). Created 2026-10-18. 40 frames (20 Playful + 20 Focused). Same rules as [talent-home.md](talent-home.md) / [talent-profile.md](talent-profile.md) / [playful-mode.md](playful-mode.md): both styles in one build (Focused default, Playful ONLY via `playful:` variants), Figma-exact values (especially colours), verbatim copy, no invented copy, SVGs as named components in `src/components/shared/assets.jsx`, media descriptively named under `src/assets/talent-learning/<area>/`, talent shell reuse, add-only shared edits, state chosen by query params.

## Decisions

- Route **`/learning`** (confirmed by the owner 2026-10-18), outside `MainLayout`, `DashboardShell role="talent" activeNav="learning"`.
- Both styles in one build; each frame checked against its own Figma frame.
- No backend: state is mock, chosen by URL params (`talentLearningState.js`).

## Figma access — USE THE CACHE, NOT THE API

The Figma MCP and the old REST token are rate-limited. A new token (owner-provided) fetched everything once. It is stored ONLY in the git-ignored `.figma-token.local` (read automatically by the scripts); **never print it, copy it into any tracked file or paste it into prompts/reports**:

- Node JSON for all 40 frames: `tests/playful/figma-nodes/<id with _>.json` (git-ignored).
- 2x reference PNGs for all 40 frames: `tests/playful/figma-images/<id with _>.png` (git-ignored).
- **Read exact values (no API call):** `node scripts/figma-node-tree.mjs <frameId> [maxDepth] [--find=text] [--from=nodeId]` prints every node with size/position (relative to the frame), flex layout/gap/padding, fills (solid + gradients), strokes, radius, shadows, opacity, and for text the characters + font/size/weight/line-height/colour.
- **Export icons/illustrations (costs quota — batch ALL ids in ONE call, only if you cannot hand-draw them):** `node scripts/figma-export-nodes.mjs --format=svg --out=<scratch dir> <nodeId>...`. Then convert the SVG to a named component in `assets.jsx` (the file is Figma-verbatim by convention); never keep loose .svg files.
- Compare by eye: Playwright screenshot of the app vs the cached PNG (frame is 1728x1117 and includes a 52px Safari toolbar at the top, which is not part of the app — use a viewport of 1728x1065).
- Do NOT call the Figma API for anything else, and do NOT re-run the audit scripts.

## State → URL → Figma frame (Playful / Focused)

| URL                         | Frame                                        | Playful     | Focused      |
| --------------------------- | -------------------------------------------- | ----------- | ------------ |
| `/learning`                 | ML-01 My Learning · In progress              | `7522:104`  | `8110:10737` |
| `?view=course`              | ML-02 Course detail · Power BI Basics        | `7523:227`  | `8110:11212` |
| `?view=lesson`              | ML-03 Lesson player · SQL Module 4           | `7524:306`  | `8110:11625` |
| `?view=complete`            | ML-04 Course complete 🎉 (SQL verified)      | `7525:382`  | `8110:12020` |
| `?view=certificates`        | ML-05 Certificates                           | `7525:937`  | `8110:12546` |
| `?view=recommended`         | ML-06 Recommended courses                    | `7527:625`  | `8110:12904` |
| `?empty=1`                  | ML-07 My Learning · empty (nothing started)  | `7527:1080` | `8110:13310` |
| `?loading=1`                | ML-08 My Learning · loading                  | `7527:1427` | `8110:13617` |
| `?toast=saved`              | SV-01 Course saved (toast)                   | `7536:972`  | `8110:15698` |
| `?tab=saved`                | SV-02 My Learning · Saved                    | `7536:1505` | `8110:16121` |
| `?tab=saved&empty=1`        | SV-03 My Learning · Saved (empty)            | `7536:1892` | `8110:16470` |
| `?quick=question`           | QC-01 Quick check · question                 | `7537:1245` | `8110:17354` |
| `?quick=correct`            | QC-02 Quick check · correct                  | `7537:1563` | `8110:17644` |
| `?quick=wrong`              | QC-03 Quick check · wrong (explained)        | `7537:1887` | `8110:17940` |
| `?quick=passed`             | QC-04 Quick check · passed (module complete) | `7537:2214` | `8110:18239` |
| `?quick=retry`              | QC-05 Quick check · not passed (retry)       | `7537:2527` | `8110:18522` |
| `?view=explore`             | EX-01 Explore courses                        | `7538:1631` | `8110:19619` |
| `?view=explore&ex=category` | EX-02 Explore · Data & analytics             | `7538:2064` | `8110:20029` |
| `?view=explore&ex=search`   | EX-03 Explore · search results               | `7538:2488` | `8110:20429` |
| `?view=explore&ex=none`     | EX-04 Explore · no results                   | `7538:2872` | `8110:20769` |

Each frame contains its own copy of the shell (Sidebar 303x977, Main Content Canvas 1329x977, Safari toolbar) — the shell is the Shell agent's; build only the content column.

## File ownership (one agent per row — do not edit another row's files)

All under `src/components/sections/talentLearning/` unless noted.

| Owner   | Files                                                                                                                                                                                                                                    |
| ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lead    | `talentLearningState.js`, `src/pages/talentLearning/TalentLearningPage.jsx`, route in `App.jsx`, this page, leak-check/route-list entries, `scripts/figma-node-tree.mjs`, `scripts/figma-export-nodes.mjs`                               |
| Shell   | `TalentDashboardShell.jsx`, `TalentSidebar.jsx`, `TalentMobileNav.jsx`, `talentShellData.js` (under `sections/talentHome/`) — add-only: `activeNav="learning"`, My Learning navigates to `/learning`, learning rail card data per frames |
| Hub     | `LearningHub`, `LearningInProgress`, `LearningRecommended`, `LearningEmptyState`, `LearningLoading`, `LearningSavedTab`, `LearningSavedToast` (+ own `LearningHub*.jsx` / `talentLearningHubData.js`)                                    |
| Course  | `CourseDetail`, `LessonPlayer`, `QuickCheck`, `CourseComplete`, `LearningCertificates` (+ own `Course*.jsx` / `talentLearningCourseData.js`)                                                                                             |
| Explore | `ExploreCourses` (+ own `Explore*.jsx` / `talentLearningExploreData.js`)                                                                                                                                                                 |

Each section component receives `learning` (see `useTalentLearningState`): `{ view, tab, quick, ex, empty, loading, toast, a11yMode, update(patch) }`. `update({ key: value })` edits the URL (null removes a key). Other sessions edit the shared shell files (profile/notifications) — keep edits small and re-read before editing.

## Status (2026-10-18) — built, partly verified

| Piece                                                                                 | Status                                                                                                                                                                                                                                             |
| ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Route `/learning`, page, state source, scope, leak check + route list                 | `✅ VERIFIED` (leak check passes; page padding matches Figma's 1329px column at 1728)                                                                                                                                                              |
| Shell: `activeNav="learning"`, learning rail card, Messages badge 4, phone More sheet | built; compared by eye vs ML-01 in both styles `🔶 LIKELY`; tablet icon rail not screenshotted                                                                                                                                                     |
| Hub ML-01, ML-06, ML-07, ML-08, SV-01..03                                             | built; Hub agent compared by eye region-by-region at 1728 vs the cached PNGs for most frames in both styles                                                                                                                                        |
| Course ML-02, ML-03, QC-01..05, ML-04, ML-05                                          | built; compared by eye; **Focused ML-04 compared by the lead `✅ VERIFIED`** (matches the frame)                                                                                                                                                   |
| Explore EX-01..04                                                                     | built, interactive; most states compared by eye                                                                                                                                                                                                    |
| Responsive audit (`--only=learning`)                                                  | `✅ 60/60` — 12 states x 5 widths (text raised to 12px below lg where Figma draws 11–11.5px)                                                                                                                                                       |
| Gates                                                                                 | lint 0 errors in learning files (repo lint has one error in another session's `src/_tmp_jobs_harness.jsx`); build passes (one esbuild warning in `OnboardingEducationPage.jsx`: duplicate `helperIcon` — another session's file); leak check clean |

**Flow (Figma prototype links, read from the cached node JSON):** Check answer -> correct, Continue -> passed, Share certificate (ML-04) -> Certificates, Certificates <-> Recommended tabs, SV-03 Saved tab -> SV-02, toast View -> Saved, Explore search -> results, Data & analytics chip -> category. Wired in code: all of the above plus Start course -> lesson, Take the quick check -> quiz, passed: Back to course / Start module 5. **No prototype link leads INTO Course complete (ML-04)** — it is the end-of-course screen after the final module; the mock has only module 4 of 7, so it is reachable only via `?view=complete`.

**Assumptions / gaps (Figma doesn't draw them):** only question 1 of 3 exists, so "Got it, next" -> `retry`, "Try again" -> `question`, "Start module 5" -> lesson are assumptions; Transcript/Resources tabs render nothing; Completed tab has no frame (inert); "Need a hint?", "Ask Career Buddy to explain it differently", "Ask Career Buddy what to learn" and the video controls are visual only; two Figma strings look truncated but kept verbatim ("Shows on your profile with a", "Recruiters see the . Verified by GTH, not self-reported."); Explore: only the Data & analytics chip works, sort/See all/Request this course/"Closest we have" are inert, "View course" -> `?view=course` is an assumption, search keywords are ours; SV-01 toast overlays Course detail in Figma (`?view=course&toast=saved`); mobile/tablet layouts derived from desktop (no phone frames); SF Pro Rounded not installed (Nunito fallback, text widths differ).

**Not yet done:** strict recruiter/community visual gate result (run after the shared nav/shell edits), by-eye comparison of every remaining frame at 390/320, hover/focus states, real screen-reader and forced-colors checks.
