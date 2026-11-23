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

## Inspection fixes (2026-11-21, compared with Figma REST exports of J-01, J-02, J-07, J-10, J-18, J-19)

- ✅ VERIFIED J-18 Browse rows now draw the 42px company logo tile (new `logos/ecobank-ghana.svg`, `jumia-ghana.svg`, `kudzo.svg`,
  `vodafone-ghana.svg`, exported from Figma), title 16px / meta 13px; the demo rows carry `typeLabel` from their meta, so the
  "Job type" filter shows as drawn. Live rows pass `company.logo` (initials tile when empty).
- ✅ VERIFIED J-19 Saved: "Closes in 2 days" sits on Data Science Intern (was on MTN), sticker = `JobSticker` (Playful yellow),
  first card featured, open cards keep only "View opportunity" (the ink/gold bookmark unsaves), the closed card is 60% opacity with
  a grey match box and only a "Remove" button; notice banner = clock icon, 14px, `#faf4e8` / `#eedeb8` border, r20.
- ✅ VERIFIED Saved bookmark state everywhere: ink circle `#1c2a21` + gold `#ffd86b` bookmark (Figma "Save" on state).
- ✅ VERIFIED J-10 Kudzo row shows its logo (was an empty purple tile).
- ✅ VERIFIED J-07 empty-state steps are buttons: Add 3 more skills → `/profile/filling/skills`, Verify a skill → `/skills-lab`,
  Finish your profile and "Boost my profile" → `/profile/engagement` (🔶 LIKELY destinations: no Figma prototype links).
- ✅ VERIFIED J-09 "Prep with buddy" opens Career Buddy on the page (`?new=chat`, same as the Ask Buddy button).
- Kept on purpose: the page is titled "Job Postings" (Figma: "Opportunities").

## Toolbar selects: sort + Browse filters (2026-11-22)

- ✅ VERIFIED (Figma REST J-01, J-18, J-19, J-10, both styles) Every toolbar select is an instance of the "GTH · Select" component
  set (states Default / Open / Active): J-01 "Best match", J-19 "Best match", J-10 "Most recent", J-18 "Location", "Job type", "Pay",
  "Industry" and "Newest". Default: white pill h34, 1px `#e1eae2` hairline, padding 14 / 12, gap 6, SF Pro Rounded Semibold 13
  `#595959`, 14px down arrowhead `#595959`. Open: 1.5px `#387440` ring, up arrowhead `#387440`. Active (filter applied): `#ebf1ec`
  fill, `#387440` ring, text and arrowhead. Prototype: click toggles Default ↔ Open (smart animate 220ms); no option list is drawn.
- ✅ VERIFIED Built as ONE component, `JobsMenu.jsx` (the old 28px chip shape and `shape` prop are gone; `active` = the Active
  state, `dim` = faded in the empty J-07 frame). The sort pill is `TabSortMenu` in `JobsChrome.jsx` (Matched, Saved, Applied); Browse
  all keeps its own Newest / Best match / Closing soon list. The old "Sorted by …" label (`SortSelect`) and `SORTS` are removed.
- Options `TAB_SORT_OPTIONS` (`talentJobsData.js`): "Best match" / "Most recent" ⚠️ ASSUMPTION (only the two labels Figma shows).
  Defaults `TAB_SORT_DEFAULT`: Matched + Saved "Best match", Applied "Most recent".
- ✅ VERIFIED `?sort=match|recent` (`talentJobsState.js`; absent = the tab default, choosing the default removes it; switching tabs
  clears it). Best match = card `match` desc; Most recent = `postedAt` (Matched) / `savedAt` / `appliedAt` desc; ties and missing
  values keep source order (`sortRows` in `JobsScreen.jsx`). The first card/row after sorting is the "featured" one.
- ✅ VERIFIED Matched chips now filter (they were inert): 80%+ match = `match >= 80`, Remote / Hybrid and Accra = location text,
  Internships = type or title contains "intern" (`MATCH_FILTER_TESTS`, `?sub=`). The "That's all 6 for today" footer is unchanged.
