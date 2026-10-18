# Talent Streaks (`/streak` + nav pop-up)

Figma file `Bin8roWL8sloyc36IgFMuT`, canvas "Talent Streaks" `7532:2` (Playful `7533:*`, Focused `8110:21905…`). Mock data only (`talentStreakData.js`), shaped for an API.

## URL → Figma

| URL                                                 | Frame                                                                                    | Playful / Focused                                                         |
| --------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `/streak`                                           | S-07 Your streak (full page)                                                             | 7534:1027 / 8110:24742                                                    |
| `/streak?milestone=15`                              | S-08 15-day milestone (On Fire badge) modal                                              | 7534:1615 / 8110:25229                                                    |
| any talent page `?streak=open`                      | S-01 pop-up active (drawn over `/learning`)                                              | 7533:28 / 8110:21906                                                      |
| `?streak=done` / `risk` / `freeze` / `lost` / `new` | S-02 done today · S-03 at risk · S-04 freeze used · S-05 lost (repair) · S-06 new talent | 7533:697, 1359, 2020, 2682, 3347 / 8110:22379, 22852, 23325, 23798, 24270 |
| `?help=1`                                           | HP help overlay                                                                          | 8374:531 / 8374:862                                                       |

Pop-up component set: `GTH · Streak pop-up` 7532:317 (Focused 8256:90621).

## Code map

- Page: `src/pages/talentStreak/TalentStreakPage.jsx`, `src/components/sections/talentStreak/` (`streakPageState.js`, `StreakPageHeader/Hero/Calendar/Cards`, `StreakMilestoneModal`, `streakCalendarUtils.js` — real Monday-first month math over mock lit dates).
- Pop-up: `StreakPopover.jsx` (mounted in `DashboardTopNav`; the nav streak pill is now a button that toggles `?streak=open`).
- Pop-up data: `talentStreakData.js` (`STREAK_POPOVER_STATES`, `STREAK_HELP_COPY` — Help overlay on `/streak` shows "FOR THIS PAGE · STREAKS" via `helpPage: 'streak'`). The "learn" CTAs go to `/learning`, "See streak details" to `/streak`; "Repair my streak" / "Start fresh" only log + close ⚠️ ASSUMPTION (no destination drawn).
- Shell: `activeNav="streak"` → Job Postings rail card data, no sidebar item highlighted.

## Known gaps / assumptions

- Toggle "off" colour, "Share it" (navigator.share only), cell accessible names, hidden cell captions below 640px are ASSUMPTIONS (page agent report).
- Leaderboard "You" stays 12 in S-08 as drawn.
- Pop-up: Focused component-sheet twin (8256:90621) differs from the Focused S-frames; the S-frames were followed. Phone layout of the pop-up is our own (no Figma phone frames).
- Not run: end-to-end suite, strict visual baseline, 390/320 screenshots of the pop-up beyond the responsive audit (40/40 pass).
