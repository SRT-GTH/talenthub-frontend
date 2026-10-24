/*
 * directoryData.js — API-shaped mock data of the Theme 8 directories (Figma 8.6.1a-c Partners, 8.6.2a-c Opportunities; sample content only).
 * Every fetch* function resolves like the future endpoints and returns { data, meta }:
 *   GET /public/partners?type&region&focus&q&page          -> fetchPartners
 *   GET /public/partners/:id                              -> fetchPartner
 *   GET /public/opportunities?type&region&closing&eligibility&q&page -> fetchOpportunities
 *   GET /public/opportunities/:id                         -> fetchOpportunity
 * Not found -> the promise rejects with { status: 404 }. The pages own loading / error states (`?state=loading|error`).
 * Counts are NEVER printed from here: components go through formatCount() / partnerReachedLabel() so the "<5" rule holds.
 */
import { REGIONS } from '../../regionsList.js';
import { formatCount, isSuppressed } from '../../publicDataFormat.js';

/* ------------------------------------------------------------------ filter vocabularies */

export const PARTNER_TYPES = [
  { id: 'ngo', label: 'NGO' },
  { id: 'employer', label: 'Employer' },
  { id: 'school', label: 'School' },
  { id: 'university', label: 'University' },
  { id: 'government', label: 'Gov. agency' },
];

export const OPPORTUNITY_TYPES = [
  { id: 'job', label: 'Job' },
  { id: 'internship', label: 'Internship' },
  { id: 'scholarship', label: 'Scholarship' },
  { id: 'training', label: 'Training' },
  { id: 'apprenticeship', label: 'Apprenticeship' },
];

/** Pill colours per type, read from the Figma pills (fill / text). */
export const TYPE_STYLES = {
  ngo: { bg: '#faf4e8', fg: '#785910' },
  employer: { bg: '#f2f2ee', fg: '#575755' },
  school: { bg: '#ebf1ec', fg: '#2a5730' },
  university: { bg: '#eaeffb', fg: '#244a9f' },
  government: { bg: '#f5f3ff', fg: '#5b21b6' },
  job: { bg: '#ebf1ec', fg: '#2a5730' },
  internship: { bg: '#eaeffb', fg: '#244a9f' },
  scholarship: { bg: '#faf4e8', fg: '#785910' },
  training: { bg: '#f5f3ff', fg: '#5b21b6' },
  apprenticeship: { bg: '#f2f2ee', fg: '#575755' },
};

export const REGION_OPTIONS = REGIONS.map((r) => ({ id: r.id, label: r.name }));

export const FOCUS_OPTIONS = [
  'Apprenticeships',
  'Agriculture',
  'Career guidance',
  'Coding',
  'Creative arts',
  'Design',
  'Digital skills',
  'Engineering',
  'Entrepreneurship',
  'Girls in STEM',
  'Grants',
  'Health',
  'Internships',
  'Literacy',
  'Mentoring',
  'Programmes',
  'Scholarships',
  'Trades',
  'TVET',
].map((label) => ({ id: label.toLowerCase().replace(/\s+/g, '-'), label }));

/** ⚠️ ASSUMPTION: the "Deadline" menu is not drawn; its options follow the drawn "closing this month" filter. */
export const CLOSING_OPTIONS = [
  { id: 'month', label: 'This month' },
  { id: 'next', label: 'Next month' },
  { id: 'later', label: 'Later' },
  { id: 'rolling', label: 'Rolling intake' },
];

/** ⚠️ ASSUMPTION: the "Eligibility" menu is not drawn; options are the education levels the sample rows mention. */
export const ELIGIBILITY_OPTIONS = [
  { id: 'any-education', label: 'Any education' },
  { id: 'shs', label: 'SHS completed' },
  { id: 'in-tertiary', label: 'In-tertiary' },
  { id: 'post-tertiary', label: 'Post-tertiary' },
  { id: 'no-experience', label: 'No prior experience' },
];

