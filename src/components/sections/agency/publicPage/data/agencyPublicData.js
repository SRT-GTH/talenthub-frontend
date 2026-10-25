/*
 * agencyPublicData.js — MOCK data of the public agency page (Figma 11.6.1i, 8611:3509). Shaped like the future GET /agencies/:slug response.
 * Aggregates only: no MoU data appears on this page; counts go through formatCount at the call site. ⚠️ ASSUMPTION: all values are mock.
 */
export const PUBLIC_AGENCY = {
  slug: 'national-youth-authority',
  monogram: 'NYA',
  type: 'Government agency',
  name: 'National Youth Authority',
  about: 'The agency that leads youth policy and programmes in Ghana. On GTH since October 2026.',
  website: 'https://nya.gov.gh',
  contactEmail: 'data@nya.gov.gh',
  hero: {
    title: 'Your agency page',
    subtitle: 'What talents and the public see in the agency directory. No MoU data appears here.',
  },
  breadcrumb: ['Directory', 'Agencies'],
  impact: {
    title: 'Programmes through GTH',
    hint: 'Aggregated · since October 2026',
    tiles: [
      { id: 'reached', value: 9870, label: 'Talents reached' },
      { id: 'applied', value: 1912, label: 'Applied to a programme' },
      { id: 'funded', value: 412, label: 'Funded or trained' },
      { id: 'women', value: '47%', label: 'Women in programmes' },
    ],
  },
  programmes: {
    title: 'Programmes on GTH',
    hint: '3 active',
    items: [
      {
        id: 'ysd-2026',
        title: 'YouthStart Digital Grant',
        summary: 'Start-up grants up to GHS 20,000 with an 8-week course',
        status: 'Open · ages 18–35',
      },
      {
        id: 'nss-2027',
        title: 'NSS Placement Matching 2027',
        summary: 'Match service personnel to host institutions',
        status: 'Opens 1 December',
      },
      {
        id: 'agri',
        title: 'Youth in Agribusiness Training',
        summary: 'Field training with inputs in Bono East, Northern and Savannah',
        status: 'Applications close 30 Nov',
      },
    ],
  },
  reach: { title: 'Where they work', caption: 'All 16 regions' },
  open: {
    title: 'Open programmes',
    items: [
      { id: 'ysd-2026', title: 'YouthStart Digital Grant', meta: 'Grant · closes 30 Nov' },
      { id: 'agri', title: 'Youth in Agribusiness Training', meta: 'Training · closes 30 Nov' },
    ],
    all: 'See all programmes →',
  },
};
