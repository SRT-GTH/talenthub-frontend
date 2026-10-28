# Parent · To review (`/parent/review`)

> Figma: file `SCXc457vwiq6o7d9g4jVbh`, canvas "Parent · 06 To review and approvals" `10057:66783` (persona Emma Mensah). Built 2026-10-27, **Focused only** (the Parents file has no Playful twins), frontend only (mock data; the corrections come from the shared flags store).
> This page replaced the stop-gap `flags/ReviewCorrections.jsx` that the Flags session drew for its own PR-08 context frame (see "What changed for the Flags session").

## Frame → URL (✅ VERIFIED by `framecmp.mjs`, Focused, 2026-10-27)

| Frame                                               | Figma id       | URL (`/parent/review` + …)                                                                 | Diff % |
| --------------------------------------------------- | -------------- | ------------------------------------------------------------------------------------------ | ------ |
| PR-01 To review · All                               | `10034:144662` | (none)                                                                                     | 2.2    |
| PR-07 Certificates tab                              | `10051:19895`  | `?tab=certificates`                                                                        | 1.6    |
| PR-08 Corrections tab                               | `10051:20146`  | `?tab=corrections`                                                                         | 1.3    |
| PR-09 Payments tab                                  | `10051:20397`  | `?tab=payments`                                                                            | 1.6    |
| PR-01c Collapsed sidebar                            | `10047:18670`  | `?rail=collapsed` (any parent page)                                                        | 2.1    |
| PR-02 Review a certificate (modal)                  | `10034:145407` | `?tab=certificates&modal=certificate`                                                      | 1.6    |
| PR-06 Certificate approved (toast)                  | `10041:5262`   | `?toast=certificate-approved` (implies `done=certificate`)                                 | 2.1    |
| PR-02b Decline certificate, add a note (modal)      | `10041:4530`   | `?tab=certificates&modal=decline&reason=blurry&note=<text>`                                | 3.2    |
| PR-03 Review a teacher evaluation (Evaluations tab) | `10034:146178` | `?tab=evaluations`                                                                         | 2.9    |
| PR-03c Evaluation approved · sent to Elliot (toast) | `10056:3341`   | `?toast=evaluation-sent` (implies `done=evaluation`)                                       | 2.1    |
| PR-03b Don't show Elliot this evaluation (confirm)  | `10041:4921`   | `?tab=evaluations&modal=hide`                                                              | 3.7    |
| PR-04 Assessment results · review and flag          | `10034:146870` | `?view=assessment`                                                                         | 2.8    |
| PR-04b Flag an assessment result (modal)            | `10051:20648`  | `?view=assessment&modal=flag-result&trait=extraversion&reason=not-her&note=<text>&check=1` | 2.8    |
| PR-05 All caught up                                 | `10033:6439`   | `?state=caught-up` (also what the page shows when every count reaches 0)                   | 1.6    |

Diff % = whole-frame pixel difference vs the Figma 0.5x export; the worst cells are the top bar (shell) and the dialog button rows (our buttons are about 4 px wider than Figma's: a glyph-width difference, `ui/Button` already uses Figma's 0.1 px tracking). The numbers were re-measured on 2026-10-28 with SF Pro Rounded (`GTH Parent Rounded`, scoped by `ParentFrame`; weights 400 / 500 / 600 / 700 loaded on every page here): 1.3–3.9 %, essentially unchanged. Every dialog was also compared side by side by eye. Other URL keys: `done=` (certificate | certificate-declined | evaluation | evaluation-hidden), `flagged=<trait ids>`, `trait=<id>`.

## Behaviour (rule 14, exercised in a real browser, 0 console errors)