- ✅ VERIFIED Browse all toolbar follows J-18: search capped at 400px, then the filter selects, then layout / sort / alerts pushed
  right. The Industry select needs `industry` on the rows: demo rows now carry a sector (Agritech, Banking, Fintech, E-commerce,
  Telecoms; Kudzo none) ⚠️ ASSUMPTION demo values; live rows use `company.industry`. Filter state is still local (not in the URL).
- Demo dates: `JOB_LIST[].postedAt`, `SAVED_JOBS[].savedAt`, `APPLIED_ROWS[].appliedAt` (applied dates keep the Figma row order).
- Live: `postedAt` = feed `posted`; `appliedAt` = `application.appliedAt`; `savedAt` = feed `savedAt` if sent, else the bookmark
  ObjectId's timestamp (`savedAtOf` in `talentJobsLive.js`) 🔶 LIKELY — the feed does not send a saved date yet.

## Apply flow: "STEP 1 OF 2" with no step 2 (checked 2026-11-22)

- ✅ VERIFIED (Figma REST, file listing + full J-04 / J-12 / J-14 / J-05 / T-MSG-06 trees) The "Talent Opportunities" page draws only
  J-04 preview (and its J-12 / J-14 states) → J-05 "Application sent". No step-2 / review / section-selection frame exists in either
  style, and no node in these frames has prototype `reactions` (so "Continue application" has no drawn destination). J-04, J-12 and
  J-14 all carry the text "STEP 1 OF 2 · PREVIEW"; J-05 has no step label. The J-02 hint says "Takes 1 minute. You’ll preview what they see first."
- ✅ VERIFIED (docs/user stories) Two steps are intended:
  - `GTH_Highlighting_Batch1_v1_0.docx` US-5.1.3-03 "Talent Views Profile Preview Before Applying" = step 1 (what J-04 draws):
    "When they click "Continue Application" … the preview modal closes and the application submission flow begins";
    "Preview does not create any application record — it is a pure display step before submission".
  - `GTH_JobProspecting_v1_0_STORY.docx` US-6.2.2-01 "GTH Profile-Based Application" = the submission step: per-section toggles with
    discoverability warnings, optional cover letter (1000 chars) and resume (PDF/DOCX 5MB), required contact preference, screening
    answers, "confirm the section selection and submit"; Personal Info + Skills + Education cannot be hidden (400 server-side).
    US-6.2.2-03 adds a role-readiness check with "Strengthen Profile" / "Apply Anyway".
- Current code (unchanged): J-04 "Continue application" submits at once (`applyToJob(id, hiddenSections)`, demo → `&apply=sent`).
  The step 2 is NOT built because Figma does not draw it ❓ NEEDS-CLARIFICATION (designer to draw step 2, or product to accept a
  one-step apply and drop "1 OF 2"). Closest drawn patterns for a step 2: the J-04 dialog shell itself, ST-02b Privacy "Hidden selected"
  (per-section visibility), PR-04 "Preview updated (pitch hidden)", W-21 Financing application (form in a dialog) 🔶 LIKELY.
- Side findings 🔶 LIKELY: live `hiddenSections` is always `[]` (the Projects-hidden alert needs `d.boost`, which live data never has, and
  live preview rows are always "Visible"); "Edit visibility" goes to `/profile?manage=1` here but `/settings/privacy` in the Messages
  pre-apply dialog (the story names `/settings/visibility?highlight=<section>`).

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

## Control destinations (2026-11-21)

J-02 (`7504:200`) prototype links: only Back, Apply, "Report posting" and "How is this worked out?". The Boost card buttons and Share are not linked.

- ✅ VERIFIED Boost "Learn it" → `/learning?view=explore&ex=search` (EX-03 is the drawn "power bi" search; Power BI is the skill the boost names). 🔶 LIKELY.
- ✅ VERIFIED Boost "I have it · add skill" → `/profile/filling/skills` (the Skills stage, same as Home / My Assessment "Manage skills").
- ✅ VERIFIED Share → system share sheet, or the posting link (`/job-postings?job=<id>`) copied with a "Link copied" status, like the profile "More" share (`ShareProfileMain.jsx`). ⚠️ ASSUMPTION.
- Demo links keep `?demo=1` (`withDemoFlag`). The Boost card only exists in demo data (live hides it).
