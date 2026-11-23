# Parent emails (`emails/parent/focused/`)

Figma file `GwL8cVTsz2wI4H3jnqL8IH`, canvas **02 · Parents · Emails** `3:3`, section **Parent emails · Focused** `17:69` — 7 emails, **Focused only** (the canvas states "Parents use Focused only"; there is no Playful set). 680px frames. Same approach, conventions, tooling and known gaps as [talent-emails.md](talent-emails.md): static table-based HTML, inline styles, PNG exports of the real Figma nodes in `emails/assets/` (identical images shared in `emails/assets/shared/`), frontend only.

## Status (2026-10-23)

Compared with the Figma 0.5x export by a same-size pixel diff (headless Chromium, LCD text off); every pair viewed side by side; copy check of every visible Figma text node: **0 missing in all 7**; 390px: no horizontal scroll; 0 broken images, 0 page errors.

| Email                                | Figma node | File                                      | Diff | Status                                                                                                                                                  |
| ------------------------------------ | ---------- | ----------------------------------------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| PE-01 · Link request from your child | `17:72`    | `pe-01-link-request-from-your-child.html` | 6.2% | ✅                                                                                                                                                      |
| PE-02 · Payment approval waiting     | `17:158`   | `pe-02-payment-approval-waiting.html`     | 4.9% | ✅                                                                                                                                                      |
| PE-03 · Fix ready to check           | `17:236`   | `pe-03-fix-ready-to-check.html`           | 8.0% | ✅ Figma's own export wraps a paragraph its frame box draws as one line and overlaps the Steps card; ours wraps naturally, so the card sits ~22px lower |
| PE-04 · Skills report reviewed       | `17:310`   | `pe-04-skills-report-reviewed.html`       | 4.6% | ✅ (three stat tiles are fluid on mobile)                                                                                                               |
| PE-05 · Turning 18 soon              | `17:405`   | `pe-05-turning-18-soon.html`              | 5.5% | ✅                                                                                                                                                      |
| PE-06 · Weekly summary               | `17:489`   | `pe-06-weekly-summary.html`               | 5.0% | ✅                                                                                                                                                      |
| PE-07 · Message to your child        | `17:573`   | `pe-07-message-to-your-child.html`        | 6.2% | ✅ (frame is ~10px taller than its content)                                                                                                             |

## Re-inspection and link destinations (2026-11-22, phase 11)

✅ VERIFIED: all 7 re-diffed against fresh 0.5x exports (4.5–8.1%, unchanged), copy check 0 missing, 0 broken images, no horizontal scroll at 390px. Figma has no prototype links on these frames. Links are absolute (`{{APP_URL}}` = the app origin, filled in by the sender; `{{invite_token}}`, `{{ward_id}}` per recipient). PE-05/06/07 footer links were plain text; they are real links now.

| Email | Control                                   | Destination                                                                                             | Source                                                                                   |
| ----- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| all   | Email settings · Unsubscribe              | `/parent/settings?tab=notifications`                                                                    | PS-03; ⚠️ ASSUMPTION for Unsubscribe (no one-click unsubscribe)                          |
| all   | Privacy                                   | `/parent/help/opting-out` ("Opting out and privacy")                                                    | ⚠️ ASSUMPTION: no privacy-policy page                                                    |
| PE-01 | Review and approve · This is not my child | `/onboarding/parent-invited?token={{invite_token}}` · same `&action=opt-out` (opens the opt-out dialog) | parentInvite.api.js, ParentInviteWelcomeSection.jsx                                      |
| PE-02 | Approve GHS 90.00 · Decline               | `/parent/wallets?modal=approve` · `?modal=decline`                                                      | PWa-02 / PWa-04 (parent-wiring "Decide")                                                 |
| PE-03 | Check the change                          | `/parent/review?tab=corrections`                                                                        | PR-08                                                                                    |
| PE-04 | Read the report                           | `/parent/wards/{{ward_id}}?tab=evaluations`                                                             | ⚠️ ASSUMPTION: no skills-report page; evaluations tab is the nearest                     |
| PE-05 | See what changes                          | `/parent/wards/{{ward_id}}?notice=turning18`                                                            | PW-10 "turns 18" notice (the help article `/parent/help/turns-18` is "not designed yet") |
| PE-06 | Open Parent dashboard                     | `/parent`                                                                                               | PD-01                                                                                    |
| PE-07 | View conversation · Report a concern      | `/parent/wards/{{ward_id}}?tab=activity` · `/parent/help?modal=report&who={{ward_id}}`                  | ⚠️ ASSUMPTION for the conversation (parents have no messages screen) · PH-03             |

## Known gaps / assumptions

- Links: see the table above. ⚠️ ASSUMPTION: button label gradient rendered as solid `#e8f2ed`; mobile (≤640px) layout is our own.
- Figma inconsistencies kept as drawn: footer frames are a fixed 10px high with overflowing content (natural height used); button text layers are named "Get started Free" but their characters are the real labels.
- Not verified: real mail clients (Outlook, Gmail, Apple Mail), dark mode, real SF Pro Rounded metrics. Image paths are relative; a real send needs hosted URLs.
- The talent-side counterpart of PE-01/PE-02 flows is TE-12 (parent approval sent, under 18) in [talent-emails.md](talent-emails.md).
