/*
 * institutionOnboardingData.js — MOCK data of the institution onboarding (Figma canvas 8520:10, 11.1.1a-d + b2 sign-up, 11.1.2a-a3 accreditation upload,
 * 11.1.2b-e verification status; shaped like the future /institution/signup, /institution/accreditation and /institution/verification responses).
 * Copy is verbatim from the frames (curly quotes, middle dots). Sample content only. One marked block per concern.
 */

/* ===== BLOCK 1 · sign-up, step 03 "Tell us about your institution." (11.1.1a, a2, c) ================================== */
export const SIGNUP = {
  eyebrow: '03',
  eyebrowLabel: 'Institution sign-up',
  // Figma draws two splits of the headline: the empty form (11.1.1a) greens "about your institution.", the filled / registered frames green "institution." only.
  titleEmpty: ['Tell us ', 'about your institution.'],
  titleFilled: ['Tell us about your ', 'institution.'],
  lead: 'Schools, universities and training providers register here to add students, verify records and issue credentials.',
  institutionTypes: [
    'Senior high school (public)',
    'Senior high school (private)',
    'Junior high school',
    'University',
    'Technical or vocational institute',
  ],
  typePlaceholder: 'JHS, SHS, university, technical or vocational',
  // ⚠️ ASSUMPTION: the address is a dropdown in Figma (chevron); only the one filled value is drawn, the other options are samples.
  addresses: [
    'NT-0123-4567, Tamale, Northern',
    'GA-123-4567, Accra, Greater Accra',
    'AK-123-4567, Kumasi, Ashanti',
  ],
  addressPlaceholder: 'Digital address, town and region',
  placeholders: {
    name: 'e.g. Savannah Hills Senior High School',
    short: 'e.g. Savannah Hills SHS',
    gesNumber: 'e.g. GES/NR/SHS/0412',
    email: 'registrar@yourschool.edu.gh',
    password: 'Create a password',
  },
  // The filled form (11.1.1a2) and the already-registered form (11.1.1c).
  values: {
    crest: 'savannah-hills-crest.png (96KB)',
    name: 'Savannah Hills Senior High School',
    short: 'Savannah Hills SHS',
    gesNumber: 'GES/NR/SHS/0412',
    type: 'Senior high school (public)',
    address: 'NT-0123-4567, Tamale, Northern',
    email: 'registrar@savannahhills.edu.gh',
    password: 'GthSchool#26',
  },
  registeredOn: '2 Sep',
  // ⚠️ ASSUMPTION (demo): the accreditation number that is already on GTH (typing it opens the duplicate dialog, 11.1.1c).
  registeredGesNumber: 'GES/NR/SHS/0001',
  registeredName: 'Savannah Hills SHS',
  // Breadcrumbs + completion of the progress header (Figma 11.1.1a "Frame 149").
  steps: [
    { key: 'role', label: 'Role' },
    { key: 'get-started', label: 'Get started' },
    { key: 'institution', label: 'Institution' },
    { key: 'verify', label: 'Verify email' },
    { key: 'accreditation', label: 'Accreditation' },
    { key: 'review', label: 'Review' },
    { key: 'approved', label: 'Approved' },
  ],
  percent: { institution: 29, verify: 43 },
};

/* ===== BLOCK 2 · sign-up, step 04 "Confirm your email." (11.1.1b, b2, d) =============================================== */
export const VERIFY = {
  eyebrow: '04',
  eyebrowLabel: 'Verify your email',
  title: ['Confirm ', 'your email.'],
  lead: 'We’ll send a 6-digit code to make sure this inbox belongs to your institution.',
  phone: { code: '+233', value: '23 533 45' },
  office: { code: '+233', value: '23 533 45' },
  email: 'registrar@savannahhills.edu.gh',
  masked: 'r•••r@savannahhills.edu.gh',
  domainNote: 'We only accept your institution’s own email domain',
  helper: 'We’ll send your code and verification updates here',
  resendIn: 59,
  attempts: 3,
  expiresIn: 598,
  // ⚠️ ASSUMPTION (demo): the verification code. It is documented here only; the UI never shows it.
  demoCode: '482913',
};

