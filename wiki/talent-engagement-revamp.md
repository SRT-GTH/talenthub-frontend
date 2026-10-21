# Engagement revamp — manual profile filling (Figma canvas "Engagement 1 - gamified" `3125:10352`)

> Created 2026-10-21. **Status: 🔶 BUILT, only partly verified.** Figma REST access was restored (new token in git-ignored `.figma-token.local`); node JSON and 0.5x PNG exports of all 144 frames were fetched.

## Status (2026-10-21)

- Built (✅ VERIFIED to render, eslint and `npm run build` clean): journey hub, avatar, interests, personality (intro/quiz/working/result/path), skills (intro/empty), work, portfolio, certs, goals, pitch, complete, CV upload (`/profile/filling/cv`, CV-01..05, via `pages/engagementV2/UploadCvPage.jsx`), and the **Personality Arcade** (`pages/engagementV2/PersonalityArcadePage.jsx`, `components/sections/engagementV2/arcade/`).
- Arcade URLs: `/profile/filling/personality/arcade` (PA-01), `?modal=details` (PA-02, Makola Haggle only), `?played=3&modal=archetype` (PA-13), `?played=3`, `?filter=<Category>`. Playing goes to `/profile/filling/personality/arcade/:gameId` (existing `GamePage`); `usePersonalityRun` is arcade-aware (records finished games in localStorage `gth:arcade-played`, returns to the hub, opens the archetype modal at 3 games).
- Arcade not drawn / not connected: details modal for the other 9 games (Makola layout reused is NOT in Figma), "Suggest a game", "Sort: Shortest first" (static), played state is browser-local (no API). Arcade checked by eye in Playful only; Focused and pixel diff not run.
- Known open diffs: Interests IN-03 (4th card/layout), Journey rail Milestones card about 16px tall, Certs stage-bar label, Personality PE-01/PA-00 vertical offsets, nav text dx 7-14px, Focused styles unverified for most screens.
- Skills labs: the engagement `?view=lab` hub (SK-04) launches the existing labs and games (`/skills-lab/lab/:id/play?from=engagement`, `/skills-lab/games/:id?from=engagement`); with `from=engagement` their exits return to `/profile/filling/skills?view=lab` (`LabPlayPage`, `gameKit`). SK-05..SK-18h and SA-02..SA-12 carry the same names and frame codes as the earlier Skills Lab canvas (SL-L05.., SL-GS02..), which was pixel-verified then (see talent-skills-lab.md). 🔶 LIKELY the same screens: the new canvas exports could not be downloaded (Figma REST 429), so they are NOT pixel-compared.
- Pixel pass (`framecmp`, 144 frames, both styles, 2026-10-21): most frames 3-9% (map/photo pages run higher). Outliers: IN-04 12% (not investigated), GO-05 9.8%, J-03 8.3%, avatar Outfit 8.8%. CV-04b was 14% (review dialog stacked under the fix dialog); fixed, now 4.7% / 3.6%.
- Arcade Focused rendered and checked by eye; no pixel diff for arcade (no export mapped).
- Discovery: mixed-style text runs carry their real font sizes in `styleOverrideTable`; use the effective (majority-run) size.

## Scope (inventory, `tests/engagement/frames.json`)

12 refreshed sections, **155 screens, each drawn in Playful and Focused** (310 frames, 0 unpaired). Ignored as old: "Engagement side- iteration 1" (`3132:10451`), "avatar creation (designs)" (`3294:2958`).

| Section               | Screens | Playful section | Focused section | Existing code                                                                                                                            |
| --------------------- | ------- | --------------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Profile journey (hub) | 7       | `3384:76827`    | `8285:530`      | `ProfileEngagementPage`, `IdentityMapPage`, milestone pages (older design)                                                               |
| Avatar selection      | 6       | `3218:2745`     | `8285:3264`     | `/profile/engagement/avatar/*` (older design)                                                                                            |
| Interests             | 5       | `3384:131875`   | `8285:9859`     | `InterestsIntroPage` / `InterestsStage2Page`                                                                                             |
| Personality + Arcade  | 21      | `3576:89637`    | `8285:11029`    | Career Buddy personality + `PlayfulEscapeRoomGame` etc. (no standalone quiz / arcade routes)                                             |
| Skills + labs + games | 73      | `3625:138662`   | `8285:22613`    | `SkillsIntroPage`/`Stage2`; labs and games already built as `/skills-lab/*` (102 screens) — likely the same labs (confirm from the data) |
| Work                  | 6       | `5112:32341`    | `8285:14167`    | `WorkIntroPage` / `WorkStage2Page`                                                                                                       |
| Portfolio             | 6       | `5178:101274`   | `8285:15656`    | `PortfolioIntroPage` / `PortfolioStage2Page`                                                                                             |
| Certifications        | 6       | `5217:123652`   | `8285:17366`    | `CertsIntroPage` / `CertsStage2Page`                                                                                                     |
| Goals                 | 6       | `5619:80994`    | `8285:19017`    | `GoalsIntroPage` / `GoalsStage2Page`                                                                                                     |
| Pitch                 | 9       | `5625:92950`    | `8285:20481`    | `PitchIntroPage` / `PitchStage2Page`, `PitchRecorder`                                                                                    |
| Profile complete      | 2       | `5629:98557`    | `8285:22217`    | none (new)                                                                                                                               |
| Upload my CV (new)    | 8       | `8966:98`       | `8966:507875`   | none (new)                                                                                                                               |

