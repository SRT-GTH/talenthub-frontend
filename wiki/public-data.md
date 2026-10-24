# Public data dashboards — Theme 8 (`/data/*`)

Figma file `Bin8roWL8sloyc36IgFMuT`, canvas **Persona · Public, Investor & Government (Theme 8)** `8477:209484` — 13 sections, 99 numbered frames (+ the A4 report kit). **Focused only** ("Phase 1 of 5 · Focused style"): no Playful variants. Frontend only, mock data shaped like the future API.

## What it is

An anonymous, read-only data site for the public, investors and government: no sign-in, no personal data, counts under 5 shown as "<5" (`publicDataFormat.js`, the same minimum cell count as the Platform Admin export rule). The three audiences see the same pages; "For partners / For recruiters" and "Partner sign-in →" lead to the existing sign-in (`/login`, ⚠️ ASSUMPTION: Figma draws no destination). The Theme 8 user-story file is not in `docs/user stories/` yet (the two Theme 7 files there do not contain it); acceptance criteria come from the frames until it is added.

Chrome (Figma `T8 · Public sidebar` / `GTH · Top bar` / `T8 · Public footer`): sidebar 288 expanded or 80 rail (tablet and `?rail=collapsed`), top bar (title, search, freshness pill, Share, Download PDF), mobile: logo + Live pill + menu button + section tabs + 300px drawer on a 50 % scrim. Viewports: desktop 1728, tablet 1024, mobile 390.

## Architecture

- Router: `src/pages/publicData/PublicDataApp.jsx` (mounted by `App.jsx` as `/data/*`, outside `MainLayout`). Work packages replace the stub pages and add NO route to `App.jsx`.
- Chrome and shared logic: `src/components/sections/publicData/` — `PublicDataFrame` (page chrome), `PublicSidebar`, `PublicTopBar` (+ `FreshnessPill`), `PublicFooter`, `PublicMobileTabs`, `publicDataNav.js`, `publicDataState.js` (URL state hook, keys documented at its top), `publicDataFormat.js` (suppression + number formats), `regionsList.js` (the 16 regions), `publicDataIcons.jsx` (Figma icon exports, `currentColor`).
- Work packages each own a sub-folder (`ui/`, `map/`, `overview/`, `regions/`, `showcase/`, `outcomes/`, `directory/`, `methodology/`, `share/`) and their data module(s) `data/<area>Data.js`; nothing edits another package's files.
- Charts are custom SVG/CSS (no new dependency). The Ghana map is a Figma SVG export turned into a keyboard-accessible component. PDF: print layouts via `window.print()` + `@page` A4; "Generating" / "Failed" are mocked states (a real PDF needs a backend). Offline: browser-cached data + banner (no service worker).

## URL contract

Query keys shared by every screen (see `publicDataState.js`): `rail=collapsed`, `drawer=1`, `modal=<name>`, `state=<name>`, `region= edu= interest= age= gender=`, `q=`, `tab= view= range=`. Every frame below has a URL; emails are static HTML under `emails/public/`.

## Work packages (wave order)

1. Foundation (lead, done 2026-10-23): chrome, router + stubs, state/format/regions, icons, manifest `tests/public-data/frames.json`, this page.
2. Wave 1: **P0 ui primitives + Ghana map** · **E share / download / print / report / digest + emails**.
3. Wave 2: **A landing + overview + filters** · **B regions, districts, compare** · **C showcase + outcomes + trends** · **D directories + methodology**.
4. Wave 3: **F edge states (404 / 500 / maintenance / offline / low-data) + the 390 / 1024 responsive audit**.

## Frame checklist (⬜ not built · ✅ built and compared · — not a screen)

