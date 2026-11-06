# Recruiter screening flow (JS-01 … JS-14) — `/recruiter/job-screening`

> Figma file `OHG2xsfCCskT8xEn356njv`, canvas "Recruiter - Job Postings" (`10103:59491`), frames JS-01 … JS-14. Built 2026-11-06 on the existing route `/recruiter/job-screening` (`sections/jobScreening/`), mock data only, no route guards.
> **Not built here (built elsewhere):** JS-15 "Templates › Screening criteria" (`10117:70023`, lives on `/recruiter/job-templates`, owned by the Job Templates work). The "Manage in Templates › Screening" row and the "View" toast action link to `/recruiter/job-templates?view=screening` (JS-15, built by the Job Templates work).

## Frame → URL → diff

Diff % = our screenshot vs the Figma export (`figma-tools/framecmp.mjs`, 1728 wide, viewport = frame height − 52, whole frame, 2026-11-06). `✅ VERIFIED` (measured). Dialog frames score a little higher because Figma centres them in a taller viewport.
Every URL below starts with `/recruiter/job-screening?job=senior-ux-designer` (written `…`) unless noted.

| Code  | Frame                                         | Figma node    | URL                                                                | Diff |
| ----- | --------------------------------------------- | ------------- | ------------------------------------------------------------------ | ---- |
| JS-01 | Add required skill (search open)              | `10117:63827` | `…&skillSearch=Pro`                                                | 3.2% |
| JS-02 | Skill added · funnel preview updating         | `10117:64312` | `…&skills=prototyping`                                             | 3.0% |
| JS-03 | Education level on · level dropdown open      | `10117:64766` | `…&education=on&dropdown=education-level`                          | 3.0% |
| JS-04 | Apply & Filter Pool · processing              | `10117:65240` | `…&run=processing&checked=80`                                      | 3.0% |
| JS-05 | Results · meet all criteria                   | `10117:65714` | `…&results=meet`                                                   | 3.1% |
| JS-06 | Results · close matches                       | `10117:66188` | `…&results=close`                                                  | 2.7% |
| JS-07 | Adjust criteria drawer · live count           | `10117:66565` | `…&results=meet&drawer=adjust&adjExperience=4plus&adjLocation=off` | 4.3% |
| JS-08 | Results · no one meets all criteria           | `10117:67598` | `…&results=none`                                                   | 2.3% |
| JS-09 | No applicants yet (new posting)               | `10117:67878` | `/recruiter/job-screening?job=product-designer&results=waiting`    | 4.2% |
| JS-10 | Move qualified applicants to Pipeline         | `10117:67096` | `…&results=meet&modal=move`                                        | 4.5% |
| JS-11 | Hand-off · 46 applicants land in Pipeline     | `10117:68136` | `/recruiter/application-pipeline?handoff=46`                       | 5.1% |
| JS-12 | Save screening criteria as template           | `10117:68588` | `…&modal=save-template`                                            | 3.4% |
| JS-13 | Screening criteria saved · toast              | `10117:69080` | `…&saved=Senior%20design%20screening&toast=saved`                  | 4.5% |
| JS-14 | Load saved screening criteria · dropdown open | `10117:69546` | `…&dropdown=saved-criteria`                                        | 3.3% |

The two base frames (`7249:78066` S1, `7249:78533` S2) are unchanged: without `job` the page is exactly what it was (e2e "base frames untouched").

## URL keys (also in the header comment of `JobScreeningSection.jsx`)

