# Talent My circle (networking) — `/community?view=circle`, `/community/people/:personId`

Figma file `Bin8roWL8sloyc36IgFMuT`: Playful section `9187:27436`, Focused `9187:30373` (12 frames each, NW-01 … NW-11 + NW-06b), flow documentation `9210:36124` ("HOW TALENTS GET TO MY CIRCLE · step-by-step flow", 6 steps × 2 styles). Mock data only (API-shaped, session store). Built 2026-10-23.

## Navigation (the flow section, implemented for real)

Sidebar "Community" → `/community`, where a "Communities | My circle ·3" switch sits above the page header (the Communities view stays the default; `?nocircle=1` hides the switch so the 14 Oct C-frames can be compared as drawn). "My circle" → `/community?view=circle`. Link up (or the note button) opens "Say why you want to link up with …"; sending turns the card into "Link-up sent" with a toast and Undo; "Invitations · 3" has Accept / Ignore. A "Create a community" button (→ `/community/create`, see [talent-community-create.md](talent-community-create.md)) sits on the same row.

## URL contract (full header in `circleState.js`)

`/community?view=circle` + `tab=discover|invitations|circle|following|feed`, `sub=received|sent`, `state=sent|accepted|minor|empty`, `modal=connect&person=<id>[&draft=1]`, `menu=<id>`, `q=`, `rail=collapsed`. `/community/people/yaw-darko` + `?state=not-connected`, `?modal=endorse&skills=figma,user-research`, `?modal=recommend&draft=1`, `?modal=connect`.

| Frame                                              | URL                                          | P     | F     |
| -------------------------------------------------- | -------------------------------------------- | ----- | ----- |
| NW-01 My circle · Grow `9187:27437` / `9187:30374` | `/community?view=circle&rail=collapsed`      | 8.6\* | 6.9\* |
| NW-02 Connect · add a note                         | `…&modal=connect&person=abena-owusu&draft=1` | 8.7\* | 6.4\* |
| NW-03 Request sent                                 | `…&state=sent`                               | 9.3\* | 5.4\* |
| NW-04 Invitations                                  | `…&tab=invitations&state=accepted`           | 4.6   | 2.6   |
| NW-05 Connections                                  | `…&tab=circle&menu=yaw-darko`                | 3.8   | 1.9   |
| NW-06 Talent profile · connected                   | `/community/people/yaw-darko?rail=collapsed` | 4.5   | 1.9   |
| NW-06b not connected                               | `…?state=not-connected&rail=collapsed`       | 4.4   | 1.9   |
| NW-07 Endorse skills                               | `…?modal=endorse&skills=figma,user-research` | 4.6   | 3.1   |
| NW-08 Write a recommendation                       | `…?modal=recommend&draft=1`                  | 4.5   | 3.0   |
| NW-09 Feed · From your network                     | `/community?view=circle&tab=feed`            | 4.3   | 1.5   |
| NW-10 Under 18 (Ama, 15)                           | `…&state=minor`                              | 7.4\* | 2.2   |
| NW-11 Empty (new talent)                           | `…&state=empty`                              | 6.9\* | 2.7   |

\* stale: measured before three fixes (content max-width 1506 → 1602, dialog title size, Playful empty-state width); the my-circle agent did not get a clean re-run. Dialogs are centred in the real viewport (Figma centres them in the Safari-inclusive frame); the Ask Buddy FAB shows (the frames do not draw it); top nav 91 px vs 88 px.

## Flow section (Figma `9242:…`, re-read 2026-10-23) and what changed in Figma

The designer rebuilt the "how talents get to My circle" section (new ids `9242:543526 …`, 12 frames) and redrew NW-02 / NW-03. The flow frames are the real screens with orange callouts, so they were compared with the same URLs (framecmp, collapsed rail for steps 3-6):

