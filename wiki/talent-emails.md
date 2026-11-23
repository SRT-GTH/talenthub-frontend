# Talent emails (`emails/talent/`)

Figma file `GwL8cVTsz2wI4H3jnqL8IH` ("GTH · Comms (email + push)"), canvas **01 · Talents · Emails** `3:2`: section **Talent emails · Playful** `23:448` and **Talent emails · Focused** `23:1822` — 13 emails, each drawn in both styles, 680px wide frames (600px email column plus a phone push-preview card on top). 13 pairs, 0 unpaired (TE-13 was added to Figma after the first build; built 2026-11-22).

Frontend only: static, table-based HTML with inline styles (no React, no routes, no backend). Open a file directly in a browser. Files: `emails/talent/{playful,focused}/te-NN-<slug>.html`; images (2x PNG exports of the real Figma nodes) in `emails/assets/te-NN-<style>-<node id with : → _>.png`. Images that were identical across emails (logos, arrows, icons, Buddy avatars) live once in `emails/assets/shared/` (named after the first email that used them), 68 files in total (was 227, 159 were byte-identical copies).

Figma REST access: this file needs the token in `talenthub-frontend/.figma-token.local` (the shell's `FIGMA_TOKEN` gets 403 on it). Run `FIGMA_FILE_KEY=GwL8cVTsz2wI4H3jnqL8IH` with that token for figma-tools.

## Status (2026-10-22)

All 24 files render, no broken images, no page errors. Compared against the Figma 0.5x export with a **same-size** pixel diff (cmp.mjs rescales the images and gives meaningless numbers for emails; the baseline measure is `% of pixels differing by >24/255`, headless Chromium with `--disable-lcd-text`). ~4–6% is text rendering/font fallback (SF Pro Rounded and Bricolage Grotesque are not installed here).

| Email                                   | Playful   | Focused   | P diff | F diff | Status                                                                                                                                                                                                                                                            |
| --------------------------------------- | --------- | --------- | ------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TE-01 · Verify your email               | `23:451`  | `23:1825` | 5.8%   | 4.3%   | ✅ (built by an earlier session; 2026-10-22 added mobile-only rules so it no longer scrolls at 390px, plus `alt="STEP 1 OF 9"` on the Playful hero; the 680px render is pixel-identical to before)                                                                |
| TE-02 · Welcome, finish setting up      | `23:515`  | `23:1883` | 8.4%   | 4.2%   | ✅ P slightly over 8%: polaroid photo tilt/shadow, text drift                                                                                                                                                                                                     |
| TE-03 · New opportunity matches         | `23:639`  | `23:1993` | 7.9%   | 4.9%   | ✅                                                                                                                                                                                                                                                                |
| TE-04 · Shortlisted                     | `23:752`  | `23:2094` | 7.1%   | 4.0%   | ✅                                                                                                                                                                                                                                                                |
| TE-05 · New message                     | `23:876`  | `23:2208` | 6.6%   | 4.7%   | ✅                                                                                                                                                                                                                                                                |
| TE-06 · Streak at risk                  | `23:965`  | `23:2291` | 8.0%   | 3.8%   | ✅                                                                                                                                                                                                                                                                |
| TE-07 · Streak milestone · 15 days      | `23:1124` | `23:2433` | 7.7%   | 3.9%   | ✅                                                                                                                                                                                                                                                                |
| TE-08 · Streak lost · repair            | `23:1274` | `23:2571` | 6.2%   | 8.4%   | ✅ F: headline wraps to two lines with the fallback font (+21px height)                                                                                                                                                                                           |
| TE-09 · Streak freeze used              | `23:1413` | `23:2700` | 6.2%   | 3.8%   | ✅                                                                                                                                                                                                                                                                |
| TE-10 · Payment received                | `23:1535` | `23:2812` | 6.6%   | 4.0%   | ✅                                                                                                                                                                                                                                                                |
| TE-11 · Weekly digest                   | `23:1631` | `23:2900` | 6.6%   | 4.3%   | ✅                                                                                                                                                                                                                                                                |
| TE-12 · Parent approval sent (under 18) | `23:1741` | `23:2998` | 6.4%   | 4.4%   | ✅                                                                                                                                                                                                                                                                |
| TE-13 · Someone wants to link up        | `67:32`   | `67:141`  | 6.9%   | 5.3%   | ✅ built 2026-11-22 from the TE-05 layout (same structure in Figma); copy check 0 missing; +19px height from fallback-font wrapping. New assets named by purpose: `te-13-{playful,focused}-hero.png`, `shared/avatar-esi-quaye.png`, `shared/icon-user-green.png` |

Checks run by the lead (not just the agents): every file re-rendered at 680 and at 390 (no horizontal scroll except TE-01), every pair viewed side by side with its export, copy check of every visible Figma text node against each HTML (script scratchpad `copycheck.py`): **0 missing in all 12 emails, both styles** (sticker text baked into hero images is matched via the image `alt`).

## Re-inspection (2026-11-22, phase 11)

✅ VERIFIED: all 26 files re-rendered and diffed against fresh 0.5x exports (diffs unchanged from the table, 3.6–8.4%), copy check 0 missing in every frame, 0 broken images, 0 page errors, no horizontal scroll at 390px (TE-01 included). Figma has no prototype links or hyperlinks on any email node (checked `reactions` and text `hyperlink`).

Fixed: the Playful "For talents" pill drew a fill and border, but Figma hides both on all 13 Playful frames: removed (Focused keeps its visible `#f8f8f4` fill).

## Link destinations ✅ VERIFIED (2026-11-22)

Every link is absolute: `{{APP_URL}}` is the app's public origin (e.g. `https://gh-talenthub.gov.gh`, the host the public digest names), filled in by the sender; `{{conversation_id}}`, `{{job_id}}`, `{{person_id}}` are per-recipient values. Text links that were plain text (footer links in TE-01/05/06/07, "Help me reply with Buddy", "See streak details") are now real `<a>` with an explicit colour and no underline. Images still use relative paths (local preview); a real send needs hosted image URLs.

| Email | Control                                     | Destination                                                                                                  | Source                                                                |
| ----- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| all   | Email settings                              | `/settings/notifications`                                                                                    | ST-03 Notifications                                                   |
| all   | Unsubscribe                                 | `/settings/notifications`                                                                                    | ⚠️ ASSUMPTION: no one-click unsubscribe page or token endpoint exists |
| all   | Privacy                                     | `/settings/privacy`                                                                                          | ⚠️ ASSUMPTION: no privacy-policy page exists                          |
| TE-10 | Help centre                                 | `/settings/help`                                                                                             | HS-01 Help and support                                                |
| TE-01 | Help centre                                 | `/faq`                                                                                                       | ⚠️ ASSUMPTION: the recipient is mid sign-up, so the public FAQ        |
| TE-02 | Continue setting up · Take a 30-second tour | `/profile/filling/cv` (the first unticked step, "Upload your CV") · `/home?new=tour`                         | profile journey · NU-02 tour                                          |
| TE-03 | See all matches · Change what I get         | `/job-postings` · `/job-postings?modal=alerts`                                                               | J-01 · J-06 match alerts                                              |
| TE-04 | Pick a time · Practise with Buddy           | `/job-postings?tab=applied&job={{job_id}}` (JobInterviewPanel pick card) · `/profile/filling/career-buddy`   | talentJobs · Home Buddy CTA (HomeColumns.jsx)                         |
| TE-05 | Reply on GTH · Help me reply with Buddy     | `/messages/{{conversation_id}}` (MessageLinkRedirect) · `/messages?c={{conversation_id}}&reply=ideas` (H-01) | talent-messages.md                                                    |
| TE-06 | Save my streak · See streak details         | `/learning` · `/streak`                                                                                      | streak pop-up "learn" CTAs                                            |
| TE-07 | Share my badge · See my streak              | `/streak?milestone=15` (S-08, has Share) · `/streak`                                                         | talent-streak.md                                                      |
| TE-08 | Repair my streak · How streaks work         | `/learning` · `/streak?help=1`                                                                               | talent-streak.md                                                      |
| TE-09 | Keep it going                               | `/learning`                                                                                                  | streak "learn" CTAs                                                   |
| TE-10 | Open my wallet · Send to MoMo               | `/wallet` · `/wallet?view=withdraw`                                                                          | W-10                                                                  |
| TE-11 | Open my dashboard                           | `/home`                                                                                                      |                                                                       |
| TE-12 | Explore GTH · Send a reminder               | `/home` · `/settings/guardian`                                                                               | ⚠️ ASSUMPTION for the reminder: no talent-side resend exists          |
| TE-13 | Accept on GTH · See Esi's profile first     | `/community?view=circle&tab=invitations` · `/community/people/{{person_id}}`                                 | talent-my-circle.md (NW-04, NW-06)                                    |

Each destination was opened on the dev server with demo ids (see the phase-11 checklist for the run).

## Conventions (all 13 emails)

- 600px `.gth-wrap` column; nested `role="presentation"` tables; `data-n="<figma node>"` on tables and images; `border-collapse:separate` for rounded corners; mobile rules in the `<style>` block (≤640px: stacked buttons, fluid widths).
- Playful vs Focused differ per frame (stickers, doodles, washi tape, hard 4px shelf shadow + 1.5px border vs hairline + soft shadow, Bricolage vs SF Pro headings, XP vs pts, copy) — each file is built from its own frame.
- Fonts: Bricolage Grotesque → `'Bricolage Grotesque',Helvetica,Arial,sans-serif`; SF Pro Rounded → `-apple-system,BlinkMacSystemFont,'SF Pro Rounded','Segoe UI',Roboto,Helvetica,Arial,sans-serif`.
- Hero art and stickers are one raster export per frame; sticker words (e.g. WELCOME, YAY, PAID) live only in the image and its `alt`. A few in-card stickers use CSS `transform: rotate()` over HTML text.
- Hero image has a rounded top (`border-radius` on the `<img>`); TE-02..TE-04 also carry `overflow:hidden` on the card table.

## Known gaps / assumptions

- Links: see "Link destinations" above (Figma draws none).
- ⚠️ ASSUMPTION: button labels are a gradient fill in Figma (#fef1e7 → #e8f2ed); rendered solid.
- ⚠️ ASSUMPTION: the mobile (≤640px) layout is our own, not from Figma (buttons stack, fluid widths, photo/hero scale).
- **Image paths are relative** (`../../assets/…`); production sends need absolute hosted URLs — not decided.
- Not verified: real mail clients (Outlook, Gmail, Apple Mail), dark mode, Outlook VML; rotated stickers and negative margins degrade to unrotated; real SF Pro Rounded / Bricolage metrics.
- **Figma inconsistencies kept as drawn:** footer frames are a fixed 10/18px high but their content overflows (we render natural height); node names say "+40 XP" where the Focused text says "+40 pts" (text used); TE-04 Playful mock-interview progress fill is 0 wide; Focused inbox-preview card is 95px tall vs 74px Playful; art is 597px (Playful) vs 598px (Focused) wide.
- `emails/assets/te-03-playful-23_701.png` (an earlier session's file) was overwritten by a fresh export of the same node; the unused `te-02-playful-23_577.png` was deleted (every remaining file in `emails/assets/` is referenced by an HTML file).
- TE-01 mobile fix: additive rules in its `@media (max-width:640px)` block (fluid widths for the 522–600px tables and the hero image, `white-space:normal` on the six long text lines). Nothing changed above 640px.
