/*
 * talentCandidateProfileData.js — mock payloads for the recruiter candidate profile `/recruiter/talent-search/:candidateId`.
 * Source: Figma file OHG2xsfCCskT8xEn356njv, page "Recruiter - Talent Search", frames TS-11 (10102:41537) … TS-19 (10102:45118).
 * Every string is the `characters` of the Figma node (copied verbatim, including the curly quotes and the "·" separators). The shapes follow the payload the
 * future API would return (candidate, match, availability, history); nothing here calls an API.
 *
 * FIGMA NOTES (recorded, not silently resolved):
 *  • TS-11 and TS-19 draw the same photo for Kofi and Ama (one stock image is filled into both avatars); the two files in assets are the same picture.
 *  • The talent-search list (TS-01) shows Ama Boateng as an 84% match for "Senior Product Engineer", while TS-19 shows her as an applicant to "Senior UX Designer"
 *    with 84%. Both stay as drawn: the list card is the list agent's, this profile is TS-19.
 *  • TS-19 draws "Back to Messages" and a trailing empty breadcrumb text (`Text`, 0 wide) beside the next chevron; no position text ("2 of 12") is drawn.
 *  • The Skills rows of TS-19 keep the Figma layer names "Skill · React / Python / AWS / PostgreSQL" while the text reads Figma / User research / Design systems / Prototyping; the text ships.
 *  • TS-19 says "Meets all 5 screening rules" in the banner and "Meets 4 of 5 screening rules" in the history card, and the match card reads "Skills 4 of 5"; the "Available in 1 month" chip sits beside "Start Immediately". All kept as drawn.
 *  • TS-11 draws the Save popover (TS-14) with a check on the first list while the Save button still reads "Save"; treated as the preselected list (⚠️ ASSUMPTION, see the section header).
 *  • Toast frames (TS-13, TS-15, TS-18) sit under a 3 % #1c2a21 blurred sheet ("Frame 14574", 1728x2415) that is a layer artefact of the toast export; not built.
 */

export const DEFAULT_JOB_ID = 'senior-product-engineer';

// Figma Messages item and trail copy for TS-19 live on the candidate record (`crumb`), not here.
export const PROFILE_COPY = {
  notFoundTitle: 'Profile not available',
  // ⚠️ ASSUMPTION: no frame draws a profile for Godfred Ansah (list card exists, profile does not) nor an unknown id.
  notFoundBody: 'This candidate profile is not available yet.',
  notFoundBack: 'Back to results',
  verifiedSkills: 'Verified skills',
  about: 'About',
  skills: 'Skills',
  experience: 'Experience',
  portfolio: 'Portfolio',
  education: 'Education and certificates',
  matchFor: 'MATCH FOR',
  availabilityHeading: 'AVAILABILITY AND PREFERENCES',
  privateNotesHeading: 'PRIVATE NOTES · ONLY YOUR TEAM',
  privateNotesPlaceholder: 'Add a note for your team…',
  nextCandidate: 'Next candidate',
  // ⚠️ ASSUMPTION (aria-label of the chevron button, Figma draws only the glyph).
  openAria: 'Open',
};

// TS-11 "Invite to apply" · TS-13 label · the invite allowance line (TS-11 "18 of 50 invites left this month", TS-13 "17 of 50 …").
export const INVITE_ALLOWANCE = { total: 50, left: 18 };

// Jobs the recruiter can invite to / add a candidate to. ⚠️ ASSUMPTION: only the job drawn in the dialogs exists (one option per dropdown).
export const JOBS = [
  {
    id: 'senior-product-engineer',
    title: 'Senior Product Engineer',
    // TS-12 Job dropdown value
    inviteLabel: 'Senior Product Engineer · Accra · Hybrid',
  },
  {
    id: 'senior-ux-designer',
    title: 'Senior UX Designer',
    inviteLabel: 'Senior UX Designer',
  },
];

// TS-12 "Invite Kofi to apply" dialog. `{first}` / `{name}` are filled from the candidate.
export const INVITE_DIALOG = {
  title: (first) => `Invite ${first} to apply`,
  body: (first) =>
    `${first} gets this in Messages with the job card. If they apply, they join your pipeline in Applied.`,
  jobLabel: 'Job',
  messageLabel: 'Message',
  maxLength: 500,
  // 168 characters in the frame ("168 / 500"): the counter is computed from the text, the text is verbatim.
  defaultMessage: (first, role) =>
    `Hi ${first}, your payments work at Fintech Hub stood out. We’re hiring a ${role} and I think you’d be a great fit. Would you take a look?`,
  previewHeading: (first) => `WHAT ${first.toUpperCase()} WILL SEE`,
  previewTitle: 'Silver Rock Technology · Job proposal',
  previewBody: (role, percent) => `${role} · ${percent}% match · View and apply / Not interested`,
  usesLine: (left) => `Uses 1 of ${left} invites left`,
  cancel: 'Cancel',
  confirm: 'Send invite',
};

