import { SAMPLE_ERRORS, SAMPLE_REVIEW } from './data/rosterData.js';

/*
 * csvImport — MOCK client-side check of a class-list CSV (⚠️ ASSUMPTION: the real check is a server job; this stand-in validates the file in the
 * browser so the upload flow is a real interaction). Rules: full name present · Ghana Card GHA-000000000-0 · date of birth a real past date ·
 * year group 1, 2 or 3 · guardian phone required under 18 · duplicate Ghana Cards (in the file or already on the roster) are skipped.
 * "Already at another institution" cannot be known here: 0 for a real file.
 * checkCsv(text, mapping, existingCards) → { fileRows, ready, duplicates, elsewhere, fixes[], rows[] }
 * Files that leave more than FIX_LIMIT rows to fix go to the "Fix N rows first" report; the others to "Review import".
 */

export const FIX_LIMIT = 5;
const CARD = /^GHA-\d{9}-\d$/i;

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

const parseDob = (v) => {
  const m = /^(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{4})$/.exec(v.trim());
  if (!m) return null;
  const [d, mo, y] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null;
  return date;
};

export const ageOn = (date, now = new Date()) => {
  let age = now.getFullYear() - date.getFullYear();
  const before =
    now.getMonth() < date.getMonth() ||
    (now.getMonth() === date.getMonth() && now.getDate() < date.getDate());
  if (before) age -= 1;
  return age;
};

export const checkCsv = (text, mapping = {}, existingCards = []) => {
  const table = parseCsv(text);
  const header = (table[0] ?? []).map((h) => h.trim().toLowerCase());
  const col = (id, fallback) => header.indexOf((mapping[id] || fallback).trim().toLowerCase());
  const idx = {
    name: col('name', 'student_name'),
    card: col('card', 'ghana_card'),
    programme: col('programme', 'programme'),
    dob: col('dob', 'dob'),
    year: col('year', 'year_group'),
    guardian: col('guardian', 'guardian_phone'),
  };
  const seen = new Set(existingCards.map((c) => c.toUpperCase()));
  const fixes = [];
  const rows = [];
  let duplicates = 0;
  table.slice(1).forEach((cells, i) => {
    const row = i + 2;
    const get = (k) => (idx[k] >= 0 ? (cells[idx[k]] ?? '').trim() : '');
    const name = get('name');
    const card = get('card');
    const fail = (problem, action = 'Fix in file') =>
      fixes.push({ row, student: name || '–', problem, action });
    if (!name) return fail('Name column is empty');
    if (!CARD.test(card)) return fail('Ghana Card number is not in the GHA-000000000-0 format');
    const dob = parseDob(get('dob'));
    if (!dob) return fail('Date of birth is not a real date');
    if (dob > new Date()) return fail('Date of birth is in the future');
    const year = get('year');
    if (year && !/^(form\s*)?[123]$/i.test(year)) return fail(`Year group “${year}” isn’t valid`);
    if (ageOn(dob) < 18 && !get('guardian'))
      return fail('Guardian phone missing (under 18)', 'Add phone');
    if (seen.has(card.toUpperCase())) {
      duplicates += 1;
      return undefined;
    }
    seen.add(card.toUpperCase());
    rows.push({ name, card, programme: get('programme'), year: year.replace(/\D/g, '') || '3' });
    return undefined;
  });
  return {
    sample: null,
    fileRows: Math.max(0, table.length - 1),
    ready: rows.length,
    duplicates,
    elsewhere: 0,
    failing: fixes.length,
    fixes,
    rows,
  };
};

/** The result drawn in the frames (used when "Check file" runs without a file, or ?state=review|errors is opened directly). */
export const sampleResult = (kind = 'review') =>
  kind === 'errors'
    ? {
        sample: 'errors',
        fileName: SAMPLE_ERRORS.fileName,
        fileRows: SAMPLE_ERRORS.rows,
        ready: SAMPLE_ERRORS.ready,
        duplicates: 0,
        elsewhere: 0,
        failing: SAMPLE_ERRORS.failing,
        fixes: [],
        rows: [],
      }
    : {
        sample: 'review',
        fileName: SAMPLE_REVIEW.fileName,
        fileRows: SAMPLE_REVIEW.rows,
        ready: SAMPLE_REVIEW.ready,
        duplicates: SAMPLE_REVIEW.duplicates,
        elsewhere: SAMPLE_REVIEW.elsewhere,
        failing: SAMPLE_REVIEW.fixes.length,
        fixes: SAMPLE_REVIEW.fixes,
        rows: [],
      };