export const labelOf = (options, id) => options.find((o) => o.id === id)?.label ?? null;

/* ------------------------------------------------------------------ partners */

// BLOCK partners (Figma 8498:9 list, 8498:324 filtered, 8498:486 detail)
const slug = (s) => s.toLowerCase().replace(/\s+/g, '-');
const focusOf = (labels) => labels.map(slug);

export const PARTNERS = [
  {
    id: 'northern-skills-foundation',
    aliases: ['ghana-code-club'],
    name: 'Northern Skills Foundation',
    monogram: 'NS',
    color: '#387440',
    type: 'ngo',
    regionIds: ['northern', 'savannah', 'north-east'],
    regionLabel: 'Northern · Savannah · North East',
    focus: ['Digital skills', 'Girls in STEM'],
    reached: 2400,
    summary:
      'Digital skills and STEM clubs for young people across the three northern regions. Partner since March 2025.',
    summaryShort:
      'Digital skills and STEM clubs across the three northern regions. Partner since March 2025.',
    website: 'https://example.org/northern-skills-foundation',
    impact: { reached: 2400, completed: 1180, placed: 214, girlsPct: 56, since: 'March 2025' },
    programmes: [
      {
        id: 'code-clubs-north',
        title: 'Code Clubs North',
        blurb: 'Weekly after-school coding clubs in 40 schools',
        status: 'Open · ages 14–19',
        statusShort: 'Open · ages 14–19',
      },
      {
        id: 'girls-in-data',
        title: 'Girls in Data',
        blurb: '12-week data skills bootcamp with mentoring',
        status: 'Applications close 15 Nov',
        statusShort: 'Closes 15 Nov',
      },
      {
        id: 'solar-tech-apprentices',
        title: 'Solar Tech Apprentices',
        blurb: 'Paid apprenticeships with installers in Tamale',
        status: 'Opens January 2027',
        statusShort: 'Opens Jan 2027',
      },
    ],
  },
  {
    id: 'accra-girls-code-club',
    name: 'Accra Girls Code Club',
    monogram: 'AG',
    color: '#2a78d6',
    type: 'ngo',
    regionIds: ['greater-accra'],
    regionLabel: 'Greater Accra',
    focus: ['Coding', 'Mentoring'],
    reached: 1100,
  },
  {
    id: 'volta-health-scholars-trust',
    name: 'Volta Health Scholars Trust',
    monogram: 'VH',
    color: '#eb6834',
    type: 'ngo',
    regionIds: ['volta', 'oti'],
    regionLabel: 'Volta · Oti',
    focus: ['Scholarships', 'Health'],
    reached: 640,
  },
  {
    id: 'kumasi-makers-hub',
    name: 'Kumasi Makers Hub',
    monogram: 'KM',
    color: '#6250d6',
    type: 'employer',
    regionIds: ['ashanti'],
    regionLabel: 'Ashanti',
    focus: ['Internships', 'Engineering'],
    reached: 380,
  },
  {
    id: 'coastal-agritech-cooperative',
    name: 'Coastal Agritech Cooperative',
    monogram: 'CA',
    color: '#224626',
    type: 'employer',
    regionIds: ['central', 'western'],
    regionLabel: 'Central · Western',
    focus: ['Apprenticeships', 'Agriculture'],
    reached: 290,
  },
  {
    id: 'bono-technical-institute',
    name: 'Bono Technical Institute',
    monogram: 'BT',
    color: '#2a78d6',
    type: 'school',
    regionIds: ['bono', 'bono-east'],
    regionLabel: 'Bono · Bono East',
    focus: ['TVET', 'Trades'],
    reached: 1650,
  },
  {
    id: 'ridge-view-senior-high',
    name: 'Ridge View Senior High',
    monogram: 'RV',
    color: '#387440',
    type: 'school',
    regionIds: ['greater-accra'],
    regionLabel: 'Greater Accra',
    focus: ['Career guidance'],
    reached: 920,
  },
  {
    id: 'national-youth-skills-office',
    name: 'National Youth Skills Office',
    monogram: 'NY',
    color: '#2a78d6',
    type: 'government',
    regionIds: ['all'],
    regionLabel: 'All 16 regions',
    focus: ['Programmes', 'Grants'],
    reached: 12000,
  },
  {
    id: 'cape-coast-college-of-design',
    name: 'Cape Coast College of Design',
    monogram: 'CC',
    color: '#eb6834',
    type: 'university',
    regionIds: ['central'],
    regionLabel: 'Central',
    focus: ['Creative arts', 'Design'],
    reached: 510,
  },
  {
    id: 'tamale-youth-futures',
    name: 'Tamale Youth Futures',
    monogram: 'TY',
    color: '#2a78d6',
    type: 'ngo',
    regionIds: ['northern'],
    regionLabel: 'Northern',
    focus: ['Mentoring', 'Entrepreneurship'],
    reached: 310,
  },
  {
    id: 'savannah-learning-network',
    name: 'Savannah Learning Network',
    monogram: 'SL',
    color: '#387440',
    type: 'ngo',
    regionIds: ['northern', 'savannah'],
    regionLabel: 'Northern · Savannah',
    focus: ['Literacy', 'Digital skills'],
    reached: 720,
  },
];
// END BLOCK partners

