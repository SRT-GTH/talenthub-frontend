# Talent My circle (networking) — `/community?view=circle`, `/community/people/:personId`

Figma file `Bin8roWL8sloyc36IgFMuT`: Playful section `9187:27436`, Focused `9187:30373` (12 frames each, NW-01 … NW-11 + NW-06b), flow documentation `9210:36124` ("HOW TALENTS GET TO MY CIRCLE · step-by-step flow", 6 steps × 2 styles). Mock data only (API-shaped, session store). Built 2026-10-23.

## Navigation (the flow section, implemented for real)

Sidebar "Community" → `/community`, where a "Communities | My circle ·3" switch sits above the page header (the Communities view stays the default; `?nocircle=1` hides the switch so the 14 Oct C-frames can be compared as drawn). "My circle" → `/community?view=circle`. Link up (or the note button) opens "Say why you want to link up with …"; sending turns the card into "Link-up sent" with a toast and Undo; "Invitations · 3" has Accept / Ignore. A "Create a community" button (→ `/community/create`, see [talent-community-create.md](talent-community-create.md)) sits on the same row.

## My crew rename (2026-11-21)

✅ VERIFIED (Figma REST 2026-11-21): the sections are now "Playful / Focused · My crew (networking)". Copy renamed: switch "Clubs | My crew", "Your crew", "GROW YOUR CREW", tabs "Crew · 128" / "Learning from · 46" (recruiter keeps "Following"), "{n} in your crew know …", "214 in their crew", "Remove from crew", "From your crew", "Start your crew", "Same club project", "Join a club". The switch now shows on the talent profile too (NW-06 … NW-08 draw it).
🪦 STALE (fixed 2026-11-22, see "Right column and profile cards" below): the right column, "Linked up …", "You both know · 8" and the dialog helper lines are now built.

## URL contract (full header in `circleState.js`)

`/community?view=circle` + `tab=discover|invitations|circle|following|feed`, `sub=received|sent`, `state=sent|accepted|minor|empty`, `modal=connect&person=<id>[&draft=1]`, `menu=<id>`, `q=`, `rail=collapsed`. `/community/people/yaw-darko` + `?state=not-connected`, `?modal=endorse&skills=figma,user-research`, `?modal=recommend&draft=1`, `?modal=connect`.

| Frame                                              | URL                                          | P   | F   |
| -------------------------------------------------- | -------------------------------------------- | --- | --- |
| NW-01 My circle · Grow `9187:27437` / `9187:30374` | `/community?view=circle&rail=collapsed`      | 8.7 | 4.4 |
| NW-02 Connect · add a note                         | `…&modal=connect&person=abena-owusu&draft=1` | 8.9 | 4.2 |
| NW-03 Request sent                                 | `…&state=sent`                               | 7.0 | 4.6 |
| NW-04 Invitations                                  | `…&tab=invitations&state=accepted`           | 4.7 | 3.6 |
| NW-05 Connections                                  | `…&tab=circle&menu=yaw-darko`                | 3.7 | 2.6 |
| NW-06 Talent profile · connected                   | `/community/people/yaw-darko?rail=collapsed` | 3.5 | 1.5 |
| NW-06b not connected                               | `…?state=not-connected&rail=collapsed`       | 3.3 | 1.5 |
| NW-07 Endorse skills                               | `…?modal=endorse&skills=figma,user-research` | 6.0 | 4.8 |
| NW-08 Write a recommendation                       | `…?modal=recommend&draft=1`                  | 5.8 | 2.5 |
| NW-09 Feed · From your network                     | `/community?view=circle&tab=feed`            | 4.0 | 1.8 |
| NW-10 Under 18 (Ama, 15)                           | `…&state=minor`                              | 7.2 | 3.6 |
| NW-11 Empty (new talent)                           | `…&state=empty`                              | 5.6 | 6.9 |

Diff % re-measured 2026-11-22 after the card-grid and photo pass ✅ VERIFIED (framecmp, 0.5x exports, every URL with `&rail=collapsed`, page fully loaded). Before that pass: P 13.7 / 12.4 / 13.9 / 4.7 / 3.7 / 3.8 / 3.6 / 6.2 / 5.9 / 4.1 / 14.4 / 10.4, F 5.5 / 4.7 / 5.5 / 3.6 / 2.6 / 1.8 / 1.8 / 5.0 / 2.6 / 1.9 / 4.5 / 7.0. NW-02 / NW-07 keep the known dialog-centring offset; Focused NW-11 draws the rail Figma puts past the frame edge.

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

## Control destinations (2026-11-21)

Prototype links read over REST on NW-01 `9187:27437`, NW-04 `9187:29389`, NW-06 `9189:2`, NW-06b `9189:517`: none on the invitations "Manage", "Learn from" or "Message".

- ✅ VERIFIED Invitations "Manage" (full card, demo) opens the Sent list (`sub=sent`), where pending link-ups are managed. ⚠️ ASSUMPTION.
- ✅ VERIFIED Profile "Learn from" (NW-06b) replaces the old "Follow" label in the talent profile hero (`COPY.learnFrom`; the recruiter copy keeps "Follow"). It toggles following: the person joins the "Learning from" tab and no request is sent; pressed it reads "Following".

## Right column and profile cards (2026-11-22)

