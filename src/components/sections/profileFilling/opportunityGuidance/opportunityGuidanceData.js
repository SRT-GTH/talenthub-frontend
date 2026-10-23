import accraTechMark from '../../../../assets/opportunity-guidance/accra-tech-mark.svg';
import microsoftLogo from '../../../../assets/opportunity-guidance/microsoft-logo.png';
import ipmcLogo from '../../../../assets/opportunity-guidance/ipmc-logo.png';

/*
 * Opportunity Matching (Career Buddy guidance area) - copy and mock data.
 * Figma "AI provides opportunities guidance" 9053:80188 (frames 9053:80189 / 9053:80615 / 9053:81141, Focused only).
 * Mock data shaped like the future API: replace the blocks between the markers with GET /guidance/opportunity-matches.
 * All strings are verbatim from the frames (curly quotes, "Entrepreneurial  Guidance" double space, "Power-BI").
 */

// ---- API-shaped mock: start ----
export const OPPORTUNITY_COPY = {
  areaLabel: 'Opportunity Matching',
  intro:
    'Nice, let’s find you something real. 🎯  From your profile I’m working with Python (verified), teaching and mentoring experience, and your interest in EdTech.  Before I pull matches, what are you open to?',
  matchesIntro:
    'Got it. Here are your 3 strongest matches right now. Recruiters at two of them can already see you in their top matches.',
  // ⚠️ ASSUMPTION: Figma draws no reply for "Why these 3?", "Show more matches", "Add skill" or the cards 2/3 "Why this match?":
  // conservative placeholder lines built only from facts already on screen.
  whyThese:
    'These are the three roles where your profile lines up best right now: your verified Python, your teaching and mentoring experience, and your interest in EdTech. Open a card, or tap “Why this match?” on it, to see the detail.',
  moreMatches:
    'There are more roles that fit you. Open Matched to you in Opportunities to see all of them, or tell me what to narrow down.',
  addSkill: 'Tell me the skill you have and I’ll add it to your profile.',
  viewOpportunity: 'View opportunity',
  whyThisMatch: 'Why this match?',
  jobTag: 'Job opportunity',
};

export const OPEN_TO_CHIPS = [
  'Internships',
  'Full-time',
  'Training programmes',
  'Remote / Hybrid',
  'Accra-based',
  'Everything',
];

// The answer Figma draws after the open-to chips.
export const OPEN_TO_ANSWER = 'Internships and Remote / Hybrid';

export const MATCH_FOLLOW_UP_CHIPS = ['Why these 3?', 'Show more matches'];

export const OPPORTUNITY_MATCHES = [
  {
    id: 'accra-tech-data-analyst-intern',
    company: 'Accra Tech Ltd',
    logo: accraTechMark,
    title: 'Data Analyst Intern',
    closes: 'Closes 04 Nov',
    facts: ['Accra · Hybrid', 'Internship', 'GHS 2,500–3,500 / mo'],
    match: 80,
    meter: 301 / 364,
    keySkills: '2 of 3 key skills',
    skills: [
      { name: 'Python', have: true },
      { name: 'Excel', have: true },
      { name: 'Power-BI', have: false },
    ],
    // Existing finished Talent Jobs J-02 detail (public company).
    detailPath: '/job-postings?job=data-analyst',
  },
  {
    id: 'microsoft-design-intern',
    company: 'Microsoft Corporation',
    logo: microsoftLogo,
    title: 'Design Intern',
    closes: 'Closes 30 Oct',
    facts: ['Kasoa · Remote', 'Internship', 'GHS 2,500–3,500 / mo'],
    match: 82,
    meter: 310 / 364,
    keySkills: '2 of 3 key skills',
    skills: [
      { name: 'Figma', have: true },
      { name: 'Photoshop', have: true },
      { name: 'Framer', have: false },
    ],
    // ⚠️ ASSUMPTION: no detail frame for this role; opens the Matched to you list.
    detailPath: '/job-postings',
  },
  {
    id: 'ipmc-junior-python-instructor',
    company: 'IPMC Ghana',
    logo: ipmcLogo,
    title: 'Junior Python Instructor',
    closes: 'Closes Tomorrow',
    facts: ['Accra · On-site', 'Internship', 'Unpaid'],
    match: 44,
    meter: 165 / 364,
    keySkills: '2 of 3 key skills',
    skills: [
      { name: 'Python', have: true },
      { name: 'Mentoring', have: true },
      { name: '3-years teaching experience', have: false },
    ],
    // Figma J-02 variant 9222:120257 (this role's public posting detail).
    detailPath: '/opportunity-guidance/job?job=ipmc-junior-python-instructor',
  },
];

