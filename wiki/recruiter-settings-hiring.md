# Recruiter Settings · hiring side (`/recruiter/settings`: Hiring preferences, Notifications, Plan and billing, Accessibility)

> Figma: file `OHG2xsfCCskT8xEn356njv`, canvas "Recruiter - Settings & Account" `10161:75722` (persona Joel Adade Kofie, Focused only). Built 2026-11-07, frontend only (mock data, nothing is saved or sent). Owner of these four tabs: builder B (the lead owns the page frame, nav, Account / Organisation / Team / Language / Security tabs and the shell panels; see [recruiter-settings.md](recruiter-settings.md) when it exists).
> The tabs are the talent Settings blocks (`talentSettings/SettingsBUi`: `GroupCard`, `SettingRow`, `SettingsToggle`) in the recruiter style, plus `ui/Select`, `ui/form/Textarea`, `ui/TogglePill`, `ui/IconTileDialog`, `ui/Button`, the pipeline toast (`ui/BannerToast`) and talent `LiveSaveStatus`.

## Frame → URL (diff % = `framecmp.mjs`, Focused, 1728 wide, 2026-11-07; ✅ VERIFIED by reading both images side by side)

| Frame                                       | Figma id      | URL (`/recruiter/settings` + …)                                                    | Diff %     |
| ------------------------------------------- | ------------- | ---------------------------------------------------------------------------------- | ---------- |
| SR-08 Settings · Hiring preferences         | `10161:79955` | `?tab=hiring`                                                                      | 3.6        |
| SR-09 Edit automatic message · when applies | `10161:80292` | `?tab=hiring&modal=auto-message` (+ `&message=applied\|forward\|declined\|closed`) | 6.0 (1)    |
| SR-15 Hiring preferences · saved (toast)    | `10161:82009` | `?tab=hiring&toast=saved`                                                          | 4.0        |
| SR-19 Hiring paused for the organisation    | `10161:83628` | `?tab=language&hiring=paused&toast=hiring-paused` (2)                              | 3.8 to 5.2 |
| SR-10 Settings · Notifications              | `10161:80671` | `?tab=notifications`                                                               | 3.4        |
| SR-21 Notifications · paused for 24 hours   | `10161:84249` | `?tab=notifications&state=paused`                                                  | 3.5        |
| SR-11 Settings · Plan and billing           | `10161:81038` | `?tab=billing`                                                                     | 3.4        |
| SR-12 Settings · Accessibility              | `10161:81376` | `?tab=accessibility`                                                               | 3.1        |
| SR-22 Accessibility · unsaved changes       | `10161:84623` | `?tab=accessibility&state=unsaved`                                                 | 3.4        |

