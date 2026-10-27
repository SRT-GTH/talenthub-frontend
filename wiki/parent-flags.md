# Parent flags and corrections (`/parent/wards/:id?tab=profile|flags`, `/parent/review`)

> Figma: file `SCXc457vwiq6o7d9g4jVbh`, canvas "Parent · 03 Flags and corrections" `10057:604` (persona Emma Mensah, ward Abena). Built 2026-10-27, Focused only (the Parents file has no Playful twins), frontend only (mock data in an in-memory store).
> Flow: Ward → Profile tab → Flag a field → toast; Flags tab tracks status; To review → Corrections → Check → approve or flag again.
> Consolidated into the one ward page the same day (see "Consolidation" below): Profile and Flags are tabs of `ParentWardPage`, not separate pages.

## Frames → URLs

Diff = whole-frame pixel diff vs the Figma 0.5x export at viewport = frame height − 52, measured before the consolidation (the consolidation itself was verified pixel-identical, see below). About 2–4 % is font metrics: SF Pro Rounded is not installed.

| Frame                                       | Figma id       | URL                                                              | Diff  | Status |
| ------------------------------------------- | -------------- | ---------------------------------------------------------------- | ----- | ------ |
| PW-02 Ward · Abena · Overview (context)     | `10057:616`    | `/parent/wards/abena` (Ward pages work, unchanged)               | 2.88% | ✅     |
| PW-03 Ward · Review profile (flag a field)  | `10034:4197`   | `/parent/wards/abena?tab=profile`                                | 2.20% | ✅     |
| PW-04 Flag a field (modal)                  | `10034:5128`   | `…?tab=profile&modal=flag&field=volunteering&note=<text>`        | 2.56% | ✅     |
| PW-04b Flag sent to Abena (toast)           | `10051:22618`  | `…?tab=profile&toast=flag-sent`                                  | 2.65% | ✅     |
| PW-04c Note too short (error)               | `10077:18202`  | `…?tab=profile&modal=flag&field=volunteering&note=wrong&check=1` | 2.53% | ✅     |
| PW-05 Ward · Flags tracker                  | `10034:140037` | `/parent/wards/abena?tab=flags`                                  | 2.59% | ✅     |
| PR-08 To review · Corrections tab (context) | `10057:893`    | `/parent/review?tab=corrections`                                 | 1.33% | ✅     |
| PW-06 Re-review a correction (modal)        | `10034:140801` | `…?tab=flags&modal=recheck&flag=dob`                             | 2.79% | ✅     |
| PW-06b Fix approved (toast)                 | `10051:23020`  | `…?tab=flags&toast=fix-approved`                                 | 2.42% | ✅     |
| PW-06c Flag again with a note (modal)       | `10056:923`    | `…?tab=flags&modal=flag-again&flag=dob&note=<text>`              | 3.06% | ✅     |

`sev=know|correcting|critical` and `check=1` also seed the flag dialog. The two toast URLs apply their drawn state on load (the Flags chip 3 / the Date of birth row approved), so the frames reproduce from a fresh load. The first paths, `/parent/wards/:id/profile` and `/flags`, still work: `ParentWardTabRedirect` sends them to `?tab=` and keeps every other query param.

## Interactions (exercised in a browser, 41 checks passed)

Flag button → dialog; note under 10 characters → PW-04c error and the dialog stays open; valid note → dialog closes, "Flag sent to Abena" toast, Flags chip 2→3, "Flagged by you" chip on the field; **Undo** restores. Review fix / To review **Check** → PW-06 → **Approve fix** (toast, chip 2→1, row Approved, the To review queue empties) or **Flag again** → PW-06c → row "Re-reviewing". Esc, X and scrim close dialogs. A ward other than Abena has no flags: `?tab=profile|flags` shows its overview.

## Code map

