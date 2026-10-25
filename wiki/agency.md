# Agency portal — Theme 11 (`/agency/*`)

Figma file `Bin8roWL8sloyc36IgFMuT`, canvas **Persona · Government bodies (Theme 11 · agencies)** `8605:395409` — 8 sections (G1–G6, G2b, G3b), 114 frames (112 screens + 2 SUPERSEDED v1 PDF pages). **Focused only.** No dedicated Theme 11 story doc exists: the Figma frames are the acceptance criteria.

## What it is

A signed-in analyst portal for MoU holders (ministries / agencies). Persona in the frames: **Efua Owusu · Admin · Director, Research & Data · National Youth Authority (NYA)**. Home, sign-up + MoU verification, national data (Theme 8 views re-skinned in the agency shell, with Export CSV / Save query), demand & outcomes, saved queries, data requests (privileged, PM + DPO approval), briefing packs + A4 agency report, government programmes, settings and a public agency page. Counts under 5 are always `<5` (`formatCount` / `safeShare`, shared with Theme 8).

⚠️ ASSUMPTION: **no real auth** — `useAgencySession()` returns a mock signed-in session (`data/agencyCoreData.js`).

## Architecture

- Router: `src/pages/agency/AgencyApp.jsx` (mounted by `App.jsx` as `/agency/*`, outside `MainLayout`). Packages replace the stub pages `src/pages/agency/Agency<Name>Page.jsx` and add NO route to `App.jsx`.
- Chrome and shared logic: `src/components/sections/agency/` — `AgencyFrame` (page chrome), `AgencyTopBar`, `AgencySidebar` (+ `AgencyPersonaCard`, `AgencyNavItem`, `AgencyPageCard`), `AgencyBuddyFab`, `agencyState.js`, `agencyNav.js`, `agencyFormat.js`, `useAgencySession.js`, `data/agencyCoreData.js`, `agencyIcons.jsx` (Figma SVG exports), `AgencyStub`.
- Chrome behaviour: `>= xl` rail 303 (or the 80 icon rail with `?rail=collapsed`), `lg..xl` the 80 icon rail, `< lg` the phone / tablet top bar (menu · GTH · bell · avatar, frames 11.4.0d / 11.4.5o / 11.4.5p) with a drawer (`?drawer=1`). Page background = `DashboardPageBackground`. Ask Buddy: pill >= lg, 64px round button below.
- Each package owns a sub-folder of `components/sections/agency/` and its `data/<area>Data.js`. The profile popover is mounted by the frame while `?modal=profile`: package E replaces `settings/AgencyProfileMenu.jsx` (keep the props `{ data, session }`).
- MoU gate: `?mou=none|pending|needs-info|not-approved|approved` (default approved) overrides the session so every gated frame renders in the real chrome; `?quota=<0-100>` overrides the query-quota percentage (11.4.0c = 92).

## URL contract

Query keys shared by every screen (`agencyState.js`): `rail=collapsed`, `drawer=1`, `modal=<name>` (chrome reserves `profile`, `help`, `notifications`, `messages`, `a11y`, `language`; the last five are inert), `state=<name>`, `region= edu= interest= age= gender=` (Theme 8 names), `q=`, `tab= view= range=`, `tour=1|2|3`, mock overrides `mou=` and `quota=`. Packages add their own keys (never reuse these) and list them in their page header and in this page.

