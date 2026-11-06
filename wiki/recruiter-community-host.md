# Recruiter Community · Host a company club (`/recruiter/community/create`, `/recruiter/community/:communityId/manage`)

Figma file `OHG2xsfCCskT8xEn356njv`, canvas `10026:36840` "Recruiter - Community Engagement", section "RECRUITER · COMMUNITY · Host a company club" (RC-CC02 … RC-CC17b, ids `10194:24608` … `10194:30080`, 19 frames, one visual style, 1728 wide). "Converted 1:1 from talent": the same screens as [talent-community-create.md](talent-community-create.md), with club copy, the recruiter shell and a few data changes. Mock data only. Built 2026-11-06 (host agent).

## How it works

The SAME pages serve both audiences; the variant comes from the URL (`communityVariant.js`). Talent behaviour is the default of every edit.

- `create/useCreateCommunityCopy.js` returns the copy blocks for the variant (talent = `createCommunityData.js`, unchanged; recruiter = `create/recruiterCreateCommunityData.js`, the talent block with the Figma-changed strings laid over it) plus `base` for links. Every wizard / dialog / owner component reads copy through it.
- `recruiterCreateCommunityData.js` also holds the recruiter fixtures (`buildRecruiterOwnedCommunity`, `buildRecruiterSubmittedCommunity`: owner "Joel Adade Kofie", pending-invite moderator "Michael Asante").
- `createCommunityStore.js`: `submitCommunity(draft, { recruiter })` and `useOwnedCommunity({ …, recruiter })` pick the fixture builder.
- `CommunityCreatePage` / `CommunityOwnerPage` / `CreateWizardDialog` / `OwnerHero`: every `/community…` link now uses `base`. The owner page mounts the "Clubs | My network" row (`ClubsSwitchRow`, clubs agent) and reads filters/composer copy from `useCommunityContent()` for recruiters.
- `TransferDialog`: additive `mod.transferName ?? mod.name`.

URL contract = talent's (`createCommunityState.js`), with `/recruiter/community` as the prefix.

## Frame → URL (focused/only style; diff = framecmp, viewport = frame height − 52)

Base for the owner rows: `/recruiter/community/agritech-innovators-ghana/manage`; add `&rail=collapsed` (the frames draw the collapsed rail; see "Lead must" below).

| Frame                           | URL                                                                       | Diff before → after |
| ------------------------------- | ------------------------------------------------------------------------- | ------------------- |
| CC02 Basics `…24608`            | `/recruiter/community/create?cat=software-engineering&step=basics&demo=1` | 4.3 → 4.4           |
| CC02b Name taken `…24835`       | `…&step=basics&state=name-taken`                                          | n/a → 4.1           |
| CC03 Who can join `…25050`      | `…&step=who&demo=1`                                                       | 4.6 → 4.8           |
| CC04 House rules `…25307`       | `…&step=rules&demo=1`                                                     | n/a → 3.8           |
| CC05 Review `…25566`            | `…&step=review&demo=1`                                                    | 4.7 → 4.7           |
| CC12 Not ready `…25804`         | `/recruiter/community/create?state=not-ready&cat=software-engineering`    | 3.7 → 3.9           |
| CC06 Under review `…26013`      | `…/manage?state=under-review`                                             | n/a → 5.4           |
| CC07 Waiting mentor `…26322`    | `…/manage?state=waiting-mentor`                                           | n/a → 5.3           |
| CC11 Needs a change `…26632`    | `…/manage?state=needs-change`                                             | 7.4 → 5.2           |
| CC08 Live + toast `…26941`      | `…/manage?state=live&toast=live`                                          | n/a → 5.9           |
| CC09 Invite people `…27250`     | `…/manage?state=live&modal=invite`                                        | n/a → 4.4           |
| CC10 Manage · reports `…27602`  | `…/manage?state=live&modal=manage&tab=reports`                            | 5.1 → 4.3           |
| CC13 Invite mentor `…27962`     | `…/manage?state=waiting-mentor&modal=mentor`                              | 4.9 → 4.1           |
| CC14 Join requests `…28318`     | `…/manage?state=live&modal=manage&tab=requests&requests=3`                | n/a → 3.9           |
| CC15 Settings `…28681`          | `…&tab=settings&requests=3`                                               | n/a → 3.9           |
| CC16 Transfer `…29047`          | `…/manage?state=live&modal=transfer`                                      | 5.1 → 4.3           |
| CC16b Transfer pending `…29412` | `…/manage?state=transfer-pending`                                         | n/a → 5.3           |
| CC17 Archive `…29721`           | `…/manage?state=live&modal=archive`                                       | n/a → 4.0           |
| CC17b Archived `…30080`         | `…/manage?state=archived`                                                 | 6.6 → 4.3           |

"n/a before" = the first run hit the lazy-route loader. Remaining diff is font metrics, gradients, the shell (expanded rail, "Kofi A." nav name: lead's files) and the browse page behind the wizard (clubs agent).

## Verbatim text check

Every Figma string (below the top bar, right of the sidebar for wizard frames) was compared with the page text/inputs for all 19 frames: everything matches except the items below.

## Figma inconsistencies kept as drawn

- CC02 draws "112 of 160 characters" beside a 105-character text: the page shows the real count (as talent).
- CC09 and CC10 draw a different page behind the dialog (Members 24, Events 2, "Active daily", "GTH + 3 members", founding members Ransford / Abigail / Ransford / Akosua) than CC08/CC14: we keep the live fixture behind.
- The pending-invite moderator is "Michael Asante" in CC10 and "Ransford Kudjoe" in CC16 (Transfer): kept via `transferName`.
- "Requests" tab only in CC14 and CC15 (as talent). Three portraits are reused for different people (Adjoa Boateng is drawn with a man's photo). CC02 draws a stray "Software engineering" browse filter behind a wizard whose topic is Agriculture.

## ⚠️ ASSUMPTIONS / not drawn

- Reviewer outcomes (approved, needs a change, mentor accepted) are URL-only; "Ask GTH a question" opens the shell Help pop-over; the owner page About / Members / Events tabs are inert; "Edit details" opens the wizard prefilled; eligibility passes in the real flow.
- Recruiter and talent share the sessionStorage key `gth.community.created.v1` (ids rarely collide).
- Hero faces, collage and mentor photos reuse the talent assets (the recruiter export is identical).
- Not verified: real (non-demo) edit/resubmit flows on the recruiter path beyond the e2e spec; phone-width pixel comparison.