// TS-13 invite sent.
export const INVITE_SENT = {
  buttonLabel: (role) => `Invited · ${role}`,
  invitesLeft: (left) => `${left} of ${INVITE_ALLOWANCE.total} invites left this month`,
  historyLine: (role) => `Invited to ${role} · just now`,
  toast: {
    title: 'Success',
    message: (name) =>
      `Invite sent to ${name}. We’ll tell you when ${name.split(' ')[0]} replies or applies`,
    action: 'Open Conversation',
    width: 'w-[528px]',
  },
};

// TS-14 / TS-15 "Save to a list" popover.
export const SAVE_LISTS = [
  { id: 'job-shortlist', title: 'Senior Product Engineer · shortlist', count: '6 talents' },
  { id: 'future-engineering-hires', title: 'Future engineering hires', count: '14 talents' },
  {
    id: 'graduate-intake-2027',
    title: 'Graduate intake 2027',
    count: '22 talents · shared with team',
  },
];
export const SAVE_MENU = {
  heading: 'SAVE TO A LIST',
  newList: 'New list…',
  save: 'Save',
  saved: 'Saved',
  toast: {
    title: 'Success',
    message: (listTitle) => `Saved to “${listTitle}”`,
    action: 'View list',
    width: 'w-[460px]',
  },
};

// TS-16 overflow menu.
export const OVERFLOW_ITEMS = [
  {
    id: 'add-to-pipeline',
    label: 'Add to a job’s pipeline',
    hint: 'Skip the invite and add directly',
    icon: 'pipeline',
  },
  { id: 'share-with-team', label: 'Share with my team', icon: 'users' },
  { id: 'copy-link', label: 'Copy profile link', icon: 'link' },
  { id: 'hide', label: 'Hide from my searches', icon: 'eye', dividerBefore: true },
  { id: 'report', label: 'Report profile', icon: 'alert', danger: true },
];

