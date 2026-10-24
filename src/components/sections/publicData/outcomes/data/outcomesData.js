import storyTamale from '../../../../../assets/public-data/outcomes/story-data-internship-tamale.jpg';
import storyVolta from '../../../../../assets/public-data/outcomes/story-nursing-scholarship-volta.jpg';
import storyAshanti from '../../../../../assets/public-data/outcomes/story-solar-apprenticeship-ashanti.jpg';

/*
 * outcomesData — mocks of GET /public/outcomes and GET /public/outcomes/trends?range= (Theme 8, 8.5 Outcomes + 8.5.2 Trends). SAMPLE DATA.
 * Shapes (the future API contract):
 *   GET /public/outcomes   → { range, kpis, placementsOverTime[{key,label,value}], placementsByType[{key,label,count}], averageMonthsToPlacement,
 *                              skills{ count, share, sources[{key,label,share,tone}] }, partners{ total, items[{key,label,count}] }, stories[...] }
 *   GET /public/outcomes/trends?range=90d|1y|all → { range, subtitle, charts[{ id, title, kind: 'line'|'column', aside, headline, delta, yTicks[], series[{label,value}],
 *                              xLabelEvery, events[{ at, label }], current }] }
 * Every talent count is printed through formatCount(); the series values are aggregates (never under 5 here).
 * ⚠️ ASSUMPTION: only the "Last 12 months" dashboard is drawn, so the three ranges of the outcomes page share the same sample figures (the range is kept
 * in the URL and in the control; the figures are not re-cut for 90 days / all time because no numbers are drawn for them).
 */

/* --- outcomes dashboard -------------------------------------------------------------------------------------------------------------- */
const MONTHS = ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
// Figma column heights (91 … 188 px of a 214px = 500 plot) converted to placements per month; the last bar is October, still filling in (439)
const PLACEMENTS_PER_MONTH = [213, 189, 287, 301, 320, 334, 341, 369, 390, 402, 430, 439];

export const OUTCOMES_COPY = {
  title: 'Platform outcomes',
  subtitle: 'What talents achieve through GTH: placements, scholarships and skills they can prove.',
  subtitleShort: 'Placements, scholarships and proven skills · last 12 months',
  ranges: [
    { id: '90d', label: 'Last 90 days' },
    { id: '1y', label: 'Last 12 months' },
    { id: 'all', label: 'All time' },
  ],
  storiesTitle: 'Stories from the platform',
  storiesSub: 'Shared with each talent’s written consent.',
  storiesLink: 'All stories →',
};

export const OUTCOMES_RESPONSE = {
  range: '1y',
  kpis: {
    placements: {
      count: 4218,
      changePct: 18,
      sub: 'Jobs, internships, training and apprenticeships · ▲ +18% vs last year.',
      subShort: '▲ +18% vs last year',
    },
    scholarships: {
      valueGhs: 2400000,
      valueText: 'GHS 2.4M',
      eligibleTalents: 1312,
      sub: 'Matched to 1,312 eligible talents.',
      subShort: '1,312 talents',
    },
    skills: {
      shareText: '38%',
      sub: 'of talents have at least one validated skill.',
      subShort: '≥1 validated skill',
    },
    organisations: {
      count: 237,
      sub: '185 education & public partners · 52 employers.',
      subShort: '185 partners · 52 employers',
    },
  },
  placementsOverTime: MONTHS.map((label, i) => ({
    key: label,
    label,
    value: PLACEMENTS_PER_MONTH[i],
  })),
  placementsByType: [
    { key: 'jobs', label: 'Jobs', count: 1640 },
    { key: 'internships', label: 'Internships', count: 1410 },
    { key: 'training', label: 'Training', count: 820 },
    { key: 'apprenticeships', label: 'Apprenticeships', count: 348 },
  ],
  averageTimeNote: 'Average time from sign-up to placement: 5.4 months',
  skills: {
    count: 83400,
    caption: 'talents with ≥1 validated skill · 38% of all',
    sourcesTitle: 'Where the evidence comes from',
    sources: [
      { key: 'assessments', label: 'Assessments', count: 61, tone: 'green' },
      { key: 'games', label: 'Skills Lab games', count: 27, tone: 'orange' },
      { key: 'certificates', label: 'Verified certificates', count: 12, tone: 'blue' },
    ],
  },
  partners: {
    total: 237,
    hint: '237 organisations',
    items: [
      { key: 'schools', label: 'Schools', count: 127 },
      { key: 'employers', label: 'Corporate employers', count: 52 },
      { key: 'universities', label: 'Universities', count: 34 },
      { key: 'ngos', label: 'NGOs', count: 18 },
      { key: 'government', label: 'Government agencies', count: 6 },
    ],
  },
};