- Pages: `src/pages/parent/ParentWardPage.jsx` renders `flags/WardFlagsSection` for `?tab=profile|flags` (Abena only) and feeds the live Flags chip to `WardShell`; `ParentReviewPage.jsx` (`/parent/review`); `ParentWardTabRedirect.jsx` (old `/profile`, `/flags` paths).
- Section: `src/components/sections/parent/flags/` — `WardFlagsSection.jsx` (tab body + dialogs + toast + frame-URL seeds), `WardProfileTab.jsx`, `WardFlagsTab.jsx`, `FlagFieldDialog.jsx` (modes `field` / `again`), `RecheckDialog.jsx`, `ReviewCorrections.jsx`, `flagsStore.js` (module store + `useWardFlags`), `data/flagsData.js` (copy and mock, marked blocks).
- Shared (new): `parent/ParentTextField.jsx` — the dialogs' text field (design-system `TextInput` + the Figma helper-icon / grey-helper / value-colour overrides); `src/components/ui/UnderlineTabs.jsx` — the tab bar of the ward page and To review; `src/components/ui/DialogCard.jsx` — the modal card + `DialogCloseButton` (tone `green` | `grey`) of every parent dialog.
- Shared (extended, add-only): `wards/tabs/TabRow.jsx` got `size="roomy"` (this canvas's row: py14, #eeeee9 line, #eef4ef tile, 15/13 text, wraps); `wards/WardShell.jsx` got `reviewProfileTo` and now uses `UnderlineTabs`; `wards/data/wardsData.js` `WARD_TABS` Profile and Flags are `routed: true`.
- Reused unchanged: `ParentFrame`, `ParentButton`, `wards/WardChip` (the "Flagged by you" chip is `tone="opted"`), `wards/dialogs/ParentToast`, `wards/data/wardsData` (`WARDS`), assets `dialog-alert`, `ward-eye-off`, `wards-refresh`, `wards-check-circle` (the dialogs sit on `ui/DialogCard`, which wraps `agency/onboarding/AgencyDialog`).
- New assets (Figma exports): `src/assets/parent/flag-field.svg` (16, #575755), `flag-tile.svg` (20, #387440).

## Consolidation (2026-10-27)

Done, and proven pixel-identical: 19 URLs screenshotted before and after, the 14 pages that existed before (overview, evaluations, wallet, activity, crew, both ward dialogs, turning-18 notice, Elliot, the wards list) at **0.000 %**; my own screens differ only by the other session's "Who can find Abena" link now appearing on their header too (0.03 %).

| Was duplicated                                                                   | Now                                                                                                           |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Ward header + 7-tab bar (`FlagsWardFrame` vs `WardShell`)                        | One `WardShell`; `FlagsWardFrame` and my separate page deleted                                                |
| Three tab bars (`WardShell`, `FlagsWardFrame`, `ReviewCorrections`)              | One `ui/UnderlineTabs`                                                                                        |
| Row cards (`WardFlagsTab`, `ReviewCorrections` vs `TabRow`)                      | One `TabRow` with `size="roomy"`                                                                              |
| Flags chip count (`wardsData` 2 vs store)                                        | Abena's chip comes from `flagsStore` (`flagsBadge`); other wards keep `wardsData`                             |
| Chip / toast / button (`WardChip`, `ParentToast`, `ParentButton`)                | Already folded into `ui/StatusPill`, `ui/ActionToast`, `ui/Button` by the other sessions                      |
| Dialog card + close button (flag, re-review, Unlink, Who can find, link dialogs) | One `ui/DialogCard` + `DialogCloseButton`; `link/LinkDialogShell` is now a thin wrapper, no link file changed |

Second pass (after the Link a ward session finished): the card and close button moved from `link/LinkDialogShell` to `ui/DialogCard`; `FlagFieldDialog`, `RecheckDialog`, `UnlinkDialog` and `VisibilityDialog` use it (`focusCard={false}` so their own `data-autofocus` control keeps focus). Checked: Unlink, Who can find and Flag again are 0.000 % different, Flag a field / note error / Re-review differ by one 8×8 px box (0.001 %): **the close icon is now grey #575755 as Figma draws it (PW-04, PW-06); my first version used the green icon**. Focus lands in each dialog (input or button), Esc closes, no page errors.

Third pass, text input (decided: design-system `TextInput` with Figma overrides, "Option C"): the flag dialog note and the Unlink reason now use `parent/ParentTextField`, a thin wrapper over `ui/form/TextInput` that adds the three things the parent frames draw: the green diamond helper icon, the helper line kept grey #575755 in the error state (it stays `role="alert"`), and the typed value in ink #1c2a21 (error: red #c0392b, weight 400, as PW-04c). The error border and **dark-red shelf #922b21** come from TextInput's own error state, so **the old grey error shelf (my bug) is gone**. Focus and phone use the design-system looks (cream fill + pale-green border + dark-green shelf; flat 44px with no shelf under 768 px) instead of the green ring the dialogs had. Checked: rest and error compared with Figma PW-04 / PW-04c, `aria-invalid` and `aria-describedby` come from TextInput, the input still autofocuses and Esc still closes, 41 browser checks pass.
Known cost: TextInput's box is **52 px** tall, Figma's GTHInput is **51** (error: 1.5 px border), so each of these dialogs is 1 px taller (0.8–0.9 % whole-dialog pixel diff from the half-pixel re-centring). That is the component's own sizing, shared by every form in the app, so it was not changed here.
Not wrapped: `link/LinkField.jsx` (a field of the Link a ward search page, not a dialog, same raw shelf input) and `link/LinkCodeBoxes.jsx` (the six code boxes; the design system has `ui/form/VerificationCode`). Both are candidates for the same wrapper or component later.

Not done:

- **Toast seeds**: frame-URL seeds (`?toast=…`) live in `WardFlagsSection`; the other toasts (`visibility`, `unlinked`) use their own state. One `toast=` convention would be cleaner.

## Known gaps / assumptions (⚠️)

- **Figma inconsistencies kept**: the Flags chip is not derivable from the rows (PW-05 has two open rows and chip 2, PW-04b chip 3, PW-06b chip 1), so it is base 2 + one per send − one per approval; PW-03/04 already show Volunteering as "Flagged by you" although the flag is sent in PW-04b (the mock starts with it pending; sending again updates it); PW-03/04/04c main column starts at x 329 (1343 wide), the other frames at 343 (1329) — 1329 used; PW-04's note input is 435 wide, PW-04c's 534 — full width used.
- **Invented (⚠️ ASSUMPTION)**: the "Re-reviewing" row sub-line and its profile chip; a flag-again send reuses the "Flag sent to Abena" toast (4 s); new flags are added before the first approved flag; the To review "All" tab lists the same corrections and shows "Nothing to check here." when empty; Certificates / Evaluations / Payments tabs only log; "Review profile" opens the Profile tab (Abena); Evaluate / Unlink / Opt out only log on these tabs' header (Unlink opens its dialog from the ward page as before).
- **Header link**: the ward header's "Who can find Abena" link (the other session's ⚠️ assumption) now shows on the Profile and Flags tabs too, which Figma PW-03 / PW-05 do not draw.
- **Not verified**: Playful (none exists for this file); real backend; screen-reader pass; Playwright e2e baselines; the Elliot ward (no flags drawn).
- **Dependency**: assets and components of the Ward pages and Link-a-ward work are imported or edited add-only; they were untracked when this was built. Commit them together.
