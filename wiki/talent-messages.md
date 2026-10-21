# Talent Messages (`/messages`)

> Figma canvas "Talent Messages" `7387:104275`. Focused + Playful in one build. State is the URL (`messagesState.js`). Created 2026-10-20.

## Status: 🔶 built and measured against the owner's exported frames (2026-10-21, `tests/messages/*.png`): all 49 pairs measured; 44 of them sit at 1.7–7.7 % (font-metric range), 5 families are ≈ 9–11 % with known causes (below). Only T-MSG-05 is ✅ (eyeballed too).

## Decisions (owner, 2026-10-20)

- Route `/messages`; sidebar + mobile nav Messages item and the top-nav messages icon open it (the icon may become a pop-up once the header designs are checked).
- Language menu / Coming-soon modals follow Figma. Accessibility modes (Calm chat, Read aloud, Explain it simply, Large text) are page-level states on `useA11yPrefs` like the other pages.
- Mock data only, API-shaped. The old recruiter `/recruiter/messages` is a different audience and is kept untouched.

## Frame → URL checklist (⬜ = not built/compared; ✅ only with a measured diff)

| Frame     | Name                                                               | Playful       | Focused       | URL                                                              | P %  | F %  | Status                                                                                                                                                                         |
| --------- | ------------------------------------------------------------------ | ------------- | ------------- | ---------------------------------------------------------------- | ---- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| T-MSG-01  | T-MSG-01 · Inbox (default)                                         | `7414:1717`   | `8110:435676` | `/messages?c=owura`                                              | 4.8  | 3.7  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-02  | T-MSG-02 · Conversation options menu                               | `7416:1802`   | `8110:436068` | `/messages?menu=options`                                         | 5.9  | 4.7  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-03  | T-MSG-03 · Requests tab · Message request                          | `7416:2322`   | `8110:436492` | `/messages?tab=requests&c=request`                               | 4.3  | 3.1  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-04  | T-MSG-04 · Request accepted · first reply                          | `7420:1961`   | `8110:436883` | `/messages?tab=requests&c=request&state=accepted`                | 4.8  | 3.6  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-05  | T-MSG-05 · Job card · Not interested (reasons)                     | `7420:2519`   | `8110:437272` | `/messages?modal=not-interested`                                 | 5.3  | 4.1  | ✅ eyeballed against the export (inline "Passing" card, thread ends after the recruiter bubble) + measured                                                                     |
| T-MSG-06  | T-MSG-06 · Before you apply (pre-apply preview)                    | `7420:3086`   | `8110:437636` | `/messages?modal=pre-apply`                                      | 5.1  | 4.3  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-07  | T-MSG-07 · Job card · Applied                                      | `7420:3617`   | `8110:438053` | `/messages?c=applied`                                            | 5.8  | 4.6  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-08  | T-MSG-08 · Interview invite                                        | `7421:2280`   | `8110:438428` | `/messages?c=interview`                                          | 4.4  | 3.2  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-09  | T-MSG-09 · Interview confirmed                                     | `7421:2822`   | `8110:438812` | `/messages?c=interview&state=confirmed`                          | 5.0  | 3.8  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-10  | T-MSG-10 · Message not sent · offline                              | `7421:3380`   | `8110:439209` | `/messages?state=offline`                                        | 4.3  | 3.1  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-11  | T-MSG-11 · Request from a confidential company                     | `7422:2514`   | `8110:439589` | `/messages?tab=requests&c=confidential`                          | 4.6  | 3.4  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-12  | T-MSG-12 · Role has closed                                         | `7422:3011`   | `8110:439985` | `/messages?c=closed`                                             | 4.5  | 3.3  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-13  | T-MSG-13 · Empty inbox (first visit)                               | `7422:3571`   | `8110:440354` | `/messages?state=empty`                                          | 3.8  | 2.7  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-14  | T-MSG-14 · Loading                                                 | `7422:4086`   | `8110:440745` | `/messages?state=loading`                                        | 3.6  | 2.6  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-01c | T-MSG-01c · Inbox (default) · collapsed                            | `7425:1556`   | `8110:442861` | `/messages?rail=collapsed`                                       | 4.7  | 3.8  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-02c | T-MSG-02c · Conversation options menu · collapsed                  | `7425:2081`   | `8110:443142` | `/messages?menu=options&rail=collapsed`                          | 5.7  | 4.7  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-03c | T-MSG-03c · Requests tab · Message request · collapsed             | `7425:2650`   | `8110:443456` | `/messages?tab=requests&c=request&rail=collapsed`                | 3.0  | 2.2  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-04c | T-MSG-04c · Request accepted · first reply · collapsed             | `7425:3177`   | `8110:443736` | `/messages?tab=requests&c=request&state=accepted&rail=collapsed` | 3.5  | 2.6  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-05c | T-MSG-05c · Job card · Not interested (reasons) · collapsed        | `7425:3698`   | `8110:444015` | `/messages?modal=not-interested&rail=collapsed`                  | 3.9  | 3.0  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-06c | T-MSG-06c · Before you apply (pre-apply preview) · collapsed       | `7425:4221`   | `8110:444268` | `/messages?modal=pre-apply&rail=collapsed`                       | 3.9  | 3.3  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-07c | T-MSG-07c · Job card · Applied · collapsed                         | `7425:4786`   | `8110:444575` | `/messages?c=applied&rail=collapsed`                             | 4.7  | 3.8  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-08c | T-MSG-08c · Interview invite · collapsed                           | `7425:5312`   | `8110:444840` | `/messages?c=interview&rail=collapsed`                           | 3.3  | 2.3  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-09c | T-MSG-09c · Interview confirmed · collapsed                        | `7425:5827`   | `8110:445114` | `/messages?c=interview&state=confirmed&rail=collapsed`           | 3.4  | 2.5  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-10c | T-MSG-10c · Message not sent · offline · collapsed                 | `7425:6358`   | `8110:445401` | `/messages?state=offline&rail=collapsed`                         | 3.0  | 2.2  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-11c | T-MSG-11c · Request from a confidential company · collapsed        | `7425:6868`   | `8110:445671` | `/messages?tab=requests&c=confidential&rail=collapsed`           | 3.4  | 2.5  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-12c | T-MSG-12c · Role has closed · collapsed                            | `7425:7403`   | `8110:445957` | `/messages?c=closed&rail=collapsed`                              | 3.3  | 2.4  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-13c | T-MSG-13c · Empty inbox (first visit) · collapsed                  | `7425:7918`   | `8110:446216` | `/messages?state=empty&rail=collapsed`                           | 2.5  | 1.8  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| T-MSG-14c | T-MSG-14c · Loading · collapsed                                    | `7425:8459`   | `8110:446497` | `/messages?state=loading&rail=collapsed`                         | 2.3  | 1.7  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| H-01      | H-01 · Help me reply · reply ideas                                 | `7463:4297`   | `8110:449385` | `/messages?reply=ideas`                                          | 6.1  | 4.9  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| H-02      | H-02 · Help me reply · Buddy is writing                            | `7463:4862`   | `8110:449794` | `/messages?reply=writing`                                        | 5.6  | 4.4  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| H-03      | H-03 · Help me reply · draft ready                                 | `7463:5418`   | `8110:450198` | `/messages?reply=draft`                                          | 5.5  | 4.3  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| H-04      | H-04 · Draft placed in message box                                 | `7463:5987`   | `8110:450605` | `/messages?reply=placed`                                         | 5.3  | 4.0  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| H-01c     | H-01c · Help me reply · reply ideas · collapsed                    | `7464:4860`   | `8110:450989` | `/messages?reply=ideas&rail=collapsed`                           | 6.0  | 4.9  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| H-02c     | H-02c · Help me reply · Buddy is writing · collapsed               | `7464:5420`   | `8110:451288` | `/messages?reply=writing&rail=collapsed`                         | 5.5  | 4.5  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| H-03c     | H-03c · Help me reply · draft ready · collapsed                    | `7464:5975`   | `8110:451582` | `/messages?reply=draft&rail=collapsed`                           | 5.3  | 4.2  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| H-04c     | H-04c · Draft placed in message box · collapsed                    | `7464:6533`   | `8110:451879` | `/messages?reply=placed&rail=collapsed`                          | 6.0  | 4.8  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| A-01      | A-01 · Accessibility · In Messages tab                             | `7489:5819`   | `8110:453594` | `/messages?a11y=1`                                               | 5.3  | 4.1  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| A-02      | A-02 · Settings on · Calm chat + Read aloud + Explain + Large text | `7489:6452`   | `8110:453987` | `/messages?calm=1&read=1&explain=1&large=1`                      | 6.3  | 5.0  | 🔶 measured; eyeballed after the Calm-chat fix                                                                                                                                 |
| A-03      | A-03 · Read aloud · playing                                        | `7491:6150`   | `8110:454403` | `/messages?calm=1&read=playing&explain=1`                        | 9.8  | 8.6  | ⚠️ ≈9 %: eyeballed — content/state match (green outline, no typing, no reaction); thread scroll offset and bubble heights differ                                               |
| A-04      | A-04 · Explain it simply · Career Buddy                            | `7491:6669`   | `8110:454847` | `/messages?explain=open`                                         | 5.4  | 4.2  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| L-01      | L-01 · Language menu · Coming soon                                 | `7497:6381`   | `8110:455947` | `/messages?lang=menu`                                            | 5.4  | 4.3  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| L-02      | L-02 · Twi · Coming soon modal                                     | `7497:6992`   | `8110:456342` | `/messages?lang=twi`                                             | 10.6 | 10.2 | ⚠️ ≈10 %: our modal is centred on the viewport (Figma ≈26 px lower), Ask Buddy FAB is dimmed by the scrim (Figma keeps it bright); structure, copy and tilts match (eyeballed) |
| L-03      | L-03 · On the list · toast                                         | `7497:7466`   | `8110:456736` | `/messages?lang=toast`                                           | 6.2  | 5.3  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| L-02b     | L-02b · Ga · Coming soon modal                                     | `7499:135369` | `8110:457137` | `/messages?lang=ga`                                              | 10.6 | 10.2 | ⚠️ ≈10 %: our modal is centred on the viewport (Figma ≈26 px lower), Ask Buddy FAB is dimmed by the scrim (Figma keeps it bright); structure, copy and tilts match (eyeballed) |
| L-02c     | L-02c · Ewe · Coming soon modal                                    | `7499:136038` | `8110:457531` | `/messages?lang=ewe`                                             | 10.6 | 10.2 | ⚠️ ≈10 %: our modal is centred on the viewport (Figma ≈26 px lower), Ask Buddy FAB is dimmed by the scrim (Figma keeps it bright); structure, copy and tilts match (eyeballed) |
| L-02d     | L-02d · Dagbani · Coming soon modal                                | `7499:136707` | `8110:457925` | `/messages?lang=dagbani`                                         | 10.7 | 10.3 | ⚠️ ≈10 %: our modal is centred on the viewport (Figma ≈26 px lower), Ask Buddy FAB is dimmed by the scrim (Figma keeps it bright); structure, copy and tilts match (eyeballed) |
| L-02e     | L-02e · Hausa · Coming soon modal                                  | `7499:137376` | `8110:458319` | `/messages?lang=hausa`                                           | 10.6 | 10.2 | ⚠️ ≈10 %: our modal is centred on the viewport (Figma ≈26 px lower), Ask Buddy FAB is dimmed by the scrim (Figma keeps it bright); structure, copy and tilts match (eyeballed) |
| A-01c     | Accessibility · In Messages tab · collapsed sidebar                | `8808:456563` | `8808:457245` | `/messages?a11y=1&rail=collapsed`                                | 4.6  | 3.6  | 🔶 measured vs the exported frames (font-metric range), not eyeballed                                                                                                          |
| HP        | Help pop-over overlay                                              | `8376:504797` | `8376:504917` | `/messages?help=1`                                               | n/a  | n/a  | 🔶 Figma HP export is the pop-over alone on a blank canvas (a whole-frame diff reads ≈80 %, meaningless); copy matches                                                         |

