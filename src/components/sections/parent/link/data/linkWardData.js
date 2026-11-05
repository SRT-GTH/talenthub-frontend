import kwesiPhoto from '../../../../../assets/parent/kwesi.webp';
import elliotPhoto from '../../../../../assets/parent/elliot.webp';

/*
 * linkWardData — copy and mock data of the "Link a ward" flow (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 04 Link a ward" 10057:1093).
 * Every string is verbatim from the frames (texts.py): PW-07 10034:141501, PW-07c 10052:2534, PW-08 10034:142187, PW-07b 10052:530, PW-07e 10077:18651,
 * PW-07f 10077:18999, PW-07d 10052:3470, PW-09 10035:13112. Mock only: no backend.
 */

export const LINK_TITLE = 'Link another ward';
export const LINK_SUBTITLE =
  'Search by your ward’s name and date of birth. They’ll need to accept.';

export const SEARCH_COPY = {
  nameLabel: 'Ward’s full name',
  nameHint: 'As they wrote it on GTH',
  dobLabel: 'Date of birth',
  dobHint: 'DD / MM / YYYY',
  relationLabel: 'Relationship',
  matchOne: '1 match',
  matchNone: 'No match yet',
  send: 'Send link request',
};

/* Relationship chips: the search page draws six, the code dialog the first five (no "Younger sibling"). */
export const RELATIONS = [
  { id: 'son', label: 'Son' },
  { id: 'daughter', label: 'Daughter' },
  { id: 'nephew', label: 'Nephew' },
  { id: 'niece', label: 'Niece' },
  { id: 'ward', label: 'Ward' },
  { id: 'younger-sibling', label: 'Younger sibling' },
];
export const CODE_RELATIONS = RELATIONS.slice(0, 5);

/* The one drawn search result (PW-07 row "Kwesi M. · 15"). */
export const MATCH = {
  id: 'kwesi',
  firstName: 'Kwesi',
  title: 'Kwesi M. · 15',
  line: 'JHS 3 · Accra · joined 2 Oct',
  photo: kwesiPhoto,
};

/* ⚠️ ASSUMPTION: the mock "database" holds one child. A search matches when the normalised name and the digits of the date of birth equal these (the frames type exactly this). */
export const MOCK_CHILD = { name: 'kwesi mensah', dob: '04062011' };

export const NO_MATCH_COPY = {
  title: (name, dob) => `We couldn’t find ${name} born ${dob}`,
  body: 'Check the spelling matches what he used on GTH, or ask him for a link code. If he isn’t on GTH yet, invite him by SMS.',
  invite: 'Invite by SMS',
  haveCode: 'I have a link code',
};

export const SENT_COPY = {
  title: 'Request sent to Kwesi',
  body: 'He’ll get a notification and an SMS. Once he accepts, he appears in My wards and you’ll get the same controls as for Abena and Elliot.',
  chip: 'Pending link · expires in 14 days',
  back: 'Back to My wards',
  cancel: 'Cancel request',
};

export const CODE_LENGTH = 6;
export const CODE_COPY = {
  title: 'Enter your link code',
  body: 'Your child can find a 6-character code in their GTH Settings › Parent or guardian. Codes last 24 hours.',
  relationLabel: 'Relationship',
  cancel: 'Cancel',
  submit: 'Link ward',
  retry: 'Try again',
  newCode: 'Enter a new code',
  error: {
    title: 'That code didn’t work',
    body: 'Check the 6 characters with your child and try again. 2 tries left, then linking pauses for 15 minutes.',
  },
  expired: {
    title: 'This code has expired',
    body: 'Codes last 24 hours. Ask your child to make a new one in Settings › Parent or guardian.',
  },
};

/* ⚠️ ASSUMPTION: Figma draws the three code outcomes but not the rule that picks one. The mock picks by the typed code: the drawn error code, the expired one, anything else links. */
export const MOCK_CODES = { wrong: 'K7M4Q2', expired: 'K7M4E0' };

export const INSTITUTION_COPY = {
  title: 'Caring for 100 or more children?',
  body: 'Parent accounts are for families. Orphanages, boarding houses and schools register as an institution to manage many children safely.',
  points: [
    'Upload a whole roster at once',
    'Staff accounts with the right access',
    'Guardian consent handled for you',
  ],
  keep: 'Keep as a parent',
  register: 'Register an institution',
};

/* PW-09 — shown over the parent home when a child who signed up with the parent's phone number is linked straight away. */
export const WARD_LINKED = {
  title: 'Elliot linked to your account',
  body: 'He signed up with your phone number, so he was linked automatically.',
  ward: {
    id: 'elliot',
    name: 'Elliot Mensah · Son',
    line: '15 · SHS 1 · Achimota School',
    photo: elliotPhoto,
    status: 'Active',
  },
  note: 'Elliot can use guidance, assessments and volunteer roles. He can’t apply for paid work or message recruiters. If you have concerns, you can opt him out at any time.',
  optOut: 'Opt out',
  see: 'See Elliot',
};

/* Digits of a date of birth shown as the drawn "04 / 06 / 2011". */
export const formatDob = (digits = '') => {
  const d = digits.replace(/\D/g, '').slice(0, 8);
  const parts = [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean);
  return parts.join(' / ');
};

/* "04062011" -> "04/06/2011" (the no-match sentence prints it without spaces). */
export const dobSentence = (digits = '') =>
  [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(Boolean).join('/');

export const findMatch = (name = '', dob = '') =>
  name.trim().toLowerCase().replace(/\s+/g, ' ') === MOCK_CHILD.name && dob === MOCK_CHILD.dob
    ? MATCH
    : null;
