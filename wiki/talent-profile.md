# Talent profile (`/profile`) — Focused + Playful

> Figma: file `Bin8roWL8sloyc36IgFMuT`, canvas "Talent -Profile" `7500:92566` (42 Playful frames + 42 Focused + help pop-over). Created 2026-10-18. Read [talent-home.md](talent-home.md) and [playful-mode.md](playful-mode.md) FIRST — their rules apply unchanged (Figma-exact colours, `playful:` variant only, no invented copy, add-only shared edits, scope attribute, SVGs as named components in `src/components/shared/assets.jsx`, media files descriptively named under `src/assets/talent-profile/<area>/`).

## Decisions (made by the lead, same pattern as talent home — 2026-10-18)

- Both styles in one build (Focused default, Playful via the style switch). Route **`/profile`**, outside `MainLayout`, `DashboardShell role="talent" activeNav="profile"` (reuses the talent shell; Profile nav item active).
- Frame states are chosen by query params (`talentProfileState.js`), shaped so an API can replace them. `?view=public` (PR-02/03/04, the logged-out public link) renders WITHOUT the talent shell.
- No backend. Share/copy/download/card generation are local mock behaviour driven by what the frames show.

## State → URL → Figma frame (Playful / Focused)

| URL                      | Frame                                              | Playful      | Focused       |
| ------------------------ | -------------------------------------------------- | ------------ | ------------- |
| `/profile`               | P-01 Overview                                      | `7570:105`   | `8110:368104` |
| `?tab=skills`            | P-02 Skills                                        | `7571:190`   | `8110:368724` |
| `?tab=experience`        | P-03 Experience                                    | `7571:1007`  | `8110:369265` |
| `?tab=portfolio`         | P-04 Portfolio                                     | `7572:359`   | `8110:369743` |
| `?tab=certs`             | P-05 Certs                                         | `7572:1128`  | `8110:370237` |
| `?tab=about`             | P-06 About me                                      | `7572:1869`  | `8110:370695` |
| `?view=recruiter`        | P-07 Preview as recruiter                          | `7573:602`   | `8110:371211` |
| `?edit=about`            | P-08 Edit About (in place)                         | `7573:1385`  | `8110:371805` |
| `?modal=experience`      | P-09 Add experience (modal)                        | `7574:775`   | `8110:372451` |
| `?empty=1`               | P-10 New profile (mostly empty)                    | `7574:1412`  | `8110:373025` |
| `?share=open`            | SH-01 Share profile                                | `7579:1032`  | `8110:374965` |
| `?share=copied`          | SH-02 Link copied                                  | `7579:2095`  | `8110:375987` |
| `?share=link`            | SH-04 Customise link                               | `7579:3164`  | `8110:377014` |
| `?share=link-available`  | SH-04b Customise link · available                  | `7579:3864`  | `8110:377666` |
| `?share=card`            | SH-03 Make a share card                            | `7582:1464`  | `8110:378305` |
| `?share=pdf`             | SH-05 Download PDF / CV                            | `7582:2554`  | `8110:379364` |
| `?share=card-midnight`   | SH-03b Share card · Midnight · Post 1:1            | `7599:4793`  | `8110:380074` |
| `?share=card-sunshine`   | SH-03c Share card · Sunshine · LinkedIn banner     | `7599:6039`  | `8110:381133` |
| `?share=card-making`     | SH-03d Share card · making your card               | `7599:7590`  | `8110:382138` |
| `?share=card-saved`      | SH-03e Share card · saved                          | `7599:8850`  | `8110:383205` |
| `?share=whatsapp`        | SH-03f Post to WhatsApp Status from your phone     | `7599:10159` | `8110:384232` |
| `?view=public`           | PR-02 Preview · Public link (logged out)           | `7584:1691`  | `8110:387366` |
| `?view=public&manage=1`  | PR-03 Manage what's visible (drawer)               | `7584:2347`  | `8110:387950` |
| `?view=public&updated=1` | PR-04 Preview updated (pitch hidden)               | `7584:3137`  | `8110:388716` |
| `?card=pick`             | SC-01 Create card · Pick a look                    | `7608:6178`  | `8110:398249` |
| `?card=customise`        | SC-02 Customise                                    | `7608:8914`  | `8110:400322` |
| `?card=text`             | SC-03 Edit text                                    | `7608:10210` | `8110:401398` |
| `?card=post`             | SC-04 Post 1:1                                     | `7608:11582` | `8110:402417` |
| `?card=banner`           | SC-05 LinkedIn banner                              | `7609:7041`  | `8110:403481` |
| `?card=making`           | SC-06 Making it                                    | `7609:8624`  | `8110:404513` |
| `?card=ready`            | SC-07 Ready to share                               | `7609:9928`  | `8110:405536` |
| `?card=error`            | SC-08 Couldn't make it                             | `7609:11287` | `8110:406584` |
| `?ax=panel`              | AX-01 Accessibility panel · On Profile             | `7590:1952`  | `8110:389972` |
| `?ax=calm`               | AX-02 Calm + Large text + One column (applied)     | `7590:2746`  | `8110:390599` |
| `?ax=contrast`           | AX-03 High contrast (applied)                      | `7590:3461`  | `8110:391217` |
| `?ax=aloud`              | AX-04 Read my profile aloud (playing)              | `7591:2279`  | `8110:391845` |
| `?ax=pitch`              | AX-05 Pitch video · captions, transcript, controls | `7591:3047`  | `8110:392527` |
| `?ax=images`             | AX-06 Portfolio · image descriptions check         | `7591:3728`  | `8110:393111` |
| `?ax=alt`                | AX-06b Describe this image (alt text)              | `7591:4339`  | `8110:393635` |
| `?ax=focus`              | AX-07a Keyboard focus order                        | `7592:2619`  | `8110:394214` |
| `?ax=landmarks`          | AX-07b Landmarks & headings                        | `7592:3287`  | `8110:394869` |
| `?ax=share-modal`        | AX-08 Share modal · keyboard & screen reader       | `7592:4005`  | `8110:395519` |
| `?help=1`                | HP Help pop-over overlay                           | `8376:19219` | `8376:19339`  |

