# Recruiter job flows (JT / CT / JM / JS-15) — `/recruiter/job-postings/*`, `/recruiter/job-templates/*`

> Figma file `OHG2xsfCCskT8xEn356njv`, canvas "Recruiter - Job Postings" (`10103:59491`). Built 2026-11-06. Mock data only, state in the URL, no route guards. The screening frames JS-01…JS-14 are in [recruiter-job-screening-flow.md](recruiter-job-screening-flow.md).
> The 9 base frames (Job Templates / Job Postings / Job Screening lists and their dropdown / dialog states) were already built; they now use the workspace rail (`recruiterDashboard/WorkspaceSidebar` via `renderWorkspaceSidebar`) and the Figma scrim `#0b1a0f @ 45 %`, measured 1.9–3 %.

## Code map

- `src/components/sections/recruiterJobs/`: `jobFormData.js` (verbatim copy + mock seeds), `jobFormControls.jsx` (44px field box, `Select`, pills, check row, skill pill, area box), `JobFormFields.jsx` (the five section cards), `JobFormPage.jsx` (modes `job` | `template` | `edit`), `JobPreviewPage.jsx`, `PostingDetailPage.jsx`, `PostingManageMenu.jsx`, `jobFlowDialogs.jsx`, `postingActionDialogs.jsx`, `TemplateDetailsDialog.jsx`, `jobFlowParts.jsx` (PageFrame, BackCrumb, FlowHeading, FlowBanner), `jobButtons.jsx`, `jobIcons.jsx`.
- Routed pages: `src/pages/recruiterJobs/RecruiterJobPages.jsx` (lazy in `App.jsx`).
- Changed: `jobPostings/JobPostingsSection.jsx` (new menu kind, five dialogs, toasts, new posting), `jobTemplates/JobTemplatesSection.jsx` (details dialog, My templates, card menu, toasts, Screening criteria tab).
- Test: `tests/e2e/recruiter-job-postings-frames.spec.js` (10 tests, incl. 320 / 390 overflow).

## Frame → URL → diff

Diff % from `figma-tools/framecmp.mjs` (1728 wide, viewport = frame height − 52). `✅ VERIFIED` 2026-11-06.

| Code  | Frame                                   | Figma node  | URL                                                                      | Diff |
| ----- | --------------------------------------- | ----------- | ------------------------------------------------------------------------ | ---- |
| JT-01 | Template details (modal)                | 10117:50522 | `/recruiter/job-templates?modal=details&template=product-designer`       | 4.7  |
| JT-02 | Template preview (as talent sees it)    | 10117:51016 | `/recruiter/job-templates/product-designer/preview`                      | 4.6  |
| JT-03 | Create job, pre-filled                  | 10117:51352 | `/recruiter/job-postings/new?template=product-designer`                  | 3.8  |
| JT-04 | Employment type dropdown                | 10117:51735 | `…new?template=product-designer&menu=employment`                         | 3.8  |
| JT-05 | Location dropdown (searchable)          | 10117:52143 | `…&menu=location&q=Acc`                                                  | 3.8  |
| JT-06 | Screening criteria dropdown             | 10117:52554 | `…&menu=screening`                                                       | 3.9  |
| JT-07 | Validation errors                       | 10117:52967 | `…&state=errors`                                                         | 3.8  |
| JT-08 | Preview before publishing               | 10117:53347 | `/recruiter/job-postings/new/preview`                                    | 4.9  |
| JT-09 | Publishing (processing)                 | 10117:53683 | `…new?template=product-designer&state=publishing`                        | 4.6  |
| JT-10 | Published, success + next steps         | 10117:54589 | `/recruiter/job-postings?modal=published`                                | 3.3  |
| JT-11 | New job live (toast)                    | 10117:54084 | `/recruiter/job-postings?toast=published`                                | 3.8  |
| CT-01 | New template, blank                     | 10117:55122 | `/recruiter/job-templates/new`                                           | 3.1  |
| CT-02 | New template, filled                    | 10117:55476 | `/recruiter/job-templates/new?state=filled`                              | 3.8  |
| CT-03 | Save template dialog                    | 10117:55846 | `…/new?modal=save`                                                       | 7.3  |
| CT-04 | Category dropdown open                  | 10117:56249 | `…/new?modal=save&menu=category`                                         | 7.5  |
| CT-05 | Name already used                       | 10117:56677 | `…/new?modal=save&state=name-taken`                                      | 7.5  |
| CT-06 | My templates, saved (toast)             | 10117:57080 | `/recruiter/job-templates?mine=1&toast=saved`                            | 3.9  |
| CT-07 | My template card menu                   | 10117:57431 | `/recruiter/job-templates?mine=1&menu=junior-frontend-developer`         | 2.8  |
| CT-08 | Reuse (template library)                | 10117:57792 | `/recruiter/job-templates`                                               | 4.7  |
| JM-01 | Job detail, recruiter view              | 10117:58288 | `/recruiter/job-postings/senior-ux-designer`                             | 3.7  |
| JM-02 | Posting card actions menu               | 10117:58656 | `/recruiter/job-postings?menu=senior-ux-designer&menuKind=manage`        | 1.9  |
| JM-03 | Edit live posting                       | 10117:61000 | `/recruiter/job-postings/senior-ux-designer/edit`                        | 3.6  |
| JM-04 | Save changes confirm                    | 10117:61371 | `…/edit?modal=confirm`                                                   | 5.5  |
| JM-05 | Changes saved                           | 10117:61762 | `/recruiter/job-postings/senior-ux-designer?saved=1`                     | 5.2  |
| JM-06 | Duplicate as template                   | 10117:59133 | `/recruiter/job-postings?modal=save-template&posting=senior-ux-designer` | 4.5  |
| JM-07 | Duplicated, saved to My templates       | 10117:63457 | `/recruiter/job-templates?mine=1&toast=copied`                           | 4.2  |
| JM-08 | Pause applications confirm              | 10117:59623 | `…?modal=pause&posting=senior-ux-designer`                               | 2.4  |
| JM-09 | Posting paused (toast, undo)            | 10117:62145 | `…?toast=paused&posting=senior-ux-designer`                              | 3.3  |
| JM-10 | Close posting confirm (with applicants) | 10117:60080 | `…?modal=close-applicants&posting=senior-ux-designer`                    | 3.8  |
| JM-11 | Posting closed (toast)                  | 10117:62599 | `…?toast=closed&posting=senior-ux-designer`                              | 3.4  |
| JM-12 | Delete draft confirm                    | 10117:60548 | `…?modal=delete-draft&posting=devops-engineer`                           | 2.4  |
| JM-13 | Draft deleted (undo)                    | 10117:63053 | `…?toast=deleted&posting=devops-engineer`                                | 3.1  |
| JS-15 | Templates › Screening criteria          | 10117:70023 | `/recruiter/job-templates?view=screening`                                | 4.4  |

