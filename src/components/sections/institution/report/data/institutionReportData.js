/*
 * institutionReportData.js — layout constants of the "Board of Governors report" (Figma 11.3.5 v2, ids 8914:100 … 8914:452, instances of the
 * GTH Report kit) and buildReport(), which puts the live figures of GET /institution/report into the shapes the eight page components draw.
 * Counts of 1-4 arrive as 1 and print "<5" (formatCount); a real zero is passed as the text '0' so the kit does not print it as "<5".
 */

/* ---- BLOCK 1 · shared ---- */
export const INSTITUTION_REPORT_PAGE_COUNT = 8;

/** A count for the report kit: 0 stays "0" (formatCount would print "<5"), other numbers go through formatCount. */
const zero = (n) => (n === 0 ? '0' : n);

/** The school-scale map legend: students per region (the national bins of Theme 8 count tens of thousands). */
export const INSTITUTION_MAP_BINS = [
  { label: '5 – 9', min: 5, fill: '#c1d4c4' },
  { label: '10 – 24', min: 10, fill: '#6ca271' },
  { label: '25 – 49', min: 25, fill: '#387440' },
  { label: '50 – 99', min: 50, fill: '#224626' },
  { label: '100+', min: 100, fill: '#142916' },
];
export const INSTITUTION_MAP_HIDDEN = { label: 'Fewer than 5 or none', fill: '#e4e4df' };

/** The fill of a region with `count` students (1 = the masked "<5"). */
export const fillForCount = (count) => {
  if (!count || count < 5) return INSTITUTION_MAP_HIDDEN.fill;
  let found = INSTITUTION_MAP_BINS[0];
  INSTITUTION_MAP_BINS.forEach((b) => {
    if (count >= b.min) found = b;
  });
  return found.fill;
};

/* ---- BLOCK 2 · cover, contents, opener (pages 1-3) ---- */
const BASE_COVER = {
  brand: 'Ghana Talent Hub',
  titleLines: ['Our class,', 'ready for what’s next'],
  titleTail: '',
  preparedLabel: 'Prepared for',
};

const BASE_CONTENTS = {
  vertical: 'Contents',
  inside: 'Inside this report',
  outline: 'Contents',
  sections: [
    {
      numeral: '1',
      x: 432,
      title: 'Where our students come from',
      items: ['Home regions map', 'Top regions', 'Who needs support'],
      ref: 'Page 4',
    },
    {
      numeral: '2',
      x: 598,
      title: 'What our students want',
      items: ['Career interests', 'Year groups'],
      ref: 'Page 5',
    },
    {
      numeral: '3',
      x: 764,
      title: 'How GTH works at school',
      items: ['Learn, verify,', 'get matched, earn'],
      ref: 'Page 6',
    },
    {
      numeral: '4',
      x: 930,
      title: 'Programmes and method',
      items: ['Programmes and records', 'How we count'],
      ref: 'Pages 7–8',
    },
  ],
};

const BASE_OPENER = {
  photoHeadline: ['OUR', 'CLASS'],
  eyebrow: 'Section 1  ·  Where our students come from',
  title: 'Ready for next',
  subtitle: 'A class on the national map',
};

/* ---- BLOCK 3 · where our students come from (page 4) ---- */
const BASE_REGIONS = {
  eyebrow: '01  ·  Where our students come from',
  title: 'Our students by home region',
  sub: 'Students counted on GTH by the home region on their profile. Groups under 5 are hidden.',
  legendTitle: 'Students per region',
  topTitle: 'Top regions',
  calloutEyebrow: 'Who needs support',
};

/* ---- BLOCK 4 · what our students want (page 5) ---- */
const BASE_INTERESTS = {
  eyebrow: '02  ·  What our students want',
  sub: 'Top career interests chosen by our students on GTH (each can pick up to three).',
  yearsTitle: 'Our roster by year',
};

/* ---- BLOCK 5 · how GTH works at school (page 6) ---- */
const BASE_FLOW = {
  eyebrow: '03  ·  How GTH works at school',
  title: 'Verified skills open doors',
  policyEyebrow: 'What the board can do',
};

