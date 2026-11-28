# Backend integration gaps

> What the app shows or does **without the backend**, page by page. Use it to plan API work and to know what not to trust when testing.
> Started 2026-11-13 from a sweep of every route, plus spot checks. **Keep it current.** When you wire something, tick it and add the
> service function. When you find a new gap, add it under its page.

**How to read it**

- **Mock data**: the section renders hard-coded sample data, usually a `*Data.js` file next to the section.
- **Inert**: the control only logs (`log('… (inert)')`) or only changes local state where a real save is expected.
- **Not saved**: the UI collects the value but no request sends it.
- **"Live when signed in"**: most portals show the Figma mock in design frames (`?state=`, `?f=`, `?modal=`, `?demo=1`) or when nobody is signed in, and live data otherwise. Those demo frames are deliberate and are **not** listed as gaps. This page lists only what has no backend path at all.
- **Confidence**:
  - ✅ VERIFIED: re-read in the code.
  - 🔶 LIKELY: from the code sweep (file:line given), not re-read one by one.
  - `(inferred)`: the sweep itself was unsure.
- [`api.md`](api.md)'s "Not wired" list is 🪦 STALE: most of those areas are wired now. Trust this page and the code.

## Biggest gaps

| #   | Area                                                                      | Gap                                                                                                                                                                                          | Confidence                  |
| --- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1   | Talent Wallet `/wallet`                                                   | No wallet service at all; every screen and about 40 actions are local                                                                                                                        | ✅ VERIFIED                 |
| 2   | Recruiter portal                                                          | Dashboard, talent search, candidate profile, job templates, job postings CRUD, screening, messages, settings, help and community are all mock. Settings **Log out does not end the session** | 🔶 LIKELY (logout ✅)       |
| 3   | Parent sign-up without an invite (`/onboarding/parent-welcome` … `/done`) | Every step is simulated with a timer; the contact OTP is hard-coded to `123456`                                                                                                              | 🔶 LIKELY (OTP ✅)          |
| 4   | Parent portal                                                             | Evaluate, wallets, notifications, settings saves and help                                                                                                                                    | 🔶 LIKELY                   |
| 5   | Public data `/data`                                                       | Opportunities directory, partners, showcase, report, digest subscription, PDF export                                                                                                         | 🔶 LIKELY                   |
| 6   | Landing site                                                              | No data API anywhere: opportunities, stories, partners and the coming-soon waitlist are all sample data or local                                                                             | ✅ VERIFIED (opportunities) |
| 7   | Platform admin                                                            | Content Editor role is mocked; media uploads are simulated; the report kit shows Figma figures; comms test/schedule                                                                          | 🔶 LIKELY                   |
| 8   | Recruiter payment                                                         | Simulated by the backend: no Paystack; a card ending `0002` is declined (`recruiterOnboarding/billing/paymentApi.js`)                                                                        | ✅ VERIFIED                 |

---

## 1. Landing site

Pages: `src/pages/landing/*.jsx`.

**Live:**

- Published site copy only: `copy/copyBundle.js` calls GET `/copy/bundle`, applied by `useCopySection`.

### `/opportunities` ✅ VERIFIED (2026-11-13)

Needs a **public (no login) jobs endpoint**, which does not exist yet. It should take `q`, `loc`, `type`, `level`, `style`, `region`, `pay`, `sort` and paging, and return results with real ids, a total, and counts per type.

- [ ] **Listing:** the 8 sample roles in `landing/opportunities/OpportunitiesData.js` (`JOBS`). The search, filters, sort, counts and Load more all work in the browser over these 8, in `opportunitiesFilter.js`. Swap that file's results for the API's.
- [ ] **Hero chip** "1,580+ live roles" is fixed text (`HERO.chip`).
- [ ] **Filter facets** (`level`, `style`, `regions`, `payMin` / `payMax`) are read off each card: ⚠️ ASSUMPTION.
- [ ] **"Best fit"** is the drawn order. A visitor has no fit score; the real score needs the API, and only applies once signed in.
- [ ] **"Newest" sort** is missing: the roles carry no real posted date (all say "Posted 2d ago").
- [ ] **Card and heart:** they route to `/job-postings?job=` / `?save=`, through login when signed out. The sample ids don't exist in the backend, so the role can't be found (the page falls back to the list) and the save is dropped. They become real once the cards carry backend job ids.
- [ ] **Fit strip** "Sign up to see your fit score" is static.

### Other landing pages 🔶 LIKELY

- [ ] **Home opportunity cards:** `landing/home/OpportunitiesData.js`. "Browse all opportunities" is inert (`OpportunitiesSection.jsx:197`).
- [ ] **Stories:** home and `/stories`, from `landing/home/StoriesData.js` and `landing/stories/StoriesData.js`. "Share my story" is inert (`ShareYourStory.jsx:40`).
- [ ] **Partner strip:** `PartnerStripData.js`.
- [ ] **FAQ page:** `landing/faq/FaqData.js`. FAQ search is inert (`faq/FaqSearch.jsx:18-20`).
- [ ] **For parents & schools:** `ParentsSchoolsData.js`.
  - "Approve" / "Review first" on the phone mock are inert (`ParentsSection.jsx:55,65`).
  - ✅ 2026-11-13: "Invite my parent" → talent sign-up or Settings › Guardian (`landing/shared/inviteParentPath.js`). The Guardian form's send is still not wired (see Talent › Settings).
  - ✅ 2026-11-13: "Bring GTH to my school" → `/institution/sign-up` (live), or `/institution` for signed-in staff (`landing/shared/schoolSignUpPath.js`).
