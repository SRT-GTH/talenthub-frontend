# Recruiter Settings & Account — overview (Figma "Recruiter - Settings & Account")

> Figma: file `OHG2xsfCCskT8xEn356njv`, canvas `10161:75722`, 38 frames at 1728 wide, **Focused only** (no Playful), built 2026-11-07, frontend only, mock data, persona Joel Adade Kofie. `🔗 EXTERNAL`
> The canvas is "converted 1:1" from the talent Settings and Help screens: the talent Settings frame (`talentSettings/SettingsLayout`) and the talent Help pieces, with recruiter nav, copy and data, inside the recruiter workspace shell. ✅ VERIFIED

## Architecture

- Route `/recruiter/settings` (`?tab=account|organisation|team|hiring|notifications|billing|accessibility|language|security`) → `pages/recruiterSettings/RecruiterSettingsPage.jsx` → `recruiterSettings/RecruiterSettingsSection.jsx`: `DashboardShell` with the workspace rail (`WorkspaceSidebar showSettings settingsActive`) + `SettingsLayout` (additive `heading`, `subheading`, per-item `Icon` / `chipClassName`) + the tab. URL state: `useRecruiterSettingsState()` (`tab`, `section`, `modal`, `state`, `get`, `update`); every other key belongs to the tab that reads it. Nav in `recruiterSettingsData.js`; the four glyphs the talent set lacks (building, briefcase, credit-card, accessibility) are exported from Figma in `settingsNavIcons.jsx`.
- Route `/recruiter/help` (R-HS-01 and the article / report / contact / sent views, `?help=article|report|contact|sent`).
- Top bar (`DashboardTopNav`, additive `panels` slots, inert unless passed): `onHelp` / `helpOpen` / `help` (the "?" and its pop-over, `?help=page|searching|none|shortcuts`) and `onProfile` / `profileOpen` / `profileMenu` (the profile chip menu, `?menu=open`). `help/useRecruiterHelpPanels.jsx` returns the help fields for any recruiter page; it is wired into `/recruiter/settings` and `/recruiter/job-postings` (where R-HP-01…08 are drawn). `?modal=feedback|invite` open the feedback / invite dialogs.
- Shared additions (add-only, talent defaults unchanged): `ui/RecruiterSettingsCard.jsx`; `recruiter` props on `SettingsBUi` (`GroupCard`, `SettingRow`, `SettingsToggle`); `data` / `copy` props on the talent help components; `MenuItem` / `Divider` exports in `ProfileMenu`; `useMyRequests({ enabled })`.
- No recruiter surface calls the talent home API (its 401 redirects to `/login`; see [recruiter-community.md](recruiter-community.md)). Regression: `recruiter-no-login-bounce.spec.js` (14 URLs incl. the Settings and Help ones).

## Areas (frame → URL tables, diff %, assumptions, inconsistencies are in each page)

| Area                                                    | Frames                                            | Page                                                             | Spec                                      |
| ------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------- |
| Account, Organisation, Team (invite, role menu, remove) | SR-01…07, SR-20 (2.8-5.5 %)                       | [recruiter-settings-account.md](recruiter-settings-account.md)   | `recruiter-settings-account.spec.js` (17) |
| Hiring, Notifications, Plan and billing, Accessibility  | SR-08…12, 15, 19, 21, 22 (3.1-6.0 %)              | [recruiter-settings-hiring.md](recruiter-settings-hiring.md)     | `recruiter-settings-hiring.spec.js` (7)   |
| Security, Language and data, profile menu, logout       | SR-13, 14, 16, 17, 18, 23-27 (0.3-6.3 %)          | [recruiter-settings-security.md](recruiter-settings-security.md) | `recruiter-settings-security.spec.js` (8) |
| Help pop-over, feedback, invite, Help and support       | R-FB-01, R-IV-01, R-HS-01, R-HP-01…08 (2.3-7.0 %) | [recruiter-settings-help.md](recruiter-settings-help.md)         | `recruiter-settings-help.spec.js` (10)    |

## Lead verification 2026-11-07

- Whole canvas re-measured by the lead with `framecmp` (27 Settings frames, Focused): 0.3-6.3 %, the rest is shell, font metrics and dialog centring (Figma centres dialogs in a taller frame). SR-18 read 16.4 % until the Figma export was found truncated (a network drop cut the PNG at 204,800 bytes); re-exported it reads 3.7 %. SR-05/06/07/17/19 first read as cold-load loaders and passed on rerun.
- Specs: account 17 + hiring 7 + security 8 + help 10 + bounce 14 pass; `parent-settings` (shares the talent Settings blocks) 18/18.
- Responsive gate (320/390/1024/1440): 28 Settings + 11 Help/job-postings URLs, all pass; one talent `/settings/language` flake at 320 passed on rerun.
- eslint clean, prettier clean on every new/edited file, `npm run build` passes.

## Known gaps / Figma inconsistencies

- Top bar still reads "Kofi A." and the talent search placeholder (Figma: "Joel K."); the rail card reads "Kwame Asante" on the Settings frames and "Joel Adade Kofie" on the help frames (Figma itself differs between frames). Shared recruiter shell: left alone. ⚠️ needs a decision.
- Ask Hiring Assistant, WhatsApp us, Replay the recruiter tour, Compare plans, Upgrade, Change payment method, invoice downloads, Leave organisation, "Preview as talent" have no destination drawn and only log.
- SR-19 "hiring paused" is drawn over Language and data; the pause state is a URL flag shown on every tab.
- The pop-over and the "?" button are hidden below lg by the shell, so the pop-over was not exercised at phone width.
- Counters drawn with a wrong number ("152 / 600", "82 / 500", "0 / 1000") count live; every other string is verbatim.
- Not verified: hover and focus states, a real screen reader, a live backend, a manual browser session (the Playwright MCP browser was busy; scripted specs and the audit stood in).