// Card 1's reply as drawn (it names IPMC Ghana and 86% although card 1 is Accra Tech 80%: Figma inconsistency, kept).
export const CARD_ONE_WHY = {
  text: 'You’re an 86% match for IPMC Ghana Intern:',
  bullets: [
    'Skills 2 of 3. Python, mentoring, communication and curriculum interest all line up.',
    'Experience. Teaching Python at the coding club counts directly. They want people who’ve explained code to beginners.',
    'Location. Hybrid suits you.',
    'Experience: Having more teaching experience would take you to about 90%.',
  ],
  chips: ['Apply with my GTH profile', 'Add skill'],
  // The role the reply names; "Apply with my GTH profile" opens its posting detail (J-02 variant).
  applyPath: '/opportunity-guidance/job?job=ipmc-junior-python-instructor',
};

// The talent-side chat that precedes the guidance area chips, as drawn in all three frames.
export const OPPORTUNITY_SEED = [
  { kind: 'user', auto: true, text: 'Personality confirmed' },
  {
    kind: 'bot',
    text: 'Saved! Your education section is  locked in. Ready to move on to your  personal area of interest?',
  },
  { kind: 'user', text: 'I’d love to talk about that' },
  {
    kind: 'bot',
    text: 'Okay that’s great. We’ve covered a lot.\nNow would you like to continue populating your profile or you want some guidance\nbased on what we’ve discussed so far?',
    chips: ['Continue populating profile', 'I think I need some guidance'],
  },
  { kind: 'user', auto: true, text: 'I think I need some guidance' },
  {
    kind: 'bot',
    text: 'That’s alright brother. I get where you’re coming from.\nSelect which area you need guidance in the options below',
    chips: [
      'Career exposure',
      'Secondary Elective Matching',
      'Tertiary Course Matching',
      'Mock Interviews',
      'Opportunity Matching',
      'Talent Matching',
      'Entrepreneurial  Guidance',
    ],
  },
];

// J-02 variant (9222:120257): the public posting detail for IPMC Ghana, same layout as the Accra Tech one.
export const IPMC_JOB = {
  id: 'ipmc-junior-python-instructor',
  company: { name: 'IPMC Ghana', logo: ipmcLogo },
  signal: 'New match',
  isNew: true,
  title: 'Junior Python Instructor',
  location: 'Accra · On-site',
  type: 'Internship',
  pay: 'Unpaid',
  match: 82,
  why: ['SQL (verified)', 'Excel', 'Lives in Accra'],
  posted: 'Posted Today',
  age: 'Today',
};

export const IPMC_JOB_DETAIL = {
  company: {
    short: 'IPMC Ghana',
    line: 'IT Services & Systems Integration · Accra · 2,000+ people',
    verified: true,
  },
  sticker: 'New today',
  closes: 'Closes Tomorrow',
  matchLabel: 'Strong match',
  matchNote: 'Ama’s team already sees you in their top matches for this role.',
  breakdown: { education: 'BSc', location: 'Accra' },
  about: {
    intro:
      'Join our 6-person data team turning payments data into decisions. You’ll build the weekly dashboards our product and ops teams rely on, and dig into why customers drop off.',
    bullets: [
      'Write SQL to pull and clean transaction data',
      'Build and maintain dashboards for product and ops',
      'Present one insight a week to the team',
      'Pair with engineers on data quality',
    ],
  },
  skills: {
    have: [
      { name: 'SQL', verified: true },
      { name: 'Excel' },
      { name: 'Python' },
      { name: 'Data visualisation' },
    ],
    missing: ['Power BI'],
  },
  boost: {
    to: 88,
    delta: '+6%',
    note: 'Power BI is the one skill you’re missing. Add it and your match jumps.',
    have: 'I have it · add skill',
    learn: 'Learn it',
  },
  recruiter: {
    name: 'Ama Darko',
    first: 'Ama',
    role: 'Talent Acquisition · Accra Tech',
    reply: 'Usually replies within 2 days',
  },
};
// ---- API-shaped mock: end ----
