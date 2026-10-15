import api from './api.js';
import { getRegisteredInstitution } from './institution.api.js';
import { debug } from '../utils/debug.js';

const log = debug('institutionBulk');

/*
 * Institution bulk upload (steps 04-08). Frontend client for the backend's
 * existing bulk endpoints.
 *
 *   Template  -> downloadTemplate(): CSV with the columns below
 *   Upload    -> validateUpload(file): parse CSV/XLSX in the browser, run the
 *                row checks here, then ask the backend to check the rows that
 *                passed (POST /users/upload-bulk-csv-with-grouping, validateOnly)
 *   Validate  -> getBulkState().report
 *   Confirm   -> submitBulkUpload(): same endpoint without validateOnly, only
 *                the valid rows; returns a bulkOperationId
 *   Report    -> getBulkStatus(): GET /users/bulk-operation-status/:id
 *
 * Rows that fail are skipped, not sent. The backend rejects the whole file if
 * any row is bad, so only rows that passed both checks go to the real upload.
 * State lives in sessionStorage so a refresh keeps the report.
 */

const STATE_KEY = 'th:institution-bulk';
export const MAX_ROWS = 10_000;
const LONG_TIMEOUT = 120_000;

// Template columns. `aliases` are other header spellings we accept (compared
// lower-case with spaces and punctuation removed).
export const TEMPLATE_COLUMNS = [
  { key: 'firstName', header: 'First Name', required: true, aliases: ['givenname', 'othernames'] },
  { key: 'lastName', header: 'Last Name', required: true, aliases: ['surname', 'familyname'] },
  { key: 'dob', header: 'Date of Birth', required: true, aliases: ['dob', 'birthdate'] },
  { key: 'gender', header: 'Gender', aliases: ['sex'] },
  { key: 'email', header: 'Email', required: true, aliases: ['emailaddress'] },
  {
    key: 'phone',
    header: 'Phone',
    required: true,
    aliases: ['phonenumber', 'mobile', 'mobilenumber', 'telephone'],
  },
  { key: 'level', header: 'Level', aliases: ['educationlevel'] },
  { key: 'grade', header: 'Grade', aliases: ['yearofstudy', 'class', 'form'] },
  { key: 'studentId', header: 'Student ID', aliases: ['indexnumber'] },
  { key: 'parentName', header: 'Parent Name', minors: true, aliases: ['guardianname'] },
  { key: 'parentEmail', header: 'Parent Email', minors: true, aliases: ['guardianemail'] },
  {
    key: 'parentPhone',
    header: 'Parent Phone',
    minors: true,
    aliases: ['guardianphone', 'parentphonenumber'],
  },
];

const EXAMPLE_ROWS = [
  [
    'Kofi',
    'Mensah',
    '12/03/2001',
    'Male',
    'k.mensah@example.com',
    '0241234567',
    'University',
    'Level 200',
    'CU-0001',
    '',
    '',
    '',
  ],
  [
    'Ama',
    'Owusu',
    '14/09/2010',
    'Female',
    'ama.owusu@example.com',
    '0207654321',
    'SHS',
    'SHS 2',
    'CU-0002',
    'Yaw Owusu',
    'yaw.owusu@example.com',
    '0551112222',
  ],
];

// ── Storage ──────────────────────────────────────────────────────────────────
const readState = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STATE_KEY) || 'null') || {};
  } catch {
    return {};
  }
};
const writeState = (patch) => {
  const next = { ...readState(), ...patch };
  try {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(next));
  } catch {
    log.error('could not save bulk state (storage full or blocked)');
  }
  return next;
};
export const getBulkState = () => readState();
export const clearBulkState = () => {
  try {
    sessionStorage.removeItem(STATE_KEY);
  } catch {
    /* ignore */
  }
};

