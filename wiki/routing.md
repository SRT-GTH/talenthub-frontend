# Routing

## Pattern `✅ VERIFIED`

Config-based routing in `src/App.jsx` using React Router v6 `<BrowserRouter>` + `<Routes>`. Mirrors elysium — not file-based, no Next.js conventions.

Global siblings mounted above `<Routes>`: `<ScrollToTop />` (resets scroll on nav) and `<DemoNavigator />` (dev/demo step-jumper across all onboarding flows).

## Route Map `✅ VERIFIED` (re-verified 2026-07-06)

### Public / auth-adjacent — `MainLayout`

| Path           | Element                               |
| -------------- | ------------------------------------- |
| `/`            | `LandingPage`                         |
| `/login`       | `LoginPage`                           |
| `/get-started` | `GetStartedPage` (role select)        |
| `/components`  | `HomePage` (design-system playground) |

### Talent onboarding — `MainLayout` → `OnboardingProvider`

Parent route `/onboarding/talent/*`. DOB captured on the dob step propagates via `OnboardingProvider` for age-gating (`isMinor`).

| Path                               | Element                      |
| ---------------------------------- | ---------------------------- |
| `/onboarding/talent/welcome`       | `OnboardingWelcomePage`      |
| `/onboarding/talent/dob`           | `OnboardingDobPage`          |
| `/onboarding/talent/personal-info` | `OnboardingPersonalInfoPage` |
| `/onboarding/talent/contact`       | `OnboardingContactPage`      |
| `/onboarding/talent/address`       | `OnboardingAddressPage`      |
| `/onboarding/talent/education`     | `OnboardingEducationPage`    |
| `/onboarding/talent/parent-info`   | `OnboardingParentInfoPage`   |
| `/onboarding/talent/review`        | `OnboardingReviewPage`       |

### Institution onboarding — `MainLayout` → `InstitutionOnboardingLayout`

Flow order: guidelines → your-institution → contact → activate → template-guide → template → upload → validate → confirm → report. Breadcrumb `STEP_PATHS` has 8 entries (your-institution → report); `template-guide` maps to step "Template".

| Path                                       | Element                          | Notes                       |
| ------------------------------------------ | -------------------------------- | --------------------------- |
| `/onboarding/institution/guidelines`       | `InstitutionGuidelinesPage`      | splash, no breadcrumb       |
| `/onboarding/institution/your-institution` | `InstitutionYourInstitutionPage` |                             |
| `/onboarding/institution/contact`          | `InstitutionContactPage`         |                             |
| `/onboarding/institution/activate`         | `InstitutionActivatePage`        | full-width (no right panel) |
| `/onboarding/institution/template-guide`   | `InstitutionTemplateGuidePage`   |                             |
| `/onboarding/institution/template`         | `InstitutionTemplatePage`        | full-width                  |
| `/onboarding/institution/upload`           | `InstitutionUploadPage`          |                             |
| `/onboarding/institution/validate`         | `InstitutionValidatePage`        | full-width                  |
| `/onboarding/institution/confirm`          | `InstitutionConfirmPage`         | full-width                  |
| `/onboarding/institution/report`           | `InstitutionReportPage`          | full-width                  |

### Parent portal — `MainLayout` → `ParentOnboardingLayout`

Two entry flows defined in `src/constants/parentFlows.js`:
**Flow A** (self-serve) entry `/onboarding/parent-welcome`; **Flow B** (ward-invited, pre-filled) entry `/onboarding/parent-invited`. Flow B has its own `parent-invited-*` route namespace and step panels (`WARD_INVITE_STEP_PANELS`).

| Path                                      | Element                        | Flow                     |
| ----------------------------------------- | ------------------------------ | ------------------------ |
| `/onboarding/parent-login`                | `ParentLoginPage`              | login                    |
| `/onboarding/parent-welcome`              | `ParentWelcomePage`            | A entry                  |
| `/onboarding/parent-identity`             | `ParentIdentityPage`           | A step 1                 |
| `/onboarding/parent-verification`         | `ParentVerificationPage`       | A step 2                 |
| `/onboarding/parent-contact`              | `ParentContactPage`            | A step 3                 |
| `/onboarding/parent-security`             | `ParentSecurityPage`           | A step 4                 |
| `/onboarding/parent-link-ward`            | `ParentLinkWardPage`           | A step 5                 |
| `/onboarding/parent-review`               | `ParentReviewPage`             | A step 6 (full-width)    |
| `/onboarding/parent-done`                 | `ParentDonePage`               | A terminal (100%)        |
| `/onboarding/parent-invited`              | `ParentInvitePage`             | B entry (welcome)        |
| `/onboarding/parent-invited-identity`     | `ParentInviteIdentityPage`     | B step 1                 |
| `/onboarding/parent-invited-verification` | `ParentInviteVerificationPage` | B step 2                 |
| `/onboarding/parent-invited-contact`      | `ParentInviteContactPage`      | B step 3                 |
| `/onboarding/parent-invited-security`     | `ParentInviteSecurityPage`     | B step 4                 |
| `/onboarding/parent-invited-link-ward`    | `ParentInviteLinkWardPage`     | B step 5 (link panel)    |
| `/onboarding/parent-invited-consent`      | `ParentInviteConsentPage`      | B step 6 (consent panel) |

