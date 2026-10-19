# Talent Settings & Account (`/settings/:section`) — Focused + Playful

> Figma file `Bin8roWL8sloyc36IgFMuT`, canvas "Talent Settings & Account" `7849:530` (≈80 frames: 39 Playful + 39 Focused + components). Created 2026-10-19. Read [talent-home.md](talent-home.md), [talent-profile.md](talent-profile.md), [talent-notifications.md](talent-notifications.md) and [playful-mode.md](playful-mode.md) FIRST — same rules: both styles in one build (Focused default, Playful ONLY via `playful:` variants), Figma-exact values (especially colours), verbatim copy, no invented copy, SVGs as NAMED components in `src/components/shared/assets.jsx`, media descriptively named under `src/assets/talent-settings/<area>/`, talent shell reuse, add-only shared edits, state chosen by URL.

## Decisions

- Owner: build **everything** in the canvas link (including the Help set). Routing confirmed: **`/settings/:section`** (section = path, states = query params). `/logged-out` is its own route.
- The profile menu, log-out confirm, help pop-over set and feedback/invite dialogs are **shell-level overlays** (opened from the talent top nav / profile chip, readable from the URL on any talent page), mounted by the talent shell — not by the settings page.
- The Help pop-over already exists (`src/components/sections/notifications/HelpPopover.jsx`, built by the notifications session, `?help=1` = "For this page"). **Extend it add-only** (new HP states); do not rewrite or restyle what exists. That session's files (`notifications/*`, `NotifButton`, the top-nav notification popover) are off-limits.
- Figma access: the REST token is rate-limited (retry ~2026-10-20); read frames through the **Figma MCP** (`get_design_context` / `get_screenshot` / `get_metadata` per node, never the whole canvas) and **sequentially, one call per frame, reusing what you extracted** — the MCP ran out of quota once after heavy use. If it answers "Rate limit exceeded", STOP, do not guess, and report which frames remain.

## State → URL → Figma frame (Playful / Focused)

| URL                                          | Frame                                          | Playful       | Focused       |
| -------------------------------------------- | ---------------------------------------------- | ------------- | ------------- |
| (start of flow)                              | HM Talent home                                 | `7857:234320` | `8110:36742`  |
| `?menu=open`                                 | PM-01 Profile menu · Open                      | `7837:222777` | `8110:37388`  |
| `?menu=language`                             | PM-02 Profile menu · Language                  | `7837:223602` | `8110:38049`  |
| `/settings/help`                             | HS-01 Help and support                         | `7857:11670`  | `8110:38737`  |
| `?dialog=feedback`                           | FB-01 Send feedback                            | `7857:12397`  | `8110:39078`  |
| `?dialog=invite`                             | IV-01 Invite a friend                          | `7857:13517`  | `8110:39766`  |
| `/settings/account`                          | ST-01 Account                                  | `7838:13009`  | `8110:44072`  |
| `/settings/privacy`                          | ST-02 Profile and privacy                      | `7840:13178`  | `8110:44376`  |
| `/settings/notifications`                    | ST-03 Notifications                            | `7841:13276`  | `8110:44736`  |
| `/settings/accessibility`                    | ST-04 Accessibility                            | `7842:13410`  | `8110:45156`  |
| `/settings/language`                         | ST-05 Language and data                        | `7843:13508`  | `8110:45536`  |
| `/settings/security`                         | ST-06 Security and sign-in                     | `7843:14250`  | `8110:45907`  |
| `/settings/data`                             | ST-07 Data and account                         | `7844:13705`  | `8110:46238`  |
| `/settings/guardian`                         | ST-08 Parent or guardian (under 18)            | `7844:14386`  | `8110:46548`  |
| `/settings/appearance`                       | ST-09 Appearance                               | `8181:1049`   | `8182:12012`  |
| `/settings/account?state=email-error`        | ST-01b Account · Email error                   | `7856:16975`  | `8110:48709`  |
| `/settings/privacy?state=hidden`             | ST-02b Privacy · Hidden selected               | `7856:17471`  | `8110:49013`  |
| `/settings/privacy?state=blocked`            | ST-02c Privacy · Manage blocked                | `7856:17956`  | `8110:49384`  |
| `/settings/notifications?state=paused`       | ST-03b Notifications · Paused for 24 hours     | `7856:18468`  | `8110:49771`  |
| `/settings/accessibility?state=unsaved`      | ST-09 Accessibility · Unsaved changes          | `7845:13903`  | `8110:50181`  |
| `/settings/accessibility?state=saved`        | ST-09b Accessibility · Saved (toast)           | `7845:14320`  | `8110:50569`  |
| `/settings/security?state=password`          | ST-06b Security · Change password              | `7856:232495` | `8110:50957`  |
| `/settings/security?state=two-step`          | ST-06c Security · Two-step code                | `7856:233046` | `8110:51322`  |
| `/settings/security?state=device-logged-out` | ST-06d Security · Device logged out (toast)    | `7856:233522` | `8110:51679`  |
| `/settings/data?state=download`              | ST-07b Data · Download requested (toast)       | `7856:233966` | `8110:52007`  |
| `/settings/data?state=paused`                | ST-07c Data · Profile paused                   | `7856:234385` | `8110:52323`  |
| `/settings/data?state=delete`                | ST-10 Delete account · Confirm                 | `7845:14732`  | `8110:52639`  |
| `/settings/guardian?state=invite`            | ST-08b Parent or guardian · Invite             | `7856:234811` | `8110:52980`  |
| `?logout=confirm`                            | LO-01 Log out · Confirm                        | `7846:14236`  | `8110:56441`  |
| `/logged-out`                                | LO-02 Logged out                               | `7846:14928`  | `8110:57103`  |
| `?help=page`                                 | HP-01 Help pop-over · For this page            | `8228:11841`  | `8230:416483` |
| `?help=searching`                            | HP-02 Help pop-over · Searching                | `8228:12878`  | `8230:417097` |
| `?help=none`                                 | HP-03 Help pop-over · No results               | `8228:13882`  | `8230:417711` |
| `?help=shortcuts`                            | HP-08 Keyboard shortcuts                       | `8228:14879`  | `8230:418325` |
| `?help=article`                              | HP-04 Help article · Recruiter asked for a fee | `8229:22097`  | `8230:419009` |
| `?help=report`                               | HP-07 Report a problem                         | `8229:22572`  | `8230:419313` |
| `?help=contact`                              | HP-05 Contact support                          | `8230:22419`  | `8230:419651` |
| `?help=sent`                                 | HP-06 Request sent                             | `8230:22926`  | `8230:419936` |
| `?collapsed=1`                               | HMc Talent home · collapsed sidebar (« toggle) | `8808:451121` | `8808:452031` |