| Key                                                                                 | Values                                                                     | Effect                                                                                                                                                                                                                    |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `job`                                                                               | `senior-ux-designer` · `product-designer`                                  | Switches the page to the flow's mock job (128 applicants / 46 qualified, "5–10 Years", Figma · Design systems · User research; or a new posting with no applicants). Buttons on the base page write `senior-ux-designer`. |
| `skillSearch`                                                                       | text (may be empty)                                                        | JS-01 add-skill popover open with that search text                                                                                                                                                                        |
| `skills`                                                                            | `prototyping,accessibility,product-thinking,interaction-design,custom:Foo` | Added skills; each drops the qualified count (`−8 · updated just now`)                                                                                                                                                    |
| `education`, `educationLevel`, `partners`                                           | `on` · `any/diploma/bachelors/masters` · `on`                              | Education switch, minimum level (default bachelors), "Only from partner institutions"                                                                                                                                     |
| `dropdown`                                                                          | `experience` · `education-level` · `saved-criteria`                        | The open menu (the original `dropdown=experience&dropdownItem=…` still works)                                                                                                                                             |
| `run`, `checked`                                                                    | `processing`, `0…128`                                                      | JS-04 dialog. Without `checked` it counts up by itself (8 / 220 ms) and lands on `results=meet`; with it the count is pinned                                                                                              |
| `results`, `q`                                                                      | `meet` · `close` · `dont` · `none` · `waiting`; search text                | The results screen and its tab; `none` = JS-08, `waiting` = JS-09                                                                                                                                                         |
| `drawer`, `adjExperience`, `adjEducation`, `adjAssessment`, `adjLocation`, `adjOff` | `adjust`; `3plus/4plus/10plus`; `any/diploma/masters`; `60/80`; `off`; csv | JS-07 drawer and its draft. Counts change only after **Apply changes**; **Cancel** drops every `adj*` key, **Reset** too (keeps the drawer)                                                                               |
| `modal`, `notify`, `unq`, `tplName`, `tplFor`, `tplShare`, `tplDefault`             | `move` · `save-template`; `off`; `reject`; text; text; `off`; `on`         | JS-10 / JS-12 dialogs and their fields                                                                                                                                                                                    |
| `saved`, `toast`                                                                    | name; `saved`                                                              | The "Saved as “…”" chip beside AUTOMATED (also set by picking a row of JS-14); the JS-13 toast                                                                                                                            |
| `handoff` (on `/recruiter/application-pipeline`)                                    | count                                                                      | JS-11 toast "Success - N applicants moved to Screening"; only with this key the pipeline draws the workspace sidebar + SF Pro Rounded                                                                                     |

## Files

- `jobScreening/JobScreeningSection.jsx` (changed) — flow wiring; `ScreeningResults.jsx`, `AdjustCriteriaDrawer.jsx` (portal), `ScreeningDialogs.jsx` (processing, move, save), `ScreeningMenus.jsx` (skill search, education level, saved criteria), `useScreeningFlowParams.js` (URL patcher), `screeningFlowData.js` (verbatim text + mock data + counting rules), `screeningFlowIcons.js`.
- `assets/recruiter-job-screening/*.svg` — glyphs exported from Figma by node id (`export.py`), named by purpose.
- Reused: `ui/MenuPanel`, `ui/IconTileDialog`, `ui/Modal`, `ui/BannerToast`, `ui/Chip`, `ui/Button`, `ui/form/{TextInput,Select}`, `hooks/useDismissableLayer`, `recruiterDashboard/renderWorkspaceSidebar`. `applicationPipeline/ApplicationPipelineSection.jsx` got the add-only `handoff` toast.
- Test: `tests/e2e/recruiter-job-screening-flow.spec.js`.

## Assumptions (⚠️ ASSUMPTION)

- The counting rules are inferred: each added skill removes a fixed number of qualified applicants (8 / 5 / 6 / 4, custom 3); the drawer's relaxed rules add fixed numbers (experience 4+ and Location off = +15, 4 from Close match and 11 from Don't meet, exactly JS-07).
- Figma lists Accessibility and Interaction design under the search text "Pro", so typing **ranks** skills but never hides them; skills already added are not offered again.
- The "Don't meet" tab is not drawn in Figma: three invented rows, reasons in red. Row selection is local state (Meet all opens with everyone selected, as drawn); "Sort", "Load more", "View profile", "Move anyway" only log.
- JS-08's three suggestions: "Apply" on the first two writes the matching `adj*` key and opens `results=meet`; the third ("Allow 2 of 3 required skills") has no rule and only opens the meet tab.
- Escape closes the drawer like Cancel; only the Education and Location switches change the live count.
- Toasts stay until closed (`duration={0}`) so a pinned URL keeps the frame; "Undo" on the hand-off toast only closes it.
- The Education chip is a button (opens the level menu) only when the switch is on; off, it is the static "Master’s Degree" chip of the base frame.

## Figma inconsistencies

- JS-11 draws "Job Postings" as the active nav item; our pipeline highlights "Application Pipeline" (the nav is shared).
- JS-02's delta line has two leading spaces in `characters` (" −8 · updated just now"), no icon exists in the node tree; reproduced as indentation.
- JS-07 draws no scrim behind the drawer; JS-04/10/12 use `#0b1a0f` at 45 % (the frames' scrim node is `#111` at 45 % with the fill hidden).
- JS-10/JS-07/JS-05 frames are 1257 px tall, the others 1117 px.

## Verification

- `framecmp` above; eslint + prettier clean on `jobScreening/`, `ApplicationPipelineSection.jsx`, the spec.
- e2e `recruiter-job-screening-flow.spec.js` (see log entry for the run); responsive: no horizontal scroll at 320 / 390 on eight flow states.