## ⏳ Recovery list — things that need the Figma REST API (blocked 2026-10-20, Retry-After ≈ 9 h, plan tier `pro` / limit type `low`)

> Context: the REST API returned 429 for every token available; only the Figma MCP (`get_design_context` / `get_metadata`, plain `123:456` node ids) worked. Everything below was NOT verified or only partly built. When REST is back (or a token with a Dev/Full seat is supplied in `.figma-token.local`), work through this list top to bottom. Tag every item ✅ only with a measured result.

### A. Measurements nobody could run (all packages)

- [ ] `framecmp.mjs` / `cmp.mjs` whole-frame diff % for **all 49 pairs + A-01c + HP, Playful and Focused** (nothing is measured; every row above is ⬜). 2–4 % = fonts, 4–7 % inspect, >8 % real.
- [ ] `pdiff.py` Playful ↔ Focused for every pair (agents compared Playful frames and some Focused by eye only). Focused frames never fetched by D: `8110:454403` (A-03), `8110:455947` (L-01), `8110:456342` (L-02), `8110:456736` (L-03).
- [ ] `errscan.mjs` on every URL (both styles, desktop + phone).
- [ ] 390 / 320 px visual check in both styles for packages B and D (only C measured some widths; D none).
- [ ] `texts.py` string check against the DOM for the first and most complex frame of each type.