- [ ] **Features, How it works:** `FeaturesData.js`, `howItWorks/HowItWorksData.js`. Static marketing copy; likely fine as it is.
- [ ] **Coming soon:** `ComingSoonData.js`.
  - The **waitlist email form only sets `?state=joined`**; no request is sent (`pages/landing/ComingSoonPage.jsx:63`).
  - Copy link and share chips are inert (`ComingSoonCenter.jsx:150,160`).
- [ ] **Language switch** (EN · GH) is inert (`LandingNav.jsx:55`).

- [ ] **`/coming-soon` joined state:** the referral link is the Figma sample `gth.com/join/kofi-k7` and the queue number "1,243" is fixed (`ComingSoonData.js:34`, `ComingSoonCenter.jsx`). 🔶 LIKELY (inspection 2026-11-22)

## 2. Auth and onboarding

**Live:**

- Login, forgot and reset password.
- Talent onboarding: `onboarding.api`, `location.api`.
- Parent **invited** flow: `parentInvite.api`.
- Recruiter onboarding: `recruiterOnboarding.api`.
- Institution onboarding: `institution.api`, `institutionBulk.js`.
- Agency sign-up, set password and MoU.
- School links, guardian consent and complete invite: `institutionPortal.api`.

**Gaps:**

- [x] **Parent flow A (no invite)** is live since 2026-11-28 (`parentSignup.api.js`): contact code (`/auth/contact-verification/send|verify`), account (`/auth/register`, `entityType: 'parent'`), then the parent login (two-step). ✅ VERIFIED in a full staging run (`tests/e2e/parent-signup.spec.js`). Still simulated:
  - **Verification upload:** the Ghana Card and photo are not sent; no pre-account upload endpoint. The review says "Not uploaded yet". (`ParentVerificationSection.jsx`)
  - **Link ward (A):** shows the sample ward "Abena"; `/parent/link-ward`, `/parent/search-ward` and `/parent/wards/search` are all 404 (a lookup of wards whose registration named this parent, before the account exists). (`ParentLinkWardSection.jsx`)
  - **Done (A):** shows a sample ward with "WARD_AUTO_LINKED".
  - **Relationship is not saved:** `/auth/register` rejects `userData.relationship`.
  - **Phone is not verified:** the code goes by email only, as in the talent flow.
  - **Two codes:** `/auth/register` returns no session and ignores the contact `verificationToken`, so a new parent gets a second emailed code at first login. Needs a register option that returns a session or accepts the verification token.
  - **"Keep me logged in"** is not sent (no API option, same as `/login`).
  - **Consent "Read full document"** (three dialogs on Review): no policy page to open.
  - The flow B invited path needs ward tokens (`make_wards.js`, `C:/Backups/parent_wards.json`) to be tested end to end; 3 tests skip without them. ❓ NEEDS-CLARIFICATION
- [ ] **Talent sign-up and login (`/get-started`, `/login`, `/onboarding/talent/*`)** (checked 2026-11-17). The flow itself is live: `onboarding.api` start / capture / upload-photo / verify-contact / resend / activate / schools / status, and `location.api` regions, districts and towns. Still missing or front-end only:
  - **Local setup:** `/start` needs `VITE_TENANT_ORG_ID`. Without a `.env` it sends a blank id and staging answers "Organization not found" (copy `.env.example` to `.env`). ✅ VERIFIED.
  - **Education level / grade options** are hard-coded (`OnboardingEducationPage.jsx` `LEVEL_OPTIONS`, `GRADES_BY_LEVEL`). They are meant to come from the `education_grade` platform enums once those are seeded. The age limits on levels and grades are also front-end only (`MIN_AGE_BY_LEVEL`, `MIN_AGE_BY_GRADE`). Primary has no grades on purpose: GTH starts at JHS, and picking it opens the "level not eligible" pop-up. 🔶 LIKELY
  - **Institution search is live:** `GET /v1/onboarding/schools?q&level` returns registered GTH institutions plus the backend's school directory, and suggestions show after 2 letters. ✅ VERIFIED on staging: universities (KNUST, University of Ghana…) and SHS (Achimota, Prempeh, Wesley Girls') are found. **Gaps:** the directory has **no JHS schools**, so a JHS search returns nothing and pupils must type their school in. The endpoint rejects searches under 2 characters (`q` length ≥ 2), so suggestions start at the second letter; lowering this to 1 is a backend change.
  - **Degree years:** University now offers Years 1-6 (5- and 6-year degrees such as architecture, engineering, medicine, pharmacy, dentistry). `educationGrade` is sent as `year-5` / `year-6`; whether the backend's grade validation accepts these isn't confirmed (it needs a session that has completed every earlier step). ❓ NEEDS-CLARIFICATION
  - **Nationality list** is hard-coded (`OnboardingPersonalInfoPage.jsx` `NATIONALITY_OPTIONS`); no lookup endpoint. 🔶 LIKELY
  - **Contact codes:** staging accepts `123456` while the backend's test bypass is on, and SMS delivery isn't live (the code goes by email). The SMS / Email badges in the code pop-up are visual only. 🔶 LIKELY
  - **Parent / guardian:** Figma says one contact method (phone OR email) is enough, but the backend rejects the parent step without an email, so the page requires it. Needs a backend decision: accept phone only once SMS works. ✅ VERIFIED (page rule)
  - **"Keep me logged in"** on login is local state only; it isn't sent to the auth API and doesn't change token lifetime (`LoginPage.jsx`). 🔶 LIKELY
  - **Onboarding tutorial video** is a "coming soon" placeholder; no video source (`LoginTutorialModal.jsx`).
  - **Welcome toast** says "Welcome to GTH, Student!" for everyone: the role picked on `/get-started` isn't read back (`OnboardingWelcomePage.jsx`).
  - **Done page:** name, score, XP and rank are demo constants in demo mode; "Invite a friend" is inert; "Copy link" copies the site address, not a profile link (`OnboardingDonePage.jsx`).
  - **Photo size limit** (5MB) is checked in the browser only; confirm the backend's upload limit matches.
  - **Role choice isn't saved:** `/get-started` waits 700ms and navigates; nothing is sent ("replace with the real /role POST when the endpoint lands", `GetStartedPage.jsx` `handleContinue`). ✅ VERIFIED (2026-11-21)
  - **Curriculum isn't collected:** the Education recorded pop-up in Figma lists a Curriculum row, but the education step has no curriculum field and none is sent. Needs a product decision plus a field in `captureStep`. ✅ VERIFIED (2026-11-21)
  - **Review page data the app doesn't hold:** the Talent Score strip isn't rendered (no score before activation), and the Ghana Card "Verified" badge, "Phone & WhatsApp" and the nationality flag aren't shown, because the session summary doesn't return them. 🔶 LIKELY (from `onboarding-redesign.md` › Still open)
  - **Done page contact row** always says "Phone and email verified" (`OnboardingDonePage.jsx` `liveSteps`), but codes go by email only until SMS is live, so the phone isn't really verified. Should come from the backend's verified channels. ✅ VERIFIED (2026-11-21)
  - **Under-18 flow:** the parent step is live (`captureStep` with name, relationship, email, phone). The Done page shows "Notified by email" only when the backend returns `guardianNotified`. Whether staging actually sends that email hasn't been checked. ❓ NEEDS-CLARIFICATION
