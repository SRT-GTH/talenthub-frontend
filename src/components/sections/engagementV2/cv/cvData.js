/*
 * Upload my CV — review data + pure helpers.
 *   Demo (signed out): createMockParseResult, built ONLY from what the Figma frames draw (canvas 3125:10352, section
 *   "Upload my CV (new)").
 *   Live (signed in): resultFromExtraction maps the POST /profiles/cv/extract answer (services/cv.api.js) to the same
 *   review shape; each live item also carries `data` (the extracted item, as edited by the talent), and
 *   mergeCvIntoProfile turns the ticked items into ONE /profiles/fields write.
 *
 * review result shape:
 *   { file: { name, sizeKb, type, pages, words },
 *     roles:        [{ id, title, employer, start, end, location, employmentType, flagged, checked, data? }],
 *     education:    [{ id, title, institution, period, detail, checked, data? }],
 *     skills:       [{ id, label, checked, data? }],
 *     certificates: [{ id, title, issuer, year, note, checked, data?, incomplete? }],
 *     warnings?:    [string] }
 */

export const CV_STEPS = [
  'choose',
  'uploading',
  'unsupported',
  'reading',
  'failed',
  'review',
  'done',
];

export const MOCK_FILE = {
  name: 'Kofi_Agyekum_CV_2026.pdf',
  sizeKb: 248,
  type: 'PDF',
  pages: 2,
  words: 612,
};

// Frame states (CV-02 64%, CV-03 bar 240/500 = 48%).
export const FRAME_UPLOAD_PERCENT = 64;
export const FRAME_READ_PERCENT = 48;
export const MOCK_UNSUPPORTED_NAME = 'Kofi_CV.pages';

export const createMockParseResult = () => ({
  file: { ...MOCK_FILE },
  roles: [
    {
      id: 'role-1',
      title: 'Junior Frontend Developer',
      employer: 'Hubtel',
      start: 'Jan 2024',
      end: 'now',
      location: 'Accra',
      employmentType: 'Full-time',
      flagged: false,
      checked: true,
    },
    {
      id: 'role-2',
      title: 'Software Engineering Intern',
      employer: 'Hubtel',
      start: 'Jun 2023',
      end: 'Dec 2023',
      location: 'Accra',
      employmentType: 'Internship',
      flagged: false,
      checked: true,
    },
    {
      id: 'role-3',
      title: 'ICT Instructor',
      employer: 'Accra Technical Training Centre',
      start: 'Sep 2022',
      end: '',
      location: '',
      employmentType: 'National service',
      flagged: true,
      checked: true,
    },
  ],
  education: [
    {
      id: 'edu-1',
      title: 'BSc Computer Science',
      institution: 'University of Ghana',
      period: '2018 – 2022',
      detail: 'Second Class Upper',
      checked: true,
    },
  ],
  skills: [
    { id: 'sk-react', label: 'React', checked: true },
    { id: 'sk-ts', label: 'TypeScript', checked: true },
    { id: 'sk-py', label: 'Python', checked: true },
    { id: 'sk-dj', label: 'Django', checked: true },
    { id: 'sk-sql', label: 'SQL', checked: true },
    { id: 'sk-git', label: 'Git', checked: true },
    { id: 'sk-teach', label: 'Teaching', checked: true },
    { id: 'sk-figma', label: 'Figma', checked: true },
    { id: 'sk-office', label: 'Microsoft Office', checked: false },
  ],
  certificates: [
    {
      id: 'cert-1',
      title: 'Google Data Analytics',
      issuer: 'Coursera',
      year: '2023',
      note: '',
      checked: true,
    },
    {
      id: 'cert-2',
      title: 'AWS Cloud Practitioner',
      issuer: '',
      year: '2024',
      note: 'we couldn’t find a credential ID',
      checked: false,
    },
  ],
});

/* The Fix-a-role frame (CV-04b) opened by URL: End already typed by the user. */
export const FIX_DEEPLINK_END = 'Aug 2023';