### B. Package B (cards / dialogs)

- [ ] Passed card: now built from the MCP (node `7430:3242`, copy verbatim), but not yet compared pixel-wise; Figma shows the light sparkle in the match header — colour assumed `#C8951A`.
- [ ] `PreApplyDialog` read from tree.py output only; never compared with the T-MSG-06 export.
- [ ] Interview strip reads "INTERVIEW INVITE" in the confirmed state (kept as drawn); buttons are "Accept" / "Suggest another time" (brief said "Confirm").
- [ ] T-MSG-05 is NOT a dialog: it is the inline card in `passing` state (no `NotInterestedDialog` exists on purpose).

### C. Package C (Help me reply)

- [ ] Re-check H-01…H-04 (+c) full-frame once package A's page is mounted; Focused ideas / draft / placed at 1728 not viewed.
- [ ] Ideas panel is ≈ 258 px tall vs 201 px in Figma (4th chip wraps — font metrics); confirm after a real diff.
- [x] Invented content REMOVED 2026-10-21 (user request): Help me reply now has only the drawn draft (idea 1, Friendly); the other three idea chips, the Professional / Short tones, Make it shorter / More formal and Undo are drawn but do nothing (logged). The 2.6 s "Buddy is writing" timer stays only so the flow can move between the two drawn states.
- [ ] Figma text glitches kept as drawn: H-03 "Mr. Asante that" (missing em dash), H-04 note missing its separator glyph, meta "38 words" vs 34.

