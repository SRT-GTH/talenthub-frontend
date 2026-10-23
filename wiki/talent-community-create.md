# Talent Community · Create your own community (`/community/create`, `/community/:communityId/manage`)

Figma file `Bin8roWL8sloyc36IgFMuT`, canvas "Talent - community Engagement": Playful section `8947:2928` ("Create your own community (talent-created, 20 Oct 2026)") and its Focused twin `8944:2672` — 19 frames each, same codes and copy. Mock data only (API-shaped). Built 2026-10-23.

CC-01 (the entry point) is drawn in neither section: the "Create a community" button sits in the Community browse header row next to the Communities | My circle switch (added by the My circle build, see [talent-my-circle.md](talent-my-circle.md)) and links to `/community/create`.

## Status

Every frame renders at its URL in both styles and was compared with its Figma 0.5x export (framecmp, viewport = frame height − 52; community-create agent's run, not yet independently re-run by the lead). Playful 3.2–6.2 %, Focused 2.6–5.2 %; the wizard frames are the high end (Figma centres the dialog 26 px lower than our viewport does, and the Community browse page behind it is a different page). Layout of CC-02, CC-05, CC-06, CC-10, CC-12 (Playful) and CC-03 (Focused) was checked by eye against the frames.

| Frame                                             | URL (Playful and Focused)                                        | P       | F       |
| ------------------------------------------------- | ---------------------------------------------------------------- | ------- | ------- |
| CC-02 Basics `8947:98`                            | `/community/create?cat=software-engineering&step=basics&demo=1`  | 5.5     | 4.7     |
| CC-02b Name taken `8947:2930`                     | `…&step=basics&state=name-taken`                                 | 5.4     | 4.4     |
| CC-03 Who can join `8947:3582`                    | `…&step=who&demo=1`                                              | 5.8     | 5.0     |
| CC-04 House rules `8947:4275`                     | `…&step=rules&demo=1`                                            | 5.0     | 4.1     |
| CC-05 Review and submit `8947:4952`               | `…&step=review&demo=1`                                           | 6.2     | 5.2     |
| CC-12 Not ready yet `8947:5632`                   | `/community/create?state=not-ready&cat=software-engineering`     | 5.3     | 4.1     |
| CC-06 Under review `8948:98`                      | `/community/agritech-innovators-ghana/manage?state=under-review` | 3.2–3.7 | 2.6–3.2 |
| CC-07 Waiting for a verified mentor `8948:751`    | `…/manage?state=waiting-mentor`                                  | ″       | ″       |
| CC-11 Needs a change `8948:1310`                  | `…/manage?state=needs-change`                                    | ″       | ″       |
| CC-08 Live + toast `8948:1868`                    | `…/manage?state=live&toast=live`                                 | ″       | ″       |
| CC-09 Invite people `8948:2365`                   | `…/manage?state=live&modal=invite`                               | 3.5–4.5 | 3.1–4.2 |
| CC-10 Manage · reports and moderators `8948:4809` | `…/manage?state=live&modal=manage&tab=reports`                   | ″       | ″       |
| CC-13 Invite a verified mentor `8954:128`         | `…/manage?state=waiting-mentor&modal=mentor`                     | ″       | ″       |
| CC-14 Manage · join requests `8954:2637`          | `…/manage?state=live&modal=manage&tab=requests&requests=3`       | ″       | ″       |
| CC-15 Manage · settings `8954:3421`               | `…&tab=settings&requests=3`                                      | ″       | ″       |
| CC-16 Transfer ownership `8954:4310`              | `…/manage?state=live&modal=transfer`                             | ″       | ″       |
| CC-16b Transfer pending `8954:5004`               | `…/manage?state=transfer-pending`                                | 3.2–3.7 | 2.6–3.2 |
| CC-17 Archive (confirm) `8954:5585`               | `…/manage?state=live&modal=archive`                              | 3.5–4.5 | 3.1–4.2 |
| CC-17b Archived `8954:6276`                       | `…/manage?state=archived`                                        | 3.2–3.7 | 2.6–3.2 |

All the manage URLs take `&rail=collapsed` (the frames draw the collapsed rail).

## Code map

`src/components/sections/talentCommunity/create/` (31 files: state hook with the URL contract at the top, API-shaped mock data, wizard steps, owner page parts, dialogs), `src/pages/talentCommunity/create/CommunityCreatePage.jsx` and `CommunityOwnerPage.jsx`, asset `src/assets/talent-community/create/cover-upload-thumbnail.png`. Shared edits (add-only): `App.jsx` (2 lazy imports + 2 routes), `pages/talentCommunity/CommunityPage.jsx` (+5 lines: owner redirect), `tests/e2e/helpers/responsive.js` (19 URLs).

## Real interaction (Playwright, Playful pass after the last fix; the Focused run partly lost to a network drop)

Wizard 4 steps with regions and rule edit/add, submit → under review; mentor invite; reload keeps the community; edit prefills the wizard; keep report, approve, approve all; transfer (send / cancel); archive (then restore); invite; name-taken suggestion; "Not now" on the eligibility screen; mentor dialog search.

## Known gaps / assumptions

- ⚠️ ASSUMPTION: eligibility passes in the real flow; a new draft starts empty; the owner page About / Members / Events tabs are inert; "Edit details" opens the wizard prefilled; reviewer outcomes (approved, needs a change, mentor accepted) are URL-only, there is no demo control.
- Figma inconsistencies kept: "112 of 160 characters" beside a 105-character text (we show the real count); Focused CC-09 and CC-10 draw a different page behind the dialog; the "Requests" tab appears only in CC-14 and CC-15; three portraits are reused for different people.
- Not verified: the final errscan of every URL; the Focused phone widths of the later wizard steps at 390 (timeouts); `/community` and `/home` after the `CommunityPage.jsx` edit (the lead re-checked `/community`, see log). Headless talent pages redirect to `/login` unless `/api/**` is stubbed; the audit scripts use the demo params.
