/*
 * Landing-site routes (Figma canvas "New Landing Page" 7797:4614).
 * The six nav links map 1:1 to the inner pages P-01..P-06. Coming Soon (CS-01..03) is its own route.
 * ⚠️ ASSUMPTION: URL slugs are not drawn in Figma — chosen to match the nav labels.
 */
export const LANDING_ROUTES = {
  home: '/',
  howItWorks: '/how-it-works',
  features: '/features',
  opportunities: '/opportunities',
  forParentsSchools: '/for-parents-schools',
  stories: '/stories',
  faq: '/faq',
  comingSoon: '/coming-soon',
  login: '/login',
  getStarted: '/get-started',
  // Sign-up entry per role for the landing CTAs. Figma draws no targets for them; the product owner chose these (2026-11-12),
  // ⚠️ ASSUMPTION until Figma links them. Talent / parent / recruiter open the role picker with that role already selected
  // (GetStartedPage reads ?role=, Figma R00 7374:904 for the recruiter); schools go to the institution sign-up (Figma 11.1.1a).
  getStartedTalent: '/get-started?role=talent',
  getStartedRecruiter: '/get-started?role=recruiter',
  institutionSignUp: '/institution/sign-up',
  institutionPortal: '/institution', // "Bring GTH to my school" for signed-in school staff (landing/shared/schoolSignUpPath.js)
  // "Invite my parent" for a signed-in talent (see components/sections/landing/shared/inviteParentPath.js)
  talentInviteParent: '/settings/guardian?state=invite',
  // A parent signing up on their own (flow A, ⚠️ still simulated: wiki/backend-integration-gaps.md)
  parentSignUp: '/get-started?role=parent',
};

/* Nav link labels are verbatim from Figma Nav 7797:9049. */
export const LANDING_NAV_LINKS = [
  { label: 'How it works', to: LANDING_ROUTES.howItWorks },
  { label: 'Features', to: LANDING_ROUTES.features },
  { label: 'Opportunities', to: LANDING_ROUTES.opportunities },
  { label: 'For parents & schools', to: LANDING_ROUTES.forParentsSchools },
  { label: 'Stories', to: LANDING_ROUTES.stories },
  { label: 'FAQ', to: LANDING_ROUTES.faq },
];