| Frame                                                             | Figma id      | Size      | URL                                                                                      | Status |
| ----------------------------------------------------------------- | ------------- | --------- | ---------------------------------------------------------------------------------------- | ------ |
| 8.1.1a · Landing · Default                                        | `8514:9`      | 1728×1533 | `/data`                                                                                  | ⬜     |
| 8.1.1b · Landing · Returning visitor                              | `8514:1881`   | 1728×1533 | `/data?state=returning`                                                                  | ⬜     |
| 8.1.1c · Landing · Stats fallback                                 | `8514:2088`   | 1728×1533 | `/data?state=fallback`                                                                   | ⬜     |
| 8.2.1a · Overview · Default                                       | `8487:345935` | 1728×1970 | `/data/overview`                                                                         | ⬜     |
| 8.2.1b · Overview · Loading skeleton                              | `8488:8`      | 1728×1970 | `/data/overview?state=loading`                                                           | ⬜     |
| 8.2.1c · Overview · Section error (career interests)              | `8488:405`    | 1728×1970 | `/data/overview?state=error`                                                             | ⬜     |
| 8.2.3c · Filters · Zero matches                                   | `8488:752`    | 1728×757  | `/data/overview?state=zero&region=upper-west&interest=technology&age=18-24`              | ⬜     |
| 8.2.3d · Filters · Fewer than 5 (suppressed)                      | `8488:856`    | 1728×757  | `/data/overview?state=suppressed&region=upper-west&interest=technology&age=18-24`        | ⬜     |
| 8.2.3a · Filters · One filter active (Region: Ashanti)            | `8489:8`      | 1728×1970 | `/data/overview?region=ashanti`                                                          | ⬜     |
| 8.2.1d · Overview · Filtered (Volta · Technology · 18–24)         | `8489:408`    | 1728×1970 | `/data/overview?region=volta&interest=technology&age=18-24`                              | ⬜     |
| 8.2.3b · Filters · Multiple filters applied                       | `8489:751`    | 1728×1970 | `/data/overview?region=ashanti&edu=tertiary&interest=technology&age=18-24&gender=female` | ⬜     |
| 8.2.2a · Map · Hover                                              | `8489:346162` | 888×843   | `/data/overview?map=hover&at=ashanti` · component frame                                  | ⬜     |
| 8.2.2b · Map · Expanded card (click / tap)                        | `8489:346231` | 888×843   | `/data/overview?map=pinned&at=ashanti` · component frame                                 | ⬜     |
| 8.2.2c · Map · Keyboard focus                                     | `8489:346317` | 888×891   | `/data/overview?map=keyboard&at=ashanti` · component frame                               | ⬜     |
| 8.2.2d · Map · Low-data region                                    | `8489:346395` | 888×843   | `/data/overview?map=low-data&at=upper-west` · component frame                            | ⬜     |
| 8.3.1a · Region · Greater Accra (default)                         | `8493:9`      | 1728×1877 | `/data/regions/greater-accra`                                                            | ⬜     |
| 8.3.1b · Region · Loading                                         | `8494:8`      | 1728×1872 | `/data/regions/greater-accra?state=loading`                                              | ⬜     |
| 8.3.1c · Region · Low-data (early rollout)                        | `8494:426`    | 1728×816  | `/data/regions/oti?state=low-data`                                                       | ⬜     |
| 8.3.2a · District · Accra Metro                                   | `8494:2009`   | 1728×1872 | `/data/regions/greater-accra/districts/accra-metro`                                      | ⬜     |
| 8.3.2b · District · Low-data                                      | `8494:2390`   | 1728×816  | `/data/regions/greater-accra/districts/ga-south?state=low-data`                          | ⬜     |
| 8.3.2c · District · Loading                                       | `8494:2497`   | 1728×1872 | `/data/regions/greater-accra/districts/accra-metro?state=loading`                        | ⬜     |
| 8.3.1d · Region · Switcher open                                   | `8495:8`      | 1728×1872 | `/data/regions/greater-accra?modal=region`                                               | ⬜     |
| 8.3.3a · Compare · 2 regions                                      | `8495:1961`   | 1728×1260 | `/data/compare?regions=greater-accra,ashanti`                                            | ⬜     |
| 8.3.3b · Compare · 3 regions                                      | `8495:2187`   | 1728×1296 | `/data/compare?regions=greater-accra,ashanti,northern`                                   | ⬜     |
| 8.3.3c · Compare · Region selector modal                          | `8495:347560` | 1728×1260 | `/data/compare?regions=greater-accra,ashanti&modal=compare`                              | ⬜     |
| 8.3.1e · Region template × 16 · data sheet                        | `8495:347797` | 1440×717  | · DATA SHEET: not a screen; the 16 regions’ mock data                                    | —      |
| 8.4.1a · Showcase · Default (Akosua O.)                           | `8497:9`      | 1728×1349 | `/data/showcase`                                                                         | ⬜     |
| 8.4.1d · Showcase · Curated 2 of 5 (Kofi M.)                      | `8497:1959`   | 1728×1349 | `/data/showcase/kofi-m`                                                                  | ⬜     |
| 8.4.1d · Showcase · Curated 3 of 5 (Efua D.)                      | `8497:2212`   | 1728×1367 | `/data/showcase/efua-d`                                                                  | ⬜     |
| 8.4.1d · Showcase · Curated 4 of 5 (Yaw B.)                       | `8497:2465`   | 1728×1329 | `/data/showcase/yaw-b`                                                                   | ⬜     |
| 8.4.1d · Showcase · Curated 5 of 5 (Adwoa K.)                     | `8497:2697`   | 1728×1349 | `/data/showcase/adwoa-k`                                                                 | ⬜     |
| 8.4.1c · Showcase · Consent banner expanded                       | `8497:348946` | 1728×1426 | `/data/showcase?consent=open`                                                            | ⬜     |
| 8.4.2a · Showcase · Prev / next navigation (hover Next)           | `8497:349199` | 1728×1349 | `/data/showcase?nav=next`                                                                | ⬜     |
| 8.4.2b · Showcase · Grid overview                                 | `8497:349452` | 1728×1346 | `/data/showcase?view=grid`                                                               | ⬜     |
| 8.5.1a · Outcomes · Dashboard                                     | `8496:27`     | 1728×1642 | `/data/outcomes`                                                                         | ⬜     |
| 8.5.1d · Outcomes · Loading                                       | `8496:294`    | 1728×1622 | `/data/outcomes?state=loading`                                                           | ⬜     |
| 8.5.2a · Trends · 90 days                                         | `8496:347768` | 1728×1163 | `/data/outcomes/trends?range=90d`                                                        | ⬜     |
| 8.5.2b · Trends · 1 year (hover on assessments)                   | `8496:347982` | 1728×1163 | `/data/outcomes/trends?range=1y&hover=assessments`                                       | ⬜     |
| 8.5.2c · Trends · All time                                        | `8496:348215` | 1728×1163 | `/data/outcomes/trends?range=all`                                                        | ⬜     |
| 8.5.1b · Outcomes · Case study detail                             | `8496:348427` | 1728×1300 | `/data/outcomes/stories/ama-k`                                                           | ⬜     |
| 8.6.1a · Partners · Directory list                                | `8498:9`      | 1728×1153 | `/data/partners`                                                                         | ⬜     |
| 8.6.1c · Partners · Filtered (NGO · Northern)                     | `8498:324`    | 1728×711  | `/data/partners?type=ngo&region=northern`                                                | ⬜     |
| 8.6.1b · Partners · Partner detail                                | `8498:486`    | 1728×1192 | `/data/partners/ghana-code-club`                                                         | ⬜     |
| 8.6.2a · Opportunities · Directory list                           | `8498:349008` | 1728×962  | `/data/opportunities`                                                                    | ⬜     |
| 8.6.2c · Opportunities · Filtered (Training · closing this month) | `8498:349179` | 1728×711  | `/data/opportunities?type=training&closing=month`                                        | ⬜     |
| 8.6.2b · Opportunities · Public preview detail                    | `8498:349295` | 1728×872  | `/data/opportunities/intro-to-coding`                                                    | ⬜     |
| 8.7.1a · Methodology page                                         | `8499:9`      | 1728×1736 | `/data/methodology`                                                                      | ⬜     |
| 8.7.2a · Freshness tooltip                                        | `8499:170`    | 900×576   | `/data/methodology?tip=freshness` · component frame                                      | ⬜     |
| 8.7.2b · Suppression explanation popover                          | `8499:188`    | 900×576   | `/data/methodology?tip=suppression` · component frame                                    | ⬜     |
| 8.1.2a · Share · Share modal                                      | `8500:52`     | 1728×1970 | `/data/overview?modal=share`                                                             | ⬜     |
| 8.1.2b · Share · Link copied toast                                | `8500:1914`   | 1728×1970 | `/data/overview?modal=share&toast=copied`                                                | ⬜     |
| 8.1.2c · Share · Clipboard fallback                               | `8500:2073`   | 1728×1970 | `/data/overview?modal=share&state=fallback`                                              | ⬜     |
| 8.8.2a · Share · Choose what to share (filtered view)             | `8500:2251`   | 1728×1970 | `/data/overview?region=ashanti&modal=share&scope=filtered`                               | ⬜     |
| 8.8.2b · Share · Link preview (how the link unfurls)              | `8500:2428`   | 1440×590  | `/data/overview?modal=share&preview=1` · component frame                                 | ⬜     |
| 8.8.1a · Download · Choose what to download                       | `8504:8`      | 1728×1970 | `/data/overview?modal=download`                                                          | ⬜     |
| 8.8.1e · Download · Generating PDF                                | `8504:269`    | 1728×1970 | `/data/overview?modal=download&state=generating`                                         | ⬜     |
| 8.8.1f · Download · PDF failed (fallback)                         | `8504:515`    | 1728×1970 | `/data/overview?modal=download&state=failed`                                             | ⬜     |
| 8.8.3a · Digest · Subscribe modal                                 | `8504:2382`   | 1728×1970 | `/data/overview?modal=digest`                                                            | ⬜     |
| 8.8.3b · Digest · Subscribe success                               | `8504:2640`   | 1728×1970 | `/data/overview?modal=digest&state=success`                                              | ⬜     |
| 8.8.3f · Digest · Unsubscribed confirmation                       | `8505:187`    | 1728×785  | `/data/digest/unsubscribed`                                                              | ⬜     |
| 8.8.3c · Email · Confirm subscription                             | `8505:8`      | 760×517   | `emails/public/digest-confirm.html` · static HTML email                                  | ⬜     |
| 8.8.3d · Email · Monthly digest (National)                        | `8505:31`     | 760×919   | `emails/public/digest-national.html` · static HTML email                                 | ⬜     |
| 8.8.3e · Email · Monthly digest (Regional · Volta)                | `8505:109`    | 760×896   | `emails/public/digest-volta.html` · static HTML email                                    | ⬜     |
| 8.2.1h · Overview · Browser print layout (A4)                     | `8503:258`    | 794×1123  | `/data/overview?print=1` · print                                                         | ⬜     |
| 8.5.1e · Outcomes · PDF export layout                             | `8503:448`    | 794×1123  | `/data/outcomes?print=1` · print                                                         | ⬜     |
| 8.8.1b v1 · PDF · Cover page v1                                   | `8503:9`      | 794×1123  | · SUPERSEDED by the v2 report kit                                                        | —      |
| 8.8.1c v1 · PDF · Content page v1 (= 8.2.1g)                      | `8503:69`     | 794×1123  | · SUPERSEDED by the v2 report kit                                                        | —      |
| 8.8.1d v1 · PDF · Methodology page v1                             | `8503:551`    | 794×1123  | · SUPERSEDED by the v2 report kit                                                        | —      |
| 8.8.1b v2 · Report · Cover (A4 landscape)                         | `8898:483505` | 1123×794  | `/data/report?page=1` · report kit                                                       | ⬜     |
| 8.8.1 v2 · Report · Contents                                      | `8898:483523` | 1123×794  | `/data/report?page=2` · report kit                                                       | ⬜     |
| 8.8.1 v2 · Report · Section opener                                | `8898:483552` | 1123×794  | `/data/report?page=3` · report kit                                                       | ⬜     |
| 8.8.1 v2 · Report · Where the talent is                           | `8898:483565` | 1123×794  | `/data/report?page=4` · report kit                                                       | ⬜     |
| 8.8.1 v2 · Report · What they want to do                          | `8898:483661` | 1123×794  | `/data/report?page=5` · report kit                                                       | ⬜     |
| 8.8.1 v2 · Report · How GTH works                                 | `8898:483727` | 1123×794  | `/data/report?page=6` · report kit                                                       | ⬜     |
| 8.8.1 v2 · Report · Results on the ground                         | `8898:483775` | 1123×794  | `/data/report?page=7` · report kit                                                       | ⬜     |
| 8.8.1d v2 · Report · How we count                                 | `8898:483823` | 1123×794  | `/data/report?page=8` · report kit                                                       | ⬜     |
| 8.2.1e · Overview · Mobile                                        | `8507:9`      | 390×2364  | `/data/overview` · viewport 390                                                          | ⬜     |
| 8.3.1a-m · Region · Greater Accra · Mobile                        | `8507:260`    | 390×1706  | `/data/regions/greater-accra` · viewport 390                                             | ⬜     |
| 8.5.1c · Outcomes · Mobile                                        | `8507:419`    | 390×1471  | `/data/outcomes` · viewport 390                                                          | ⬜     |
| 8.4.1b · Showcase · Mobile                                        | `8508:99`     | 390×1389  | `/data/showcase` · viewport 390                                                          | ⬜     |
| 8.5.2d · Trends · Mobile                                          | `8508:186`    | 390×1364  | `/data/outcomes/trends` · viewport 390                                                   | ⬜     |
| 8.6.1d · Partners · Mobile list                                   | `8508:346`    | 390×975   | `/data/partners` · viewport 390                                                          | ⬜     |
| 8.6.2d · Opportunities · Mobile list                              | `8508:428`    | 390×1066  | `/data/opportunities` · viewport 390                                                     | ⬜     |
| 8.7.1b · Methodology · Mobile                                     | `8508:503`    | 390×1028  | `/data/methodology` · viewport 390                                                       | ⬜     |
| 8.2.1f · Overview · Tablet (1024)                                 | `8508:350935` | 1024×2329 | `/data/overview` · viewport 1024                                                         | ⬜     |
| 8.9.1 · Region · Tablet                                           | `8508:351349` | 1024×2930 | `/data/regions/greater-accra` · viewport 1024                                            | ⬜     |
| 8.9.1 · Outcomes · Tablet                                         | `8508:351744` | 1024×2653 | `/data/outcomes` · viewport 1024                                                         | ⬜     |
| 8.9.1 · Showcase · Tablet                                         | `8508:352023` | 1024×1805 | `/data/showcase` · viewport 1024                                                         | ⬜     |
| 8.9.1 · Partners · Tablet                                         | `8516:355494` | 1024×1610 | `/data/partners` · viewport 1024                                                         | ⬜     |
| 8.9.1 · Opportunities · Tablet                                    | `8516:355894` | 1024×963  | `/data/opportunities` · viewport 1024                                                    | ⬜     |
| 8.9.1 · Methodology · Tablet                                      | `8516:356171` | 1024×2193 | `/data/methodology` · viewport 1024                                                      | ⬜     |
| 8.9.1 · Trends · Tablet                                           | `8516:356410` | 1024×997  | `/data/outcomes/trends` · viewport 1024                                                  | ⬜     |
| 8.9.3a · Low-data empty state (regional example)                  | `8508:353008` | 1728×816  | `/data/regions/oti?state=low-data`                                                       | ⬜     |
| 8.9.3b · 404 · Page not found                                     | `8508:353043` | 1728×797  | `/data/page-that-does-not-exist`                                                         | ⬜     |
| 8.9.3c · 500 · Something went wrong                               | `8508:353122` | 1728×769  | `/data/error`                                                                            | ⬜     |
| 8.9.3d · Maintenance                                              | `8508:353197` | 1728×792  | `/data/maintenance`                                                                      | ⬜     |
| 8.9.3e · Offline · Showing cached data                            | `8508:353278` | 1728×2012 | `/data/overview?state=offline`                                                           | ⬜     |
| 8.9.2 · Mobile · Navigation drawer open                           | `8515:8`      | 390×844   | `/data/overview?drawer=1` · viewport 390                                                 | ⬜     |
| 8.9.2 · Mobile · Filters bottom sheet                             | `8515:322`    | 390×844   | `/data/overview?modal=filters` · viewport 390                                            | ⬜     |
| 8.1.2 · Mobile · Native share sheet                               | `8515:566`    | 390×844   | `/data/overview?modal=share` · viewport 390                                              | ⬜     |
| 8.8.1 · Mobile · Download sheet                                   | `8515:2461`   | 390×844   | `/data/overview?modal=download` · viewport 390                                           | ⬜     |
| 8.1.1a-m · Landing · Mobile                                       | `8515:2666`   | 390×1122  | `/data` · viewport 390                                                                   | ⬜     |
| 8.9.2 · Mobile · District (Accra Metro)                           | `8516:8`      | 390×1269  | `/data/regions/greater-accra/districts/accra-metro` · viewport 390                       | ⬜     |
| 8.9.2 · Mobile · Compare 2 regions                                | `8516:143`    | 390×1027  | `/data/compare?regions=greater-accra,ashanti` · viewport 390                             | ⬜     |
| 8.9.2 · Mobile · Partner detail                                   | `8516:250`    | 390×1088  | `/data/partners/ghana-code-club` · viewport 390                                          | ⬜     |
| 8.9.2 · Mobile · Opportunity detail                               | `8516:330`    | 390×815   | `/data/opportunities/intro-to-coding` · viewport 390                                     | ⬜     |
| 8.9.2 · Mobile · Story detail                                     | `8516:407`    | 390×1044  | `/data/outcomes/stories/ama-k` · viewport 390                                            | ⬜     |

