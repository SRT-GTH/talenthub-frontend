# Recruiter Community · Clubs (`/recruiter/community…`)

> Figma file `OHG2xsfCCskT8xEn356njv`, canvas `10026:36840` "Recruiter - Community Engagement", section "RECRUITER · COMMUNITY · Clubs": 17 frames RC-C01 … RC-C17 (`10194:18909` … `10194:24251`), one visual style, 1728 wide. They are the talent Community screens ([talent-community.md](talent-community.md)) with recruiter copy ("clubs"). Checked 2026-11-06, mock data, frontend only. `🔗 EXTERNAL`

## How it works

The SAME page components serve both audiences. The variant comes from the URL (`communityVariant.js`). New this pass:

- `recruiterCommunityData.js`: only what differs from the talent data (spread from `communityData.js`, so they cannot drift): browse copy ("Find your future hires", "Host a company club", "Picked for your open roles" …), club page copy ("Join club", "Share club", "Hiring" filter, "Link up" / "In your network", Event / Share a role / Hiring update composer), "Case study" post kind, About rules, dialogs (create / report / leave / milestone), pending post author.
- `communityContent.js`: `useCommunityContent()` returns the talent or the recruiter content set plus `base`; components read their copy from it and never branch on the audience.
- `ClubsSwitchRow.jsx`: mounts the network section's `CircleSwitch` ("Clubs | My network") above the hero on the recruiter club and post pages (the frames draw it on every club screen; the talent page has none).
- Edited (additive, talent unchanged): `CommunityBrowsePage`, `CommunityPage`, `CommunityPostPage`, `CommunityBrowseParts` (header "Host a company club" button, `HostClubTile`, recruiter `NoResults` buttons), `CommunityCard`, `CommunityJoinedMenu`, `CommunityPageParts`, `CommunityFeedParts`, `CommunityTabPanels`, `CommunityDialogs`, `MilestoneShareModal` (prop `copy`), `CommunityPendingParts`, `PostComments`. Every `/community…` link uses `base`.

## Frame → URL (Focused, framecmp at viewport = frame height − 52)

"After" diffs were taken with the rail collapsed through the sidebar toggle for the frames that draw the icon rail (see Lead items). Before = the first run on the lead's foundation (loader screenshots excluded).

| Frame                            | URL                                                                                  | Diff before → after |
| -------------------------------- | ------------------------------------------------------------------------------------ | ------------------- |
| RC-C01 browse `10194:18909`      | `/recruiter/community`                                                               | (loader) → 3.9%     |
| RC-C02 filtered + menu `…:19075` | `/recruiter/community?menu=joined&cat=software-engineering`                          | 4.6 → 3.7%          |
| RC-C03 all `…:19244`             | `/recruiter/community?view=all`                                                      | 4.8 → 3.1%          |
| RC-C04 preview `…:19423`         | `/recruiter/community/frontend-devs-ghana?rail=collapsed`                            | 9.6 → 3.7%          |
| RC-C05 just joined `…:19736`     | `…/frontend-devs-ghana?joined=1&welcome=1&rail=collapsed`                            | (loader) → 4.6%     |
| RC-C07 post + comments `…:20114` | `…/frontend-devs-ghana/post/yaa-first-pr?rail=collapsed`                             | 8.2 → 6.2%          |
| RC-C08 create post `…:20584`     | `…/frontend-devs-ghana?joined=1&modal=create&rail=collapsed`                         | 4.8 → 3.8%          |
| RC-C10 report `…:20994`          | `…?joined=1&modal=report&rail=collapsed`                                             | (loader) → 6.6%     |
| RC-C17 leave `…:21392`           | `…?joined=1&modal=leave&rail=collapsed`                                              | 8.1 → 6.5%          |
| RC-C11 About `…:21770`           | `…?joined=1&tab=about&rail=collapsed`                                                | 6.8 → 3.7%          |
| RC-C12 Members `…:22078`         | `…?joined=1&tab=members&rail=collapsed`                                              | 7.1 → 4.0%          |
| RC-C13 pending `…:22405`         | `…?joined=1&pending=1&rail=collapsed`                                                | 9.5 → 5.2%          |
| RC-C14 empty `…:22831`           | `/recruiter/community/agritech-innovators-ghana?joined=1&state=empty&rail=collapsed` | 7.6 → 4.0%          |
| RC-C15 loading `…:23138`         | `/recruiter/community?state=loading`                                                 | 3.2 → 3.5%          |
| RC-C16 no results `…:23383`      | `/recruiter/community?q=blockchain`                                                  | (loader) → 4.6%     |
| RC-C09 milestone `…:23552`       | `/recruiter/community?modal=milestone&rail=collapsed`                                | 10.7 → 10.6%        |
| RC-C06 feed `…:24251`            | `…/frontend-devs-ghana?joined=1&rail=collapsed`                                      | 9.3 → 4.6%          |

