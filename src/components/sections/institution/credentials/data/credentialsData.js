/*
 * credentialsData.js — the fixed copy of the Theme 11 credential screens (Figma 11.2.4a-j). Everything else comes from /api/institution/credentials
 * and the public /api/verify/:number (see services/institutionPortal.api.js).
 */

export const SORT_OPTIONS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
];

export const TYPE_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'completion', label: 'Completion' },
  { id: 'awards', label: 'Awards' },
];

/* "Credential type" of the issue form: the label is printed on the certificate, the kind files it under Completion / Awards. */
export const CREDENTIAL_TYPES = [
  { value: 'Certificate of completion', label: 'Certificate of completion', kind: 'completion' },
  { value: 'Award', label: 'Award', kind: 'award' },
  {
    value: 'Certificate of participation',
    label: 'Certificate of participation',
    kind: 'completion',
  },
];

const pad = (n) => String(n).padStart(2, '0');
export const todayText = () => {
  const d = new Date();
  return `${pad(d.getDate())} / ${pad(d.getMonth() + 1)} / ${d.getFullYear()}`;
};

export const emptyForm = () => ({
  rosterId: '',
  student: '',
  type: CREDENTIAL_TYPES[0].value,
  template: '',
  title: '',
  date: todayText(),
  grade: '',
  signedBy: '',
  second: '',
  email: false,
});

export const CORRECTION_NOTE =
  'Only spelling and date fixes can be corrected. Anything else needs a revocation.';
export const BULK_NOTE = (over) =>
  `Bulk issues of more than ${over} need a second staff member to approve before the certificates go out.`;

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