- [ ] **Recruiter payment:** simulated by the backend (no Paystack) ✅. Organisation search uses mock results on frame URLs only (`organisationData.js:77`).
- [ ] **"Watch tutorial":** inert on institution (`InstitutionRightPanel.jsx:366`). Talent sign-up and login now open the onboarding tutorial (2026-11-15).
- Stale "mock data" comments in code that is now live:
  - `OnboardingReviewPage.jsx:67`
  - institution `ValidateSection.jsx:53`, `ConfirmSection.jsx:53`, `ReportSection.jsx:61`, `ContactVerificationModal.jsx:44`

## 3. Talent app

### `/home`

Live: `talentHome.api`, `quests.api`, `streak.api`, `xp.api`, `settings.api` (recruiter activity) and global search.

- [ ] **Evaluations and badges** have no backend (`useLiveMoreForYou.js:23`). The sidebar shows "–" when there is no data (`talentShellData.js:335`).
- [ ] **Home layout editing** is local, "mock; swap for an API" (`TabsHomeLayoutStore.js`).
- [ ] **A11y preferences** are stored in localStorage only (`useA11yPrefs.js`).
- [ ] **"People to link up with" card** is demo only; the live home hides it and never calls the circle API (`HomeColumns.jsx` `CrewCard`). ✅ VERIFIED (2026-11-21 inspection)
- [ ] **Sidebar Clubs badge** ("3") is a demo constant; there is no live circle-invitations count (`talentShellData.js` `withClubsBadge`). ✅ VERIFIED (2026-11-21 inspection)
- [ ] **Bell pop-up signed out** always calls GET /notifications and shows "We couldn't load your notifications" on demo URLs; the drawn mock in `notificationsData.js` is unused (`useNotificationFeed.js`). ✅ VERIFIED (2026-11-21 inspection)

### `/notifications`

Live: `fetchNotifications`, mark read, mark all read.

- [ ] **Inert actions:**
  - Interview "Add to calendar" and "Prep" (`NotificationsScreen.jsx:515,518`)
  - ~~Pop-over Settings~~: fixed (2026-11-21 inspection), opens `/settings/notifications`
  - Help WhatsApp (`HelpPopover.jsx:261`)
- [ ] **Ping settings** ("Instant", "Daily digest"…) are hard-coded (`notificationsData.js` `PING_SETTINGS`); `GET /notifications/preferences` exists in `notifications.api.js` but is unused. ✅ VERIFIED (2026-11-21 inspection)
- [ ] **Recap and Coming up cards** are static copy. ✅ VERIFIED (2026-11-21 inspection)

### `/job-postings`, `/opportunity-guidance/job`

Live: `talentJobs.api` (feed, detail, apply, save / unsave, withdraw) and `interviews.api`.

- [ ] **Inert:** Share, "Boost: have it / learn it" (`JobDetailScreen.jsx:288,558,561`). "Prep with buddy" now opens Career Buddy (2026-11-21 inspection).
- [ ] **Saved roles have no saved date:** the live feed sends no `savedAt`, so the Saved tab's "Most recent" sort reads the creation time inside the bookmark id (`talentJobsLive.js` `savedAtOf`). The backend should return `savedAt`. 🔶 LIKELY (2026-11-22)
- [ ] **Browse demo rows** have no `industry`, so the Industry filter only appears with live data (`talentJobsData.js` `BROWSE_ROWS`). ✅ VERIFIED (2026-11-21 inspection)
- [ ] **`/opportunity-guidance/job` is fully mock** (`opportunityGuidanceData.js`); it never uses the live feed (`OpportunityJobPage.jsx:38`).

### `/messages`

Live: `messages.api`, `interviews.api`.

