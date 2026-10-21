/*
 * Upload my CV — mock data + pure helpers (frontend-only; API-shaped so the real upload / parse endpoints can replace it).
 * Everything here is built ONLY from what the Figma frames draw (canvas 3125:10352, section "Upload my CV (new)").
 *
 * parse result shape (what a CV-parsing endpoint would return):
 *   { file: { name, sizeKb, type, pages, words },
 *     roles:        [{ id, title, employer, start, end, location, employmentType, flagged, checked }],
 *     education:    [{ id, title, institution, period, detail, checked }],
 *     skills:       [{ id, label, checked }],
 *     certificates: [{ id, title, issuer, year, note, checked }] }
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
