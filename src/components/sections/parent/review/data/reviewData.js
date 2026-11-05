import fileIcon from '../../../../../assets/parent/review-file.svg';
import userCheckIcon from '../../../../../assets/parent/review-user-check.svg';
import walletIcon from '../../../../../assets/parent/review-wallet.svg';

/*
 * reviewData — copy and mock data of the To review page (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 06 To review and approvals" 10057:66783; persona Emma Mensah).
 * Every string is verbatim from the frames (texts.py): PR-01 10034:144662, PR-07 10051:19895, PR-08 10051:20146, PR-09 10051:20397, PR-01c 10047:18670, PR-02 10034:145407,
 * PR-06 10041:5262, PR-02b 10041:4530, PR-03 10034:146178, PR-03c 10056:3341, PR-03b 10041:4921, PR-04 10034:146870, PR-04b 10051:20648, PR-05 10033:6439. Mock only.
 */

export const REVIEW_TITLE = 'To review';
export const REVIEW_INTRO = 'A few things need your OK. Everything else just keeps you informed.';

export const TABS = [
  { id: 'all', label: 'All' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'evaluations', label: 'Evaluations' },
  { id: 'corrections', label: 'Corrections' },
  { id: 'payments', label: 'Payments' },
];

/* The three waiting items that are not corrections (the corrections come from the flags store). */
export const ITEMS = {
  certificate: {
    id: 'certificate',
    icon: fileIcon,
    title: 'Certificate · Intro to Python',
    sub: 'Abena · Ghana Code Club · issued 30 Sep · hidden from her profile until you decide',
    chip: 'Abena',
    action: 'Review',
  },
  evaluation: {
    id: 'evaluation',
    icon: userCheckIcon,
    title: 'Teacher evaluation from Mr Owusu',
    sub: 'Elliot · Achimota · Elliot sees it only if you approve',
    chip: 'Elliot',
    action: 'Review',
  },
  payment: {
    id: 'payment',
    icon: walletIcon,
    title: 'Payment request · GHS 90.00',
    sub: 'Abena · Python Basics · GTH Academy · expires in 46 h',
    chip: 'Abena',
    action: 'Decide',
  },
};

export const CORRECTION_ROW = {
  title: (flag) => `${flag.label} was corrected`,
  sub: (flag, ward) => `${ward.firstName} · you flagged it ${flag.flaggedOn}`,
  chip: 'Abena',
  action: 'Check',
};

export const EMPTY_TAB = 'Nothing to check here.';

export const CERTIFICATE = {
  title: 'Abena’s certificate',
  sub: 'Intro to Python · Ghana Code Club · issued 30 Sep 2026',
  previewTitle: 'Certificate of Completion',
  previewLine: 'Awarded to Abena Mensah · 6-week Python club · signed by K. Adjei',
  file: 'Open full file (PDF, 420 KB)',
  chip: 'Self-reported · not verified by GTH',
  body: 'If you approve, it appears on Abena’s profile with the self-reported label. If you decline, tell her why so she can fix it.',
  decline: 'Decline with a note',
  approve: 'Approve',
};

export const DECLINE = {
  title: 'Decline Abena’s certificate?',
  intro: 'It stays hidden from her profile. Tell her why so she can upload a better copy.',
  reasons: [
    { id: 'blurry', label: 'File is blurry' },
    { id: 'name', label: 'Not her name' },
    { id: 'course', label: 'Not from a real course' },
    { id: 'other', label: 'Other' },
  ],
  noteLabel: 'Note to Abena',
  noteHelp: 'At least 10 characters. Abena sees this note.',
  /* ⚠️ ASSUMPTION: Figma draws no error line for a note that is too short; the field uses the same shape as the flag dialogs. */
  noteError: 'Add a little more so Abena knows what to fix.',
  cancel: 'Cancel',
  submit: 'Decline and send note',
};

export const TOAST = {
  'certificate-approved': {
    message: 'Certificate approved',
    detail: 'Intro to Python now shows on Abena’s profile as self-reported.',
    action: 'Undo',
  },
  'evaluation-sent': {
    message: 'Sent to Elliot',
    detail: 'He’ll review Mr Owusu’s evaluation before it shows on his profile.',
    action: 'Undo',
  },
};

export const EVALUATION = {
  initials: 'KO',
  title: 'Mr Kwabena Owusu evaluated Elliot',
  meta: 'Teacher · Achimota School · submitted 16 Oct · not anonymous',
  answers: [
    {
      q: 'How does Elliot work with others?',
      a: 'Takes the lead in group work and makes sure quieter classmates are heard.',
    },
    {
      q: 'Strongest subject strengths',
      a: 'Physics and Elective Maths. Very good at explaining solutions.',
    },
    { q: 'Where could he grow?', a: 'Finishing written work on time; he rushes write-ups.' },
    { q: 'Would you recommend him for a science programme?', a: 'Yes, strongly.' },
  ],
  approve: 'Approve · send to Elliot',
  hide: 'Don’t show Elliot',
};

export const HIDE_EVALUATION = {
  title: 'Don’t show this to Elliot?',
  body: 'The evaluation is deleted. Elliot never sees it, and Mr Owusu isn’t told why.',
  tip: 'Tip: if only one answer is the problem, approve it and Elliot can flag that answer himself.',
  keep: 'Keep reviewing',
  confirm: 'Don’t show Elliot',
};

/* `page` is the label exactly as Figma prints it ("72th", "41th" are typos in the design and are kept); `pct` drives the bar (520px track). */
export const ASSESSMENT = {
  chip: 'Personality profile · Abena · completed 12 Oct',
  type: 'The Architect',
  body: 'Plans before building, spots risks early, likes clear structure. Shown to recruiters only in broad groups.',
  traits: [
    { id: 'conscientiousness', name: 'Conscientiousness', pct: 88, page: '88th percentile' },
    { id: 'openness', name: 'Openness', pct: 72, page: '72th percentile' },
    { id: 'agreeableness', name: 'Agreeableness', pct: 64, page: '64th percentile' },
    { id: 'extraversion', name: 'Extraversion', pct: 41, page: '41th percentile' },
  ],
  flag: 'Flag',
  /* ⚠️ ASSUMPTION: Figma draws no flagged state of a trait; after a flag is sent the link reads "Flagged". */
  flagged: 'Flagged',
};

const ordinal = (n) => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${{ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th'}`;
};

/* PW-04b's title prints the correct "41st"; the same helper gives the other traits their proper ordinal (⚠️ ASSUMPTION: only Extraversion is drawn). */
export const FLAG_RESULT = {
  title: (trait) => `Flag “${trait.name} · ${ordinal(trait.pct)} percentile”`,
  intro:
    'Scores can’t be changed, but a flag asks Abena to check it and our team to look. It’s hidden from recruiters while flagged.',
  reasons: [
    { id: 'not-her', label: 'Doesn’t sound like her' },
    { id: 'rushed', label: 'She rushed the test' },
    { id: 'other', label: 'Other' },
  ],
  noteLabel: 'What makes you think so?',
  noteHelp: 'At least 10 characters. Abena sees this note.',
  noteError: 'Add a little more so Abena and our team can look into it.',
  info: 'Abena can retake the personality profile after 90 days. The new result replaces this one.',
  cancel: 'Cancel',
  submit: 'Send flag',
};

export const CAUGHT_UP = {
  title: 'You’re all caught up',
  body: 'We’ll message you on WhatsApp when something needs your OK. Most weeks, nothing will.',
  home: 'Back to Home',
};

export const MIN_NOTE = 10;