- [ ] **"Help me reply"** AI drafts are mock (`talentMessages/helpReplyData.js`). Tone, "shorter" and "more formal" are inert (`HelpReplyPanel.jsx:247,319,326`).
- [ ] **Smaller items:**
  - Language menu ("coming soon")
  - Read-aloud speed (`MessagesA11yReadBar.jsx:75`)
  - "View role" (`MessagesThreadParts.jsx:185`)

### `/learning`

Live: `learning.api`, `learningPath.api`.

- [ ] **Lesson media and quiz content** have no backend (`services/learning.api.js:21`). "Mark module done" is a stand-in (`LessonPlayer.jsx:244`).
- [ ] **Weekly goal and level cards** appear in demo mode only (`LearningInProgress.jsx:363`).
- [ ] **Inert:** certificate Share and Download (`LearningCertificates.jsx:88,98`). The "Ask Career Buddy" buttons now open the chat (2026-11-21 inspection), but the text typed in the lesson box isn't passed into it.

### `/wallet` ✅ VERIFIED: no service

- [ ] **Everything is mock:**
  - Data: `talentWallet/walletData.js`, `walletCyclesData.js`, `walletFinancingData.js`, `walletCreditData.js`, `walletKycData.js`.
  - Withdraw, KYC, top-up, savings, payouts, financing, credit and receipts run in local state or only log. That is about 40 actions across `WalletFinancing`, `WalletPayouts`, `WalletSavings`, `WalletHome`, `ReceiptDrawer`, `WalletCycles`, `WalletUnder18`, `WithdrawDialogs`, `WalletCredit`, `WalletOnboarding` and `WalletTransactions`.

### `/settings`

Live: `settings.api` (account, preferences, notifications, privacy, block, pause, password, sessions, data download, deactivate, logout) and `support.api`.

- [ ] **Guardian tab:** sending an invite only logs (`SettingsGuardian.jsx:35`).
- [ ] **Two-step verification:** local state only (`SettingsSecurity.jsx:62,162`; `SettingsBSecurityDialogs.jsx:237,242`).
- [ ] **Help centre:** topics, FAQ and articles are static (`talentSettings/helpData.js`). Article helpful / related / ask Buddy / WhatsApp / Report only log (`HelpArticleView.jsx:79,278-322`).
- [ ] **Send feedback:** only logs (`SendFeedbackDialog.jsx:58`).
- [ ] **Inert:**
  - Change account type and avatar (`SettingsAccount.jsx:324,331`)
  - "Choose per skill" (`SettingsPrivacy.jsx:343`)
  - Disconnect Google (`SettingsSecurity.jsx:212`)
  - Verified-skills PDF (`SettingsData.jsx:252`)
  - Help contacts (`HelpSupportPage.jsx:305`)
  - "Suggest an article" and WhatsApp (`HelpPopoverFlow.jsx:218,294`)
- [ ] **`/logged-out`** always says "You're logged out, Kofi", "4 applications" and "12-day streak", even after a real logout (`LoggedOutScreen.jsx:26` `SESSION`). ✅ VERIFIED (2026-11-21 inspection)
- [ ] **Log-out confirm:** the streak line only shows in demo; it doesn't read live streak data (`LogoutConfirm.jsx:24,34`). 🔶 LIKELY (2026-11-21 inspection)
- [ ] **`/settings/help?demo=1`** still calls `/support/cases` (401 signed out) (`HelpSupportPage.jsx:110`). 🔶 LIKELY (2026-11-21 inspection)

### `/skills-lab`, `/my-assessment`

Live: `skillsLab.api`, `skillsLabWeekly.api`, `games.api`, `assessment.api`.

- [ ] **Game content:** legacy skill and personality game content is local data; only results are posted (`talentSkillsLab/skillGames/*Data.js`, `games/personality/*Data.js`).
- [ ] **Skills Lab inert:** "Preview recruiter view" (`LabDetailScreen.jsx:154`). "Resume attempt" now opens the lab (2026-11-21 inspection).
- [ ] **My Assessment mock:** the TypeScript full flow and the per-skill library (`talentAssessment/assessmentData.js`). Topic breakdowns are mock only (`liveSkillEvidence.js:6`). "Best work" has no data (`liveOverview.js:354`).
- [ ] **My Assessment inert:** Recruiter-view "Message" (`RecruiterView.jsx:89`). Re-checked (2026-11-21 inspection): `OverviewCards.jsx` rows and "Prefer games" log and then navigate (never dead), and "Chat with buddy" now opens Career Buddy in demo too.

### `/community`

Live: `community.api`, `circle.api`, `careerBuddy.api`.

- [ ] **Create and manage a community:** stored in sessionStorage as a stand-in for POST `/communities` (`create/createCommunityStore.js`).
- [ ] **Mute, "Request a community", pending-review card:** no backend (`CommunityBrowseLive.jsx:46`, `CommunityPageLive.jsx:66`).
- [ ] **Circle:**
  - Following / feed, mentors and messaging are hidden (`CirclePage.jsx:75`).
  - "Learn from" is local (`circleStore.js:122`).
  - Congratulate only shows a toast (`CircleFeed.jsx:16`).
  - "Save to list" and "Invite to apply" are toast only (`NetworkRestrictionDialog.jsx:17`).
  - The rail badge is not wired (`CircleFrame.jsx:17`).
