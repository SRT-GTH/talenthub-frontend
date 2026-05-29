# Routing

## Pattern `✅ VERIFIED`

Config-based routing in `src/App.jsx` using React Router v6 `<BrowserRouter>` + `<Routes>`. Mirrors elysium — not file-based, no Next.js conventions.

## Current Route Map `✅ VERIFIED`

| Path                                   | Element                               | Layout                                 |
| -------------------------------------- | ------------------------------------- | -------------------------------------- |
| `/`                                    | `LandingPage`                         | `MainLayout`                           |
| `/login`                               | `LoginPage`                           | `MainLayout` — OnboardingNavbar chrome |
| `/get-started`                         | `GetStartedPage`                      | `MainLayout` — OnboardingNavbar chrome |
| `/components`                          | `HomePage` (design-system playground) | `MainLayout`                           |
| `/onboarding/talent/welcome`           | `OnboardingWelcomePage`               | `MainLayout` — OnboardingNavbar chrome |
| `/onboarding/talent/dob`               | `OnboardingDobPage`                   | `MainLayout` — OnboardingNavbar chrome |
| `/onboarding/talent/personal-info`     | `OnboardingPersonalInfoPage`          | `MainLayout` — OnboardingNavbar chrome |
| `/onboarding/talent/contact`           | `OnboardingContactPage`               | `MainLayout` — OnboardingNavbar chrome |
| `/onboarding/talent/address`           | `OnboardingAddressPage`               | `MainLayout` — OnboardingNavbar chrome |
| `/onboarding/talent/education`         | `OnboardingEducationPage`             | `MainLayout` — OnboardingNavbar chrome |
| `/onboarding/talent/parent-info`       | `OnboardingParentInfoPage`            | `MainLayout` — OnboardingNavbar chrome |
| `/onboarding/talent/review`            | `OnboardingReviewPage`                | `MainLayout` — OnboardingNavbar chrome |
| `/onboarding/institution/guidelines`   | `InstitutionGuidelinesPage`           | `MainLayout` — OnboardingNavbar chrome |
| `/profile/engagement`                  | `ProfileEngagementPage`               | own chrome (outside MainLayout)        |
| `/profile/engagement/identity`         | `IdentityMapPage`                     | own chrome                             |
| `/profile/engagement/milestone`        | `MilestoneUnlockPage`                 | own chrome                             |
| `/profile/engagement/milestone/top-20` | `Top20MilestonePage`                  | own chrome                             |
| `/profile/engagement/avatar`           | `AvatarCustomiserPage`                | own chrome                             |
| `/profile/engagement/avatar/skin`      | `AvatarSkinTonePage`                  | own chrome                             |
| `/profile/engagement/avatar/hair`      | `AvatarHairPage`                      | own chrome                             |
| `/profile/engagement/avatar/extras`    | `AvatarExtrasPage`                    | own chrome                             |
| `/profile/engagement/avatar/outfit`    | `AvatarOutfitPage`                    | own chrome                             |

## Reserved `❓ NEEDS-CLARIFICATION`

| Path       | Plan                                                                                                                                                                                                                     |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/admin/*` | Lazy-loaded admin subsystem when product needs admin features. Pattern: `const AdminApp = lazy(() => import('./admin/AdminApp'))` wrapped in `<Suspense fallback={...}>`. See elysium's `App.jsx` for the exact pattern. |

## Layout Shells `✅ VERIFIED`

`src/layout/MainLayout.jsx` is the only shell today. Structure:

```jsx
<div className="font-raleway min-h-screen flex flex-col">
  <Navbar />
  <main className="flex-1">
    <Outlet />
  </main>
  <Footer />
</div>
```

When auth lands, add a `ProtectedRoute` wrapper (see elysium pattern) that redirects unauthenticated users to a login route.

## Adding a Route

1. Create the page in `src/pages/<Name>Page.jsx`.
2. Add the path to `src/constants/routes.js` (`ROUTES.foo = '/foo'`).
3. Register the route in `src/App.jsx` under the appropriate layout.
4. Add nav-link in `src/components/shared/Navbar.jsx` if user-facing.
5. Append a Playwright spec under `tests/e2e/` if the page is not trivial.
6. Update `wiki/components.md` and `wiki/log.md`.
