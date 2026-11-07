# Recruiter · Settings & Account — Help set (pop-over, shortcuts, feedback, invite, Help centre)

> Figma: file `OHG2xsfCCskT8xEn356njv`, canvas "Recruiter - Settings & Account" `10161:75722`, sections "Profile menu, help, feedback and invite" and "Help (top-bar ? icon)". **Focused only** (no Playful twins). Built 2026-11-07, frontend only, mock data, no `/api/support` call (the recruiter pages never call a talent API).
> The set is the talent Help set (`talentSettings/Help*`, `KeyboardShortcutsModal`, `SendFeedbackDialog`, `InviteFriendDialog`) fed with recruiter copy through add-only `data` / `copy` props. Other recruiter pages adopt it with one hook.

## Frame → URL ✅ VERIFIED (framecmp, 2026-11-07, 1728×(frame−52))

| Frame                                          | Figma id      | URL                                                 | Diff % |
| ---------------------------------------------- | ------------- | --------------------------------------------------- | ------ |
| R-FB-01 Send feedback                          | `10161:86399` | `/recruiter/job-postings?modal=feedback`            | 6.4    |
| R-IV-01 Invite a teammate                      | `10161:86808` | `/recruiter/job-postings?modal=invite`              | 7.0    |
| R-HS-01 Help and support                       | `10161:87217` | `/recruiter/help`                                   | 2.3    |
| R-HP-01 Help pop-over · For this page          | `10161:87540` | `/recruiter/job-postings?help=page`                 | 4.1    |
| R-HP-02 Help pop-over · Searching              | `10161:87922` | `/recruiter/job-postings?help=searching&q=fee`      | 4.2    |
| R-HP-03 Help pop-over · No results             | `10161:88304` | `/recruiter/job-postings?help=none&q=bulk%20reject` | 3.9    |
| R-HP-08 Keyboard shortcuts                     | `10161:88686` | `/recruiter/job-postings?help=shortcuts`            | 6.2    |
| R-HP-04 Help article · Candidate asked for fee | `10161:89124` | `/recruiter/help?help=article`                      | 3.5    |
| R-HP-07 Report a problem (modal over article)  | `10161:89324` | `/recruiter/help?help=report`                       | 5.7    |
| R-HP-05 Contact support                        | `10161:89558` | `/recruiter/help?help=contact`                      | 3.3    |
| R-HP-06 Request sent (modal over contact)      | `10161:89746` | `/recruiter/help?help=sent`                         | 5.1    |

The same `?help=` / `?modal=feedback|invite` URLs work on `/recruiter/settings` (label "FOR THIS PAGE · SETTINGS"). Diffs are mostly the shell around the frames (rail card "Kwame Asante" vs the frame's "Joel Adade Kofie", Job Postings card data/order, "Kofi A." top bar — other builders' files), not the Help UI.

## URL contract (state in the URL)

- `help=page|searching|none` pop-over (`q` = search text; typing rewrites `help` + `q`, clearing returns to `page`) · `help=shortcuts` modal (the **?** key opens it) · any other non-empty value opens the default pop-over.
- `help=article|report|contact|sent` are Help-centre pages: on any recruiter page other than `/recruiter/help` they redirect (replace) to `/recruiter/help?help=<same>`.
- `modal=feedback|invite` dialogs. Other `modal` values belong to the page (Job Postings uses `close-posting`, …) and are ignored here.
- The "?" button toggles `help=page`; Esc / the X / the backdrop close it; the button is ringed only while the pop-over or shortcuts modal is open (`NavIconButton active="open"`).

## Behaviour

- Pop-over rows with a drawn article ("A candidate asked me to pay…") open the article; other rows only log (no article is drawn). "Contact support" → `/recruiter/help?help=contact`; "Help centre" → `/recruiter/help`.
- Help and support: topic cards open the pop-over; FAQ accordion (first question open as drawn); the safety card's "Report a problem" opens the report modal over the article; the "Someone at risk? Report a concern" link of the talent page is **off** (not in the recruiter frame); requests rows do nothing (no request view is drawn).
- Contact: topic and reply chips, editable subject / details (live counter), Browse adds the sample file, x removes it, device-info checkbox, Send opens the Request-sent modal (`#GTH-2318`), "Back to Help centre" / "View my requests" return to the centre.
- Feedback: rating radios, editable text, screenshot checkbox, Send disabled when empty (closes the dialog, nothing is sent). Invite: Copy link writes the clipboard and announces "Link copied"; share tiles open wa.me / mailto / sms or the native share sheet.

## Code map

- `src/components/sections/recruiterSettings/RecruiterHelpPopover.jsx` — the node rendered into `DashboardTopNav panels.help`: pop-over (`HelpPopoverFlow` + recruiter `data`), shortcuts, feedback / invite dialogs, Esc, "?" key, anchor, redirect.
- `…/recruiterSettings/help/` — `recruiterHelpData.js` (all copy, verbatim, URL contract at the top) · `useRecruiterHelpState.js` (URL state) · `useRecruiterHelpPanels.jsx` (**the hook other recruiter pages adopt**: `panels={useRecruiterHelpPanels()}`) · `RecruiterContactView.jsx` · `RecruiterHelpSupportSection.jsx`.
- `src/pages/recruiterSettings/RecruiterHelpSupportPage.jsx` — page for `/recruiter/help` (**lead registers the route**).
- Add-only props on talent files (defaults = old behaviour): `HelpPopoverFlow data`, `KeyboardShortcutsModal copy`, `SendFeedbackDialog copy`, `InviteFriendDialog copy / linkClassName`, `HelpArticleView data`, `HelpSupportPage data / requests / ContactView`, `HelpContactView` exports `RequestSentModal` (+ `copy`), `HelpRequests chipTone`, `useMyRequests { enabled }`.
- `JobPostingsSection.jsx`: +1 import, +1 hook line, `panels={helpPanels}` on `DashboardShell` (three small edits; existing behaviour untouched).
- Tests: `tests/e2e/recruiter-settings-help.spec.js`.

## ⚠️ Assumptions

- Pop-over on pages other than Job Postings shows the same three "For this page" questions under "FOR THIS PAGE · SETTINGS / HELP AND SUPPORT" (only Job Postings is drawn).
- Search matching: the drawn "fee" results do not contain the word, so entries carry `keywords` (fee, fees, payment, charge…); "bulk reject" matches nothing.
- Invite share text is not drawn (`recruiterHelpData.js` `message`). "Browse" adds the drawn sample file (no picker drawn). "Cancel" on Contact and "View my requests" return to the Help centre.
- Topic cards, request rows and the other related articles have no drawn destination (log only).

## Figma inconsistencies kept as drawn

- The shortcuts modal's closing button is labelled "Open candidate" (it closes the modal).
- Contact details counter is drawn "0 / 1000" while the box holds text; ours counts live (101 / 1000).
- Rail/sidebar differs between frames (Job Postings frames show the "Joel Adade Kofie" card; Help frames the "Kwame Asante" card with Pro plan); we render the shell's rail.
- Top bar draws "Joel K." / talent search placeholder in different frames (shell facts, lead reported).

## Not verified / not done

- "Ask Hiring Assistant", "WhatsApp us" (no number), "Replay the recruiter tour" (no tour exists) only log.
- No Playful variants, no phone-specific Figma frames (the "?" button is hidden below lg by the shell; modals and the Help page are fluid).