### Profile engagement — no layout wrapper (own chrome)

| Path                                       | Element                  |
| ------------------------------------------ | ------------------------ |
| `/profile/engagement`                      | `ProfileEngagementPage`  |
| `/profile/engagement/identity`             | `IdentityMapPage`        |
| `/profile/engagement/milestone`            | `MilestoneUnlockPage`    |
| `/profile/engagement/milestone/top-20`     | `Top20MilestonePage`     |
| `/profile/engagement/milestone/top-talent` | `TopTalentMilestonePage` |

### Profile filling — no layout wrapper, each step owns its own full-bleed chrome `✅ VERIFIED` (2026-07-22)

| Path                                    | Element                                                                                                                                                                |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/profile/filling/interests`            | `InterestsIntroPage`                                                                                                                                                   |
| `/profile/filling/interests/categories` | `InterestsStage2Page`                                                                                                                                                  |
| `/profile/filling/skills`               | `SkillsIntroPage`                                                                                                                                                      |
| `/profile/filling/skills/categories`    | `SkillsStage2Page`                                                                                                                                                     |
| `/profile/filling/career-buddy`         | `CareerBuddyPage` — talent + recruiter + **parent** via `CareerBuddyRoleProvider` (`?cb=` jumps). Legacy `/recruiter-buddy` redirects here. `✅ VERIFIED` (2026-08-11) |

### Profile filling — no layout wrapper (own chrome)

| Path                                    | Element               |
| --------------------------------------- | --------------------- |
| `/profile/filling/interests`            | `InterestsIntroPage`  |
| `/profile/filling/interests/categories` | `InterestsStage2Page` |
| `/profile/filling/skills`               | `SkillsIntroPage`     |
| `/profile/filling/skills/categories`    | `SkillsStage2Page`    |

### Skills Lab — no layout wrapper (standalone game shell)

Single-page state machine quiz for skill verification. Route param `:skillSlug` selects the quiz config from `src/constants/skillLabQuizzes.js`. Currently mocked with Python.

| Path                     | Element         |
| ------------------------ | --------------- |
| `/skills-lab/:skillSlug` | `SkillsLabPage` |

### Talent Community Engagement — no layout wrapper (own dashboard chrome) `✅ VERIFIED` (2026-09-17)

Community/feed area. `CommunityShell` supplies the chrome (top nav with global search + notification cluster, collapsible left rail, grid/ellipse page background) as a **fixed viewport shell** — only the content column scrolls, which the two Figma "remains fixed on scroll" annotations require. Mounted outside `MainLayout` for the same reason `/profile/engagement/*` is.

**One route pair, not a talent/recruiter split.** Figma ships a single set of screens whose feed content is identical regardless of viewer; only the sidebar is recruiter-specific. `CommunityShell` reads the app-root `CareerBuddyRoleContext` for that dataset instead of the routes forking by role. See [components.md](components.md#role-gating--needs-clarification).

**NB** — deliberately _not_ under `/profile/engagement/*`; that namespace is the unrelated profile-completion feature.

| Path                      | Element               | Notes                                                                              |
| ------------------------- | --------------------- | ---------------------------------------------------------------------------------- |
| `/community`              | `CommunityHomePage`   | Community index — grid of community cards, sticky category filter, search          |
| `/community/:communityId` | `CommunityDetailPage` | Community detail — hero ⇄ sticky header, feed, 3 rails, Create/Report/Share modals |

Only `frontend-devs-ghana` has a designed detail screen; other ids render the same layout with that community's own identity swapped in from the index dataset.

### Avatar customiser — `AvatarFlowLayout` (outside `MainLayout`)

Wrapped in `AvatarSelectionProvider` so picks survive navigation.

| Path                                | Element                |
| ----------------------------------- | ---------------------- |
| `/profile/engagement/avatar`        | `AvatarCustomiserPage` |
| `/profile/engagement/avatar/skin`   | `AvatarSkinTonePage`   |
| `/profile/engagement/avatar/hair`   | `AvatarHairPage`       |
| `/profile/engagement/avatar/extras` | `AvatarExtrasPage`     |
| `/profile/engagement/avatar/outfit` | `AvatarOutfitPage`     |

## Reserved `❓ NEEDS-CLARIFICATION`

| Path       | Plan                                                                                                                                    |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `/admin/*` | Lazy-loaded admin subsystem (commented slot in App.jsx). Pattern: `lazy(() => import('./admin/AdminApp'))` + `<Suspense>`. See elysium. |

## Layout shells `✅ VERIFIED`

| Shell                         | Path                                         | Behaviour                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MainLayout`                  | `src/layout/MainLayout.jsx`                  | Swaps `OnboardingNavbar` (no footer) vs `Navbar`+`Footer` via `ONBOARDING_CHROME_PATHS` (`/onboarding/`, `/login`, `/get-started`). Institution + parent paths get a **fixed viewport shell** (`h-screen overflow-hidden`, only the form column scrolls); others page-scroll. `getLayoutFamily()` is the fade-in key so provider state survives step changes. |
| `InstitutionOnboardingLayout` | `src/layout/InstitutionOnboardingLayout.jsx` | 8-step breadcrumb (hidden on guidelines), bg glow ellipses, scrollable `<Outlet />` column (`no-scrollbar`), `InstitutionRightPanel` hidden on activate/template/validate/confirm/report.                                                                                                                                                                     |
| `ParentOnboardingLayout`      | `src/layout/ParentOnboardingLayout.jsx`      | Parent mirror: `ParentOnboardingBreadcrumb` on step routes, `ParentLoginRightPanel` with per-route content (login/welcome/signup/done/invited variants); panel hidden on parent-review.                                                                                                                                                                       |
| `AvatarFlowLayout`            | `src/layout/AvatarFlowLayout.jsx`            | Thin shell wrapping `<Outlet />` in `AvatarSelectionProvider`; no chrome.                                                                                                                                                                                                                                                                                     |

## Context-aware nav auth CTA `✅ VERIFIED`

`src/constants/authRoutes.js` — `AUTH_ROUTES` map (talent/institution/parent → signIn/signUp) + `getNavAuthCta(pathname)`. `OnboardingNavbar` shows "Create Account" on sign-in pages and "Log In" on sign-up pages, per role. `⚠️ ASSUMPTION` institution has no dedicated sign-in page yet — `institution.signIn` falls back to `/login`.

## Recruiter dashboard home

| Path              | Page                                        | Chrome                                  |
| ----------------- | ------------------------------------------- | --------------------------------------- |
| `/recruiter/home` | `pages/recruiterHome/RecruiterHomePage.jsx` | `CommunityShell` (outside `MainLayout`) |

Figma `7249:73882`. Reuses the community chrome rather than a dedicated layout — `CommunityTopNav`, `CommunitySidebar` and `CommunityPageBackground` were all built from this same "Recruiter Home-Existing user" frame set. ✅ VERIFIED

`CommunitySidebar`'s active item is now derived from `useLocation().pathname` instead of the hardcoded `active: true` that used to sit on the Community entry; `/community` and `/community/:id` behave exactly as before, and the Home entry (previously destination-less) now points here. ✅ VERIFIED

## Recruiter dashboard screens

All mounted outside `MainLayout`, all wrapped in `DashboardShell`. ✅ VERIFIED

| Path                              | Page                                                    | Figma        |
| --------------------------------- | ------------------------------------------------------- | ------------ |
| `/recruiter/home`                 | `pages/recruiterHome/RecruiterHomePage.jsx`             | `7249:73882` |
| `/recruiter/talent-search`        | `pages/talentSearch/TalentSearchPage.jsx`               | `7249:74283` |
| `/recruiter/job-templates`        | `pages/jobTemplates/JobTemplatesPage.jsx`               | `7249:75046` |
| `/recruiter/job-postings`         | `pages/jobPostings/JobPostingsPage.jsx`                 | `7249:75818` |
| `/recruiter/job-screening`        | `pages/jobScreening/JobScreeningPage.jsx`               | `7249:78066` |
| `/recruiter/application-pipeline` | `pages/applicationPipeline/ApplicationPipelinePage.jsx` | `7249:79017` |
| `/recruiter/messages`             | `pages/recruiterMessages/RecruiterMessagesPage.jsx`     | `7249:83993` |

`DashboardSidebar` derives its active item from `useLocation().pathname`; Home, Talent Search, Job Postings, Messages and Application Pipeline all resolve to the routes above. Community remains `/community` and `/community/:communityId`. ✅ VERIFIED

## Adding a route

1. Create the page in `src/pages/<flow>/<Name>Page.jsx` (thin wrapper around a section component).
2. Register the route in `src/App.jsx` under the appropriate layout group.
3. Add the step to `DemoNavigator` if it's an onboarding step; update the layout's step-path list / panel switch if needed.
4. Append a Playwright spec under `tests/e2e/` if non-trivial.
5. Update `wiki/figma-node-map.md` (Figma-sourced screens) and `wiki/log.md`.
