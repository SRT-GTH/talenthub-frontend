## [2026-11-22] fix | Profile-building UX follow-ups

- Skills stage lists platform-verified skills first (display only); Goals dialog names each missing required field (shared `Field` error, focus moves to the first missing input); Pitch stage opens an existing pitch on its published / review screen ("Loading your pitch…" meanwhile; Edit / Replace reach the chooser); Avatar stage shows skeletons while the saved avatar loads (signed in). Copy for errors and loading is ⚠️ ASSUMPTION (not drawn). ✅ VERIFIED demo + signed in.

## [2026-11-22] fix | Skills Lab games and signed-in profile stages

- All 13 Games v2 and 18 Arcade games play to their end (246 frame URLs × 2 looks, no page errors). Fixed: demo dialogs and Arcade links dropped `?demo=1` and started live runs; Makola Haggle "Time's up" inert and wrong result chips; the correct answer was always first in five games (now a stable shuffled order; `?f=` frames keep the drawn order); failed lab "Back to Skills Lab" restarted the lab; Team leadership / Strategic thinking ignored `?from=engagement`.
- Signed in: avatar name tag said "KofiA_23" and the stage bar "1 of 9" for everyone; Skills stage showed "Verified 0" (now reads verifications with the shared rule: 4); Goals couldn't be saved outside tech (Industry offered only Fintech); Interests placeholder was tech-only. New backend gaps: banner not saved, portfolio role dropped, onboarding interests invisible.

## [2026-11-22] feat | My crew right column, Playful grid and photos

- Talent My crew now matches the current NW frames: "Grow your crew" checklist, "Mentors to learn from", "You both know · 8", "Linked up …" lines, updated dialog copy, under-18 and empty right rails. The three right-rail people cards are one `CircleMiniPeopleCard` (recruiter wrappers unchanged). Playful card grid is three per row as drawn; photos re-exported from the current frames (`src/assets/talent-circle/people/`, 30 old files removed). NW diffs: worst Playful frames 13-14 % → 7-9 %. Signed in, the checklist / mentors / mutual cards stay hidden (no backend data, see gaps). ❓ Pending product decision: "+20 XP each" on the grow card vs US-5.3.1-02 (connections earn no XP).

## [2026-11-22] feat | Opportunities toolbar selects follow Figma

