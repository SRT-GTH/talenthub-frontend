# Talent Games v2 (`/skills-lab/play/:gameId`, Games tab)

Figma file `Bin8roWL8sloyc36IgFMuT`, canvas **Talent - Skills Lab** `7500:92564`, sections "Games v2 · 1 … 14" (added by the designer after the Arcade build; 53 frame pairs = 106 frames, Playful + Focused). Mock data only. Started 2026-11-01.

New: 13 ranked / practice games (Memory Match, Pattern Pulse, Word Shuffle, Switch Sort, Three in a Row, Grid Logic, Sum Grid, Tower Shift, Errand Run, Chess Tactics, Chess Match, Crisis Room, Makola Haggle). The legacy Arcade games (`/skills-lab/games/:id`, wiki: [talent-skills-lab.md](talent-skills-lab.md)) are untouched; GV-01 draws the new "Skill games" block ABOVE the Arcade block (now titled "Arcade", its "Personality games" heading reads "Play style games"). The new Crisis Room / Makola Haggle are separate builds from the legacy ones (different ids and routes).

## URL contract

See the header of `src/components/sections/talentSkillsLab/gamesV2/gamesV2State.js` (details dialog `?tab=games&game=<id>`, play `/skills-lab/play/<id>?mode=ranked|practice&level=…&f=<code>`, `&modal=quit|timeup|offline`, `?view=result`).

## Frame checklist (status ⬜ = not proven; ✅ only after the URL renders AND was compared with BOTH exports)

