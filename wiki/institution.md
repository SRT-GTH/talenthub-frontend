# Institution portal — Theme 11 (`/institution/*`)

Figma file `Bin8roWL8sloyc36IgFMuT`, canvas **Persona · Institutions & Agencies (Theme 11)** `8520:10` — sections 11.1, 11.2, 11.3, 11.6 and the 11.3.5 v2 board report; 87 frames (79 screens + 8 board-report pages; 1 SUPERSEDED v1 PDF cover). **Focused only.** No Theme 11 institution story doc exists: the Figma frames are the acceptance criteria.

## What it is

The signed-in portal of an educational institution (schools and universities). Persona in the frames: **Iddrisu Abdul-Rahman · Admin · Registrar · Savannah Hills SHS** (head: Mrs Salamatu Yakubu, GES number `GES/NR/SHS/0412`). Sign-up and accreditation, welcome tour, home, student roster (add, CSV import, guardian consent for under-18s, remove, transfer out, student record), record verification, credentials (issue, preview, revoke with dual approval, corrected copy, whole class, public "Verify a credential"), programmes, student progress, messages, profile menu + settings and an 8-page A4 "Board of Governors report". Counts in aggregates under 5 are always `<5` (`formatCount` / `safeShare`, shared with Theme 8); roster rows are the institution's own data and are drawn as in Figma.

⚠️ ASSUMPTION: **no real auth** — `useInstitutionSession()` returns a mock signed-in session (`data/institutionCoreData.js`).

## Architecture

- Router: `src/pages/institution/InstitutionApp.jsx` (mounted by `App.jsx` as `/institution/*`, outside `MainLayout`). Packages replace the stub pages `src/pages/institution/Institution<Name>Page.jsx` and add NO route to `App.jsx`.
- Chrome and shared logic: `src/components/sections/institution/` — `InstitutionFrame` (page chrome), `InstitutionTopBar`, `InstitutionSidebar` (+ `InstitutionPersonaCard`, `InstitutionNavItem`, `InstitutionPageCard`), `institutionState.js`, `institutionNav.js`, `institutionFormat.js`, `useInstitutionSession.js`, `data/institutionCoreData.js`, `institutionIcons.jsx` (Figma SVG exports), `InstitutionStub`, `settings/InstitutionProfileMenu.jsx` (stub, package E).
- Shared with the agency portal (re-exported read-only, identical Figma components): `InstitutionButton`, `InstitutionPageHero`, `InstitutionBanner`, `InstitutionBuddyFab` → `../agency/Agency*.jsx`. The institution frames are a sibling design of the agency chrome (same rail 303, nav 87, hero 1329×176); the persona card, nav, page card and top-bar copy are institution-specific copies.
- Chrome behaviour (same as the agency): `>= xl` rail 303 (or the 80 icon rail with `?rail=collapsed`), `lg..xl` the 80 icon rail, `< lg` the phone top bar (menu · GTH · bell · monogram, frame 11.2.1c) with a drawer (`?drawer=1`). Page background = `DashboardPageBackground`. Ask Buddy: pill >= lg, 64px round button below. ⚠️ ASSUMPTION: the collapsed icon rail and the drawer are not drawn in the institution frames.
- Own-chrome screens (do NOT use `InstitutionFrame`): sign-up 11.1.1*, accreditation upload / list / submitted 11.1.2a*, public verify 11.2.4i,j, board report 11.3.5 v2. The verification status screens 11.1.2b–e and the welcome / tour overlays use the normal chrome.

## Mock session and the accreditation gate

`useInstitutionSession()` → `{ admin, institution, head, verify: {status, approved, label, reference, submitted, reviewStarted, decided, renewalDue}, readiness: {pct}, stats: {students, pending, credentials}, counts: {scholarshipsLive}, badges }`.