✅ VERIFIED Figma REST (talent file, all 24 NW frames, texts + structure): the current frames draw "Grow your crew" (NW-01 … NW-05, NW-10, NW-11; "2 of 4 done · +20 pts each" Focused, "+20 XP each" Playful), "Mentors to learn from" with 148x56 "Learn from" buttons (NW-01 … NW-03, NW-11), "Linked up 2 days ago" (NW-05), "You both know · 8" (NW-06 … NW-08), no "Learn from" in the connected hero (Message · In your crew · "…"), gender-neutral dialog lines ("seen them use", "How do you know their skills?", "trust their profile", "working with them?", "show it on their profile"), NW-10 right rail (9 / 2 Mentors / 14 Classmates on GTH, new tip, parent "Mrs. Efua Asamoah", grow 1 of 4), NW-11 tabs "Invitations · Crew · 0 · Learning from · 0" and right rail. No prototype links on any of these controls.

Built (one component per element, recruiter visually unchanged — RC-NW01 … RC-NW11 re-measured, identical to recruiter-community-network.md):

- `CircleMiniPeopleCard.jsx` (new): the single "people list" right-rail card. `NetworkMentorsCard`, `NetworkYouBothKnowCard` and `CircleFeedSide` are now thin wrappers (talent note text 12/14 as drawn, recruiter keeps 11/13; Playful gap 12).
- `NetworkSideColumn` / `NetworkGrowCard` / `NetworkMentorsCard` read the audience's blocks from `useCircleVariantData()` (`grow`, `mentorsCard`); `NetworkGrowCard` takes `progressPlayful` (both lines in the DOM, `playful:` shows one) and the Playful bar ring.
- `circleData.js`: `CIRCLE_GROW`, `CIRCLE_MENTORS_CARD`, `youBothKnow` on Yaw (recruiter now inherits it), MINOR / EMPTY rail data, copy updates; `recruiterCircleData.js` reuses the talent connection rows.
- `CirclePage`: demo screens use `NetworkSideColumn` for talent too (main tabs, under 18, empty — two columns in both looks; Figma's Focused NW-11 puts the rail past the frame edge), minor / empty tab counts and switch badge as drawn. `CircleProfilePage`: "You both know" for talent, connected hero without Learn from, "…" wired.

Destinations (⚠️ ASSUMPTION unless noted, no Figma links):
| Control | Goes to |
| --- | --- |
| Grow · Add your school | `/profile` (same as the empty state's "Find classmates") |
| Grow · Join 2 clubs / Join a school club | `/community` (Clubs) |
| Grow · Link up with 5 people / 3 classmates | Discover, scrolled to the suggestions |
| Grow · Learn from 1 verified mentor | Discover (under 18), scrolled to "Verified mentors to follow" |
| Grow · Invite a friend on WhatsApp | the shell's Invite a friend dialog (`&dialog=invite`, has WhatsApp) |
| Mentors · Learn from | toggles following (→ "Following"), as the cards |
| Mentors · See all | Discover, scrolled to the suggestions |
| Profile · You both know rows | that person's profile |
| Profile · See all 8 | crew list (`&tab=circle`) |
| Profile hero "…" | crew list with this person's menu open (`&tab=circle&menu=<id>`) |

Live (signed-in): the grow checklist, mentors card and "You both know" stay hidden — the circle API has no checklist, mentor list or mutual-people list (backend gap). "Linked up {ago}" is used for live connections too.
Kept as decided earlier (not rebuilt): the Buddy tip "Talents with 50+ people … 3× more recruiter views", "NOTES GET 2× MORE YESES" (unsourced, RQ-11) and "+5 XP · NEW CONNECTION" (US-5.3.1-02). ❓ NEEDS-CLARIFICATION: the grow card's "+20 XP / pts each" is drawn as Figma shows, although connections earn no XP (US-5.3.1-02).
Still different: NW-10 Focused draws a 4th classmate (Ama Kumi), Playful a 3rd mentor (Nana Ama Asante) and other mutual counts (left as drawn per look, not built); the "New" rail tag.

## Playful card grid and photos (2026-11-22)

✅ VERIFIED Figma REST: Playful `Circle grid` = three cards per row of the 1058px column (cards ~330 wide, 16px between cards, 28px between rows), card photo ~329x252, TOP PICK sticker at the photo's top-left, name / headline #6b6b6b over the gradient (as drawn), mutual line 12/14. Built in `CircleCardGrid.jsx` (Playful `repeat(auto-fill, minmax(300px, 1fr))`: 3 columns at 1728, 2 at 1280, 1 on phones; no horizontal scroll at 390 / 1024 / 1280) and `CirclePersonCardPlayful.jsx`. Focused grid unchanged (Figma: 2 × ≤520px, as before).
Photos: the current frames draw six portraits (Figma image fills, the same in both looks) and reuse them: Esi Quaye and Afia Boakye = Akosua Mensah's, Nana Yaw Mensah and Kwesi Ofori = Kojo Annan's, Adwoa Sarpong = Efua Asante's, Selorm Agbeko = Yaw Darko's, Ama Kumi and Nana Ama Asante = Abena Owusu's. New files `src/assets/talent-circle/people/crew-person-<name>-{card,hero,avatar}.png` (+ `crew-person-yaw-darko-profile.png`), cut from the Figma originals the way Figma's fill draws them (centred cover, 2x); `circlePhotos.js` remapped; the 30 old talent photo files were deleted (nothing else imports them). The recruiter map (`recruiterCirclePhotos.js`) and the Home "People to link up with" photos (`src/assets/talent-home/home/crew-*`) are separate files and were not changed.