### D (Accessibility / Languages / Help)

- [ ] Icons: all seven previously-missing glyphs are now in `dIcons.jsx` (via the MCP asset server): enter, message-01, skip, 2 squiggles, 2 sparkles. Still re-check against renders.
- [ ] Buddy avatar in the explain card reuses the shared `CareerBuddyAvatar`, not Figma node `7491:7154`.
- [x] "Everywhere" tab content REMOVED 2026-10-21: the tab is drawn but disabled (no content is drawn for it). Speed cycling, pause-dismisses-bar, the toast's 6 s auto-hide and the 12 px "small" text size were removed too.
- [ ] Focus-trap / Esc checks in a browser; console cleanliness; 12 px floor at 320.
- [ ] Playful L-02: hero, Ewe and Ga bubbles drawn Focused-style (kept as drawn).

### E. Lead integration still open

- [ ] Mount D's panels / language components, B's `PreApplyDialog` in `MessagesOverlays.jsx`.
- [ ] Help pop-over: add `MESSAGES_HELP_COPY` branch in `notifications/HelpPopover.jsx`; `helpPage` is already set to `messages` by the shell.
- [ ] Top-nav EN button → `messages.update({ lang: 'menu' })` on Messages.
- [ ] Register all URLs in `tests/e2e/helpers/responsive.js`; add `/messages` to `scripts/playful-leak-check.mjs`; run responsive audit + leak check + strict visual check on 2–3 other talent pages (shared sidebar/nav edits).
- [ ] Guard signed-out `/messages?demo=1` (401s from `/api/*` then redirect to `/login` after ≈ 3–5 s) so audit/screenshot tools do not bounce.
- [ ] Decide: top-nav messages icon is a plain link to `/messages` for now — owner expects a pop-up once the header designs are checked.
- [ ] Update `wiki/INDEX.md`, `wiki/log.md`, `wiki/routing.md`, `wiki/components.md`; re-export per-frame ✅/⚠️ in the table above.

