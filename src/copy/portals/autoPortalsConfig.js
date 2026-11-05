/*
 * autoPortalsConfig — which data files feed the automatic Site copy sections (copy/autoCopy.js), how their paths map to portals and
 * pages, which exports the hand-made sections already own (so nothing is bound twice), and where each portal's preview opens.
 * The glob lists themselves live in autoPortalsAdmin.js (eager, admin only) and autoPortalsRuntime.js (lazy, pages); keep them alike.
 */

// path after "components/" → [portal, page name] (null page: the first sub-folder names the page)
export const AUTO_ROOTS = {
  'sections/talentAssessment/': ['talent', 'assessment'],
  'sections/talentCommunity/': ['talent', 'community'],
  'sections/talentHome/': ['talent', 'home'],
  'sections/talentJobs/': ['talent', 'jobs'],
  'sections/talentLearning/': ['talent', 'learning'],
  'sections/talentMessages/': ['talent', 'messages'],
  'sections/talentProfile/': ['talent', 'profile'],
  'sections/talentSettings/': ['talent', 'settings'],
  'sections/talentSkillsLab/': ['talent', 'skills-lab'],
  'sections/talentStreak/': ['talent', 'streak'],
  'sections/talentWallet/': ['talent', 'wallet'],
  'sections/parent/': ['parent', null],
  'sections/institution/': ['institution', null],
  'sections/agency/': ['government', null],
};

// data file name → exports a hand-made section already binds (copy/portals/*Copy.js)
export const AUTO_EXCLUDE = {
  'talentShellData.js': ['TALENT_NAV_MAIN', 'TALENT_NAV_SECONDARY', 'TALENT_NAV_WALLET'],
  'talentHomeCoreData.js': ['BUDDY_INTRO', 'FIRST_QUESTS', 'UNLOCKS', 'EXPLORE', 'HOME_TAB_ITEMS'],
  'assessmentData.js': ['OVERVIEW_PAGE'],
  'messagesData.js': ['MESSAGES_COPY'],
  'walletData.js': ['WALLET_COPY'],
  'walletCyclesData.js': ['CYCLES_HERO'],
  'talentLearningHubData.js': ['HEADER'],
  'talentLearningExploreData.js': ['EXPLORE_HEADER'],
  'talentSettingsAData.js': ['SETTINGS_NAV'],
  'parentCoreData.js': ['NAV_MAIN', 'NAV_SECONDARY'],
  'parentHomeData.js': ['QUICK_ACTIONS', 'HOME_TABS', 'OFFLINE'],
  'institutionHomeData.js': [
    'HOME_HERO',
    'QUICK_ACTIONS',
    'READINESS_CARD',
    'NEXT_STEP',
    'GLANCE',
    'MOBILE_HOME',
  ],
  'agencyHomeData.js': [
    'HOME_HERO',
    'QUICK_ACTIONS',
    'NATIONAL_SNAPSHOT',
    'MONTH_STATS',
    'NEXT_STEP',
    'LIMIT_CARDS',
    'MOBILE_HOME',
  ],
  'demandData.js': ['HERO_SUBTITLE'],
};

// Where Preview opens: `<portal>.<page>` → that page's route, `<portal>` → the portal's home (pages without a route of their own:
// dialogs, shared parts, onboarding).
const routes = (portal, base, pages) =>
  Object.fromEntries(
    Object.entries(pages).map(([page, route]) => [`${portal}.${page}`, { path: `${base}${route}` }])
  );

export const AUTO_PREVIEW = {
  talent: { path: '/home' },
  parent: { path: '/parent' },
  institution: { path: '/institution' },
  government: { path: '/agency' },
  ...routes('talent', '', {
    assessment: '/my-assessment',
    community: '/community',
    home: '/home',
    jobs: '/job-postings',
    learning: '/learning',
    messages: '/messages',
    profile: '/profile',
    settings: '/settings',
    'skills-lab': '/skills-lab',
    streak: '/streak',
    wallet: '/wallet',
  }),
  ...routes('parent', '/parent', {
    wards: '/wards',
    review: '/review',
    evaluate: '/evaluate',
    wallets: '/wallets',
    notifications: '/notifications',
    settings: '/settings',
    help: '/help',
    link: '/link-ward',
  }),
  ...routes('institution', '/institution', {
    credentials: '/credentials',
    messages: '/messages',
    programmes: '/programmes',
    progress: '/progress',
    'public-page': '/public-page',
    records: '/records',
    report: '/report',
    roster: '/roster',
    settings: '/settings',
  }),
  ...routes('government', '/agency', {
    briefing: '/briefing',
    'data-requests': '/data-requests',
    demand: '/demand',
    districts: '/districts',
    national: '/national',
    programmes: '/programmes',
    'public-page': '/public-page',
    queries: '/queries',
    report: '/report',
    settings: '/settings',
  }),
};
