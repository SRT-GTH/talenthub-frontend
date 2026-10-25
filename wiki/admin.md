# Platform Admin — Theme 7 (`/admin/*`)

Figma file `Bin8roWL8sloyc36IgFMuT`, canvas **Staff · Platform Admin (Theme 7)** `8520:12` — 8 sections (7.0–7.7) + the index frame + the v2 A4 report kit. The index frame says **84 screens**; the canvas holds 96 frames (84 screens, the 7.2.5 community reviews, the 7.7 support queries, the 8-page v2 report, the superseded v1 report cover and the index). **Focused only. Frontend only: mock data, no API calls.**

## What it is

The back office that runs GTH, for GTH staff. Five roles with least privilege: **Support Agent**, **Content Moderator**, **Senior Admin**, **Super Admin**, **Data Protection Officer**. Every action needs a reason and is logged; destructive and high-risk actions need a second approver (dual approval). `✅ VERIFIED` (index frame text).

⚠️ ASSUMPTION: no real auth. `useAdminSession()` returns a mock signed-in staff session; the role is picked with `?role=support|moderator|senior|super|dpo` (default `senior`, remembered for the tab in `sessionStorage`). The staff sign-in screens work against mock data: any non-empty password passes, the 2-step demo code is in `auth/data/adminAuthData.js` (not shown in the UI), five wrong codes lock the account.

## Architecture

- Router: `src/pages/admin/AdminApp.jsx` (mounted by `App.jsx` as `/admin/*`, outside `MainLayout`). One lazy page per section; sections replace the stubs and add no route to `App.jsx`.
- Chrome: `src/components/sections/admin/` — `AdminFrame` (page chrome), `AdminTopBar`, `AdminSidebar` (+ `AdminPersonaCard`, `AdminNavItem`, `AdminHandbookCard`), `adminNav.js`, `adminState.js`, `useAdminSession.js`, `adminIcons.jsx` (Figma-exported icons), `data/adminCoreData.js`.
- The chrome is the agency portal's chrome with staff data (same rail 303 / icon rail 80 / phone bar). **Reused, not copied** from `components/sections/agency/`: `AgencyButton`, `AgencyPageHero`, `AgencyBanner`, `AgencyBuddyFab`, `agencyIcons`, `home/AgencyQuickActions`, `home/AgencyMapGlyph`, `onboarding/AgencyDialog` (modal shell), `onboarding/AgencyCodeBoxes`. ⚠️ If the agency files change signature, check the admin imports.
- Known defect in the agency icon set (not fixed here, other owner): `AgSparkle`, `AgVisibility` and `AgLockBadge` in `agency/home/agencyHomeIcons.jsx` contain a full-size `<rect fill="currentColor">`, so they paint as solid squares. The admin screens use their own `AdminSparkleIcon / AdminEyeIcon / AdminLockBadgeIcon`.
- Page background = the shared `DashboardPageBackground`. Staff home pieces: `home/AdminSnapshotCard`, `AdminStatsCard`, `AdminNextStepCard`, `AdminWorkTable`, `AdminPaginationBar`, `AdminHealthCards`; data from `data/adminHomeData.js` (generated from the five Figma role frames).
- Sign-in pieces: `auth/AdminSignInLayout`, `AdminSignInForm`, `AdminSignInPanel`, `AdminCodeDialog`, `AdminNoticeDialog`; the staff photos are `assets/admin/staff-panel-photo-*.webp` (Figma image fills).

## URL contract

Query keys shared by every screen (`adminState.js`): `role=`, `rail=collapsed`, `drawer=1`, `modal=<name>` (chrome reserves `profile`, `help`, `notifications`, `messages`, `a11y`, `language`; all inert), `state=<name>`, `q=`, `tab=`, `view=`. Screens add their own keys and never reuse these.

## Fidelity notes (kept as drawn / decisions)

- Reports nav item shows the Home glyph in every frame — kept.
- DPO persona monogram reads "SU" (name Kwabena Ofori) — kept.
- Role-home quick-action labels are drawn "Run A Report", "Removed Content", "Audit Log" — kept; the second pagination button reads "1" in some role frames, we draw "2".
- Home row "…" menu (Open · Add a note · Reassign · Escalate) is a hidden frame in Figma: built as a small menu, only "Open" navigates. ⚠️ ASSUMPTION.
- Fonts: Figma is SF Pro Rounded; the app stack falls back to Nunito on machines without it (all text is a little wider there; not a defect).