/* ---- BLOCK 6 · programmes (page 7) ---- */
const BASE_STORIES = {
  eyebrow: '04  ·  Programmes and records',
  bigTitle: ['OUR', 'PROGRAMMES'],
};
const CASE_BG = ['#387440', '#2a5730', '#387440'];
const CASE_PHOTOS = ['school', 'office', 'graduate'];

/* ---- BLOCK 7 · how we count (page 8) ---- */
const BASE_METHOD = {
  eyebrow: '05  ·  How we count',
  title: 'Every number here is checked',
  blocks: [
    { title: 'Source', x: 48, y: 200, strong: true },
    { title: 'Privacy', x: 378, y: 200, strong: true },
    { title: 'Student', x: 48, y: 350 },
    { title: 'Placement', x: 378, y: 350 },
    { title: 'Regions', x: 48, y: 500 },
    { title: 'Limitations', x: 378, y: 500 },
  ],
  backTitle: 'Built live, every view logged',
  backText:
    'This report is built from your school’s live GTH figures each time it opens. Every view is logged in your audit log.',
};

/** The interest headline: the top interest, or a plain line when nobody picked one yet. */
const interestsTitle = (rows) =>
  rows.length ? `${rows[0].label} leads the way.` : 'No career interests picked yet.';

/** The live report: GET /institution/report (api) in the shapes of the eight pages. */
export const buildReport = (api) => {
  const school = api.school;
  const methodText = {
    Source: `The ${school} roster, and the GTH profiles, skill evidence and applications of the students counted.`,
    Privacy:
      'No student names or photos. Groups under 5 show as “<5”. Under-18s count only with a guardian’s consent.',
    Student: `On the ${school} roster, linked to a GTH account, and (under 18) with a guardian’s consent.`,
    Placement:
      'An application to an internship, job or programme moved to accepted on GTH. Places found outside GTH are not counted.',
    Regions: 'Home region from the student’s own GTH profile. Boarders count in their home region.',
    Limitations: api.method.limitations,
  };
  return {
    TITLE: api.title,
    FOOTER: api.footer,
    COVER: {
      ...BASE_COVER,
      ...api.cover,
      bigNumber: zero(api.cover.bigNumber),
      leafStat: zero(api.cover.leafStat),
    },
    CONTENTS: { ...BASE_CONTENTS, meta: api.contentsMeta },
    OPENER: { ...BASE_OPENER, body: api.opener.body, footer: api.opener.footer },
    REGIONS: {
      ...BASE_REGIONS,
      mapAlt: api.regions.mapAlt,
      regionCounts: api.regions.regionCounts,
      legend: [...INSTITUTION_MAP_BINS, INSTITUTION_MAP_HIDDEN].map((b) => ({
        swatch: b.fill,
        label: b.label,
      })),
      top: api.regions.top.map((r) => ({ ...r, value: zero(r.value) })),
      calloutText: api.regions.calloutText,
      stats: api.regions.stats.map((s) => ({ ...s, value: zero(s.value) })),
    },
    INTERESTS: {
      ...BASE_INTERESTS,
      title: interestsTitle(api.interests.rows),
      rows: api.interests.rows,
      highlightValue: api.interests.highlightValue,
      highlightText: api.interests.highlightText,
      years: api.interests.years,
      note: api.interests.note,
    },
    FLOW: {
      ...BASE_FLOW,
      sub: api.flow.sub,
      steps: api.flow.steps.map((s) => ({ ...s, value: zero(s.value) })),
      policies: api.flow.policies,
    },
    STORIES: {
      ...BASE_STORIES,
      sub: api.stories.sub,
      cases: api.stories.cases.map((c, i) => ({
        ...c,
        bg: CASE_BG[i % 3],
        photo: CASE_PHOTOS[i % 3],
        chipWidth: Math.min(160, 24 + String(c.region).length * 7),
        stats: c.stats.map((s) => ({ ...s, value: zero(s.value) })),
      })),
    },
    METHOD: {
      ...BASE_METHOD,
      sub: api.method.sub,
      blocks: BASE_METHOD.blocks.map((b) => ({ ...b, text: methodText[b.title] })),
      dataLine: api.method.dataLine,
      verifyUrl: typeof window !== 'undefined' ? `${window.location.host}/institution/report` : '',
      questions: api.method.questions,
    },
  };
};