/* --- stories ------------------------------------------------------------------------------------------------------------------------- */
export const OUTCOME_STORIES = [
  {
    id: 'ama-k',
    aliases: ['abena-a'],
    region: 'Northern',
    sector: 'Data & analytics',
    kicker: 'Northern · Data & analytics',
    title: 'From Tamale to a data internship',
    summary: 'Completed 4 Skills Lab games, matched with a telecom internship in 6 weeks.',
    photo: storyTamale,
    detail: {
      byline: 'Northern · Data & analytics · Sample story',
      consentLine: 'Shared with Abena’s written consent · last updated 2 Oct 2026',
      personName: 'Abena A.',
      body: [
        'Abena joined GTH in her final year at a senior high school in Tamale. Her interest quiz pointed to data and analytics, a field she had never tried.',
        'Over six weeks she completed four Skills Lab games, including Chart Detective and SQL Heist, which turned into two verified skills on her profile.',
        'A telecom partner searching for analysts in the Northern region found her through GTH and offered a three-month data internship in Accra. She started in August 2026.',
      ],
      timelineTitle: 'Her journey on GTH',
      timeline: [
        { when: 'May 2026', what: 'Signed up and took the interest quiz' },
        { when: 'May 2026', what: 'Completed the personality assessment' },
        { when: 'Jun 2026', what: 'Passed 4 Skills Lab games · 2 skills verified' },
        { when: 'Jul 2026', what: 'Matched with a telecom data internship' },
        { when: 'Aug 2026', what: 'Started her internship in Accra' },
      ],
      glance: [
        { label: 'Region', value: 'Northern' },
        { label: 'Education', value: 'Completed SHS' },
        { label: 'Time to placement', value: '12 weeks' },
        { label: 'Skills verified', value: 'Data visualisation · SQL basics' },
        { label: 'Placement', value: '3-month paid internship' },
      ],
      glanceShort: [
        { label: 'Time to placement', value: '12 weeks' },
        { label: 'Skills verified', value: '2' },
        { label: 'Placement', value: '3-month internship' },
      ],
      mobileIntro:
        'Abena joined GTH in her final year of senior high school in Tamale. Over six weeks she passed four Skills Lab games, and a telecom partner found her through GTH for a data internship.',
      mobileConsent: 'Shared with Abena’s written consent',
      consentNote:
        'Published with consent. Abena chose what to share and can withdraw this story at any time.',
    },
  },
  {
    id: 'volta-nursing',
    region: 'Volta',
    sector: 'Health & medical',
    kicker: 'Volta · Health & medical',
    shortKicker: 'Volta · Health',
    title: 'A scholarship for nursing school',
    summary: 'Matched to a GHS 12,000 scholarship through a partner NGO.',
    photo: storyVolta,
    detail: null,
  },
  {
    id: 'ashanti-solar',
    region: 'Ashanti',
    sector: 'Entrepreneurship',
    kicker: 'Ashanti · Entrepreneurship',
    title: 'Apprenticeship to own business',
    summary: 'Placed in a solar-installation apprenticeship, now runs a 3-person team.',
    photo: storyAshanti,
    detail: null,
  },
];

