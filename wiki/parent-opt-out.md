# Parent opt out and restore (`/parent/wards/:id`) and Help and guides (`/parent/help`)

> Figma: file `SCXc457vwiq6o7d9g4jVbh`, canvas "Parent · 05 Opt out and restore" `10057:1302` (persona Emma Mensah, ward Abena). Built 2026-10-27, Focused only (the Parents file has no Playful twins), frontend only (mock store).
> Flow: Ward page → **Opt out** → PO-01 dialog → the paused ward page (PO-02) → **Restore access** → PO-03 dialog → normal page + PO-04 toast. **Report a concern** (ward page or Help page) → PH-03 → PH-03b.
> The ward screens live on the one ward page (`ParentWardPage`, no new route); PH-03 / PH-03b are drawn over the Help and guides page, which is built here too (`/parent/help`).

## Frames → URLs

Diff = whole-frame pixel diff vs the Figma 0.5x export at viewport = frame height − 52 (re-measured 2026-10-28 with the bundled SF Pro Rounded; the ~2.5 % floor is the half-scale export plus small padding offsets).

| Frame                                           | Figma id       | URL                                                                 | Diff   | Status                           |
| ----------------------------------------------- | -------------- | ------------------------------------------------------------------- | ------ | -------------------------------- |
| PW-02 Ward · Abena · Overview (context)         | `10057:1314`   | `/parent/wards/abena` (Ward pages work)                             | —      | ✅ their page                    |
| PO-01 Opt out a ward (modal)                    | `10033:5762`   | `/parent/wards/abena?modal=opt-out&reason=safety&note=<text>&ack=1` | 3.00 % | ✅                               |
| PO-02 Ward · Opted out                          | `10034:143423` | `/parent/wards/abena?state=opted-out`                               | 2.60 % | ✅ (see inconsistency below)     |
| PO-03 Restore access (modal)                    | `10034:144044` | `/parent/wards/abena?state=opted-out&modal=restore`                 | 2.68 % | ✅                               |
| PO-04 Access restored (toast)                   | `10052:3799`   | `/parent/wards/abena?toast=access-restored`                         | 2.94 % | ✅                               |
| PH-03 Report a safety concern (modal) (context) | `10057:1591`   | `/parent/help?modal=report&who=abena&worry=contacted&note=<text>`   | 4.81 % | ✅ (dialog placement, see below) |
| PH-03b Report sent (confirmation) (context)     | `10057:1806`   | `/parent/help?modal=report-sent&about=abena`                        | 3.60 % | ✅ (dialog placement, see below) |
| Help and guides (the page behind PH-03 / 03b)   | `10057:1599`   | `/parent/help`                                                      | —      | ✅ no own frame; same page       |

`?state=opted-out` seeds the store (reason "Safety concerns", time 15:20) so a frame reproduces from a fresh load; a real opt-out writes the same param, so a reload keeps the ward paused. The report dialogs also open on the ward page (`/parent/wards/abena?modal=report`, from "Report a concern" on the paused page).

## Interactions (exercised in a browser: 38 checks on the ward flow, 26 on the Help page)

Opt out (header) → PO-01: reason chips (optional), note (up to 500 characters), the red confirmation box; **Opt out Abena** stays disabled until the box is ticked → paused page with the banner ("Opted out by you today, HH:MM · reason: …"), no tabs, a red "Opted out" chip and one **Restore access** button → PO-03 (**Not now** keeps it paused) → **Restore access** → normal page + "Abena's access is back" toast. **Report a concern** → PH-03 (Send disabled until the note has text) → PH-03b with the report number. On the Help page, "Opt Abena out" in PH-03b goes to `/parent/wards/abena?modal=opt-out`; on the ward page it opens PO-01 in place. Help search filters the six topics as you type. Esc, X and scrim close every dialog. Elliot reads "He'll … him … his" (wording comes from the ward).

## Code map

