# Parent notifications and milestones (`/parent/notifications`)

> Figma: file `SCXc457vwiq6o7d9g4jVbh`, canvas "Parent · 09 Notifications and milestones" `10057:67396` (persona Emma Mensah). Built 2026-10-28, **Focused only**, frontend only (mock data). 5 of 8 frames built: the in-app screens. **Not built (decision 2026-10-28):** PN-05 / PN-06 / PN-07, the SMS and WhatsApp messages (390 x 844 phone frames) — see "Not built".

## Frame → URL (✅ VERIFIED by `framecmp.mjs`, Focused, 2026-10-28; manifest `tests/parent/frames-notifications.json`)

| Frame                                            | Figma id       | URL                                          | Diff % | Status                                                              |
| ------------------------------------------------ | -------------- | -------------------------------------------- | ------ | ------------------------------------------------------------------- |
| PN-01 Notifications (panel)                      | `10035:530`    | `/parent?notif=open` (any parent page)       | 3.3    | ✅ panel node `10035:1303`                                          |
| PN-04 Notifications · All (page)                 | `10043:1351`   | `/parent/notifications`                      | 1.2    | ✅                                                                  |
| PN-03 Milestone · "Abena wanted you to see this" | `10043:913`    | `/parent/notifications/milestone`            | 1.3    | ✅ (path is ours, ⚠️ ASSUMPTION)                                    |
| PN-03b Reaction sent to Abena (toast)            | `10056:156668` | `/parent/notifications/milestone?toast=sent` | 1.3    | ✅ toast node `10056:156947`                                        |
| PN-05b Abena created a GTH account (in-app)      | `10079:1025`   | `/parent?notice=abena-joined`                | 4.8    | ✅ modal centred in the viewport; Figma pins it 210 px from the top |
| PN-05 SMS · Abena joined GTH                     | `10079:3336`   | —                                            | —      | ⬜ not built                                                        |
| PN-06 WhatsApp · Weekly summary                  | `10079:3360`   | —                                            | —      | ⬜ not built                                                        |
| PN-07 SMS · Abena turns 18 soon                  | `10079:3386`   | —                                            | —      | ⬜ not built                                                        |

PN-02 (the bell panel when the parent is also a talent) lives in canvas 12, not here: [parent-spaces.md](parent-spaces.md) (`?notif=open&spaces=both`, built on the same `NotificationsPanel`).
Diff % = whole-frame pixel difference vs the Figma 0.5x export. PN-04 / PN-03 / PN-03b are font-metric level; PN-01's hot cells are the home behind the panel; PN-05b's are the dialog (vertical position) and the buttons.

## URL contract (`notifications/notificationsState.js`)

`notif=open` the bell panel · `tab=approvals | milestones | ward-activity | from-gth` (page; none = All) · `reaction=so-proud | keep-going | write-my-own` (none = Well done!) · `toast=sent` · `notice=abena-joined` (on `/parent`). Tab links are router `<Link>`s, so every tab is a URL.

## Behaviour (real browser, 23 checks pass against the production build)

- The bell (`ParentTopBar`) toggles the panel; Esc, a click outside, or the bell again close it; focus returns to the bell on Esc. Rows are links; a row closes the panel and opens its screen.
- PN-04: tabs filter the rows (counts stay as Figma prints them); rows are links; "Needs you" / "Milestone" / "Ward activity" / "From GTH" chips are `StatusPill` tones.
- PN-03: the four reactions are a radio group (arrow keys); Send reaction shows the "Sent to Abena" toast (`?toast=sent`, auto-dismiss 4 s); View Abena → `/parent/wards/abena`.
- PN-05b: "That's fine", X and Esc close it; "Opt Abena out" → `/parent/wards/abena?modal=opt-out` (the existing opt-out dialog).

## Code map