export const OUTCOME_STORY_COPY = {
  breadcrumbRoot: 'Outcomes',
  breadcrumbMid: 'Stories',
  atAGlance: 'At a glance',
  moreStories: 'More stories',
  mobileStoriesTitle: 'Stories',
  mobileStoriesHint: 'With consent',
};

/** GET /public/outcomes (mock, synchronous). */
export const getOutcomes = () => OUTCOMES_RESPONSE;
export const getOutcomeStories = () => OUTCOME_STORIES;

export const findStory = (storyId) =>
  OUTCOME_STORIES.find((s) => s.id === storyId || s.aliases?.includes(storyId)) ?? null;

/* --- trends -------------------------------------------------------------------------------------------------------------------------- */
const pts = (labels, values) => labels.map((label, i) => ({ label, value: values[i] }));
const WEEKS = Array.from({ length: 13 }, (_, i) => `W${i + 1}`);
const QUARTERS = ['Q1 25', 'Q2 25', 'Q3 25', 'Q4 25', 'Q1 26', 'Q2 26', 'Q3 26', 'Q4 26'];

// New sign-ups columns: Figma px heights over a 174px plot converted to counts (90d: 8k plot, 1y: 25k, all time: 50k)
const toCount = (heights, plot, max) =>
  heights.map((h) => Math.round(((h / plot) * max) / 10) * 10);

export const TRENDS_COPY = {
  breadcrumbRoot: 'Outcomes',
  breadcrumbCurrent: 'Growth trends',
  title: 'Growth over time',
  ranges: [
    { id: '90d', label: '90 days' },
    { id: '1y', label: '1 year' },
    { id: 'all', label: 'All time' },
  ],
  footnote:
    'Each chart has its own scale. Totals are live; the current period is still filling in and shown in a darker shade.',
};

