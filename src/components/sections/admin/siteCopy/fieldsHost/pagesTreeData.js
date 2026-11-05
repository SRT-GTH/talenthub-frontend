/*
 * pagesTreeData — the "Pages" tree of the Site copy editor as drawn in frames 7.8.10a-h and 7.8.7c (Public site portal): the Home page open with its six sections
 * and four more pages closed. Text from the Figma node characters. ⚠️ ASSUMPTION: mock; status chips are fixed per the frames (the list screen of builder A owns the real
 * tree); section ids follow the contract `<portal>.<page>.<section>`.
 * status: 'edited' (green check) · 'default' (grey) · 'draft' (amber "Draft changes (1)") · 'shared' (blue "Used on every page")
 */
export const PORTAL_TABS = [
  { id: 'public', label: 'Public site' },
  { id: 'talent', label: 'Talent' },
  { id: 'parent', label: 'Parent' },
  { id: 'recruiter', label: 'Recruiter' },
  { id: 'institution', label: 'Institution' },
  { id: 'emails', label: 'Emails' },
];

export const PAGES_TITLE = 'Pages';
export const PAGES_COUNT = '46 pages';

export const PUBLIC_PAGES = [
  {
    id: 'home',
    title: 'Home',
    status: 'edited',
    sections: [
      { id: 'public.home.hero', name: 'Hero', line: 'Find work that fits you', status: 'edited' },
      {
        id: 'public.home.how-it-works',
        name: 'How it works',
        line: 'Build your profile, prove your skills, get matched',
        status: 'default',
      },
      {
        id: 'public.home.features',
        name: 'Features',
        line: 'Everything you need to start your career',
        status: 'default',
      },
      {
        id: 'public.home.made-for-ghana',
        name: 'Made for Ghana',
        line: 'Built with schools, employers and families',
        status: 'edited',
      },
      {
        id: 'public.home.faq',
        name: 'FAQ',
        line: 'Questions people ask before they join',
        status: 'default',
      },
      {
        id: 'public.shared.footer',
        name: 'Footer',
        line: 'About · Help · Privacy · Terms',
        status: 'shared',
      },
    ],
  },
  { id: 'how-it-works', title: 'How it works', status: 'edited', sections: [] },
  { id: 'for-students', title: 'For students', status: 'default', sections: [] },
  { id: 'for-parents', title: 'For parents', status: 'default', sections: [] },
  { id: 'for-recruiters', title: 'For recruiters', status: 'edited', sections: [] },
];
