/*
 * credentialsData.js — MOCK data of the Theme 11 credential screens (Figma 11.2.4a-j, canvas 8520:10; shaped like the future
 * GET /institution/credentials?status=…, POST /institution/credentials, POST /institution/credentials/:id/revocation (first / second approver),
 * POST /institution/credentials/:id/corrected, POST /institution/credentials/bulk and the public GET /verify/:credentialId responses).
 * All names are sample data from the frames.
 */

export const CREDENTIAL_COUNTS = {
  valid: 306,
  revoked: 2,
  all: 312,
  drafts: 4,
  completion: 241,
  awards: 71,
};

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
];

export const TYPE_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'completion', label: 'Completion' },
  { id: 'awards', label: 'Awards' },
];

/*
 * The issued list (Figma 11.2.4a). status: valid | revoking | revoked | draft. kind: completion | award. `issuedOn` is the sort key (ISO) and `issuedLabel` the pill text.
 * Yaw's credential waits for a second approver ("1 of 2 approved"; Kwame Asante asked first).
 */
export const CREDENTIALS = [
  {
    id: 'cred-3',
    student: 'Abena Mahama',
    initials: 'AM',
    status: 'valid',
    kind: 'completion',
    kindLabel: 'Completion',
    number: 'GTH-CR-0412-00318',
    title: 'Certificate of completion',
    sub: 'Certificate of completion · Form 3 science · GTH-CR-0412-00318',
    issuedOn: '2026-10-18',
    issuedLabel: 'Issued 18 Oct',
  },
  {
    id: 'cred-4',
    student: 'Akosua Sarpong',
    initials: 'AS',
    status: 'valid',
    kind: 'award',
    kindLabel: 'Award',
    number: 'GTH-CR-0412-00311',
    title: 'Debate champion 2026',
    sub: 'Debate champion 2026 · GTH-CR-0412-00311',
    issuedOn: '2026-10-12',
    issuedLabel: 'Issued 12 Oct',
  },
  {
    id: 'cred-5',
    student: 'Ibrahim Yakubu',
    initials: 'IY',
    status: 'valid',
    kind: 'completion',
    kindLabel: 'Completion',
    number: 'GTH-CR-0412-00307',
    title: 'Robotics club · 2 years',
    sub: 'Robotics club · 2 years · GTH-CR-0412-00307',
    issuedOn: '2026-10-09',
    issuedLabel: 'Issued 9 Oct',
  },
  {
    id: 'cred-6',
    student: 'Esi Quaye',
    initials: 'EQ',
    status: 'valid',
    kind: 'award',
    kindLabel: 'Award',
    number: 'GTH-CR-0412-00299',
    title: 'Best in Home Economics',
    sub: 'Best in Home Economics · GTH-CR-0412-00299',
    issuedOn: '2026-10-04',
    issuedLabel: 'Issued 4 Oct',
  },
  {
    id: 'cred-7',
    student: 'Kofi Danso',
    initials: 'KD',
    status: 'valid',
    kind: 'completion',
    kindLabel: 'Completion',
    number: 'GTH-CR-0412-00297',
    title: 'Certificate of completion · Business',
    sub: 'Certificate of completion · Business · GTH-CR-0412-00297',
    issuedOn: '2026-10-03',
    issuedLabel: 'Issued 3 Oct',
  },
  {
    id: 'cred-1',
    student: 'Yaw Adomako',
    initials: 'YA',
    status: 'revoking',
    kind: 'award',
    kindLabel: 'Award',
    number: 'GTH-CR-0412-00203',
    title: 'Sports prefect',
    sub: 'Sports prefect · GTH-CR-0412-00203 · issued in error',
    issuedOn: '2026-02-02',
    issuedLabel: 'Issued 2 Feb',
    issuedLong: '2 Feb 2026',
    reason: 'issued to the wrong student',
    approvals: 1,
    askedBy: 'Kwame Asante',
  },
];

/*
 * ⚠️ ASSUMPTION: the four drafts (tab "Drafts 4") are not drawn; they are sample rows in the same layout, with the "Draft" label of the preview.
 */
