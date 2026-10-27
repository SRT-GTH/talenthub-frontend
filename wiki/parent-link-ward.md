# Parent · Link a ward (`/parent/link-ward`)

> Figma: file `SCXc457vwiq6o7d9g4jVbh`, canvas "Parent · 04 Link a ward" `10057:1093` (persona Emma Mensah). Built 2026-10-27, **Focused only** (the Parents file has no Playful twins), frontend only (mock data). One build, no Playful branch.

## Frame → URL (✅ VERIFIED by `framecmp.mjs`, Focused, 2026-10-27)

Form values for the frames that show the filled search page: `?name=Kwesi%20Mensah&dob=04062011&rel=nephew` (called `F` below).

| Frame                                                      | Figma id       | URL                                           | Diff % | Status                           |
| ---------------------------------------------------------- | -------------- | --------------------------------------------- | ------ | -------------------------------- |
| PD-01c Parent home, no linked ward (context)               | `10057:1108`   | `/parent?state=none` (home build, not redone) | —      | already built (parent-dashboard) |
| PW-07 Link another ward · Search, "1 match"                | `10034:141501` | `/parent/link-ward?F`                         | 1.6    | ✅                               |
| PW-07c No match found                                      | `10052:2534`   | `…?F&result=none`                             | 1.8    | ✅                               |
| PW-08 Link request sent                                    | `10034:142187` | `…?step=sent`                                 | 1.5    | ✅                               |
| PW-07b Link with a code (modal)                            | `10052:530`    | `…?F&modal=code&code=K7M4`                    | 3.2    | ✅                               |
| PW-07e Code didn't work                                    | `10077:18651`  | `…?F&modal=code-error&code=K7M4Q2`            | 1.5    | ✅                               |
| PW-07f Code has expired                                    | `10077:18999`  | `…?F&modal=code-expired&code=K7M4Q2`          | 1.5    | ✅                               |
| PW-07d Too many wards · Register as an institution (modal) | `10052:3470`   | `…?F&modal=institution`                       | 3.5    | ✅                               |
| PW-09 New ward linked automatically (modal over home)      | `10035:13112`  | `/parent?modal=ward-linked`                   | 4.3    | ✅                               |
| PW-08c "Kwesi accepted your request" toast on My wards     | `10056:2958`   | **not built here** (see hand-off)             | —      | ⬜ belongs to the My wards page  |
| PW-08b My wards · request declined / expired               | `10052:3090`   | **not built here** (see hand-off)             | —      | ⬜ belongs to the My wards page  |

Diff % is the whole-frame pixel difference against the Figma 0.5x export; the worst cells are the top bar (shell) and the dialog button rows (button text metrics). Every dialog was also compared by eye side by side.

## Hand-off to the My wards session (PW-08c / PW-08b)

Both frames are the My wards page (`pages/parent/ParentWardsPage.jsx`, other session). Nothing in this build edits it. What it needs:

- **PW-08c**: toast "Kwesi accepted your request" / "He now has the same controls as Abena and Elliot." with action "Open Kwesi" — the existing `wards/dialogs/ParentToast.jsx` already has this shape (message, detail, actionLabel). Sidebar shows "Mother · 3 wards linked" and stat "3" (a third sidebar state, like their `oneWard`). Kwesi row: "Kwesi Mensah · Nephew", "15 · JHS 3 · Accra · linked today", Active. This build sends a good link code to `/parent/wards?toast=accepted` so the wards page can show it.
- **PW-08b**: a notice "Kwesi's link request expired" / "Children can decline or ignore a request. You can send a new one, or ask him for a link code." above the table, and the Kwesi row as "Expired" + "Resend" ("Request expired 31 Oct · Kwesi didn't accept within 14 days").
- Their "Link another ward" button (`WardsAll` `onLink`, currently only logs) should go to `/parent/link-ward`.

## Code map

`src/pages/parent/ParentLinkWardPage.jsx` (page, route `link-ward` in `ParentApp.jsx`) · `src/components/sections/parent/link/`:

