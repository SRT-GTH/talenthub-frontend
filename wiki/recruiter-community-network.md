# Recruiter Community · My network — `/recruiter/community?view=circle…`, `/recruiter/community/people/:personId`

Figma file `OHG2xsfCCskT8xEn356njv`, canvas `10026:36840` "Recruiter - Community Engagement", section "My network" (RC-NW01 … RC-NW11, 12 frames, one style, 1728 wide). Converted 1:1 from the talent My circle screens ([talent-my-circle.md](talent-my-circle.md)): the SAME page components serve both audiences, the variant is read from the URL (`communityVariant.js`). Mock data only, state in the URL. Built 2026-11-06.

## Frame → URL (all with `&rail=collapsed`, the icon rail the frames draw; without it the recruiter profile-card sidebar shows)

Diff = `framecmp` (focused-only copy, viewport = frame height − 52). "Before" = the talent page served at the recruiter URL (talent shell, talent copy; a few before-numbers were blank cold loads, so unreliable).

| Frame                                         | URL (prefix `/recruiter/community`)                     | Diff before → after |
| --------------------------------------------- | ------------------------------------------------------- | ------------------- |
| RC-NW01 Grow `10194:30390`                    | `?view=circle`                                          | 9.1 → 5.7           |
| RC-NW02 Connect · add a note `10194:31065`    | `?view=circle&modal=connect&person=abena-owusu&draft=1` | 45.6\* → 11.6\*\*   |
| RC-NW03 Request sent `10194:31758`            | `?view=circle&state=sent`                               | 7.6 → 4.5           |
| RC-NW04 Invitations `10194:32437`             | `?view=circle&tab=invitations&state=accepted`           | 4.1 → 4.5           |
| RC-NW05 Connections `10194:32931`             | `?view=circle&tab=circle&menu=yaw-darko`                | 3.5 → 3.4           |
| RC-NW06 Profile · connected `10194:33426`     | `/people/yaw-darko`                                     | 5.5 → 2.0           |
| RC-NW06b not connected `10194:33917`          | `/people/yaw-darko?state=not-connected`                 | 5.4 → 2.0           |
| RC-NW07 Endorse · alternative `10194:34407`   | `/people/yaw-darko?modal=endorse`                       | 14.0 → 3.3          |
| RC-NW08 Recommend · alternative `10194:34913` | `/people/yaw-darko?modal=recommend`                     | 14.0 → 3.3          |
| RC-NW09 Feed `10194:35419`                    | `?view=circle&tab=feed`                                 | 3.6 → 3.1           |
| RC-NW10 Under 18 `10194:35875`                | `?view=circle&state=minor`                              | 6.6 → 10.0\*\*\*    |
| RC-NW11 Empty `10194:36508`                   | `?view=circle&state=empty`                              | 5.1 → 6.6\*\*\*\*   |

\* blank cold load. \*\* Figma centres the dialog in the Safari-inclusive frame, we centre it in the viewport. \*\*\* the Hidden-from-recruiters notice is drawn in flow (see assumptions) so everything below shifts about 100px. \*\*\*\* Figma's right rail is cut off by the frame edge; we draw the normal two columns.
The shell (top bar "Kofi A." vs "Joel K.", search placeholder, rail "New" tag, Ask Buddy FAB) is the lead's DashboardShell and accounts for most of the 3-5 % floor.
Text check (every Figma string vs the page, `texts.py`): 0 missing in all 12 frames except the "132 / 300" counter of NW02 (we count live).

## What changed