export const DRAFTS = [
  {
    id: 'draft-1',
    student: 'Nana Owusu',
    initials: 'NO',
    status: 'draft',
    kind: 'completion',
    kindLabel: 'Completion',
    number: 'GTH-CR-0412-00319',
    title: 'Certificate of completion',
    sub: 'Certificate of completion · Form 3 science · GTH-CR-0412-00319',
    issuedOn: '2026-10-18',
    issuedLabel: 'Draft',
  },
  {
    id: 'draft-2',
    student: 'Selina Tetteh',
    initials: 'ST',
    status: 'draft',
    kind: 'award',
    kindLabel: 'Award',
    number: 'GTH-CR-0412-00320',
    title: 'Science fair award',
    sub: 'Science fair award · GTH-CR-0412-00320',
    issuedOn: '2026-10-17',
    issuedLabel: 'Draft',
  },
  {
    id: 'draft-3',
    student: 'Efua Boateng',
    initials: 'EB',
    status: 'draft',
    kind: 'completion',
    kindLabel: 'Completion',
    number: 'GTH-CR-0412-00321',
    title: 'Certificate of completion',
    sub: 'Certificate of completion · Form 3 science · GTH-CR-0412-00321',
    issuedOn: '2026-10-16',
    issuedLabel: 'Draft',
  },
  {
    id: 'draft-4',
    student: 'Musah Alhassan',
    initials: 'MA',
    status: 'draft',
    kind: 'award',
    kindLabel: 'Award',
    number: 'GTH-CR-0412-00322',
    title: 'Quiz champion',
    sub: 'Quiz champion · GTH-CR-0412-00322',
    issuedOn: '2026-10-15',
    issuedLabel: 'Draft',
  },
];

/* ---- banners (Figma 11.2.4a / 11.2.4f) ---- */
export const WAITING_BANNER =
  '1 revocation is waiting for a second approver. Revocations need two staff to agree.';
export const REVOKED_BANNER =
  'Yaw’s sports prefect credential is revoked. gth.com/verify now shows it as revoked, and Yaw has been told why.';
export const REVOKED_TOAST = 'Credential revoked · approved by you and Kwame Asante';

/* ---- the issue form (Figma 11.2.4b): ⚠️ ASSUMPTION the form opens filled with the drawn sample ---- */
export const FORM_DEFAULTS = {
  student: 'Abena Mahama · Form 3',
  type: 'Certificate of completion',
  template: 'Savannah Hills · green seal',
  title: 'Form 3 General Science',
  date: '18 / 10 / 2026',
  grade: '',
  signedBy: 'Iddrisu Abdul-Rahman, Registrar',
  second: 'Mrs Salamatu Yakubu, Headmistress',
  email: false,
};
export const TEMPLATES = ['Savannah Hills · green seal'];
/* Preview shows "Distinction" while the form leaves the grade empty (Figma inconsistency kept). */
export const PREVIEW_GRADE_FALLBACK = 'Distinction';
export const NEXT_NUMBER = 318;
export const NUMBER_PREFIX = 'GTH-CR-0412-';

/* ---- bulk issue (Figma 11.2.4h) ---- */
export const BULK = {
  className: 'Form 3',
  inClass: 247,
  willReceive: 231,
  waiting: 16,
  rows: [
    { id: 'template', setting: 'Template', value: 'Certificate of completion · 2026' },
    { id: 'class', setting: 'Class', value: 'Form 3 · all programmes' },
    {
      id: 'signed',
      setting: 'Signed by',
      value: 'Iddrisu Abdul-Rahman, Registrar · and Headmistress',
    },
    { id: 'second', setting: 'Second approver', value: 'Kwame Asante (Assistant Head)' },
  ],
  approverNote:
    'Bulk issues of more than 50 need a second approver. Kwame gets a request and the certificates go out when he approves.',
};

