# Recruiter Settings · Account, Organisation, Team and roles (`/recruiter/settings`)

> Figma: file `OHG2xsfCCskT8xEn356njv`, canvas `10161:75722`, Focused only, built 2026-11-07, mock data. `🔗 EXTERNAL`
> Tabs `account`, `organisation`, `team`; the shell, nav and other tabs belong to the lead / other builders.

## Frame → URL (framecmp, 0.5x export; ⚠️ the dev server was overloaded, so several runs returned the cold-loader screenshot)

| Frame                            | Figma id      | URL (`/recruiter/settings` + …)                                 | Diff %                                   |
| -------------------------------- | ------------- | --------------------------------------------------------------- | ---------------------------------------- |
| SR-01 Account                    | `10161:77483` | (none) or `?tab=account`                                        | 3.2 ✅                                   |
| SR-20 Account · work email error | `10161:83955` | `?tab=account&state=email-error`                                | 4.4 (loader frame, not a real result) 🔶 |
| SR-02 Organisation               | `10161:77780` | `?tab=organisation`                                             | 3.0 (loader frame, not a real result) 🔶 |
| SR-03 Team and roles             | `10161:78103` | `?tab=team`                                                     | 2.8 ✅                                   |
| SR-04 Invite teammate            | `10161:78453` | `?tab=team&modal=invite-teammate&email=ama.k%40silverrock.tech` | 5.5 ✅                                   |
| SR-05 Invite · role menu open    | `10161:78832` | same + `&role=open`                                             | not measured (loader) ❓                 |
| SR-06 Invite sent toast          | `10161:79229` | `?tab=team&toast=invite-sent`                                   | 4.4 ✅                                   |
| SR-07 Remove teammate confirm    | `10161:79590` | `?tab=team&modal=remove-teammate&member=efua`                   | 5.3 ✅                                   |

## URL keys (also at the top of `account/accountData.js`)

`state=email-error` · `modal=invite-teammate` (NOT `modal=invite`: the Help builder owns that) · `modal=remove-teammate&member=<id>` · `email=` (seeds the invite address) · `role=open` · `toast=invite-sent|invite-resent|invite-cancelled|member-removed` + `to=` · `row=<memberId>` (open "…" menu).

## Behaviour

- Account: editable fields, Save enabled when dirty and valid; a non-`@silverrock.tech` work email flips the URL to `email-error`. The photo block layout (SR-01 inside "Personal details" vs SR-20 as a row in "Account type") is chosen from the URL at load.
- Organisation: DS TextInput / Select / Textarea, counter shows the real length; logo upload previews locally.
- Team: role select per row (portal menu, keyboard), "…" menu, invite (adds a pending row and a seat, toast), Resend, Cancel invite, remove confirm.

## Code map

`tabs/AccountTab|OrganisationTab|TeamTab.jsx`; `account/`: `accountData.js`, `accountIcons.jsx`, `ImageUploadRow.jsx`, `SettingsFormFooter.jsx`, `RoleSelect.jsx`, `TeamMemberRow.jsx`, `InviteDialog.jsx`, `RemoveDialog.jsx`; shared new: `ui/RecruiterSettingsCard.jsx` (card, row, link). Reused: `ui/IconTileDialog`, `ui/CenteredIconDialog`, `ui/BannerToast`, `ui/Chip`, `ui/form/*`, `applicationPipeline/actions/ActionFormParts` (HintCheckbox, RadioOptionRow), `recruiterJobs/jobIcons`. Assets: `src/assets/recruiter/settings/` (profile photo, company logo, user-plus and check SVGs). Spec: `tests/e2e/recruiter-settings-account.spec.js` (17 tests).

## ⚠️ Assumptions

Industry and size option lists; "work email" = address at `silverrock.tech`; "Change" opens the Organisation tab; "Preview as talent" only logs; "…" menu entries; pending-invite name and initials from the address; validation messages; "Changes saved" line; toasts `invite-resent`, `invite-cancelled`, `member-removed`; "No free seats left" copy.

## Figma inconsistencies

- SR-01 puts "Profile Photo" with an "Upload new logo" button inside "Personal details"; SR-20 puts "Profile photo / Change photo" in "Account type". Both kept as drawn.
- SR-02 counter reads "82 / 500" for a 76-character text; we show the real count (76 / 500).
- SR-04 and SR-05 dialogs differ in height (the open frame drops the hint line under Role); matched.

## Not verified

Widths 320/390/1024/1440 overflow and console checks, the verbatim-text script run (script written, not run), framecmp for SR-02, SR-05 and SR-20.