## Build status (2026-10-24)

All work packages (P0 primitives + map, A landing/overview, B regions/compare, C showcase/outcomes/trends, D directory/methodology, E share/print/report/digest, F status/offline) are built and integrated. Share / download / digest dialogs (`PublicDataModals`) are mounted on every content page; the offline banner (`status/OfflineBanner`) sits under the top bar and `?state=offline` forces it; the freshness pill takes `tone: 'maintenance' | 'offline'`.

Verified: `npm run build`, eslint on `src/pages/publicData` + `src/components/sections/publicData`, errscan clean on 76 URLs, `audit:responsive --only=/data` 130/130, lead framecmp over ~100 frames.
Measured diffs (lead, 0.5x exports): status pages 3.7-4.3 %; regions 4.7-7.5 %; directory/methodology 4-8 %; landing ~14 %, overview 9-11 %, filters 12-16 %, showcase ~11 %, report/print/phone frames 10-40 %. Landing viewed pair-by-pair: layout and copy match, diff is mostly the font and the hero crop; phone and print percentages are unreliable (height/scale), the 8.4.1b phone pair shows our fixed Share/Download bar over the footer where Figma draws none.
Not verified: per-frame DOM text vs Figma for every frame, tablet/phone pixel parity, real boundaries for the map (placeholder geometry), PDF generation (mocked), Theme 8 user-story file (missing; frames used as acceptance).