/* ---- corrected copy (Figma 11.2.4g) ---- */
export const CORRECTION = {
  credentialId: 'cred-7',
  firstName: 'Kofi',
  rows: [
    { id: 'name', field: 'Student name', was: 'Kofi Dansoh', now: 'Kofi Danso' },
    { id: 'programme', field: 'Programme', was: 'Business', now: 'Business' },
    { id: 'id', field: 'Credential ID', was: 'GTH-CR-0412-00297', now: 'GTH-CR-0412-00297 (v2)' },
    { id: 'issued', field: 'Issued', was: '3 Oct 2026', now: '3 Oct 2026 · corrected 19 Oct' },
  ],
  note: 'Only spelling and date fixes can be corrected. Anything else needs a revocation with two approvals.',
};

/* ---- preview / detail page (Figma 11.2.4c) ---- */
export const ISSUER = {
  school: 'Savannah Hills Senior High School',
  line: 'SHS · Tamale · GES/NR/SHS/0412',
  signer: 'Iddrisu Abdul-Rahman',
  signerRole: 'Registrar · Savannah Hills SHS',
  secondSignatory: 'Mrs Salamatu Yakubu',
  secondSignatoryTitle: 'Headmistress',
  institutionShort: 'Savannah Hills SHS',
};
export const LINKED_RECORDS = [
  { id: 'l-1', label: 'WASSCE mock · verified', verified: true },
  { id: 'l-2', label: 'Term 1 report', verified: true },
  { id: 'l-3', label: 'Term 2 report', verified: true },
  { id: 'l-4', label: 'Science fair award', verified: true },
  { id: 'l-5', label: 'Term 3 report · pending', verified: false },
];

/* ---- public verification (Figma 11.2.4i, j). The lookup is by credential id (cred-1 .. ) or by the printed number. ---- */
export const VERIFY_CHECKED_AT = 'Checked 19 Oct 2026, 08:14.';
export const VERIFY_RECORDS = {
  valid: {
    id: 'cred-2',
    status: 'valid',
    number: 'GTH-CR-0412-00297',
    holder: 'Kofi Danso',
    credential: 'Certificate of completion · Business',
    credentialId: 'GTH-CR-0412-00297 (v2, corrected 19 Oct 2026)',
    issued: '3 Oct 2026',
    signedBy: 'Iddrisu Abdul-Rahman, Registrar',
    signature: 'Valid · institution key ending 91F2',
  },
  revoked: {
    id: 'cred-1',
    status: 'revoked',
    number: 'GTH-CR-0412-00203',
    holder: 'Yaw Adomako',
    credential: 'Sports prefect · 2026',
    credentialId: 'GTH-CR-0412-00203',
    issued: '2 Feb 2026',
    revoked: '18 Oct 2026 · approved by two staff',
    reason: 'Issued to the wrong student',
  },
};
export const VERIFY_ISSUED_BY =
  'Savannah Hills Senior High School · GES/NR/SHS/0412 · verified institution';
export const VERIFY_POINTS = [
  {
    id: 'source',
    title: 'Signed at source',
    body: 'Only verified schools and programmes can issue credentials on GTH.',
  },
  {
    id: 'tamper',
    title: 'Tamper-proof',
    body: 'Any change to the certificate breaks the signature.',
  },
  {
    id: 'current',
    title: 'Always current',
    body: 'Revoked or corrected credentials update here straight away.',
  },
];

/* ---- copy the frames do not draw (⚠️ ASSUMPTION: short confirmations of the actions the frames only imply) ---- */
export const TOAST_CORRECTED = 'Corrected copy issued · gth.com/verify shows the new version';
export const TOAST_BULK =
  'Sent to Kwame Asante for approval · 231 certificates go out when he approves';
export const TOAST_LINK_COPIED = 'Verify link copied';

/* ⚠️ ASSUMPTION: the copy says "she / he" for the students drawn in the frames and "they" for any other name. */
export const PRONOUNS = {
  Abena: { subject: 'She', object: 'her' },
  Kofi: { subject: 'He', object: 'him' },
  Yaw: { subject: 'He', object: 'him' },
};
export const PRONOUN_FALLBACK = { subject: 'They', object: 'them' };

/* Figma 11.2.4a: the first four rows draw the dark "View" button, Kofi's the light one (⚠️ ASSUMPTION: dark = issued on or after this day). */
export const VIEW_DARK_SINCE = '2026-10-04';
