/*
 * opportunityTypes — an opportunity's employment type (ADR-07) and the eligibility rules' vocabulary (ADR-06), mirrored
 * from the backend (srt-backend utils/opportunityEligibility.js) for card labels, the job form and the admin screen.
 * The backend decides who may see and apply; this file only labels and pre-checks.
 */

export const EMPLOYMENT_LABEL = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  temporary: 'Gig / temporary',
  volunteer: 'Volunteer',
  internship: 'Internship',
  apprenticeship: 'Apprenticeship',
};
const EMPLOYMENT_TYPES = Object.keys(EMPLOYMENT_LABEL);
const ALIAS = {
  fulltime: 'full-time',
  'full-time-job': 'full-time',
  permanent: 'full-time',
  parttime: 'part-time',
  gig: 'temporary',
  'gig-/-temporary': 'temporary',
  'gig/temporary': 'temporary',
  freelance: 'contract',
  'freelance/project-based': 'contract',
  volunteering: 'volunteer',
};
const CATEGORY_LABEL = {
  'full-time-job': 'Job',
  internship: 'Internship',
  'training-program': 'Training',
  'government-program': 'Government programme',
  'international-opportunity': 'Scholarship / international',
};

export const normaliseEmploymentType = (value) => {
  const s = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-');
  return s ? ALIAS[s] || s : null;
};

/** Stored employment type, else the job form's type kept as a tag, else category + duration (older postings). */
export const employmentTypeOf = (opp = {}) => {
  const stored = normaliseEmploymentType(opp.employmentType);
  if (stored && EMPLOYMENT_TYPES.includes(stored)) return stored;
  if (opp.type === 'internship') return 'internship';
  if (!opp.type || opp.type === 'full-time-job') {
    for (const tag of opp.tags || []) {
      const t = typeof tag === 'string' ? normaliseEmploymentType(tag) : null;
      if (t && EMPLOYMENT_TYPES.includes(t) && t !== 'internship') return t;
    }
    const d = opp.duration?.type;
    if (d === 'contract') return 'contract';
    if (d === 'temporary') return 'temporary';
    if (d === 'internship') return 'internship';
    return 'full-time';
  }
  return null;
};

/** "Part-time", "Volunteer", "Internship", "Training" … (the label every list and card shows). */
export const employmentLabel = (opp = {}) => {
  if (['training-program', 'government-program', 'international-opportunity'].includes(opp.type))
    return CATEGORY_LABEL[opp.type];
  return EMPLOYMENT_LABEL[employmentTypeOf(opp)] || CATEGORY_LABEL[opp.type] || 'Job';
};

const isPaid = (opp = {}) => {
  const s = opp.salary || {};
  return Number(s.min) > 0 || Number(s.max) > 0 || s.negotiable === true;
};

/** The rules' kind of a posting (category + employment type + paid/unpaid for internships). */
export const kindOf = (opp = {}) => {
  if (opp.type === 'training-program') return 'training';
  if (opp.type === 'government-program') return 'government';
  if (opp.type === 'international-opportunity') return 'international';
  const et = employmentTypeOf(opp);
  if (opp.type === 'internship' || et === 'internship')
    return isPaid(opp) ? 'internship_paid' : 'internship_unpaid';
  return (
    {
      volunteer: 'volunteer',
      apprenticeship: 'apprenticeship',
      'part-time': 'part_time',
      temporary: 'temporary',
      contract: 'contract',
    }[et] || 'full_time'
  );
};

/* ── Eligibility rules vocabulary (fixed ids; values live in platform config opportunity.eligibility_rules) ── */

export const ELIGIBILITY_KEY = 'opportunity.eligibility_rules';