| Frame                                       | Playful      | Focused      | URL                                                                            | P diff | F diff | Status | Group          |
| ------------------------------------------- | ------------ | ------------ | ------------------------------------------------------------------------------ | ------ | ------ | ------ | -------------- |
| GV-01 · Skills Lab · Games tab              | `9598:34402` | `9598:36301` | `/skills-lab?tab=games&demo=1`                                                 | 6.8%   | 5.0%   | ✅     | tab            |
| GV-02 · Game details · Memory Match         | `9599:36707` | `9599:45338` | `/skills-lab?tab=games&demo=1&game=memory-match`                               | 4.1%   | 2.3%   | ✅     | tab            |
| GV-03 · Game details · Ranked on cooldown   | `9599:38594` | `9599:47164` | `/skills-lab?tab=games&demo=1&game=memory-match&mode=practice&gstate=cooldown` | 4.1%   | 4.1%   | ✅     | tab            |
| GV-09 · Resume a saved game                 | `9599:41513` | `9599:50022` | `/skills-lab?tab=games&demo=1&dialog=resume&game=pattern-pulse`                | 3.3%   | 1.7%   | ✅     | tab            |
| GV-13 · Game expired (24 h)                 | `9599:43542` | `9599:51990` | `/skills-lab?tab=games&demo=1&dialog=expired&game=pattern-pulse`               | 3.3%   | 1.7%   | ✅     | tab            |
| GV-04 · Memory Match · In play · Correct    | `9612:50427` | `9612:56786` | `/skills-lab/play/memory-match?f=GV-04`                                        | 1.3%   | 1.0%   | ✅     | platform       |
| GV-05 · Memory Match · Practice · Wrong     | `9612:51230` | `9612:57455` | `/skills-lab/play/memory-match?mode=practice&f=GV-05`                          | 1.3%   | 1.0%   | ✅     | platform       |
| GV-06 · Quit confirm (ranked)               | `9612:52019` | `9612:58110` | `/skills-lab/play/memory-match?f=GV-06&modal=quit`                             | 1.0%   | 0.9%   | ✅     | platform       |
| GV-07 · Time’s up                           | `9612:52856` | `9612:58813` | `/skills-lab/play/memory-match?f=GV-07&modal=timeup`                           | 1.2%   | 1.1%   | ✅     | platform       |
| GV-08 · Connection lost                     | `9612:53723` | `9612:59516` | `/skills-lab/play/memory-match?f=GV-08&modal=offline`                          | 1.3%   | 1.0%   | ✅     | platform       |
| GV-10 · Result · Ranked                     | `9612:54498` | `9612:60157` | `/skills-lab/play/memory-match?view=result&f=GV-10`                            | 1.4%   | 1.1%   | ✅     | platform       |
| GV-11 · Result · Ranked · under 18          | `9612:55266` | `9612:60791` | `/skills-lab/play/memory-match?view=result&f=GV-11`                            | 1.4%   | 1.1%   | ✅     | platform       |
| GV-12 · Result · Makola Haggle (play style) | `9612:55999` | `9612:61390` | `/skills-lab/play/makola-haggle?view=result&f=GV-12`                           | 1.2%   | 0.9%   | ✅     | platform       |
| PP-01 · Pattern Pulse · Thinking            | `9611:51142` | `9611:55712` | `/skills-lab/play/pattern-pulse?f=PP-01`                                       | 1.3%   | 1.1%   | ✅     | numbers-words  |
| PP-02 · Answer sent                         | `9611:51896` | `9611:56327` | `/skills-lab/play/pattern-pulse?f=PP-02`                                       | 1.2%   | 1.0%   | ✅     | numbers-words  |
| PP-03 · Correct · rule revealed             | `9611:52668` | `9611:56959` | `/skills-lab/play/pattern-pulse?f=PP-03`                                       | 1.3%   | 1.1%   | ✅     | numbers-words  |
| PP-04 · Wrong · answer shown                | `9611:53437` | `9611:57588` | `/skills-lab/play/pattern-pulse?f=PP-04`                                       | 1.4%   | 1.1%   | ✅     | numbers-words  |
| PP-05 · Time almost up                      | `9611:54191` | `9611:58203` | `/skills-lab/play/pattern-pulse?f=PP-05`                                       | 1.3%   | 1.1%   | ✅     | numbers-words  |
| PP-06 · Expert · two patterns take turns    | `9611:54946` | `9611:58818` | `/skills-lab/play/pattern-pulse?f=PP-06`                                       | 1.3%   | 1.2%   | ✅     | numbers-words  |
| WS-01 · Word Shuffle · Building the word    | `9619:51010` | `9619:54062` | `/skills-lab/play/word-shuffle?f=WS-01`                                        | 1.3%   | 1.1%   | ✅     | numbers-words  |
| WS-02 · Wrong guess · one more try          | `9619:51771` | `9619:54689` | `/skills-lab/play/word-shuffle?f=WS-02`                                        | 1.3%   | 1.2%   | ✅     | numbers-words  |
| WS-03 · Hint used · first letter locked     | `9619:52541` | `9619:55325` | `/skills-lab/play/word-shuffle?f=WS-03`                                        | 1.3%   | 1.1%   | ✅     | numbers-words  |
| WS-04 · Correct                             | `9619:53305` | `9619:55955` | `/skills-lab/play/word-shuffle?f=WS-04`                                        | 1.3%   | 1.2%   | ✅     | numbers-words  |
| SS-01 · Switch Sort · Sort by colour        | `9619:56616` | `9619:59949` | `/skills-lab/play/switch-sort?f=SS-01`                                         | 1.3%   | 1.2%   | ✅     | focus-strategy |
| SS-02 · Correct · tick on the basket        | `9619:57464` | `9619:60663` | `/skills-lab/play/switch-sort?f=SS-02`                                         | 1.4%   | 1.3%   | ✅     | focus-strategy |
| SS-03 · Rule changed · sort by shape        | `9619:58318` | `9619:61383` | `/skills-lab/play/switch-sort?f=SS-03`                                         | 1.4%   | 1.2%   | ✅     | focus-strategy |
| SS-04 · Expert · no rule sign · wrong       | `9619:59170` | `9619:62101` | `/skills-lab/play/switch-sort?f=SS-04`                                         | 1.4%   | 1.3%   | ✅     | focus-strategy |
| TR-01 · Three in a Row · Your turn          | `9619:62695` | `9619:65642` | `/skills-lab/play/three-in-a-row?f=TR-01`                                      | 1.9%   | 1.5%   | ✅     | focus-strategy |
| TR-02 · Kwaku is thinking                   | `9619:63430` | `9619:66243` | `/skills-lab/play/three-in-a-row?f=TR-02`                                      | 1.9%   | 1.4%   | ✅     | focus-strategy |
| TR-03 · You win the game                    | `9619:64174` | `9619:66853` | `/skills-lab/play/three-in-a-row?f=TR-03`                                      | 2.0%   | 1.5%   | ✅     | focus-strategy |
| TR-04 · Square taken · not allowed          | `9619:64912` | `9619:67457` | `/skills-lab/play/three-in-a-row?f=TR-04`                                      | 1.9%   | 1.5%   | ✅     | focus-strategy |
| GL-01 · Grid Logic · Cell selected          | `9621:59009` | `9621:65240` | `/skills-lab/play/grid-logic?f=GL-01`                                          | 1.4%   | 1.1%   | ✅     | logic-grids    |
| GL-02 · Clash shown                         | `9621:59794` | `9621:65891` | `/skills-lab/play/grid-logic?f=GL-02`                                          | 1.4%   | 1.2%   | ✅     | logic-grids    |
| GL-03 · Puzzle number · not allowed         | `9621:60581` | `9621:66544` | `/skills-lab/play/grid-logic?f=GL-03`                                          | 1.5%   | 1.2%   | ✅     | logic-grids    |
| GL-04 · Expert · 9×9 with notes             | `9621:61451` | `9621:67280` | `/skills-lab/play/grid-logic?f=GL-04&level=expert`                             | 1.4%   | 1.1%   | ✅     | logic-grids    |
| SG-01 · Sum Grid · Filling a cage           | `9621:62195` | `9621:67890` | `/skills-lab/play/sum-grid?f=SG-01`                                            | 1.3%   | 1.1%   | ✅     | logic-grids    |
| SG-02 · Cage full but wrong                 | `9621:62948` | `9621:68509` | `/skills-lab/play/sum-grid?f=SG-02`                                            | 1.4%   | 1.2%   | ✅     | logic-grids    |
| SG-03 · Row clash                           | `9621:63699` | `9621:69126` | `/skills-lab/play/sum-grid?f=SG-03`                                            | 1.3%   | 1.1%   | ✅     | logic-grids    |
| SG-04 · Solved                              | `9621:64464` | `9621:69757` | `/skills-lab/play/sum-grid?f=SG-04`                                            | 1.3%   | 1.0%   | ✅     | logic-grids    |
| TS-01 · Tower Shift · Disc lifted           | `9621:70347` | `9621:72538` | `/skills-lab/play/tower-shift?f=TS-01`                                         | 1.2%   | 1.0%   | ✅     | planning-chess |
| TS-02 · Bigger on smaller · not allowed     | `9621:71080` | `9621:73137` | `/skills-lab/play/tower-shift?f=TS-02`                                         | 1.3%   | 1.1%   | ✅     | planning-chess |
| TS-03 · Solved                              | `9621:71813` | `9621:73736` | `/skills-lab/play/tower-shift?f=TS-03`                                         | 1.2%   | 0.9%   | ✅     | planning-chess |
| ER-01 · Errand Run · Planning the route     | `9623:54218` | `9623:56662` | `/skills-lab/play/errand-run?f=ER-01`                                          | 2.1%   | 1.6%   | ✅     | planning-chess |
| ER-02 · Map done · longer than shortest     | `9623:55025` | `9623:57335` | `/skills-lab/play/errand-run?f=ER-02`                                          | 2.4%   | 2.0%   | ✅     | planning-chess |
| ER-03 · Shortest route found                | `9623:55832` | `9623:58008` | `/skills-lab/play/errand-run?f=ER-03`                                          | 2.3%   | 1.8%   | ✅     | planning-chess |
| CT-01 · Chess Tactics · Second move         | `9623:58555` | `9623:59987` | `/skills-lab/play/chess-tactics?f=CT-01`                                       | 1.8%   | 1.7%   | ✅     | planning-chess |
| CT-02 · Checkmate · puzzle solved           | `9623:59262` | `9623:60560` | `/skills-lab/play/chess-tactics?f=CT-02`                                       | 1.8%   | 1.6%   | ✅     | planning-chess |
| CM-01 · Chess Match · Your move             | `9623:61152` | `9623:62560` | `/skills-lab/play/chess-match?f=CM-01`                                         | 1.9%   | 1.6%   | ✅     | planning-chess |
| CM-02 · Blunder graded                      | `9623:61854` | `9623:63128` | `/skills-lab/play/chess-match?f=CM-02`                                         | 1.9%   | 1.6%   | ✅     | planning-chess |
| CR-01 · Crisis Room · Order and choose      | `9623:64964` | `9623:67359` | `/skills-lab/play/crisis-room?f=CR-01`                                         | 1.5%   | 1.4%   | ✅     | server-games   |
| CR-02 · Why this order (after the round)    | `9623:65408` | `9623:67669` | `/skills-lab/play/crisis-room?f=CR-02`                                         | 2.7%   | 2.2%   | ✅     | server-games   |
| MH-01 · Makola Haggle · Your move           | `9623:65939` | `9623:68066` | `/skills-lab/play/makola-haggle?f=MH-01`                                       | 2.0%   | 1.9%   | ✅     | server-games   |
| MH-02 · Move picked                         | `9623:66661` | `9623:68653` | `/skills-lab/play/makola-haggle?f=MH-02`                                       | 2.0%   | 2.0%   | ✅     | server-games   |