| Route                                                                                                                                                  | Frames               | Owner |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- | ----- |
| `/agency` (`?state=first-login`, `?quota=92`, `?modal=welcome`, `?tour=1..3`)                                                                          | 11.4.0a–d, 11.4.1e–h | A     |
| `/agency/welcome` → redirects to `/agency?modal=welcome`                                                                                               | 11.4.1e              | A     |
| `/agency/sign-up` (`?state=email-verified\|code-sent\|wrong-code\|already-registered`)                                                                 | 11.4.1a–a5           | A     |
| `/agency/mou` (`?view=list`), `/agency/mou/status?mou=`                                                                                                | 11.4.1b–d            | A     |
| `/agency/national` (+ `?map=`, `?modal=filters\|breakdown`, `?breakdown=`)                                                                             | 11.4.2a, d–j, 11.4.6 | B     |
| `/agency/regions/:regionId[/districts/:districtId]`, `/agency/compare`, `/agency/outcomes[/stories/:storyId]`, `/agency/trends`, `/agency/methodology` | 11.4.2b–c, k–r       | B     |
| `/agency/demand` (`?view=skills\|trends\|success`)                                                                                                     | 11.4.5               | B     |
| `/agency/data-requests[/new\|/:requestId]`                                                                                                             | 11.4.3               | D     |
| `/agency/briefing` (`?modal=download\|share\|digest`), `/agency/report?page=1..8` (A4, no chrome)                                                      | 11.4.4               | D     |
| `/agency/queries[/saved]`                                                                                                                              | 11.5.1               | C     |
| `/agency/programmes[/new\|/:programmeId[/applicants]]`, `/agency/applicants`, `/agency/districts`                                                      | 11.5.2               | C     |
| `/agency/settings[/:tab]` (profile · analysts · api-keys · notifications · mou · audit-log), `?modal=profile`, `/agency/public-page`                   | 11.6.0b, 11.6.1      | E     |

Rail highlight (`agencyNav.activeNavId`): regions, compare, outcomes, trends, methodology and briefing keep **National data** active; MoU status and settings keep **Home** (⚠️ ASSUMPTION).

## Shared components (reuse, do not rebuild)

- `AgencyFrame` — props `data` (`useAgencyState()`), `title`, `active`, `children`, `className`. Children are laid out as a column, 30px gap (16 on phones).
- `AgencyPageHero` — green banner: `title` (the page `<h1>`), `subtitle`, `actions`.
- `AgencyBanner` — dark green context card: `eyebrow`, `title`, children (body).
- `AgencyButton` — white shelf button: `size` xs|sm|md, `to`, `leftIcon`, `rightIcon`.
- `useAgencySession()` · `useAgencyState()` · `agencyFormat` (`formatCount`, `safeShare`, `formatQuota`, `formatDate`, `formatDateLong`, `formatMonthYear`, `quotaPercent`) · `AgencyStub`.
- From Theme 8: `publicData/ui/*` primitives (KpiTile, HeroMetric, BarList, FilterBar/FilterChip, SectionError, EmptyState …).

## Work packages

A home / sign-up / MoU / welcome (G1) · B national data, regions, compare, outcomes, methodology, demand & outcomes (G2, G2b) · C queries, programmes, applicants, districts (G4, G5) · D data requests, briefing packs, report print (G3, G3b) · E settings, profile menu, public agency page (G6).

## Frame checklist (⬜ not built · ✅ built and compared · — not a screen)