| Step                                                            | URL                                          | P   | F   |
| --------------------------------------------------------------- | -------------------------------------------- | --- | --- |
| 1 Tap Community (Home, Top Talent state, Community highlighted) | `/home?state=top`                            | 6.3 | 5.7 |
| 2 Switch to My circle (Communities page with the switch)        | `/community?demo=1`                          | 6.0 | 7.6 |
| 3 See who to link up with                                       | `/community?view=circle&rail=collapsed`      | 6.3 | 3.8 |
| 4 Link up and say why                                           | `…&modal=connect&person=abena-owusu&draft=1` | 7.7 | 5.3 |
| 5 Link-up sent (card "Link-up sent" + toast)                    | `…&state=sent`                               | 7.4 | 4.9 |
| 6 Answer your invitations (Nana Yaw accepted)                   | `…&tab=invitations&state=accepted`           | 4.0 | 2.6 |

Fixes made after the re-read: the connect dialog title is now "Why link up with {first}?" (was "Say why you want to link up with {first}"); the dialog's note field is two rows and its gaps are 16 (Playful) / 24 (Focused), so the dialog is 307 / 331 px tall against Figma's 309 / 332. The earlier NW-03 inconsistency is resolved: Figma now draws Abena's card as "Link-up sent" with the toast, which is what we render. Step 4 stays at 7.7 % Playful because Figma places the dialog 112 px higher than the viewport-centred one (known).
Still different: a blue "New" tag (`#eaeffb` / `#244a9f`, 38x18) sits beside the active Community tile of the collapsed rail in the circle frames; the shared rail does not draw it (shell change, not done). The "132 / 300" counter is Figma sample text; ours counts live.

## Code map

`src/components/sections/talentCommunity/circle/` (54 files: data, URL state, session store, components, icons as `currentColor` components) and `src/pages/talentCommunity/circle/` (`CirclePage.jsx`, `CircleProfilePage.jsx`); assets `src/assets/talent-circle/` (31 Figma 2x portraits, one SVG illustration). Shared edits (add-only): `CommunityBrowsePage.jsx` (one import + a `<CircleViewGate>` wrapper around the existing expression; the switch is inserted by `CommunitiesSwitchSlot`, which portals into the page's `<h1>` row because the live Browse header is not this build's file), `App.jsx` (one lazy import + the `/community/people/:personId` route).

## Checks that ran

29 of 29 scripted interaction checks pass in Focused and Playful, no page errors (switch, dialog + Esc, "Help me write it", Send, toast + Undo, Accept, Ignore, connection menu + Esc, View profile, endorse, recommend, feed like). Text vs Figma: Focused complete for all 12 frames; Playful verified for NW-01 … NW-05 only. 390 and 320 px, both styles (the agent's final run): Discover, Invitations, Circle with the menu open, feed, under-18, empty, Yaw's profile, the endorse dialog, the note dialog and `/community?demo=1` — no horizontal scroll, no text under 12 px, no page errors.

## Known gaps / assumptions

- ⚠️ ASSUMPTION: the Following tab opens the feed (no entry drawn); NW-11 tiles: Find classmates → `/profile`, Join a community → `/community`, Invite a friend copies a link; "Sent" rows (Kwesi Ofori, Afia Boakye) are invented; endorse buttons are aria-disabled when not connected; the "Link-up sent", "Following", "Endorsed" states and toasts for mute / remove / report / endorse / recommend; connection-chip re-sort; canned text for "Help me write it" / "Help me make it specific" (no AI call); any person other than Yaw gets a profile built from their card.
- Figma inconsistencies kept: NW-03 draws Abena's card still as "Link up" while the flow caption says it becomes "Link-up sent" (we follow the caption); Yaw is a "Link up" suggestion in NW-01 but a connection in NW-05 / NW-06; NW-04 still shows 3 invitations after one is accepted; the under-18 banner is drawn only in Playful NW-10 (Focused layer hidden: a minor loses the safeguarding note in Focused — **confirm with the designer**); NW-11 "empty" still shows Invitations · 3 and Circle · 128; character counters (Figma 132 / 300 and 146 / 600) vs our live count.
- Not done / unverified: a clean framecmp after the three fixes; Playful text check for NW-06 onward; errscan; tap-target audit; `/home` regression.
- Shell requests (not done, shared files): a Community "3" badge on the rail and the expanded sidebar (`TalentRailHome` supports only dot badges and the Messages pill); replace the portal slot with a direct `<CircleSwitch active="communities" showCreate />` in the shared Browse header.