- `?verify=none|under-review|approved|needs-info|not-approved` overrides the accreditation status (default `approved`). Persona-card status line verbatim from the frames: `Verified institution · GES accredited` · `Verification in review` · `Verification · action needed` · `Verification not approved` (`none` = ⚠️ ASSUMPTION `Not yet verified`). Any gate other than `approved` draws readiness 0 % and stats 0 · 0 · 0 (as 11.1.2b/d/e).
- Approved: readiness **64 %** and stats **847 · 23 · 312** on every screen (and on the welcome / tour overlays), **61 %** on the plain home 11.2.1a (as drawn — Figma inconsistency kept).
- New institution: `/institution?state=new` (11.2.1b) and `/institution/students?state=empty` (11.2.2l) draw verified + 0 % + 0 · 0 · 0.
- Top-bar badges: bell 5, messages 5 (as drawn).

## URL contract

Query keys shared by every screen (`institutionState.js`): `rail=collapsed`, `drawer=1`, `modal=<name>` (chrome reserves `profile`, `help`, `notifications`, `messages`, `a11y`, `language`; the last five are inert), `state=<name>`, `verify=`, `q=`, `tab=`, `view=`, `filter=`, `tour=1|2|3`. Every Figma frame is a URL; packages add their own keys (never reuse the shared ones) and document them in their page header + the "URL keys added by the packages" section below. Per-frame URLs in the checklist are the foundation's proposal: packages may refine them but must keep `tests/institution/frames.json` in step.

| Route                                                                                                                                                                                                              | Frames                        | Owner                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- | -------------------------------------------------------------- |
| `/institution` (`?state=new`, `?modal=welcome`, `?tour=1..3`, `?modal=profile`)                                                                                                                                    | 11.2.1a–c, 11.1.3a–d, 11.6.0a | B (home) · A (welcome modal + tour overlay) · E (profile menu) |
| `/institution/sign-up` (`?state=filled\|code-sent\|wrong-code\|already-registered\|success`)                                                                                                                       | 11.1.1a–d, a2, b2             | A                                                              |
| `/institution/accreditation` (`?view=list\|submitted`)                                                                                                                                                             | 11.1.2a, a2, a3               | A                                                              |
| `/institution/accreditation/status` (`?verify=under-review\|approved\|needs-info\|not-approved`)                                                                                                                   | 11.1.2b–e                     | A                                                              |
| `/institution/students`, `/institution/students/new`, `/institution/students/:studentId` (`?modal=add-student\|upload\|remove\|transfer\|consent`, `?filter=not-linked`, `?state=empty\|errors\|checking\|review`) | 11.2.2a–l                     | B                                                              |
| `/institution/records`, `/institution/records/:recordId` (`?modal=approve\|reject\|bulk-approve`, `?state=caught-up`)                                                                                              | 11.2.3a–f                     | C                                                              |
| `/institution/credentials`, `/institution/credentials/new`, `/institution/credentials/:credentialId` (`?modal=preview\|revoke\|corrected`, `?state=issued\|revoked`, `?mode=class`)                                | 11.2.4a–h                     | C                                                              |
| `/institution/verify/:credentialId` (PUBLIC, no chrome; `?state=valid\|revoked`)                                                                                                                                   | 11.2.4i, j                    | C                                                              |
| `/institution/programmes`, `/new`, `/:programmeId`, `/:programmeId/applicants` (`?tab=drafts`, `?modal=preview\|templates\|actions\|close`)                                                                        | 11.3.1a–d, 11.3.4a–e          | D1                                                             |
| `/institution/messages`, `/new`, `/:threadId` (`?step=confirm`, `?state=scheduled\|delivery-problem\|empty`)                                                                                                       | 11.3.3a–g                     | D1                                                             |
| `/institution/progress`, `/progress/students/:studentId`, `/progress/class-outcomes` (`?modal=flag\|download`)                                                                                                     | 11.3.2a–e                     | D2                                                             |
| `/institution/report` (`?page=1..8`, A4 landscape, no chrome)                                                                                                                                                      | 11.3.5 v2                     | D2                                                             |
| `/institution/settings[/:tab]` (profile · staff · notifications · data · audit-log; `?modal=invite\|remove`)                                                                                                       | 11.6.1a–g                     | E                                                              |
| `/institution/public-page`                                                                                                                                                                                         | 11.6.1h                       | E                                                              |
| `/institution/*`                                                                                                                                                                                                   | not-found                     | foundation                                                     |

Rail highlight (`institutionNav.activeNavId`): Home / Students / Programmes / Messages / Records / Credentials | Progress; accreditation, settings and the public page keep **Home** active (⚠️ ASSUMPTION; the status frames 11.1.2b–e highlight Home).