const TRENDS = {
  '90d': {
    range: '90d',
    subtitle: 'Week by week over the last 90 days.',
    charts: [
      {
        id: 'total',
        title: 'Total talents',
        kind: 'line',
        aside: 'Cumulative',
        headline: '219,428',
        delta: '▲ +64,120 in 90 days',
        yMax: 240000,
        yStep: 60000,
        series: pts(
          WEEKS,
          [
            155300, 160800, 166100, 171800, 177400, 182500, 188200, 193500, 199400, 204600, 209800,
            214600, 219428,
          ]
        ),
      },
      {
        id: 'signups',
        title: 'New sign-ups',
        kind: 'column',
        aside: 'Per week',
        headline: '4,932',
        delta: 'this week · ▲ 12%',
        yMax: 8000,
        yStep: 2000,
        series: pts(
          WEEKS,
          toCount([92, 98, 94, 104, 100, 111, 100, 113, 102, 122, 122, 159, 107], 180, 8000)
        ),
      },
      {
        id: 'assessments',
        title: 'Assessments completed',
        kind: 'line',
        aside: 'Per week',
        headline: '8,610',
        delta: 'this week · ▲ 6%',
        yMax: 10000,
        yStep: 2500,
        series: pts(
          WEEKS,
          [6200, 6100, 6700, 7100, 6900, 7300, 7600, 7300, 7600, 7900, 7500, 8100, 8610]
        ),
        // W10 is the hovered point of frame 8.5.2b-style tooltip drawn on the 90-day frame as "W10 · 7.9k"
        hoverIndex: 9,
      },
      {
        id: 'placements',
        title: 'Placements',
        kind: 'line',
        aside: 'Per week',
        headline: '104',
        delta: 'this week · ▲ 9%',
        yMax: 120,
        yStep: 30,
        series: pts(WEEKS, [72, 76, 70, 80, 82, 85, 78, 88, 92, 90, 97, 95, 104]),
      },
    ],
  },
  '1y': {
    range: '1y',
    subtitle: 'Month by month over the last 12 months.',
    charts: [
      {
        id: 'total',
        title: 'Total talents',
        kind: 'line',
        aside: 'Cumulative',
        headline: '219,428',
        delta: '▲ +142,300 in 12 months',
        yMax: 240000,
        yStep: 60000,
        series: pts(
          MONTHS,
          [
            77128, 85500, 97800, 108900, 120400, 131800, 142900, 154600, 168300, 182400, 199800,
            219428,
          ]
        ),
      },
      {
        id: 'signups',
        title: 'New sign-ups',
        kind: 'column',
        aside: 'Per month',
        headline: '21,628',
        headlineShort: '21,628 in Oct',
        delta: 'Oct so far · ▲ 10%',
        yMax: 25000,
        yStep: 6250,
        current: true,
        series: pts(
          MONTHS,
          toCount([47, 50, 87, 79, 74, 73, 71, 81, 86, 102, 137, 151], 180, 25000)
        ),
      },
      {
        id: 'assessments',
        title: 'Assessments completed',
        kind: 'line',
        aside: 'Per month',
        headline: '34,900',
        delta: 'Oct so far · ▲ 8%',
        yMax: 40000,
        yStep: 10000,
        series: pts(
          MONTHS,
          [10200, 10600, 15900, 17600, 18400, 20100, 22400, 24300, 26000, 28200, 31400, 34900]
        ),
        hoverIndex: 8,
      },
      {
        id: 'placements',
        title: 'Placements',
        kind: 'line',
        aside: 'Per month',
        headline: '439',
        headlineShort: '439 in Oct',
        delta: 'Oct so far · ▲ 2%',
        yMax: 500,
        yStep: 125,
        series: pts(MONTHS, [222, 195, 292, 308, 325, 334, 347, 380, 398, 405, 430, 439]),
      },
    ],
  },
  all: {
    range: 'all',
    subtitle: 'Quarter by quarter since launch in January 2025.',
    charts: [
      {
        id: 'total',
        title: 'Total talents',
        kind: 'line',
        aside: 'Cumulative',
        headline: '219,428',
        delta: 'since launch',
        yMax: 240000,
        yStep: 60000,
        events: [
          { at: 2, label: 'Skills Lab launched' },
          { at: 5, label: 'Under-18 onboarding' },
        ],
        series: pts(QUARTERS, [4200, 21400, 47600, 87300, 120800, 150900, 198500, 219428]),
      },
      {
        id: 'signups',
        title: 'New sign-ups',
        kind: 'column',
        aside: 'Per quarter',
        headline: '21,628',
        delta: 'Q4 so far',
        yMax: 50000,
        yStep: 12500,
        current: true,
        series: pts(QUARTERS, toCount([29, 46, 82, 137, 120, 112, 162, 75], 180, 50000)),
      },
      {
        id: 'assessments',
        title: 'Assessments completed',
        kind: 'line',
        aside: 'Per quarter',
        headline: '34,900',
        delta: 'Q4 so far',
        yMax: 100000,
        yStep: 25000,
        events: [{ at: 2, label: 'Skills Lab launched' }],
        series: pts(QUARTERS, [0, 7500, 18200, 30500, 51000, 65800, 88400, 34900]),
      },
      {
        id: 'placements',
        title: 'Placements',
        kind: 'line',
        aside: 'Per quarter',
        headline: '439',
        delta: 'Q4 so far',
        yMax: 1400,
        yStep: 350,
        series: pts(QUARTERS, [20, 150, 380, 660, 920, 1040, 1230, 439]),
      },
    ],
  },
};

/** GET /public/outcomes/trends?range= (mock, synchronous). Unknown or missing ranges fall back to 1y (the range the phone and tablet frames draw selected). */
export const getTrends = (range) => TRENDS[range] ?? TRENDS['1y'];
export const TREND_RANGE_IDS = Object.keys(TRENDS);