/* Accepted: PDF, Word, or up to 3 photos (JPG, PNG), 10 MB in total (copy on CV-01 / CV-02b). */
const MAX_BYTES = 10 * 1024 * 1024;
const WORD = ['doc', 'docx'];
const IMAGE = ['jpg', 'jpeg', 'png'];
const extOf = (name) => (name.includes('.') ? name.split('.').pop().toLowerCase() : '');

export const classifyFile = (file) => {
  const ext = extOf(file.name);
  if (ext === 'pdf') return 'PDF';
  if (WORD.includes(ext)) return 'Word';
  if (IMAGE.includes(ext)) return 'Photo';
  return null;
};

/* -> { ok: true, files, kind } | { ok: false, badName } */
export const validateFiles = (files) => {
  const list = Array.from(files ?? []);
  if (list.length === 0) return { ok: false, badName: '' };
  const total = list.reduce((n, f) => n + f.size, 0);
  const bad = list.find((f) => !classifyFile(f));
  if (bad) return { ok: false, badName: bad.name };
  const kinds = new Set(list.map(classifyFile));
  const photos = list.filter((f) => classifyFile(f) === 'Photo').length;
  const shapeOk = kinds.has('Photo') ? kinds.size === 1 && photos <= 3 : list.length === 1;
  if (!shapeOk || total > MAX_BYTES) return { ok: false, badName: list[0].name };
  return { ok: true, files: list, kind: classifyFile(list[0]) };
};

export const describeFile = (files) => {
  const first = files[0];
  const kb = Math.max(1, Math.round(files.reduce((n, f) => n + f.size, 0) / 1024));
  return { name: first.name, sizeKb: kb, type: classifyFile(first) };
};

export const formatRoleMeta = (role) => {
  const dates = `${role.start} – ${role.end || '?'}`;
  return [dates, role.location, role.employmentType].filter(Boolean).join(' · ');
};

export const countChecked = (result) =>
  result.roles.filter((r) => r.checked).length +
  result.education.filter((e) => e.checked).length +
  result.skills.filter((s) => s.checked).length +
  result.certificates.filter((c) => c.checked).length;

/* ---------------------------------------------------------------- live (signed-in) helpers ---------------------- */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/* 'YYYY-MM' -> 'Jan 2024' ('' when missing). */
export const monthLabel = (ym) => {
  const m = /^(\d{4})-(\d{2})/.exec(String(ym || ''));
  if (!m) return '';
  const i = Number(m[2]) - 1;
  return i >= 0 && i < 12 ? `${MONTHS[i]} ${m[1]}` : '';
};

/* Typed month -> 'YYYY-MM' or null. Accepts 'Jan 2024', 'January 2024', '2024-01', '01/2024'. */
export const parseMonth = (text) => {
  const t = String(text || '').trim();
  let m = /^(\d{4})-(\d{1,2})$/.exec(t);
  if (m) return Number(m[2]) >= 1 && Number(m[2]) <= 12 ? `${m[1]}-${m[2].padStart(2, '0')}` : null;
  m = /^(\d{1,2})\/(\d{4})$/.exec(t);
  if (m) return Number(m[1]) >= 1 && Number(m[1]) <= 12 ? `${m[2]}-${m[1].padStart(2, '0')}` : null;
  m = /^([A-Za-z]{3,9})\.?\s+(\d{4})$/.exec(t);
  if (m) {
    const i = MONTHS.findIndex((x) => x.toLowerCase() === m[1].slice(0, 3).toLowerCase());
    return i >= 0 ? `${m[2]}-${String(i + 1).padStart(2, '0')}` : null;
  }
  return null;
};

/* Typed year -> number or null. */
export const parseYear = (text) => {
  const t = String(text ?? '').trim();
  return /^\d{4}$/.test(t) ? Number(t) : null;
};