(1) The Figma modal is centred in the 1443px frame, ours in the 1391px viewport, so the dialog sits about 190px lower; the dialog itself matches. (2) SR-19 is drawn over the **Language and data** tab (another builder's), not over Hiring: the banner and the toast are this builder's, the page below is the Language tab. `?tab=hiring&hiring=paused` shows the same banner over Hiring. Diff numbers of SR-08 and SR-11 were measured before two small tweaks (track width cap, `md:` min-height); the dev server crashed under the shared load when re-measuring. ❓ re-run `framecmp` once the server is quiet.

## Behaviour (✅ VERIFIED: 7 Playwright tests, `tests/e2e/recruiter-settings-hiring.spec.js`)

- **Hiring**: two dropdowns (`ui/Select`, options ⚠️ invented beyond the drawn value), three switches, four automatic-message rows (Edit + switch; the row preview is truncated to one line), the Response goal dropdown. The page is a draft: any change shows "You have unsaved changes", **Cancel** restores the saved values, **Save changes** saves and goes to `?toast=saved` (toast "Success - Hiring preferences saved", X closes it).
- **Editor**: `?modal=auto-message` opens "When someone applies" on `ui/IconTileDialog`: textarea (counter inside the box), "Insert" token chips (insert `{token}` at the cursor), live preview "AS AMA SEES IT", Reset to default, Cancel / Esc / X, Save message (writes the row preview and marks the page dirty). The other three Edit buttons open the same dialog with their own title / text (`&message=`).
- **Hiring paused** (`?hiring=paused`): `HiringPausedBanner` (rendered by `RecruiterSettingsSection` above whichever tab is open) shows "Hiring is paused at Silver Rock Technology" + **Resume hiring**; `&toast=hiring-paused` shows "Success - Hiring paused" with **Undo** (resumes). `useHiringPause(settings).pause()` is the click path for the Language tab's "Pause hiring" button.
- **Notifications**: 7 rows x In app / Email / SMS as real switches, Quiet hours switch; Save stays grey until something changes; after Save a "Saved" line; `?state=paused` shows the blue banner with **Resume now**.
- **Plan and billing**: static mock (`BILLING` in `hiring/hiringData.js`); usage bars are `role="progressbar"` (width = used / limit, capped at the drawn 240px track). Buttons only log.
- **Accessibility**: Focused-mode banner (no Playful option), Text size pills (`TogglePill` as radios), 3 + 2 switches. Draft model as Hiring; `?state=unsaved` follows the dirty flag (replace navigation) and loads with High contrast on.

## Code map

- Tabs: `recruiterSettings/tabs/{HiringTab,NotificationsTab,BillingTab,AccessibilityTab}.jsx`.
- `recruiterSettings/hiring/`: `hiringData.js` (all copy verbatim + mock payloads + the URL-key table), `hiringIcons.jsx` (Figma exports as currentColor components), `SettingsBanner.jsx`, `SettingsFooter.jsx` (Cancel / Save, hint, grey Save), `AutoMessageDialog.jsx`, `HiringPausedBanner.jsx`, `useHiringPause.js`.
- Existing files touched (add-only, defaults unchanged): `talentSettings/SettingsBUi.jsx` (`GroupCard`, `SettingRow` and `SettingsToggle` take `recruiter` = Figma "Card / Setting / Toggle" look; `SettingsToggle` also `disabled`); `recruiterSettings/RecruiterSettingsSection.jsx` (one import + `<HiringPausedBanner settings={settings} />` above `<Tab />`).
- Reused unchanged: `ui/Select` (+ `ArrowheadDownIcon`), `ui/form/Textarea` (`counterInside`), `ui/TogglePill`, `ui/IconTileDialog`, `ui/Button`, `applicationPipeline/actions/PipelineToast` (the "Component 31" success toast), `talentSettings/LiveSaveStatus`, `TextAction`.
- Assets: none exported as files; the seven icons live in `hiringIcons.jsx` (node ids in its header).

## ⚠️ Assumptions (invented to finish the flow)

- ⚠️ **SR-08 loads dirty**: the frame shows "You have unsaved changes" with "When a role closes" off, and SR-15 (after saving) shows it still off. So the saved baseline has it on and a fresh load holds that one unsaved change; `?toast=saved` loads everything saved. Cancel therefore turns it back on.
- ⚠️ Dropdown options beyond the drawn values (locations, screenings, reply times).
- ⚠️ The editors of "move forward / not progressing / role closes" are not drawn: same dialog, title and text = the row's own copy, subtitle written in the drawn style. `{stage}` sample "Interview", `{company}` sample "Silver Rock Technology".
- ⚠️ **Pause for 24 hours** link (bottom left of the Notifications footer) is the only click path into SR-21; no control is drawn.
- ⚠️ "Saved" line after Save on Notifications / Accessibility (nothing drawn); the saved toast of Hiring uses no auto-dismiss (stays until X, like the pipeline toasts).
- ⚠️ Hiring pause is a global URL flag (`hiring=paused`), shown on every tab.

## Figma inconsistencies

- Kept as drawn: SR-12's Focused-mode banner is 71px high (17px title line) and SR-22's 78px (24px); we switch with the unsaved state (a 7px jump). The invoice "Download" glyph is the layer "Icon/upload" and points up. The 2nd invoice's "Paid" is #165d3a, the others #2a5730. The usage track is #fefefe (invisible on the white card). The unsaved-save button is 139px wide (sm), the disabled one 159px (md): we follow both.
- NOT reproduced: SR-09's counter says "152 / 600" under a 147-character text; ours shows the real count (147 / 600). This is the one verbatim miss.
- "When a role closes" draws its Edit link 12px closer to the switch than the other three rows; ours is consistent.

## Not drawn (not built)

Invoice file / preview (Compare plans, Upgrade and Change payment method now hand off to the onboarding plan / payment screens, see [recruiter-settings.md](recruiter-settings.md); no checkout is drawn in Settings), usage-limit warnings, notification time pickers for Quiet hours, any toast for Notifications / Accessibility saves, the Accessibility effects themselves (nothing is applied to the page), Hiring pause entry on the Hiring tab (the "Pause hiring" card is drawn on Language and data only).

## Not verified

Playful (does not exist for these frames); a screen-reader pass; widths 320 / 390 / 1024 / 1440 scripted for overflow, text under 12px and targets under 24px on all ten URLs (320 and 390 complete, 1024 and 1440 printed no problem but the run may have been cut by its timeout).