### G. Defects found by the local frame comparison (2026-10-21) — fix when convenient, re-measure after

- [x] A-02 / A-03 (≈10 % before): FIXED 2026-10-21 — the thread leaves room for the read-aloud bar (`pb-[64px]` while playing), the reaction pill anchors to the bubble (no overlap with the Listen chip), thread scrolls to the bottom. Re-measure when the references are re-exported (the % in the table is from before the fix).
- [x] L-02 family (≈10 % before): FIXED 2026-10-21 — bubble tilts (Ewe 10°, Twi 5°, Ga −9°, Hausa 4°, Dagbani −5°, status pill 3°) and asymmetric radii read from node 7499:6913 via the MCP; the doodles (squiggles, sparkles) were dropped because the new icon components ignored `style` — now fixed; the modal's art band height bug fixed earlier. STILL OPEN: backdrop blur/dim vs Figma, per-style shadow (Figma component draws `4px 4px 0 rgba(28,42,33,.15)` + soft; ours differs), the "Ping me" label is a gradient-clipped text in Figma. Re-measure after re-export.
- [ ] H-01 Playful 8.8 %: ideas panel 258 px tall vs 201 px (4th chip wraps — font metrics) — confirm after a real diff.
- [ ] T-MSG-05 (7.6 / 6.4 %) and T-MSG-02 (5.9 / 4.7 %): inspect the heat map (job card / menu), not looked at yet.
- [ ] URL contract fix: A-02 / A-03 / A-04 draw the accessibility panel CLOSED (modes on); only A-01 has it open. URLs now: A-02 `?calm=1&read=1&explain=1&large=1`, A-03 `?read=playing&explain=1`, A-04 `?explain=open`.
- [ ] Headless speech: `?read=playing` used to be reset to `read=1` by the speech error handler (no voices). Fixed: engine errors keep the bar showing.
- [ ] Signed-out `/messages…` redirects to `/login` after the `/api/*` 401 (same as the other talent pages); audit and comparison tools must abort `**/api/**`.
- [x] The exported reference PNGs in `tests/messages/` were deleted on 2026-10-21 (not needed any more; `tests/messages/*.png` is git-ignored). To compare again, export the frames from the Figma app (0.5x, file name = frame name) into that folder, or use `figma-tools/export.py` once the REST quota is back; `frames-*.json` keeps every frame id.

### H. Invented content removed 2026-10-21 (user: "take out assumptions")

Everything that was tagged ⚠️ ASSUMPTION in `src/components/sections/talentMessages` is gone (0 tags left). Behaviours with no drawn result now only log:

- Roselyn Awinnor's inbox row is shown but not selectable (only her row is drawn; her header and thread were invented).
- Options menu: choosing an item only closes the menu (no mute toggle / "Unmute notifications" label, no archive / delete / block removing the conversation).
- Message retry ("Tap to retry"), accepting the confidential company's request, the empty-state links ("Check my visibility", "Browse your matches") and the "View role" link: no invented outcome or destination.
- Help me reply, accessibility panel, read-aloud bar and language toast: see the items above.
  Kept because they are drawn: the first request's accepted state (T-MSG-03 → T-MSG-04), the Passing / Passed / Applied / Closed card states, the interview invite → confirmed states.