| Frame                                                                  | Figma id      | Size      | URL                                                                                            | Pkg | Status |
| ---------------------------------------------------------------------- | ------------- | --------- | ---------------------------------------------------------------------------------------------- | --- | ------ |
| 11.4.0a · Agency home · Default                                        | `8597:398287` | 1728×1833 | `/agency`                                                                                      | A   | ⬜     |
| 11.4.0b · Agency home · First login                                    | `8607:8`      | 1728×1264 | `/agency?state=first-login`                                                                    | A   | ⬜     |
| 11.4.0c · Agency home · Quota nearly used                              | `8607:502`    | 1728×1847 | `/agency?quota=92`                                                                             | A   | ⬜     |
| 11.4.0d · Agency home · Mobile                                         | `8613:8`      | 360×3604  | `/agency`                                                                                      | A   | ⬜     |
| 11.4.1a · Agency sign-up · Form                                        | `8596:8`      | 1728×1117 | `/agency/sign-up`                                                                              | A   | ⬜     |
| 11.4.1a2 · Agency sign-up · Email verified                             | `8596:481`    | 1728×1117 | `/agency/sign-up?state=email-verified`                                                         | A   | ⬜     |
| 11.4.1a3 · Agency sign-up · Email code sent                            | `8607:1188`   | 1728×1117 | `/agency/sign-up?state=code-sent`                                                              | A   | ⬜     |
| 11.4.1a4 · Agency sign-up · Wrong code                                 | `8607:1752`   | 1728×1117 | `/agency/sign-up?state=wrong-code`                                                             | A   | ⬜     |
| 11.4.1a5 · Agency sign-up · Agency already registered                  | `8607:2242`   | 1728×1117 | `/agency/sign-up?state=already-registered`                                                     | A   | ⬜     |
| 11.4.1b · MoU · Upload                                                 | `8596:988`    | 1728×1287 | `/agency/mou`                                                                                  | A   | ⬜     |
| 11.4.1b2 · MoU · Documents list                                        | `8596:1290`   | 1728×1341 | `/agency/mou?view=list`                                                                        | A   | ⬜     |
| 11.4.1c · MoU status · Pending                                         | `8596:1641`   | 1728×1264 | `/agency/mou/status?mou=pending`                                                               | A   | ⬜     |
| 11.4.1c2 · MoU status · Needs more info                                | `8607:2710`   | 1728×1264 | `/agency/mou/status?mou=needs-info`                                                            | A   | ⬜     |
| 11.4.1c3 · MoU status · Not approved                                   | `8607:3192`   | 1728×1264 | `/agency/mou/status?mou=not-approved`                                                          | A   | ⬜     |
| 11.4.1d · MoU status · Approved                                        | `8596:2133`   | 1728×1264 | `/agency/mou/status?mou=approved`                                                              | A   | ⬜     |
| 11.4.1e · Welcome · Akwaaba modal                                      | `8607:3674`   | 1728×1264 | `/agency?modal=welcome`                                                                        | A   | ⬜     |
| 11.4.1f · Welcome tour · Step 1 of 3                                   | `8607:4253`   | 1728×1264 | `/agency?tour=1`                                                                               | A   | ⬜     |
| 11.4.1g · Welcome tour · Step 2 of 3                                   | `8607:4771`   | 1728×1264 | `/agency?tour=2`                                                                               | A   | ⬜     |
| 11.4.1h · Welcome tour · Step 3 of 3                                   | `8607:5326`   | 1728×1264 | `/agency?tour=3`                                                                               | A   | ⬜     |
| 11.4.2a · Agency · National data dashboard                             | `8596:389705` | 1728×2334 | `/agency/national`                                                                             | B   | ⬜     |
| 11.4.2b · Agency · District breakdown                                  | `8596:390374` | 1728×2038 | `/agency/national?view=districts`                                                              | B   | ⬜     |
| 11.4.2c · Agency · Trends, 24 months                                   | `8596:391034` | 1728×1311 | `/agency/trends`                                                                               | B   | ⬜     |
| 11.4.2d · National data · Loading                                      | `8605:395411` | 1728×2327 | `/agency/national?state=loading`                                                               | B   | ⬜     |
| 11.4.2e · National data · Section error                                | `8605:396047` | 1728×2327 | `/agency/national?state=error`                                                                 | B   | ⬜     |
| 11.4.2f · National data · Filtered                                     | `8605:396677` | 1728×2373 | `/agency/national?region=volta&interest=technology&age=18-24`                                  | B   | ⬜     |
| 11.4.2g · National data · Fewer than 5 hidden                          | `8605:397309` | 1728×1196 | `/agency/national?state=suppressed&region=upper-west&interest=technology&age=18-24`            | B   | ⬜     |
| 11.4.2h · National data · Map hover                                    | `8605:397702` | 1728×2327 | `/agency/national?map=hover&at=ashanti`                                                        | B   | ⬜     |
| 11.4.2i · National data · Region card pinned                           | `8605:398375` | 1728×2327 | `/agency/national?map=pinned&at=ashanti`                                                       | B   | ⬜     |
| 11.4.2j · National data · Keyboard focus                               | `8605:399061` | 1728×2389 | `/agency/national?map=keyboard&at=ashanti`                                                     | B   | ⬜     |
| 11.4.2k · Region · Greater Accra                                       | `8605:399743` | 1728×2038 | `/agency/regions/greater-accra`                                                                | B   | ⬜     |
| 11.4.2l · Region · Switcher open                                       | `8605:400401` | 1728×2038 | `/agency/regions/greater-accra?modal=region`                                                   | B   | ⬜     |
| 11.4.2m · Region · Low-data                                            | `8605:401097` | 1728×1196 | `/agency/regions/oti?state=low-data`                                                           | B   | ⬜     |
| 11.4.2n · Compare · 2 regions                                          | `8605:401492` | 1728×1511 | `/agency/compare?regions=greater-accra,ashanti`                                                | B   | ⬜     |
| 11.4.2o · Compare · Choose regions                                     | `8605:402028` | 1728×1511 | `/agency/compare?regions=greater-accra,ashanti&modal=compare`                                  | B   | ⬜     |
| 11.4.2p · Outcomes · Programme outcomes                                | `8605:402633` | 1728×1798 | `/agency/outcomes`                                                                             | B   | ⬜     |
| 11.4.2q · Outcomes · Case study                                        | `8605:403158` | 1728×2126 | `/agency/outcomes/stories/ama-k`                                                               | B   | ⬜     |
| 11.4.2r · How we count · Methodology                                   | `8605:403593` | 1728×2307 | `/agency/methodology`                                                                          | B   | ⬜     |
| 11.4.3a · Data requests · List                                         | `8597:8`      | 1728×1229 | `/agency/data-requests`                                                                        | D   | ⬜     |
| 11.4.3b · Data requests · New request                                  | `8597:536`    | 1728×1229 | `/agency/data-requests/new`                                                                    | D   | ⬜     |
| 11.4.3c · Data request · Pending                                       | `8597:1322`   | 1728×1264 | `/agency/data-requests/dr-1042?state=pending`                                                  | D   | ⬜     |
| 11.4.3d · Data request · Approved, access window                       | `8597:1820`   | 1728×1264 | `/agency/data-requests/dr-1042?state=approved`                                                 | D   | ⬜     |
| 11.4.3e · Data request · Rejected                                      | `8597:2323`   | 1728×1264 | `/agency/data-requests/dr-1042?state=rejected`                                                 | D   | ⬜     |
| 11.4.3f · Data request · Access ended                                  | `8609:8`      | 1728×1264 | `/agency/data-requests/dr-1042?state=ended`                                                    | D   | ⬜     |
| 11.4.3g · Data request · Needs more detail                             | `8609:518`    | 1728×1264 | `/agency/data-requests/dr-1042?state=needs-detail`                                             | D   | ⬜     |
| 11.4.3h · Data request · Approved dataset view                         | `8609:1012`   | 1728×2038 | `/agency/data-requests/dr-1042?state=approved&view=dataset`                                    | D   | ⬜     |
| 11.4.3i · Data request · Appeal                                        | `8609:1674`   | 1728×1264 | `/agency/data-requests/dr-1042?state=rejected&modal=appeal`                                    | D   | ⬜     |
| 11.4.4a · Briefing pack · Download options                             | `8605:404019` | 1728×2124 | `/agency/briefing?modal=download`                                                              | D   | ⬜     |
| 11.4.4b · Briefing pack · Building                                     | `8605:404723` | 1728×2124 | `/agency/briefing?modal=download&state=building`                                               | D   | ⬜     |
| 11.4.4c · Briefing pack · Share with a colleague                       | `8605:405419` | 1728×2124 | `/agency/briefing?modal=share`                                                                 | D   | ⬜     |
| 11.4.4d · Briefing pack · Link copied                                  | `8605:406168` | 1728×2124 | `/agency/briefing?modal=share&state=copied`                                                    | D   | ⬜     |
| 11.4.4e · Briefing pack · Monthly digest                               | `8605:406838` | 1728×2124 | `/agency/briefing?modal=digest`                                                                | D   | ⬜     |
| 11.4.4f · Briefing pack · PDF cover · v1 (superseded by G3b agency rep | `8605:407544` | 794×1123  | —                                                                                              | D   | —      |
| 11.4.4g · Briefing pack · PDF content page · v1 (superseded by G3b age | `8605:407588` | 794×1123  | —                                                                                              | D   | —      |
| 11.4.4h · Briefing pack · Build failed                                 | `8605:407727` | 1728×2327 | `/agency/briefing?modal=download&state=failed`                                                 | D   | ⬜     |
| 11.5.1a · Queries · Build a query                                      | `8597:390953` | 1728×2327 | `/agency/queries`                                                                              | C   | ⬜     |
| 11.5.1b · Queries · Results                                            | `8597:391642` | 1728×2350 | `/agency/queries?state=results&region=volta&interest=technology&age=18-24`                     | C   | ⬜     |
| 11.5.1c · Queries · Save query                                         | `8597:392289` | 1728×2327 | `/agency/queries?state=results&modal=save-query&region=volta&interest=technology&age=18-24`    | C   | ⬜     |
| 11.5.1d · Queries · Export CSV                                         | `8597:392997` | 1728×2327 | `/agency/queries?state=results&modal=export&region=volta&interest=technology&age=18-24`        | C   | ⬜     |
| 11.5.1e · Queries · Saved queries                                      | `8609:2458`   | 1728×1229 | `/agency/queries/saved`                                                                        | C   | ⬜     |
| 11.5.1f · Queries · No results                                         | `8609:3056`   | 1728×1196 | `/agency/queries?state=zero&region=upper-west&interest=technology&age=18-24`                   | C   | ⬜     |
| 11.5.1g · Queries · Results with profile filters                       | `8707:421070` | 1728×2350 | `/agency/queries?state=results&profile=1&region=volta&interest=technology&age=18-24`           | C   | ⬜     |
| 11.5.1h · Queries · More filters drawer                                | `8707:421597` | 1728×2327 | `/agency/queries?modal=filters`                                                                | C   | ⬜     |
| 11.5.2a · Agency programme · Who can apply                             | `8597:393686` | 1728×1625 | `/agency/programmes/new`                                                                       | C   | ⬜     |
| 11.5.2b · Agency programme · Preview as a talent                       | `8597:394257` | 1728×1229 | `/agency/programmes/new?view=preview`                                                          | C   | ⬜     |
| 11.5.2c · Agency programme · Published                                 | `8597:394759` | 1728×1229 | `/agency/programmes/ysd-2026?state=published`                                                  | C   | ⬜     |
| 11.5.2d · Agency programme · Applicants                                | `8597:395315` | 1728×1440 | `/agency/programmes/ysd-2026/applicants`                                                       | C   | ⬜     |
| 11.5.2e · Agency programmes · All                                      | `8610:400592` | 1728×1196 | `/agency/programmes`                                                                           | C   | ⬜     |
| 11.5.2f · Agency programmes · Drafts                                   | `8610:401148` | 1728×1196 | `/agency/programmes?tab=drafts`                                                                | C   | ⬜     |
| 11.5.2g · Agency programme · Choose a template                         | `8610:401606` | 1728×1229 | `/agency/programmes/new?modal=template`                                                        | C   | ⬜     |
| 11.5.2h · Agency programme · Audience under 5                          | `8610:402145` | 1728×1625 | `/agency/programmes/new?state=audience-under-5`                                                | C   | ⬜     |
| 11.5.2i · Agency programme · Policy block                              | `8610:402716` | 1728×1625 | `/agency/programmes/new?state=policy-block`                                                    | C   | ⬜     |
| 11.5.2j · Agency programmes · Actions menu                             | `8610:403301` | 1728×1287 | `/agency/programmes?modal=actions&at=ysd-2026`                                                 | C   | ⬜     |
| 11.5.2k · Agency programmes · Close confirmation                       | `8610:403837` | 1728×1287 | `/agency/programmes?modal=close&at=ysd-2026`                                                   | C   | ⬜     |
| 11.6.0b · Profile menu · Agency                                        | `8597:401228` | 1728×1833 | `/agency?modal=profile`                                                                        | E   | ⬜     |
| 11.6.1a · Settings · Agency profile                                    | `8611:8`      | 1728×1194 | `/agency/settings`                                                                             | E   | ⬜     |
| 11.6.1b · Settings · Analysts and roles                                | `8611:524`    | 1728×1424 | `/agency/settings/analysts`                                                                    | E   | ⬜     |
| 11.6.1c · Settings · Invite an analyst                                 | `8611:1012`   | 1728×1344 | `/agency/settings/analysts?modal=invite`                                                       | E   | ⬜     |
| 11.6.1d · Settings · Remove analyst access                             | `8611:1484`   | 1728×1196 | `/agency/settings/analysts?modal=remove`                                                       | E   | ⬜     |
| 11.6.1e · Settings · API keys (agency)                                 | `8597:397859` | 1728×1196 | `/agency/settings/api-keys`                                                                    | E   | ⬜     |
| 11.6.1f · Settings · Notifications                                     | `8611:1966`   | 1728×1549 | `/agency/settings/notifications`                                                               | E   | ⬜     |
| 11.6.1g · Settings · MoU and access                                    | `8611:2538`   | 1728×1271 | `/agency/settings/mou`                                                                         | E   | ⬜     |
| 11.6.1h · Settings · Audit log                                         | `8611:3022`   | 1728×1229 | `/agency/settings/audit-log`                                                                   | E   | ⬜     |
| 11.6.1i · Agency page · Public view                                    | `8611:3509`   | 1728×1432 | `/agency/public-page`                                                                          | E   | ⬜     |
| 11.4.5a · Agency · Demand & outcomes · Skill demand                    | `8702:9`      | 1728×2646 | `/agency/demand`                                                                               | B   | ⬜     |
| 11.4.5b · Agency · Skill demand · Filtered by a skill                  | `8702:416796` | 1728×2646 | `/agency/demand?skill=data-analysis`                                                           | B   | ⬜     |
| 11.4.5c · Agency · Skill demand · District drill-down, low data        | `8702:417645` | 1728×2628 | `/agency/demand?region=greater-accra&district=ada-west&state=low-data`                         | B   | ⬜     |
| 11.4.5d · Agency · Skill demand · No results                           | `8702:418724` | 1728×1618 | `/agency/demand?state=empty`                                                                   | B   | ⬜     |
| 11.4.5e · Agency · Demand & outcomes · Trends · Monthly                | `8704:8`      | 1728×2202 | `/agency/demand?view=trends`                                                                   | B   | ⬜     |
| 11.4.5f · Agency · Trends · Weekly, last quarter                       | `8704:417733` | 1728×2176 | `/agency/demand?view=trends&range=quarter&by=week`                                             | B   | ⬜     |
| 11.4.5g · Agency · Trends · Custom date range open                     | `8705:417651` | 1728×2202 | `/agency/demand?view=trends&modal=date-range`                                                  | B   | ⬜     |
| 11.4.5h · Agency · Trends · Long range, generating in background       | `8705:418452` | 1728×1739 | `/agency/demand?view=trends&range=long&state=generating`                                       | B   | ⬜     |
| 11.4.5i · Agency · Demand & outcomes · Success rates · All             | `8706:8`      | 1728×2345 | `/agency/demand?view=success`                                                                  | B   | ⬜     |
| 11.4.5j · Agency · Success rates · Government programmes               | `8706:418217` | 1728×2244 | `/agency/demand?view=success&source=programmes`                                                | B   | ⬜     |
| 11.4.5k · Agency · Success rates · Recruiter opportunities             | `8706:418941` | 1728×2375 | `/agency/demand?view=success&source=opportunities`                                             | B   | ⬜     |
| 11.4.5l · Agency · Success rates · View by open                        | `8706:419788` | 1728×2345 | `/agency/demand?view=success&modal=view-by`                                                    | B   | ⬜     |
| 11.4.6a · National data · More filters drawer · Default                | `8707:418322` | 1728×2334 | `/agency/national?modal=filters`                                                               | B   | ⬜     |
| 11.4.6b · National data · More filters drawer · With selections        | `8707:419215` | 1728×2380 | `/agency/national?modal=filters&region=volta&interest=technology&age=18-24`                    | B   | ⬜     |
| 11.4.6c · National data · More filters drawer · Too few after combinin | `8707:419949` | 1728×2380 | `/agency/national?modal=filters&state=too-few&region=upper-west&interest=technology&age=18-24` | B   | ⬜     |
| 11.4.6d · National data · Breakdown · View by open                     | `8707:422622` | 1728×2334 | `/agency/national?modal=breakdown`                                                             | B   | ⬜     |
| 11.4.6e · National data · Breakdown · By personality type              | `8707:423161` | 1728×2334 | `/agency/national?breakdown=personality`                                                       | B   | ⬜     |
| 11.4.5m · Agency · Skill demand · Map with a suppressed region         | `8707:424737` | 1728×2670 | `/agency/demand?state=suppressed-region`                                                       | B   | ⬜     |
| 11.4.5n · Agency · Success rates · Small programme, funnel suppressed  | `8707:425402` | 1728×1924 | `/agency/demand?view=success&source=programmes&state=suppressed`                               | B   | ⬜     |
| 11.4.5o · Agency · Skill demand · Mobile                               | `8707:426318` | 360×1877  | `/agency/demand`                                                                               | B   | ⬜     |
| 11.4.6f · More filters · Mobile bottom sheet                           | `8707:426956` | 360×800   | `/agency/national?modal=filters`                                                               | B   | ⬜     |
| 11.4.5p · Agency · Skill demand · Tablet                               | `8707:427363` | 834×1189  | `/agency/demand`                                                                               | B   | ⬜     |
| 11.4.6g · More filters · Tablet side sheet                             | `8707:427584` | 834×1194  | `/agency/national?modal=filters`                                                               | B   | ⬜     |
| 11.4.4i v2 · Agency report · Cover                                     | `8932:18920`  | 1123×794  | `/agency/report?page=1`                                                                        | D   | ⬜     |
| 11.4.4j v2 · Agency report · Contents                                  | `8932:18939`  | 1123×794  | `/agency/report?page=2`                                                                        | D   | ⬜     |
| 11.4.4k v2 · Agency report · Section opener                            | `8932:18968`  | 1123×794  | `/agency/report?page=3`                                                                        | D   | ⬜     |
| 11.4.4l v2 · Agency report · Where young people are                    | `8932:18982`  | 1123×794  | `/agency/report?page=4`                                                                        | D   | ⬜     |
| 11.4.4m v2 · Agency report · Skills in demand                          | `8932:19136`  | 1123×794  | `/agency/report?page=5`                                                                        | D   | ⬜     |
| 11.4.4n v2 · Agency report · From programme to work                    | `8932:19260`  | 1123×794  | `/agency/report?page=6`                                                                        | D   | ⬜     |
| 11.4.4o v2 · Agency report · Programme stories                         | `8932:19309`  | 1123×794  | `/agency/report?page=7`                                                                        | D   | ⬜     |
| 11.4.4p v2 · Agency report · How we count                              | `8932:19360`  | 1123×794  | `/agency/report?page=8`                                                                        | D   | ⬜     |

## Build status (2026-10-25)

All six packages built and integrated: A (home, sign-up, MoU, welcome tour), B (national data, regions, compare, outcomes, trends, methodology, More filters drawer), B2 (demand & outcomes), C (queries, programmes, applicants), D (data requests, briefing dialogs, 8-page agency report), E (settings, profile menu, public agency page). 112 of 114 frames are screens (2 superseded). `/agency/districts` is a stub: no frame draws it.

Verified by the lead: `npm run build`, eslint on `src/pages/agency` + `components/sections/agency` + `publicData`, errscan clean on 108 URLs, framecmp over 112 frames with the original `framecmp.mjs` (these frames carry the 52 px Safari bar): 1.1-5 % on most; higher and explained: 11.4.0d phone 9.2 and 11.4.5o phone 9.3 (scale/blur), 11.4.1a sign-up 8.9 (right-panel photo composition differs: middle photo crop and sizes), 11.4.2d loading 8.3 (map + breakdown row ~43 px taller), 11.5.1h 9.7 (Figma drawer frame has a stale background), 11.5.2c 8.2 (dialog position), 8 report pages 5-18 % by percentage but the cover pair viewed matches (photo scaling dominates). Briefing frames 11.4.4a-e use the older National data layout behind the dialogs (`AgencyNationalView classic`), 11.4.4h the current one.
Responsive audit `--only=/agency`: 53/60 before fixes; the 7 flags were the 404 "Back to Home" link (now 24 px tall), data-request tab labels (nowrap added) and four "button labels wrap" hits on buttons that mix two font sizes (checked by eye on queries @320: single line; audit heuristic), not re-run.
Not verified: printed/PDF output (mocked), tablet 834 beyond the drawn frames, per-frame DOM-text check by the lead (the packages ran their own), screen readers. Mock-only: auth (`?mou=`, `?quota=`), saved queries/programmes (in memory), uploads, API keys.

### URL keys added by the packages

- Session/chrome: `mou=none|pending|needs-info|not-approved|approved`, `quota=0-100`, `state=first-login` (also `modal=welcome` / `tour=` imply the first-login numbers), data-request states set the persona status line.
- Home/onboarding: `state=first-login`, `quota=92`, `modal=welcome`, `tour=1|2|3`; sign-up `state=already-registered|code-sent|wrong-code|email-verified`, `step=verify`; `/agency/mou?view=list`, `/agency/mou/status?mou=...`.
- National data: `map=hover|pinned|keyboard` + `at=<region>`, `breakdown=interest|education|personality|goal|skills|experience|certifications|age|readiness`, `by=daily|weekly|monthly`, `modal=filters|breakdown|region|compare`, `state=loading|error|zero|suppressed|too-few`; `/agency/trends?range=90d|1y|all`.
- Demand: `view=skills|trends|success`, `skill`, `region`, `district`, `category`, `period`, `state=empty|suppressed-region|generating|suppressed`, `range=30d|quarter|ytd|12m|custom|long`, `by=day|week|month`, `from`, `to`, `modal=date-range|view-by|filters`, `source=programmes|opportunities`, `programme`, `groupby`.
- Queries: `x=` (extra filters), `profile=1`, `by=`, `menu=region`, `modal=save-query|export|filters`, `show=`, `sort=`; `/agency/queries/saved`. Programmes: `group=`, `programme=`, `template=`, `at=`, `view=preview`, `tab=templates`, `state=published`.
- Data requests: `tab=pending|approved|rejected|all`, `scope=active|expired`, `layout=grid|list`, `sort=oldest`, `state=pending|approved|rejected|ended|needs-detail`, `view=dataset`, `modal=appeal`, `from=<requestId>`. Briefing: `modal=download|share|digest`, `state=building|failed|copied`, `pdf=fail`. Report: `page=1..8`, `print=1`.
- Settings: tabs are route segments (`analysts`, `api-keys`, `notifications`, `mou`, `audit-log`), `modal=invite|remove` + `at=<analyst>`, audit log `view=overview|downloads|requests|quota`, `kind=all|download|request`, `layout=grid`, `page=n`.

Follow-up (2026-10-25, package B): `more=<key>~<value>,…` carries the drawer's extra filters (green chips in the filter row, cleared by Clear all); `region` may be a comma list on national and in the drawer (not on demand). 11.4.2d loading 8.3 → 1.6 % (the filter row wrapped to two rows while loading), 11.4.2p 6.3 → 3.3 % (embedded OutcomesDashboard: 30 px gap, 860/445 chart row, cards not stretched), 6f/6g compared and corrected (grab handle, 490 px tablet sheet, one-column fields below lg). Known: 6b/6c draw the page behind the drawer unfiltered; ours applies the URL immediately (needs a draft URL state), and the mock cannot reproduce "Show 1,284 talents".