- Every `/job-postings` toolbar select is now the Figma "GTH · Select" (`JobsMenu.jsx`, Default / Open / Active): sort pill on Matched, Saved and Applied ("Best match" / "Most recent", really reorders, kept in `?sort=`; defaults per Figma), and the Browse all filters (Location, Job type, Pay, Industry) instead of 28px chips. Removed the "Sorted by …" label and the chip variant. Option labels are ⚠️ ASSUMPTION (no open-menu frame).
- Bug fixed: the Matched quick filters (80%+, Remote / Hybrid, Internships, Accra) did nothing; they now filter. With a filter on, the footer says "Showing N of M matches. Show all" (or "No matches for this filter yet.") instead of the drawn "That's all 6".
- Backend gap: saved roles have no `savedAt` (sorted by the bookmark id's time meanwhile).

## [2026-11-22] fix | Figma comparison, public data and recruiter

- Compared all 370 frames in the wiki tables (103 `/data`, 267 recruiter) at 0.5x; diff columns updated to today. Fixed: recruiter `?modal=invite` opened "Invite a friend" on top of page dialogs (friend invite is now `?modal=invite-friend`; `RecruiterHelpPopover.jsx`, `RecruiterProfileMenu.jsx`); `/recruiter/messages?view=talent` frame showed the sign-in page (`MessagesFrame.jsx` skips the talent home API in demo); `/data` overview printed "<5" and "Median age null" before data arrived. Remaining >7% are live API data on `/data`, dialogs centred in taller frames, or old frames replaced by newer designs. Flagged: recruiter community pages show an older sidebar card than other recruiter pages.

## [2026-11-22] fix | Apply flow label and visibility links

- The apply preview said "STEP 1 OF 2" but "Continue application" submits and no step 2 exists (Figma draws none; the backend has no screening questions). Label is now "PREVIEW" (`talentJobsData.js` APPLY_COPY.step). Step 2 and screening questions are recorded in `missing-designs.md` and `backend-integration-gaps.md`.
- "Edit visibility" now goes to one place from the job page and the Messages pre-apply dialog: `/profile?manage=1` (the Manage-what's-visible drawer in demo; signed in it forwards to Settings › Privacy).

## [2026-11-22] fix | One rule for verified skills

- Home hero and sidebar showed 10 (raw verification rows incl. a duplicate, games and a Career Buddy conversation), My Assessment "7 verified" (any non-self evidence), the assessment card "3 skills proven" (only the first 6 rows), Skills Lab 4. New `src/utils/verifiedSkills.js` (`countVerifiedSkills`, `countProvenSkills`, `isPlatformVerified`) following US-5.1.2-02: verified = distinct skills with a platform-assessment pass; proven = assessment or game evidence. Used by `talentHome.api.js`, `talentHomeLive.js`, `liveOverview.js` and the profile header stat (`talentProfileLive.js`; the profile's "Verified" group still lists Skills Lab game evidence for display). ✅ VERIFIED against the test account's real rows: 4 verified, 8 proven.

## [2026-11-22] fix | Signed-in check of the talent app (phases 3 and 4)

- Checked every talent page with a real test account. Fixed: Opportunities showed the Figma demo numbers for ~10 s while the live feed loaded (now skeletons only); notifications older than a week sat under "This week" (now "Earlier"); Playful notifications header showed drawn stickers when signed in; community milestone dialog said "Kofi" for everyone; Learning Saved / Certificates cards read "Course" (now the bookmark title); "1 role match" → "matches"; "1 days lit" → "1 day lit"; Settings › Language date example now today's date. Backend problems (bookmark re-save 500, localhost certificate links, verified-skill counts) added to `backend-integration-gaps.md`.

## [2026-11-22] fix | Inspection pass, phase 9 (public data)

- `/data`: outcomes loading crash fixed (no stories from the API); top-bar and 404 search now go to a region page or the matching directory; 500 "Try again" goes back to the failed page; freshness pill / suppression chips open on click; "Ask the data team" and footer Contact open email; landing and overview have one `<h1>`. Sidebar toggle and phone Live pill consolidated. Theme 8 canvas moved to `iErYj7O3ft6WAG2FBT6aEw`. Details in `wiki/public-data.md`. Pixel comparison not done.

## [2026-11-22] fix | Inspection pass, phases 1, 2, 5, 6, 7, 8, 10, 11

- One agent per phase checked every control (and Figma prototype links) on the public site and sign-in, profile and profile building, parent, recruiter, institution, agency, platform admin and the HTML emails. Details, destination tables and confidence tags are in each portal's wiki page (landing-site, talent-profile, talent-engagement-revamp, parent-wiring / parent-settings / parent-dashboard, recruiter-dashboard, institution, agency, admin, talent-emails, parent-emails).
- Highlights: recruiter top bar now works on every `/recruiter/*` page; agency portal now renders SF Pro Rounded; institution `/institution/verify` is public again; all 38 emails link to real routes (`{{APP_URL}}`), new TE-13; landing footer wired with `#section` scrolling; parent settings Accessibility / Language / Change password; many log-only buttons wired across portals.
- Components consolidated: landing FAQ item, job-card destinations, parent sidebar toggle and toast, recruiter top-bar panels, institution nav item, agency/institution persona card, admin settings nav, profile empty-state avatar.
- Figma files moved: agency, institution and public-data canvases now live in `iErYj7O3ft6WAG2FBT6aEw` (same node ids); login / role picker / tutorial node ids in `onboarding-redesign.md` no longer exist.
- New gaps and undesigned items merged into `backend-integration-gaps.md` (§1-§10, new §10 Emails) and `missing-designs.md` ("All portals (inspection 2026-11-22)"). Not covered: real-data checks for parent, recruiter, institution, agency and admin (no accounts), pixel comparisons where data was missing. Phase 9 (public data) still running.

## [2026-11-22] feat | Club Events tab opens

- The Events tab on the club page (demo and live) and post pages was inert: Figma draws the tab but no Events screen (searched the whole talent file: none), and clubs have no events API. It now opens an Events empty state ("No events yet" + "Back to the feed") on the club's own dashed empty card, now shared as `DashedEmptyCard` (`CommunityFeedParts.jsx`, also used by the empty feed). `EventsPanel` in `CommunityTabPanels.jsx`; `events` added to `COMMUNITY_TABS`. Owner page tabs stay inert (About / Members / Events have no owner panels). ✅ VERIFIED talent + recruiter club pages, no errors. Copy is ⚠️ ASSUMPTION.
- Known, pre-existing: signed-out club demo URLs (`?joined=1`, no `demo=1`) redirect to /login once the shell's API calls return 401.

## [2026-11-22] fix | Talent shell: one collapse button, one collapsed rail

- The talent shell drew two different « collapse buttons: on the profile card (Home, Settings) and a different icon above the card (Opportunities, Messages, Wallet, Clubs, Skills Lab, Streak, Notifications, My Assessment). Now one button on the card's top-right corner on every page, working with both the `?collapsed=1` URL and pages' own `rail` state (`TalentDashboardShell.jsx`).
- Two collapsed rails existed: the newer icon rail with the Wallet tile (`TalentRailHome`) and an older one without Wallet (`TalentRailCollapsed`, deleted). Every page now collapses to `TalentRailHome`. ✅ VERIFIED on Home, Opportunities, Wallet (button position identical, collapse works, no errors).

## [2026-11-21] fix | Destinations for the remaining talent controls

- 27 of 29 log-only / inert controls across Home, Career Buddy, Notifications, Opportunities, Wallet, Learning, Streak, My Assessment, Skills Lab and Clubs now lead somewhere (per-page details in each feature wiki page's "Control destinations (2026-11-21)" section). Figma prototype links were read for every frame involved: only Career Buddy "Maximize" (→ expanded Career Buddy) and Wallet "See payouts" (→ escrow) are linked in Figma; the rest follow existing app patterns or are ⚠️ assumptions, listed in `missing-designs.md` P3. Not wired: the demo post's "View replies" links (no drawn replies). ✅ VERIFIED in the browser.

## [2026-11-21] feat | Home: smoother edit mode, save hearts on matched roles

- **Edit home:** every layout change (Customize / Done, move, hide, show, add, reset) now runs as a View Transition (`src/utils/smoothLayout.js`, used by `TabsHomeLayoutStore.js` and the edit toggles): cards glide to their new place, new pieces fade in (320ms eased, timings in `index.css`). The dashed edit frame is now an outline, so cards no longer grow 8px on entering edit mode, and the card wrapper keeps the same tree in and out of edit mode (no remount). Browsers without View Transitions or with reduced motion change instantly. ✅ VERIFIED: 5 transitions, 0 failures, card size unchanged, no errors.
- **Matched to you:** the heart on each match card was a plain icon. It is now a save toggle: signed in, it saves / unsaves through `/guidance/bookmarks` (same as Opportunities; live cards carry `live`, `saved`, `bookmarkId`); demo toggles on the card. Saved = the green heart on a light green circle (no saved state is drawn). ✅ VERIFIED (demo toggle).
- **More for you:** Verified skills "Manage skills" → `/profile/filling/skills` (same as the MyAssessment tab); "All badges" → the profile Badges card (`/profile#badges`; `ProfileCard` takes an `id`, the profile page scrolls to the hash).

## [2026-11-21] fix | Profile menu Privacy / Terms

- The talent profile menu's footer links "Privacy" and "Terms" only logged. They now open the shared `PrivacyPolicyModal` / `TermsModal` summaries (same as the site footer and the sign-up Done page) over the menu; "Got it", × or Escape closes both. While a pop-up is open the menu ignores its own outside-click, Escape and arrow-key handlers (`ProfileMenu.jsx`). There are no full Privacy / Terms pages yet (the pop-ups say "The full policy is coming soon"). ✅ VERIFIED in the browser, no errors.

## [2026-11-21] fix | Journey map pop-ups on every stage; search focus ring

- `/profile/engagement`: only Skills had a hover pop-up (the only stage with drawn copy). Now every stage opens it (`journeyData.js` `STAGE_TOOLTIP_TEXT` + `stageTooltip()`; `JourneyMapCanvas.jsx`): the stage's own icon, its milestone ("Counts towards Discoverable / Top 20% / Top Talent"), and Start / Continue / Edit by state. Stages near the left edge open the pop-up to the right; it stays inside the map. Skills keeps Figma's copy. ✅ VERIFIED (all 9 stages, no errors). Copy for the other stages is ⚠️ ASSUMPTION, listed in `missing-designs.md` P3.
- Talent pages: the A11Y focus ring (`talentA11y.css`) landed on the bare text field inside the top-bar search box on click. Text fields are now exempt (they show focus through their box), and the top-bar search box border turns green on focus (`DashboardTopNav.jsx`). Buttons and links keep the keyboard ring. ✅ VERIFIED

## [2026-11-21] style | Sidebars: slim scrollbar, pinned cards

- New `.slim-scrollbar` class (`src/index.css`): 4px rounded thumb on a clear track. Applied to every portal sidebar / rail scroll area (talent, parent, recruiter workspace, dashboard, admin, agency, institution, collapsed rails); `DashboardSidebar` used to hide its bars entirely.
- Talent and parent sidebars: profile card (with the collapse button) pinned at the top and the bottom card (public profile / "You're also a talent") pinned at the bottom; only the page links scroll (min ~120px). Below ~740px of window height the whole sidebar scrolls instead so nothing is cut off. ✅ VERIFIED at 900 / 760 / 700 / 520px, both looks, no errors.

## [2026-11-21] fix | Talent app inspection pass (phases 3 and 4)

- Five parallel passes over the talent chrome, `/home`, `/career-content`, `/job-postings`, `/messages`, `/notifications`, `/learning`, `/streak`, `/wallet`, `/settings`, `/community`, `/my-assessment` and `/skills-lab`, both looks, against Figma REST exports (no 429).
- Shell: sidebar is now the same everywhere (Home, My Assessment, Opportunities, Wallet, Clubs, Messages, Skills Lab, My Learning, Profile); `?demo=1` is kept across navigation; demo URLs never call the talent API or redirect to /login (`talentHomeState.js`); search placeholder says clubs; top bar 90px; scroll area clears Ask Buddy.
- Figma renamed Community → **Clubs** and My circle → **My crew**: copy updated across the area; "Create a club" placement and the Clubs | My crew switch follow the frames.
- Fixes per page are in each feature wiki page's "Inspection (2026-11-21)" section: talent-home, talent-jobs, talent-messages, talent-notifications, talent-my-learning, talent-wallet, talent-settings, talent-community(-create), talent-my-circle, talent-assessment, talent-skills-lab.
- New gaps added to `backend-integration-gaps.md` §3 and `missing-designs.md` (Talent); fixed inert items ticked there.
- Not covered: live signed-in pages; Skills Lab game boards and their dialogs weren't click-tested; My crew right column not built.

## [2026-11-21] feat | Talent sign-up states built from existing patterns

- **Address step:** Region, District and Town/City now show their required error once left empty (same rule as the parent step; before, the errors only appeared after a submit, which the disabled button never allowed). Region error is new. `Select` gained an opt-in `onClose` (fires when the open list closes) so a searchable dropdown counts as visited. ✅ VERIFIED in the browser: no errors on first paint or while the list is open; each error appears on leaving empty and clears on picking/typing; no console errors.
- **Contact lockout pop-up ("Something went wrong"):** Playful now gets the ink edge, hard shadow, HEADS UP sticker and stars; red medallion kept. Focused unchanged. ✅ VERIFIED (both looks, centred, no errors).
- `missing-designs.md`: contact code states and address errors moved to Done; sign-up phone layouts removed (auth screens won't get mobile designs).

## [2026-11-21] docs | Talent sign-up gaps audit (18+ and under-18)

- Re-swept `/get-started`, `/login` and `/onboarding/talent/*` against the two handover docs.
- `backend-integration-gaps.md` › Auth and onboarding: added role choice not saved, curriculum not collected, Review page data the app doesn't hold, the Done page's fixed "Phone and email verified" row, and the unconfirmed parent email for under-18s.
- `missing-designs.md`: added the address error state, tutorial steps 2–4 copy, sign-up phone layouts, and P3 items (under-18 Done page wording, live Done page, kept Watch tutorial, Review Talent Score strip). The contact-code item now notes the modals are missing in both looks.

## [2026-11-21] design | Step pop-up Playful spot illustrations

- Exported from Figma (REST, SVG 1x): `talent-onboarding/step-dialog-spot-saved.svg` (green bookmark, Identity captured) and `step-dialog-spot-learning.svg` (open book, Address confirmed / Education recorded / Not quite yet; the three Figma copies are identical apart from sub-pixel rounding).
- `StepDialogParts.jsx`: `DialogHero` now takes `spot`, `spotTop` (the spot's top in the designed card) and `padTop` (the card's top padding in code). In Playful it renders the 96px spot (80px on phones) with the three doodle stars anchored to it; `DialogStars` was removed (stars used to sit ~22px too high). Focused still shows the icon tile.
- ✅ VERIFIED in the browser at 1440×900, Playful: spot at card x172 / y60, 67, 60, 69 and stars at (370,118), (346,150), (40,124) for all four pop-ups, exactly the design's positions; phone (375) checked visually; Focused unchanged; no console errors.

## [2026-11-17] design | Step pop-ups get the Playful look; education grade fixes

- **Identity captured, Address confirmed, Education recorded, Not quite yet** now use the shared `talentAuth/StepDialogParts.jsx`: rendered into `<body>` (the Not quite yet pop-up was off-centre inside the form column); Playful adds an ink edge + hard 4px shadow, a tilted gold sticker (SAVED! / HEADS UP) and three stars, and Playful button labels ("Nice! Next up: Contact", "Next up: Education", "I'm ready"). Focused is unchanged. ✅ VERIFIED (Not quite yet, both looks: centred, no errors). The other three need a backend session to reach and weren't screenshotted.
- Playful spot illustrations: done 2026-11-21 (see that entry). The contact lockout pop-up has no Playful frame, so it is unchanged.
- **Education:** choosing Primary School opens the "Not quite yet" pop-up straight away and locks Grade ("GTH starts at JHS"); University offers Years 5 and 6.
- Backend gaps (`backend-integration-gaps.md` › Auth and onboarding): talent sign-up section added (school search 2-char minimum, no JHS schools in the directory, hard-coded grades and nationalities, test code, parent email rule, Keep me logged in, tutorial video, done page, Year 5/6 support unconfirmed).

## [2026-11-17] fix | Ghana phone fields accept a leading 0 / pasted +233

Contact (phone, WhatsApp) and parent info counted every digit, so "0503177216" (10 digits) failed "Enter a valid 9-digit Ghana number". `ghanaLocalDigits` (services/onboardingMappers.js) drops the trunk 0 or a pasted 233 country code; validation uses it, and on blur a complete number is tidied to its 9 local digits (0503177216 → 503177216). `toGhanaE164` already handled both for the API. ✅ VERIFIED: 0503177216 and +233 24 123 4567 are valid and tidied; 05031 still errors.

## [2026-11-17] fix | Select menu flips above the field when there is no room below; local `.env` for sign-up

- `ui/form/Select`: the menu always opened downward (`top-full`, max 340px), so near the bottom of the screen it was cut off by the scrolling form column. On open it now measures the visible area (viewport ∩ every overflow ancestor). If the menu doesn't fit below and there is more room above, it opens upward (`bottom-full`, shelf shadow flipped); its height is capped to the room it has (min 160px). It re-measures on scroll and resize, and the phone scroll-into-view only runs when it opens downward. Shared by every `Select` in the app. ✅ VERIFIED: Nationality on personal info at 1440×760 (opens up, fully visible), 1440×1200 and 390×760 (opens down, fully visible).
- "Organization not found" on date of birth: there was no `.env`, so `VITE_TENANT_ORG_ID` was blank in `POST /v1/onboarding/start`. Local fix: copy `.env.example` to `.env` (gitignored) and restart Vite. ✅ VERIFIED (staging returns a session with the ID, the same 404 without it).

## [2026-11-12] fix | Landing: "Hiring? See GTH for recruiters" (hero) and "See GTH for recruiters" (For everyone › Recruiters tab) now open `/get-started?role=recruiter` (role picker, Recruiter selected; `LANDING_ROUTES.getStartedRecruiter`). Figma draws no target, so this is ⚠️ ASSUMPTION, chosen by the product owner. The other For everyone tab buttons now lead to their role's sign-up too:

- Students "Create my free profile" → `/get-started?role=talent`
- Parents "Invite my parent" → `/get-started?role=parent`
- Schools "Bring GTH to my school" → `/institution/sign-up`

The routes are in `LANDING_ROUTES`. The home FAQ link "Ask Career Buddy or email info@ghanatalenthub.com" was plain text and is now a `mailto:info@ghanatalenthub.com` link (`FaqSection.jsx`). How it works step 03 photo: the 300px-tall `object-cover` frame cropped the subject's head on wide single-column cards (≈600-1280px). The step now carries `imageFocus: 'top'`, so it renders with `object-top`.

## [2026-11-17] design | Talent auth: under-18 pop-up, Figma fonts, error states — final pass

- **"Almost There" pop-up** (under-18s, after date of birth) rebuilt from the frames in both looks. Playful: "FOR YOUR PARENT" sticker, stars, hearts illustration, ink edge. Focused: gold star, 3px pale green edge. It stays open until the user acts: Continue goes to Personal info, close or Esc stays on date of birth. It used to vanish after 1.2s. ⚠️ Figma's button says "Next up: Education" / "Continue To Education"; ours names Personal info, the real next step. The old bitmap crops (`almost-there-*.png`) are replaced with Figma SVGs (`almost-*.svg`). ✅ VERIFIED (both looks, flow).
- **Fonts:** Figma draws the sign-up and login screens in SF Pro Rounded, with Focused headings in SF Pro Rounded Semibold and Playful headings in Bricolage. The bundled rounded font (styles/parent.css) now also applies under `[data-ui-style]`, and the step headings use `focused:font-sans`. ✅ VERIFIED.
- **Error states:** fields whose helper icon is the green diamond now switch to a red diamond on error (`Field`). The education "A few fields need attention" card is a top-right toast on desktop, as drawn, and stays inline on phones. Contact, address and education error frames otherwise match (red edges, wording). ✅ VERIFIED.
- Address, education and review checked side by side with their Focused frames: they match. Address keeps the 6-field layout from the later frames, while the default frame still shows the older 4 fields.
- Under-18 date of birth now follows the latest frames (page 2431), at the product owner's request: full-width 698px field and Continue (replacing the 386 / 260 sizes from 2026-11-15), and the under-18 notice is a full-width cream card with an amber triangle, bold "One more step coming up" and one line of detail (`dob-minor-warning.svg`). ✅ VERIFIED (screenshot vs 8308:28544).
- Lint clean; `npm run build` passes.

## [2026-11-15] design | Panel tutorial a11y, login in both looks, parent info rebuilt, personal info field states

- **A11y:** `OnboardingPanel` hid every layer, caller overlays included, under one `aria-hidden` wrapper. Only background layers 1-6 are hidden now. The step panels' tutorial buttons sit on their own non-decorative layer (`PanelStage decorative={false}`; the contact overlay has a second, visible layer). ✅ VERIFIED: each step's panel exposes only the tutorial button to assistive tech, and it opens with the keyboard on all six steps. Login, forgot password and recruiter panels expose only their tutorial button too.
- **Login in both looks:** the "Focused · Login Screen" frame draws no style switch, so `/login` and `/forgot-password` open the style scope without the switch (`followsStyle` in `OnboardingNavbar`) and follow the look picked in sign-up. Focused: flat photos at the frame's centres; flat mint Data Protected chip, white compliance chip and soft score card; no sparkle, stars or brand sticker; plain WELCOME BACK pill; standard checkbox; soft field and sign-up card shadows. Corner dots are clipped inside the photos, and the tutorial label is hidden (circle only, as drawn). ✅ VERIFIED (screenshots, both looks).
- **Parent info** rebuilt to the current frames: "06b Parent / Guardian" tag (amber pill / gold sticker + stars), "One More Thing", First + Last name, Relationship + Phone (SMS), full-width Email, blue "Your data is protected under Ghanaian law" card, full-width CTA, no white sheet, personal-info panel with the living-room photo. ⚠️ Deviation: Figma says one contact method is enough; email stays required (the opt-out notice is emailed and the backend rejects the step without it), and the helper and card copy say so. ✅ VERIFIED (screenshots, both looks).
- **Personal info field states:** "Looks good" under first and last name once filled. Photos over 5MB are refused, with a red dashed slot and "File is too large — maximum size is 5MB". The photo slot is now Figma's dashed upload circle; the 86px slot art had been shrunk to a 16px dot inside the Upload button. ✅ VERIFIED.
- Focused code pop-up states (code sent / expired / verified) checked against their frames: already matching.

## [2026-11-15] design | Sign-up: Focused look matched to the "Focused ·" frames; Playful pop-ups; tutorial wiring

- **Focused panels** (product owner: "change everything to match the Focused screens"). The Focused frames draw every panel photo flat (contact's green photo stays at -18deg) at their own centres, with flat white chips, soft shadows and no sparkles, arrows, snow dots or stars. `StageCard` / `PhotoCard` take `focused: { cx/cy | centerX/centerY, rotate? }` (flat by default under Focused). Positions come from the frames (date of birth, personal info, contact, welcome), and every Focused photo gets the softer frame shadow. Welcome cards: Focused flat (1,580 at 13.78/32.63, My Experience at 81.43/25.5) with soft shadows; Playful keeps tilt and hard ink shadows. ✅ VERIFIED (date of birth / personal info screenshots vs frames at 1728×1065).
- **Look switch motion:** `.gth-mode-move` (index.css) glides left/top/width/transform/shadow over 520ms when the style switch flips; off for reduced motion. ✅ VERIFIED (photo mid-transition sampled).
- **Sizes:** date of birth uses the 386px field and 260px Continue in both looks (under-18 frames; product owner picked these over the 18+ frames' 698px). Every other step's field, button and heading sizes are identical in both looks and match ours. The helper line and under-18 notice stay on one line on desktop and wrap left-aligned (icon pinned) on phones. The DOB field uses Figma's calendar glyph and the green diamond helper icon. ✅ VERIFIED.
- **Pop-ups:** the code and verified dialogs get the Playful sticker, stars, ink edge, spot illustrations and "Sorted! Next up: Address"; the active Playful code box gets a green edge with a hard shadow. Legal dialogs, success page and welcome page Playful touches are logged below. ✅ VERIFIED (screenshots).
- **Tutorial:** the watch-tutorial buttons drawn in the step panels had no click handler. `TalentOnboardingPanel` now opens `LoginTutorialModal` and hands `open` to the in-art buttons through `talentTutorialContext`. Steps view: steps 2-4 get icons (🎂 📝 👪, ⚠️ ASSUMPTION; Figma only draws step 1's 🎓). Inactive chapter numbers get the ink edge (Focused keeps the pale one). ✅ VERIFIED (opens on date of birth, personal info, contact, address, education, parent info).
- **Toast:** dismissing during the slide-in left the toast mounted and invisible (the slide-in's finish reset the phase). Fixed in `ui/Toast`; a press anywhere closes the welcome card in both looks. ✅ VERIFIED.
- ⚠️ Open: the panel art is `aria-hidden`, so its tutorial buttons are clickable but hidden from screen readers. The login Focused frames exist but login stays one look (earlier product-owner decision).

## [2026-11-15] fix | Talent welcome toast on the shared toast system; short-screen clipping on welcome + login

- **Welcome toast:** "Welcome to GTH, Student!" was a one-off element drawn inside the welcome panel art. It now uses `ui/Toast` with a new `variant="welcome-card"` that keeps its original look (309px, #f8f8f4, pale green edge, green check / title / X). It gets the system's slide motion and scrim, and the Playful ink edge and hard shadow. It sits below the nav at the top right, so it also shows on phones, and auto-dismisses after 3s (Playful: 6s minimum and pauses on hover, as for all toasts). `WelcomeToast` removed from `TalentWelcomePanelContent`. It appears 1.5s after the page loads (`TOAST_DELAY_MS`, product owner: "so the user actually notices it"). ✅ VERIFIED (screenshot, no page errors; not present at load or after 1s, present at 2s).
- **Short screens:** the welcome and login content columns centred with `items-center` inside an `overflow-y-auto` box. When the content was taller than the box, centring pushed its top out of view where it couldn't be scrolled to. They now centre with `my-auto` on the inner column, which collapses to 0 when there's no room. ✅ VERIFIED at 1440×635 (heading 219px from the top, below the 91px nav).

## [2026-11-15] design | Auth phase 3: policy dialogs, success page, welcome panel

- **Policy dialogs** (`LegalModalShell`: Terms, Privacy, Data Processing): Playful adds a tilted gold "QUICK READ" sticker on the top-left corner, three stars on the intro banner, an ink edge on the banner icon tile, and the CTA "Got it, I accept" (only when the default label is used). Focused is unchanged. The dialog is now portaled to `<body>` at z-60: the sign-up layout's `isolate` section had put the nav above the scrim. ✅ VERIFIED (screenshots, both looks).
- **Success page** (`OnboardingDonePage`) rebuilt to the current Focused and Playful success frames: 640px column, new stats (welcome bonus "+50 pts" / "+50 XP", badges earned, rank in Ghana), welcome-email banner, duotone icons (Focused) or sticker-style spot illustrations (Playful), "pts" vs "XP" pills, green gradient share card with a gold Copy link, one-line footer. Playful: ink-edged cards, "YOU'RE IN!" and "BOOST YOUR SCORE" stickers, tilted Gold Tier sticker, hero stars, Bricolage headings. Live mode still hides score, stats and points. ⚠️ ASSUMPTION: the confetti burst in the frames is not built. Old `done-*` icons replaced (`done-check`, `done-check-circle`, `done-stat-*`, `done-next-*`, `done-spot-*`, `done-verified-*`, `done-welcome-mail`, `done-chevron-right`). ✅ VERIFIED (screenshots, both looks).
- **Welcome panel** (`TalentWelcomePanelContent`): "My Experience" card matched to Figma (hard 4px ink shadow, title/pencil/bar offsets, 30px Submit button with #224626 drop). The main photo keeps its Playful tilt in Focused (product owner): `StageCard` and `PhotoCard` now flatten in Focused only when a page gives explicit Focused geometry. ✅ VERIFIED (screenshot, Focused).

## [2026-11-15] fix | All washi-tape strips removed from the auth screens

Product owner: the plain tape strips read as empty rectangles. They are gone from the login panel, the tutorial modal and the sign-up step panels (`StageTape` deleted). Stars, stickers and the brand sticker stay.

Verified: 0 tape-coloured elements on /login, with the tutorial open, and on /onboarding/talent/dob (Playful); no page errors; lint clean.

## [2026-11-15] design | Auth phase 3 (in progress): tutorial modal, shared step panel looks, date of birth

**Tutorial modal** (`LoginTutorialModal`, login = one look, Figma "Tutorial page" over login):

- **Box:** ink border @55% and a hard 4px shadow.
- **Decorations:** "WATCH ME · 3 MIN" gold sticker on the top edge and three doodle stars. The two tape strips drawn on the video's corners are left out (product owner).
- **Video:** solid gold 68px play disc with an ink edge, centred; logo above, title below.
- **Active chapter:** ink-edged number dot, 1.5px green row border, and a gold tilted "Playing" sticker.
- **Fix:** focus now moves back into the dialog when Play switches to the step view (Esc and Tab escaped before).

**Login panel:** the pink tape on the top-left photo was removed (product owner); the yellow bottom tape overlaps its frame edge.

**Sign-up step panels** (`TalentPanelParts`):

- **`StageCard`:** takes its position, size and tilt from CSS variables. The `focused:` variant swaps in the Focused-frame position with no tilt (`focused` prop); Playful keeps the tilted layout.
- **`DataProtectedChip` / `GdpaBadge` / `AdultYouthCard`:** get `playful:` sticker looks (ink border, hard 3px shadow, tilt; GDPA gold).
- **New:** `StageTape`, `StageStar` and `StageBrandSticker`, shown in Playful only.

**Date of birth:**

- **Panel:** Focused photo positions added; Playful tapes, stars and brand sticker added.
- **Eyebrow:** new shared `StepEyebrow` (Focused pill / Playful gold sticker with stars).
- **Spacing:** 71px above Continue on desktop, as drawn.

**Header and backgrounds:**

- `OnboardingHeader` label reads "COMPLETE" in Focused and "GOOD START" in Playful.
- Step pages no longer paint white over the layout's cream (DOB, personal info, contact, address, education, done).

**Percent kept as computed:** the frames show fixed numbers (12% at DOB); the app computes from the trail (14%).

Verified by screenshot against both DOB frames; lint clean; no page errors.

## [2026-11-15] design | Auth screens phase 2: role selection with Focused / Playful, the style switch on sign-up, auth footer

**Product owner (2026-11-15):** sign-up screens have two looks (Playful = the original frames, Focused = the "Focused ·" copies `8308:*`), switched from the top bar as drawn. Login stays one look.

**Switch and scope.** `OnboardingNavbar` exports `hasStyleModes(pathname)` (`/get-started`, `/onboarding/talent/*`). On those routes it renders `StyleSwitch inNav` and `UiStyleScope`, so the `playful:` / `focused:` variants apply. `/login` and every other onboarding route get neither. Verified: `/login` has no `data-ui-style` and no switch; `/onboarding/talent/dob` has both.

**Role selection** (`GetStartedPage`, Playful `2153:13443` / Focused `8308:55896`):

- **Eyebrow:** Playful = gold sticker (4deg, ink border, 2px ink shadow) with three doodle stars; Focused = the `#faf4e8` pill.
- **Cards:**
  - Playful: 1.5px borders with a hard 4px offset shadow (selected green @65%, others ink @45%, `#fffefc`). Phone rows get a 3px version (⚠️ ASSUMPTION, no phone frame).
  - Focused selected card: 1px green border with a soft shadow, as drawn; this drops `Card`'s old green shelf.
- **Talent benefits:** Playful starts "engagement with ai career buddy"; Focused "Free talent assessment". Parent / recruiter rows are the same in both.
- **Footer:** new `components/shared/AuthFooter.jsx` (both looks): copyright, partner squares with "+246 partner companies", About · Privacy · Contact, and the 5px kente stripe (340px green/yellow/red thirds).
  - Privacy opens the shared privacy dialog; Contact is mailto.
  - About → `/` (⚠️ ASSUMPTION: there is no About page).

**Figma inconsistency kept out:** the recruiter-selected frame labels the talent card "STUDENT/GRADUATE"; every other frame says "TALENT".

**Verified** in Chromium at 1728×1117 (both looks) and 390:

- Clicking "Focused" in the bar flips `data-ui-style` live.
- Computed shadows: Focused selected `0 2px 8px … , 0 1px 2px …`; Playful selected `0 10px 24px rgba(56,116,64,.15), 4px 4px 0 rgba(56,116,64,.65)`; Playful others `… 4px 4px 0 rgba(28,42,33,.45)`.
- Footer present in both looks; no page errors; lint clean.
- Note: headless Chromium reports 1.5px borders as 1px even on a plain test box (rounding), so border widths were checked by class.

## [2026-11-15] design | Auth screens get the Playful touches: phase 1, Login

**Source.** Figma pages "onboarding screens-Talent 18 and abover" (`2093:6547`) and "onboarding-talents below 18 years" (`2431:46798`).

- Every auth section now has its original frames with Playful touches (stickers, washi tape, doodle stars, ink borders with hard shadows) plus a later "Focused ·" copy (`8308:*`).
- Product owner (2026-11-15): auth screens have **one** look, the original frames ("a touch of focused and playful"). There is no style switching on auth, and the Focused copies are ignored.

**Phase 1, Login** (`2968:49708`):

- **"WELCOME BACK":** gold sticker (`#ffd86b`, 1.2px ink border, 2px ink shadow, 4deg) with three doodle stars at Figma offsets from its centre.
- **Checkbox:** new `Checkbox look="sticker"` (1.2px #ccc, 2px ink offset shadow; ticked state ⚠️ ASSUMPTION).
- **Register card:** #fefefd, 1.5px ink @55%, radius 16. Its button is 38px tall, 23px sides, 14px Bold, person icon only.
- **Right panel** (`TalentLoginPanelContent.jsx`):
  - "Data Protected": mint, ink border, 3px ink shadow, 3deg; second line 12px Instrument Sans as drawn.
  - Compliance chip: gold sticker, -3deg, sized to its text.
  - Score card: 1.5px ink @55% border plus 4px ink @45% shadow.
  - New: three washi tapes pinned to their photos (offsets from each photo's centre, so they hold on taller panels), three gold doodle stars, and the "🇬🇭 Built for Ghana's next gen" brand sticker (-4deg).
- **Background** (`TalentOnboardingLayout`, all talent auth screens): cream gradient `#fbf6ea → #f4f6ec` plus the grid at 70%. The section is now `isolate`, so the z:-1 glows stay above it.
- **Shared icon:** `GenzDoodleStar` added to `shared/assets.jsx`.
- **Kept:** the Phone / Email switch (env `VITE_LOGIN_IDENTIFIER=both`; not in Figma).

Verified in Chromium at 1728×1117, by eye against the Figma frame at the same scale: no page errors; checkbox ticks; phone 390 layout intact; lint clean.

**Next phases:** role selection → talent 18+ steps (DOB, personal, contact + code, address, education, review, success) → under-18 additions (parent info). The DOB step frame also shows the same panel touches and a Focused / Playful switch in the top bar (open question).

## [2026-11-15] fix | Login: the show-password eye now changes with the state

The toggle did switch the field between masked and visible, but its icon followed whether the field had text (`login-eye-a` grey / `login-eye-b` dark, the same open eye), not the visibility.

- **Masked:** the Figma open eye, unchanged.
- **Revealed:** the same eye with a slash drawn over it, in the eye's colour. This matches `PasswordInput`'s Eye / EyeOff pair (the icon shows what the next click does).
- ⚠️ ASSUMPTION: Figma draws only the masked state.

Verified in Chromium: type password→text→password, `aria-label` "Show password"→"Hide password"→"Show password", `aria-pressed` false→true→false, slash only while revealed; no page errors.

## [2026-11-15] fix | Get started (`/get-started`): centred on phones, no white strip, button band only when pinned, roomier mobile spacing

- **Centring.** The section is a flex column one screen tall below md, and the content uses `my-auto`. It sits in the vertical middle when there is room and starts at the top (and scrolls) on short screens; `justify-center` would have pushed overflow above the top edge.
- **White strip.** The section's min-height was `100vh - 160px`, but the header is 91px, so tall desktop windows showed an empty white strip (69px at 1920×1080). It is now `100dvh - 91px` (`- 53px` below md).
- **Button band.** New `StickyActionBar` prop `surfaceWhenStuck`: the white background, hairline and blur show only while the bar is pinned to the bottom, i.e. while the content after it is below the fold. Used on this page only; the onboarding forms keep their always-on bar.
- **Mobile spacing.**
  - Column gap 12 → 20, padding 16 → 32 top and bottom, gutter 16 → 20.
  - Heading block gap 8 → 12.
  - Role cards gap 8 → 12, padding 12 → 16, inner text gap 2 → 4.

Measured:

| Viewport         | Space above / below              | Bar                                                  |
| ---------------- | -------------------------------- | ---------------------------------------------------- |
| 390×844          | 17 / 17                          | see-through                                          |
| 430×932          | 79 / 79                          | see-through                                          |
| 375×667, 320×480 | starts under the header, scrolls | white while pinned, see-through at its natural place |

Document height = section bottom at every size, 834 to 1920 included. No page errors; lint clean.

## [2026-11-14] fix | Coming soon: no empty cream strip below the page

The bottom-left gold glow (`-bottom-[140px]`, blur 120) poked 140px below the green page because the root only clipped sideways (`overflow-x-clip`). That made the document taller than the page, with an empty cream strip to scroll into. The root now uses `overflow-clip`. Measured at 1914×950, 1440×900, 1024×768, 834×1112, 390×844 and 360×740: document height = page height, no sideways overflow. The page still scrolls where its content is taller than the window (1105px at 1914 wide).

## [2026-11-14] fix | FAQ page: whole card toggles, sticky topic pills on phones and tablets, Buddy mascot centred

- **Whole card toggles** (`FaqAnswers.jsx` `FaqItem`): a click anywhere on an FAQ card opens or closes it. The inner button keeps `aria-expanded` and keyboard use; its click bubbles to the card, so the handler runs once. A click that ends a text selection in the answer does not toggle, so answers can still be copied.
- **Sticky topics below xl:** the pill row sticks under the fixed nav (`top 72 / md 88`) with a translucent backdrop. The "Browse by topic" label shows only on desktop (it is in the xl side card; the phone and tablet frames draw pills only). Tapping a topic now uses `smoothScrollTo` with an offset of nav + pill row + 16, so the group title lands below both bars (smooth on iOS too).
- **Buddy mascot** (`FaqHelp.jsx`): the PNG (160×147) has its drawing at x 13–135, y 17–139 (centre 74, 78, not the canvas centre), so `object-cover` left it about 2px left and 1.5px low. It is now positioned so the drawing's centre lands exactly on the 46px circle's centre (measured 23.00, 23.00).

Verified in Chromium:

- **Card:** a click on the padding opens it; button click and Enter / Space toggle once; a click with the answer selected keeps it open.
- **Topic bar:** stuck flush under the nav at 30% and 60% down the answers on a 390px phone.
- **Topic tap:** the group title lands 16px below the bar at 834px.
- **Label:** hidden at 390, visible at 1440.
- No page errors; lint clean.

## [2026-11-14] fix | Landing: FAQ open item shadow, closing-CTA sticker, story chips

- **FAQ page items** (`FaqAnswers.jsx`, Figma 7797:31776): the open item had a green bar shadow (`0 6px 0 #387440`), copied from the home FAQ. Figma gives open and closed items the same grey hard shadow (`5px 5px 0 rgba(28,42,33,.2)`); only the fill changes, white when open and `#fffdf7` when closed. Checked against the product owner's Figma screenshot; the Figma tools were offline. The home FAQ (`home/FaqSection.jsx`) still uses the green bar and has not been re-checked.
- **"NO CV NEEDED" sticker** on the closing CTA (`FinalCta.jsx`): on tablets it was placed at `left: 84.6%`. On cards narrower than about 780px the ~120px sticker ran past the card's clipped edge. It is now anchored right (`md:right-3`). Measured at 390 / 768 / 834 / 1024 / 1279 / 1440: never past the edge.
- **Story timeline chips** (`stories/FeaturedStory.jsx`): the phone layout was a 2-column grid, so "3 recruiter views · Week 5" broke onto two lines. The chips now flow and wrap as whole pills (`flex-wrap`, `whitespace-nowrap`). One line at all six widths.
- **FAQ search hint:** confirmed with an emulated Mac platform: the chip shows "⌘K" and ⌘K focuses the field. On Windows it shows "Ctrl K" and Ctrl+K works.

## [2026-11-13] docs | New [missing-designs.md](missing-designs.md): handover to design

Screens, states and controls the app needs but Figma does not draw, in three priorities:

- **P1, features with no design:** Share my story, footer pages, parent dashboard destinations, recruiter profile / invoice / tour.
- **P2, missing states:** opportunities sort / pay / no results, verification code lockout, game end states, community tabs, pipeline states, wallet errors, …
- **P3, our stand-ins to confirm.**

Gathered from this week's inspection and the "not drawn" notes across the wiki.

## [2026-11-13] fix | FAQ page: Ctrl+K / ⌘K focuses the search; the contact cards lead somewhere

- **Ctrl+K / ⌘K** anywhere on `/faq` focuses and selects the search field (`aria-keyshortcuts`). The hint chip reads "⌘K" on Mac and "Ctrl K" elsewhere (⚠️ ASSUMPTION: Figma draws ⌘K only). Search still has no results state (see missing-designs).
- **"Start chat"** goes to the account's Career Buddy. Signed out: `/login?next=/profile/filling/career-buddy`. Signed in: talent → `/profile/filling/career-buddy`, recruiter → `/profile/filling/recruiter-buddy`, parent → `/parent?buddy=open`.
- **"Send an email"** stays `mailto:info@ghanatalenthub.com`.
- **"Open WhatsApp"** is `https://wa.me/<VITE_SUPPORT_WHATSAPP>` with a greeting, in a new tab. No support number exists anywhere (the parent help data's `+233 30 000 0000` is a placeholder), so until `VITE_SUPPORT_WHATSAPP` is set the button stays inert. The variable is added to `.env.example`.

Verified in Chromium: Ctrl+K focuses the field at the top and after scrolling; Start chat → `/login?next=/profile/filling/career-buddy`; email href; no WhatsApp link without the variable; with it set, `https://wa.me/233200000000?text=…`, target `_blank`, rel `noopener noreferrer`.

## [2026-11-13] fix | "Bring GTH to my school" goes to the institution sign-up and is drawn as Figma's sixth benefit row

- **Where it goes.** Both copies follow `landing/shared/schoolSignUpPath.js`: For parents & schools › Schools (was `/get-started`, a dead end because the role picker has no school option) and home For everyone › Schools.
  - Default → `/institution/sign-up` (11.1.1a, live).
  - Signed-in school staff → `/institution`. Staff are recognised by `metadata.isPrimaryContact` / `institutionRole` only, not by `organizationId`, which students carry too.
- **Look.** Figma 9553:246776 is not a filled button. It is a sixth row of the benefit list: green check tile plus 17px Medium `#1c2a21` text, 24px below the previous row. The section now renders it as that row, a link whose text underlines on hover or focus (`lp-ul-hover`, triggered from the whole row).
- **Not checked:** the tablet (7815:297339) and mobile (7815:298503) frames; the row reuses the list's responsive sizes.

Verified in Chromium: signed out → `/institution/sign-up`; fake signed-in staff profile → `/institution`; student profile → `/institution/sign-up`; home Schools tab → `/institution/sign-up`; same font, weight and colour as the row above, 24px gap; underline 0 at rest and 100% on hover or focus; no page errors.

## [2026-11-13] fix | "Invite my parent" goes to the child's sign-up and matches Figma

- **Where it goes.** The button speaks as the child, so both copies follow `landing/shared/inviteParentPath.js`: the For parents & schools button and the home For everyone › Parents tab (that tab went to the parent sign-up before).
  - Signed out → `/get-started?role=talent`. Under-18s give a parent's contact at `/onboarding/talent/parent-info`, which sends the invite.
  - Signed-in talent → `/settings/guardian?state=invite`. That form's send is not wired yet.
  - Anyone else signed in → their own home.
- **Parent link.** Added "Are you a parent? Sign up as a parent" → `/get-started?role=parent` under the button (⚠️ ASSUMPTION: not in Figma).
- **Look.** The button was the green primary with an arrow. Figma 7797:29742 is the tertiary lg: `#e1eae2` fill, `#c1d4c4` border (1 top / 2 sides and bottom), `#165d3a` SF Pro Rounded Bold 16/24, radius 14, shadow `0 1px 2px rgba(27,36,44,.12)`, no icons. It now measures 56px tall as drawn (padding minus border, since Figma strokes sit inside).
- **Width.** 190px against Figma's 203, because the landing site loads Nunito, not SF Pro Rounded (see the font note below).

Verified in Chromium: both buttons → `/get-started?role=talent` signed out; parent link → `/get-started?role=parent`; colours, border, radius and height measured; no page errors.

## [2026-11-13] docs | New [backend-integration-gaps.md](backend-integration-gaps.md): what runs without the backend, page by page (mock data, inert buttons, values not saved), from a sweep of every route plus spot checks; api.md "Not wired" marked stale

## [2026-11-13] feat | Opportunities cards open the role, the heart saves it, and login carries on to the destination

- **Card and heart.** On `/opportunities` the card title is a link stretched over the whole card (`::after`). It goes to `/job-postings?tab=browse&job=<id>`. The heart is a separate link above it: `/job-postings?tab=saved&save=<id>`. Signed out, both go through `/login?next=<destination>` (`utils/authNext.js` `loginThen`).
- **Login.** `LoginPage` now follows `?next=` after the code step (`resolveNext`). It only follows a same-app path that fits the signed-in account's area: talent pages for talents, `/recruiter/…` for recruiters, and so on. Otherwise it goes to the usual home. Paths starting `//` and paths with control characters, whitespace or backslashes are refused.
- **Saving after login.** `/job-postings` reads `?save=<id>` (`talentJobsState.pendingSave`). Once the live feed has loaded it saves that role through `toggleSave` if it isn't saved yet, then removes the key.
- ⚠️ **Sample ids.** The landing roles are sample ids the backend doesn't have. Today `job` falls back to the Browse list (the existing unknown-id handling) and `save` is dropped. Both become real with a public jobs endpoint ([backend-integration-gaps.md](backend-integration-gaps.md)).

Verified in Chromium, signed out: a click on the card body and a click on the heart go to the right `/login?next=…`. `resolveNext` passed 11 cases: talent→jobs kept; recruiter→talent page, talent→admin, `//`, `https://`, tab, newline and backslash all go home; no next goes home. A signed-out `/job-postings?save=…` drops the key. Not verified: a real sign-in, since no test account was used.

## [2026-11-13] fix | Opportunities: real counts, working filters, sort menu, Load more only when there is more

All of it runs on the 8 sample roles in the browser. There is no public jobs endpoint yet; see [backend-integration-gaps.md](backend-integration-gaps.md).

- **Matching and counts.** `opportunitiesFilter.js` holds the one matching, sorting and counting logic. The heading ("N roles match your filters" / "No roles match your filters"), the type-chip counts and the sheet's "Show N roles" button all use it. They replace the fixed Figma numbers 312, 1580 and so on.
- **Filters.** LEVEL / WORK STYLE / REGION now filter. Each sample role has `level` / `style` / `regions` / `payMin` / `payMax`, read off its card (⚠️ ASSUMPTION). A group with nothing ticked does not restrict. The pay bar is a two-handle slider (`?pay=min-max`, 0–15,000, default 2,000–8,000 as drawn); roles with no pay figure always pass. With the Figma-drawn defaults the page opens on 5 roles, not 8. The sheet's Reset also widens pay to the full range.
- **Sort.** The "Sort: Best fit" chip opens a menu built on `FilterSelect` (now accepts a node icon and `chevron={false}`). The options are Best fit (featured first, then the drawn order), Highest pay and Company A–Z, stored as `?sort=`. ⚠️ ASSUMPTION: Figma draws the chip only.
- **Load more.** It shows 8 roles at a time (the 8 cards Figma draws) and appears only when more match. It resets on any search, filter or sort change, and the cards keep the sorted order.

Verified in Chromium: region ticks change the counts and the URL; the pay keys move the range; sort reorders A–Z correctly; Escape closes the menu; Load more was exercised at page size 3; no console errors.

## [2026-11-13] fix | Opportunities search applies on Search, not while typing

On `/opportunities` the query and location fields are now local drafts. Pressing Search (or Enter) writes `?q` / `?loc`, which filters the listing, closes the on-screen keyboard and scrolls smoothly to the listing (`#opportunities-listing`), stopping 16px below the fixed nav (`[data-landing-nav]`). The scroll uses the new `src/utils/smoothScrollTo.js`, a requestAnimationFrame animation, because iOS Safari only supports `scrollIntoView({ behavior: 'smooth' })` from 15.4. It re-measures the target each frame, stops if the user touches, scrolls or presses a key, and jumps straight there under prefers-reduced-motion. Back / forward still restore the fields from the URL. Verified in Chromium at 1440px: typing leaves the URL and the cards unchanged; Search sets `?q=design`, and the page scrolls from 0 to 665 over several frames, so the listing ends 120px from the top (nav 104 + 16). 🔶 LIKELY on iOS: not run in WebKit or on a device (WebKit is not installed).

## [2026-11-11] docs | Screen inspection plan: wiki/inspection/ (README + one file per phase, 11 phases, 293 screens) and an interactive checklist page (https://claude.ai/artifact/2XYzEPjfCCJhBU39gdLTaC)

Click maps generated for Phases 1-10 (262 screens, 2,941 controls) by clicking every visible control on a production build with `/api` answered 401 (no session). 532 controls showed no visible effect and 450 could not be tested automatically; both are flagged for checking by hand. 99 screens need a signed-in session, mostly Institution (28), Agency (30) and Platform admin (18), because their gates call the staging backend (`/api/*/me`). They were deliberately not probed signed in, so the clicks could not change staging data. The two email-token pages need a live link. Phase 11 (emails) is a list only.

## [2026-11-07] fix | Recruiter Settings: buttons that had no destination re-checked against the whole Figma file

The Settings canvas draws no prototype links (all `ON_CLICK` reactions have a null target), so the other recruiter canvases and the repo were searched. Wired: Ask Hiring Assistant → recruiter AI chat; Compare plans / Upgrade / Change payment method → onboarding R05 / R06 (⚠️ ASSUMPTION); rail plan-card Upgrade → Plan and billing. Still not drawn anywhere: WhatsApp us, invoice download, Leave organisation, Preview as talent / View my recruiter profile, Privacy, Terms, Replay the tour. New `recruiter-settings-destinations.spec.js`. See [recruiter-settings.md](recruiter-settings.md).

## [2026-11-07] build | Recruiter Settings & Account + Help (Figma 10161:75722, 38 frames: SR-01…27, R-FB/IV/HS-01, R-HP-01…08)

`/recruiter/settings?tab=…` (nine tabs) and `/recruiter/help`, built on the talent Settings / Help pieces by four parallel builders + lead integration; top-bar Help pop-over and profile-menu slots (`DashboardTopNav panels`), the help pop-over also wired into `/recruiter/job-postings`. Frames 0.3-7.0 % (shell, fonts, dialog centring); 60 specs pass; 39 URLs in the responsive gate pass at 320/390/1024/1440; eslint + build clean; the login-bounce regression now covers Settings and Help (renamed `recruiter-no-login-bounce.spec.js`). Found on the way: a truncated Figma PNG export (read as a false 16 % diff), nav glyphs the builders had not compared (four exported from Figma). See [recruiter-settings.md](recruiter-settings.md).

## [2026-11-07] docs | Recruiter Application Pipeline (24 frames) verified by the lead: re-measured 1.9-4.4 % (new frames) and 2.9-5.8 % (7 older), eslint and build clean, responsive audit on the production build (27 URLs x 4 widths), click-through of menus, drawer and cross-flow links; fixed the talent profile toast navigation bug; see [recruiter-application-pipeline.md](recruiter-application-pipeline.md)

## [2026-11-07] build | Recruiter Application Pipeline board, new design (Figma 'Recruiter - Application Pipeline' 10172:10101): PL-01, PL-01b, PL-02, PL-04, PL-06, PL-15 (1.9-3.4 %)

New board (`PipelineBoard`, `PipelineCandidateCard`, `PipelineCardMenu`, board data model + `pipelineBoardModel` helpers, stage chips, qualified switch, search, card menu, drag, bulk bar, empty pipeline), workspace rail with opt-in Settings row. The older board stays for `sidebar=collapsed` (AP3-AP9, re-measured 2.9-5.8 %), hand-off and live data. Dialogs / drawer / toasts: `actions/` (separate agent). See [recruiter-application-pipeline.md](recruiter-application-pipeline.md).

## [2026-11-07] build | Recruiter Messages inbox (Figma 'Recruiter - Messages' 10124:23474): R-MSG-01…11 on `/recruiter/messages` (1.8–6.5 %), replaces the V2.0 recruiter view

New `recruiterMessages/RecruiterInbox*` (list, thread with application card, archive view, empty states, toasts), 25 purpose-named Figma exports in `assets/recruiter-messages/`, e2e 5 tests incl. 320/390. `?view=talent` untouched; T-MSG-01 (talent frame on the same canvas) NOT rebuilt. See [recruiter-messages-inbox.md](recruiter-messages-inbox.md). `✅ VERIFIED`

## [2026-11-06] build | Recruiter Community Engagement (Figma 10026:36840, 48 frames: RC-C01…C17 clubs, RC-CC02…CC17b host, RC-NW01…NW11 network)

The talent Community pages now serve `/recruiter/community…` in the recruiter shell (`communityVariant.js`, per-audience copy hooks, `base` links). Three parallel builders + lead integration. Frames 2.0-11.6 % (font metrics, shell, dialog centring); 35 specs; 59 URLs in the responsive gate pass at 320/390/1024/1440 after the `CircleToast` target fix; eslint + build clean. Top-bar name/search still the shared recruiter shell's. See [recruiter-community.md](recruiter-community.md).

## [2026-11-06] fix | Recruiter job flows: replaced the hand-drawn glyphs with Figma's exported `Icon/*` instances (37 purpose-named svgs in `src/assets/recruiter-jobs/`, inlined via generated `jobGlyphData.js`); e2e 10/10 (two toast tests passed on rerun after slow-server timeouts)

## [2026-11-06] build | Recruiter job flows (Figma 'Recruiter - Job Postings' 10103:59491): 32 new frames (JT-01…11, CT-01…08, JM-01…13, JS-15) + screening flow JS-01…14 by a parallel agent

New `recruiterJobs/` (shared job form, preview, posting detail, manage menu, dialogs), routes `/recruiter/job-postings/new|new/preview|:postingId|:postingId/edit` and `/recruiter/job-templates/new|product-designer/preview`; Job Postings gained the manage menu, five dialogs, toasts and the new posting; Job Templates gained details dialog, My templates, card menu and the Screening criteria tab (`?view=screening`). All 32 frames 1.9–7.5 % (framecmp), eslint/prettier/build clean, e2e 10 passed incl. 320/390. Not verified: exported glyphs (drawn, see page), real API. Details: [recruiter-job-postings.md](recruiter-job-postings.md). `✅ VERIFIED`

## [2026-11-06] docs | Recruiter Talent Search (19 frames) verified by the lead: re-measured 1.3-7.9 %, eslint and build clean, responsive audit on the production build (22 URLs x 4 widths) with the false positives explained; see [recruiter-talent-search.md](recruiter-talent-search.md)

## [2026-11-06] build | Recruiter Talent Search list (Figma 'Recruiter - Talent Search' 10102:34349, TS-01 … TS-10): workspace rail, sort, filter menus, More filters drawer, loading / no-results / first-visit states

`/recruiter/talent-search` re-drawn from TS-01 (3.4 % vs the frame; the old 7249 build differed: "Invite to apply", "View profile", Sort control, removable filter chips, workspace rail `WorkspaceSidebar` via `renderSidebar`, SF Pro Rounded via `useScopedRoundedFont`, 34px title). New: `ui/MenuPanel.jsx` (popover card + rows), `ui/TogglePill.jsx`, `hooks/useDismissableLayer.js`, `sections/talentSearch/` menus, suggestions, More filters (popover at >=1280x960, sheet on smaller viewports so the Ask Buddy button never covers it), states, URL state hook (keys documented in `TalentSearchSection.jsx` header). Mock rules and every ASSUMPTION are tagged in `talentSearchFilterData.js`. `RecruiterPageHeading` got add-only `accentClassName`. The old `TalentSearchFilterSheet` was replaced by the More filters sheet.

## [2026-11-06] verify | Recruiter AI chat follow-up: exact fonts, signed-in recruiter, accessibility, e2e

Follow-up to the 2026-11-04 entry. Fonts: SF Pro Rounded scoped to the recruiter chat (`hooks/useScopedRoundedFont`, shared with the parent screens), Bricolage Grotesque, Instrument Sans and Raleway self-hosted from npm (`@fontsource-variable/*`, imported in `main.jsx`, removed from the Google link); Raleway on the manual-form prompt and the salary captions. Frames re-measured: 2.8 to 4.7 %, the scrolled company frame (`company-edit-scrolled`) 7.4 % (Figma's stray toast and wash). Signed-in recruiter checked with a mocked API (found and fixed: the company edit form now draws only the rows the panel gives it). Accessibility with axe 4.14 + accessibility tree + keyboard (no real screen reader): fixed the unlabeled file input, the trail scroller, missing h1 and landmarks, a second banner in the job form, an unnamed month select, and `ui/Modal` now traps focus and restores it. Full e2e: ran 4,623 of 4,928 before the session ended; 709 visual-baseline failures (no baselines on this machine), 125 responsive failures on pages this work does not touch (e.g. the "Journey map" label wrap in `engagementShell`, `/recruiter/home` labels), 3 `community-browse` failures that pass on rerun, 1 `home` hero-text failure; the last 305 tests (skills-lab responsive) did not run. Details: [recruiter-ai-chat.md](recruiter-ai-chat.md). Nothing committed.

## [2026-11-04] docs | Recruiter job prospecting V2.0 verified and documented: 29 frames re-measured (1.2–7.4 %), eslint/prettier/build clean, responsive audit 39 URLs (phone checkbox targets fixed; bare /recruiter/home label wrap left to the dashboard session); see [recruiter-job-prospecting.md](recruiter-job-prospecting.md). Removed a duplicated home entry from this log.

## [2026-11-04] docs | Recruiter Figma page map: the file has separate recruiter pages (Job Postings 56 frames, Talent Search 19, Messages 12, Pipeline 24, Community, Settings) that were not in the Prospecting link and are not built; listed in [recruiter-figma-pages-map.md](recruiter-figma-pages-map.md)

## [2026-11-04] build | Recruiter AI chat (Figma 'Recruiter - AI Chat' 7958:160771): 30 frames compared with the existing recruiter Career Buddy and aligned

The recruiter Career Buddy (`/profile/filling/career-buddy?role=recruiter&live=0&cb=<state>`) already existed; this canvas re-draws it, so every frame was compared (framecmp 2.4 to 4.8 %, one scroll-position frame 7.4 %; a verbatim text check) and fixed: talent trail with muted checks, Switch Modes, Emma label, wider Bricolage panel, hero and chips as drawn, new one-line `WelcomeBackToast`, the whole company Q&A / job conversation / upload copy verbatim, a new company edit form, an uploading file chip in the composer, fallback form headline, 14 new `cb=` states and `?jobform=` scroll / dropdown states. 12 Playwright tests, 24 URLs in the responsive gate (96 runs at 320 / 390 / 1024 / 1440 pass), no console errors, lint, prettier and build pass. Not verified: the signed-in recruiter, a screen reader, a machine with SF Pro Rounded. Figma inconsistencies (talent trail and 'Talent Profile Panel' on recruiter screens, 'Emma' vs 'Mr.Whitmore') kept as drawn. Details: [recruiter-ai-chat.md](recruiter-ai-chat.md). Nothing committed.

## [2026-11-04] build | Recruiter shell V2.0 (DashboardSidebar/TopNav/PageBackground/PublicProfileCard): 303px rail with Figma card+nav+Profile item, 87px top bar, #F9FBF9 canvas with correctly sized ellipses (`variant="recruiter"`), solid nav badges; new RecruiterSidebarIcons.jsx. Job Postings frame 4.2% -> 1.6%. Profile item has no destination (assumption).

## [2026-11-04] build | Recruiter Messages V2.0: 5 frames reachable by URL

Frames 7249:83993/84379/84775/85147/85536 → `/recruiter/messages` with `view`, `tab`, `conversation`, `thread`, `menu`, `compareMenu`, `forceHover`, `rail` (see useRecruiterMessagesUrlState.js). New list rows, sans title, thread menus, talent-side mirrored thread + dark proposal card; avatars exported to `src/assets/recruiter/messages/`.

## [2026-11-04] docs | Recruiter design-system gap audit (Figma OHG2xsfCCskT8xEn356njv, canvas 1:2): 12 missing shared components, persona colour token missing, per-portal duplicates; see [recruiter-design-system-gaps.md](recruiter-design-system-gaps.md)

## [2026-11-04] build | Platform Admin 7.8: Site copy, Product names, Media library, Content Editor role (92 new frames) + 4 corrections

Compared the Government file `8520:12` against the build using version history (7.8 was the only recent work), built every missing 7.8 frame (foundation by lead, seven parallel builders), corrected sign-in form, support data, Live Ops restricted view and nav. Frame diffs 1.5–8.2% (media up to 10.8%), responsive audit clean at 4 widths on 104 routes, cross-flow 19/19, eslint clean, build passes. Details, URLs, assumptions: [admin.md](admin.md).

## [2026-11-01] build | Talent Games v2: Games tab, 13 ranked / practice games, shared shell, result card (53 frame pairs)

Figma canvas "Talent - Skills Lab" `7500:92564`, sections "Games v2 · 1 … 14" (new since the Arcade build): GV-01 Games tab (new "Skill games" block above the Arcade, which gets the "Arcade" head and "Play style games"), GV-02/03/09/13 details / cooldown / resume / expired dialogs, GV-04…GV-12 Memory Match + quit / time's up / connection lost + result cards (ranked, under 18, play style), and the games Pattern Pulse, Word Shuffle, Switch Sort, Three in a Row, Grid Logic, Sum Grid, Tower Shift, Errand Run, Chess Tactics, Chess Match, Crisis Room, Makola Haggle (PP/WS/SS/TR/GL/SG/TS/ER/CT/CM/CR/MH frames). New route `/skills-lab/play/:gameId` (`GameV2Page`, games auto-discovered from `gamesV2/games/*.jsx`), all state in the URL. Legacy Arcade games untouched. Existing files edited add-only: `App.jsx` (route), `SkillsLabHubPage.jsx` (dialog layer), `SkillsLabGamesTab.jsx` + `skillsLabGamesData.js` (new block + copy), `scripts/playful-leak-check.mjs`, `tests/e2e/helpers/responsive.js` (98 URLs). Built by seven parallel builders on a lead-built foundation; frame table with diff %, assumptions and Figma inconsistencies: [talent-games-v2.md](talent-games-v2.md).

## [2026-10-28] fix | Parent flows wired together: To review → Wards wallets, My wards ↔ Link a ward, Link a ward → Opt out, Evaluate, Report, Notifications → Settings, sidebar and top bar

Ten buttons that only logged now navigate to the flow built in another session; 9 Playwright tests. See [parent-wiring.md](parent-wiring.md). PW-08c is built (toast + three-ward sidebar); PW-08b is not.

## [2026-10-28] fix | Parent Career Buddy aligned with the Parents-file canvas "AI CHAT parent screens" (14 frames, most already built)

The flow existed (`parentBuddyScript.js`, parent role); compared every frame, added `?role=` to `CareerBuddyRoleProvider`, and fixed parent-only differences (Switch Modes button, Avatar step, Emma label, placeholder, welcome copy, 80 % / 48 % panel numbers, [Auto] bubble, the drawn education conversation, file chip, ward e-mail). 5 Playwright tests, errscan clean, build passes; E3's expanded Personal Info sheet is not built. Details: [parent-career-buddy.md](parent-career-buddy.md).

## [2026-10-28] fix | Parent onboarding Flow B: headings in Bricolage like the Figma frames, "Parent / Guardian" pill in the header

Compared Flow B (canvas "Parents onboarding(PATH B)" `2864:36854`, 1920 x 1200 HTML-import frames) with the build: routes, structure and most copy match. Two visual gaps fixed: (1) every Flow B headline (welcome, identity, verification, contact, security, link ward, consent) and the five right-panel headlines were Instrument Serif with an italic accent; Figma draws Bricolage Grotesque 600, accent coloured but not italic (welcome 52/57, step 36/43, panel 30/36 and 34/41, letter-spacing -0.02em), the same as Flow A; the step panels now break the heading where Figma does ("Your identity / builds trust."). (2) `OnboardingNavbar` shows the "Parent / Guardian" pill (`#faf4e8`, border `#eedeb8`, Figma shield icon `assets/onboarding/parent-guardian-shield.svg`) on the six Flow B step routes; ⚠️ ASSUMPTION: Figma draws it instead of "Log In", we keep both. Not changed (data-driven or deliberate): ward banner / link-ward card fields (the invite has no age or curriculum), "Kofi Mensah's" vs "Kofi's", the Ghana Card step off by default (`VITE_PARENT_ID_VERIFICATION`), the standalone "almost_there_popup" frame (talent under-18 content, not a Flow B screen). Verified: eslint + prettier clean; `parent-invited` + `parent-flows` specs pass (one timing-out test passes alone); responsive audit 35/35 and the short-screen run 14/14; every Figma text found except placeholders and Figma's own stand-ins. Pixel diffs stay 4.8 to 7.2 % because the Figma frames carry HTML-import layout glitches (overlapping captions, wrapped headings).

Audit of the whole app found 15 separate plain-toast implementations (parent `ActionToast`, agency Briefing / Query / Settings, institution Roster / Credential / Settings, public-data Share, community Circle / OwnerLive, learning Saved, messages Language, talent Wallet, voice Saved) plus the separate banner system `ui/Toast`. All plain toasts are now variants of `ui/StatusToast` (polite live region, auto-dismiss timer, optional portal, enter / exit motion); the two identical settings toasts are one `ui/SavedToast`, Briefing is `ShareToast` with its own text and offset. Classes are copied verbatim, so the look is unchanged. `ui/Toast` (scrim, queue, Playful skin; auth and profile flows) stays as the banner system. `ui/DialogCard` and `ui/StatusToast` fade / rise in (200 ms) and leave in 140 ms through a clone (`utils/ghostOut.js`), so every close path is animated; reduced motion has no movement. `ParentTextField` gained `labelClassName` / `asteriskClassName` (Figma ink `#1c2a21` / `#387440` by default); the five wrapper overrides are gone. `Turning18Notice` now uses `DialogCard`.

## [2026-10-28] build | Parent Ask Buddy panel: the five reply-in-progress states (PB-01 … PB-05)

Figma canvas "Parent · 13 Ask Buddy" `10089:2105`: `?buddy=thinking|working|writing|slow|stopped|open` on any parent page, built on the shared `ui/BuddyThinking`; diffs 1.8–2.0 %; 8 Playwright tests pass, errscan clean. Add-only edit to `ParentFrame` (the Ask Buddy button now opens the panel). Details: [parent-buddy.md](parent-buddy.md).

## [2026-10-28] fix | Responsive probe: a label beside a smaller chip is one line, not a wrapped button label

The audit's "button labels wrap" check (`tests/e2e/helpers/responsive.js`, below lg) bucketed text boxes by `top / 8`, so the parent home tabs ("Abena" 18 px + "1 flag" chip text 14 px, 2.8 px apart) were reported as wrapped at 768 px whenever the pair straddled a bucket edge; nothing wrapped (tab height 46, measured 640–1023 px). Boxes are now grouped into lines by vertical overlap; a real wrap is still flagged (90 px button test). Parent routes: 298 of 300 combos pass, the other 2 were dev-server navigation aborts and pass alone (`/parent/link-ward` 5/5). No page code changed. See [parent-notifications.md](parent-notifications.md).

## [2026-10-28] build | Emma's talent home (`/home?as=emma`, TC-01 / TC-02) completes the parent-who-is-also-a-talent flow

One talent home, a persona layer: `emmaPersona.js` plus add-only edits to `talentHomeState`, `talentShellData`, `TalentSidebar`, `DashboardTopNav`, `TalentHomePage` and the new `SpaceBanner`. TC-01 7.7 %, TC-02 7.0 %; 10 Playwright tests pass, errscan clean, build passes; Kofi's home verified unchanged. See [parent-spaces.md](parent-spaces.md), [talent-home.md](talent-home.md).

## [2026-10-28] build | Parent notifications and milestones: bell panel, Notifications page, milestone shared with you, "Abena created a GTH account" notice (5 of 8 frames)

Figma canvas "Parent · 09 Notifications and milestones" `10057:67396`: built PN-01 (`/parent?notif=open`, the bell panel on any parent page), PN-04 (`/parent/notifications`, five tabs by `?tab=`), PN-03 / PN-03b (`/parent/notifications/milestone`, `?toast=sent`) and PN-05b (`/parent?notice=abena-joined`). Focused only, mock data. Diffs 3.3 / 1.2 / 1.3 / 1.3 / 4.8 % (`framecmp`); copy check: every Figma text found except the "...clubs..." search placeholder (Figma's own inconsistency); 23 interaction checks, errscan, eslint and a production build pass; responsive audit passes for all new routes except the home's own 768 px "button labels wrap" finding. **Not built (decision 2026-10-28):** PN-05 / PN-06 / PN-07, the SMS and WhatsApp frames (messages the backend sends, not app screens; plan in the wiki page). PN-02 belongs to canvas 12 and was built by the spaces session on the same panel. Add-only edits to `ParentFrame`, `ParentTopBar`, `ui/StatusPill` (`ink` tone). Details and assumptions: [parent-notifications.md](parent-notifications.md).

## [2026-10-28] build | Parent who is also a talent: switch-space menu, build-career dialog, bell panel with both spaces (3 of 5 frames)

Figma canvas "Parent · 12 Parent who is also a talent" `10057:67476`: built PD-02 (`?menu=switch`), PD-04 (`?career=none&modal=career-profile`) and PN-02 (`?notif=open&spaces=both`) on any parent page; diffs 3.4 / 4.4 / 5.0 %; 6 Playwright tests pass, errscan clean. **Not built:** TC-01 / TC-02 (the talent home as Emma, needs a persona layer in the talent home). Add-only edits to `ParentSidebar`, `ParentFrame`, `NotificationsPanel`. Details: [parent-spaces.md](parent-spaces.md).

## [2026-10-28] build | Parent Settings and account: five tabs, log out, close account (9 frames)

Figma canvas "Parent · 11 Settings and account" `10057:67440` (Parents file, Focused only): new `/parent/settings` with Account, Your roles, Notifications, Security and sign-in, Data and account (`?tab=`), the log-out confirm and logged-out screen, and the close-account confirm (type CLOSE) and account-closed screen. Whole-frame diffs 0.8–3.7 %; 18 Playwright tests (`tests/e2e/parent-settings.spec.js`) pass; build passes. Add-only edits to `SettingsLayout` (optional `items` / `hrefFor` / `onLogout`) and `ParentFrame` (optional `dimSidebar`). Details, assumptions and consolidation candidates: [parent-settings.md](parent-settings.md).

## [2026-10-28] build | Parent Help and safety: the help article (PH-02)

Canvas "Parent · 10 Help and safety" `10057:67418` (4 frames). PH-01 / PH-03 / PH-03b were already built by the opt-out flow and match; new: `/parent/help/opting-out` (PH-02, `HelpArticle`, `articleData.js`) and the topic card link. Details: [parent-dashboard.md](parent-dashboard.md).

## [2026-10-28] test | Parent flows: Playwright specs, visual baselines, accessibility pass (and the fixes it found)

New `tests/e2e/parent-flows.spec.js` (20 tests) and `parent-a11y.spec.js` (19 tests); 20 parent routes added to `helpers/responsive.js` `ROUTES`, so the existing responsive gate (100 runs) and `desktop-visual` (40 baselines, git-ignored) cover them. All green on a production build served by `vite preview`: flows 20/20, a11y 19/19, responsive 100/100, baselines 40/40 on two compares. Accessibility: axe-core 4.14.0 (scratch install, no new dependency) + the accessibility tree + keyboard probes + hand-computed contrast; no real screen reader was run. Fixed: nameless profile button on phones (critical), top-bar names that did not start with their visible text, 10 px badge text on phones, focus dropping to `<body>` after Approve fix / Flag again / Opt out / Restore (`focusAfterRender`), every parent page titled "TalentHub" (`useDocumentTitle`), and the "Parent view" chip overlapping the Help icon from 1280 to about 1500 px (now hidden below 1536 px). Left open and written down: six colour-contrast failures that are Figma's own values (pale greys in the chrome, `#999` subtitles, white on the amber chip), the 4 s toast that carries "Undo" (WCAG 2.2.1). The SF Pro Rounded bundled for the parent screens was confirmed loaded on every page, dialog and toast; the Figma diffs barely moved (the ~2.5 % floor is the half-scale export), tables re-measured. Details, how to run, open list: [parent-testing-a11y.md](parent-testing-a11y.md).

## [2026-10-27] build | Parent To review: tabs, certificate / evaluation / assessment reviews, all caught up, collapsed rail (14 frames)

Figma canvas "Parent · 06 To review and approvals" `10057:66783` (Parents file, Focused only): `/parent/review` now has the five tabs (All, Certificates, Evaluations, Corrections, Payments) with counts, the certificate dialog (approve + undo toast, decline with a reason and note), the teacher evaluation page (approve + undo toast, "Don't show Elliot" confirm), the personality results page and its flag dialog (`?view=assessment`, URL-only entry), the all-caught-up card, and the collapsed sidebar rail (`?rail=collapsed`, works on every parent page). New folder `sections/parent/review/`; `ParentReviewPage` now renders it and no longer imports the Flags session's `flags/ReviewCorrections.jsx` (left in place, unused; its `?tab=corrections` frame re-measured 1.3 %). Shared files touched, add-only with unchanged defaults: `ParentFrame` (reads `?rail`), `ParentSidebar` (optional `onCollapse`), `ui/UnderlineTabs` (optional `showZero`), `ParentRailCollapsed` (new). Verified: eslint + prettier clean on the new/edited files, `npm run build` passes, `framecmp` Focused 1.3–3.7 % on all 14, dialogs compared by eye, a scripted browser run of the real flows (tabs, approve / undo, short and valid decline note, hide, flag a trait, caught up, rail toggle, Check into the re-review dialog) with no console errors, no horizontal scroll or text under 12 px at 320 / 390 / 834 for 13 states, the other parent pages re-rendered after the shared edits, and the Playful leak check on the 13 URLs. A real bug found and fixed on the way: two URL updates in one click (toast Undo then its close) overwrote each other; `update()` now reads the live address bar. Not verified: `test:visual` / `test:e2e`, the toolkit `errscan.mjs`, the all-routes leak sweep, screen reader. Tables, assumptions and consolidation list: [parent-review.md](parent-review.md).

## [2026-10-27] build | Parent Help and guides page (`/parent/help`) with the report dialogs: the rest of the Opt out and restore canvas

The two context frames of canvas `10057:1302`, PH-03 and PH-03b, are drawn over a full Help and guides page; it was first left out, now built: `/parent/help` (search that filters six topic cards, the "Talk to the GTH parent team" card with "Chat on WhatsApp" and "Report a concern") hosting the report dialogs (`?modal=report`, `?modal=report-sent&about=abena`). The report dialogs moved into one URL-driven `optout/ReportConcernLayer`, shared by the Help page and the ward page; "Opt Abena out" on the Help page goes to `/parent/wards/abena?modal=opt-out`. Files: `pages/parent/ParentHelpPage.jsx` (+ route line in `ParentApp.jsx`), `sections/parent/help/`, five new `help-spot-*.svg` exports. Verified: PH-03 4.7 % / PH-03b 3.4 % against Figma (was 5.0 / 3.8 over the ward page; the rest is the dialogs sitting lower than Figma's hand-placed ones, measured −66 px), 26 Help-page checks (search, report flow, opt-out hand-off, who/about cases, 390 / 768 / 1100 no overflow, no console errors), the 38 ward-flow checks rerun, earlier screens re-shot at 0.000 %, eslint + `npm run build` clean. Details: [parent-opt-out.md](parent-opt-out.md).

## [2026-10-27] build | Parent opt out and restore: paused ward page, opt-out / restore / report dialogs (6 frames)

Figma canvas "Parent · 05 Opt out and restore" `10057:1302` (Parents file, Focused only): on `/parent/wards/:id` — PO-01 `?modal=opt-out`, PO-02 `?state=opted-out` (the paused ward page), PO-03 `&modal=restore`, PO-04 `?toast=access-restored`, plus the PH-03 / PH-03b report dialogs. Own folder `sections/parent/optout/`; `ParentWardPage` swaps to the paused view and mounts the dialog layer, `WardShell` got `onOpenOptOut`; new shared `ui/ChoiceChips` (the flag dialog's severity chips moved onto it, pixel-identical). Verified: whole-frame diff 2.5–3.0 % on PO-01…04, 38 browser checks (real opt-out, restore, report flows, Elliot wording, Esc, 390 / 768 no overflow or text under 12 px, no console errors), 19 pre-existing URLs re-shot at 0.000 %, eslint + prettier + `npm run build` clean. Not verified: Playwright baselines, screen reader. Details and gaps: [parent-opt-out.md](parent-opt-out.md).

## [2026-10-27] build | Parent evaluate: section A · Start (3 frames)

Figma canvas "Parent · 07 Evaluate my child" `10057:66837`, section A: `/parent/evaluate` (choose ward and type), `?state=resume` (continue where you left off), `?state=none` (no ward to evaluate yet). Parent files only plus one route line. Details: [parent-dashboard.md](parent-dashboard.md).

## [2026-10-27] refactor | Parent dialogs use the design-system `TextInput` (via `ParentTextField`); error shelf fixed

The flag dialog note and the Unlink reason switched from a raw 51px input to `ui/form/TextInput` wrapped in `parent/ParentTextField` (green diamond helper icon, helper line grey even in error, value ink / error red 400, as PW-04c draws it). This fixes the grey error shelf (Figma: dark red #922b21) and gives the dialogs the design-system focus look and flat phone look. Compared with the Figma crops in rest, focused, error and phone; 41 browser checks pass, focus + Esc fine in all six dialogs, no console errors, eslint + `npm run build` + prettier clean. Cost: TextInput is 52 px tall vs Figma's 51, so these dialogs are 1 px taller (0.8–0.9 % whole-dialog diff). Not wrapped: `link/LinkField` (page form), `link/LinkCodeBoxes` (code boxes). Details: [parent-flags.md](parent-flags.md).

## [2026-10-27] refactor | Parent dialogs share one `ui/DialogCard`; flag dialog close icon fixed to Figma's grey

The modal card and its 36px close button moved from `link/LinkDialogShell` to the neutral `ui/DialogCard` (+ `DialogCloseButton`, tone `green` | `grey`); `LinkDialogShell` / `LinkDialogClose` are now thin wrappers, so no Link file changed. `UnlinkDialog`, `VisibilityDialog`, `FlagFieldDialog` and `RecheckDialog` use it. Verified on a dedicated dev server: Unlink, Who can find and Flag again 0.000 % different, Flag a field / note error / Re-review 0.001 % (one 8×8 px box); the six dialogs and the Link institution dialog keep focus inside and close on Esc; 41 browser checks pass, no console errors, eslint + `npm run build` clean, prettier clean on every file touched. Fix: the PW-04 and PW-06 close icons are grey #575755 in Figma (the first flag dialogs drew the green one). Not merged: the dialog text input (design-system `TextInput` differs on focus / error; needs a design call). Details: [parent-flags.md](parent-flags.md).

## [2026-10-27] build | Parent Link a ward: search, link code, request sent, 100+ children dialog (8 frames)

Figma canvas "Parent · 04 Link a ward" `10057:1093` (Parents file, Focused only): `/parent/link-ward` (PW-07 search + "1 match", PW-07c no match, PW-08 request sent, PW-07b/07e/07f link-code dialog entry / error / expired, PW-07d "Caring for 100 or more children?") and `/parent?modal=ward-linked` (PW-09). Own folder `sections/parent/link/`; add-only edits to `ParentApp.jsx` (one route) and `ParentHomePage.jsx` (renders the PW-09 dialog); `wards/` and `flags/` untouched. PW-08c (toast) and PW-08b (expired row) are the My wards page and are handed to that session (details in [parent-link-ward.md](parent-link-ward.md)). Verified: eslint + prettier clean on the new/edited files, `npm run build` passes, `framecmp` Focused 1.5–4.3 % on all 8, every dialog compared by eye, scripted browser run of the real UI flows (typing, code boxes, wrong / expired / good code, Esc, both institution buttons, PW-09 close + link) with no console errors, no horizontal scroll or text under 12 px at 320 / 390 / 834 for all 8 states, and a targeted Playful-leak check on the 8 URLs (no `data-ui-style`, no blank page, no page error). Not verified: the toolkit `errscan.mjs` and the all-routes `playful-leak-check.mjs` sweep (both too slow against the shared dev server, stopped), `npm run test:visual` baselines, `npm run test:e2e`, screen reader, paste into the code boxes. Consolidation candidates (dialog card, text field, code boxes, chips, ward row, close icons, callouts): [parent-link-ward.md](parent-link-ward.md).

## [2026-10-27] refactor | Parent flags merged into the one ward page; shared UnderlineTabs and TabRow "roomy"

The Profile and Flags tabs are now `?tab=profile|flags` on `ParentWardPage` (rendered by `flags/WardFlagsSection`); `FlagsWardFrame` and the separate flags page are deleted, the old `/profile` and `/flags` paths redirect. New `ui/UnderlineTabs` replaces three copied tab bars (`WardShell`, `ReviewCorrections`, the deleted frame); `wards/tabs/TabRow` got an add-only `size="roomy"` used by the Flags tab and To review; `WardShell` got an optional `reviewProfileTo`; `WARD_TABS` Profile/Flags are routed. Verified: 19 URLs screenshotted before and after, the 14 pre-existing screens 0.000 % different, my 5 screens differ only by the ward header's existing "Who can find Abena" link; 41 browser checks pass, eslint + prettier clean, `npm run build` passes. Not done (waits for the Link-a-ward session): shared dialog panel / close button / text input. Details: [parent-flags.md](parent-flags.md).

## [2026-10-27] build | Parent flags and corrections: Profile tab, Flags tab, To review (10 frames)

Figma canvas "Parent · 03 Flags and corrections" `10057:604` (Parents file, Focused only): `/parent/wards/:id/profile` (flag a field, PW-03/04/04b/04c), `/parent/wards/:id/flags` (tracker PW-05, re-review PW-06/06b/06c), `/parent/review` (To review · Corrections PR-08). Own files only (`sections/parent/flags/`, two pages, add-only routes in `ParentApp.jsx`); the Ward pages work is imported, not edited. Verified: eslint + prettier clean, `npm run build` passes, whole-frame diff 1.3–3.1 % on all 10, 38 browser checks (flag/undo/approve/flag-again flows, no console errors, no horizontal scroll at 390 / 768 / 1100). Not verified: Playwright baselines, screen reader, errscan (it crashed on dev-server reloads). Consolidation list and gaps: [parent-flags.md](parent-flags.md).

## [2026-10-27] build | Parent dashboard: My wards and ward page (13 frames)

Figma canvas "Parent · 02 My wards and ward page" `10057:560`: `/parent/wards`, `/parent/wards/:wardId` with Overview, Evaluations, Wallet, Activity and Crew tabs, the turning-18 notice, "Who can find" dialog, unlink dialog and the toasts. Built by three parallel builders inside `src/components/sections/parent/wards/` only; shared files untouched except `App.jsx`/`index.css` one-liners. Details: [parent-dashboard.md](parent-dashboard.md).

## [2026-10-26] build | Parent dashboard `/parent`: home and dashboard (7 states)

Figma file `SCXc457vwiq6o7d9g4jVbh`, canvas "Parent · 01 Home and dashboard". New `/parent/*` router (`pages/parent/ParentApp.jsx`, outside `MainLayout`) with the talent-style chrome copy-adapted for parents (`ParentFrame`, `ParentTopBar`, `ParentSidebar`, the Ask Buddy icon in Focused look) and one page with seven states by `?state=`: busy (PD-01), caught-up (PD-01d), offline (PD-07), first (PD-01b), none (PD-01c), loading (PD-05), error (PD-06). Mock data only. Details and assumptions: [parent-dashboard.md](parent-dashboard.md).

## [2026-10-27] fix | Career Buddy: Continue after Stop shows the finished reply; match cards in the Ask Buddy panel

Live 2026-10-26 18:28 (Ama, local stack): Stop on a readiness reply, then Continue, sent "Please continue from where you stopped." as the talent's words; the agent read it as "continue my profile" and started an education gather. Same family as the 2026-10-25 "Try again" fix. Stop no longer cancels the request: the agent finishes the turn either way, so the reply keeps arriving in the background (not shown) and Continue shows it, waiting for it if needed; if it failed, the same message and chip action go again. A new message drops a stopped reply. (Reading it back from `/career-buddy/history` was tried first: the history call took 40 s+ locally.)

Also: the Ask Buddy side panel (`CareerBuddyFirstChat`) now draws the opportunity match cards (they only rendered on the full screen), as a narrower `compact` card (320 px) under the bubble; `useCareerBuddyLive` exposes `renderOpportunities`.

Verified in the desktop app's browser on the local stack (Ama): panel shows the cards, readiness from the cards asks by posting, Stop then Continue shows the full readiness answer within a second, and Mongo has one run for that message and no "Please continue" run. eslint clean.

## [2026-10-25] build | Platform Admin: Reports, Live ops, Comms, Settings, Audit log, Support, A4 report kit

7.3 Reports (overview, health, export dialogs) + Live ops (dashboard, alert, role-restricted) + the 8-page A4 health report at `/admin/report` (print CSS, `?page=1-8`); 7.4 Comms (inbox, message user, bulk, templates, version history); 7.5 Staff / roles / platform settings / audit log (`/admin/settings/:tab?`, `/admin/audit-log`, Senior masked view); 7.7 Support queue + query detail + reply / escalate dialogs. 94 of 95 frames built (the 7.3.1d v1 cover is superseded). Full URL contract: [admin.md](admin.md). Mock behaviour only; entry points not drawn in Figma (Version history, Export dialog, Support dialogs) are reachable via `?modal=`. ⚠️ ASSUMPTION: Download PDF on the health report does not link to `/admin/report`.

## [2026-10-25] build | Platform Admin (Theme 7): foundation, staff sign-in, five role homes

Figma canvas `8520:12` (84 screens + extras, Focused only, frontend only). `/admin/*` router mounted in `App.jsx` (outside `MainLayout`); chrome (`AdminFrame`, top bar, 303 / 80 rail, persona card, handbook card) is the agency chrome with staff data and reuses the agency button / hero / quick-actions / dialog / code boxes; mock `useAdminSession` with `?role=`. Built and compared against Figma PNGs: 7.0.1a-d staff sign-in (form, 2-step code dialog, locked, expired; working mock flow: demo code → role home, five wrong codes → locked) and 7.0.2a-e the five role homes (one structure, content from `data/adminHomeData.js`). Other sections are stubs. New: `wiki/admin.md`.

## [2026-10-25] build | Institution portal (Theme 11): foundation

Figma canvas `8520:10` (Institutions & Agencies; 87 frames, 79 screens + 8 board-report pages). Chrome copy-adapted from the agency chrome (top bar, rail 303 / icon rail 80 / phone bar + drawer, persona card with the accreditation gate `?verify=`, nav Home · Students · Programmes · Messages · Records · Credentials | Progress, "Your institution page" card), shared hero / banner / button / Ask Buddy re-exported from the agency folder, `institutionState` / `institutionNav` / `institutionFormat` / `useInstitutionSession` + `data/institutionCoreData.js` (Savannah Hills SHS), `/institution/*` router with 14 stub pages + profile-menu stub, `tests/institution/frames.json` manifest. Details and URL contract: [institution.md](institution.md).

## [2026-10-25] integrate | Career Buddy: live opportunity match cards

The live agent chat now draws matched postings as the Opportunity Matching cards (Figma `9053:80615`, card `9222:118005`) instead of a numbered list. Data comes from the agent turn's new `opportunities` field (srt-backend: `opportunityMatch.matchOpportunities` now returns company, work mode, city, pay, key skills held / missing). `careerBuddyLive.js` maps it (`opportunityMatchView`, `closesLabel`, `payLabel`); the per-posting chips are dropped when cards show (`cardChips`); history reloads keep the cards. "Why this match?" sends an `opportunity_detail` chip action with `focus=why` (agent answers from the backend's own match reason and key skills); "View opportunity" opens `/job-postings?job=<id>` (live job detail). Cards without a logo show the company's initials. Verified in Chrome against the local stack: matches turn, Why this match?, View opportunity, reload. Not changed: the scripted demo frames (`?chat=opp-*`).

## [2026-10-25] update | Career Buddy: "Buddy brain" mascot in the reply-in-progress row

Figma `Bin8roWL8sloyc36IgFMuT` (canvas `3641:6671`) replaced the robot avatar + spinner ring + orbit sparkles with a "Buddy brain" mascot (components `9325:546246` Playful / `9325:546762` Focused, instance 56x47 of a 60x50 component). Found by diffing node trees against file version `2413530732846276985` (23 Oct 12:18): no other frame in the canvas changed; the loading frames (CH-08, skeleton rows) are unchanged. `ui/BuddyThinking.jsx` `BuddyThinkingAvatar` now draws glow + brain SVG (`assets/career-buddy/buddy-brain-{playful,focused}.svg`): glow while thinking / working / slow, none while writing / stopped, mascot at 70 % when stopped. Placement checked against Figma PNG exports (< 1 px). Not changed: the penguin `CareerBuddyAvatar` in chat messages / header / FAB (not redrawn). ❓ The J-02 frame sidebar says "Clubs" and the search placeholder "...clubs..."; the code still says "Community" — not renamed (only one frame shows it).

## [2026-10-24] build | Agency portal (Theme 11): foundation

Figma canvas `8605:395409`. Chrome (top bar, rail 303 / icon rail 80 / phone-tablet bar + drawer, persona card, "Your agency page" card, Ask Buddy), shared hero / banner / button, `/agency/*` router with 20 stub pages, URL state hook, mock session (`?mou=`, `?quota=`), formatters, Figma icon exports, frame manifest `tests/agency/frames.json` (114 entries, 2 superseded), responsive-audit URLs. Plan, URL contract, packages and checklist: [agency.md](agency.md). Verified: eslint + prettier clean; chrome checked at 1728 / 1024 / 834 / 390, collapsed rail and drawer, no horizontal scroll. Not built: any page body.

## [2026-10-23] build | Public data dashboards (Theme 8): foundation

Figma canvas `8477:209484`. Chrome (sidebar 288 / rail 80 / mobile drawer, top bar, footer), `/data/*` router with 13 stub pages, URL state hook, suppression + number helpers, region list, Figma icon exports, frame manifest `tests/public-data/frames.json` (107 entries), responsive-audit URLs. Plan, URL contract, work packages and checklist: [public-data.md](public-data.md). Verified: eslint clean; chrome renders at 1728 / 1024 / 390 and the drawer, no horizontal scroll. Not built: any page body.

## [2026-10-23] build | Career Buddy re-check + panel states, voice live captions, opportunity matching, create-a-community, My circle

Career Buddy chat re-checked against the current Figma (36 frames): the Ask Buddy pop-up now shows the thinking / working / writing / slow / stopped rows + Stop generating; nav label "Change input mode"; demo URLs reproduce the Stop pill, actions menu and new-chat tooltip; voice live captions (VC-01..06 × 2 styles + settings row); Career Buddy Opportunity Matching (`?chat=opp-areas|opp-matches|opp-why`, J-02 IPMC page, Focused only). New talent screens: [talent-community-create.md](talent-community-create.md) (19 frames × 2) and [talent-my-circle.md](talent-my-circle.md) (12 frames × 2). Details and gaps: [career-buddy-chat-history.md](career-buddy-chat-history.md). Verified: build, eslint src; framecmp by the section agents (Playful 3–9 %, Focused 1.5–7 %), voice re-run by the lead 3.5–5.1 %; responsive audit + leak check see the build report. Not verified: real mic / speech engine for voice captions, errscan of every new URL, Focused phone widths on the later create-wizard steps, a clean re-run of the My circle NW-01..03/10/11 diffs.

## [2026-10-23] build | Parent emails PE-01..PE-07 (static HTML, Focused only)

From Figma canvas `3:3` of the comms file. 7 files in `emails/parent/focused/`; identical images across all emails were deduplicated into `emails/assets/shared/` (82 image files in total). Details and per-frame diff table: [parent-emails.md](parent-emails.md). Verified: same-size pixel diff 4.6–8.0%, every pair viewed, copy check 0 missing, 390px no horizontal scroll, talent email renders pixel-identical after the dedupe. Not verified: real email clients, dark mode; links are `#`.

## [2026-10-22] build | Talent emails TE-02..TE-12 (static HTML, both styles)

From Figma comms file `GwL8cVTsz2wI4H3jnqL8IH`, canvas `3:2`. 22 new files in `emails/talent/{playful,focused}/` (TE-01 came from an earlier session and is unchanged), ~200 PNG exports in `emails/assets/`. Details, per-frame diff table and known gaps: [talent-emails.md](talent-emails.md). Verified: same-size pixel diff vs Figma 0.5x exports (3.8–8.4%), every pair viewed, copy check 0 missing in TE-02..TE-12, 390px no horizontal scroll except TE-01. Not verified: real email clients, dark mode; links are `#`; mobile layout is our own.

## [2026-10-22] build | New landing pages (LP-01 v2, P-01..P-06, Coming Soon)

From canvas `7797:4614`, desktop + tablet 834 + mobile 430. Details, URL table and known gaps: [landing-site.md](landing-site.md). Verified: eslint, build, overflow/page-error sweep on 10 routes × 6 widths. Not verified: pixel diff; icons are hand-redrawn; PageHero heights differ from Figma.

## [2026-10-21] fix | Engagement layout: journey rail, personality intro + path chooser, certs stage label

Measured against Figma REST data (text tops, 1728 frames). Journey rail cards now within 1px (Career Buddy card was 16px short, Continue button 3px tall). PE-01 hero was up to 58px low; now within about 5px (leftover differences are font-metric / chip-padding artefacts). PA-00: heading block fixed to 148px; the first path card's chip row sits about 20px low (description wraps to an extra line with the fallback font, not verified with SF Pro Round). Stage bar for Certs reads "Certifications". Not re-measured: Focused, IN-04, other personality frames.

## [2026-10-21] build | Engagement revamp: Personality Arcade, CV upload, clamp fixes

Arcade hub + details + archetype modals, arcade-aware `usePersonalityRun`, `:gameId` route to `GamePage`; CV upload page; bulk hero/dialog clamp fixes. Status, URLs and open diffs: [talent-engagement-revamp.md](talent-engagement-revamp.md). Verified: eslint, build, Playful screenshots by eye. Not verified: Focused, pixel diff, skills labs mounting.

## [2026-10-21] build | Career Buddy chat: left history button, thinking states, new history drawer, new chat, Buddy settings

From the 21 Oct Figma update (canvas `3641:6671`). Details, URLs (`?chat=`) and what is not backed by the agent: [career-buddy-chat-history.md](career-buddy-chat-history.md). New: `BuddyThinking`, `CareerBuddyChatParts`, `chatHistoryModel`, `buddyDemoFrames`, `buddySettings`, `Buddy*Icon` set in `assets.jsx`, two spot SVGs in `src/assets/career-buddy/`. Changed: `ChatThread`, `CareerBuddyHistoryDrawer` (rewritten), `CareerBuddySection`, `useCareerBuddyLive`, `careerBuddy.api.js` (abort signal), `index.css` (animations). Verified: eslint/build clean, screenshots compared by eye; not pixel-diffed.

## [2026-10-21] plan | Engagement revamp (manual profile filling): inventoried, blocked on Figma access

Canvas `3125:10352` ("Engagement 1 - gamified"): 12 refreshed sections, 155 screens x Playful + Focused. Only the depth-2 inventory could be fetched (both REST tokens and the Figma MCP are rate-limited for about 4-5 days). Wrote [talent-engagement-revamp.md](talent-engagement-revamp.md) and `tests/engagement/frames.json` (ids, pairing, proposed URLs, resume plan). No screen built. Needs: a Dev/Full-seat token or exported PNGs.

## [2026-10-21] build | Talent Wallet `/wallet` — all five phases (33 screens, W-01 … W-27b)

Built every screen of Figma canvas `8817:693` (33 screens × Playful + Focused × expanded + collapsed sidebar = 132 frames): Home, Transactions, Top up, Withdraw, receipt drawer (phase 1), set-up and KYC (2),
Cycles, savings, redeem, under-18 (3), tuition financing (4), credit score and payouts (5). Phases 4, 5 and under-18 were first built from the node tree while the Dev Mode MCP quota was out; the
REST API then worked again and **every screen in both styles was re-verified against the REST node data** (positions, sizes, colours, copy, per-style spacing, prototype flows) and corrected
([talent-wallet.md](talent-wallet.md)); the four spot illustrations are placed and no assumption remains.
State hook `talentWalletState.js` (every frame is a URL), `WalletFrame`, mock data `walletData.js`. Shell wiring add-only: `activeNav="wallet"` in sidebar / mobile
nav / shell, `WALLET_PAGE` rail data with the opt-in `navGap` flag (card→nav gap 24, divider gap 6 — measured off Figma), `chrome.railHome` makes
`rail=collapsed` use the newer icon rail (with the Wallet tile) like Home. Wallet icons `Wallet*Icon` appended to `assets.jsx`; spot illustrations in
`src/assets/talent-wallet/`. Verified: framecmp 1.2–5.8 % on 106 of the frames, errscan clean on every URL, responsive audit 185/185, leak check clean, build + eslint + prettier clean.
Figma was read through the Dev Mode MCP first, then verified through the REST API.

## [2026-10-20] feat | Talent Messages `/messages` (foundation + four packages; Figma REST blocked)

Built `/messages` (Figma canvas 7387:104275, 49 Playful/Focused pairs + A-01c + HP): state hook `messagesState.js` (every frame is a URL, see top of the file and [talent-messages.md](talent-messages.md)), `MessagesFrame` (talent shell, Messages active, Wallet, badges 142/142/4, `?rail=collapsed`), inbox/conversation/composer (A), job + interview cards and the pre-apply dialog (B), Help me reply (C), accessibility / language "Coming soon" / Messages help copy (D). Shell wiring add-only: `talentShellData.js` (`MESSAGES_PAGE`, Messages nav route), `TalentSidebar`, `TalentMobileNav`, `TalentDashboardShell`, `DashboardTopNav` (messages icon -> `/messages`, EN pill -> `?lang=menu` on Messages), `HelpPopover` (`helpPage: messages`). T-MSG-05 is NOT a dialog: the inline job card in its Passing state. Figma REST was rate-limited (429, ~9 h, plan tier pro / limit low) for most of the build; the MCP was used for the Passed card, icons and gaps. **Nothing is marked verified**: see the "Recovery list" in talent-messages.md for everything that still needs REST (diff %, pdiff, errscan, phone checks). Follow-up 2026-10-21: responsive audit 150/150, leak check clean, build + lint pass; measured 41 rows against the 0.5x exports (37 pairs at 2–7 %); fixed the language modal (art-band height, tilts, doodle positions), the read-aloud bar room, the reaction/chip overlap, T-MSG-05 (thread ends after the recruiter's last bubble, no typing), A-02…A-04 URLs (panel closed), and the headless read-aloud reset. Nothing committed.

## [2026-10-20] fix | Figma token moved out of `.mcp.json`

`.mcp.json` no longer holds the Figma token: the `figma-console` server now reads `"FIGMA_ACCESS_TOKEN": "${FIGMA_ACCESS_TOKEN}"` from a user-level environment variable (each dev sets it once on their machine). The old token is still in git history (pushed) — **revoke it in Figma and set the new value in the env var**. Scripts (`tests/playful/lib/figma.mjs` `getToken`) read `FIGMA_TOKEN`, then `FIGMA_ACCESS_TOKEN` (the `.mcp.json` server's variable).

## [2026-10-21] feat | Messages wired to the API

`/messages` shows the signed-in talent's real recruiter conversations (`services/messages.api.js`, `useLiveMessages.js`, `messagesLive.js`; backend `talentMessages.service.js`, gateway `/api/talent-messages`). Inbox, requests (accept / decline / spam), sending with retry, read receipts, mute / archive / delete / report / block, and the linked job card (pass, apply → real application) all go through the API; drawn frames stay on `demo=1`, signed out, `state=` or drawn `c=` keys. `/messages/:conversationId` (notification links) opens that conversation. Details: [talent-messages.md](talent-messages.md#live-inbox-2026-10-21).

## [2026-10-21] fix | Career Buddy interview review after reopening a chat

Reopened Career Buddy conversations lost the practice / mock interview review card and showed the agent's plain text report instead, including raw placeholders like "[experience]". Cause: the agent's history endpoint dropped `practiceReview` (backend `apps/agent/src/server/career-buddy-routes.ts` TURN_FIELDS, fixed there). Here: `careerBuddyLive.js turnToBubbles` keeps only the verdict line when a turn carries the review card (the card holds the scores and feedback), and `PracticeReviewCard` shows "[experience]"-style placeholders as highlighted "your experience" blanks with a "Fill the highlighted parts with your own details" note.

## [2026-10-24] build | Public data dashboards (Theme 8): all packages integrated

Seven work packages built and wired (see [public-data.md](public-data.md)). Verified: build, eslint, errscan 76 URLs clean, responsive audit 130/130. Lead framecmp diffs are higher than the agents' own numbers (landing ~14 %); pairs viewed, differences mostly font and hero crop. Not verified: full-text checks per frame, phone/tablet pixel parity. Nothing committed.

## [2026-10-23] perf | Career Buddy voice: speak as the reply streams; the mic stays open

- `speechQueue.js` (new): in a voice call or with read-aloud on, each sentence is spoken as soon as it has streamed in (`delta` events), instead of the whole reply after the turn finished as one long utterance (slow to start; Chrome stalls on long utterances). The final reply is authoritative: only the part not spoken yet is queued.
- `useVoiceCapture`: the mic (stream + level meter) stays open for the whole call; only speech recognition stops while Career Buddy thinks or speaks. It used to tear down and re-open the mic (getUserMedia + AudioContext + recogniser) around every reply. The recogniser now restarts itself when Chrome ends it (silence / network), which used to leave the call deaf.
- `useUtteranceSender`: when the recogniser has finalised the words, the turn is sent after 0.6 s instead of 1.5 s (interviews keep their longer pause).
- There is no WebSocket in the Career Buddy path: replies stream over Server-Sent Events (`/career-buddy/turn-stream`). Backend side of the same work: srt-backend `perf/cb-reasoning-temperature`.

## [2026-10-25] build | Agency portal (Theme 11): all packages integrated

Canvas `8605:395409` (Government bodies / agencies), 112 screens under `/agency/*` (agency chrome with a mock signed-in session). Details, URL keys, verification and gaps: [agency.md](agency.md). Verified: build, eslint, errscan 108 URLs clean, framecmp over all frames (mostly 1-5 %), responsive audit partly fixed. Not verified: print/PDF, tablet beyond drawn frames, per-frame text check by the lead. Nothing committed.

## [2026-10-28] build | Parent Ward wallets (canvas 08)

`/parent/wallets` (PWa-01) with approve / decline / limits / top-up / open-wallet dialogs and five toasts over `walletsStore`, shared with the ward page Wallet tab (PW-12). 15 frames diffed 2.1-3.8 %, behaviour 61/61, e2e 57/57, axe clean apart from the shell contrast. Frame to URL table, assumptions, Figma inconsistencies: [parent-wallets.md](parent-wallets.md).

## [2026-11-04] update | recruiter talent-search + job-templates V2.0

Sans titles (RecruiterPageHeading titleStyle="sans-accent"), exported icons + candidate avatars (src/assets/recruiter/talent-search), per-card template tiles, URL state: talent-search ?tab= ?q= ?filters=open; job-templates ?category=. Playfair Display not loaded (banner heading falls back to Georgia).

## [2026-11-04] update | recruiterHome V2.0 (setup view)

New-user hero/gradient restyled (Forest Green #1f4a2b -> #3f7f4c, Bricolage title, shared tertiary Button for Customize, 176px hero). Added existing-user layout (?user=existing): RecruiterHiringOverview, RecruiterApplicantsTable (+ row-action menus via ?actionsMenu=<applicantId>&hoveredAction=<actionId>), recruiterHomeState.js, recruiterHomeApplicantIcons.jsx. Reached at /recruiter/home?view=setup (the dashboard agent owns the bare route). Diff vs Figma: new 2.7

## [2026-11-04] update | jobPostings + jobScreening V2.0

Job Postings/Screening rebuilt to Job prospecting V2.0: Bricolage titles (titleStyle sans-accent), Figma-exported icons (jobPostingsIcons/jobScreeningIcons), corner "..." pill, centred card menu, new Close dialog (scrim #1c2a21@70, 528x304, buttons right). URL state: /recruiter/job-postings ?status= ?menu= ?menuItem= ?modal=close-posting&posting=; /recruiter/job-screening ?dropdown=experience&dropdownItem=. RecruiterListToolbar gained additive `actionIcon` prop. Criteria switches are real toggles (Education off).

## [2026-11-04] build | Recruiter Application Pipeline V2.0: 9 frames reachable by URL

Frames 7249:79017/79474/79940/80546/81163/82719/83356/81797/82258 on `/recruiter/application-pipeline`. Keys `modal` (schedule-interview | cancel-interview | schedule-confirmation), `state` (empty|filled), `format`, `interviewers=open`, `dropdown=job-posting`, `forceHover`, `posting`, `sidebar=collapsed` (see pipelineUrlState.js). Schedule modal restyled to V2.0 (Bricolage titles, 3D time slots in a 4-col grid, Summary Action Bar, open interviewer row, avatars), confirmations now sit over the page; icons are Figma exports (scheduleInterviewIcons.jsx, pipelineBoardIcons.jsx); live wiring (useLivePipeline/pipelineLive) untouched.

## [2026-11-04] build | Recruiter dashboard (Figma OHG2xsfCCskT8xEn356njv, canvas "Recruiter - Dashboard" 10005:38660): 51 distinct frames at `/recruiter/home`

One page, every state a URL param (org switcher / single / pending / none / revoked, jobs row menu + pause + close + empty / suspended / error, talents filter + invite + hint + empty + loading, funnel filter + 7d + drill-in + empty + loading, verification verified / rejected / owner + upload, heat-map region / industry / national / sparse / none, feedback tab + form + validation + withdrew, notifications / language / accessibility pop-ups). New `ui/` primitives Chip, WidgetCard, FilterSelect, Callout, BannerToast, InlineState, SkeletonBlock; add-only props on Textarea, DashboardShell, DashboardTopNav. Old home kept at `?view=setup`. Not built: only the "5+" bell badge of D12. Frame table with diff %: [recruiter-dashboard.md](recruiter-dashboard.md). `tests/e2e/recruiter-dashboard.spec.js` (15). Found and fixed on the way: a URL helper that wrote over a stale copy of the params (org switch lost its `org`), and two org-switcher copies both reacting to outside clicks.

## [2026-11-05] update | Recruiter onboarding R00–R09 reachable by URL (Figma `7356:96249`, 41 frames)

`?state=` seeds on every step (`utils/frameSeed.js`), mock organisation directory for seeded pages, Figma scrim on the organisation / create modals, SF Pro Rounded scoped to the recruiter screens and dashboard. Table with diff %: [onboarding-redesign.md](onboarding-redesign.md). `tests/e2e/recruiter-onboarding-frames.spec.js` (7).

## [2026-11-06] build | Recruiter candidate profile `/recruiter/talent-search/:candidateId` (Figma "Recruiter - Talent Search" TS-11 … TS-19)

Profile, invite dialog, invite sent, save popover, saved, overflow menu, add-to-pipeline dialog, added, applicant profile; every state a URL key (see header of `TalentCandidateProfileSection.jsx`). Whole-frame diff 1.8–3.3% for page states, 7.2–7.8% for dialog frames (Figma centres them in a 1117px viewport). New `ui/IconTileDialog`; add-only `Modal initialFocus`, `Textarea counterInside`. `candidate-photo-*.webp` added (Figma uses one photo for both people).

## [2026-11-06] build | Recruiter screening flow `/recruiter/job-screening` (Figma "Recruiter - Job Postings" JS-01 … JS-14)

All 14 states are URL keys (header of `JobScreeningSection.jsx`, `wiki/recruiter-job-screening-flow.md`); whole-frame diff 2.3–5.1 %. Pipeline hand-off toast added to `ApplicationPipelineSection.jsx` (`?handoff=N`). e2e `recruiter-job-screening-flow.spec.js` 11/11 (JS-08 and the two toast checks re-run singly after slow-server timeouts).