export const PARTNERS_TOTAL = 185; // sample: the whole directory the list pages through (Figma "185 partners")
export const PARTNER_PAGE_SIZE = 9;
export const PARTNER_PAGES = 21;

/** "2,400+" — counts go through formatCount; a suppressed count never gets a "+". */
export const partnerReachedLabel = (n) => (isSuppressed(n) ? formatCount(n) : `${formatCount(n)}+`);

/* ------------------------------------------------------------------ opportunities */

// BLOCK opportunities (Figma 8498:349008 list, 8498:349179 filtered, 8498:349295 detail)
export const OPPORTUNITIES = [
  {
    id: 'junior-data-analyst',
    title: 'Junior data analyst',
    partnerId: 'kumasi-makers-hub',
    partnerName: 'Kumasi Makers Hub',
    type: 'job',
    regionIds: ['ashanti'],
    regionLabel: 'Ashanti',
    eligibility: 'Post-tertiary · 18–30',
    eligibilityIds: ['post-tertiary'],
    closes: 'Closes 30 Nov',
    closesMonth: 'month',
    closingSoon: false,
  },
  {
    id: 'girls-in-data-bootcamp',
    aliases: ['intro-to-coding'],
    title: 'Girls in Data bootcamp',
    partnerId: 'northern-skills-foundation',
    partnerName: 'Northern Skills Foundation',
    type: 'training',
    regionIds: ['northern'],
    regionLabel: 'Northern',
    eligibility: 'Women 16–24 · any education',
    eligibilityIds: ['any-education'],
    closes: 'Closes 15 Nov',
    closesMonth: 'month',
    closingSoon: true,
    detail: {
      posted: 'Posted 3 Oct 2026',
      closesLong: 'Closes 15 Nov 2026 · 29 days left',
      closesShort: 'Closes 15 Nov · 29 days left',
      location: 'Tamale · Northern',
      locationShort: 'Tamale',
      format: 'Part-time · Saturdays',
      cost: 'Free',
      places: 40,
      summary:
        'A free 12-week, part-time bootcamp in Tamale for young women who want to work with data. Covers spreadsheets, SQL and dashboards, with a mentor from a partner company.',
      summaryShort:
        'A free 12-week, part-time bootcamp for young women who want to work with data: spreadsheets, SQL and dashboards, with a mentor.',
      who: [
        'Women aged 16–24 living in Northern, Savannah or North East',
        'No prior experience needed; basic smartphone or computer use',
        'Able to attend Saturday sessions in Tamale',
      ],
      whoShort: [
        'Women aged 16–24 in the north',
        'No prior experience needed',
        'Saturday sessions in Tamale',
      ],
      gets: [
        'Laptop access and data bundle for the 12 weeks',
        'A mentor and a verified “Data basics” skill on your GTH profile',
        'Priority for partner internships after the bootcamp',
      ],
    },
  },
  {
    id: 'nursing-scholarship-2027',
    title: 'Nursing scholarship 2027',
    partnerId: 'volta-health-scholars-trust',
    partnerName: 'Volta Health Scholars Trust',
    type: 'scholarship',
    regionIds: ['volta', 'oti'],
    regionLabel: 'Volta · Oti',
    eligibility: 'In-tertiary · nursing',
    eligibilityIds: ['in-tertiary'],
    closes: 'Closes 10 Dec',
    closesMonth: 'next',
    closingSoon: false,
  },
  {
    id: 'solar-installation-apprentice',
    title: 'Solar installation apprentice',
    partnerId: 'coastal-agritech-cooperative',
    partnerName: 'Coastal Agritech Cooperative',
    type: 'apprenticeship',
    regionIds: ['central'],
    regionLabel: 'Central',
    eligibility: '18–25 · SHS completed',
    eligibilityIds: ['shs'],
    closes: 'Closes 5 Dec',
    closesMonth: 'next',
    closingSoon: false,
  },
  {
    id: 'product-design-intern',
    title: 'Product design intern',
    partnerId: 'accra-girls-code-club',
    partnerName: 'Accra Girls Code Club',
    type: 'internship',
    regionIds: ['greater-accra'],
    regionLabel: 'Greater Accra',
    eligibility: 'In-tertiary · design',
    eligibilityIds: ['in-tertiary'],
    closes: 'Closes 22 Nov',
    closesMonth: 'month',
    closingSoon: true,
  },
  {
    id: 'tvet-welding-certificate',
    title: 'TVET welding certificate',
    partnerId: 'bono-technical-institute',
    partnerName: 'Bono Technical Institute',
    type: 'training',
    regionIds: ['bono'],
    regionLabel: 'Bono',
    eligibility: '15+ · no prior experience',
    eligibilityIds: ['no-experience'],
    closes: 'Rolling intake',
    closesMonth: 'rolling',
    closingSoon: false,
  },
  {
    id: 'youth-enterprise-grant',
    title: 'Youth enterprise grant',
    partnerId: 'national-youth-skills-office',
    partnerName: 'National Youth Skills Office',
    type: 'scholarship',
    regionIds: ['all'],
    regionLabel: 'All regions',
    eligibility: '18–35 · business idea',
    eligibilityIds: ['any-education'],
    closes: 'Closes 31 Jan',
    closesMonth: 'later',
    closingSoon: false,
  },
  {
    id: 'digital-marketing-short-course',
    title: 'Digital marketing short course',
    partnerId: 'accra-girls-code-club',
    partnerName: 'Accra Girls Code Club',
    type: 'training',
    regionIds: ['greater-accra'],
    regionLabel: 'Greater Accra',
    eligibility: '18–28 · any education',
    eligibilityIds: ['any-education'],
    closes: 'Closes 28 Nov',
    closesMonth: 'month',
    closingSoon: false,
  },
  {
    id: 'club-facilitator-part-time',
    title: 'Club facilitator (part-time)',
    partnerId: 'northern-skills-foundation',
    partnerName: 'Northern Skills Foundation',
    type: 'job',
    regionIds: ['northern'],
    regionLabel: 'Northern',
    eligibility: 'Post-tertiary',
    eligibilityIds: ['post-tertiary'],
    closes: 'Closes 30 Nov',
    closesMonth: 'month',
    closingSoon: false,
    unlisted: true, // only shown on the partner page (Figma 8498:486 "Open opportunities")
  },
];
// END BLOCK opportunities