Remaining known diffs: shell (top bar reads "Kofi A." / "Search opportunities, skills, communities…" instead of "Joel K." / "Search talent, jobs and clubs…"; the Ask Assistant fab is drawn only on RC-C01 and shows on all of ours); dialogs sit centred in our viewport but Figma centres them as if the frame were 1117 high (C10 / C17 / C08 offset); RC-C09 Figma draws the dialog over a copied talent onboarding chat page ("Emma", "Hiring Assistant", Talent Profile Panel, not reproduced; ours is over the Clubs page); font metrics.

## Verbatim text check

Every Figma string of the 17 frames was compared with the page text (`texts.py` vs innerText, placeholders, input values, `data-count`): nothing missing except the shell items above, the CSS-generated counters (tab counts, "+1" veil, reason sub-lines are rendered with `content: attr(data-count)` and found through the attribute), and the opacity-0 "9 friends are here" header art.

## Figma inconsistencies kept as drawn

- RC-C12: Abigail Mensah's button says "Follow" while the others say "Link up" (`idleLabel`; turns into "In your network" on click, back to "Link up").
- RC-C12: Samuel Boateng is "HR Lead · Silver Rock Technology" (a recruiter in a talent member list); city kept Kumasi for "Near you".
- Hackathons Ghana: "New event Sat" (RC-C01) vs "Active daily" (RC-C16); RC-C16 shows Software Engineering Ghana as "Join" although it is joined on RC-C01.
- RC-C14 "You + 23 others" (corrected from talent's 1,239) while the tab count stays 24.
- RC-C09 background is the talent onboarding chat; the milestone preview avatar is the same illustration for Joel.
- Per-frame card gaps 24 / 20 / 14 (as on talent).

## ⚠️ ASSUMPTIONS (not drawn, not verified against Figma)

- The "Hiring" feed filter matches posts of kind "Hiring"; no drawn post is one, so it shows the empty-feed card.
- "Start it yourself" (primary, RC-C16) and both "Host a company club" links go to `/recruiter/community/create` (host agent's flow). No "Clear search" button is drawn on RC-C16, so recruiters clear via the field.
- "Request this club" counts you in (14 → 15 of 25) like talent; the host tile's "or request one" line is plain text.
- Recruiter and talent share one join / mute store (sessionStorage), seeded with Software Engineering Ghana joined.
- A comment added by the recruiter is signed "Joel Adade Kofie".
- `?menu=`, `?q=` and trending-tag links stay inside `/recruiter/community`.
- The "Clubs | My network" row on the club pages comes from the network agent's `CircleSwitch` (labels / links are theirs).

## Accessibility / responsive (Playwright, 320 / 390 / 1024 / 1440)

No horizontal overflow, no text under 12px below lg, one h1 per page, buttons on one line, dialogs keep role / aria-modal / Esc. Inline text links I own got `min-h-[24px]`; still under 24px (talent styling shared with the talent page, not changed): comment "Reply" / like in `postCommentStyles`, "+ tag" and the remove-link x in the create dialog. Cold lazy loads sometimes show the loader for several seconds.

## Tests

`tests/e2e/recruiter-community-clubs.spec.js`: 12 tests (every frame group, key strings, joins / leaves / filters / request / comment / Esc, talent regression via `?demo=1`). Console errors from the shell's unauthenticated API calls (`[talentHome.api] … 401`, `[api] 401`) are filtered.