Other nodes: `_base (Profile template)` `7568:2044` (shell/base: Main Content Canvas, Sidebar, `GTH · Top bar` `8343:519757`, `avatar showcase`, `Ask Buddy · FAB` `7862:59733`).

## File ownership (one agent per row — do not edit another row's files)

All under `src/components/sections/talentProfile/` unless noted.

| Owner       | Files                                                                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Lead        | `talentProfileState.js`, `src/pages/talentProfile/TalentProfilePage.jsx`, route in `App.jsx`, this page, leak-check/route lists                                                 |
| Shell       | `DashboardShell.jsx` / `TalentDashboardShell.jsx` / `TalentSidebar.jsx` / `TalentMobileNav.jsx` / `DashboardTopNav.jsx` (add-only: `activeNav`, Profile item, help pop-over HP) |
| Tabs        | `ProfileHeader`, `ProfileTabBar`, `ProfileOverviewTab`, `ProfileSkillsTab`, `ProfileExperienceTab`, `ProfilePortfolioTab`, `ProfileCertsTab`, `ProfileAboutTab`                 |
| EditPreview | `ProfileEditAbout`, `AddExperienceModal`, `ProfileEmptyState`, `ProfilePreviewBanner`, `PublicProfileView`, `ManageVisibilityDrawer`                                            |
| Share       | `ShareProfileModal`, `WhatsAppStatusSheet`                                                                                                                                      |
| Card        | `ShareCardBuilder` (+ its own helper files `ShareCard*.jsx`)                                                                                                                    |
| A11y        | `ProfileAccessibilityPanel` + accessibility behaviour across all profile files — last                                                                                           |

Each section component receives `profile` (see `useTalentProfileState`): `{ tab, view, share, card, ax, edit, modal, empty, manage, updated, help, a11yMode, update(patch) }`. `update({ key: value })` edits the URL (null removes a key).

## Status

| Piece                                                               | Status                                                              |
| ------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Route `/profile`, page, state source, scope, leak check, route list | `✅ VERIFIED` (2026-10-18: renders in Playful scope, console clean) |
| All section components                                              | stubs (`data-stub`) — being built                                   |