Status: every frame renders at its URL in Playful and Focused and was compared by pixel diff (`framecmp`, viewport = frame height − 52, Figma 0.5x exports, 2026-11-01). About 1–2 % is font metrics alone (SF Pro Rounded is not installed here). GV-01 (tall frame, hub chrome behind) 6.8 % / 5.0 % and the four hub dialogs 1.7–4.1 % include hub text that is not part of this build. Hub frames use `&demo=1` (live hub data answers 401 locally). A low % does not prove copy or state: copy was read from `texts.py` per frame and the frames were compared by eye (see _Not verified by eye_).

## Code map (`src/components/sections/talentSkillsLab/gamesV2/`)

- Foundation (lead): `gamesV2State.js` (URL contract), `GameV2Shell.jsx` (reuses `LabTopBar` / `LabHeaderBar` / `LabProgressStrip` of `LabPlayChrome`; optional `subtitle`, `sticker`, `footer.note: null|''`), `GameV2Footer.jsx` (`link.size: 'lg'` = 15px), `useGameClock.js`, page `src/pages/talentSkillsLab/GameV2Page.jsx` (route `/skills-lab/play/:gameId`, auto-discovers `games/*.jsx`: `GAMES_V2` + `GAMES_V2_META`).
- Games tab (GV-01/02/03/09/13): `GamesV2Section.jsx`, `GameV2Card.jsx`, `GameV2CategoryFilters.jsx`, `GameV2DialogLayer.jsx` (+ details / resume / expired dialogs, level + mode pickers), `gamesV2Data.js` (13-game catalogue), `gamesV2Urls.js`, `GamesV2Icons.jsx`. Edited existing: `SkillsLabGamesTab.jsx` (new block on top + "Arcade" head, "Personality games" → "Play style games"), `skillsLabGamesData.js`, `SkillsLabHubPage.jsx` (mounts the dialog layer).
- Platform: `GameV2Dialogs.jsx` (quit / time's up / connection lost), `GameV2Result.jsx` + `gamesV2ResultData.js` (generic for all 13 games, under-18 and play-style variants), `memoryMatch/*`.
- Games: `games/<Name>.jsx` + folders `patternPulse`, `wordShuffle`, `switchSort`, `threeInARow`, `gridLogic` (also used by Sum Grid), `sumGrid`, `towerShift`, `errandRun`, `chess` (Tactics + Match), `planningShared` (head / feedback chip / icons), `crisisRoom`, `makolaHaggle`, `serverGame` (mock server + `useServerMove`).
- Audit: 98 URLs appended to `tests/e2e/helpers/responsive.js`; `scripts/playful-leak-check.mjs` allows `/skills-lab/play/`.

## Decisions

- The new block is ADDED above the legacy Arcade block; nothing was removed. The legacy Arcade games (`/skills-lab/games/:id`, incl. the old Crisis Room / Makola Haggle) are untouched. New games live under `/skills-lab/play/:gameId` so ids do not collide.
- Result card, quit / time's up / offline dialogs and the shell are shared by all 13 games; a game only draws its board and calls `finish({ score, skills, summary, verifies })`.
- Leaving a RANKED game asks first (GV-06); practice leaves straight away ⚠️ ASSUMPTION (only GV-06 is drawn).

## Known gaps / assumptions (none of this is drawn in Figma)

- **Invented content (tagged ⚠️ ASSUMPTION in the data files):** every level other than the drawn one (sizes, counts, clocks), question / puzzle / sequence / word banks, scoring formulas, result numbers (percentile, XP, cohort line, personal best 82), lose / draw / resign copy, details-dialog content for the 12 games other than Memory Match, how-to-play steps, the Games-history button (inert), "Ask Career Buddy about this" target, the mock "server" (650 ms delay, `?sim=offline`) for Crisis Room / Makola Haggle, Kwaku's AI strength per level, chess grading (2-ply material), static "240 XP / 7-day streak" in the header.
- **Puzzles:** every shipped puzzle was checked with a solver script (Grid Logic 6×6 / 9×9 and Sum Grid cage sets have exactly one solution; the Figma-drawn givens for GL 6×6 / 9×9 and SG 4×4 are NOT unique, so fresh runs add locked squares and only the `?f=` frames show the drawn boards); chess puzzles verified with chess.js (mate in 1 / 2, unique); Errand Run shortest routes brute-forced.
- **Figma inconsistencies kept as drawn:** Memory Match board shows 6 of 8 pairs with lone faces; result says "Found all 10 pairs" on a 4×4; Pattern Pulse card "6 of 10 pairs" vs resume dialog "round 5 of 8"; details dialog says "60 or more" while the brief says 80; Grid Logic "18 of 36 filled" with 20 digits, GL-04 clock 7:40 vs 18:05, SG-04 3:12 vs 6:48; Sum Grid / Grid Logic clash highlights in GL-02 / SG-02; Switch Sort chips copied between frames; Three in a Row game dot vs label; chess boards identical in all four chess frames (move lists name pieces the board lacks); Errand Run ER-03 lead is false on the drawn map; Crisis Room alarm 2 "Efua first" vs list showing Kwabena first; CR-02 and TR match panels are drawn 43–47px tall with overflowing content (built as proper cards).
- **Not drawn:** end states of Tower Shift / Errand Run / Chess games, time-out of most games, lose / draw states, phone frames (own dense layouts), persistence ("Saved as you go" is a static chip; nothing is stored — "Resume game" only exists for Pattern Pulse, the one drawn saved game, and opens round 5 of 8 with rounds 1–4 done ⚠️ ASSUMPTION).
- **Shared-file follow-ups:** `LabProgressStrip` never wraps its dots (games cap or window them below 1280); `GameV2Head` is built three times (Memory Match, planning games, grid games) and could be one shared component; dev CSS cache needed a touch of `src/index.css` once.
