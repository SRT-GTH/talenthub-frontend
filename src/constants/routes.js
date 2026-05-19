/**
 * Centralized route paths. Reference these everywhere instead of string literals
 * so renames are mechanical.
 *
 * Onboarding paths are namespaced by entity type — currently only `talent`,
 * but the layout reserves space for `/onboarding/recruiter/*`,
 * `/onboarding/parent/*`, etc. when those flows ship. Constant names are
 * kept short (no `talent` infix) to minimise churn at call sites; we'll
 * rename to `talentOnboarding*` if/when a second entity type lands and
 * the ambiguity actually bites.
 */
export const ROUTES = {
  home: '/',
  components: '/components',

  // Public auth + onboarding entry.
  login: '/login',
  // Role-selection screen (Talent / Parent-Guardian / Company-Recruiter cards).
  // Maps to US-1.1.1-00 ("Choose role"); served by GetStartedPage.
  getStarted: '/get-started',

  // Talent onboarding flow (post-role-selection). Order mirrors the keys in
  // src/components/shared/onboardingSteps.js so OnboardingHeader can compute
  // completed vs upcoming purely from the URL.
  // Maps to US-1.1.1-00b ("Welcome / Here's what happens next").
  onboardingWelcome: '/onboarding/talent/welcome',
  // Maps to US-1.1.1-01 ("Start Self-Onboarding and Choose Age Path").
  onboardingDob: '/onboarding/talent/dob',
  // Maps to US-1.1.1-02 ("Capture Talent Personal Information").
  onboardingPersonalInfo: '/onboarding/talent/personal-info',
  // Maps to US-1.1.1-03 ("Capture Talent Contact Information").
  onboardingContact: '/onboarding/talent/contact',
  // Maps to US-1.1.1-04 ("Capture Talent Address").
  onboardingAddress: '/onboarding/talent/address',
  // Maps to US-1.1.1-05 ("Capture Talent Education").
  onboardingEducation: '/onboarding/talent/education',
  // Maps to US-1.1.1-06 ("Capture Parent/Guardian contact") — below-18 only.
  // Adult talents skip from /education straight to /review.
  onboardingParentInfo: '/onboarding/talent/parent-info',
  // Maps to US-1.1.1-07 ("Review onboarding data and accept terms").
  onboardingReview: '/onboarding/talent/review',

  // admin: '/admin', // reserved — populated when the admin subsystem lands
};