### Re-measure (2026-10-24)

The first lead framecmp run was wrong: `framecmp.mjs` assumes a 52px talent-app top bar (it crops 26px off the Figma export and shrinks the viewport by 52). Public pages have none, so every frame was shifted. Re-run with `figma-tools/framecmp_nooffset.mjs`: desktop full-page frames are 1.0-4 % (landing 2.6-2.8, overview 1.4-2.9, regions 1.6-5.2, showcase 3.3-5.3, outcomes 1.9-3.9, directory 1.8-3.9, methodology 2.1, share/report 2.0-3.3, status 1.5-2.0). Fixes from it: loading-state story photos are grey blocks (8.5.1d, 7.6 -> 3.9 %); Career interests hidden at tablet widths (the tablet frame omits it).
Still high and not resolved: component frames (8.2.2*, 8.7.2*, 8.8.2b, print 8.2.1h / 8.5.1e) are compared against a full page, so their % is meaningless; phone/tablet frames (8.2.1e/f 15-16 %, 8.4.1b 36 %, 8.1.1a-m 24 %, 8.9.1/8.9.2 ~11 %) are dominated by scaling and the fixed Share/Download bar; tablet KPI strip stays 3-up where Figma wraps 2+1 (agent called it an auto-layout accident).

Follow-up (2026-10-24): tablet KPI strip now wraps 2 + 1 at 296 px tiles as frame 8508:350960 draws it; the filter bar stays one row from 1024 (our text is about 30 px wider than Figma's, so at exactly 1024 the result still wraps); frames.json URLs fixed for the filter sheet (8515:322) and the directory detail frames. Phone / tablet / sheet pairs viewed (overview, landing, showcase, filter sheet, download sheet) match in structure and copy; their % (11-37) is dominated by blur from comparing 390 px renders to 0.5x exports. Component, print and tooltip frames cannot be scored against a full page. Not done: tablet overview still about 15 % (map and filter widths); phone share sheet, story detail, regions and outcomes pairs not individually viewed.