## Shared components (reuse, do not rebuild)

- `InstitutionFrame` — props `data` (`useInstitutionState()`), `title`, `active`, `children`, `className`. Children are laid out as a column, 30px gap (16 on phones). Mounts `settings/InstitutionProfileMenu` (`{data, session}`) for `?modal=profile`.
- `InstitutionPageHero` — green banner: `title` (the page `<h1>`), `subtitle`, `actions`.
- `InstitutionBanner` — dark green context card: `eyebrow`, `title`, children (body).
- `InstitutionButton` — white shelf button: `size` xs|sm|md, `to`, `leftIcon`, `rightIcon`.
- `useInstitutionSession()` · `useInstitutionState()` · `institutionFormat` (`formatCount`, `safeShare`, `formatPercent`, `formatDayMonth`, `formatDateLong`, `formatMonthYear`, `clampPercent`) · `InstitutionStub` · `institutionIcons.jsx`.
- From Theme 8: `publicData/ui/*` primitives (KpiTile, BarList, FilterChip, SectionError, EmptyState …).

## Work packages

A sign-up, accreditation, verification status, welcome modal + tour (11.1, 17 frames) · B home + roster (11.2.1, 11.2.2; 18) · C records, credentials, public verify (11.2.3, 11.2.4; 16) · D1 programmes + messages (11.3.1, 11.3.4, 11.3.3; 16) · D2 progress + board report (11.3.2, 11.3.5 v2; 13 + 1 superseded) · E profile menu, settings, public page (11.6; 9: 11.6.0a, 11.6.1a–h).

## Frame checklist (⬜ not built · ✅ built and compared · — not a screen)

