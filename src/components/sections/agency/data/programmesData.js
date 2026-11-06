import { REGIONS } from '../../publicData/regionsList.js';

/*
 * programmesData.js — copy, option lists and builders of the agency programmes (Figma 11.5.2a-k, canvas 8605:395409).
 * The data itself comes from the server (agency.api.js): GET/POST/PATCH /agency/programmes, POST /agency/programmes/audience,
 * GET /agency/programmes/insights, POST /agency/programmes/:id/publish|close|duplicate, GET /agency/programmes/:id/applicants.
 * Templates are starting points only (they prefill the form). Counts under 5 are printed "<5" by the components (formatCount).
 *
 * BLOCK 1 programmes   BLOCK 2 templates   BLOCK 3 eligibility rules + audience   BLOCK 4 supply insights
 * BLOCK 5 talent preview + published   BLOCK 6 applicant pipeline
 */

/* ===== BLOCK 1 · programmes (Figma 11.5.2e / f) ======================================================================= */

export const PROGRAMME_TABS = [
  { id: 'programmes', label: 'Your programmes' },
  { id: 'templates', label: 'Templates' },
  { id: 'apply', label: 'Who can apply' },
];

export const PROGRAMME_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'live', label: 'Live' },
  { id: 'draft', label: 'Draft' },
  { id: 'closed', label: 'Closed' },
];

export const ACTION_MENU = [
  { id: 'edit', label: 'Edit programme' },
  { id: 'duplicate', label: 'Duplicate' },
  { id: 'close', label: 'Close programme', danger: true },
];

/** The Close dialog sentence takes the applicant count of the programme (Figma: "Your 1,912 applicants ..."). */
export const closeSentence = (count) =>
  `Talents can’t apply once it’s closed. Your ${new Intl.NumberFormat('en-GH').format(count)} applicants and their stages stay as they are. Closing is logged under the MoU.`;

/* ===== BLOCK 2 · templates (Figma 11.5.2g) ============================================================================= */

export const TEMPLATE_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'grants', label: 'Grants' },
  { id: 'service', label: 'National service' },
  { id: 'training', label: 'Training' },
  { id: 'employment', label: 'Employment' },
  { id: 'events', label: 'Events' },
  { id: 'internships', label: 'Internships' },
];

export const TEMPLATES = [
  {
    id: 'youthstart-grant',
    title: 'YouthStart grant',
    group: 'grants',
    badge: 'Grant',
    length: '8-week course',
    blurb: 'Start-up grant with a short course and pitch day.',
    foot: 'Last used 2 days ago',
    icon: 'code',
    tile: { bg: 'bg-[#f3f8f4]', fg: 'text-[#2a5730]' },
  },
  {
    id: 'skills-training',
    title: 'Skills training',
    group: 'training',
    badge: 'Training',
    length: '8–12 weeks',
    blurb: 'Regional training with stipend, schedule and certificate fields.',
    foot: 'Popular Choice',
    icon: 'megaphone',
    tile: { bg: 'bg-[#ffddb6]', fg: 'text-[#633e00]' },
  },
  {
    id: 'nss-placement',
    title: 'National service placement',
    group: 'service',
    badge: 'NSS',
    length: '6–12 months',
    blurb: 'Match service personnel to host institutions by region.',
    foot: '4 variants',
    icon: 'service',
    tile: { bg: 'bg-[#c1e9c9]', fg: 'text-[#43664d]' },
  },
  {
    id: 'agribusiness-training',
    title: 'Agribusiness training',
    group: 'training',
    badge: 'Agriculture',
    length: '3–6 months',
    blurb: 'Field training with inputs and a cooperative.',
    foot: 'Updated Q3 2026',
    icon: 'hat',
    tile: { bg: 'bg-[#eae8e2]', fg: 'text-[#404941]' },
  },
  {
    id: 'job-fair',
    title: 'Regional job fair',
    group: 'events',
    badge: 'Events',
    length: '1 day',
    blurb: 'District job fairs and info sessions with RSVP.',
    foot: 'New',
    icon: 'palette',
    tile: { bg: 'bg-[#1f6b3f]', fg: 'text-[#9de9b2]' },
  },
];

/* ===== BLOCK 3 · eligibility rules + audience (Figma 11.5.2a / h / i) ================================================ */

export const AGE_RANGES = [
  { id: '18-35', label: '18–35', factor: 1 },
  { id: '18-24', label: '18–24', factor: 0.55 },
  { id: '25-35', label: '25–35', factor: 0.45 },
];

export const SKILL_OPTIONS = [
  'Digital marketing',
  'Web design',
  'Bookkeeping',
  'Data analysis',
  'Graphic design',
  'Customer service',
  'Basic coding',
];

export const READINESS_STEPS = [
  { months: 1, label: 'Ready in 1 month', factor: 0.5 },
  { months: 2, label: 'Ready in 2 months', factor: 0.8 },
  { months: 3, label: 'Ready in 3 months', factor: 1 },
  { months: 6, label: 'Ready in 6 months', factor: 1.3 },
];

export const DEFAULT_RULES = {
  ageOn: true,
  age: '18-35',
  skillsOn: false,
  skills: [],
  regionOn: false,
  regions: [],
  readinessOn: false,
  readiness: 3,
  under18: false,
};

export const REGION_CHOICES = REGIONS.map((r) => ({ id: r.id, label: r.name }));

