# Parent · Settings and account (`/parent/settings`)

> Figma: file `SCXc457vwiq6o7d9g4jVbh`, canvas "Parent · 11 Settings and account" `10057:67440` (persona Emma Mensah). Built 2026-10-28, **Focused only** (the Parents file has no Playful twins), frontend only (mock data, nothing is saved).
> The page frame is the talent Settings layout (`talentSettings/SettingsLayout`) given the parent's nav list, with the talent Settings building blocks (`GroupCard`, `SettingRow`, `SettingsToggle`, `SettingsACheckbox`, `DeleteAccountButton`) inside the parent chrome (`ParentFrame`).

## Frame → URL (✅ VERIFIED by `framecmp.mjs`, Focused, 2026-10-28)

| Frame                                            | Figma id       | URL (`/parent/settings` + …)                | Diff % |
| ------------------------------------------------ | -------------- | ------------------------------------------- | ------ |
| PS-01 Settings · Account (parent)                | `10046:1670`   | (none) or `?tab=account`                    | 3.1    |
| PS-02 Settings · Your roles (parent and talent)  | `10046:2250`   | `?tab=roles`                                | 2.4    |
| PS-03 Settings · Notifications (parent)          | `10046:2778`   | `?tab=notifications`                        | 2.9    |
| PS-04 Settings · Security and sign-in (parent)   | `10046:3404`   | `?tab=security`                             | 2.6    |
| PS-05 Settings · Data and account (parent)       | `10046:3910`   | `?tab=data`                                 | 3.0    |
| PS-06 Log out (confirm) — over the Account tab   | `10053:4105`   | `?modal=logout`                             | 2.2    |
| PS-06b Logged out                                | `10056:157278` | `?state=logged-out`                         | 1.0    |
| PS-07 Close parent account (confirm) — over Data | `10053:4444`   | `?tab=data&modal=close-account&confirm=CLO` | 3.7    |
| PS-07b Parent account closed                     | `10056:157684` | `?state=closed`                             | 0.8    |

Diff % = whole-frame pixel difference vs the Figma 0.5x export (SF Pro Rounded, `GTH Parent Rounded`, scoped by `ParentFrame`). The worst cells are the top bar (shell) and the button rows: our buttons are about 4 px wider than Figma's (a glyph-width difference; `ui/Button` already uses Figma's 0.1 px tracking). Dialogs, the busy Notifications matrix and the Account form were also compared by eye against the Figma exports.

## Behaviour (real browser: 18 Playwright tests, 0 console errors)

- **Section nav** (280px card): Account · Your roles · Notifications · Security and sign-in · Data and account switch the tab (URL `?tab=`). **Log out** opens the confirm dialog; **Stay**, the X and Esc close it; **Log out** goes to `?state=logged-out`, whose **Log in again** goes to `/login`.
- **Account**: six editable fields (Email and Phone keep the verified green border); Cancel restores the drawn values; Save only logs. "Your roles" link → the Roles tab.
- **Your roles**: four radio cards (Parent view chosen, chip "Now"), four switches, Manage → `/parent/wards`.
- **Notifications**: 7 × 4 checkbox matrix, quiet-hours switch and two time pickers (native `<select>` laid over the pill), weekly-summary switch.
- **Security**: two-step switch (the "On" chip follows it), **Log out** on a device removes its row, "Log out of all other devices" removes the rest and then disappears.
- **Data and account**: "Close parent account" opens the confirm dialog; the red button stays disabled until the box reads `CLOSE`; confirming goes to `?state=closed`; **Undo within 30 days** returns to `?tab=data`; **Go to My career** → `/home`.
- The typed word lives in the URL (`confirm=`), so PS-07 reproduces from a fresh load.

## Code map

- Page: `src/pages/parent/ParentSettingsPage.jsx` → `components/sections/parent/settings/SettingsPage.jsx`; route `settings` in `ParentApp.jsx` (lazy import + one `<Route>`).
- `parent/settings/`: `settingsState.js` (URL hook, reads the live address bar like `review/reviewState.js`), `data/settingsData.js` (all copy verbatim), `AccountTab`, `RolesTab`, `NotificationsTab`, `SecurityTab`, `DataTab`, `LogoutDialog`, `CloseAccountDialog`, `SettingsResult` (PS-06b / PS-07b).
- Reused unchanged: `ui/DialogCard` (+ `DialogCloseButton`), `ParentButton`, `ParentTextField` (`verified`), `ui/Button` (`size="sm"` is the 139×48 "Save changes"), `talentSettings/SettingsBUi` (`GroupCard` incl. the red `danger` card, `SettingRow`, `SettingsToggle`, `StatusPill`, `TextAction`, `DeleteAccountButton`), `SettingsAUi.SettingsACheckbox`, shared icons.
- Shared files touched (**add-only, defaults unchanged**): `talentSettings/SettingsLayout.jsx` — optional `items`, `hrefFor(item)`, `onLogout` props (talent pages pass none); `parent/ParentFrame.jsx` — optional `dimSidebar` (the sidebar at 35 % opacity, not clickable, as PS-06b / PS-07b draw it); `pages/parent/ParentApp.jsx` — the route.
- Assets (`src/assets/parent/`, Figma exports): `settings-spot-wrong.svg` (the 80px spot of PS-07), `settings-warning.svg` (the amber warning rows). Reused: `spot-sent.svg` (PS-06b), `spot-settings.svg` (PS-07b; same "Spot · Settings" the Link flow exported).

## Known gaps / assumptions

- ✅ VERIFIED 2026-10-28: `errscan.mjs` on all 9 URLs (both styles, 1728 and 390 wide) printed "scan clean": no crash, blank page, redirect or console error.