export const OPPORTUNITIES_TOTAL = 142; // sample: "142 open opportunities"
export const OPPORTUNITY_PAGE_SIZE = 7;
export const OPPORTUNITY_PAGES = 21;

/* ------------------------------------------------------------------ mock endpoints */

const DELAY_MS = 180;
const later = (fn) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(fn());
      } catch (e) {
        reject(e);
      }
    }, DELAY_MS);
  });

const matchesText = (haystack, q) => {
  const needle = q.trim().toLowerCase();
  return !needle || haystack.some((h) => h.toLowerCase().includes(needle));
};

const regionMatches = (item, region) =>
  !region || item.regionIds.includes(region) || item.regionIds.includes('all');

/** Pages through the sample cyclically when the directory is unfiltered (the sample is smaller than the 185 / 142 totals). */
const pageOf = (list, page, size) => {
  if (list.length <= size) return list;
  const start = ((page - 1) * size) % list.length;
  return Array.from({ length: size }, (_, i) => list[(start + i) % list.length]);
};

export const fetchPartners = ({ type, region, focus, q = '', page = 1 } = {}) =>
  later(() => {
    const filtered = PARTNERS.filter(
      (p) =>
        (!type || p.type === type) &&
        regionMatches(p, region) &&
        (!focus || focusOf(p.focus).includes(focus)) &&
        matchesText([p.name, ...p.focus, p.regionLabel], q)
    );
    const unfiltered = !type && !region && !focus && !q.trim();
    const total = unfiltered ? PARTNERS_TOTAL : filtered.length;
    const pages = unfiltered ? PARTNER_PAGES : Math.max(1, Math.ceil(total / PARTNER_PAGE_SIZE));
    const current = Math.min(Math.max(1, Number(page) || 1), pages);
    const items = unfiltered
      ? pageOf(filtered, current, PARTNER_PAGE_SIZE)
      : filtered.slice((current - 1) * PARTNER_PAGE_SIZE, current * PARTNER_PAGE_SIZE);
    return { data: { items, total, page: current, pages, pageSize: PARTNER_PAGE_SIZE }, meta: {} };
  });

