/*
 * csvImport — reads a class list (a CSV, or the first sheet of an .xlsx) in the browser and turns it into rows for
 * POST /api/institution/students/import, which does the real checks (backend utils/institution/rosterRules.js and
 * services/institutionRoster.service.js: every problem of every row, the level and year group from the platform config, an email OR a
 * phone, duplicates on the roster and in the file, students at another institution, accounts already on GTH, guardians of under-18s).
 *   parseCsv(text)                  -> string[][] (blank lines kept, so row numbers match the spreadsheet)
 *   readTable(file)                 -> Promise<string[][]> (CSV or XLSX; Excel dates become DD/MM/YYYY)
 *   FIELDS                          the student fields a column can be matched to (the template keys)
 *   detectMapping(headers, columns) -> { fieldKey: header } from the template's headers and accepted spellings (columns: the level's template)
 *   rowsFromTable(table, mapping)   -> [{ _row, firstName, lastName, dob, ... }] (matched fields only, blank lines skipped)
 *   ageOn(date)                     -> whole years (the add-one form)
 * Files that leave more than FIX_LIMIT rows to fix go to the "Fix N rows first" report; the others to "Review import".
 */

export const FIX_LIMIT = 5;

export const parseCsv = (input) => {
  const text = String(input || '').replace(/^\uFEFF/, '');
  const rows = [];
  let cur = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      cur.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i += 1;
      cur.push(field);
      field = '';
      rows.push(cur);
      cur = [];
    } else field += c;
  }
  cur.push(field);
  if (cur.some((x) => x.trim() !== '')) rows.push(cur);
  // a file that starts with empty lines: the first non-empty line is the header
  while (rows.length && rows[0].every((x) => x.trim() === '')) rows.shift();
  return rows;
};

const pad = (n) => String(n).padStart(2, '0');

export const readTable = async (file) => {
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  if (ext === 'xlsx') {
    const { readSheet } = await import('read-excel-file/browser');
    const sheet = await readSheet(file);
    return sheet.map((cells) =>
      cells.map((v) =>
        v instanceof Date
          ? `${pad(v.getUTCDate())}/${pad(v.getUTCMonth() + 1)}/${v.getUTCFullYear()}`
          : v == null
            ? ''
            : String(v)
      )
    );
  }
  if (ext !== 'csv') throw new Error('Upload a .csv or .xlsx file.');
  return parseCsv(await file.text());
};

export const ageOn = (date, now = new Date()) => {
  let age = now.getFullYear() - date.getFullYear();
  const before =
    now.getMonth() < date.getMonth() ||
    (now.getMonth() === date.getMonth() && now.getDate() < date.getDate());
  if (before) age -= 1;
  return age;
};

// The fields a column can be matched to, with the spellings we recognise besides the template's own headers and aliases.
export const FIELDS = [
  {
    key: 'firstName',
    label: 'First name',
    names: ['first name', 'firstname', 'given name', 'other names'],
  },
  {
    key: 'lastName',
    label: 'Last name',
    names: ['last name', 'lastname', 'surname', 'family name'],
  },
  { key: 'name', label: 'Full name', names: ['name', 'full name', 'student name', 'student_name'] },
  {
    key: 'dob',
    label: 'Date of birth',
    names: ['dob', 'date of birth', 'birth date', 'birthdate'],
  },
  { key: 'gender', label: 'Gender', names: ['gender', 'sex'] },
  { key: 'email', label: 'Email', names: ['email', 'email address', 'student email'] },
  {
    key: 'phone',
    label: 'Phone',
    names: ['phone', 'phone number', 'mobile', 'telephone', 'student phone'],
  },
  { key: 'level', label: 'Level', names: ['level', 'education level'] },
  {
    key: 'grade',
    label: 'Year group',
    names: ['grade', 'year group', 'year_group', 'form', 'class', 'year', 'year of study'],
  },
  {
    key: 'studentId',
    label: 'Student ID',
    names: ['student id', 'index number', 'index_number', 'index', 'student number'],
  },
  {
    key: 'ghanaCard',
    label: 'Ghana Card',
    names: ['ghana card', 'ghana_card', 'ghana card number', 'national id'],
  },
  { key: 'programme', label: 'Programme', names: ['programme', 'program', 'course'] },
  {
    key: 'parentName',
    label: 'Parent name',
    names: ['parent name', 'guardian name', 'guardian_name'],
  },
  {
    key: 'parentEmail',
    label: 'Parent email',
    names: ['parent email', 'guardian email', 'guardian_email'],
  },
  {
    key: 'parentPhone',
    label: 'Parent phone',
    names: ['parent phone', 'guardian phone', 'guardian_phone', 'guardian'],
  },
];

const norm = (h) =>
  String(h ?? '')
    .replace(/^\uFEFF/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/** headers of the file + the template's columns -> { fieldKey: header } (each header used once). */
export const detectMapping = (headers, columns = []) => {
  const spell = new Map();
  for (const f of FIELDS) for (const n of [f.key, ...f.names]) spell.set(norm(n), f.key);
  for (const c of columns) {
    for (const n of [c.key, c.header, ...(c.aliases || [])]) if (n) spell.set(norm(n), c.key);
  }
  const out = {};
  for (const h of headers) {
    const k = spell.get(norm(h));
    if (k && !out[k]) out[k] = h;
  }
  return out;
};

/** table (header row first) + { fieldKey: header } -> rows for the import (spreadsheet row number in _row). */
export const rowsFromTable = (table, mapping) => {
  const [head = [], ...body] = table;
  const at = Object.entries(mapping)
    .filter(([, h]) => h)
    .map(([k, h]) => [k, head.findIndex((x) => String(x ?? '').trim() === h)])
    .filter(([, i]) => i >= 0);
  const rows = [];
  body.forEach((cells, i) => {
    if (!cells || cells.every((c) => String(c ?? '').trim() === '')) return;
    const r = { _row: i + 2 };
    for (const [k, j] of at) {
      const v = String(cells[j] ?? '').trim();
      if (v) r[k] = v;
    }
    rows.push(r);
  });
  return rows;
};
