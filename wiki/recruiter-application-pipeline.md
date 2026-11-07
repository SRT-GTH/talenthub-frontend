# Recruiter Application Pipeline — `/recruiter/application-pipeline`

> Figma file `OHG2xsfCCskT8xEn356njv`, page "Recruiter - Application Pipeline" (`10172:10101`), section `10173:11111`, 24 frames at 1728 wide: PL-01 … PL-16 (17 new frames) plus 7 "PL-orig" frames. Built 2026-11-07 by two parallel builders (BOARD: PL-01, 01b, 02, 04, 06, 15; ACTIONS: PL-03, 05, 07–14, 16); the lead measured and verified. `🔗 EXTERNAL`
> The 7 "PL-orig" frames are the schedule-interview frames AP3–AP9 already built from the older page ([recruiter-job-prospecting.md](recruiter-job-prospecting.md)); they were not rebuilt and still work at their old URLs.

## Old board vs new board

`ApplicationPipelineSection` shows the NEW board (workspace rail, SF Pro Rounded) for every demo URL, except when `sidebar=collapsed` (the PL-orig / AP3–AP9 frames), `handoff=` (the screening hand-off) or signed-in live data is loaded: those keep the older board and old rail exactly as before. `✅ VERIFIED` (code, and `?handoff=46` renders).

## Frame → URL → diff

Diff % = our screenshot vs the Figma export (`recmp`, whole frame, 2026-11-07, lead re-measured). `✅ VERIFIED` (measured). The 2–4 % floor is the Ask Buddy button, the shell's "Kofi A." vs Figma's "Joel K.", font and anti-aliasing differences. Dialog frames sit about 25 px lower than drawn: Figma centres them in a 1117 px frame, the measurement viewport is 1065 px. All URLs are under `/recruiter/application-pipeline`; `SEL` = `ama-boateng,eleanor-fant,marcus-thorne`; `SC` = `scenario=offer-sent-sarah&scroll=end`.

| Frame  | Content                                     | Figma node    | URL                                                                                                   | Diff |
| ------ | ------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------- | ---- |
| PL-01  | Board · Senior UX Designer, all stages      | `10173:11112` | (none)                                                                                                | 2.8% |
| PL-01b | Scrolled to Hired and Not progressed        | `10173:11715` | `?scroll=end`                                                                                         | 2.7% |
| PL-02  | Candidate card menu                         | `10173:12318` | `?menu=ama-boateng&menuItem=move-shortlisted`                                                         | 3.0% |
| PL-03  | Candidate drawer · Ama Boateng              | `10173:12962` | `?drawer=ama-boateng`                                                                                 | 3.8% |
| PL-04  | Moving a card · drag to Shortlisted         | `10173:13640` | `?drag=nana-kwarteng&over=shortlisted`                                                                | 3.1% |
| PL-05  | Card moved · notify candidate prompt        | `10173:14268` | `?modal=move-notify&candidate=eleanor-fant&from=applied&to=shortlisted&justMoved=eleanor-fant-recent` | 3.5% |
| PL-06  | Bulk select · 3 selected                    | `10173:14906` | `?selected=SEL&justMoved=eleanor-fant-recent`                                                         | 3.4% |
| PL-07  | Bulk move · confirm                         | `10173:15546` | `?modal=bulk-move&candidate=SEL&selected=SEL`                                                         | 4.4% |
| PL-08  | Not progressing · reason and message        | `10173:16195` | `?modal=not-progressing&candidate=marcus-thorne&selected=SEL`                                         | 3.9% |
| PL-09  | Not progressed · message sent (toast)       | `10173:16858` | `?scenario=marcus-not-progressed&scroll=end&toast=not-progressed-sent&candidate=marcus-thorne`        | 3.4% |
| PL-10  | Extend offer · details                      | `10173:17496` | `?modal=extend-offer&candidate=sarah-jenkins&selected=SEL`                                            | 3.9% |
| PL-11  | Offer sent · Sarah in Offer extended        | `10173:18161` | `?SC&toast=offer-sent&candidate=sarah-jenkins`                                                        | 3.3% |
| PL-12  | Offer accepted · hired + "opening filled"   | `10173:18806` | `?SC&modal=offer-accepted&candidate=akosua-quansah`                                                   | 2.9% |
| PL-13  | Offer declined · next step                  | `10173:19464` | `?SC&modal=offer-declined&candidate=akosua-quansah`                                                   | 2.8% |
| PL-14  | Interview completed · feedback and decision | `10173:20129` | `?SC&modal=interview-completed&candidate=sarah-jenkins`                                               | 3.6% |
| PL-15  | Empty pipeline · Product Designer           | `10173:20826` | `?pipeline=empty`                                                                                     | 1.9% |
| PL-16  | Interview scheduled · toast                 | `10173:21199` | `?SC&toast=interview-scheduled&candidate=ella-mensah`                                                 | 3.3% |
| orig 1 | Schedule interview · empty                  | `10173:21844` | `?sidebar=collapsed&modal=schedule-interview`                                                         | 4.2% |
| orig 2 | Schedule · empty, interviewers open         | `10173:22405` | `?sidebar=collapsed&modal=schedule-interview&interviewers=open`                                       | 4.1% |
| orig 3 | Schedule · filled, online                   | `10173:22977` | `…&state=filled&format=online`                                                                        | 5.8% |
| orig 4 | Cancel interview confirmation               | `10173:23566` | `?sidebar=collapsed&modal=cancel-interview`                                                           | 2.9% |
| orig 5 | Schedule interview confirmation             | `10173:23990` | `?sidebar=collapsed&modal=schedule-confirmation`                                                      | 3.3% |
| orig 6 | Schedule · filled, in person                | `10173:24414` | `…&state=filled&format=in-person`                                                                     | 5.8% |
| orig 7 | Schedule · filled, phone                    | `10173:25006` | `…&state=filled&format=phone`                                                                         | 5.7% |