## Frame checklist (⬜ not built · ✅ built and compared · — not a screen)

Built: 94 of 95.

| Frame                                                                               | Figma id      | Size      | URL                                                             | Status |
| ----------------------------------------------------------------------------------- | ------------- | --------- | --------------------------------------------------------------- | ------ |
| 7.0.1a · Staff sign-in                                                              | `8640:415409` | 1728×1117 | `/admin/sign-in`                                                | ✅     |
| 7.0.1b · Staff sign-in · 2-step code                                                | `8640:415778` | 1728×1117 | `/admin/sign-in?state=code`                                     | ✅     |
| 7.0.1c · Staff sign-in · Account locked                                             | `8640:416090` | 1728×1117 | `/admin/sign-in?state=locked`                                   | ✅     |
| 7.0.1d · Staff sign-in · Set-up link expired                                        | `8666:12511`  | 1728×1117 | `/admin/sign-in?state=expired`                                  | ✅     |
| 7.0.2a · Staff home · Senior Admin work queue                                       | `8623:9`      | 1728×1833 | `/admin?role=senior`                                            | ✅     |
| 7.0.2b · Staff home · Support Agent                                                 | `8665:10792`  | 1728×1833 | `/admin?role=support`                                           | ✅     |
| 7.0.2c · Staff home · Content Moderator                                             | `8665:11496`  | 1728×1833 | `/admin?role=moderator`                                         | ✅     |
| 7.0.2d · Staff home · Super Admin                                                   | `8665:12200`  | 1728×1833 | `/admin?role=super`                                             | ✅     |
| 7.0.2e · Staff home · Data Protection Officer                                       | `8665:12904`  | 1728×1833 | `/admin?role=dpo`                                               | ✅     |
| 7.1.1a · Accounts · Search results                                                  | `8623:725`    | 1728×1244 | `/admin/accounts`                                               | ✅     |
| 7.1.1b · Accounts · No results                                                      | `8640:417819` | 1728×1244 | `/admin/accounts?q=Kwamme&state=empty&role=support`             | ✅     |
| 7.1.2a · Account detail · Talent                                                    | `8623:1242`   | 1728×2007 | `/admin/accounts/TAL-204-8812`                                  | ✅     |
| 7.1.2b · Account detail · Minor (parent-linked)                                     | `8623:2039`   | 1728×2007 | `/admin/accounts/TAL-204-8812?view=minor`                       | ✅     |
| 7.1.2c · Account detail · Super Admin unmasked view                                 | `8640:418285` | 1728×2007 | `/admin/accounts/TAL-204-8812?role=super`                       | ✅     |
| 7.1.3a · Account · Suspend                                                          | `8625:8`      | 1728×2007 | `/admin/accounts/TAL-204-8812?modal=suspend`                    | ✅     |
| 7.1.3b · Account · Suspended                                                        | `8625:992`    | 1728×2007 | `/admin/accounts/TAL-204-8812?state=suspended`                  | ✅     |
| 7.1.3c · Account · Reactivate                                                       | `8625:1772`   | 1728×2007 | `/admin/accounts/TAL-204-8812?state=suspended&modal=reactivate` | ✅     |
| 7.1.3d · Account · Indefinite suspension needs 2nd approver                         | `8625:2593`   | 1728×2007 | `/admin/accounts/TAL-204-8812?modal=approval`                   | ✅     |
| 7.1.4a · Account · Permanently delete (Super Admin)                                 | `8625:3389`   | 1728×2007 | `/admin/accounts/TAL-204-8812?modal=delete&role=super`          | ✅     |
| 7.1.5a · Accounts · Merge duplicates                                                | `8625:6980`   | 1728×1244 | `/admin/accounts/merge`                                         | ✅     |
| 7.1.5b · Accounts · Merge blocked                                                   | `8625:7534`   | 1728×1244 | `/admin/accounts/merge?modal=blocked`                           | ✅     |
| 7.1.5c · Accounts · Merge minors: choose parent link                                | `8666:10792`  | 1728×1244 | `/admin/accounts/merge?view=minors&modal=parent`                | ✅     |
| 7.1.6a · Account · Override a field                                                 | `8625:4223`   | 1728×2007 | `/admin/accounts/TAL-204-8812?modal=override`                   | ✅     |
| 7.1.6b · Account · Override changes age group                                       | `8625:5291`   | 1728×2007 | `/admin/accounts/TAL-204-8812?view=minor&modal=reclassify`      | ✅     |
| 7.2.1a · Moderation · Flag queue                                                    | `8627:8`      | 1728×1244 | `/admin/moderation?role=moderator`                              | ✅     |
| 7.2.1b · Moderation · All clear                                                     | `8627:563`    | 1728×1244 | `/admin/moderation?state=empty&role=moderator`                  | ✅     |
| 7.2.2a · Moderation · Flag detail                                                   | `8627:1048`   | 1728×1244 | `/admin/moderation/flags/FL-2291?role=moderator`                | ✅     |
| 7.2.2b · Moderation · Dismiss flag                                                  | `8627:1561`   | 1728×1244 | `/admin/moderation/flags/FL-2291?role=moderator&modal=dismiss`  | ✅     |
| 7.2.2c · Moderation · Remove content and warn                                       | `8627:2113`   | 1728×1244 | `/admin/moderation/flags/FL-2291?role=moderator&modal=remove`   | ✅     |
| 7.2.2d · Moderation · Escalate                                                      | `8627:2789`   | 1728×1244 | `/admin/moderation/flags/FL-2291?role=moderator&modal=escalate` | ✅     |
| 7.2.2e · Moderation · Claimed by a colleague                                        | `8627:3342`   | 1728×1244 | `/admin/moderation/flags/FL-2291?role=moderator&modal=claimed`  | ✅     |
| 7.2.3a · Moderation · Removed content                                               | `8629:3065`   | 1728×1244 | `/admin/moderation/removed`                                     | ✅     |
| 7.2.3b · Moderation · Restore content                                               | `8629:3599`   | 1728×1244 | `/admin/moderation/removed?modal=restore`                       | ✅     |
| 7.2.3c · Moderation · Government content blocked                                    | `8629:4149`   | 1728×1244 | `/admin/moderation/removed?modal=government`                    | ✅     |
| 7.2.4a · Moderation · Community posts                                               | `8629:4697`   | 1728×1244 | `/admin/moderation/posts?role=moderator`                        | ✅     |
| 7.2.4b · Moderation · Warn author                                                   | `8629:5302`   | 1728×1244 | `/admin/moderation/posts?role=moderator&modal=warn`             | ✅     |
| 7.2.5a · Moderation · New community reviews                                         | `8956:592`    | 1728×1244 | `/admin/moderation/communities?role=moderator`                  | ✅     |
| 7.2.5b · Moderation · Review a new community                                        | `8956:1000`   | 1728×1117 | `/admin/moderation/communities?role=moderator&modal=review`     | ✅     |
| 7.2.5c · Moderation · Ask for a change                                              | `8956:3610`   | 1728×1117 | `/admin/moderation/communities?role=moderator&modal=ask-change` | ✅     |
| 7.3.1a · Reports · Platform health                                                  | `8635:8`      | 1728×1313 | `/admin/reports/health`                                         | ✅     |
| 7.3.1b · Reports · Choose a report                                                  | `8635:547`    | 1728×2124 | `/admin/reports?modal=choose`                                   | ✅     |
| 7.3.1c · Reports · Large report queued                                              | `8635:1290`   | 1728×2124 | `/admin/reports?modal=building`                                 | ✅     |
| 7.3.1d · Reports · Report PDF cover · v1 (superseded by the GTH Report kit version) | `8635:2013`   | 794×1123  | (superseded by the v2 GTH Report kit)                           | —      |
| 7.3.2a · Reports · External data export request                                     | `8635:2057`   | 1728×1313 | `/admin/reports/health?modal=export&role=super`                 | ✅     |
| 7.3.2b · Reports · Identifiable export blocked                                      | `8635:2854`   | 1728×1313 | `/admin/reports/health?modal=blocked&role=super`                | ✅     |
| 7.3.2c · Reports · Export ready                                                     | `8636:8199`   | 1728×1313 | `/admin/reports/health?modal=ready&role=super`                  | ✅     |
| 7.3.3a · Live ops · Dashboard                                                       | `8635:4005`   | 1728×2124 | `/admin/live-ops?role=senior`                                   | ✅     |
| 7.3.3b · Live ops · Anomaly alert                                                   | `8635:4689`   | 1728×2124 | `/admin/live-ops?role=senior&modal=alert`                       | ✅     |
| 7.3.3c · Live ops · Not available for your role                                     | `8640:420507` | 1728×1244 | `/admin/live-ops?role=moderator`                                | ✅     |
| 7.4.0a · Comms · Sent and scheduled                                                 | `8638:8`      | 1728×1244 | `/admin/comms`                                                  | ✅     |
| 7.4.1a · Account · Message user                                                     | `8625:6087`   | 1728×2007 | `/admin/comms/message?account=TAL-204-8812`                     | ✅     |
| 7.4.2a · Comms · Bulk notification                                                  | `8638:540`    | 1728×1604 | `/admin/comms/bulk`                                             | ✅     |
| 7.4.2b · Comms · Send a test first                                                  | `8638:1150`   | 1728×1604 | `/admin/comms/bulk?modal=test`                                  | ✅     |
| 7.4.2c · Comms · Submit for Super Admin approval                                    | `8638:1792`   | 1728×1604 | `/admin/comms/bulk?modal=submit`                                | ✅     |
| 7.4.2d · Comms · Type CONFIRM to send                                               | `8638:2410`   | 1728×1604 | `/admin/comms/bulk?modal=confirm`                               | ✅     |
| 7.4.2e · Comms · Sending progress                                                   | `8638:3190`   | 1728×1244 | `/admin/comms?modal=sending`                                    | ✅     |
| 7.4.3a · Comms · Notification templates                                             | `8638:3946`   | 1728×1269 | `/admin/comms/templates`                                        | ✅     |
| 7.4.3b · Comms · Edit template                                                      | `8638:4516`   | 1728×1244 | `/admin/comms/templates?modal=edit`                             | ✅     |
| 7.4.3c · Comms · System template warning                                            | `8638:5203`   | 1728×1244 | `/admin/comms/templates?modal=publish`                          | ✅     |
| 7.4.3d · Comms · Template version history                                           | `8666:11839`  | 1728×1244 | `/admin/comms/templates?modal=history`                          | ✅     |
| 7.5.1a · Staff · Staff accounts                                                     | `8639:8`      | 1728×1425 | `/admin/settings/staff?role=super`                              | ✅     |
| 7.5.1b · Staff · Create a staff account                                             | `8639:540`    | 1728×1345 | `/admin/settings/staff?role=super&create=1`                     | ✅     |
| 7.5.1c · Staff · Deactivate a staff account                                         | `8639:1034`   | 1728×1244 | `/admin/settings/staff-data?role=super&modal=deactivate`        | ✅     |
| 7.5.1d · Staff · Last Super Admin blocked                                           | `8639:1538`   | 1728×1425 | `/admin/settings/staff?role=super&modal=last-super`             | ✅     |
| 7.5.1e · Staff · Roles and permissions                                              | `8639:2083`   | 1728×1550 | `/admin/settings/roles?role=super`                              | ✅     |
| 7.5.2a · Settings · Feature flags and integrations                                  | `8639:2677`   | 1728×1244 | `/admin/settings?role=super`                                    | ✅     |
| 7.5.2b · Settings · Change a setting                                                | `8639:3123`   | 1728×1244 | `/admin/settings?role=super&modal=setting`                      | ✅     |
| 7.5.2c · Settings · Feature in use warning                                          | `8639:3855`   | 1728×1244 | `/admin/settings?role=super&modal=in-use`                       | ✅     |
| 7.5.3a · Audit · Platform audit log                                                 | `8639:4341`   | 1728×1244 | `/admin/audit-log?role=super`                                   | ✅     |
| 7.5.3b · Audit · Event detail                                                       | `8639:4848`   | 1728×1244 | `/admin/audit-log?role=super&modal=event`                       | ✅     |
| 7.5.3c · Audit · Export the log                                                     | `8639:5521`   | 1728×1244 | `/admin/audit-log?role=super&modal=export`                      | ✅     |
| 7.5.3d · Audit · Senior Admin view (masked)                                         | `8666:11438`  | 1728×1244 | `/admin/audit-log?role=senior`                                  | ✅     |
| 7.6.1a · Verification · Queue                                                       | `8632:410855` | 1728×1244 | `/admin/verification`                                           | ✅     |
| 7.6.2a · Verification · Review partner KYB                                          | `8631:8`      | 1728×1244 | `/admin/verification/kyb`                                       | ✅     |
| 7.6.2b · Verification · Approve partner                                             | `8632:411388` | 1728×1244 | `/admin/verification/kyb?modal=approve`                         | ✅     |
| 7.6.2c · Verification · Ask for more info                                           | `8632:412144` | 1728×1244 | `/admin/verification/kyb?modal=info`                            | ✅     |
| 7.6.2d · Verification · Reject                                                      | `8632:412926` | 1728×1244 | `/admin/verification/kyb?modal=reject`                          | ✅     |
| 7.6.3a · Verification · Review institution accreditation                            | `8634:8`      | 1728×1244 | `/admin/verification/accreditation`                             | ✅     |
| 7.6.3b · Verification · Review agency MoU                                           | `8634:936`    | 1728×1244 | `/admin/verification/mou`                                       | ✅     |
| 7.6.4a · Data request · DPO review                                                  | `8634:1676`   | 1728×1229 | `/admin/verification/data-request?role=dpo`                     | ✅     |
| 7.6.4b · Data request · DPO approve with access window                              | `8634:411960` | 1728×1229 | `/admin/verification/data-request?role=dpo&modal=approve`       | ✅     |
| 7.6.4c · Data request · DPO reject                                                  | `8634:3296`   | 1728×1229 | `/admin/verification/data-request?role=dpo&modal=reject`        | ✅     |
| 7.6.5a · Verification · Appeal review                                               | `8640:419746` | 1728×1244 | `/admin/verification/appeal?role=super`                         | ✅     |
| 7.7.1a · Support · Query queue                                                      | `8666:415975` | 1728×1244 | `/admin/support?role=support`                                   | ✅     |
| 7.7.1b · Support · Query detail                                                     | `8666:416513` | 1728×1244 | `/admin/support/SUP-10451`                                      | ✅     |
| 7.7.1c · Support · Reply with template                                              | `8666:417042` | 1728×1244 | `/admin/support/SUP-10451?modal=reply`                          | ✅     |
| 7.7.1d · Support · Escalate to Senior Admin                                         | `8666:417619` | 1728×1244 | `/admin/support/SUP-10451?modal=escalate`                       | ✅     |
| 7.3.1d v2 · Platform health · Cover                                                 | `8916:100`    | 1123×794  | `/admin/report?page=1`                                          | ✅     |
| 7.3.1 v2 · Platform health · Contents                                               | `8916:119`    | 1123×794  | `/admin/report`                                                 | ✅     |
| 7.3.1 v2 · Platform health · Section opener                                         | `8916:148`    | 1123×794  | `/admin/report`                                                 | ✅     |
| 7.3.1 v2 · Platform health · Growth by region                                       | `8916:161`    | 1123×794  | `/admin/report`                                                 | ✅     |
| 7.3.1 v2 · Platform health · Trust and safety                                       | `8916:291`    | 1123×794  | `/admin/report`                                                 | ✅     |
| 7.3.1 v2 · Platform health · Talent funnel                                          | `8916:357`    | 1123×794  | `/admin/report`                                                 | ✅     |
| 7.3.1 v2 · Platform health · Quarter highlights                                     | `8916:405`    | 1123×794  | `/admin/report`                                                 | ✅     |
| 7.3.1 v2 · Platform health · How we count                                           | `8916:456`    | 1123×794  | `/admin/report`                                                 | ✅     |
