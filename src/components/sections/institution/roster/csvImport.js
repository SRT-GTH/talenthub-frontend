/*
 * csvImport — reads a class-list CSV in the browser and turns it into rows for POST /api/institution/students/import, which does the real checks
 * (services/institutionRoster.service.js: name, Ghana Card format, real past date of birth, year group, guardian contact under 18, duplicates on the roster
 * and in the file, already enrolled at another institution).
 *   parseCsv(text)             -> string[][]
 *   rowsFromCsv(text, mapping) -> [{name, ghanaCard, programme, indexNumber, dateOfBirth, form, guardianPhone, email}]  (mapping: column id -> header)
 *   ageOn(date)                -> whole years
 * Files that leave more than FIX_LIMIT rows to fix go to the "Fix N rows first" report; the others to "Review import".
 */

export const FIX_LIMIT = 5;

export const parseCsv = (text) => {
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
      if (cur.some((x) => x.trim() !== '')) rows.push(cur);
      cur = [];
    } else field += c;
  }
  cur.push(field);
  if (cur.some((x) => x.trim() !== '')) rows.push(cur);
  return rows;
};

export const ageOn = (date, now = new Date()) => {
  let age = now.getFullYear() - date.getFullYear();
  const before =
    now.getMonth() < date.getMonth() ||
    (now.getMonth() === date.getMonth() && now.getDate() < date.getDate());
  if (before) age -= 1;
  return age;
};

/** "14/03/2009", "14-03-2009" or "2009-03-14" -> "2009-03-14"; anything else is passed through for the server to reject. */
const isoDob = (v) => {
  const s = String(v || '').trim();
  let m = /^(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{4})$/.exec(s);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  return s;
};

// The column names this reads when a field isn't mapped: the built-in template, plus the admin-configured bulk roster template
// (first / last name, parent_* columns, level / grade).
const DEFAULT_HEADERS = {
  name: ['student_name', 'name', 'full_name', 'full name'],
  first: ['first_name', 'firstname', 'first name'],
  last: ['last_name', 'lastname', 'surname', 'last name'],
  card: ['ghana_card', 'ghana card', 'ghanacard', 'ghana_card_number'],
  programme: ['programme', 'program', 'course'],
  index: ['index', 'index_number', 'student_id', 'index number', 'student id'],
  dob: ['dob', 'date_of_birth', 'birth_date', 'date of birth'],
  year: ['year_group', 'year', 'form', 'level', 'grade', 'class'],
  guardian: ['guardian_phone', 'parent_phone', 'guardian', 'parent phone'],
  guardianEmail: ['guardian_email', 'parent_email', 'parent email'],
  guardianName: ['guardian_name', 'parent_name', 'parent name'],
  email: ['email', 'student_email'],
};

export const rowsFromCsv = (text, mapping = {}) => {
  const table = parseCsv(text);
  const header = (table[0] ?? []).map((h) => h.trim().toLowerCase());
  const col = (id) => {
    const chosen = (mapping[id] || '').trim().toLowerCase();
    if (chosen) return header.indexOf(chosen);
    return header.findIndex((h) => (DEFAULT_HEADERS[id] || []).includes(h));
  };
  const idx = Object.fromEntries(Object.keys(DEFAULT_HEADERS).map((k) => [k, col(k)]));
  return table.slice(1).map((cells) => {
    const get = (k) => (idx[k] >= 0 ? String(cells[idx[k]] ?? '').trim() : '');
    return {
      name: get('name') || [get('first'), get('last')].filter(Boolean).join(' '),
      guardianName: get('guardianName') || undefined,
      ghanaCard: get('card') || undefined,
      programme: get('programme') || undefined,
      indexNumber: get('index') || undefined,
      dateOfBirth: get('dob') ? isoDob(get('dob')) : undefined,
      form: get('year') || undefined,
      guardianPhone: get('guardian') || undefined,
      guardianEmail: get('guardianEmail') || undefined,
      email: get('email') || undefined,
    };
  });
};
