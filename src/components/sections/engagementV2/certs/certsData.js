/*
 * Certifications stage data (Figma CE-01..CE-06, Focused 8285:17367.. / Playful 7712:2..). UI cert shape:
 *   { id, title, issuer, type, issueDate 'MM / YYYY', expiryDate, noExpiry, credentialId, link, linkLabel, skills[],
 *     status, dateLabel, file, verifiedNote, raw? }
 *   status: 'verified' | 'pending' | 'self'
 *   dateLabel: the meta-line text exactly as drawn ("Issued Mar 2024 · No expiry", "Jan 2024 – Jan 2027", ...)
 * MOCK_CERTS / SAMPLE_REMINDER feed the signed-out demo frames only. Signed-in talents load / save
 * profile.certifications through certFromProfile / certToProfile (bottom of this file); `raw` is the source item.
 */
import { debug } from '../../../../utils/debug.js';

const log = debug('certsData');

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
    file: form.upload?.url ? { ...form.upload } : (prev?.file ?? null),
    verifiedNote: prev?.verifiedNote ?? '',
  };
};

/*
 * profile.certifications item <-> UI cert. Schema: { name, issuingOrganization, issueDate (required), expirationDate,
 * credentialID, credentialURL, certificateFile: { secure_url }, skillsGained[] } (+ _id).
 *   title <-> name;  issuer <-> issuingOrganization;  issueDate / expiryDate 'MM / YYYY' <-> ISO date (1st of month);
 *   credentialId <-> credentialID;  link <-> credentialURL;  skills <-> skillsGained.
 * Type and "No expiry" have no slot (no expiry = expirationDate omitted). Status is derived, never stored: a credential
 * ID or link = 'pending' (being checked), otherwise 'self'. Writing spreads the original item's schema keys (keeps _id,
 * certificateFile); a date whose month is unchanged keeps its stored value. certToProfile returns null when the issue date
 * can't be parsed (it is required; the form blocks saving instead of inventing one).
 */
const CERT_KEYS = [
  '_id',
  'name',
  'issuingOrganization',
  'issueDate',
  'expirationDate',
  'credentialID',
  'credentialURL',
  'certificateFile',
  'skillsGained',
];

const toMonthYear = (date) => {
  if (!date) return '';
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getUTCMonth() + 1).padStart(2, '0')} / ${d.getUTCFullYear()}`;
};

const toIsoMonth = (value) => {
  const m = /^\s*(\d{1,2})\s*\/?\s*(\d{4})\s*$/.exec(value ?? '');
  if (!m || Number(m[1]) < 1 || Number(m[1]) > 12) return null;
  return `${m[2]}-${m[1].padStart(2, '0')}-01`;
};

export const certStatus = ({ credentialId, link }) =>
  (credentialId || '').trim() || (link || '').trim() ? 'pending' : 'self';

export const certFromProfile = (item, index) => {
  const base = {
    id: String(item?._id ?? item?.id ?? `c${index}`),
    title: item?.name || '',
    issuer: item?.issuingOrganization || '',
    type: '',
    issueDate: toMonthYear(item?.issueDate),
    expiryDate: toMonthYear(item?.expirationDate),
    noExpiry: false,
    credentialId: item?.credentialID || '',
    link: item?.credentialURL || '',
    skills: Array.isArray(item?.skillsGained) ? [...item.skillsGained] : [],
  };
  return {
    ...base,
    status: certStatus(base),
    dateLabel: buildDateLabel(base),
    linkLabel: base.link ? 'Credential link' : '',
    // 2026-11-01: the stored certificate file (certificateFile.secure_url) shows on the card and in Edit.
    file: item?.certificateFile?.secure_url
      ? {
          name: decodeURIComponent(
            String(item.certificateFile.secure_url).split('/').pop() || 'Certificate file'
          ),
          size: '',
          url: item.certificateFile.secure_url,
          filled: 0,
        }
      : null,
    verifiedNote: '',
    raw: item,
  };
};

export const certToProfile = (cert) => {
  const raw = cert.raw || {};
  const out = {};
  CERT_KEYS.forEach((k) => {
    if (raw[k] !== undefined) out[k] = raw[k];
  });
  out.name = cert.title;
  out.issuingOrganization = cert.issuer;
  if (!(raw.issueDate && toMonthYear(raw.issueDate) === cert.issueDate)) {
    const issued = toIsoMonth(cert.issueDate);
    if (!issued) {
      log.warn('no valid issue date for', cert.title, '- not saveable');
      return null;
    }
    out.issueDate = issued;
  }
  const expiry = cert.noExpiry ? null : toIsoMonth(cert.expiryDate);
  if (!expiry) delete out.expirationDate;
  else if (toMonthYear(raw.expirationDate) !== cert.expiryDate) out.expirationDate = expiry;
  const credentialId = (cert.credentialId || '').trim();
  if (credentialId) out.credentialID = credentialId;
  else delete out.credentialID;
  const link = (cert.link || '').trim();
  if (link) out.credentialURL = link;
  else delete out.credentialURL;
  out.skillsGained = [...(cert.skills || [])];
  if (cert.file?.url) out.certificateFile = { secure_url: cert.file.url };
  return out;
};

/*
 * After a save + re-read: attach the stored item as `raw` (so later saves carry its _id). The local `id` never changes
 * (open dialogs / URLs keep pointing at it). Items that already had an _id are matched by it; items without one
 * take the stored items whose _id no local item claims, in order. Returns null when the lists don't line up.
 */
export const adoptSavedIds = (list, saved) => {
  if (!Array.isArray(saved) || saved.length !== list.length) return null;
  const byId = new Map(saved.filter((s) => s?._id).map((s) => [String(s._id), s]));
  const claimed = new Set(list.map((x) => x.raw?._id && String(x.raw._id)).filter(Boolean));
  const fresh = saved.filter((s) => s?._id && !claimed.has(String(s._id)));
  let ok = true;
  const next = list.map((x) => {
    const own = x.raw?._id ? byId.get(String(x.raw._id)) : fresh.shift();
    if (!own) {
      ok = false;
      return x;
    }
    return { ...x, raw: own };
  });
  return ok ? next : null;
};