Flows: Use template → create → Publish job (validates; errors write `state=errors`; valid runs the three-step publishing dialog, then `/recruiter/job-postings?toast=published&modal=published`). Save template dialog → `/recruiter/job-templates?mine=1&toast=saved`. Pause / close / delete dialogs write the matching toast and apply the change locally (Undo / Reopen revert it).

## Assumptions and Figma inconsistencies

- ✅ VERIFIED: every glyph is Figma's own export (`Icon/<name>` instances: check-circle, building, activity, globe, undo, file, save, eye, badge-check, map-pin, briefcase, calendar, clock, bell, alert, send, refresh, sparkles, pipeline, link, copy, filter, pencil, pause, x-circle, trash, more, bookmark, arrow-right, the green select arrow, …) saved purpose-named in `src/assets/recruiter-jobs/*.svg` and inlined by `recruiterJobs/jobGlyphData.js` (generated, strokes → `currentColor`; the select arrow keeps Figma's #387440). `jobIcons.jsx` only maps names to components.
- ⚠️ ASSUMPTION: Pipeline bar widths in JM-01 are proportional to the counts; "Include screening criteria" and "What to include" check lists in JM-06 are from the text dump; the three-step publishing progress timings (0.9 s each) are invented.
- ⚠️ ASSUMPTION: the older 3-item card menu (7249:76889) stays for the plain `?menu=` frames; the new 8-row menu needs `&menuKind=manage` (clicking the "…" on Senior UX Designer opens it).
- Figma: JT-03 shows "198 / 1,000" but the text is 172 characters (CT-02 and JM-03 are right); we count for real, so JT-03 reads 172.
- Figma: CT-07 and CT-08 draw the older rail ("Joel Adade Kofie", "Getting started"); we keep the workspace rail used by every other frame.
- Figma: JM-03 labels the pay inputs "Minimum (GHS)" while the pay type is GBP; kept verbatim.
- Figma: the Employment type dropdown (JT-04) and the screening menu (JT-06) float over the cards; content below does not move.
- Toasts stay until closed (`duration={0}`) so a pinned URL keeps the frame.
- CT-03/04/05 sit at 7.3–7.5 %: Figma centres the dialog in a ~1100px viewport, ours centres in the full-height viewport used by framecmp (see the dialog note in the other flow pages).

## Not verified / limits

- Not exported: the card "…" pill (`charm:menu-meatball`) and arrow glyphs of the existing list cards were already in the repo; the tile glyphs inside the screening dialogs belong to the screening flow page.
- Not run: a real publish against an API (none exists); copy-link writes to the clipboard only.
- "Add a skill" accepts no input (the frames show no results list); skills can only be removed.
- Sort / Share with team / Delete template menu rows only close the menu.
