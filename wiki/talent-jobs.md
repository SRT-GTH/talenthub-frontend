# Talent Job Postings (`/job-postings`)

Figma file `Bin8roWL8sloyc36IgFMuT`, canvas "Talent Job Postings" (Playful `75xx:*`, Focused `8110:*`). Mock data only, shaped for an API swap
(`talentJobsData.js`). One build serves Playful + Focused through `UiStyleScope`. Sidebar opens **expanded** (Figma default) with a collapse
toggle; `?rail=collapsed` = the icon-rail "c" frames. Sidebar item is labelled "Job Postings" (`talentShellData.js` `JOBS_PAGE`, `activeNav="jobs"`).

## URL → Figma (pass a, lists — built)

| URL                           | Frame                                                       | Playful / Focused                                 |
| ----------------------------- | ----------------------------------------------------------- | ------------------------------------------------- |
| `/job-postings`               | J-01 Matched to you (cards)                                 | 7503:104 / 8110:409276                            |
| `?view=list`                  | J-01L Matched (list)                                        | 7559:6406 / 8110:419430                           |
| `?tab=browse` (`&view=cards`) | J-18 Browse all list (J-18G cards)                          | 7512:1575 / 8110:417608 (7560:6209 / 8110:420272) |
| `?tab=saved` (`&view=list`)   | J-19 Saved cards (J-19L list)                               | 7512:2376 / 8110:418033 (7559:7465 / 8110:419902) |
| `?tab=applied`                | J-10 Applied                                                | 7509:991 / 8110:414159                            |
| `?state=empty`                | J-07 No matches… yet                                        | 7507:1216 / 8110:412333                           |
| `?state=loading`              | J-13 loading skeleton                                       | 7510:2357 / 8110:415675                           |
| `&rail=collapsed`             | the "c" twins (names in the scratch `jp/*_coll_names.json`) | e.g. 7512:144007 / 8110:423571                    |

## URL → Figma (pass b, detail + apply — `JobDetailScreen.jsx`, `JobApplyDialogs.jsx`)

| URL                            | Frame                               | Playful / Focused         |
| ------------------------------ | ----------------------------------- | ------------------------- |
| `?job=<id>`                    | J-02 detail (public company)        | 7504:200 / 8110:409897    |
| `?job=junior-product-analyst`  | J-03 confidential                   | 7504:135927 / 8110:410297 |
| `&apply=preview`               | J-04 apply preview                  | 7505:346 / 8110:410690    |
| `&apply=projects`              | J-12 preview after showing Projects | 7510:1087 / 8110:414623   |
| `&apply=sent`                  | J-05 application sent               | 7506:419 / 8110:411209    |
| `&state=applied`               | J-09 already applied                | 7508:1489 / 8110:413270   |
| `&state=closed`                | J-11 closed                         | 7508:1964 / 8110:413719   |
| `&apply=preview&state=offline` | J-14 offline / failed               | 7510:1721 / 8110:415147   |

## URL → Figma (pass c, dialogs — `JobsDialogs.jsx` + `JobsPopovers/NotifPopover/ReasonDialogs`)

`?modal=alerts` J-06 (7507:492 / 8110:411661) · `notifications` J-08 (7508:599 / 8110:412649) · `how-match&job=data-analyst` J-15 (7511:1329 / 8110:416059) ·
`not-for-me` J-16 (7511:1811 / 8110:416512) · `report&job=junior-product-analyst` J-17 (7511:2519 / 8110:417177) · `withdraw&job=data-analyst` J-20 (7518:5291 / 8110:418481) ·
`?tab=applied&withdrawn=1` J-21 toast (7518:5803 / 8110:418960). Help overlay copy `JobsHelpCopy` is in `talentJobsData.js` but NOT yet wired into `HelpPopover` (`helpPage: 'jobs'`).

## Known gaps / assumptions

- Only `data-analyst` and `junior-product-analyst` have long-form detail content in Figma; the other jobs render a sparse detail (no invented copy).
- Wired (2026-10-18): the bell opens the standard notifications pop-up on this page (`?notif=open`; `?modal=notifications` is the J-08 doc frame); Help overlay uses `JobsHelpCopy` (`helpPage: 'jobs'`); matched cards show the dark "× Not for me" pill on hover/focus (button in the footer below lg) → J-16 dialog (`?modal=not-for-me&dismiss=<id>`), "Hide this match" adds the id to `?hidden=` and drops the card; withdrawing keeps the Applied row as "Withdrawn by you" / "Apply again" (`?wd=1`, filters Active 2 / Closed 2) like J-21.
- Dialogs are centred in the viewport (Figma centres some 80px right); J-08 rows are not clipped as in Figma; apply-flow "Try again" / "Send when I'm back online" are mock.
- Mock-only values tagged ASSUMPTION in `talentJobsData.js` (alert slider counts, 8s toast, single-select withdraw reasons).
- Figma inconsistencies kept: J-03 Focused repeats J-02's boost text (Playful values used); J-04 says "about 8%" while 82→88 is 6%.

## Code map

`src/pages/talentJobs/TalentJobsPage.jsx` · `src/components/sections/talentJobs/` — `talentJobsState.js` (URL hook), `talentJobsData.js`, `JobsChrome.jsx`
(header + decoration, tabs, chips, toolbar), `JobCards.jsx` (MatchCard / SavedCard / rows / AppliedRow), `JobsScreen.jsx` (tab bodies, banner, skeleton, empty).
Icons are `Job*` components appended to `components/shared/assets.jsx`; the empty-state target is `src/assets/talent-jobs/no-matches-target.svg`.

## Decisions / assumptions

- Header decoration (faces, "9 recruiters viewed you", stickers) is the same Playful-only art as /notifications; positions measured from J-01.
- Default view per tab follows the frames: Matched + Saved = cards, Browse all + Applied = list (toggle per tab).
- Tab counts are generated content (`data-count`) so labels never wrap; below lg the tab strip and chip row scroll with an edge fade, no scrollbar.
- Applied stepper: reached steps filled, interview step is the big yellow dot, closed row dimmed — read from J-10.
- Browse "card" view shows unmatched roles with a "Not matched yet" card (J-18G has no separate frame text for them) ⚠️ ASSUMPTION for those cards' layout.
- Nav item `opportunities` now routes to `/job-postings`.