// ── CSV helpers ──────────────────────────────────────────────────────────────
const csvCell = (v) => {
  const s = v == null ? '' : String(v);
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
export const toCsv = (rows) => rows.map((r) => r.map(csvCell).join(',')).join('\r\n');

/** RFC 4180 parser: quoted fields, "" escapes, CRLF or LF. */
export const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const s = String(text || '').replace(/^\uFEFF/, '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (quoted) {
      if (c === '"') {
        if (s[i + 1] === '"') {
          field += '"';
          i++;
        } else quoted = false;
      } else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
};

const saveFile = (filename, text) => {
  const blob = new Blob(['\uFEFF' + text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export const TEMPLATE_FILENAME = 'GTH_Student_Upload_Template.csv';

export const buildTemplateCsv = () =>
  toCsv([TEMPLATE_COLUMNS.map((c) => c.header), ...EXAMPLE_ROWS]);

export const downloadTemplate = () => saveFile(TEMPLATE_FILENAME, buildTemplateCsv());

// ── Value helpers ────────────────────────────────────────────────────────────
const normHeader = (h) =>
  String(h ?? '')
    .replace(/^\uFEFF/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

const HEADER_TO_KEY = new Map();
for (const col of TEMPLATE_COLUMNS) {
  HEADER_TO_KEY.set(normHeader(col.header), col.key);
  HEADER_TO_KEY.set(normHeader(col.key), col.key);
  for (const a of col.aliases || []) HEADER_TO_KEY.set(a, col.key);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (v) => EMAIL_RE.test(String(v || '').trim());

const pad = (n) => String(n).padStart(2, '0');

/** Cell -> { iso: 'YYYY-MM-DD', display: 'DD/MM/YYYY' } or null. Day first, as in Ghana. */
export const parseDob = (value) => {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const y = value.getUTCFullYear();
    const m = value.getUTCMonth() + 1;
    const d = value.getUTCDate();
    return { iso: `${y}-${pad(m)}-${pad(d)}`, display: `${pad(d)}/${pad(m)}/${y}` };
  }
  const s = String(value ?? '').trim();
  let y, m, d, match;
  if ((match = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/))) [, y, m, d] = match;
  else if ((match = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/))) [, d, m, y] = match;
  else return null;
  const date = new Date(Date.UTC(+y, +m - 1, +d));
  if (date.getUTCFullYear() !== +y || date.getUTCMonth() !== +m - 1 || date.getUTCDate() !== +d) {
    return null;
  }
  return { iso: `${y}-${pad(m)}-${pad(d)}`, display: `${pad(d)}/${pad(m)}/${y}` };
};

export const ageOn = (iso, now = new Date()) => {
  const [y, m, d] = iso.split('-').map(Number);
  let age = now.getUTCFullYear() - y;
  const monthDiff = now.getUTCMonth() + 1 - m;
  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < d)) age--;
  return age;
};

/**
 * Ghana phone -> "+233XXXXXXXXX", or null. Accepts +233…, 233…, 0XXXXXXXXX
 * and 9 digits (Excel drops the leading 0 from numbers).
 */
export const normalizeGhanaPhone = (value) => {
  const digits = String(value ?? '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('233')) return `+${digits}`;
  if (digits.length === 10 && digits.startsWith('0')) return `+233${digits.slice(1)}`;
  if (digits.length === 9 && !digits.startsWith('0')) return `+233${digits}`;
  return null;
};

const cellText = (v) => (v instanceof Date ? v : v == null ? '' : String(v).trim());
const isBlank = (v) => !(v instanceof Date) && String(v ?? '').trim() === '';

// ── File parsing ─────────────────────────────────────────────────────────────
const readTable = async (file) => {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (ext === 'csv') return parseCsv(await file.text());
  if (ext === 'xlsx') {
    const { readSheet } = await import('read-excel-file/browser');
    return readSheet(file);
  }
  const err = new Error('Upload a .csv or .xlsx file.');
  err.code = 'UNSUPPORTED_FILE';
  throw err;
};

/** File -> { rows: [{ row, ...fields }], missingColumns, unknownColumns } */
export const parseUploadFile = async (file) => {
  let table;
  try {
    table = await readTable(file);
  } catch (e) {
    if (e.code) throw e;
    const err = new Error('Could not read the file.');
    err.code = 'FILE_UNREADABLE';
    throw err;
  }
  const [headerRow = [], ...body] = table;
  const keys = headerRow.map((h) => HEADER_TO_KEY.get(normHeader(h)) || null);
  const present = new Set(keys.filter(Boolean));
  const missingColumns = TEMPLATE_COLUMNS.filter((c) => c.required && !present.has(c.key)).map(
    (c) => c.header
  );
  const unknownColumns = headerRow.filter((h, i) => String(h ?? '').trim() && !keys[i]).map(String);

  const rows = [];
  body.forEach((cells, i) => {
    if (!cells || cells.every(isBlank)) return; // blank line
    const r = { row: i + 2 }; // spreadsheet row (header is row 1)
    keys.forEach((k, j) => {
      if (k) r[k] = cellText(cells[j]);
    });
    rows.push(r);
  });
  if (rows.length > MAX_ROWS) {
    const err = new Error(
      `This file has ${rows.length} rows. Upload at most ${MAX_ROWS} per batch.`
    );
    err.code = 'TOO_MANY_ROWS';
    throw err;
  }
  return { rows, missingColumns, unknownColumns };
};

// ── Checks ───────────────────────────────────────────────────────────────────
const fullName = (r) => [r.firstName, r.lastName].filter(Boolean).join(' ') || '—';
const label = (key) => TEMPLATE_COLUMNS.find((c) => c.key === key).header.toLowerCase();

/** Runs the row checks. Adds r.problems [{check, reason}], r.dobIso, r.phoneE164, r.isMinor. */
export const checkRows = (rows, now = new Date()) => {
  const byEmail = new Map();
  const byNameDob = new Map();
  for (const r of rows) {
    const problems = [];
    const add = (check, reason) => problems.push({ check, reason });

    const missing = ['firstName', 'lastName', 'email', 'phone'].filter((k) => isBlank(r[k]));
    if (missing.length) add('required', `Missing ${missing.map(label).join(', ')}`);
    if (!isBlank(r.email) && !isValidEmail(r.email)) add('email', `Invalid email: ${r.email}`);

    if (!isBlank(r.phone)) {
      r.phoneE164 = normalizeGhanaPhone(r.phone);
      if (!r.phoneE164) add('phone', `Invalid phone: ${r.phone}`);
    }

    if (isBlank(r.dob)) add('dob', 'No date of birth');
    else {
      const dob = parseDob(r.dob);
      if (!dob) add('dob', `Invalid date: ${r.dob} (use DD/MM/YYYY)`);
      else if (new Date(`${dob.iso}T00:00:00Z`) > now) add('dob', 'Date of birth is in the future');
      else {
        r.dobIso = dob.iso;
        r.dobDisplay = dob.display;
        r.isMinor = ageOn(dob.iso, now) < 18;
      }
    }

    if (!isBlank(r.parentEmail) && !isValidEmail(r.parentEmail)) {
      add('email', `Invalid parent email: ${r.parentEmail}`);
    }
    if (r.isMinor && isBlank(r.parentEmail)) add('minorParent', 'Under 18: no parent email');
    if (!isBlank(r.parentPhone)) {
      r.parentPhoneE164 = normalizeGhanaPhone(r.parentPhone) || String(r.parentPhone);
    }

    const emailKey = String(r.email || '')
      .trim()
      .toLowerCase();
    if (emailKey) {
      if (byEmail.has(emailKey)) add('duplicate', `Same email as row ${byEmail.get(emailKey)}`);
      else byEmail.set(emailKey, r.row);
    }
    if (r.firstName && r.lastName && r.dobIso) {
      const k = `${r.firstName} ${r.lastName}|${r.dobIso}`.toLowerCase();
      if (byNameDob.has(k)) {
        add('duplicate', `Same name and date of birth as row ${byNameDob.get(k)}`);
      } else byNameDob.set(k, r.row);
    }
    r.problems = problems;
  }
  return rows;
};

// Maps the backend's row error text to one of our checks.
const backendCheck = (text) => {
  if (/parentEmail is required/i.test(text)) return 'minorParent';
  if (/dateOfBirth/i.test(text)) return 'dob';
  if (/duplicate/i.test(text)) return 'duplicate';
  if (/missing/i.test(text)) return 'required';
  if (/email/i.test(text)) return 'email';
  return 'server';
};

// CSV for the backend. Headers are the backend's own field names; gender,
// studentId, educationLevel, yearOfStudy and sourceRow end up in
// member.metadata (see CSV_HEADER_ALIASES in bulkOperations.mixin).
const BACKEND_HEADERS = [
  'firstName',
  'lastName',
  'email',
  'phoneNumber',
  'dateOfBirth',
  'gender',
  'studentId',
  'educationLevel',
  'yearOfStudy',
  'parentName',
  'parentEmail',
  'parentPhone',
  'sourceRow',
];
export const toBackendCsv = (rows) =>
  toCsv([
    BACKEND_HEADERS,
    ...rows.map((r) => [
      r.firstName,
      r.lastName,
      String(r.email || '')
        .trim()
        .toLowerCase(),
      r.phoneE164,
      r.dobIso,
      r.gender,
      r.studentId,
      r.level,
      r.grade,
      r.parentName,
      String(r.parentEmail || '')
        .trim()
        .toLowerCase(),
      r.parentPhoneE164,
      r.row,
    ]),
  ]);

const CHECKS = [
  {
    id: 'required',
    title: 'Required fields',
    pass: 'Every row has a first name, last name, email and phone',
    fix: 'Add the missing first name, last name, email or phone for each flagged row.',
  },
  {
    id: 'dob',
    title: 'Date of birth',
    pass: 'All dates are valid',
    fix: 'Write dates as DD/MM/YYYY, e.g. 14/09/2009. Every student needs a date of birth.',
  },
  {
    id: 'phone',
    title: 'Phone format',
    pass: 'All phone numbers are valid Ghana numbers',
    fix: 'Use a Ghana number: 0241234567 or +233241234567.',
  },
  {
    id: 'email',
    title: 'Email format',
    pass: 'All email addresses are valid',
    fix: 'Correct the email address in each flagged row.',
  },
  {
    id: 'duplicate',
    title: 'In-file duplicates',
    pass: 'No student appears twice',
    fix: 'Each student should appear once. Remove or correct the repeated rows.',
  },
  {
    id: 'minorParent',
    title: 'Minors without parent email',
    pass: 'Every student under 18 has a parent email',
    fix: 'Add a parent or guardian email for each student under 18. They receive the opt-out notice.',
  },
  {
    id: 'server',
    title: 'Other problems',
    pass: null,
    fix: 'Correct the flagged rows and upload again.',
  },
];

const MAX_CARD_ROWS = 50;

/** Builds the Validate screen report from checked rows. */
export const buildReport = ({ rows, missingColumns = [], fileName }) => {
  const total = rows.length;
  const badTemplate = missingColumns.length > 0;
  const failed = rows.filter((r) => r.problems.length);
  const valid = badTemplate ? [] : rows.filter((r) => !r.problems.length);
  const rowsWith = (id) => rows.filter((r) => r.problems.some((p) => p.check === id));

  const checks = [
    badTemplate
      ? {
          variant: 'failed',
          title: 'Template format',
          description: `Missing column${missingColumns.length > 1 ? 's' : ''}: ${missingColumns.join(', ')}`,
          howToFix: 'Download the template and keep its column names. Then upload the file again.',
          rows: [],
        }
      : {
          variant: 'passed',
          title: 'Template format',
          description: 'All required columns are present',
          rows: [],
        },
  ];

  for (const c of CHECKS) {
    const hit = rowsWith(c.id);
    if (!hit.length) {
      if (c.pass && !badTemplate) {
        checks.push({ variant: 'passed', title: c.title, description: c.pass, rows: [] });
      }
      continue;
    }
    const list = hit.map((r) => r.row);
    const more = list.length > 15 ? ` and ${list.length - 15} more` : '';
    checks.push({
      variant: 'failed',
      title: `${c.title} · ${hit.length} row${hit.length > 1 ? 's' : ''}`,
      description: `Row${list.length > 1 ? 's' : ''} ${list.slice(0, 15).join(', ')}${more}`,
      howToFix: c.fix,
      rows: hit.slice(0, MAX_CARD_ROWS).map((r) => ({
        row: String(r.row),
        name: fullName(r),
        dob: r.dobDisplay || String(r.dob || '—'),
        reason: r.problems
          .filter((p) => p.check === c.id)
          .map((p) => p.reason)
          .join('; '),
      })),
    });
  }

  const count = (id) => rowsWith(id).length;
  return {
    fileName,
    totalRows: total,
    validRows: valid.length,
    failedRows: badTemplate ? total : failed.length,
    minors: valid.filter((r) => r.isMinor).length,
    adults: valid.filter((r) => r.isMinor === false).length,
    missingContact: count('required'),
    duplicates: count('duplicate'),
    formatErrors: count('dob') + count('phone') + count('email'),
    minorsNoParent: count('minorParent'),
    parentNotices: valid.filter((r) => r.isMinor && r.parentEmail).length,
    missingColumns,
    checks,
  };
};

const organizationId = () => {
  const org = getRegisteredInstitution();
  if (!org?.id) {
    const err = new Error('Register your institution first.');
    err.code = 'NO_INSTITUTION';
    throw err;
  }
  return org.id;
};

const postBulk = async (rows, { validateOnly }) => {
  const { data } = await api.post(
    '/users/upload-bulk-csv-with-grouping',
    {
      organizationId: organizationId(),
      defaultEntityType: 'talent',
      csvData: toBackendCsv(rows),
      validateOnly,
      sendInvites: true,
      autoLinkGroups: false,
    },
    { timeout: LONG_TIMEOUT }
  );
  return data?.data ?? data;
};

/** Parse, check locally, check on the backend. Saves and returns the report. */
export const validateUpload = async (file) => {
  const parsed = await parseUploadFile(file);
  const rows = checkRows(parsed.rows);
  const candidates = parsed.missingColumns.length ? [] : rows.filter((r) => !r.problems.length);

  if (candidates.length) {
    const res = await postBulk(candidates, { validateOnly: true });
    if (res?.success === false && Array.isArray(res.validationErrors)) {
      for (const e of res.validationErrors) {
        // Backend rows count from 2 (its header is row 1), in the order we sent.
        const r = Number.isInteger(e.row) ? candidates[e.row - 2] : null;
        const texts = e.errors?.length ? e.errors : ['Rejected by the server'];
        if (r) for (const t of texts) r.problems.push({ check: backendCheck(t), reason: t });
      }
    }
  }

  const report = buildReport({
    rows,
    missingColumns: parsed.missingColumns,
    fileName: file.name,
  });
  writeState({
    fileName: file.name,
    rows,
    report,
    validatedAt: new Date().toISOString(),
    bulkOperationId: null,
    submittedRows: null,
  });
  log('validated', { total: report.totalRows, valid: report.validRows, failed: report.failedRows });
  return report;
};

const templateCells = (r) =>
  TEMPLATE_COLUMNS.map((c) => (c.key === 'dob' ? r.dobDisplay || r.dob : r[c.key]));

/** CSV of the rows that failed, with a Problems column, for fixing offline. */
export const downloadFailedRows = (extra = []) => {
  const { rows = [], fileName = 'upload' } = readState();
  const failed = rows.filter((r) => r.problems?.length);
  const lines = [
    ['Row', ...TEMPLATE_COLUMNS.map((c) => c.header), 'Problems'],
    ...failed.map((r) => [r.row, ...templateCells(r), r.problems.map((p) => p.reason).join('; ')]),
    ...extra.map((x) => [x.row, ...templateCells(x), x.reason]),
  ];
  saveFile(`${fileName.replace(/\.[^.]+$/, '')}_failed_rows.csv`, toCsv(lines));
};

/** Full report: every row with its outcome. */
export const downloadFullReport = (status) => {
  const { rows = [], fileName = 'upload' } = readState();
  const outcome = new Map();
  for (const r of status?.created || []) outcome.set(r.row, ['Created', '']);
  for (const r of status?.rejected || []) outcome.set(r.row, ['Failed', r.reason]);
  const lines = [
    ['Row', ...TEMPLATE_COLUMNS.map((c) => c.header), 'Outcome', 'Details'],
    ...rows.map((r) => {
      const [o, d] =
        outcome.get(r.row) ||
        (r.problems?.length
          ? ['Skipped', r.problems.map((p) => p.reason).join('; ')]
          : ['Pending', '']);
      return [r.row, ...templateCells(r), o, d];
    }),
  ];
  saveFile(`${fileName.replace(/\.[^.]+$/, '')}_report.csv`, toCsv(lines));
};

/** Creates the accounts for the valid rows. Safe to call twice. */
export const submitBulkUpload = async () => {
  const state = readState();
  if (state.bulkOperationId) return { bulkOperationId: state.bulkOperationId };
  const valid = (state.rows || []).filter((r) => !r.problems?.length);
  if (!valid.length) {
    const err = new Error('There are no valid rows to submit.');
    err.code = 'NO_VALID_ROWS';
    throw err;
  }
  const res = await postBulk(valid, { validateOnly: false });
  if (!res?.bulkOperationId) {
    const err = new Error(res?.message || 'The upload was not accepted.');
    err.code = res?.success === false ? 'BULK_VALIDATION_FAILED' : 'BULK_UPLOAD_FAILED';
    throw err;
  }
  writeState({
    bulkOperationId: res.bulkOperationId,
    submittedRows: valid.map((r) => r.row),
    submittedAt: new Date().toISOString(),
  });
  log('submitted', { bulkOperationId: res.bulkOperationId, rows: valid.length });
  return res;
};

const DONE = new Set(['completed', 'completed_with_errors', 'failed', 'cancelled']);

/** Status of the submitted upload, joined back to the spreadsheet rows. */
export const getBulkStatus = async () => {
  const state = readState();
  if (!state.bulkOperationId) {
    const err = new Error('Nothing has been submitted yet.');
    err.code = 'NO_BULK_OPERATION';
    throw err;
  }
  const { data } = await api.get(`/users/bulk-operation-status/${state.bulkOperationId}`);
  const s = data?.data ?? data;
  const byRow = new Map((state.rows || []).map((r) => [r.row, r]));
  const submitted = (state.submittedRows || []).map((n) => byRow.get(n)).filter(Boolean);

  const failedIdx = new Map();
  for (const e of s.errors || []) {
    if (Number.isInteger(e.itemIndex)) {
      failedIdx.set(e.itemIndex, e.errorMessage || e.errorCode || 'Failed');
    }
  }
  const done = DONE.has(s.status);
  const created = done ? submitted.filter((_, i) => !failedIdx.has(i)) : [];
  const rejected = [...failedIdx]
    .map(([i, reason]) => ({ ...(submitted[i] || {}), reason }))
    .filter((r) => r.row);

  return {
    status: s.status,
    done,
    total: s.totalItems || submitted.length,
    processed: s.processedItems || 0,
    successful: s.successfulItems || 0,
    failed: s.failedItems || 0,
    skipped: state.report?.failedRows || 0,
    parentNotices: created.filter((r) => r.isMinor && r.parentEmail).length,
    created,
    rejected,
  };
};

export const describeRow = (r) => ({
  row: r.row,
  name: fullName(r),
  type: r.isMinor ? 'Minor' : r.isMinor === false ? 'Adult' : '—',
  level: [r.level, r.grade].filter(Boolean).join(' · ') || '—',
  dob: r.dobDisplay || String(r.dob || '—'),
});