- [ ] **My crew right column, signed in:** the circle API has no grow-your-crew checklist, no mentor list and no list of mutual people (the person endpoint only returns a `mutual` count), so live users see only the stats card and no "You both know" card; the demo shows the drawn cards with fixed progress. ✅ VERIFIED (2026-11-22)
- [ ] **Club member "Message"** only opens the inbox: there is no endpoint to start a conversation with a member (`CommunityTabPanels.jsx:~250`). 🔶 LIKELY (2026-11-21 inspection)
- [ ] **Moderator "Remind"** has no API (`CommunityOwnerPage.jsx:148`). ✅ VERIFIED (2026-11-21 inspection)
- [ ] **Live club cards** say "New club" under 25 members because the backend has no activity metric (`liveCommunity.js:33`). ✅ VERIFIED (2026-11-21 inspection)

### `/profile`, `/profile/filling`, `/profile/engagement`

Live: `talentProfile.api`, `profileStages.api`, `media.api`, `journey.api`, `videoPitch.api`, `cv.api`, `certificate.api`, `careerBuddy.api`.

- [ ] **No backend:**
  - Badges, endorsement faces, recruiter skill demand and in-progress certs (`talentProfileLive.js:14`)
  - Reply time and last active (`:331`)
  - Per-field audience (`TalentProfilePage.jsx:211`)
- [ ] **Not saved:**
  - Skill category and "where you used it" (`skillsData.js:324`)
  - Work employment type and tools (`workData.js:162`)
  - CV review edits (`CvReview.jsx:444`)
- [ ] **Profile inert:**
  - Writing-help chips
  - Empty-state actions (`ProfileEmptyState.jsx`)
  - Pitch re-record and captions
  - Read-aloud has no speech
  - Share card builder (timed mock)
  - Public view "Create recruiter account"
  - Cert and portfolio edit links
  - "Who's looking: see all" and "Badges: all 9"
- [ ] **Profile filling inert:**
  - Edit avatar name
  - "Paste a link"
  - "Ask a colleague"
  - "Suggest a game"
  - "Edit bio"
  - "See all roles"
  - Credential links
- [ ] **Career Buddy:**
  - Chat-history pin, rename and delete are browser-only because the agent has no endpoint (`useCareerBuddyLive.jsx:280`).
  - Stage "Modify" only logs (`CareerBuddySection.jsx:3741`). Milestone share has no backend.
  - Recruiter company form: KYB upload and Change photo are inert.

- [ ] **Signed in, `/api/guidance/opportunities?pageSize=3` returns 403** for a talent account (seen on /profile and /profile/engagement; the shell logs "opportunities failed: 403"). Backend role setting. 🔶 LIKELY (inspection 2026-11-22)
- [ ] **`/engagement/video-pitch/:id` timed out** (15 s) on the Pitch stage when signed in; the page still renders. 🔗 EXTERNAL (inspection 2026-11-22)
- Re-checked (inspection 2026-11-22): these profile items listed above are now wired: empty-state actions, pitch re-record, "Create recruiter account", cert and portfolio edit links, "Who's looking: see all", "Paste a link", "Edit bio", "See all roles", credential links.

### Signed-in check, talent app (signed-in check 2026-11-22)

- [ ] **Re-saving after unsave always fails:** POST `/api/guidance/bookmarks` returns 500 `BOOKMARK_CREATE_FAILED` for anything the user saved and then removed (curl: save 200 → delete 200 → save 500). Breaks the Home heart, Opportunities Save and saving courses. 🔗 EXTERNAL ✅ VERIFIED
- [ ] **Certificate links point at localhost:** `certificateUrl` from `/guidance/training/history` starts with `http://localhost:3000/api/…` on staging (backend public-URL setting). 🔗 EXTERNAL ✅ VERIFIED
- [ ] **Enrolments have no course name**, and the course catalogue (`pageSize=50`: 46 of 72 returned) leaves out enrolled courses. The app falls back to the bookmark title; a finished course that was never saved still shows as "Course". 🔶 LIKELY
- [x] **Verified-skill counts disagreed** (Home 10, My Assessment 7, Skills Lab 4, assessment card 3). Fixed 2026-11-22 (front-end): one rule in `src/utils/verifiedSkills.js` from US-5.1.2-02: verified = distinct skills with a platform-assessment pass (`verified` / `assessment_verified`); game-evidenced and conversationally validated are lower labels. "Proven" (Skills Lab and games step) = assessment or game evidence. Test account: 4 verified (Python, UI/UX design, Public speaking, Team leadership), 8 proven, matching Skills Lab. ✅ VERIFIED
- [ ] **Load / timeouts:** every talent page fires ~12 shell calls (`/streak`, `/xp`, `/notifications`, `/activity/me`, `/profiles/journey`, `/quests/week`, `/profiles/me`, `/applications/my-applications`, `/talent-messages/unread-count` …); under that burst many hit the 15 s timeout or 500. 🔶 LIKELY backend capacity (worse in dev).
- [ ] **Login probe:** `resolveHomePath` calls `/api/institution/me`, which returns 403 for a talent and logs a console error (`auth.api.js:91`). Harmless, noisy.
- [ ] **Screening questions exist only in the user stories** (US-6.1.1 / US-6.2.2-01, `GTH_JobProspecting_v1_0_STORY.docx`): up to 3 yes/no questions per posting, optional knock-out flag, auto-reject on a wrong knock-out answer, answered by the talent when applying; stored as `screeningQuestions[{ question, isKnockout }]` on the opportunity. Checked 2026-11-22, none of it exists yet:
  - **Backend (live API):** job details have no screening fields; `POST /guidance/jobs/:id/apply` only takes `hiddenSections`. ✅ VERIFIED
  - **Recruiter app:** only profile-based "Screening criteria" (years, education, skills, assessment score, partner institutions), all mock; nowhere to write questions. ✅ VERIFIED
  - **Figma:** every text layer of Recruiter Job Postings, Job Prospecting and AI Chat, and Talent Opportunities, Messages and Engagement v2 was searched: no question field and no answering screen. ✅ VERIFIED
  - **Needed:** backend storage and an apply payload for answers; designs for writing questions (recruiter job form) and answering them (talent apply step 2). Until then the apply preview stays one step, labelled "PREVIEW".