- `linkWardState.js` URL hook · `data/linkWardData.js` (all copy verbatim, mock child, relations, mock codes)
- `LinkWardSearch.jsx` (card; uses `LinkField`, `RelationChips`, `LinkMatchRow`, `LinkNoMatch`) · `LinkWardSent.jsx`
- `LinkDialogShell.jsx` (+ `LinkDialogClose`) on `AgencyDialog` · `LinkCodeDialog.jsx` + `LinkCodeBoxes.jsx` · `InstitutionDialog.jsx` · `WardLinkedDialog.jsx`
- Assets (`src/assets/parent/`): `spot-search`, `spot-sent`, `spot-settings`, `link-hint`, `link-check`, `link-close-green`, `link-close-grey`, `link-shield-red`, `link-info-amber` (Figma exports). Reused: `spot-ward.svg`, `kwesi.webp`, `elliot.webp`.

Shared files touched (add-only): `ParentApp.jsx` (lazy import + one `<Route path="link-ward">`), `ParentHomePage.jsx` (renders `WardLinkedDialog` when `?modal=ward-linked`; every other state unchanged).

## Behaviour (rule 14: reachable by the real UI too)

Typing name + 8 digits of date of birth shows the result (match when it is the mock child, else "No match yet"); "Send link request" → sent card; "Cancel request" → back to the form; "I have a link code" opens the code dialog; the code boxes auto-advance, Backspace goes back, paste fills; wrong / expired / good code give the three outcomes; Esc, the X and Cancel close; "Try again" / "Enter a new code" clear the boxes. Verified in a real browser (see log).

## Known gaps / assumptions

- ⚠️ ASSUMPTION: Figma draws no search button; results appear once the name and a full date are in. An empty form shows no result block (not drawn).
- ⚠️ ASSUMPTION: the rule that picks the code outcome (`MOCK_CODES`: `K7M4Q2` wrong, `K7M4E0` expired, anything else links). PW-07e and PW-07f both draw `K7M4Q2`, so those two frames are reached by URL.
- ⚠️ ASSUMPTION: a good code goes to `/parent/wards?toast=accepted`; "Back to My wards" → `/parent/wards`; "Register an institution" → `/onboarding/institution/guidelines`; "Cancel request" returns to the form; "Opt out" (PW-09) only logs and closes; "See Elliot" → `/parent/wards/elliot`; "Invite by SMS" only logs (no screen drawn).
- ⚠️ ASSUMPTION: Figma draws no trigger for the 100+ children dialog, so it is URL-only (`?modal=institution`). The "2 tries left" line is the drawn text, not a live counter.
- Figma inconsistencies kept as drawn: PW-07f draws all six characters but keeps the fifth box green; the Relationship chips differ between the page (six) and the code dialog (five, no "Younger sibling"); PW-08 has no subtitle under the title.
- Fonts: SF Pro Round is not loaded, so a few lines wrap one word earlier than in Figma (e.g. the PW-09 subtitle).
- Not verified: Playful (does not exist for this file); real SMS/notification; a screen reader pass; paste into the code boxes was written but not exercised.

## Consolidation candidates (for the end-of-sprint merge)

Created in `parent/link/` to avoid touching other sessions' files; each overlaps something that already exists:

1. **Dialog card**: `LinkDialogShell` ≈ the card in `wards/dialogs/UnlinkDialog.jsx` / `VisibilityDialog.jsx` (same r24, hairline, three-layer shadow, scrim 55 %). One `ParentDialog` on a neutral dialog shell; `AgencyDialog` itself is imported across feature folders and could move to `components/ui`.
2. **Text field**: `LinkField` ≈ the reason input in `UnlinkDialog` (51 px, `#ccc`, 2.5 px shelf) ≈ `components/ui/form/TextInput.jsx`.
3. **Code boxes**: `LinkCodeBoxes` vs the existing `components/ui/form/VerificationCode.jsx` (different spec: 56×64, r14, alphanumeric) — check whether one component with a size variant covers both.
4. **Chips**: `RelationChips` (selectable), `WardChip` (status), plus two inline pills ("Pending link · expires…" in `LinkWardSent`, "Active" in `WardLinkedDialog`) → one `ParentChip`.
5. **Ward row** (avatar + name + line): `LinkMatchRow`, the ward row of `WardLinkedDialog` and `WardsAll`'s `WardRow`.
6. **Close buttons / small icons**: `link-close-green|grey.svg` vs `dialog-close.svg` / `ward-close.svg`; `link-check` vs the check icons in `wards`.
7. **Callouts** (red / amber, in `LinkCodeDialog`) vs any alert/note component (`ApiErrorNote`, wards notices).
8. **Toast**: PW-08c should reuse `ParentToast` as is (no duplicate was made).