/* ===== BLOCK 3 · accreditation upload (11.1.2a, a2, a3) ================================================================= */
export const ACCREDITATION = {
  stepChip: 'STEP 5 OF 7',
  stepName: 'Accreditation documents',
  progress: '4 of 7 done · 57%',
  eyebrow: 'ACCREDITATION',
  title: ['Prove ', 'your institution is accredited.'],
  lead: 'Upload your GES licence, Ministry registration, the head’s Ghana Card and a letter on your letterhead. We check them within 2 working days.',
  checks: [
    {
      id: 'number',
      icon: 'fileCheck',
      title: 'Accreditation number',
      text: 'We check it with the Ghana Education Service',
    },
    {
      id: 'head',
      icon: 'calendar',
      title: 'Head of institution',
      text: 'The head confirms the account',
    },
    {
      id: 'where',
      icon: 'label',
      title: 'Where you are',
      text: 'Your address matches your licence',
    },
  ],
  badges: [
    {
      id: 'verified',
      icon: 'checkFill',
      title: 'Verified',
      text: 'We matched it with the official record. Students see a Verified institution badge.',
    },
    {
      id: 'pending',
      icon: 'timeClock',
      title: 'Pending',
      text: 'Most checks take 1–2 working days.',
    },
    {
      id: 'needs',
      icon: 'user',
      title: 'Needs more info',
      text: 'We email you exactly what to fix.',
    },
  ],
  renewals: {
    title: 'Renewals',
    icon: 'bell',
    itemTitle: 'Re-accreditation',
    text: 'We ask for your new licence when it renews.',
  },
  empty: {
    title: ['Nothing ', 'uploaded yet.'],
    text: 'Upload a PDF or photo of each document. We read the details for you.',
    upload: 'Upload a document',
    manual: 'Enter details manually',
    help: 'Stuck? Talk to the institutions team',
    how: [
      { id: 'u', icon: 'upload', title: '1. Upload', text: 'PDF, JPG or PNG up to 10 MB.' },
      { id: 'c', icon: 'eye', title: '2. Check the details', text: 'Fix anything we got wrong.' },
      {
        id: 'v',
        icon: 'checkFill',
        title: '3. Get verified',
        text: 'We confirm with the Ghana Education Service.',
      },
    ],
    needLabel: 'WHAT WE NEED FROM YOU',
    need: {
      title: 'GES accreditation licence',
      badge: 'Required',
      meta: ['Ghana Education Service', 'Issued Jun 2014', 'GES/NR/SHS/0412'],
      tags: ['SHS', 'Public', 'Northern'],
      action: 'Upload',
    },
  },
  list: {
    title: 'Your documents',
    count: '3 of 4 documents',
    docs: [
      {
        id: 'licence',
        title: 'GES accreditation licence',
        status: 'Verified',
        tone: 'ok',
        meta: ['Ghana Education Service', 'Issued Jun 2014', 'GES/NR/SHS/0412'],
        tags: ['SHS', 'Public', 'Northern'],
        link: 'View file',
      },
      {
        id: 'ghana-card',
        title: 'Head’s Ghana Card',
        status: 'Verified',
        tone: 'ok',
        meta: ['Mrs Salamatu Yakubu · Headmistress', 'Expires Mar 2031', 'GHA-•••••••••-3'],
        tags: ['Identity', 'Head'],
        link: 'View file',
      },
      {
        id: 'letter',
        title: 'Letter on letterhead',
        status: 'Pending check',
        tone: 'warn',
        meta: ['Signed by the head', 'Issued Sep 2026'],
        tags: ['Address', 'Tamale'],
      },
      {
        id: 'registration',
        title: 'Ministry of Education registration',
        status: 'Needs more info',
        tone: 'plain',
        meta: ['Missing · required', 'Upload now'],
        tags: ['Public'],
      },
    ],
    upload: 'Upload a document',
    manual: 'Enter details manually',
  },
  back: 'Back: Verify email',
  next: 'Next: Review',
  checklist: 'Verification checklist',
  // 11.1.2a3 "Documents submitted." dialog.
  submitted: {
    eyebrow: 'STEP 5 OF 7 COMPLETE',
    title: ['Documents ', 'submitted.'],
    text: '3 of 4 documents uploaded. You can set up while we check, but students and credentials open once you’re approved.',
    stats: [
      { id: 'steps', value: '4/7', label: 'STEPS DONE', tone: 'plain' },
      { id: 'pct', value: '57%', label: 'COMPLETE', tone: 'green' },
      { id: 'time', value: '1–2 days', label: 'REVIEW TIME', tone: 'gold' },
    ],
    nextLabel: 'WHAT HAPPENS NEXT',
    next: [
      {
        id: 'ges',
        icon: 'search',
        title: 'We check with GES',
        text: 'A reviewer confirms your licence with the Ghana Education Service.',
      },
      {
        id: 'email',
        icon: 'bell',
        title: 'Approval email',
        text: 'We email you as soon as you’re approved.',
      },
    ],
    status: 'Go to my status page',
    review: 'Next: Review',
  },
};