- NEW `circle/recruiterCircleData.js` (data + copy), `recruiterCirclePhotos.js`, `useCircleVariantData.js` (hooks `useCircleVariantData`, `useCircleCopy`, `useCirclePhotos`, `useCircleLinks`, `useCircleSplitGrid`), `CirclePersonLink.jsx`, `NetworkGrowCard.jsx`, `NetworkMentorsCard.jsx`, `NetworkYouBothKnowCard.jsx`, `NetworkSideColumn.jsx`, `NetworkHiddenNotice.jsx`, `NetworkRestrictionDialog.jsx`.
- Existing circle components read copy / people / photos / hrefs through `useCircleVariantData()` instead of importing the talent data directly (talent values are the untouched `circleData.js` exports, so talent renders as before). `CircleFrame` renders the recruiter `DashboardShell` on recruiter URLs. `CircleSwitch` is "Clubs | My network 3"; `CommunitiesSwitchSlot` drops the "Create a community" button for recruiters (RC-C01 has "Host a company club" in its header). `CircleSkillsCard` got `inviteLabel` / `onInvite` / `onPromptClick`; `CircleProfileHero` got `showFollowWhenConnected` / `showMore`; `CircleTabs` accepts `counts.x === false` (label without count); `CircleButton` keeps an icon + text label on one line for recruiters.
- `CirclePage` / `CircleProfilePage` (recruiter = always the drawn mock, never live): right rail = stats + Hiring Assistant tip, "Grow your network" checklist, "Mentors and hiring partners" (Discover and empty only), parent card (under 18); profile: "Invite to apply" replaces Endorse, no Follow when connected, "You both know · 8" card, the switch above the hero.
- Assets (`src/assets/recruiter/community/`): `network-talent-card-{abena-owusu,yaw-darko,efua-asante,kwame-boateng,akosua-mensah,kojo-annan}.png`, `network-invitation-avatar-{esi-quaye,nana-yaw-mensah,adwoa-sarpong}.png`, `network-profile-photo-yaw-darko.png`, `network-hiring-assistant-avatar.png`, `network-icon-lock-amber.svg`, `network-icon-sparkles-green.svg`. Figma reuses one photo for several people (Ama Kumi = Abena's, Kwesi = Kojo's, Afia = Akosua's, Selorm = Yaw's, Adwoa's card = Efua's), so they share a file.

## Figma inconsistencies kept as drawn

- Talent profile still says "Endorse skills you have seen Yaw use" next to "Invite to apply" buttons (a recruiter cannot endorse); NW06b "Link up with Yaw to endorse their skills".
- NW02 note "Hi Abena, we both recruit in Data Science Ghana…" although Abena is a data analyst intern.
- NW04 still "Invitations · 3" after Nana Yaw is accepted; NW10 the "My network" switch shows 1 and tabs Network · 9 while a 15-year-old's grow checklist says "Add your company page".
- NW11 draws the right rail beyond the frame edge (x 1721); NW10 notice floats over the switch (see below).
- Dialog title font Bricolage Grotesque (NW07/08), all other text SF Pro Rounded.

## ⚠️ ASSUMPTIONS (invented, not in Figma)

- "Sent · 2" rows (Akosua Mensah, Kojo Annan); "Invite to apply" (per skill and in the dialog) shows a toast "Choose a live role to invite {first} to apply"; "Save to list" toast "{first} saved to your list"; the prompt line "Endorse skills you have seen …" is a button that opens the NW07 dialog; "See all 8" opens My network; grow-card steps are inert; bar fill = done / total.
- NW10 notice drawn in flow above the switch (Figma floats it over "My network"), max 1100px.
- NW11: two-column layout with the normal right rail; "Find classmates" → `/recruiter/home` (no company-page route), "Join a club" → Clubs, "Invite a friend" copies a link.
- Generic profile for any person but Yaw; Message goes to `/recruiter/messages`; persona colour Forest Green not used (no frame draws it here).
- Follow / Following / mute / remove toasts are session-only (circleStore).

## Not verified

Hover/active states, Playful (not applicable), real keyboard walkthrough beyond the Playwright spec, 320/390 pixel comparison against Figma (no phone frames), live backend (recruiter is mock only).

## Checks

`tests/e2e/recruiter-community-network.spec.js` (12 tests). Responsive audit 320 / 390 / 1024 / 1440 over all 12 URLs: no horizontal scroll, no text under 12px below lg, no page errors (the shell's `/copy/bundle` API 500s are ignored). Targets under 24px remain only at ≥ lg where Figma draws them (20px × dismiss, 17px text links).