| Frame                                                                  | Figma id      | Size      | URL                                                           | Pkg | Status |
| ---------------------------------------------------------------------- | ------------- | --------- | ------------------------------------------------------------- | --- | ------ |
| 11.1.1a · Institution sign-up · Form                                   | `8589:8`      | 1728×1117 | `/institution/sign-up`                                        | A   | ⬜     |
| 11.1.1a2 · Institution sign-up · Form filled                           | `8589:482`    | 1728×1117 | `/institution/sign-up?state=filled`                           | A   | ⬜     |
| 11.1.1b · Institution sign-up · Email verification                     | `8589:932`    | 1728×1117 | `/institution/sign-up?state=code-sent`                        | A   | ⬜     |
| 11.1.1c · Institution sign-up · Already registered                     | `8589:1478`   | 1728×1117 | `/institution/sign-up?state=already-registered`               | A   | ⬜     |
| 11.1.1d · Institution sign-up · Success                                | `8589:1937`   | 1728×1117 | `/institution/sign-up?state=success`                          | A   | ⬜     |
| 11.1.2a · Accreditation · Upload                                       | `8589:2399`   | 1728×1287 | `/institution/accreditation`                                  | A   | ⬜     |
| 11.1.2a2 · Accreditation · Documents list                              | `8589:2700`   | 1728×1341 | `/institution/accreditation?view=list`                        | A   | ⬜     |
| 11.1.2a3 · Accreditation · Submitted                                   | `8589:3051`   | 1728×1341 | `/institution/accreditation?view=submitted`                   | A   | ⬜     |
| 11.1.2b · Verification status · Under review                           | `8589:3478`   | 1728×1264 | `/institution/accreditation/status?verify=under-review`       | A   | ⬜     |
| 11.1.2c · Verification status · Approved                               | `8589:3962`   | 1728×1264 | `/institution/accreditation/status?verify=approved`           | A   | ⬜     |
| 11.1.2d · Verification status · Needs more info                        | `8589:4444`   | 1728×1264 | `/institution/accreditation/status?verify=needs-info`         | A   | ⬜     |
| 11.1.2e · Verification status · Not approved                           | `8589:4918`   | 1728×1264 | `/institution/accreditation/status?verify=not-approved`       | A   | ⬜     |
| 11.1.1b2 · Institution sign-up · Wrong code                            | `8744:428424` | 1728×1117 | `/institution/sign-up?state=wrong-code`                       | A   | ⬜     |
| 11.1.3a · Welcome · Akwaaba modal                                      | `8744:428914` | 1728×1264 | `/institution?modal=welcome`                                  | A   | ⬜     |
| 11.1.3b · Welcome tour · Step 1 of 3                                   | `8744:429486` | 1728×1264 | `/institution?tour=1`                                         | A   | ⬜     |
| 11.1.3c · Welcome tour · Step 2 of 3                                   | `8744:430003` | 1728×1264 | `/institution?tour=2`                                         | A   | ⬜     |
| 11.1.3d · Welcome tour · Step 3 of 3                                   | `8744:430559` | 1728×1264 | `/institution?tour=3`                                         | A   | ⬜     |
| 11.2.1a · Institution home · Default                                   | `8585:9`      | 1728×1776 | `/institution`                                                | B   | ⬜     |
| 11.2.1b · Institution home · New institution                           | `8588:479`    | 1728×1264 | `/institution?state=new`                                      | B   | ⬜     |
| 11.2.1c · Institution home · Mobile                                    | `8588:960`    | 360×3628  | `/institution`                                                | B   | ⬜     |
| 11.2.2a · Student roster · List                                        | `8590:383333` | 1728×1229 | `/institution/students`                                       | B   | ⬜     |
| 11.2.2b · Student roster · Add one student                             | `8590:383922` | 1728×1229 | `/institution/students?modal=add-student`                     | B   | ⬜     |
| 11.2.2c · Student roster · Upload CSV                                  | `8590:384612` | 1728×1229 | `/institution/students?modal=upload`                          | B   | ⬜     |
| 11.2.2d · Student roster · CSV errors                                  | `8590:385302` | 1728×1229 | `/institution/students?modal=upload&state=errors`             | B   | ⬜     |
| 11.2.2e · Student roster · Remove student                              | `8590:386008` | 1728×1229 | `/institution/students?modal=remove`                          | B   | ⬜     |
| 11.2.2f · Student roster · Transfer out                                | `8590:386599` | 1728×1229 | `/institution/students?modal=transfer`                        | B   | ⬜     |
| 11.2.3a · Records · Verification queue                                 | `8593:8`      | 1728×1229 | `/institution/records`                                        | C   | ⬜     |
| 11.2.3b · Records · Record detail                                      | `8593:575`    | 1728×2007 | `/institution/records/rec-1`                                  | C   | ⬜     |
| 11.2.3c · Records · Approve                                            | `8593:386367` | 1728×2007 | `/institution/records/rec-1?modal=approve`                    | C   | ⬜     |
| 11.2.3d · Records · Reject with reason                                 | `8593:387116` | 1728×2007 | `/institution/records/rec-1?modal=reject`                     | C   | ⬜     |
| 11.2.3e · Records · Bulk approve                                       | `8593:387863` | 1728×1229 | `/institution/records?modal=bulk-approve`                     | C   | ⬜     |
| 11.2.4a · Credentials · Issued list                                    | `8593:388444` | 1728×1229 | `/institution/credentials`                                    | C   | ⬜     |
| 11.2.4b · Credentials · Issue a credential                             | `8593:388993` | 1728×1229 | `/institution/credentials/new`                                | C   | ⬜     |
| 11.2.4c · Credentials · Preview                                        | `8593:390292` | 1728×1229 | `/institution/credentials/new?modal=preview`                  | C   | ⬜     |
| 11.2.4d · Credentials · Issued                                         | `8593:390861` | 1728×1229 | `/institution/credentials/new?state=issued`                   | C   | ⬜     |
| 11.2.4e · Credentials · Revoke (dual approval)                         | `8593:389693` | 1728×1229 | `/institution/credentials/cred-1?modal=revoke`                | C   | ⬜     |
| 11.2.2g · Student roster · Checking your file                          | `8744:431110` | 1728×1229 | `/institution/students?modal=upload&state=checking`           | B   | ⬜     |
| 11.2.2h · Student roster · Review import                               | `8744:431402` | 1728×1229 | `/institution/students?modal=upload&state=review`             | B   | ⬜     |
| 11.2.2i · Student roster · Guardian consent for under-18s              | `8744:431724` | 1728×1229 | `/institution/students?modal=consent`                         | B   | ⬜     |
| 11.2.2j · Student roster · Student record                              | `8744:433480` | 1728×1984 | `/institution/students/abena-mahama`                          | B   | ⬜     |
| 11.2.2k · Student roster · Not linked filter                           | `8744:434190` | 1728×1229 | `/institution/students?filter=not-linked`                     | B   | ⬜     |
| 11.2.2l · Student roster · Empty (new institution)                     | `8744:434852` | 1728×1229 | `/institution/students?state=empty`                           | B   | ⬜     |
| 11.2.3f · Records · All caught up                                      | `8744:435251` | 1728×1229 | `/institution/records?state=caught-up`                        | C   | ⬜     |
| 11.2.4f · Credentials · Revoked                                        | `8744:435599` | 1728×1229 | `/institution/credentials/cred-1?state=revoked`               | C   | ⬜     |
| 11.2.4g · Credentials · Issue a corrected copy                         | `8744:436331` | 1728×1229 | `/institution/credentials/cred-1?modal=corrected`             | C   | ⬜     |
| 11.2.4h · Credentials · Issue to a whole class                         | `8744:436854` | 1728×1229 | `/institution/credentials/new?mode=class`                     | C   | ⬜     |
| 11.2.4i · Verify a credential · Valid (public)                         | `8744:437743` | 1728×1117 | `/institution/verify/cred-1`                                  | C   | ⬜     |
| 11.2.4j · Verify a credential · Revoked (public)                       | `8744:437962` | 1728×1117 | `/institution/verify/cred-2?state=revoked`                    | C   | ⬜     |
| 11.3.1a · Programme · Who can apply                                    | `8594:1655`   | 1728×1652 | `/institution/programmes/new`                                 | D1  | ⬜     |
| 11.3.1b · Programme · Preview as a student                             | `8594:2229`   | 1728×1229 | `/institution/programmes/new?modal=preview`                   | D1  | ⬜     |
| 11.3.1c · Programme · Published                                        | `8594:2787`   | 1728×1229 | `/institution/programmes/science-scholarship-2027`            | D1  | ⬜     |
| 11.3.1d · Programme · Applicants                                       | `8594:3348`   | 1728×1229 | `/institution/programmes/science-scholarship-2027/applicants` | D1  | ⬜     |
| 11.3.2a · Progress · Students                                          | `8595:92`     | 1728×1229 | `/institution/progress`                                       | D2  | ⬜     |
| 11.3.2b · Progress · Student detail                                    | `8595:653`    | 1728×1984 | `/institution/progress/students/abena-mahama`                 | D2  | ⬜     |
| 11.3.2c · Progress · Flag for coaching                                 | `8595:1413`   | 1728×1984 | `/institution/progress/students/abena-mahama?modal=flag`      | D2  | ⬜     |
| 11.3.3a · Messages · Compose                                           | `8595:388994` | 1728×1232 | `/institution/messages/new`                                   | D1  | ⬜     |
| 11.3.3b · Messages · Audience and confirm                              | `8595:389530` | 1728×1232 | `/institution/messages/new?step=confirm`                      | D1  | ⬜     |
| 11.3.3c · Messages · Sent and delivery                                 | `8595:388504` | 1728×1232 | `/institution/messages/thread-1`                              | D1  | ⬜     |
| 11.3.4a · Programmes · All                                             | `8744:438205` | 1728×1175 | `/institution/programmes`                                     | D1  | ⬜     |
| 11.3.4b · Programmes · Drafts                                          | `8744:438780` | 1728×1193 | `/institution/programmes?tab=drafts`                          | D1  | ⬜     |
| 11.3.4c · Programme · Choose a template                                | `8744:439233` | 1728×1229 | `/institution/programmes/new?modal=templates`                 | D1  | ⬜     |
| 11.3.4d · Programmes · Actions menu                                    | `8744:440820` | 1728×1287 | `/institution/programmes?modal=actions`                       | D1  | ⬜     |
| 11.3.4e · Programmes · Close confirmation                              | `8744:441408` | 1728×1287 | `/institution/programmes?modal=close`                         | D1  | ⬜     |
| 11.3.2d · Progress · Class outcomes                                    | `8745:47`     | 1728×1766 | `/institution/progress/class-outcomes`                        | D2  | ⬜     |
| 11.3.2e · Progress · Download outcomes report                          | `8745:822`    | 1728×1766 | `/institution/progress/class-outcomes?modal=download`         | D2  | ⬜     |
| 11.3.2f · Progress · Outcomes report PDF cover · v1 (superseded by the | `8745:1259`   | 794×1123  | —                                                             | D2  | —      |
| 11.3.3d · Messages · Another thread (mock exam timetable)              | `8745:428762` | 1728×1232 | `/institution/messages/thread-2`                              | D1  | ⬜     |
| 11.3.3e · Messages · Scheduled message                                 | `8745:429162` | 1728×1232 | `/institution/messages/thread-3?state=scheduled`              | D1  | ⬜     |
| 11.3.3f · Messages · Delivery problem                                  | `8745:429583` | 1728×1232 | `/institution/messages/thread-4?state=delivery-problem`       | D1  | ⬜     |
| 11.3.3g · Messages · Empty (no messages yet)                           | `8745:430003` | 1728×1232 | `/institution/messages?state=empty`                           | D1  | ⬜     |
| 11.6.0a · Profile menu · Institution                                   | `8597:400573` | 1728×1776 | `/institution?modal=profile`                                  | E   | ⬜     |
| 11.6.1a · Settings · Institution profile                               | `8597:395887` | 1728×1175 | `/institution/settings/profile`                               | E   | ⬜     |
| 11.6.1b · Settings · Staff and roles                                   | `8597:396377` | 1728×1425 | `/institution/settings/staff`                                 | E   | ⬜     |
| 11.6.1c · Settings · Notifications                                     | `8597:396863` | 1728×1550 | `/institution/settings/notifications`                         | E   | ⬜     |
| 11.6.1d · Settings · Data and retention                                | `8597:397433` | 1728×1175 | `/institution/settings/data`                                  | E   | ⬜     |
| 11.6.1e · Settings · Invite a staff member                             | `8746:207`    | 1728×1344 | `/institution/settings/staff?modal=invite`                    | E   | ⬜     |
| 11.6.1f · Settings · Remove staff access                               | `8746:688`    | 1728×1175 | `/institution/settings/staff?modal=remove`                    | E   | ⬜     |
| 11.6.1g · Settings · Audit log                                         | `8746:1175`   | 1728×1229 | `/institution/settings/audit-log`                             | E   | ⬜     |
| 11.6.1h · Institution page · Public view                               | `8746:1675`   | 1728×1456 | `/institution/public-page`                                    | E   | ⬜     |
| 11.3.5c v2 · Board report · Cover                                      | `8914:100`    | 1123×794  | `/institution/report?page=1`                                  | D2  | ⬜     |
| 11.3.5 v2 · Board report · Contents                                    | `8914:118`    | 1123×794  | `/institution/report?page=2`                                  | D2  | ⬜     |
| 11.3.5 v2 · Board report · Section opener                              | `8914:147`    | 1123×794  | `/institution/report?page=3`                                  | D2  | ⬜     |
| 11.3.5 v2 · Board report · Where our students come from                | `8914:160`    | 1123×794  | `/institution/report?page=4`                                  | D2  | ⬜     |
| 11.3.5 v2 · Board report · What our students want                      | `8914:290`    | 1123×794  | `/institution/report?page=5`                                  | D2  | ⬜     |
| 11.3.5 v2 · Board report · How GTH works at school                     | `8914:356`    | 1123×794  | `/institution/report?page=6`                                  | D2  | ⬜     |
| 11.3.5 v2 · Board report · Our programmes                              | `8914:404`    | 1123×794  | `/institution/report?page=7`                                  | D2  | ⬜     |
| 11.3.5 v2 · Board report · How we count                                | `8914:452`    | 1123×794  | `/institution/report?page=8`                                  | D2  | ⬜     |

## Build status (2026-10-25)

Foundation only: chrome, state, nav, session, router with 14 stub pages, manifest and this document. Chrome verified against 11.2.1a / b / c and 11.1.2b–e (rail, persona card, nav, "Your institution page" card, top bar, phone bar). Pages are stubs until the packages land.