/** Under 5 matching talents (or the audience not loaded yet) blocks "Save and continue": groups under 5 can’t be targeted. */
export const audienceBlocked = (audience) =>
  !audience || audience.matchSuppressed || audience.match < 5;

/** The sentence under the stars. */
export const audienceNote = (audience, formatCount) =>
  audienceBlocked(audience)
    ? `Only ${formatCount(audience.match)} talents match these rules. Groups under 5 can’t be targeted. Widen the age range or add a region.`
    : `About ${formatCount(audience.match)} talents will see this programme in their feed.`;

/** The contact-details rule the server applies at publish (agencyProgrammes.service.js POLICY): phone numbers, emails, links. */
const CONTACT_RULES = [
  { re: /(\+?233|0)[\s-]?\d{2}[\s-]?\d{3}[\s-]?\d{3,4}/g, what: 'a phone number' },
  { re: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, what: 'an email address' },
  { re: /(https?:\/\/|www\.)\S+/gi, what: 'a web link' },
];

/** The first contact detail in the text, masked ("030 •••• 412"), or null. */
export const findContactDetails = (text = '') => {
  for (const rule of CONTACT_RULES) {
    const m = String(text).match(new RegExp(rule.re.source, rule.re.flags.replace('g', '')));
    if (m) {
      const hit = m[0];
      return {
        what: rule.what,
        masked: hit.length > 6 ? `${hit.slice(0, 3)} •••• ${hit.slice(-3)}` : '••••',
      };
    }
  }
  return null;
};

/** The text with every contact detail removed. */
export const stripContactDetails = (text = '') =>
  CONTACT_RULES.reduce((acc, rule) => acc.replace(rule.re, ''), String(text))
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

/* ===== BLOCK 5 · talent preview + published (Figma 11.5.2b / c) ======================================================== */

const fmtDay = (v) =>
  v
    ? new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(new Date(v))
    : null;

/**
 * The talent-preview content of one programme (GET /agency/programmes/:id → { title, place, kind, form, agency }).
 * Only what the programme says is shown; the talent-specific parts (match, "good to have") are drawn as the preview's frame.
 */
export const buildPreview = (p) => {
  const f = p?.form ?? {};
  const skills = (f.rules?.skillsOn ? f.rules.skills : []) ?? [];
  const lines = String(f.description || '')
    .split(/\n+/)
    .map((l) => l.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean);
  return {
    agency: p?.agency?.name || 'Your agency',
    agencyLine: `Agency · ${p?.place || 'National'}`,
    agencyBadge: 'Government agency · MoU active',
    sticker: p?.status === 'live' ? 'Live' : 'Preview',
    title: p?.title || 'Untitled programme',
    chips: [
      { id: 'where', text: p?.place || 'National' },
      { id: 'what', text: p?.kind || 'Government programme' },
      f.amount
        ? { id: 'pay', text: `Up to GHS ${new Intl.NumberFormat('en-GH').format(f.amount)}` }
        : null,
      f.deadline ? { id: 'closes', text: `Closes ${fmtDay(f.deadline)}` } : null,
    ].filter(Boolean),
    hint: 'Takes 1 minute. You’ll preview what they see first.',
    about: {
      title: 'About the programme',
      intro: lines[0] || 'No description yet. Add one in Back to editing.',
      bullets: lines.slice(1, 7),
    },
    good: {
      title: 'Good to have',
      summary: skills.length
        ? `${skills.length} skill${skills.length === 1 ? '' : 's'}`
        : 'No skills set',
      items: skills.map((s) => ({ id: s, text: s })),
      missing: null,
    },
    match: {
      pct: null,
      label: 'Your match',
      note: 'Each talent sees their own match, worked out from their profile against these rules.',
      rows: [
        { id: 'skills', label: 'Skills', value: skills.length ? `${skills.length} asked` : 'Any' },
        {
          id: 'education',
          label: 'Age',
          value: f.rules?.ageOn === false ? 'Any' : (f.rules?.age || '18-35').replace('-', '–'),
        },
        { id: 'region', label: 'Region', value: p?.place || 'National' },
      ],
    },
    runner: {
      heading: 'WHO’S RUNNING IT',
      name: p?.agency?.name || 'Your agency',
      role: 'Government agency on GTH',
      reply: 'Replies through GTH messages',
    },
  };
};

export const PUBLISHED = {
  sticker: 'Live now',
  title: 'Programme published!',
  body: (count, title = 'this programme') =>
    `${count} matched talents will see ${title} in their feed today.`,
  next: [
    'Applicants land in your pipeline',
    'Each talent is told when you move their application',
    'Close it any time from Programmes',
  ],
  back: 'Back to programmes',
  view: 'View applicants',
};

/* ===== BLOCK 6 · applicant pipeline (Figma 11.5.2d) ==================================================================== */

/** Names stay masked until the talent accepts an invite (first name + initial only). */
export const PIPELINE_COLUMNS = [
  { id: 'applied', label: 'Applied' },
  { id: 'screening', label: 'Screening' },
  { id: 'shortlisted', label: 'Shortlisted' },
  { id: 'pitch', label: 'Pitch day' },
  { id: 'offered', label: 'Grant offered' },
  { id: 'funded', label: 'FUNDED' },
  { id: 'declined', label: 'not selected' },
];

export const APPLICANTS_COPY = {
  title: 'Applicants',
  sentence:
    'Move applicants from applied to funded. Names stay masked until they accept an invite.',
};