const str = (v) => (typeof v === 'string' ? v.trim() : '');
const yearOrNull = (v) => {
  const n = Number(v);
  return v !== null && v !== '' && Number.isInteger(n) && n > 1900 && n < 2200 ? n : null;
};

/* A live role's review row from its (edited) extraction item. */
export const roleRow = (id, d, checked = true) => {
  const start = monthLabel(d.startDate);
  const end = d.isCurrent ? 'now' : monthLabel(d.endDate);
  return {
    id,
    title: d.position || 'Role',
    employer: d.company || '',
    start: start || '?',
    end,
    location: d.location || '',
    employmentType: '',
    flagged: !d.isCurrent && (!d.endDate || !d.startDate),
    checked,
    data: d,
  };
};

export const educationRow = (id, d, checked = true) => {
  const years = [d.startYear, d.endYear].filter(Boolean).join(' – ');
  return {
    id,
    title: d.degree || 'Education',
    institution: d.institution || '',
    period: years,
    detail: d.fieldOfStudy || '',
    checked,
    data: d,
  };
};

/* A certificate needs a name, an issuer and an issue date to be saved (all three are required by the profile). */
export const certRow = (id, d, checked) => {
  const incomplete = !d.name || !d.issuingOrganization || !d.issueDate;
  const missing = [!d.issuingOrganization && 'issuer', !d.issueDate && 'issue date'].filter(
    Boolean
  );
  return {
    id,
    title: d.name || 'Certificate',
    issuer: d.issuingOrganization || '',
    year: monthLabel(d.issueDate),
    note: incomplete ? `no ${missing.join(' or ') || 'name'} found: add it to save this` : '',
    checked: checked ?? true,
    incomplete,
    data: d,
  };
};

/* POST /profiles/cv/extract data -> review result (live). Every item starts ticked. */
export const resultFromExtraction = (data, file) => ({
  file,
  roles: (data.roles || []).map((r, i) =>
    roleRow(`cv-role-${i}`, {
      company: str(r?.company),
      position: str(r?.position),
      location: str(r?.location),
      startDate: parseMonth(r?.startDate),
      endDate: r?.isCurrent ? null : parseMonth(r?.endDate),
      isCurrent: Boolean(r?.isCurrent),
      description: str(r?.description),
    })
  ),
  education: (data.education || []).map((e, i) =>
    educationRow(`cv-edu-${i}`, {
      institution: str(e?.institution),
      degree: str(e?.degree),
      fieldOfStudy: str(e?.fieldOfStudy),
      startYear: yearOrNull(e?.startYear),
      endYear: yearOrNull(e?.endYear),
    })
  ),
  skills: (data.skills || [])
    .filter((s) => str(s?.name))
    .map((s, i) => ({
      id: `cv-skill-${i}`,
      label: str(s.name),
      checked: true,
      data: { name: str(s.name), kind: s.kind === 'soft' ? 'soft' : 'technical' },
    })),
  certificates: (data.certifications || []).map((c, i) =>
    certRow(`cv-cert-${i}`, {
      name: str(c?.name),
      issuingOrganization: str(c?.issuingOrganization),
      issueDate: parseMonth(c?.issueDate),
    })
  ),
  warnings: data.warnings || [],
});

export const isEmptyResult = (r) =>
  !r.roles.length && !r.education.length && !r.skills.length && !r.certificates.length;

/* Ticked items that can be saved (certificates missing an issuer or date are left out). */
export const countAddable = (result) =>
  result.roles.filter((r) => r.checked).length +
  result.education.filter((e) => e.checked).length +
  result.skills.filter((s) => s.checked).length +
  result.certificates.filter((c) => c.checked && !c.incomplete).length;