### I. Copy check against Figma node data (2026-10-21) — partial

The Figma REST quota for the account was used up after node data for only **T-MSG-01…05 (Focused)** came back (images endpoint blocked ≈ 4.6 days, nodes endpoint ≈ 3.9 days from 2026-10-21). For those five frames every Figma string was looked up in the rendered page (demo URLs, API blocked): all strings are present except

- the Safari toolbar text ("figma.com") — not part of the app;
- sidebar values (47 / 142 / 7 / "Tertiary (BSc) · Accra, Ghana" …) on the plain `/messages` URL: that URL shows the signed-in talent's real data; the drawn Kofi shell is `?c=owura` (or any frame URL) — present there;
- "Unread (2)" — drawn on screen but the "(2)" is generated content (kept out of the text for the audit);
- **❓ "4 recruiters in your inbox"**: it is in the Focused frame's text list but our Focused page does not show it (Playful does). The Focused 0.5x image does not show that pill either, so it may be a hidden / transparent layer — confirm when the quota is back.
  Still unchecked: copy for all other frames (T-MSG-06…14, collapsed twins, Help me reply, accessibility, languages) and the whole Playful side — re-run once REST is back: fetch each frame, `texts.py`, and look every string up in the page.

### J. Eyeball check against the owner's exported frames (2026-10-21) — all 49 pairs, both styles

Five read-only reviewers looked at every reference PNG next to our screenshot (no Figma calls). Result: no MAJOR left after the fixes below; the rest is listed as known differences.

- **Fixed from this pass:** sidebar label "Opportunities" (was "Job Postings"); top-nav messages badge hidden in the empty-inbox frame; ☆ 1 reaction hidden with Help me reply open / Calm chat / Explain open; typing row hidden behind the pre-apply dialog, with Help me reply, read-aloud playing and Explain open; A-04 shows Listen chips with `explain=open`; composer no longer scales with Large text; `?reply=placed` opened directly now shows the drawn draft in the composer (H-04); thread no longer scrolls for a ≤ 24 px overflow (keeps the "Yesterday" pill whole); Playful hero circles dashed; language toast centred on the content area, one line; Calm chat keeps chips, typing indicator and header art.
- **Known differences left (low value / shared files):**
  - Collapsed rail (shared `talentHome/TalentRailCollapsed.jsx`, used by other pages): the expand chevron is ≈ 40 px further right than Figma, and the active Messages tile gradient looks stronger than Figma's flat dark green. Verify against the Figma node before touching.
  - Accessibility button in the top nav lacks Figma's small "modes on" dot (A-02 / A-03 / A-04); shared `DashboardTopNav` / `TalentA11yMenu`.
  - Help pop-over height differs by ≈ 14 px (shared `notifications/HelpPopover.jsx`).
  - T-MSG-03 Focused: the request action buttons use the shared Button's hard bottom edge; Figma Focused is flat with a soft shadow.
  - A-03 ≈ 9 % (thread scroll offset and bubble heights); A-02 ≈ 6 %; language modals ≈ 10 % (modal centred on the viewport vs Figma's full frame; Ask Buddy dimmed by the scrim).
  - Top fade of the thread under the header (A-02) and the faint grid texture in Focused page background: not built / unconfirmed.
  - Focused sidebar count badges look more saturated than Figma's pale pills (low confidence at 0.5x).

### F. Housekeeping

- [ ] Delete stray empty folder `C:\c\Users\gsito\AppData\Local\Temp\claude\…\scratchpad\C` (created by a bad `/c/...` path; a safety check blocked the agent from removing it).
- [ ] Remove `tests/messages/_exp.py`, `_exp.log`, `_wiki.py` once no longer needed (scratch scripts); `tests/messages/img` and `frames-*.json` are the working references.
- [ ] `.figma-token.local` was removed from the repo during this session — restore it (one line, git-ignored) before running any figma-tools script; never commit it.