Components section `7847:6883`: `GTH · Menu item` `7837:11115`, `GTH · Profile menu` `7837:222573`, `GTH · Help pop-over` `8226:20731`.

## File ownership (one agent per row — do not edit another row's files)

All under `src/components/sections/talentSettings/` unless noted.

| Owner      | Files                                                                                                                                                                                                                                                                                                  |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Lead       | `talentSettingsState.js`, `src/pages/talentSettings/*`, routes in `App.jsx`, this page, leak-check/route-list entries                                                                                                                                                                                  |
| Settings A | `SettingsLayout`, `SettingsAccount`, `SettingsPrivacy`, `SettingsNotifications`, `SettingsAccessibility` (+ own `SettingsA*.jsx` / `talentSettingsAData.js`): ST-01, 01b, 02, 02b, 02c, 03, 03b, 04, 09 unsaved, 09b saved toast                                                                       |
| Settings B | `SettingsLanguage`, `SettingsSecurity`, `SettingsData`, `SettingsGuardian`, `SettingsAppearance` (+ own `SettingsB*.jsx` / `talentSettingsBData.js`): ST-05, 06, 06b, 06c, 06d, 07, 07b, 07c, 10, 08, 08b, ST-09 Appearance                                                                            |
| Menu       | `ProfileMenu`, `LogoutConfirm`, `LoggedOutScreen` + shell wiring (`DashboardTopNav` profile chip, `TalentDashboardShell`, `TalentSidebar`/`TalentMobileNav` collapsed state `?collapsed=1` HMc) — add-only; mounts the shell-level overlays (profile menu, log out, feedback/invite dialogs, help set) |
| Help       | `HelpSupportPage`, `SendFeedbackDialog`, `InviteFriendDialog` + new HP states inside `notifications/HelpPopover.jsx` (add-only: HP-02..HP-08)                                                                                                                                                          |

Each section component receives `settings` (see `useTalentSettingsState`): `{ section, state, menu, logout, help, dialog, collapsed, a11yMode, update(patch) }`; `update({ key: value })` edits the URL (null removes a key). Several sessions edit the shared shell files and `assets.jsx` — keep edits small, add-only, and re-read right before each edit.

## Status (2026-10-19)

| Piece                                                                                                         | Status                                                                                         |
| ------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Routes (`/settings`, `/settings/:section`, `/logged-out`), page, state source, scope, leak check + route list | built (see verification below)                                                                 |
| All section components, overlays, help set, logged-out page                                                   | built (no stubs)                                                                               |
| Sidebar on settings pages                                                                                     | Wallet item (no destination yet) + no active item, via `SETTINGS_PAGE` in `talentShellData.js` |

### Verification (2026-10-19)

- 78 Figma frames exported and compared (framecmp): settings pages 1.5–4.4% (font metrics); overlays 6–15% because they sit on Home, which differs from the Figma HM frame; ST-06b about 20% because its Figma scrim covers only half the frame.
- Interaction click-through (14 steps: menu, language, Esc, Settings, Security + change-password dialog, Data + delete dialog, Help, feedback, invite, log out to /logged-out, help popover, collapse): all OK, no page errors.
- Responsive audit: `--only=settings` 115/115, `--only=state=top` 195/195. Leak check clean. eslint clean, build OK.
- Not run: the e2e suite and strict visual baselines.

### Known gaps / assumptions

- The Figma HM frame is Home's existing `complete` state (banner already built). Overlay URLs now use `/home?state=complete&…` instead of `state=top`.
- Wallet nav item (no destination yet) is drawn by every Home frame and the settings pages, so it shows there only (`wallet: true` in `talentShellData.js`); My Assessment, Job Postings, Skills Lab etc. do not draw it.
- Streak card matches the Focused HM frame ("This week · 3 of 6 steps done" bar); Playful keeps the quest list as in its frames. Skill-gap text ("about 88") and Messages badge (3) already matched Figma — my earlier read of the preview was wrong.
- Some settings copy/data in `helpData.js` and the section data files is invented and has not been audited against Figma.
- Home tab bar wrap fixed (generated-content labels in `TabsParts.jsx`).