const norm = (v) =>
  String(v ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
const toDate = (ym) => (ym ? `${ym}-01` : null);
/* An item already on the profile, written back as it came (keeps `_id` and fields this screen never shows). */
const keep = (item) => {
  if (!item || typeof item !== 'object') return item;
  const out = { ...item };
  delete out.id;
  return out;
};
const arr = (v) => (Array.isArray(v) ? v : []);

/*
 * Ticked review items + the freshly loaded profile -> { fields, added, duplicates, leftOut }.
 *   fields: only the profile fields that gain items; each is the existing list (unchanged, in order) + the new items.
 *   Dedupe (case-insensitive): roles by company+position, education by institution+degree, skills by name (across
 *   technical and soft), certifications by name+issuer — against the profile and within the CV itself.
 *   Nothing already on the profile is ever removed or changed.
 */
export const mergeCvIntoProfile = (profile, result) => {
  const fields = {};
  const added = { roles: 0, education: 0, skills: 0, technical: 0, soft: 0, certs: 0 };
  let duplicates = 0;

  const appendInto = (field, existing, items, keyOf, build, counter) => {
    const seen = new Set(existing.map(keyOf));
    const fresh = [];
    items.forEach((item) => {
      const k = keyOf(item);
      if (seen.has(k)) {
        duplicates += 1;
        return;
      }
      seen.add(k);
      fresh.push(build(item));
    });
    if (fresh.length) fields[field] = [...existing.map(keep), ...fresh];
    added[counter] += fresh.length;
    return fresh.length;
  };

  const roles = result.roles.filter((r) => r.checked && (r.data.company || r.data.position));
  appendInto(
    'workExperience',
    arr(profile?.workExperience),
    roles.map((r) => r.data),
    (x) => `${norm(x.company)}|${norm(x.position)}`,
    (d) => ({
      company: d.company,
      position: d.position,
      location: d.location || '',
      startDate: toDate(d.startDate),
      endDate: d.isCurrent ? null : toDate(d.endDate),
      isCurrent: Boolean(d.isCurrent),
      description: d.description || '',
    }),
    'roles'
  );

  const education = result.education.filter((e) => e.checked && e.data.institution);
  appendInto(
    'education',
    arr(profile?.education),
    education.map((e) => e.data),
    (x) => `${norm(x.institution)}|${norm(x.degree)}`,
    (d) => ({
      institution: d.institution,
      degree: d.degree,
      fieldOfStudy: d.fieldOfStudy,
      startYear: d.startYear,
      endYear: d.endYear,
    }),
    'education'
  );

  // Skills: one name space across both lists, so "Teamwork" is not added as soft when it is already technical.
  const technical = arr(profile?.technicalSkills);
  const soft = arr(profile?.softSkills);
  const seenSkills = new Set([...technical, ...soft].map((x) => norm(x?.name)));
  const newSkills = { technical: [], soft: [] };
  result.skills
    .filter((s) => s.checked)
    .forEach((s) => {
      const k = norm(s.data.name);
      if (seenSkills.has(k)) {
        duplicates += 1;
        return;
      }
      seenSkills.add(k);
      newSkills[s.data.kind].push({ name: s.data.name, proficiency: 'Intermediate' });
    });
  if (newSkills.technical.length)
    fields.technicalSkills = [...technical.map(keep), ...newSkills.technical];
  if (newSkills.soft.length) fields.softSkills = [...soft.map(keep), ...newSkills.soft];
  added.technical = newSkills.technical.length;
  added.soft = newSkills.soft.length;
  added.skills = added.technical + added.soft;

  const ticked = result.certificates.filter((c) => c.checked);
  const leftOut = ticked.filter((c) => c.incomplete).length;
  appendInto(
    'certifications',
    arr(profile?.certifications),
    ticked.filter((c) => !c.incomplete).map((c) => c.data),
    (x) => `${norm(x.name)}|${norm(x.issuingOrganization)}`,
    (d) => ({
      name: d.name,
      issuingOrganization: d.issuingOrganization,
      issueDate: toDate(d.issueDate),
    }),
    'certs'
  );

  return { fields, added, duplicates, leftOut };
};