/* ===== BLOCK 4 · verification status gates (11.1.2b under review, c approved, d needs more info, e not approved) ========= */
const GATE_ACTIONS = (second, fourth, third = 'Add registrars and teachers') => [
  {
    id: 'regional',
    title: 'See regional data',
    meta: 'Students by region',
    icon: 'map',
    tint: '#ebf1ec',
    ink: '#244a9f',
    to: '/institution/students',
  },
  {
    id: 'students',
    title: 'Add students',
    meta: second,
    icon: 'search',
    tint: '#eaeffb',
    ink: '#244a9f',
    to: '/institution/students',
  },
  {
    id: 'staff',
    title: 'Invite your staff',
    meta: third,
    icon: 'userPlus',
    tint: '#ebf1ec',
    ink: '#2d5d33',
    to: '/institution/settings/staff',
  },
  {
    id: 'programme',
    title: 'Draft a scholarship',
    meta: fourth,
    icon: 'suitcase',
    tint: '#f5f3ff',
    ink: '#6d28d9',
    to: '/institution/programmes/new',
  },
];

const LOCKED_CARDS = [
  {
    id: 'roster',
    icon: 'sparkle',
    title: 'Student roster',
    text: 'Add students and link their GTH profiles.',
  },
  {
    id: 'badge',
    icon: 'shield',
    title: 'Verified institution badge',
    text: 'Records you approve show as institution verified.',
  },
  {
    id: 'credentials',
    icon: 'eye',
    title: 'Credentials',
    text: 'Issue signed certificates students can share.',
  },
];
const gateCards = (badge, foot) =>
  LOCKED_CARDS.map((c) => ({ ...c, badge, progressLabel: 'GES', fillPct: 61, foot }));

const SUBTITLE = 'Students and credentials open once all four checks pass.';
const CARDS_SUBTITLE = 'Everything below opens the moment you’re approved.';