export const KINDS = [
  { id: 'training', label: 'Training programmes', short: 'Training' },
  { id: 'internship_unpaid', label: 'Unpaid internships', short: 'Unpaid internship' },
  { id: 'internship_paid', label: 'Paid internships', short: 'Paid internship' },
  { id: 'volunteer', label: 'Volunteer roles', short: 'Volunteer' },
  { id: 'apprenticeship', label: 'Apprenticeships', short: 'Apprenticeship' },
  { id: 'part_time', label: 'Part-time jobs', short: 'Part-time' },
  { id: 'temporary', label: 'Gigs and temporary work', short: 'Gig / temporary' },
  { id: 'contract', label: 'Contract jobs', short: 'Contract' },
  { id: 'full_time', label: 'Full-time jobs', short: 'Full-time' },
  { id: 'government', label: 'Government programmes', short: 'Government' },
  { id: 'international', label: 'Scholarships and international', short: 'International' },
];
export const AGE_BANDS = [
  { id: 'under_16', label: 'Under 16', minor: true },
  { id: 'age_16_17', label: '16 and 17', minor: true },
  { id: 'adult', label: '18 and over', minor: false },
];
export const EDUCATION_GROUPS = [
  { id: 'jhs', label: 'JHS / finished JHS (BECE)' },
  { id: 'shs', label: 'SHS / finished SHS (WASSCE)' },
  { id: 'tvet', label: 'TVET (technical / vocational)' },
  { id: 'tertiary', label: 'Tertiary' },
  { id: 'other', label: 'Not studying / other' },
];
export const ACCESS = [
  { id: 'yes', label: 'Yes', hint: 'Listed, and they can apply' },
  {
    id: 'opt_in',
    label: 'If open to under-18s',
    hint: 'Only postings the recruiter opened to under-18s',
  },
  { id: 'view', label: 'See only', hint: 'Listed with Apply turned off and the reason' },
  { id: 'no', label: 'Hidden', hint: 'Not listed (a shared link shows why they can’t apply)' },
];
export const APPLIES_TO = [
  { id: 'minors', label: 'Under-18s only' },
  { id: 'minors_and_students', label: 'Under-18s and anyone still at school' },
  { id: 'everyone', label: 'Everyone at this level' },
];
/** Paid work under-18s may reach only through postings open to under-18s (US-1.1.1-06): never "yes" for a minor band. */
export const MINOR_CAPPED_KINDS = ['full_time', 'part_time', 'contract', 'temporary'];

// Kinds the default rules let a posting open to under-18s (used when the rules can't be read).
const DEFAULT_UNDER18_KINDS = [
  'training',
  'internship_unpaid',
  'internship_paid',
  'volunteer',
  'apprenticeship',
  'part_time',
  'temporary',
];

const RANK = { no: 0, view: 1, opt_in: 2, yes: 3 };

/**
 * A talent's access to one kind (the admin screen's "Check a talent"): the age-band rule and the education-level rule
 * together, the stricter wins. facts: { band, group, minor, studying }. Same as the backend's accessFor.
 */
export const accessFor = (rules, facts, kind) => {
  const ageCell = rules?.ageBands?.[facts.band]?.[kind] || 'no';
  const rule = rules?.educationGroups?.[facts.group];
  const applies =
    Boolean(rule) &&
    (rule.appliesTo === 'everyone' ||
      (rule.appliesTo === 'minors_and_students'
        ? Boolean(facts.minor || facts.studying)
        : Boolean(facts.minor)));
  const eduCell = applies ? rule.allow?.[kind] || 'no' : 'yes';
  const access = (RANK[ageCell] ?? 0) <= (RANK[eduCell] ?? 0) ? ageCell : eduCell;
  return { access, ageCell, eduCell };
};

/** May the recruiter open this kind of posting to under-18s? (any minor age band allows it: yes or opt_in) */
export const under18Allowed = (rules, opp) => {
  const kind = kindOf(opp);
  if (!rules?.ageBands) return DEFAULT_UNDER18_KINDS.includes(kind);
  return AGE_BANDS.filter((b) => b.minor).some((b) =>
    ['yes', 'opt_in'].includes(rules.ageBands?.[b.id]?.[kind])
  );
};