- ⚠️ ASSUMPTION: **Accessibility** and **Language and data** have no parent frame in this canvas, so `?tab=accessibility|language` render the talent sections (`SettingsAccessibility`, `SettingsLanguage`) inside the parent layout (2026-11-22, ✅ VERIFIED in browser).
- ⚠️ ASSUMPTION: Save changes, Change photo, Disconnect, Request download, Download PDF and "Turn everything off for 24 hours" only log — no screen is drawn for them (the talent Settings draw a paused state, ST-03b; the parent canvas does not).
- ⚠️ ASSUMPTION: the enabled "Close parent account" button is the standard green primary (Figma draws only the grey disabled one) and the CLOSE match is exact and upper case.
- ⚠️ ASSUMPTION: "Log in again" → `/login`, "Go to My career" → `/home`, "Undo within 30 days" → back to Data and account (no restored state is drawn).
- Figma inconsistencies kept as drawn: the PS-07b body has a double space ("change your mind log in"; kept with `white-space: pre-wrap`); the PS-02 "Now" chip layer is named "Recommended"; the "Your roles" nav icon layer is named shield but draws the users glyph (we use users); layer names across the canvas are copied from the talent Settings frames (no effect on the build).
- Not verified: Playful (does not exist for this file); `npm run test:e2e` for the whole suite and the `test:visual` baselines (not run; only the new spec, 18 tests); a screen-reader pass; the **talent** `/settings/*` pages after the `SettingsLayout` edit were only spot-checked (Security and Notifications render the 9-item nav with the right active item; `/settings/account?demo=1` redirected to `/login` in the run, an auth redirect that was not investigated and does not go through the changed props).

## Consolidation candidates

1. `AccountTab` / `NotificationsTab` / `SecurityTab` / `DataTab` here ≈ talent `SettingsAccount` / `SettingsNotifications` / `SettingsSecurity` / `SettingsData` (same layout, different copy and no live API): one section component taking a config would cover both. The talent ones are tied to the live settings API, so they were not touched.
2. `RoleOption` (radio card) ≈ `SettingsPrivacy.VisibilityOption` (same markup) → export one `RadioCard` from `SettingsAUi`.
3. `TimePill` ≈ the one inside `SettingsNotifications` (not exported) → export and share.
4. `SettingsResult` card ≈ `link/LinkWardSent` card (white r24, hairline, soft shadow, spot, title, body, buttons) → one `ParentCard`.
5. `LogoutDialog` / `CloseAccountDialog` ≈ `talentSettings/LogoutConfirm` / the delete dialog (same anatomy, parent copy) and `DialogCard` users in `flags` / `link`.

- ⚠️ ASSUMPTION (2026-11-22): **Change password** opens the talent `ChangePasswordDialog`; demo only (no API call), submitting closes it and, when "log out other devices" is ticked, removes the other device rows.

## Live wiring and inspection (2026-11-25, phase parent-more)

Staging probe (unauthenticated: 401 = route exists, 404 = none): the generic account endpoints exist and act on whoever is signed in; nothing parent-only exists for roles, the ward PDF, "take a break" or closing only the parent role.

- ✅ VERIFIED (code + browser with a fake session): signed in and not a frame URL (`useParentLiveMode`), `SettingsPage` runs the talent `useLiveSettings` hook and passes `settings.live` to every tab; while it loads / fails the tab shows the shared `talentSettings/LiveSettingsStatus` (moved out of `TalentSettingsPage`, now one component for both pages).
- **Account**: GET `/settings/overview` fills the six fields; Save sends only changed fields to PUT `/settings/account` (helpers in `settings/settingsLive.js`); email and date of birth are read-only with a hint; "Saved" / error line (`LiveSaveStatus`). Demo Save now shows "Saved" (was log-only). 🔶 LIKELY works for a parent (same backend service) — needs a signed-in parent check.
- **Notifications**: GET / PUT `/settings/notifications` with the parent row ids (`approvals, milestones, flags, activity, links, turning18, news`), quiet hours and weekly; "Turn everything off for 24 hours" sends `pause` (then "Resume now"). 🔶 LIKELY: whether the backend keeps parent row ids is not checked.
- **Security**: sessions from the overview, Log out per device (DELETE `/settings/sessions/:id`), Log out of all other devices (POST `/settings/sessions/revoke-others`), Change password (POST `/settings/password`, the talent dialog in live mode), two-step = shared `TwoStepSettingsRow` (`/security/2-step`), Google row hidden (as on the talent page).
- **Data**: Request download = GET `/settings/export` (JSON download; the drawn ZIP-by-email is not what the backend does). Download PDF and "Pause non-urgent notifications" have no endpoint (log / local only).
- **Close parent account**: no endpoint closes only the parent role (`/settings/deactivate` turns the whole account off, My career too). ⚠️ ASSUMPTION: live, the confirm shows "Closing a parent account is not available online yet. Ask us from Help…" and nothing is closed; demo keeps PS-07b.
- **Log out** (bug fixed): it used to show PS-06b without ending the session. Now POST `/users/logout` (waits at most 3 s), clears the local tokens, resets the parent store, then `?state=logged-out`; "See you soon, <first name>" when signed in.
- **Accessibility / Language**: their own `state` is stored as `sstate` (`settingsState.sectionUpdate`), because any `?state=` turns `/parent/*` into a design frame and would drop live mode mid-edit. With live settings they save through `/settings/preferences`.
- Figma prototype links (canvas JSON `transitionNodeID`, read 2026-11-25): nav items → their tabs, Log out → PS-06, Close parent account → PS-07, PS-06 → PS-06b, PS-07 → PS-07b. All match the app ✅ VERIFIED.