export const GATES = {
  'under-review': {
    hero: {
      title: 'We’re checking your documents',
      subtitle:
        'A reviewer picked up your application this morning. You’ll hear from us by Tuesday 20 October.',
      action: { label: 'Contact support', href: 'mailto:institutions@ghanatalenthub.example' },
    },
    actions: GATE_ACTIONS('Opens after approval', 'Publish after approval'),
    checklist: {
      title: 'Your verification',
      subtitle: SUBTITLE,
      badge: '3 of 4 · in review',
      pct: 50,
      items: [
        { id: 'account', title: 'Account and institution', state: 'done', trailing: 'Done' },
        {
          id: 'documents',
          title: 'Accreditation documents',
          sub: 'Uploaded · 17 Oct',
          state: 'done',
          action: { label: 'View documents', to: '/institution/accreditation?view=list' },
        },
        {
          id: 'ges',
          title: 'GES check',
          sub: 'In review · started 18 Oct, 09:12',
          state: 'todo',
          trailing: 'Today',
        },
        {
          id: 'head',
          title: 'Head’s confirmation',
          sub: 'We’ll email Mrs Salamatu Yakubu, your head, to confirm',
          state: 'todo',
          trailing: 'Next',
        },
      ],
    },
    cards: {
      title: 'Unlocks when you’re verified',
      subtitle: CARDS_SUBTITLE,
      dashed: true,
      cards: gateCards('Locked', 'Unlocks at approval'),
    },
  },
  approved: {
    hero: {
      title: 'You’re verified, {first}',
      subtitle:
        '{institution} is now a verified institution. You can add students, verify records and issue credentials.',
      action: { label: 'Start the tour', to: '/institution?modal=welcome' },
    },
    actions: GATE_ACTIONS('Link GTH profiles', 'Open to your students'),
    checklist: {
      title: 'Your verification',
      subtitle: SUBTITLE,
      badge: '4 of 4 · approved',
      pct: 100,
      items: [
        { id: 'account', title: 'Account and institution', state: 'done', trailing: 'Done' },
        {
          id: 'documents',
          title: 'Accreditation documents',
          sub: 'All 4 accepted',
          state: 'done',
          action: { label: 'View documents', to: '/institution/accreditation?view=list' },
        },
        {
          id: 'ges',
          title: 'GES check',
          sub: 'Matched · 19 Oct',
          state: 'done',
          trailing: 'Done',
        },
        {
          id: 'head',
          title: 'Head’s confirmation',
          sub: 'Confirmed by Mrs Salamatu Yakubu',
          state: 'done',
          trailing: 'Done',
        },
      ],
    },
    cards: {
      title: 'Now unlocked',
      subtitle: 'You can use all of these now.',
      dashed: false,
      cards: gateCards('Unlocked', 'Ready now'),
    },
  },
  'needs-info': {
    hero: {
      title: 'We need one more document',
      subtitle:
        'Your letter on letterhead isn’t signed by the head. Upload a signed copy to keep your place in the queue.',
      action: { label: 'Upload document', to: '/institution/accreditation?view=list' },
    },
    actions: GATE_ACTIONS('Opens after approval', 'Publish after approval'),
    checklist: {
      title: 'Your verification',
      subtitle: SUBTITLE,
      badge: '3 of 4 · action needed',
      pct: 25,
      items: [
        { id: 'account', title: 'Account and institution', state: 'done', trailing: 'Done' },
        {
          id: 'documents',
          title: 'Accreditation documents',
          sub: 'Letter needs the head’s signature',
          state: 'todo',
          action: { label: 'Upload document', to: '/institution/accreditation?view=list' },
        },
        {
          id: 'ges',
          title: 'GES check',
          sub: 'Waiting for the signed letter',
          state: 'todo',
          trailing: 'Fix now',
        },
        {
          id: 'head',
          title: 'Head’s confirmation',
          sub: 'Waiting for the check above',
          state: 'todo',
          trailing: 'Paused',
        },
      ],
    },
    cards: {
      title: 'Unlocks when you’re verified',
      subtitle: CARDS_SUBTITLE,
      dashed: true,
      cards: gateCards('Locked', 'Unlocks at approval'),
    },
  },
  'not-approved': {
    tone: 'danger',
    hero: {
      title: 'We couldn’t verify your institution',
      subtitle:
        'The accreditation number GES/NR/SHS/0412 doesn’t match the name on your licence. You can appeal within 14 days.',
      action: { label: 'Start an appeal', to: '/institution/accreditation?view=list' },
    },
    actions: GATE_ACTIONS('Opens after approval', 'Publish after approval'),
    checklist: {
      title: 'Your verification',
      subtitle: SUBTITLE,
      badge: 'Not approved · 19 Oct',
      pct: 25,
      items: [
        { id: 'account', title: 'Account and institution', state: 'done', trailing: 'Done' },
        {
          id: 'documents',
          title: 'Accreditation documents',
          sub: 'Licence doesn’t match',
          state: 'todo',
          action: { label: 'Start an appeal', to: '/institution/accreditation?view=list' },
        },
        {
          id: 'ges',
          title: 'GES check',
          sub: 'Not matched with the official record',
          state: 'todo',
          trailing: 'Appeal by 2 Nov',
        },
        {
          id: 'head',
          title: 'Head’s confirmation',
          sub: 'Not needed until the appeal',
          state: 'todo',
          trailing: '—',
        },
      ],
    },
    cards: {
      title: 'Unlocks when you’re verified',
      subtitle: CARDS_SUBTITLE,
      dashed: true,
      cards: gateCards('Locked', 'Unlocks at approval'),
    },
  },
};
