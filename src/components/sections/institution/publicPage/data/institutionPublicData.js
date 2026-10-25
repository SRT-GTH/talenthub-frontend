/*
 * institutionPublicData.js — MOCK data of the public institution page (Figma 11.6.1h, 8746:1675). Shaped like the future GET /institutions/:slug response.
 * Aggregates only: no student records appear on this page; counts go through formatCount at the call site. ⚠️ ASSUMPTION: all values are mock
 * (website and contact address included).
 */
export const PUBLIC_INSTITUTION = {
  slug: 'savannah-hills-shs',
  monogram: 'SH',
  type: 'Senior High School · GES accredited',
  name: 'Savannah Hills Senior High School',
  about:
    'A public senior high school in Tamale offering science, business, technical and arts programmes. On GTH since September 2026.',
  website: 'https://savannahhills.edu.gh',
  contactEmail: 'registrar@savannahhills.edu.gh',
  hero: {
    title: 'Your institution page',
    subtitle:
      'What students, recruiters and the public see in the institution directory. No student records appear here.',
  },
  breadcrumb: ['Directory', 'Institutions'],
  impact: {
    title: 'Programmes through GTH',
    hint: 'Aggregated · since October 2026',
    tiles: [
      { id: 'students', value: 847, label: 'Students on GTH' },
      { id: 'credentials', value: 312, label: 'Credentials issued' },
      { id: 'placed', value: 186, label: 'Placed after school' },
      { id: 'girls', value: '52%', label: 'Girls on the roster' },
    ],
  },
  programmes: {
    title: 'Programmes on GTH',
    hint: '3 active',
    items: [
      {
        id: 'holiday-internships',
        title: 'Form 3 Holiday Internships',
        summary: '6-week placements with local businesses',
        status: 'Open · Form 3',
      },
      {
        id: 'scholarship-2027',
        title: 'Scholarship Nominations 2027',
        summary: 'Nominations to 4 partner universities',
        status: 'Opens 1 December',
      },
      {
        id: 'coding-club',
        title: 'Coding Club Bootcamp',
        summary: '8-week coding club with Kumasi Hive',
        status: 'Applications close 30 Nov',
      },
    ],
  },
  reach: { title: 'Where we are', caption: 'Tamale · Northern Region' },
  open: {
    title: 'Open programmes',
    items: [
      {
        id: 'holiday-internships',
        title: 'Form 3 Holiday Internships',
        meta: 'Internship · closes 30 Nov',
      },
      { id: 'coding-club', title: 'Coding Club Bootcamp', meta: 'Club · closes 30 Nov' },
    ],
    all: 'See all programmes →',
  },
};
