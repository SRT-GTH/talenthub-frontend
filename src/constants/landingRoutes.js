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
