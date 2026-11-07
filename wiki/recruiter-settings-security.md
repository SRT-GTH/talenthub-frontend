# Recruiter Settings · Security, Language and data, profile menu, log out (`/recruiter/settings`)

> Figma: file `OHG2xsfCCskT8xEn356njv`, canvas "Recruiter - Settings & Account" `10161:75722`, Focused only, persona Joel Adade Kofie. Frontend only, mock data. Built 2026-11-07. Confidence tags per `INDEX.md`.

## Frame → URL (diff % = framecmp / own run vs the 0.5x export, 1728 wide; ✅ VERIFIED 2026-11-07)

| Frame                           | Figma id      | URL (`/recruiter/settings` + …)                       | Diff %                                                                    |
| ------------------------------- | ------------- | ----------------------------------------------------- | ------------------------------------------------------------------------- |
| SR-13 Security and sign-in      | `10161:81691` | `?tab=security`                                       | 3.4–4.3                                                                   |
| SR-23 Change password           | `10161:84939` | `?tab=security&modal=change-password`                 | 5.8–6.3                                                                   |
| SR-24 Two-step code             | `10161:85278` | `?tab=security&modal=two-step`                        | 5.1–5.7                                                                   |
| SR-25 Device logged out (toast) | `10161:85618` | `?tab=security&toast=device-logged-out`               | 3.9–4.8                                                                   |
| SR-26 Delete recruiter account  | `10161:85946` | `?tab=security&modal=delete-account[&confirm=DELETE]` | 6.1–6.6                                                                   |
| SR-17 Language and data         | `10161:83001` | `?tab=language`                                       | 3.1–4.1                                                                   |
| SR-18 Export requested (toast)  | `10161:83309` | `?tab=language&toast=export-requested`                | 3.8                                                                       |
| SR-14 Profile menu              | `10161:82623` | `?menu=open` (any tab; frame draws the Account tab)   | 2.9–3.8                                                                   |
| SR-16 Log out · confirm         | `10161:82353` | `?modal=logout`                                       | 3.1 (behind = Account tab built by another builder; Figma draws it empty) |
| SR-27 Logged out                | `10161:86281` | `?state=logged-out`                                   | 1.2                                                                       |

Where the number is a range: framecmp and the own run (`ours` screenshot at viewport = frame height − 52) differ by font load timing. The dev-only bottom bar ("Onboarding / Profile Filling …") is part of every diff. The dialogs differ mainly by position: Figma centres SR-23/24/26 over the main column (x centre 994–1008) and vertically in the 1132 frame incl. the 52px toolbar; we centre in the viewport (✅ crops of the dialog interiors were compared side by side and match).

## Behaviour (✅ VERIFIED by `tests/e2e/recruiter-settings-security.spec.js`)

- **Security**: Change password (dialog, seeded with the drawn dots; Update needs current + strong new (12+, number, symbol) + matching confirm; mismatch line; submit → toast), Manage → code dialog (6 boxes, paste / Backspace / arrows, Verify needs six digits, resend countdown from 0:42), SSO switch, device "Log out" removes the row (`removed=` in the URL) and shows the toast, Delete account → dialog needing the typed `DELETE` (in the URL as `confirm=`), "Go to Team and roles" → `?tab=team`, confirming → `?state=logged-out`.
- **Language and data**: three `ui/form/Select` dropdowns, Export CSV / Request download → SR-18 toast, Pause hiring → `useHiringPause().pause()` (hiring builder: banner + toast on every tab).
- **Profile menu**: Esc / outside click close; arrows / Home / End move; Settings / Accessibility / Language switch tab; Help = `?help=page`; Send feedback = `?modal=feedback`; Invite = `?modal=invite`; Log out = `?modal=logout`.
- **Log out**: Stay / Esc / scrim close; Log out → `?state=logged-out`, rendered instead of the shell; Log back in → `/login`.

## Code map

- `tabs/SecurityTab.jsx`, `tabs/LanguageTab.jsx`, `RecruiterLogoutDialog.jsx`, `RecruiterLoggedOut.jsx`, `RecruiterProfileMenu.jsx`.
- `security/`: `securityData.js` (all copy verbatim + URL contract), `SettingsParts.jsx` (recruiter card / row / switch / chips / links / `ToastText`), `SettingsIcons.jsx` (Figma exports, `currentColor`), `ChangePasswordDialog.jsx`, `TwoStepDialog.jsx`, `DeleteAccountDialog.jsx`.
- Reused: `ui/IconTileDialog` (SR-23), `ui/CenteredIconDialog` (SR-16/24/26), `ui/Button`, `ui/form/TextInput` + `Select`, `applicationPipeline/actions/HintCheckbox` and `PipelineToast` (`ui/BannerToast`), `dashboard/DashboardPageBackground`, `talentSettings/ProfileMenu` rows.
- Shared files touched (add-only): `talentSettings/ProfileMenu.jsx` exports `MenuItem` and `Divider`; `MenuItem` has an optional `danger` prop (red label). Talent output unchanged.
- No raster assets (all icons are SVG components).

## ⚠️ Assumptions (not drawn)

- "Manage" opens the code step; the toasts after Update password and after Verify (`Success - Password updated`, `Success - Two-step verification confirmed`); the weak-password helper and the mismatch line; seed passwords; confirming delete → logged-out; "Leave organisation" only logs; SSO switch only flips.
- Dropdown option lists (only the selected value is drawn): App language {English (Ghana)}, Assistant {English}, retention {6, 12, 24 months}.
- Both Export CSV and Request download raise the SR-18 toast.
- Profile menu: View my recruiter profile, Preview as talent, Privacy, Terms only close the menu; View applicants → `/recruiter/application-pipeline`; Saved talents → `/recruiter/talent-search`.
- Log back in / Not Joel → `/login`.

## Figma inconsistencies kept as drawn

- SR-25: the toast says Windows · Edge was logged out, yet the frame still draws its row (fresh load of the URL keeps it; the interactive log-out removes the row).
- SR-24 / SR-26 buttons are 48px high; page buttons 40px.
- Invite row reads "Invite a friend" and "+50pts" in the recruiter menu (brief called it "Invite a teammate"; text kept verbatim).
- SR-23 helper glyph (a green diamond, nested `20-alert`) exports NO IMAGE; the shared `Field` helper glyph (circle alert) is used.
- Dialogs are viewport-centred (Figma offsets them, see above).

## Not verified

Screen-reader pass; the visual regression suite; Playful (none exists); the Account tab behind SR-14 / SR-16 is another builder's.