export const fetchPartner = (id) =>
  later(() => {
    const partner = PARTNERS.find((p) => p.id === id || p.aliases?.includes(id));
    if (!partner) throw Object.assign(new Error('Partner not found'), { status: 404 });
    const opportunities = OPPORTUNITIES.filter((o) => o.partnerId === partner.id);
    return { data: { partner, opportunities }, meta: {} };
  });

export const fetchOpportunities = ({ type, region, closing, eligibility, q = '', page = 1 } = {}) =>
  later(() => {
    const filtered = OPPORTUNITIES.filter(
      (o) =>
        !o.unlisted &&
        (!type || o.type === type) &&
        regionMatches(o, region) &&
        (!closing || o.closesMonth === closing) &&
        (!eligibility || o.eligibilityIds.includes(eligibility)) &&
        matchesText([o.title, o.partnerName, o.regionLabel, o.eligibility], q)
    );
    const unfiltered = !type && !region && !closing && !eligibility && !q.trim();
    const total = unfiltered ? OPPORTUNITIES_TOTAL : filtered.length;
    const pages = unfiltered
      ? OPPORTUNITY_PAGES
      : Math.max(1, Math.ceil(total / OPPORTUNITY_PAGE_SIZE));
    const current = Math.min(Math.max(1, Number(page) || 1), pages);
    const items = unfiltered
      ? pageOf(filtered, current, OPPORTUNITY_PAGE_SIZE)
      : filtered.slice((current - 1) * OPPORTUNITY_PAGE_SIZE, current * OPPORTUNITY_PAGE_SIZE);
    return {
      data: { items, total, page: current, pages, pageSize: OPPORTUNITY_PAGE_SIZE },
      meta: {},
    };
  });

export const fetchOpportunity = (id) =>
  later(() => {
    const opportunity = OPPORTUNITIES.find((o) => o.id === id || o.aliases?.includes(id));
    if (!opportunity) throw Object.assign(new Error('Opportunity not found'), { status: 404 });
    const partner = PARTNERS.find((p) => p.id === opportunity.partnerId) ?? null;
    return { data: { opportunity, partner }, meta: {} };
  });