The orig frames were 0.2–0.3 points better in the earlier flow (3.9, 3.8, 5.5, 2.7, 3.0, 5.5, 5.4 %); the cause was not traced (probably shell changes by other sessions). Some measurement runs returned blank pages (`net::ERR_NETWORK_CHANGED`, the machine's network drops); those frames were re-run until they rendered.

## URL keys (state in the URL, mock data, no route guards)

- Board (`pipelineUrlState.js` header): `stage=<id>` (filter chip), `qualified=1`, `q=<text>`, `menu=<cardId>` + `menuItem=<row>` (pinned hover), `selected=<id,id>`, `selectionBar=hidden`, `drag=<ghostId>&over=<stageId>`, `justMoved=<ghostId>`, `scroll=end`, `moved=<cardId>:<stageId>,…`, `pipeline=empty`, `scenario=<key>`, existing `posting`, `dropdown`, `forceHover`, `sidebar`, `modal` (schedule-interview | cancel-interview | schedule-confirmation), `state`, `format`, `interviewers`.
- Actions (`actions/PipelineActionLayer.jsx` header): `drawer=<cardId>`; `modal=bulk-move | not-progressing | extend-offer | offer-accepted | offer-declined | interview-completed | move-notify`; `toast=not-progressed-sent | offer-sent | interview-scheduled`; `candidate=<id[,id]>`, `from`, `to`; `scenario=marcus-not-progressed | offer-sent-sarah`. Closing a dialog removes only its own keys.
- The "N selected" bar is hidden while any dialog is open except `modal=bulk-move` (PL-08 and PL-10 draw the cards ticked with no bar).
- Navigation wired and clicked: card menu rows (View candidate's profile, Open application → drawer; Message → `/recruiter/messages`; Move to Screening / Shortlisted → notify prompt and `moved=`; Schedule interview → schedule dialog; Not progressing… → dialog); drawer "Move to Screening", "View full profile" → `/recruiter/talent-search/<cardId>`, "Open conversation" → `/recruiter/messages`; offer toast "View message" → `/recruiter/messages`; the talent profile's "View in Pipeline" (button and toast) → this page; job screening hand-off `?handoff=46`; the rail's Home, Talent Search, Job Postings, Messages, Community and Settings rows.

## Data model and files

- Board = `{ jobId, jobTitle, totalCandidates, qualifiedCount, stages:[{ id, label, icon, count, chipCount?, cards, hiddenCount?, empty? }] }` (`pipelineBoardData.js`: `BASE_BOARD`, `EMPTY_BOARD`, `IN_FLIGHT_CARDS`, `CARD_MENU_ROWS`); pure helpers in `pipelineBoardModel.js` (`findCard`, `moveCard`, `updateCard`, `stageOf`, `formatStageCount`). The board is built as base board, then the `moved` pairs, then `ACTION_SCENARIOS[scenario]` (an unknown key changes nothing).
- Board: `PipelineBoard`, `PipelineCandidateCard`, `PipelineCardMenu`, `PipelineMeetingCard` (also used by the older board), `pipelineStageIcons.jsx`, `recruiterDashboard/WorkspaceSettingsIcon.jsx`; `WorkspaceSidebar` got the opt-in `showSettings` prop (the Settings row; links to `/recruiter/settings`).
- Actions (`sections/applicationPipeline/actions/`): `PipelineActionLayer`, `pipelineActionScenarios.js`, `pipelineActionData.js`, `CandidateDrawer`, `ActionDialogs`, `OfferInterviewDialogs`, `PipelineToast`, `ActionFormParts`, `actionIcons.jsx`; shared new `ui/CenteredIconDialog.jsx`, `IconTileDialog` `iconTileClassName`.
- Avatars: `src/assets/recruiter/application-pipeline/`.

## Verification (2026-11-07)

- `eslint` 0 problems on all changed source files; `npm run build` passes; prettier clean on the pipeline files (it flags only `recruiterSettings/*` and `talentSettings/ProfileMenu.jsx`, another session's work).
- Responsive audit on the production build (`vite preview`), 27 URLs at 320 / 390 / 1024 / 1440: no horizontal overflow, nothing under 12 px below 1024, no console errors, no blank page on any new frame. The only flags are the 5 older schedule-interview URLs at 1024 and 1440: the weekday date cards ("SUN", "MON", …) are tall by design and my check read them as wrapped button labels (false positive; they pass at 320 and 390).
- Clicked by the lead on the production build: every rail item above; all 7 card-menu rows; drawer Move to Screening / Open conversation; the Hired chip; card "Schedule Interview" opens the dialog; `?handoff=46` renders; the applicant profile "View in Pipeline". Builders also ran: drag, bulk select and bulk move, qualified toggle, search, notify prompt, offer and decision dialogs, toasts and Undo, toast dismiss (about 40 steps).
- Bug found and fixed by the lead: on the talent profile, the toast actions "Open Conversation" and "View in Pipeline" navigated away and the toast's own close then rewrote the profile URL, so the user stayed on the profile (`TalentCandidateProfileSection.jsx`, now a `leavingRef` guard). The same pattern was found and fixed by the ACTIONS builder inside the pipeline toasts. Any new `BannerToast` whose action navigates must not call a `set()` in `onClose` after leaving.
- Other pages after the shared `WorkspaceSidebar` change: `/recruiter/home`, talent search, profile, messages, job postings, Talent `/job-postings` render with no overflow or errors; the Settings row appears only on `/recruiter/settings` and the new board.

## Known gaps, assumptions, Figma inconsistencies

- Figma inconsistencies kept as drawn: "All stages 128" does not equal the sum of the stage chips; PL-04 and PL-06 draw a card in the target column while the source chip still counts it (modelled as in-flight ghost cards); Eleanor appears in Applied and Shortlisted in PL-06; PL-09 to PL-16 chips read Applied 3 / Screening 1 / Not progressed 2 while the columns hold 2 / 1 / 3 cards (`chipCount`); PL-11 to PL-16 headers read Interview "03" with 2 cards and Offer extended "01" with 2; Not progressed header "03" while the chip says 2; PL-12 and PL-13 show "No hires yet" behind the accepted dialog; PL-08 / PL-10 counters hard-code "252 / 600" and "158 / 600" (ours count the real text).
- `⚠️ ASSUMPTION`: stage chips filter to one column; the "Show qualified only" ON look; the hover-only select box; card menu rows for non-Applied stages; the Not progressing reasons other than "Not enough senior experience"; offer expiry and employment options beyond the selected ones; the bulk-move "Move to" options; drawers for cards other than Ama Boateng (card facts only); toast follow-ups (Undo, View message, Send update) only close or navigate; the dense phone layout of the board (scroll-snap strip, chips as a filter row) and of all dialogs (bottom sheets).
- Not drawn in Figma: hover and focus states, validation errors, loading and error states, any screen after "Send update", "Undo", "Close posting"; there is no board entry point for "Extend offer" and "Offer accepted / declined" (reachable by URL, from the interview-feedback and offer-declined dialogs).
- Not verified: the live signed-in pipeline (the board hides the actions layer when live data is loaded); a real drag with a touch device; real offer-letter upload ("Replace" only logs); hover and active states; the dialogs at 320 and 390 were checked for overflow only, not looked at.
- The Settings row exists only on the new-board frames; the Talent Search frames draw no Settings row, so it stays opt-in.