- [ ] **Choosing which profile sections to share** (US-6.2.2-01): the apply call accepts `hiddenSections`, but nothing stores per-section visibility (`/settings/privacy` only has visibility, see.employer/salary/city/message, employerCompanies; the profile's "Manage what's visible" drawer has no backend). Live applications therefore always send `[]`. Also unknown: which section keys the server accepts. ✅ VERIFIED (2026-11-22)

- [ ] **Banner upload is never saved:** `PATCH /profiles/fields {bannerImage}` returns 400 "Unknown profile fields: bannerImage"; the upload works but the user sees "Check your connection" (`ProfileHeader.jsx:239`). ✅ VERIFIED (2026-11-22)
- [ ] **Portfolio "Your role" is dropped:** the PATCH sends `role`, the backend doesn't store it. ✅ VERIFIED (2026-11-22)
- [ ] **Interests written by onboarding / Career Buddy are invisible:** they use categories (`entrepreneurial`, `hobby`) that match no Interests area, so the stage shows "0 selected" while the journey counts it done. ✅ VERIFIED (2026-11-22)
- [ ] **Career Buddy replies:** the local `/agent` proxy (localhost:4111) answers 500 in dev; sends show an error toast. 🔗 EXTERNAL (2026-11-22)
- [ ] **Game content:** every Chart Detective case has the same reason ("Y-axis does not start at zero"); personality games' play-style results are static (Trotro Rush always says "The Early Planner"). 🔶 LIKELY (2026-11-22)

### Controls wired without a backend (2026-11-21)

These now confirm in place but store nothing: course request ("Request this course", `/learning`), assessment reminder ("Remind me", `/my-assessment/library`), moderator reminder ("Remind", club Manage dialog), notification sort (client-side only), "Learn from" a crew member (local), and Members "Message" (opens a drawn conversation or the inbox; no start-a-conversation endpoint). Also missing: a badges collection API and a person-to-person evaluations / references API (Home "Evaluations" now opens `/my-assessment`). 🔶 LIKELY

## 4. Parent portal `/parent`

**Live:**

- `parent.api` (me, ward, flags, approve, opt-out / restore, unlink, link by code)
- `learningPath.api`
- Buddy

**Update 2026-11-28 (inspection):** signed in, Evaluate and Wallets now say "not available yet" instead of showing sample wards and money (`states/ParentNotYet.jsx`); parent Settings, Notifications and Report a concern are live (see below).

- [ ] **Backend endpoints that do not exist (all 404):** parent wallets / payments / limits / top-up; parent evaluations (start, questions, submit, autosave, outcome); parent notification types, milestones and reactions; parent roles and closing only the parent role; ward list as its own route (`GET /parent/wards`); link requests by name and date of birth (`POST /parent/link-requests`, list, resend); To review certificates, teacher evaluations and assessment results; ward Evaluations / Crew / visibility tabs; `POST /parent/reports`; help articles; `users/switch-role`. ✅ VERIFIED (probes 2026-11-28)
- [x] **Live now (2026-11-28):** Settings (Account `PUT /settings/account`, Notifications, Security devices / password / two-step, Data export), Notifications feed (`/notifications`), Report a safety concern (`POST /support/concerns`), Log out (`POST /users/logout`). Needs a signed-in parent check. ❓
- [ ] **Settings gaps:** Change photo, Download PDF, "Pause non-urgent notifications", Disconnect Google, Roles choices have no endpoint; **Close parent account** shows an error because `/settings/deactivate` turns off the whole account (a parent who is also a talent keeps My career). Notification rows use parent ids the backend may not keep. 🔶 LIKELY
- [ ] **Parent Notifications tabs** are guessed from `type` / `category` words; the backend has no parent types. The top-bar bell panel is still mock. 🔶 LIKELY
- [ ] **Top-bar search** is client-side over `/parent/me` wards and a fixed page list (`chrome/parentSearchIndex.js`); `GET /search` exists (401) but is untested. **Language pick** and **accessibility settings** are not saved (browser only). **Messages count** is hidden when signed in (`/messaging/stats` exists, 401). 🔶 LIKELY
- [x] **Fixed 2026-11-28:** Settings › Log out never ended the session (it showed the result but kept the tokens).
- [ ] **Evaluate** (`/parent/evaluate*`): mock (`evaluate/data/*`, `questions/data/questionsData.js`, `results/data/resultsData.js`).
- [ ] **Wallets** (`/parent/wallets`, ward Wallet tab): mock (`wallets/data/walletsData.js`).
- [ ] **Notifications and milestone:** mock (`notifications/data/notificationsData.js`); `notifications.api` is not used here.
- [ ] **Settings:** data is mock (`settings/data/settingsData.js`).
  - Save only logs (`AccountTab.jsx:79`, `NotificationsTab.jsx:142`).
  - Photo, password, Google, data download and pause are inert.
- [ ] **Help and articles:** static (`help/data/helpData.js`, `articleData.js`).
- [ ] **To review:** Certificates, Evaluations and Payments have no backend (`review/ReviewPage.jsx:30`).
- [ ] **Ward page:** Evaluations, Wallet and Crew tabs are mock (`ParentWardPage.jsx:67`).
- [ ] **Smaller items:**
  - Link ward by name and date of birth (`ParentLinkWardPage.jsx:32`)
  - Space switcher
  - "Who viewed", readiness and guide cards (`home/data/parentHomeData.js`)
- [ ] **Inert:**
  - Top bar search, language and profile menu
  - Home quick actions and Customize
  - Resend link request
  - Send note
  - Invite a teacher
  - Buddy history
  - Mark all read
  - Certificate file
  - WhatsApp

- [ ] **Settings › Accessibility and Language** reuse the talent sections without a live object, so changes are not saved (`parent/settings/SettingsPage.jsx:77`). 🔶 LIKELY (inspection 2026-11-22)
- [ ] **Settings › Security "Change password"** is demo only; the talent page has a live password call, the parent page doesn't (`parent/settings/SecurityTab.jsx` ~132). ✅ VERIFIED (inspection 2026-11-22)
- [ ] **Help "Chat on WhatsApp"** stays inert until `VITE_SUPPORT_WHATSAPP` is set (empty in `.env.example`). ✅ VERIFIED (inspection 2026-11-22)

## 5. Recruiter portal `/recruiter`

**Live:**

- Onboarding
- Application pipeline, older board design (`recruiterPipeline.api` via `useLivePipeline.js`)
- Recruiter Career Buddy
- Top-nav notifications

`recruiterJobs.api.js` exists but appears to be used only by Career Buddy (🔶).

- [ ] **Dashboard** `/recruiter/home`: `recruiterDashboardData.js`, `recruiterHomeData.js`.
- [ ] **Talent search and candidate profile:** `talentSearchData.js`, `talentCandidateProfileData.js`.
- [ ] **Job templates:** `jobTemplatesData.js`.
- [ ] **Job postings** (list, new, preview, detail, edit): `jobPostingsData.js`, `jobFormData.js`. Publish and Save template are URL / local only (`JobFormPage.jsx:319-336`).
- [ ] **Job screening:** `jobScreeningData.js`, `screeningFlowData.js`.
- [ ] **Messages:** `recruiterMessagesData.js`, `recruiterInboxData.js`.
- [ ] **Settings:** `recruiterSettingsData.js` and the tab data files.
  - **Log out is mock and does not end the session** ✅ (`RecruiterLogoutDialog.jsx`).
  - Change password, delete account, two-step, accessibility save, auto-message, invoice download, leave organisation and preview-as-talent are inert.
- [ ] **Help:** `recruiterSettings/help/recruiterHelpData.js`.
- [ ] **Community:** mock, "no recruiter API yet" (`talentCommunity/communityState.js:52`).
- [ ] **Pipeline, new board design** (drawer, bulk select, offer / not-progressing / feedback dialogs): demo only, never shown when live (`ApplicationPipelineSection.jsx:607`).
- [ ] **Inert:**
  - Applicants paging and sort
  - Screening sort and load more
  - Candidate save, next, move stage and open application
  - Market report
  - Inbox refresh
  - "View and apply"
  - Help pop-over items
  - Sidebar "Continue setup"

- [ ] **Messages composer:** a sent message lives only in local state; no messaging API is called (`RecruiterThreadView.jsx`). 🔶 LIKELY (inspection 2026-11-22)
- [ ] **Notifications "Shortlist"** only opens the pipeline; no stage change is sent. ⚠️ ASSUMPTION (inspection 2026-11-22)

## 6. Institution portal `/institution`

**Live:** almost everything, through `institutionPortal.api`.

- [ ] **No public QR** to verify a report (`InstitutionReportMethod.jsx:12`).
- [ ] **Inert:**
  - Programme preview body (by design)
  - Record "Edit record", "Read more" / "See all" and badges
  - Progress "See all" links
  - Credential toast "View log"
  - Welcome modal extras
  - Submitted dialog "Status page" and "Next: review"
- Cleanup:
  - Dead seeds in `roster/data/rosterData.js`.
  - A stale "mock" comment in `InstitutionRecordsPage.jsx`.

- [ ] **Two institution registration flows exist:** the older `/onboarding/institution/*` (bulk upload) and the newer `/institution/sign-up`. `AUTH_ROUTES.institution.signUp` still points to the old guidelines page, `/get-started` has no institution option, and `/institution/sign-up` is only reachable from the gate's explanation screen. ❓ NEEDS-CLARIFICATION: which flow is canonical (inspection 2026-11-22)
- [ ] **Profile menu "Send feedback"** only logs (shared `SendFeedbackDialog`). 🔶 LIKELY (inspection 2026-11-22)
- [ ] **"Ask for an invite"** (already-registered dialog) has no API (`onboarding/InstitutionDuplicateDialog.jsx` ~35). ✅ VERIFIED (inspection 2026-11-22)
- [ ] **Endless loading:** `/institution/public-page` shows "Loading your public page…" forever when the session has no `institution.slug`; the home "Next step" and readiness cards keep "Loading…" after the home API fails (`home/InstitutionNextStepCard.jsx:24`, `InstitutionReadinessCard.jsx:23`). ✅ VERIFIED (inspection 2026-11-22)

## 7. Agency portal `/agency`

**Live:** almost everything, through `agency.api`.

- [ ] **Methodology:** static copy. "Ask the data team" is inert (`MethodologyArticle.jsx:216`).
- [ ] **Briefing share:** mailto only (`BriefingShareDialog.jsx:22`).
- [ ] **Settings toasts:** local only.
- [ ] **Inert:**
  - Mobile home settings and query set (`AgencyHomeMobile.jsx:72,347`)
  - Quick actions (`AgencyQuickActions.jsx:33`, inferred)
  - Data-request row open (`DataRequestRow.jsx:86`)
- Cleanup: unused mock rows in `demand/data/demandData.js` and `national/data/nationalData.js`.

- [ ] **Dead mock data:** `buildAuditEvents` / `AUDIT_DRAWN` in `settings/data/agencySettingsData.js` (~228-308) with hard-coded `/agency/data-requests/dr-1042` links; the audit tab uses `GET /agency/audit`. 🔶 LIKELY safe to delete (inspection 2026-11-22)
- [ ] **"Ask for an invite"** (already-registered dialog) only closes: no invite-request flow or API. ✅ VERIFIED (inspection 2026-11-22)
- [ ] **Phone home** (`AgencyHomeMobile`) may still show "Loading…" forever when the API fails (desktop fixed). Not checked (inspection 2026-11-22)

## 8. Public data `/data`

**Live:** `publicData.api` (overview, regions, region, compare, trends, outcomes).

- [ ] **Opportunities directory** `/data/opportunities*` and **Partners** `/data/partners*`: `directory/data/directoryData.js`.
- [ ] **Showcase:** `showcase/data/showcaseData.js`.
- [ ] **Report** `/data/report`: `share/data/shareData.js`. "PDF" is the print dialog.
- [ ] **Digest subscribe:** a timer promise (`shareData.js:176`). Unsubscribe uses a sample email (`DigestUnsubscribedCard.jsx:18-31`).
- [ ] **PDF export:** mocked; needs POST `/api/public/pdf-exports` (`DownloadDialog.jsx:23,51`).
- [ ] **Print overview and outcomes:** sample data (`PrintOverview.jsx:14`, `PrintOutcomes.jsx:9`).
- [ ] **Returning-visitor block:** `RETURNING_SAMPLE` (`landing/data/landingData.js`).
- [ ] **Methodology, status / maintenance:** static data files.
- [ ] (inferred) `MAP_REGIONS_SAMPLE` / `SAMPLE_SPARKLINE` helpers in the overview and regions data files: check whether live pages still render them.

- [ ] **Freshness card copy is static:** always "14:02 GMT (2 min ago)" even when the live pill says "Updated 3 h ago · Refreshing" (`methodology/FreshnessTooltip.jsx:22`). 🔶 LIKELY (inspection 2026-11-22)
- [ ] **Offline cache is not wired (frontend):** `status/publicDataCache.js` (`fetchWithCache`, `saveCache`) is never called, so nothing is cached for a dropped connection. A real drop now says "Offline · showing the last data loaded" (no time). Wiring needs each `/data` loader to go through `fetchWithCache(key, loader)`; the pill and banner then show the saved time automatically (`latestSavedAt`). The forced `?state=offline` frame keeps the drawn 09:12. ✅ VERIFIED (2026-11-25)
- [ ] **Outcomes stories:** live `/public-data/outcomes` returns no stories, so the stories section is hidden and `/data/outcomes/stories/ama-k` shows "This story isn't available". ✅ VERIFIED (inspection 2026-11-22)
- [ ] **Top-bar search** only searches the sample directory data (`publicDataSearch.js`); there is no search API. ⚠️ ASSUMPTION (inspection 2026-11-22)
- [ ] **Digest unsubscribe:** `?token=` is ignored; the page shows the sample address. ✅ VERIFIED (inspection 2026-11-22)
- [ ] **"Visit website ↗"** opens placeholder `https://example.org/<partner>` URLs from the mock data. (inspection 2026-11-22)

## 9. Platform admin `/admin`

**Live:**

- `admin.api` (accounts, approvals, moderation, verification, reports, live ops, insights, staff, settings, audit, comms, support)
- `adminChrome.api`
- Site copy via `siteCopy.api` when live

- [ ] **Content Editor role:** mocked because the backend has no such role (`useAdminSession.js:45`). Roles and staff screens use `roles/settingsMockData.js`.
- [ ] **Media library uploads:** simulated, nothing is sent (`media/useMediaUploads.js:14`).
- [ ] **Report kit** `/admin/report`: Figma figures (`report/data/adminReportData.js`).
- [ ] **No backend:**
  - Home team-health and SLA; approved actions are recorded, not executed (`AdminHomePage.jsx:41`)
  - Community review queue (`AdminModerationPage.jsx:47,696`)
  - Comms test send, schedule, preview and history (`AdminCommsPage.jsx:452`)
  - Live-ops "ask for access"
  - Ghana Card, 2-step and device fields on accounts
- [ ] **Inert:**
  - Sign-in "Forgot password" and "Ask your super admin" (`AdminSignInForm.jsx:107,177`)
  - Settings nav items with no screen
  - Verification "Open file" and "Add"
  - Comms template filters
  - Rich-text format buttons

## 10. Emails `emails/` (inspection 2026-11-22)

- [ ] **No sender yet** fills `{{APP_URL}}` or the per-recipient tokens (`{{conversation_id}}`, `{{job_id}}`, `{{person_id}}`, `{{ward_id}}`, `{{invite_token}}`, `{{unsubscribe_token}}`, `{{confirm_url}}`).
- [ ] **Images use relative paths** (`../../assets/…`); a real send needs hosted image URLs (e.g. an `{{ASSET_URL}}` prefix).
- [ ] **No one-click unsubscribe** for talent and parent emails (no token endpoint or page): "Unsubscribe" opens notification settings. ⚠️ ASSUMPTION
- [ ] **Public digest confirm:** needs a backend endpoint that consumes `{{confirm_url}}` and redirects into the app.
- [ ] **TE-12 "Send a reminder":** no talent-side resend of the parent approval request; it opens `/settings/guardian`.
