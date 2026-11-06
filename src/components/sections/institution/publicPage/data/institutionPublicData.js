/*
 * institutionPublicData.js — fixed copy of the institution page preview (Figma 11.6.1h, 8746:1675). The school's own content comes live from the
 * public endpoint GET /institution-public/:slug (backend institutionPublic.service.js): profile, aggregate counts and programmes. No student
 * records appear on this page; counts go through formatCount at the call site (1 = "<5").
 */
export const PUBLIC_PAGE_COPY = {
  hero: {
    title: 'Your institution page',
    subtitle:
      'What students, recruiters and the public see in the institution directory. No student records appear here.',
  },
  breadcrumb: ['Directory', 'Institutions'],
  impactTitle: 'Programmes through GTH',
  programmesTitle: 'Programmes on GTH',
  noProgrammes: 'No programmes published yet. Programmes you publish to your students show here.',
  reachTitle: 'Where we are',
  openTitle: 'Open programmes',
  noOpen: 'No programme is open right now.',
  all: 'See all programmes →',
  notPublic:
    'Your page goes public once your accreditation is approved and the account is not paused. Until then nobody else can see it.',
};

/** "Greater Accra" → "greater-accra" (the region ids of the Ghana map geometry). */
export const regionIdOf = (name) =>
  String(name || '')
    .toLowerCase()
    .replace(/\bregion\b/g, '')
    .trim()
    .replace(/\s+/g, '-');
