# Parent who is also a talent — switching spaces (parent side)

> Figma: file `SCXc457vwiq6o7d9g4jVbh`, canvas "Parent · 12 Parent who is also a talent" `10057:67476` (persona Emma Mensah). Built 2026-10-28, **Focused only**, frontend only (mock data). All five frames are built: the parent-side ones and the My career (talent home) ones, TC-01 / TC-02, as an add-only `?as=emma` persona of the existing `/home`.

## Frame → URL (✅ VERIFIED by `framecmp.mjs`, Focused, 2026-10-28)

| Frame                                                     | Figma id       | URL                                        | Diff % | Status                         |
| --------------------------------------------------------- | -------------- | ------------------------------------------ | ------ | ------------------------------ |
| PD-02 Parent view · Switch space menu open                | `10036:142250` | `/parent?menu=switch`                      | 3.4    | ✅                             |
| PD-04 Build my own career profile (no talent profile yet) | `10037:5838`   | `/parent?career=none&modal=career-profile` | 4.4    | ✅                             |
| PN-02 Notifications · both spaces (Parent + My career)    | `10037:4551`   | `/parent?notif=open&spaces=both`           | 5.0    | ✅                             |
| PS-02 Settings · Your roles (context)                     | `10057:67503`  | `/parent/settings?tab=roles`               | 2.4    | ✅ built in parent-settings.md |
| TC-01 My career · Emma’s talent home (Discoverable)       | `10036:531`    | `/home?as=emma`                            | 7.7    | ✅                             |
| TC-02 My career · Switch space menu open                  | `10036:142934` | `/home?as=emma&menu=switch`                | 7.0    | ✅                             |

Diff % = whole-frame pixel difference vs the Figma 0.5x export. PD-04's hot cells are the dialog button row (our buttons are about 4 px wider than Figma's; known, see parent-settings.md). `?career=none`, `?menu=switch` and `?modal=career-profile` work on **any** parent page (read by `ParentFrame`).

## Behaviour (real browser: 10 Playwright tests in `tests/e2e/parent-spaces.spec.js`, errscan clean, build passes)

- The persona card's chevron and "Parent view · tap to switch" are buttons that open the **Switch space** menu (a portal beside the card, `role=menu`, Esc / outside click close it). **Parent view** (checked) only closes it; **My career** goes to `/home?as=emma` (the talent home, which does not yet honour `as=emma`).
- With `?career=none` the card reads "Parent view" (no switch), the sidebar switch card is "Your own career / Learn, get verified and get matched / Build my profile", and that button opens **Build your own career profile**; **Not now** / X / Esc close it; **Start with Career Buddy** goes to `/home?as=emma&new=welcome` (⚠️ ASSUMPTION: the first-login welcome of the talent home).
- The bell panel with `?spaces=both` has the filter chips (All · 7 / Parent · 5 / My career · 2, they filter), a space chip on every row and the two My career rows on top; rows open `/home?as=emma` (career) or the same screens as PN-01 (parent). Without `spaces=both` it is the PN-01 panel, unchanged.

## Code map

- `parent/switch/`: `switchData.js` (copy, verbatim), `SwitchSpaceMenu.jsx`, `CareerProfileDialog.jsx`.
- Shared files touched (**add-only, defaults unchanged**): `ParentSidebar.jsx` (optional `career`, `onSwitch`, `onBuildCareer`, `cardRef`), `ParentFrame.jsx` (reads `menu` / `career` / `modal=career-profile`, renders the menu and dialog), `notifications/NotificationsPanel.jsx` (optional `both`; the Notifications session owns it).
- Assets (`src/assets/parent/`): `switch-check`, `switch-user`, `switch-shield`, `switch-spot-profile`, `spaces-users`, `spaces-user` (Figma exports). Reused: `emma.webp`, `notif-user.svg`.

## The talent side (TC-01 / TC-02): one `/home`, a persona layer

There is still **one** talent home. `?as=emma` makes `useTalentHomeState` show the Discoverable demo state (HM-02) with Emma's details; without it nothing changes (a test checks Kofi's `/home?state=discoverable` still has his name, jobs and "Job Postings").

- `talentHome/emmaPersona.js`: `EMMA` (profile, nav labels "Opportunities" / "Clubs", streak 1, chip, "Parent view · 4 to review →", banner copy) and `EMMA_CONTENT` (hero "Emma", the three Ecobank / Fidelity / mPharma roles, the Career Buddy line). All verbatim from the frames.
- Add-only edits (optional `persona` parameter or `home.persona`, defaults unchanged): `talentHomeState.js` (reads `as=emma`, returns `persona`), `talentShellData.js` (`getTalentProfile`, `getTalentNavData`), `TalentSidebar.jsx` (Emma's photo, a switch chevron, the "Parent view · 4 to review →" link, nav labels, the menu), `dashboard/DashboardTopNav.jsx` (the "My career" chip, Emma's name and photo, no live streak), `pages/talentHome/TalentHomePage.jsx` (the banner), new `talentHome/SpaceBanner.jsx`.
- `SwitchSpaceMenu` got `offset` and `parentChip` props; TC-02 opens it (`&menu=switch`) with My career checked and a "4 to review" chip on Parent view; the banner is hidden while it is open (TC-02 draws none).
- Remaining diff (7–8 %) is mostly the base HM-02 layout: the Figma journey and hero cards are a few px taller than the existing build, which shifts everything below; not specific to Emma.

## Known gaps / assumptions

- ⚠️ ASSUMPTION: "Start with Career Buddy" goes to `/home?as=emma&new=welcome` (the first-login welcome); the My career row and the career notification rows go to `/home?as=emma`.
- ⚠️ ASSUMPTION: the switch menu is only offered when the parent has a career profile (not with `?career=none`).
- ⚠️ ASSUMPTION: Emma's avatar is the parent photo `emma.webp` (the frames draw a photo); the Playful style of this home with `as=emma` was not checked (the Parents file has none). `tests/e2e/home.spec.js` (landing page hero) fails today; it does not touch these files.
- Not verified: Playful (does not exist for this file); the whole `test:e2e` suite and visual baselines; a screen-reader pass.

## Consolidation candidates

1. `SwitchSpaceMenu` (parent) and the talent profile menu / `ProfileMenu.jsx` are both account-space popovers: one component with a config would cover both once TC-02 exists.
2. The space chips in `NotificationsPanel` ≈ `ui/StatusPill` / `WardChip` pill styles.
3. `CareerProfileDialog` ≈ the other parent dialogs (`DialogCard` + spot + points card): the points card repeats in `settings/CloseAccountDialog`.
