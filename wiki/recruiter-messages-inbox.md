# Recruiter Messages inbox (R-MSG-01 … R-MSG-11) — `/recruiter/messages`

> Figma file `OHG2xsfCCskT8xEn356njv`, canvas "Recruiter - Messages" (`10124:23474`). Built 2026-11-07. Mock data, state in the URL, no route guards. This **replaces** the earlier recruiter view of the same route (V2.0 frames 7249:83993/84379/84775, see [recruiter-job-prospecting.md](recruiter-job-prospecting.md)): the new canvas redraws the recruiter inbox (stage chips, archive, application card), so `/recruiter/messages` now renders it. `?view=talent` still renders the earlier talent screens.

## Code map

- `src/components/sections/recruiterMessages/`: `RecruiterInboxSection.jsx` (page, URL state, toasts), `RecruiterInboxList.jsx` (left panel), `RecruiterThreadView.jsx` (right panel: header, application card, bubbles, composer, empty states), `recruiterInboxParts.jsx` (Avatar, StageChip, EmptyTile), `recruiterInboxIcons.js`, `recruiterInboxData.js` (verbatim copy + mock). `RecruiterMessagesSection.jsx` hands `view=recruiter` to the new section; the older `MessagesInboxPanel` / `MessagesThreadPanel` now serve only `view=talent`.
- Shell: workspace rail (`recruiterDashboard/renderWorkspaceSidebar`), SF Pro Rounded via `useScopedRoundedFont('data-recruiter-ui')`, toasts via `ui/BannerToast`, the thread "…" menu reuses `ThreadOptionsMenu`.
- Assets: `src/assets/recruiter-messages/` (purpose-named Figma exports: `icon-archive`, `icon-inbox`, `icon-send-composer`, `empty-conversation-illustration.png`, `photo-ama-boateng.png`, …).
- Test: `tests/e2e/recruiter-messages-frames.spec.js` (5 tests incl. 320 / 390 overflow).

## Frame → URL → diff

Diff % from `figma-tools/framecmp.mjs` (1728 wide, viewport = frame height − 52), 2026-11-07. `✅ VERIFIED`.

| Code     | Frame                                 | Figma node  | URL                                     | Diff |
| -------- | ------------------------------------- | ----------- | --------------------------------------- | ---- |
| R-MSG-01 | Inbox · All (application thread open) | 10124:24387 | `/recruiter/messages`                   | 5.4  |
| R-MSG-09 | Unread filter                         | 10124:24724 | `?tab=unread`                           | 2.3  |
| R-MSG-11 | Empty inbox · first visit             | 10124:25334 | `?inbox=empty`                          | 2.3  |
| R-MSG-02 | Applicants filter · auto-message      | 10124:25513 | `?tab=applicants`                       | 2.9  |
| R-MSG-08 | Applicants · no new applications      | 10124:25799 | `?tab=applicants&inbox=none`            | 2.4  |
| R-MSG-04 | Archived · toast with undo            | 10124:26317 | `?tab=applicants&toast=archived`        | 4.3  |
| R-MSG-05 | Archived view · conversation open     | 10124:26615 | `?archived=1`                           | 4.7  |
| R-MSG-07 | Archived view · empty                 | 10124:26918 | `?archived=1&inbox=empty`               | 1.8  |
| R-MSG-06 | Unarchived · back in inbox (toast)    | 10124:27086 | `?toast=unarchived`                     | 6.5  |
| R-MSG-02 | No message selected yet               | 10124:27435 | `?conversation=none`                    | 2.6  |
| T-MSG-01 | Talent · Focused · Inbox (default)    | 10136:7507  | `?view=talent` (earlier talent screens) | n/a  |

Other keys: `conversation=<id>` (ama-boateng, akosua-quansah, julian-reed, kofi-amankwah, ella-mensah, sarah-jenkins), `menu=thread`, `thread=open` (below lg the thread is its own screen).

## Behaviour

Tabs filter the list (Unread = rows with a count, Applicants = application threads). The archive button opens the archived view (back button returns). "Archive conversation" in the thread menu removes the row and shows the toast; Undo / Unarchive / the row restore button bring it back and show "Moved back to your inbox".

## Assumptions and Figma inconsistencies

- ⚠️ ASSUMPTION: the "Archive conversation" menu row (frames show only its result); "Not progressed" chip colours (`#f8f8f4` / `#575755`); Kofi / Ella / Sarah thread bodies reuse Akosua's short thread; Marcus / Godfred archived threads likewise.
- Figma: tab counts differ per frame ("All (06)" / "Unread (03)" on the Unread frame); kept per frame in `TAB_COUNTS`.
- Figma: the auto-message note names "Eleanor" while the thread is with Ama; kept verbatim.
- Figma: the match meter is drawn ~95 % full under an "84% match" label; we draw 94.9 % as drawn.
- Figma: R-MSG-01 contains a hidden-looking "4 recruiters in your inbox" text at the top right; not rendered.
- Figma: "R-MSG-01" appears twice and "R-MSG-02" three times on the canvas (identical copies); one URL each.

## Not verified / not built

- **T-MSG-01 (talent inbox, `10136:7507`)** is a talent-persona frame on this canvas. It was **not rebuilt**: the earlier `view=talent` screens still render the old design, and in the dev server `?view=talent` currently redirects to `/login` (talent shell needs a session), so no diff number is quoted. It needs its own pass.
- Sort / refresh / search typing / Help me reply / send are inert (no frame draws a result); "Search talent" and "Post a job" navigate.