// TS-17 "Add Kofi to a pipeline" dialog and TS-18 result.
export const PIPELINE_STAGES = [
  // Stage names of the recruiter pipeline board (sections/applicationPipeline) — only "Shortlisted" is drawn selected.
  { value: 'applied', label: 'Applied' },
  { value: 'screening', label: 'Screening' },
  { value: 'shortlisted', label: 'Shortlisted' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer-extended', label: 'Offer Extended' },
];
export const PIPELINE_DIALOG = {
  title: (first) => `Add ${first} to a pipeline`,
  body: (first) => `Use this when you’ve already spoken to ${first}, for example at a career fair.`,
  jobLabel: 'Job',
  stageLabel: 'Stage',
  defaultStage: 'shortlisted',
  notifyLabel: (first) => `Tell ${first} they’ve been shortlisted`,
  notifyHint: (first) => `Sends a short message. ${first} can withdraw at any time.`,
  infoTitle: (first) => `${first} will be asked to confirm`,
  infoBody: 'Talent always confirm before joining a pipeline they didn’t apply to.',
  cancel: 'Cancel',
  confirm: 'Add to pipeline',
  historyLine: (stage, role, first) => `${stage} for ${role} · waiting for ${first} to confirm`,
  toast: {
    title: 'Success',
    message: (first, stage, role) =>
      `${first} added to ${stage}. ${role} · waiting for ${first} to confirm`,
    action: 'View in Pipeline',
    width: 'w-[505px]',
  },
};

const SKILL_BAR_MAX = 360; // Figma track width; the filled rect width / 360 is the percent.
const pct = (px) => Math.round((px / SKILL_BAR_MAX) * 1000) / 10;

// Figma draws the same six bar widths in TS-11 and TS-19 (317 / 306 / 252 / 295 / 216 / 288 of 360).
const SKILL_BARS = [pct(317), pct(306), pct(252), pct(295), pct(216), pct(288)];

export const CANDIDATES = {
  'kofi-amankwah': {
    id: 'kofi-amankwah',
    kind: 'sourced', // found by search: Invite / Message / Save / more
    name: 'Kofi Amankwah',
    firstName: 'Kofi',
    verifiedSkills: true,
    headline: 'Senior Software Engineer · Fintech Hub',
    meta: 'Accra, Greater Accra · 6 years experience · Active today',
    chips: [
      { id: 'open-to-work', label: 'Open to work', tone: 'success', icon: 'check' },
      {
        id: 'availability',
        label: 'Available now · notice served',
        tone: 'mint',
        icon: 'calendar',
      },
      { id: 'work-setup', label: 'Hybrid or Remote', tone: 'neutral', icon: 'map-pin' },
      { id: 'adult', label: '18+', tone: 'neutral' },
    ],
    crumb: {
      backLabel: 'Back to results',
      trail: 'Talent Search / Senior Product Engineer / Kofi Amankwah',
      position: '2 of 12',
    },
    about:
      'Backend-leaning engineer who has scaled payments systems from 10k to 2M users. I enjoy mentoring and building reliable, boring infrastructure. Looking for a product team where engineers talk to users.',
    skillsNote: '5 verified by GTH assessments',
    skills: [
      { id: 'react', name: 'React', level: 'Advanced', percent: SKILL_BARS[0], verified: true },
      { id: 'python', name: 'Python', level: 'Advanced', percent: SKILL_BARS[1], verified: true },
      { id: 'aws', name: 'AWS', level: 'Intermediate', percent: SKILL_BARS[2], verified: true },
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        level: 'Advanced',
        percent: SKILL_BARS[3],
        verified: true,
      },
      {
        id: 'kubernetes',
        name: 'Kubernetes',
        level: 'Intermediate',
        percent: SKILL_BARS[4],
        verified: true,
      },
      {
        id: 'system-design',
        name: 'System design',
        level: 'Advanced',
        percent: SKILL_BARS[5],
        verified: false,
      },
    ],
    experience: [
      {
        id: 'fintech-hub',
        title: 'Senior Software Engineer',
        meta: 'Fintech Hub · Accra · 2022 – now · 3 yrs',
        summary: 'Led the move to event-driven payments; cut failed transfers by 40%.',
      },
      {
        id: 'hubtel',
        title: 'Software Engineer',
        meta: 'Hubtel · Accra · 2019 – 2022 · 3 yrs',
        summary: 'Built merchant dashboards in React used by 30k businesses.',
      },
      {
        id: 'mest-africa',
        title: 'Engineering Intern',
        meta: 'MEST Africa · 2018 · 6 months',
        summary: 'Shipped a USSD savings prototype with 2 founders.',
      },
    ],
    portfolio: {
      linkLabel: 'github.com/kofi-amankwah',
      // ⚠️ ASSUMPTION: Figma draws the link text only; the URL is the https form of it.
      href: 'https://github.com/kofi-amankwah',
      projects: [
        {
          id: 'payflow-api',
          title: 'PayFlow API',
          caption: 'Open-source payments SDK · 1.2k stars',
          tint: 'mint',
        },
        { id: 'kente-ui', title: 'Kente UI', caption: 'React component library', tint: 'cream' },
        {
          id: 'trotro-times',
          title: 'Trotro Times',
          caption: 'Live bus ETA app for Accra',
          tint: 'blue',
        },
      ],
    },
    education: [
      { id: 'bsc', title: 'BSc Computer Science', meta: 'KNUST · 2014 – 2018 · First Class' },
      {
        id: 'aws-cert',
        title: 'AWS Certified Developer – Associate',
        meta: 'Amazon Web Services · 2023',
      },
      { id: 'alx', title: 'ALX Software Engineering', meta: 'ALX Africa · 2021' },
    ],
    match: {
      jobId: 'senior-product-engineer',
      percent: 91,
      verdict: 'Strong match',
      rows: [
        { id: 'skills', label: 'Skills', value: '5 of 5' },
        { id: 'experience', label: 'Experience', value: '6 yrs (needs 5+)' },
        { id: 'location', label: 'Location', value: 'Accra' },
        { id: 'assessment', label: 'Assessment', value: '95th percentile' },
      ],
      note: 'Strong fit for high-availability systems. Lighter on mobile than your ideal profile.',
    },
    availability: [
      { id: 'start', label: 'Start', value: 'Immediately' },
      { id: 'work-setup', label: 'Work setup', value: 'Hybrid or Remote' },
      { id: 'pay', label: 'Expected pay', value: 'GHS 12,000–15,000 / mo' },
      { id: 'open-to', label: 'Open to', value: 'Full-time · Contract' },
      { id: 'languages', label: 'Languages', value: 'English, Twi' },
    ],
    history: {
      heading: 'YOUR HISTORY WITH KOFI',
      line: 'No applications or messages yet.',
      viewedBy: 'Viewed by Akua M. (your team) 2 days ago',
    },
  },

  'ama-boateng': {
    id: 'ama-boateng',
    kind: 'applicant', // applied through GTH: View in Pipeline / Message / Move to stage / more
    name: 'Ama Boateng',
    firstName: 'Ama',
    verifiedSkills: true,
    headline: 'Product Lead · PayLink Ghana',
    meta: 'Accra, Greater Accra · 8 years experience · Active 2 hours ago',
    chips: [
      { id: 'open-to-work', label: 'Open to work', tone: 'success', icon: 'check' },
      { id: 'availability', label: 'Available in 1 month', tone: 'mint', icon: 'calendar' },
      { id: 'work-setup', label: 'Hybrid or Remote', tone: 'neutral', icon: 'map-pin' },
      { id: 'adult', label: '18+', tone: 'neutral' },
    ],
    crumb: {
      backLabel: 'Back to Messages',
      trail: 'Messages / Ama Boateng',
      position: '',
    },
    applied: {
      title: 'Applied to Senior UX Designer · today, 9:05 AM',
      body: 'Currently in Applied. Meets all 5 screening rules.',
      action: 'Open application',
      note: 'Applied with GTH profile · no invite needed',
    },
    about:
      'Product lead who started as a designer. I’ve shipped two mobile money apps used across Ghana and love turning messy research into simple flows.',
    skillsNote: '5 verified by GTH assessments',
    skills: [
      { id: 'figma', name: 'Figma', level: 'Advanced', percent: SKILL_BARS[0], verified: true },
      {
        id: 'user-research',
        name: 'User research',
        level: 'Advanced',
        percent: SKILL_BARS[1],
        verified: true,
      },
      {
        id: 'design-systems',
        name: 'Design systems',
        level: 'Intermediate',
        percent: SKILL_BARS[2],
        verified: true,
      },
      {
        id: 'prototyping',
        name: 'Prototyping',
        level: 'Advanced',
        percent: SKILL_BARS[3],
        verified: true,
      },
      {
        id: 'stakeholder-management',
        name: 'Stakeholder management',
        level: 'Intermediate',
        percent: SKILL_BARS[4],
        verified: true,
      },
      {
        id: 'accessibility',
        name: 'Accessibility',
        level: 'Advanced',
        percent: SKILL_BARS[5],
        verified: false,
      },
    ],
    experience: [
      {
        id: 'paylink-ghana',
        title: 'Product Lead',
        meta: 'PayLink Ghana · Accra · 2022 – now · 3 yrs',
        summary: 'Leads a team of 4 designers and 2 PMs across savings and payments.',
      },
      {
        id: 'hubtel',
        title: 'Senior Product Designer',
        meta: 'Hubtel · Accra · 2019 – 2022 · 3 yrs',
        summary: 'Redesigned merchant onboarding; activation up 27%.',
      },
      {
        id: 'farmerline',
        title: 'Product Designer',
        meta: 'Farmerline · Kumasi · 2016 – 2019 · 3 yrs',
        summary: 'Designed farmer-facing SMS flows in Twi and English.',
      },
    ],
    portfolio: {
      linkLabel: 'ama.design/work',
      // ⚠️ ASSUMPTION: https form of the drawn link text.
      href: 'https://ama.design/work',
      projects: [
        {
          id: 'paylink-onboarding',
          title: 'PayLink onboarding',
          caption: 'Case study · drop-off down 38% → 21%',
          tint: 'mint',
        },
        {
          id: 'savings-goals',
          title: 'Savings goals',
          caption: 'Figma component library',
          tint: 'cream',
        },
        { id: 'merchant-qr', title: 'Merchant QR', caption: 'Research + UI', tint: 'blue' },
      ],
    },
    education: [
      { id: 'ba', title: 'BA Communication Design', meta: 'KNUST · 2012 – 2016' },
      { id: 'google-ux', title: 'Google UX Design Certificate', meta: 'Coursera · 2020' },
      { id: 'ideo', title: 'Design Leadership', meta: 'IDEO U · 2023' },
    ],
    match: {
      jobId: 'senior-ux-designer',
      percent: 84,
      verdict: 'Strong match',
      rows: [
        { id: 'skills', label: 'Skills', value: '4 of 5' },
        { id: 'experience', label: 'Experience', value: '8 yrs (needs 5+)' },
        { id: 'location', label: 'Location', value: 'Accra' },
        { id: 'assessment', label: 'Assessment', value: '81 / 100' },
      ],
      note: 'Led design for two fintech apps in Ghana. Less hands-on with design systems than your ideal profile.',
    },
    availability: [
      { id: 'start', label: 'Start', value: 'Immediately' },
      { id: 'work-setup', label: 'Work setup', value: 'Hybrid or Remote' },
      { id: 'pay', label: 'Expected pay', value: 'GHS 12,000–15,000 / mo' },
      { id: 'open-to', label: 'Open to', value: 'Full-time · Contract' },
      { id: 'languages', label: 'Languages', value: 'English, Twi' },
    ],
    history: {
      heading: 'YOUR HISTORY WITH AMA',
      line: 'Applied to Senior UX Designer today · stage: Applied · 2 messages',
      viewedBy: 'Meets 4 of 5 screening rules',
    },
  },
};
