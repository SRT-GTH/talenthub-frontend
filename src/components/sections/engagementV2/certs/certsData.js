/*
 * Mock data for the Certifications stage (Figma CE-01..CE-06, Focused 8285:17367.. / Playful 7712:2..). API-shaped:
 * swap MOCK_CERTS / REMINDER for the real endpoints and keep the shape.
 *   status: 'verified' | 'pending' | 'self'
 *   dateLabel: the meta-line text exactly as drawn ("Issued Mar 2024 · No expiry", "Jan 2024 – Jan 2027", ...)
 */
export const MOCK_CERTS = [
  {
    id: 'gda',
    title: 'Google Data Analytics Certificate',
    issuer: 'Coursera / Google',
    type: 'Online course',
    issueDate: '03 / 2024',
    expiryDate: '',
    noExpiry: true,
    credentialId: 'GDA-2024-KA7',
    link: 'coursera.org/verify/GDA-2024-KA7',
    linkLabel: 'Credential link',
    skills: ['Data analytics', 'SQL', 'Tableau'],
    status: 'verified',
    dateLabel: 'Issued Mar 2024 · No expiry',
    file: { name: 'google-data-analytics.pdf', size: '1.2 MB', filled: 6 },
    verifiedNote: 'Verified by Coursera on 12 Mar 2024.',
  },
  {
    id: 'aws',
    title: 'AWS Cloud Practitioner',
    issuer: 'Amazon Web Services',
    type: '',
    issueDate: '01 / 2024',
    expiryDate: '01 / 2027',
    noExpiry: false,
    credentialId: 'AWS-CP-24-91X',
    link: '',
    linkLabel: 'Badge link',
    skills: ['Cloud', 'AWS'],
    status: 'verified',
    dateLabel: 'Jan 2024 – Jan 2027',
    file: null,
    verifiedNote: '',
  },
  {
    id: 'scrum',
    title: 'Scrum Fundamentals Certified',
    issuer: 'SCRUMstudy',
    type: '',
    issueDate: '04 / 2024',
    expiryDate: '',
    noExpiry: false,
    credentialId: '',
    link: '',
    linkLabel: '',
    skills: ['Agile', 'Scrum'],
    status: 'pending',
    dateLabel: 'Issued Apr 2024',
    file: null,
    verifiedNote: '',
  },
  {
    id: 'wassce',
    title: 'WASSCE · Aggregate 6',
    issuer: 'WAEC Ghana',
    type: '',
    issueDate: '',
    expiryDate: '',
    noExpiry: false,
    credentialId: '',
    link: '',
    linkLabel: '',
    skills: ['Science'],
    status: 'self',
    dateLabel: '2021',
    file: null,
    verifiedNote: '',
  },
];

/* The "Expiry reminders" rail card as drawn (also shown on the empty screen). */
export const SAMPLE_REMINDER = {
  title: 'AWS Cloud Practitioner',
  text: 'Expires Jan 2027. We’ll remind you 60 days before.',
};

/* The drawn example entry on the empty screen (CE-01). */
export const EXAMPLE_CERT = {
  id: 'example',
  title: 'Google Data Analytics Certificate',
  issuer: 'Coursera / Google',
  idLine: 'ID GDA-2024-KA7',
  dateLabel: 'Issued Mar 2024 · No expiry',
  skills: ['Data analytics', 'SQL', 'Tableau'],
  linkLabel: 'Credential link',
};

export const STATUS_LABEL = {
  verified: 'Verified',
  pending: 'Pending check',
  self: 'Self-reported',
};
export const TYPE_OPTIONS = ['Online course'];

/* Stats drawn in the stage-complete dialog (static in Figma). */
export const COMPLETE_STATS = {
  stages: '7/9',
  profile: '78%',
  earnedFocused: '+40 pts',
  earnedPlayful: '+40 XP',
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const parseMonthYear = (value) => {
  const m = /^\s*(\d{1,2})\s*\/?\s*(\d{4})\s*$/.exec(value ?? '');
  if (!m) return null;
  const month = Number(m[1]);
  if (month < 1 || month > 12) return null;
  return { label: `${MONTHS[month - 1]} ${m[2]}`, year: m[2] };
};

/* Meta-line text, in the three shapes Figma draws. */
export const buildDateLabel = ({ issueDate, expiryDate, noExpiry }) => {
  const issued = parseMonthYear(issueDate);
  if (!issued) return '';
  if (noExpiry) return `Issued ${issued.label} · No expiry`;
  const exp = parseMonthYear(expiryDate);
  return exp ? `${issued.label} – ${exp.label}` : `Issued ${issued.label}`;
};

export const countStatuses = (certs) => ({
  verified: certs.filter((c) => c.status === 'verified').length,
  pending: certs.filter((c) => c.status === 'pending').length,
  self: certs.filter((c) => c.status === 'self').length,
});

/* Confetti in the stage-complete art (Figma "Art" 560x176): [left, top, w, h, rotateDeg, colour, opacity]. */
export const CONFETTI = [
  [427, 28, 5, 11, -46, '#c0392b', 0.9],
  [407, 17, 5, 11, 68, '#c0392b', 0.9],
  [117, 48, 5, 11, 51, '#ffd86b', 0.9],
  [55, 82, 5, 11, -48, '#ffd86b', 0.9],
  [102, 91, 5, 11, -2, '#387440', 1],
  [49, 136, 5, 11, 85, '#c8951a', 0.9],
  [125, 145, 5, 11, -56, '#387440', 1],
  [422, 106, 5, 11, -39, '#c0392b', 0.9],
  [528, 74, 5, 11, -48, '#c8951a', 0.9],
  [75, 30, 5, 11, 49, '#ffd86b', 0.9],
  [85, 16, 5, 11, 77, '#c0392b', 0.9],
  [475, 78, 5, 11, -48, '#c8951a', 0.9],
  [111, 116, 5, 11, 28, '#ffd86b', 0.9],
  [129, 73, 5, 11, -74, '#387440', 1],
  [117, 106, 5, 11, 26, '#387440', 1],
  [69, 73, 5, 11, -1, '#3062d4', 0.9],
  [455, 75, 5, 11, -11, '#c0392b', 0.9],
  [137, 115, 5, 11, -66, '#c8951a', 0.9],
  [422, 125, 5, 11, 84, '#c8951a', 0.9],
  [470, 115, 5, 11, 25, '#3062d4', 0.9],
];

/* Build a stored cert from the form (new certs: ID or link -> pending check, else self-reported). */
export const buildCert = (form, prev) => {
  const issue = parseMonthYear(form.issueDate);
  const dateLabel = buildDateLabel(form);
  const status =
    prev?.status ?? (form.credentialId.trim() || form.link.trim() ? 'pending' : 'self');
  return {
    id: prev?.id ?? `c${Date.now()}`,
    ...form,
    issueDate: issue ? form.issueDate : '',
    dateLabel,
    linkLabel: form.link.trim() ? (prev?.linkLabel ?? 'Credential link') : '',
    status,
    file: prev?.file ?? null,
    verifiedNote: prev?.verifiedNote ?? '',
  };
};