- `src/components/sections/parent/notifications/`: `data/notificationsData.js` (copy, verbatim from `characters`), `notificationsState.js`, `NotificationsPanel.jsx`, `NotificationsPage.jsx`, `NotificationRow.jsx`, `MilestoneShared.jsx`, `AbenaJoinedNotice.jsx`.
- Pages: `src/pages/parent/ParentNotificationsPage.jsx`, `ParentMilestonePage.jsx` (routes in `ParentApp.jsx`); the notice is rendered by `ParentHomePage.jsx`; the panel by `ParentFrame.jsx`.
- Shared files touched (**add-only, defaults unchanged**): `ParentFrame` (reads `?notif=open`, renders the panel), `ParentTopBar` (`onBell`, `bellOpen`, extra props spread on the icon buttons), `ui/StatusPill` (new `ink` tone), `tests/e2e/helpers/responsive.js` (7 routes).
- Reused: `ui/UnderlineTabs`, `ui/StatusPill`, `ui/DialogCard`, `ParentToast` / `ui/ActionToast`, `ParentButton`.
- Assets (`src/assets/parent/`, Figma exports): `notif-heart`, `notif-file`, `notif-file-check`, `notif-wallet`, `notif-user-check`, `notif-user-plus`, `notif-user`, `notif-star`, `notif-refresh`, `notif-bell`, `notif-spot-trophy`, `notif-spot-ward-joined`. (The older `spot-ward.svg` is a different drawing.)

## Known gaps / assumptions

- ⚠️ ASSUMPTION: where each row opens is not drawn. Milestone → `/parent/notifications/milestone` (our path); Certificate / Payment → `/parent/review?tab=certificates | payments`; Elliot rows → his ward page; the corrected-DOB row → `/parent/wards/abena?tab=flags`; the weekly summary row is plain (it lives on WhatsApp).
- ⚠️ ASSUMPTION: "Mark all read" and "Notification settings" only log (no read state and no settings screen are drawn). Notification settings is a later canvas.
- ⚠️ ASSUMPTION: only PN-04's "All" tab is drawn; the other tabs list the drawn rows of their type. Counts stay as drawn (Milestones 3, Ward activity 5) although only 1 and 3 rows are drawn.
- ⚠️ ASSUMPTION: the toast for the other reactions repeats the "Well done!" sentence with that reaction's label; "Write my own" only selects its chip (no text box is drawn).
- ⚠️ ASSUMPTION: the PN-05b modal is centred in the viewport (Figma: 210 px from the top). Other parent dialogs make the same choice.
- Figma inconsistencies kept as drawn: the search placeholder says "...clubs..." in PN-01 and PN-05b but "...communities..." in PN-04 / PN-03 / PN-03b (the shared top bar says "communities", so the two frames' copy check reports it missing); the bell badge is 5 in PN-01 and PN-05b and the messages badge 5 / 4 across frames (the top bar keeps 5 / 4); the sidebar badge says 4 while the panel lists 5 rows.
- Not verified: real SF Pro Rounded metrics; the bell panel at 1280–1536 wide (position is a clamp of Figma's 170 px right offset); the first load of a lazy route on the dev server can render blank (load twice).
- Resolved 2026-10-28: the responsive audit reported "2 button labels wrap" for the parent home tabs ("Abena 1 flag" / "Elliot 2 to review") at 768 px, so `/parent?notif=open` and `/parent?notice=abena-joined` failed too. Not a real wrap (measured 640–1023 px: tab height 46, label and chip on one line, chip text 2.8 px lower than the label): the probe in `tests/e2e/helpers/responsive.js` split text boxes into `top / 8` buckets and a label next to a smaller chip straddled a bucket edge. The probe now groups boxes into lines by vertical overlap; a genuinely wrapped label is still flagged (checked with a 90 px button).

## Not built (needs a decision)

PN-05 / PN-06 / PN-07 are messages the backend sends by SMS and WhatsApp, not app screens. Proposed (2026-10-28): the verbatim message copy in a data file next to the email templates, plus three phone-look preview pages under `/parent/messages-preview`, marked as previews. Texts are already extracted (sender, time, body, buttons, "Reply YES, NO or STOP"); links like `gth.gov.gh/p/7KQ2` are placeholders until the backend chooses them.