## Frame → URL checklist (⚠️ ASSUMPTION: URLs are proposals, to be decided with the data; ⬜ = not built)

| Frame                                                       | Playful       | Focused       | Size      | Proposed URL                                                                  | Status |
| ----------------------------------------------------------- | ------------- | ------------- | --------- | ----------------------------------------------------------------------------- | ------ |
| **Profile journey (hub)**                                   |               |               |           |                                                                               |        |
| J-01 · Journey map · 1 of 9                                 | `7640:13290`  | `8285:531`    | 1728×1560 | `/profile/engagement`                                                         | ⬜     |
| J-05 · Journey map · 3 of 9 · Discoverable unlocked         | `7642:13401`  | `8285:868`    | 1728×1560 | `/profile/engagement?done=3`                                                  | ⬜     |
| J-06 · Milestone 2 · Top 20%                                | `7642:13846`  | `8285:1213`   | 1728×1560 | `/profile/engagement/milestone/top-20`                                        | ⬜     |
| J-07 · Milestone 3 · Top Talent                             | `7642:14295`  | `8285:1635`   | 1728×1560 | `/profile/engagement/milestone/top-talent`                                    | ⬜     |
| J-02 · Journey map · Hover a stage                          | `7643:2`      | `8285:2062`   | 1728×1560 | `/profile/engagement?hover=interests`                                         | ⬜     |
| J-03 · How do you want to add your work?                    | `7643:431`    | `8285:2415`   | 1728×1560 | `/profile/engagement?modal=add-work`                                          | ⬜     |
| J-04 · Milestone 1 · You’re discoverable                    | `7646:2`      | `8285:2850`   | 1728×1560 | `/profile/engagement/milestone`                                               | ⬜     |
| **Avatar selection**                                        |               |               |           |                                                                               |        |
| Avatar section-style                                        | `3218:2746`   | `8285:3265`   | 1728×1101 | `/profile/engagement/avatar`                                                  | ⬜     |
| Switch Modes                                                | `3326:10936`  | `8285:4307`   | 1728×1101 | `/profile/engagement/avatar?modal=switch-modes`                               | ⬜     |
| Skin selection                                              | `3317:5244`   | `8285:5468`   | 1728×1117 | `/profile/engagement/avatar/skin`                                             | ⬜     |
| Hair                                                        | `3326:7171`   | `8285:6524`   | 1728×1101 | `/profile/engagement/avatar/hair`                                             | ⬜     |
| Extra                                                       | `3326:9698`   | `8285:7628`   | 1728×1243 | `/profile/engagement/avatar/extras`                                           | ⬜     |
| Outfit                                                      | `3331:12922`  | `8285:8765`   | 1728×1119 | `/profile/engagement/avatar/outfit`                                           | ⬜     |
| **Interests**                                               |               |               |           |                                                                               |        |
| IN-01 · Interests · Pick your areas                         | `7706:2`      | `8285:9860`   | 1728×1258 | `/profile/filling/interests`                                                  | ⬜     |
| IN-02 · Interests · Your areas                              | `7706:270`    | `8285:10051`  | 1728×1241 | `/profile/filling/interests?step=areas`                                       | ⬜     |
| IN-03 · Interests · Add specifics                           | `7706:544`    | `8285:10263`  | 1728×1332 | `/profile/filling/interests?step=specifics`                                   | ⬜     |
| IN-04 · Interests · Add an area                             | `7706:184989` | `8285:10479`  | 1728×1241 | `/profile/filling/interests?modal=add-area`                                   | ⬜     |
| IN-05 · Interests · Stage complete                          | `7706:185309` | `8285:10755`  | 1728×1241 | `/profile/filling/interests?state=complete`                                   | ⬜     |
| **Personality + Arcade**                                    |               |               |           |                                                                               |        |
| PE-01 · Personality · Intro                                 | `7659:19366`  | `8285:11030`  | 1728×1123 | `/profile/filling/personality?step=intro`                                     | ⬜     |
| PE-02 · Personality quiz · Question 7                       | `7659:19623`  | `8285:11238`  | 1728×1180 | `/profile/filling/personality?step=quiz&q=7`                                  | ⬜     |
| PE-03 · Personality quiz · Answer selected                  | `7659:19809`  | `8285:11406`  | 1728×1180 | `/profile/filling/personality?step=quiz&q=7&answer=1`                         | ⬜     |
| interests(intro page(optional)                              | `7660:21908`  | `8285:11574`  | 1728×1101 | `/profile/filling/personality/arcade/<game>?f=interests(intro page(optional)` | ⬜     |
| PE-05 · Personality · Your result                           | `7662:273`    | `8285:11819`  | 1728×1451 | `/profile/filling/personality?step=result`                                    | ⬜     |
| PE-04 · Personality · Working out your result               | `7662:65`     | `8285:12019`  | 1728×1000 | `/profile/filling/personality?step=working`                                   | ⬜     |
| PA-00 · Personality · Choose your path                      | `7945:31864`  | `8285:12125`  | 1728×1123 | `/profile/filling/personality?step=path`                                      | ⬜     |
| PA-01 · Personality Arcade · Hub (0 of 3)                   | `7945:32049`  | `8285:12292`  | 1728×2353 | `/profile/filling/personality/arcade`                                         | ⬜     |
| PA-02 · Personality Arcade · Game details (Makola Haggle)   | `7945:32238`  | `8285:12477`  | 1728×1123 | `/profile/filling/personality/arcade/<game>?f=PA-02`                          | ⬜     |
| PA-03 · Makola Haggle · Round 3                             | `7945:32509`  | `8285:12735`  | 1728×1181 | `/profile/filling/personality/arcade/<game>?f=PA-03`                          | ⬜     |
| PA-03b · Makola Haggle · Round 2 · Move picked              | `7945:32614`  | `8285:12833`  | 1728×1183 | `/profile/filling/personality/arcade/<game>?f=PA-03b`                         | ⬜     |
| PA-05 · The Escape Room · Room 2                            | `7945:32850`  | `8285:12931`  | 1728×1224 | `/profile/filling/personality/arcade/<game>?f=PA-05`                          | ⬜     |
| PA-06 · Desert Island · Pack your bag                       | `7945:32954`  | `8285:13029`  | 1728×1117 | `/profile/filling/personality/arcade/<game>?f=PA-06`                          | ⬜     |
| PA-07 · Trotro Rush · Plan your route                       | `7945:33056`  | `8285:13127`  | 1728×1279 | `/profile/filling/personality/arcade/<game>?f=PA-07`                          | ⬜     |
| PA-08 · Group Chat Drama · Your reply                       | `7945:33160`  | `8285:13225`  | 1728×1347 | `/profile/filling/personality/arcade/<game>?f=PA-08`                          | ⬜     |
| PA-09 · Speed Sort · In play                                | `7945:33261`  | `8285:13323`  | 1728×1227 | `/profile/filling/personality/arcade/<game>?f=PA-09`                          | ⬜     |
| PA-10 · Tower Builder · New rule                            | `7945:33365`  | `8285:13421`  | 1728×1227 | `/profile/filling/personality/arcade/<game>?f=PA-10`                          | ⬜     |
| PA-11 · The Pitch · Recording                               | `7945:33466`  | `8285:13519`  | 1728×1117 | `/profile/filling/personality/arcade/<game>?f=PA-11`                          | ⬜     |
| PA-12 · Ludo Risk · Your roll                               | `7945:33571`  | `8285:13618`  | 1728×1129 | `/profile/filling/personality/arcade/<game>?f=PA-12`                          | ⬜     |
| PA-13 · Personality Arcade · 3 of 3 · Archetype unlocked    | `7945:33672`  | `8285:13716`  | 1728×1123 | `/profile/filling/personality/arcade/<game>?f=PA-13`                          | ⬜     |
| PA-04 · Makola Haggle · Game complete (pop-up result)       | `8182:403170` | `8285:13970`  | 1728×1117 | `/profile/filling/personality/arcade/<game>?f=PA-04`                          | ⬜     |
| **Skills + labs + games**                                   |               |               |           |                                                                               |        |
| SK-01 · Skills · First visit (empty)                        | `7664:19446`  | `8285:22614`  | 1728×1120 | `/profile/filling/skills`                                                     | ⬜     |
| SK-02 · Skills · Your skills                                | `7664:19658`  | `8285:22787`  | 1728×1515 | `/profile/filling/skills?state=list`                                          | ⬜     |
| SK-03 · Skills · Add a skill                                | `7665:2`      | `8285:23118`  | 1728×1515 | `/profile/filling/skills?modal=add`                                           | ⬜     |
| SK-04 · Skills Lab                                          | `7665:483`    | `8285:23511`  | 1728×2722 | `/skills-lab`                                                                 | ⬜     |
| SK-05 · Python lab · Challenge 5                            | `7667:2`      | `8285:23759`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-05`                                          | ⬜     |
| SK-06 · Python lab · Answer selected                        | `7667:171`    | `8285:23896`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-06`                                          | ⬜     |
| SK-07 · Python lab · Correct                                | `7667:345`    | `8285:24033`  | 1728×1166 | `/skills-lab/lab/<lab>/play?f=SK-07`                                          | ⬜     |
| SK-08 · Python lab · Not quite                              | `7667:532`    | `8285:24177`  | 1728×1168 | `/skills-lab/lab/<lab>/play?f=SK-08`                                          | ⬜     |
| SK-09 · Python lab · Hint                                   | `7667:724`    | `8285:24322`  | 1728×1164 | `/skills-lab/lab/<lab>/play?f=SK-09`                                          | ⬜     |
| SK-10 · Python lab · Verified (pass)                        | `7669:2`      | `8285:24467`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-10`                                          | ⬜     |
| SK-11 · Python lab · Not verified yet (fail)                | `7669:316`    | `8285:24700`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-11`                                          | ⬜     |
| SK-12a · Data analysis lab · Q3 · Answer selected           | `7671:2`      | `8285:24913`  | 1728×1338 | `/skills-lab/lab/<lab>/play?f=SK-12a`                                         | ⬜     |
| SK-13a · UI/UX design lab · Q4 · Answer selected            | `7671:203`    | `8285:25081`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-13a`                                         | ⬜     |
| SK-14a · Engineering planning lab · Q1 · Answer selected    | `7671:371`    | `8285:25232`  | 1728×1297 | `/skills-lab/lab/<lab>/play?f=SK-14a`                                         | ⬜     |
| SK-15a · Product management lab · Q2 · Answer selected      | `7672:2`      | `8285:25402`  | 1728×1253 | `/skills-lab/lab/<lab>/play?f=SK-15a`                                         | ⬜     |
| SK-16a · Public speaking lab · Q1 · In progress             | `7672:189`    | `8285:25560`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-16a`                                         | ⬜     |
| SK-17a · Team leadership lab · Scenario 2 · Answer selected | `7672:357`    | `8285:25703`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-17a`                                         | ⬜     |
| SK-18a · Strategic thinking lab · Puzzle 3 · Your move      | `7674:2`      | `8285:25834`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-18a`                                         | ⬜     |
| SK-10b · Python lab · Perfect score                         | `7688:2`      | `8285:26117`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-10b`                                         | ⬜     |
| SK-11b · Python lab · Tough run (2 of 8)                    | `7688:329`    | `8285:26353`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-11b`                                         | ⬜     |
| SK-12b · Data analysis lab · Q3 · Correct                   | `7688:625`    | `8285:26566`  | 1728×1436 | `/skills-lab/lab/<lab>/play?f=SK-12b`                                         | ⬜     |
| SK-12c · Data analysis lab · Q3 · Not quite                 | `7688:847`    | `8285:26743`  | 1728×1438 | `/skills-lab/lab/<lab>/play?f=SK-12c`                                         | ⬜     |
| SK-12d · Data analysis lab · Q3 · Hint                      | `7688:1071`   | `8285:26919`  | 1728×1434 | `/skills-lab/lab/<lab>/play?f=SK-12d`                                         | ⬜     |
| SK-12g · Data analysis lab · Verified (pass)                | `7688:1281`   | `8285:27095`  | 1728×1338 | `/skills-lab/lab/<lab>/play?f=SK-12g`                                         | ⬜     |
| SK-12h · Data analysis lab · Not verified yet (fail)        | `7688:1614`   | `8285:27355`  | 1728×1338 | `/skills-lab/lab/<lab>/play?f=SK-12h`                                         | ⬜     |
| SK-12e · Data analysis lab · Q2 · Trend                     | `7689:2`      | `8285:27595`  | 1728×1336 | `/skills-lab/lab/<lab>/play?f=SK-12e`                                         | ⬜     |
| SK-12f · Data analysis lab · Q4 · Correlation               | `7689:252`    | `8285:27755`  | 1728×1338 | `/skills-lab/lab/<lab>/play?f=SK-12f`                                         | ⬜     |
| SK-14b · Engineering planning lab · Q1 · Correct            | `7689:491`    | `8285:27911`  | 1728×1395 | `/skills-lab/lab/<lab>/play?f=SK-14b`                                         | ⬜     |
| SK-14c · Engineering planning lab · Q1 · Not quite          | `7689:707`    | `8285:28090`  | 1728×1397 | `/skills-lab/lab/<lab>/play?f=SK-14c`                                         | ⬜     |
| SK-14d · Engineering planning lab · Q1 · Hint               | `7689:927`    | `8285:28268`  | 1728×1393 | `/skills-lab/lab/<lab>/play?f=SK-14d`                                         | ⬜     |
| SK-14e · Engineering planning lab · Q2 · Critical path      | `7689:1133`   | `8285:28446`  | 1728×1295 | `/skills-lab/lab/<lab>/play?f=SK-14e`                                         | ⬜     |
| SK-14g · Engineering planning lab · Verified (pass)         | `7691:30`     | `8285:28616`  | 1728×1297 | `/skills-lab/lab/<lab>/play?f=SK-14g`                                         | ⬜     |
| SK-14h · Engineering planning lab · Not verified yet (fail) | `7691:367`    | `8285:28878`  | 1728×1297 | `/skills-lab/lab/<lab>/play?f=SK-14h`                                         | ⬜     |
| SK-15b · Product management lab · Q2 · Correct              | `7691:677`    | `8285:29120`  | 1728×1351 | `/skills-lab/lab/<lab>/play?f=SK-15b`                                         | ⬜     |
| SK-15c · Product management lab · Q2 · Not quite            | `7691:882`    | `8285:29287`  | 1728×1353 | `/skills-lab/lab/<lab>/play?f=SK-15c`                                         | ⬜     |
| SK-15d · Product management lab · Q2 · Hint                 | `7691:1091`   | `8285:29453`  | 1728×1349 | `/skills-lab/lab/<lab>/play?f=SK-15d`                                         | ⬜     |
| SK-15e · Product management lab · Q3 · Success metric       | `7691:1288`   | `8285:29619`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-15e`                                         | ⬜     |
| SK-15f · Product management lab · Q4 · MVP scope            | `7691:1501`   | `8285:29756`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-15f`                                         | ⬜     |
| SK-17b · Team leadership lab · Scenario 2 · Strong answer   | `7691:1715`   | `8285:29893`  | 1728×1159 | `/skills-lab/lab/<lab>/play?f=SK-17b`                                         | ⬜     |
| SK-17c · Team leadership lab · Scenario 2 · Weaker answer   | `7691:1891`   | `8285:30033`  | 1728×1161 | `/skills-lab/lab/<lab>/play?f=SK-17c`                                         | ⬜     |
| SK-17d · Team leadership lab · Scenario 2 · Hint            | `7691:2073`   | `8285:30172`  | 1728×1157 | `/skills-lab/lab/<lab>/play?f=SK-17d`                                         | ⬜     |
| SK-17g · Team leadership lab · Verified (pass)              | `7691:2241`   | `8285:30311`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-17g`                                         | ⬜     |
| SK-17h · Team leadership lab · Not verified yet (fail)      | `7691:2525`   | `8285:30532`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-17h`                                         | ⬜     |
| SK-13b · UI/UX design lab · Q4 · Correct                    | `7693:2`      | `8285:30733`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-13b`                                         | ⬜     |
| SK-13c · UI/UX design lab · Q4 · Not quite                  | `7693:210`    | `8285:30892`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-13c`                                         | ⬜     |
| SK-13d · UI/UX design lab · Q4 · Hint                       | `7693:413`    | `8285:31050`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-13d`                                         | ⬜     |
| SK-13e · UI/UX design lab · Q5 · Contrast                   | `7693:608`    | `8285:31208`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-13e`                                         | ⬜     |
| SK-13g · UI/UX design lab · Verified (pass)                 | `7693:832`    | `8285:31340`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-13g`                                         | ⬜     |
| SK-13h · UI/UX design lab · Not verified yet (fail)         | `7693:1152`   | `8285:31583`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-13h`                                         | ⬜     |
| SK-16b · Public speaking lab · Q1 · Correct                 | `7693:1449`   | `8285:31806`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-16b`                                         | ⬜     |
| SK-16c · Public speaking lab · Q1 · Not quite               | `7693:1671`   | `8285:31956`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-16c`                                         | ⬜     |
| SK-16d · Public speaking lab · Q1 · Hint                    | `7693:1874`   | `8285:32104`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-16d`                                         | ⬜     |
| SK-16e · Public speaking lab · Q2 · Cut the filler          | `7693:2056`   | `8285:32255`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-16e`                                         | ⬜     |
| SK-16g · Public speaking lab · Verified (pass)              | `7693:2263`   | `8285:32379`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-16g`                                         | ⬜     |
| SK-16h · Public speaking lab · Not verified yet (fail)      | `7693:2576`   | `8285:32614`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-16h`                                         | ⬜     |
| SK-18b · Strategic thinking lab · Puzzle 3 · Hint           | `7694:2`      | `8285:32829`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-18b`                                         | ⬜     |
| SK-18c · Strategic thinking lab · Puzzle 3 · Checkmate      | `7694:328`    | `8285:33114`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-18c`                                         | ⬜     |
| SK-18d · Strategic thinking lab · Puzzle 3 · Not mate       | `7694:658`    | `8285:33399`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-18d`                                         | ⬜     |
| SK-18g · Strategic thinking lab · Verified (pass)           | `7694:982`    | `8285:33682`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-18g`                                         | ⬜     |
| SK-18h · Strategic thinking lab · Not verified yet (fail)   | `7694:1407`   | `8285:34054`  | 1728×1117 | `/skills-lab/lab/<lab>/play?f=SK-18h`                                         | ⬜     |
| SK-15g · Product management lab · Verified (pass)           | `7699:388`    | `8285:34406`  | 1728×1253 | `/skills-lab/lab/<lab>/play?f=SK-15g`                                         | ⬜     |
| SK-15h · Product management lab · Not verified yet (fail)   | `7699:689`    | `8285:34658`  | 1728×1253 | `/skills-lab/lab/<lab>/play?f=SK-15h`                                         | ⬜     |
| SA-02 · Bug Hunt · Round 4 (line tapped)                    | `7930:32923`  | `8285:34890`  | 1728×1172 | `/skills-lab/games/<game>?f=SA-02`                                            | ⬜     |
| SA-03 · Bug Hunt · Round 4 · Squashed                       | `7932:32971`  | `8285:34994`  | 1728×1245 | `/skills-lab/games/<game>?f=SA-03`                                            | ⬜     |
| SA-12 · Bug Hunt · Verified (pass)                          | `7937:317528` | `8285:35096`  | 1728×1117 | `/skills-lab/games/<game>?f=SA-12`                                            | ⬜     |
| SA-04 · SQL Heist · Clue 3                                  | `7933:33025`  | `8285:35299`  | 1728×1161 | `/skills-lab/games/<game>?f=SA-04`                                            | ⬜     |
| SA-05 · Chart Detective · Case 3                            | `7933:316852` | `8285:35398`  | 1728×1117 | `/skills-lab/games/<game>?f=SA-05`                                            | ⬜     |
| SA-06 · Pixel Perfect · Screen 2                            | `7934:33104`  | `8285:35498`  | 1728×1170 | `/skills-lab/games/<game>?f=SA-06`                                            | ⬜     |
| SA-07 · Sprint Stack · Sprint 2                             | `7935:33134`  | `8285:35598`  | 1728×1117 | `/skills-lab/games/<game>?f=SA-07`                                            | ⬜     |
| SA-08 · Feature Frenzy · Card 6                             | `7935:316952` | `8285:35692`  | 1728×1283 | `/skills-lab/games/<game>?f=SA-08`                                            | ⬜     |
| SA-09 · Crisis Room · Alarm 2                               | `7936:33214`  | `8285:35800`  | 1728×1117 | `/skills-lab/games/<game>?f=SA-09`                                            | ⬜     |
| SA-10 · Formula Rush · Lap 3                                | `7937:33260`  | `8285:35896`  | 1728×1194 | `/skills-lab/games/<game>?f=SA-10`                                            | ⬜     |
| SA-11 · Chess Blitz · Puzzle 4                              | `7937:317137` | `8285:35996`  | 1728×1186 | `/skills-lab/games/<game>?f=SA-11`                                            | ⬜     |
| **Work**                                                    |               |               |           |                                                                               |        |
| WK-01 · Work · First visit (empty)                          | `7707:2`      | `8285:14168`  | 1728×1313 | `/profile/filling/work`                                                       | ⬜     |
| WK-02 · Work · Your roles                                   | `7707:287`    | `8285:14358`  | 1728×1356 | `/profile/filling/work?state=list`                                            | ⬜     |
| WK-03 · Work · Add a role                                   | `7707:577`    | `8285:14578`  | 1728×1356 | `/profile/filling/work?modal=add`                                             | ⬜     |
| WK-04 · Work · Edit role                                    | `7707:185988` | `8285:14843`  | 1728×1356 | `/profile/filling/work?modal=edit`                                            | ⬜     |
| WK-05 · Work · Delete role                                  | `7707:186423` | `8285:15120`  | 1728×1356 | `/profile/filling/work?modal=delete`                                          | ⬜     |
| WK-06 · Work · Stage complete                               | `7707:186698` | `8285:15374`  | 1728×1356 | `/profile/filling/work?state=complete`                                        | ⬜     |
| **Portfolio**                                               |               |               |           |                                                                               |        |
| PF-01 · Portfolio · First visit (empty)                     | `7709:10`     | `8285:15657`  | 1728×1335 | `/profile/filling/portfolio`                                                  | ⬜     |
| PF-02 · Portfolio · Your projects                           | `7709:312`    | `8285:15859`  | 1728×1501 | `/profile/filling/portfolio?state=list`                                       | ⬜     |
| PF-03 · Portfolio · Add a project                           | `7709:660`    | `8285:16123`  | 1728×1501 | `/profile/filling/portfolio?modal=add`                                        | ⬜     |
| PF-04 · Portfolio · Edit project                            | `7710:2`      | `8285:16429`  | 1728×1501 | `/profile/filling/portfolio?modal=edit`                                       | ⬜     |
| PF-05 · Portfolio · Delete project                          | `7710:481`    | `8285:16742`  | 1728×1501 | `/profile/filling/portfolio?modal=delete`                                     | ⬜     |
| PF-06 · Portfolio · Stage complete                          | `7710:800`    | `8285:17040`  | 1728×1501 | `/profile/filling/portfolio?state=complete`                                   | ⬜     |
| **Certifications**                                          |               |               |           |                                                                               |        |
| CE-01 · Certs · First visit (empty)                         | `7712:2`      | `8285:17367`  | 1728×1287 | `/profile/filling/certs`                                                      | ⬜     |
| CE-02 · Certs · Your certifications                         | `7712:322`    | `8285:17576`  | 1728×1341 | `/profile/filling/certs?state=list`                                           | ⬜     |
| CE-03 · Certs · Add a certification                         | `7712:660`    | `8285:17829`  | 1728×1341 | `/profile/filling/certs?modal=add`                                            | ⬜     |
| CE-04 · Certs · Edit certification                          | `7713:8`      | `8285:18119`  | 1728×1341 | `/profile/filling/certs?modal=edit`                                           | ⬜     |
| CE-05 · Certs · Delete certification                        | `7713:503`    | `8285:18415`  | 1728×1341 | `/profile/filling/certs?modal=delete`                                         | ⬜     |
| CE-06 · Certs · Stage complete                              | `7713:815`    | `8285:18702`  | 1728×1341 | `/profile/filling/certs?state=complete`                                       | ⬜     |
| **Goals**                                                   |               |               |           |                                                                               |        |
| GO-01 · Goals · First visit (empty)                         | `7715:8`      | `8285:19018`  | 1728×1268 | `/profile/filling/goals`                                                      | ⬜     |
| GO-02 · Goals · Your goals                                  | `7715:294`    | `8285:19213`  | 1728×1167 | `/profile/filling/goals?state=list`                                           | ⬜     |
| GO-03 · Goals · Add a goal                                  | `7715:586`    | `8285:19428`  | 1728×1167 | `/profile/filling/goals?modal=add`                                            | ⬜     |
| GO-04 · Goals · Edit goal                                   | `7716:8`      | `8285:19689`  | 1728×1167 | `/profile/filling/goals?modal=edit`                                           | ⬜     |
| GO-05 · Goals · Delete goal                                 | `7716:451`    | `8285:19955`  | 1728×1167 | `/profile/filling/goals?modal=delete`                                         | ⬜     |
| GO-06 · Goals · Stage complete                              | `7716:725`    | `8285:20204`  | 1728×1167 | `/profile/filling/goals?state=complete`                                       | ⬜     |
| **Pitch**                                                   |               |               |           |                                                                               |        |
| PI-01 · Pitch · Choose a way                                | `7718:8`      | `8285:20482`  | 1728×1117 | `/profile/filling/pitch`                                                      | ⬜     |
| PI-02 · Pitch · Record · Camera access                      | `7718:273`    | `8285:20662`  | 1728×1267 | `/profile/filling/pitch?mode=record&step=camera`                              | ⬜     |
| PI-03 · Pitch · Record · Recording                          | `7718:489`    | `8285:20829`  | 1728×1335 | `/profile/filling/pitch?mode=record&step=recording`                           | ⬜     |
| PI-04 · Pitch · Upload                                      | `7718:720`    | `8285:21007`  | 1728×1257 | `/profile/filling/pitch?mode=upload`                                          | ⬜     |
| PI-04b · Pitch · Upload · Ready                             | `7721:8`      | `8285:21218`  | 1728×1117 | `/profile/filling/pitch?mode=upload&step=ready`                               | ⬜     |
| PI-05 · Pitch · Write                                       | `7721:285`    | `8285:21405`  | 1728×1117 | `/profile/filling/pitch?mode=write`                                           | ⬜     |
| PI-06 · Pitch · Review and publish                          | `7721:529`    | `8285:21581`  | 1728×1117 | `/profile/filling/pitch?step=review`                                          | ⬜     |
| PI-07 · Pitch · Published · Profile 100%                    | `7721:771`    | `8285:21759`  | 1728×1117 | `/profile/filling/pitch?step=published`                                       | ⬜     |
| PI-08 · Pitch · Delete pitch                                | `7721:1057`   | `8285:22005`  | 1728×1117 | `/profile/filling/pitch?modal=delete`                                         | ⬜     |
| **Profile complete**                                        |               |               |           |                                                                               |        |
| CO-01 · Profile complete · Writing your bio                 | `7723:179`    | `8285:22218`  | 1728×1215 | `/profile/filling/complete?state=writing`                                     | ⬜     |
| CO-02 · Profile complete · Bio ready                        | `7723:444`    | `8285:22420`  | 1728×1283 | `/profile/filling/complete?state=ready`                                       | ⬜     |
| **Upload my CV (new)**                                      |               |               |           |                                                                               |        |
| CV-01 · Upload my CV · Choose a file                        | `8966:99`     | `8966:507876` | 1728×1117 | `/profile/filling/cv`                                                         | ⬜     |
| CV-02 · Upload my CV · Uploading                            | `8966:2714`   | `8966:508421` | 1728×1117 | `/profile/filling/cv?step=uploading`                                          | ⬜     |
| CV-02b · Upload my CV · File not supported (error)          | `8966:3272`   | `8966:508960` | 1728×1117 | `/profile/filling/cv?step=unsupported`                                        | ⬜     |
| CV-03 · Upload my CV · Reading your CV                      | `8966:3808`   | `8966:509494` | 1728×1117 | `/profile/filling/cv?step=reading`                                            | ⬜     |
| CV-03b · Upload my CV · Couldn’t read it                    | `8966:4372`   | `8966:510050` | 1728×1117 | `/profile/filling/cv?step=failed`                                             | ⬜     |
| CV-04 · Upload my CV · Check what we found                  | `8966:4928`   | `8966:510604` | 1728×1117 | `/profile/filling/cv?step=review`                                             | ⬜     |
| CV-04b · Upload my CV · Fix a role                          | `8966:5612`   | `8966:511243` | 1728×1117 | `/profile/filling/cv?step=review&fix=1`                                       | ⬜     |
| CV-05 · Upload my CV · Added to your profile                | `8966:6230`   | `8966:511861` | 1728×1117 | `/profile/filling/cv?step=done`                                               | ⬜     |

## Resume plan (when Figma access exists)

1. **8 REST calls, in this order** (ids are in `frames.json`; sections via `nodes?ids=<section ids>`, full depth): A Focused core sections (Journey, Avatar, Interests, Work, Portfolio, Certs, Goals, Pitch, Complete, CV), B Playful core, C Focused Personality, D Playful Personality, E1/E2 Focused Skills (frame ids in halves), F1/F2 Playful Skills. Save each to disk and derive everything else locally (`texts.py`, `tree.py`, `pdiff.py` work on saved JSON). Never retry on 429: read `Retry-After`.
2. Images: one `images` call per section at 0.5x only if the quota allows; otherwise use PNGs exported by the owner.
3. Foundation (lead): one URL-driven state hook per section (like `messagesState.js`), the shell / chrome decision (the hub and stages own full-bleed chrome today: check whether the revamp moves them into the talent shell), assets and tokens.
4. Agent work packages (disjoint files): A Journey hub + milestones + avatar (≈ 13 screens) · B Interests + Work + Portfolio (17) · C Certs + Goals + Pitch + Complete (23) · D Upload my CV + shared stage components (8) · E Personality quiz + result (6) · F Personality Arcade hub + 13 games (15) · G Skills first-visit / list / add + Skills Lab bridge (4) · H Skills labs + games (≈ 69; check first whether `/skills-lab/*` already draws them).
5. Verify as for Messages: lint, build, responsive audit (register every URL in `tests/e2e/helpers/responsive.js`), Playful leak check, per-frame comparison, by-eye check.

## Questions to settle with the data

- Do the revamped stages move into the talent shell (sidebar + top nav) or keep their own chrome? Do old routes stay (`/profile/filling/*/categories` etc.) or redirect?
- Are the Skills v2 lab frames the same designs as the built `/skills-lab/*` labs (then only the engagement chrome differs)?
- Where does "Upload my CV" open from (J-03 "How do you want to add your work?")?
- Personality: standalone routes vs the Career Buddy conversation.
- Live data vs mocks per stage (the old stages use static mocks).