Five tabs with counts (the active tab's chip is amber, a 0 chip is hidden except on PR-05); Certificates → Review → dialog → **Approve** (toast, counts 4→3, **Undo** restores) or **Decline with a note** (reason chips, note ≥ 10 characters else an inline error, then the row leaves); Evaluations → **Approve · send to Elliot** (toast + Undo) or **Don't show Elliot** → confirm (**Keep reviewing** closes); Corrections → **Check** opens the Flags session's re-review dialog (`/parent/wards/abena?tab=flags&modal=recheck&flag=dob`); an approved fix leaves the queue; assessment → **Flag** on a trait → dialog → the trait reads "Flagged"; Back to Home from the caught-up card. What was dealt with lives in the URL, so frames reproduce from a fresh load and reload keeps the state.

## Code map

- Page: `src/pages/parent/ParentReviewPage.jsx` → `components/sections/parent/review/ReviewPage.jsx` (header, tabs, content, dialogs, toast).
- `review/`: `reviewState.js` (URL hook; `update()` reads the live address bar because Router 6 does not queue `setSearchParams` and the toast calls two updates in a row), `data/reviewData.js` (all copy verbatim + mock items), `ReviewQueue.jsx` (rows), `EvaluationDetail.jsx`, `AssessmentResults.jsx`, `ReviewCaughtUp.jsx`, `CertificateDialog.jsx`, `HideEvaluationDialog.jsx`, `ReasonNoteDialog.jsx` (decline + flag-a-result).
- New shared chrome (add-only): `parent/ParentRailCollapsed.jsx` (the 126 icon rail); `ParentFrame.jsx` reads `?rail=collapsed` for any parent page; `ParentSidebar.jsx` got an optional `onCollapse`; `ui/UnderlineTabs.jsx` got an optional per-tab `showZero`. Defaults are unchanged for every existing caller (checked: home, wards, ward tabs, link a ward render as before).
- Reused unchanged: `ui/DialogCard`, `ui/ActionToast`, `ui/UnderlineTabs`, `wards/tabs/TabRow` (roomy), `WardChip`, `ParentButton`, `ParentTextField`, `flagsStore`.
- Assets (Figma exports, `src/assets/parent/`): `review-file`, `review-user-check`, `review-wallet`, `review-flag`, `spot-certificate`, `spot-caught-up`. Reused: `spot-privacy`, `wards-refresh`.

## What changed for the Flags session

`ParentReviewPage` used to render `flags/ReviewCorrections.jsx` (Corrections only; `?tab=all` was an assumption that it listed the same corrections). It now renders the full page. `?tab=corrections` is their PR-08 frame (re-measured 1.3 %) with the same "Check" link; `?tab=all` now shows the four real rows. `ReviewCorrections.jsx` is **no longer imported anywhere** — delete it when that session agrees (not deleted here).

## Known gaps / assumptions

- ⚠️ ASSUMPTION: the assessment results page (PR-04/04b) has no queue row that opens it, so it is URL-only (`?view=assessment`), shown under the All tab as drawn.
- ⚠️ ASSUMPTION: the payment "Decide" button only logs (no payment decision screen is in this canvas); "Open full file (PDF, 420 KB)" only logs; declining a certificate, hiding an evaluation and flagging a trait draw no result, so they close the dialog and update the counts only (a flagged trait's link reads "Flagged", ⚠️ our copy).
- ⚠️ ASSUMPTION: the note error text of the two reason dialogs ("Add a little more so …") is ours, in the voice of the flag dialogs; the other traits' dialog titles use proper ordinals (only "41st" is drawn).
- Figma inconsistencies kept as drawn: "72th" / "41th percentile" on the page vs "41st" in PW-04b's title; PR-02 / PR-02b show the Certificates tab over the All list (we show the Certificates list behind them); PR-05 shows "0" on every tab while PR-03c hides the Evaluations chip at 0; PR-04 draws the All tab active over the results page; PR-01c's content column is drawn wider than the canvas (cut off at the right edge) — ours fills the space beside the rail.
- Not verified: Playwright baselines (`test:visual`), `test:e2e`, the toolkit `errscan.mjs` (a targeted run on all 13 URLs was used instead), a screen-reader pass; the Playful leak check was run on the 13 URLs only, not the all-routes script.

## Consolidation candidates

1. `ReasonNoteDialog` ≈ `flags/FlagFieldDialog` (modes `field` / `again`): same chips + note + helper + Cancel/Send anatomy → one dialog with a config.
2. `ReviewQueue` rows ≈ `flags/ReviewCorrections` rows (now dead) and `wards/tabs` rows (`TabRow`).
3. The "pill" in `AssessmentResults` / `CertificateDialog` ≈ `ui/StatusPill` (white / mint variants) and `link/RelationChips`.
4. Card shells (white r24 + #e7e7e7 hairline + soft shadow) are repeated in `ReviewQueue`, `EvaluationDetail`, `AssessmentResults`, `ReviewCaughtUp`, `link/LinkWardSearch`, `link/LinkWardSent` → one `ParentCard`.
5. `ParentRailCollapsed` / `ParentSidebar` share the nav icon map (`ICONS`) and nav data.