- Ward flow: `src/components/sections/parent/optout/` — `WardOptOutLayer.jsx` (opt-out / restore dialogs + toast + URL seeds), `WardOptedOut.jsx` (PO-02 body), `OptOutDialog.jsx`, `RestoreDialog.jsx`, `ReportConcernLayer.jsx` (PH-03 / PH-03b, URL-driven, shared by the ward page and the Help page), `ReportConcernDialog.jsx`, `ReportSentDialog.jsx`, `wardAccessStore.js` (module store + `useWardAccess`), `data/optOutData.js` (copy, marked blocks).
- Help page: `src/pages/parent/ParentHelpPage.jsx` (route `help` in `ParentApp.jsx`), `src/components/sections/parent/help/HelpGuides.jsx` (search, six topic cards, contact card), `help/data/helpData.js`.
- Page: `src/pages/parent/ParentWardPage.jsx` swaps `WardShell` for `WardOptedOut` while the store says the ward is opted out and mounts `WardOptOutLayer`; `wards/WardShell.jsx` got `onOpenOptOut` (the red header button).
- Shared (new): `src/components/ui/ChoiceChips.jsx` — the single-choice pill group (flag severity, opt-out reason, report who / what). Reused: `ui/DialogCard` (+ `DialogCloseButton`), `ParentTextField`, `ParentButton`, `wards/WardChip` (tone `opted`), `wards/dialogs/ParentToast`.
- New assets (Figma exports): `src/assets/parent/optout-pause.svg`, `optout-check.svg`, `help-spot-profile.svg`, `help-spot-certificate.svg` (56 px; another session's `spot-certificate.svg` is a 72 px export, left alone), `help-spot-evaluations.svg`, `help-spot-salary.svg`, `help-spot-chats.svg` (64 px); the Help page also uses `spot-privacy.svg` and `spot-calendar.svg`.

## Consolidation done in this pass

The flag dialog's inline severity chips (`FlagFieldDialog`) moved onto the new `ui/ChoiceChips` (0.000 % on the three flag dialogs). The report dialogs were extracted into one `ReportConcernLayer` used by both hosts. All pre-existing ward / flags / dialog URLs re-shot and compared: 0.000 %.
Candidates for later: the red confirmation checkbox row (`OptOutDialog`) vs `ui/form/Checkbox`; the pink and mint callout boxes vs one `ParentCallout`; the 80px spot-art dialog headers vs one dialog header with art; the red "Opt out" label override (`[&_span]:!text-[#c0392b]`) vs a `danger` variant on `ParentButton`; the topic card / contact card vs the Home page cards.

## Known gaps / assumptions (⚠️)

- **Figma inconsistency kept**: PO-02 draws the "Worried about safety?" card at x 1696, outside the 1329 column (cut off at the frame edge); PO-03 draws it correctly beside the card. The PO-03 layout is built (it stacks below 1280 px). The Ward pages work's "Who can find Abena" link shows in the header behind PO-01 / PO-04; Figma does not draw it.
- **Dialog placement**: Figma places these dialogs above the centre of the viewport (PO-01 −20 px, PO-03 −24 px, PH-03 and PH-03b −66 px); the app centres every dialog, so the tall report dialogs sit lower than in the frames (that is most of their 4.7 % / 3.4 %).
- **Invented (⚠️ ASSUMPTION)**: the reason is optional (none selected at first; the banner then leaves "reason:" out) and the red box is required before "Opt out"; the unticked box is a white box with a red line; "Send report" stays disabled until the note has text (no new error copy); the report number is the drawn mock `GTH-S-4821`; "While you wait" and "Opt <ward> out" only show when the host can opt that ward out (ward page: its own ward; Help page: Abena or Elliot; never for "Someone else"); a real opt-out prints the current time, the frames print 15:20; the typed note is kept only in the store. Help page: the search field's text is the placeholder (Figma draws it as a filled value, styled the same), the search filters the topics, topic cards and "Chat on WhatsApp" only log (no destination drawn), and an empty search says "No topics match your search."
- **Not wired**: the wards list (`/parent/wards`) does not show an opted-out ward as opted out; the recruiter and ward sides do not read the store; the sidebar counts do not change.
- **Not verified**: Playful (none exists for this file); real backend; screen-reader pass; Playwright e2e baselines.
