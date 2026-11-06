import { NAME_COPY, NAME_LIMITS } from './productNamesData.js';

/*
 * productNameRules — validation and text helpers of the rename flow (Platform Admin 7.8.6b-d, 7.8.6j).
 * Names may use letters, numbers, spaces and - ’ & . only (no line breaks): the drawn message of frame 7.8.6d. The short name stops at 14
 * characters (7.8.6c "20 / 14" + "Keep the short name under 15 characters…"), the full name and the plural at 40, the reason at 200.
 */

/** Letters of any script, numbers, space, hyphen, apostrophes (' and ’), ampersand and full stop. */
const SAFE = /^[\p{L}\p{N} \-'’&.]*$/u;

const tooLong = {
  name: NAME_COPY.errors.nameTooLong,
  short: NAME_COPY.errors.shortTooLong,
  plural: NAME_COPY.errors.pluralTooLong,
};

/** The error of one name field (`name` | `short` | `plural`), or ''. Unsafe characters win over length; `required` is only checked on save. */
export const fieldError = (field, value, { required = false } = {}) => {
  const v = String(value ?? '');
  if (!SAFE.test(v)) return NAME_COPY.errors.unsafe;
  if (v.length > NAME_LIMITS[field]) return tooLong[field];
  if (field === 'name' && required && !v.trim()) return NAME_COPY.errors.nameMissing;
  return '';
};

/** All errors of the three fields: `{ name, short, plural }` (empty string = valid). */
export const validateNames = (values, { required = false } = {}) => ({
  name: fieldError('name', values.name, { required }),
  short: fieldError('short', values.short),
  plural: fieldError('plural', values.plural),
});

export const hasErrors = (errors) => Object.values(errors).some(Boolean);

/** The reason of a publish: required, at most 200 characters (frame 7.8.6j message, counter "35 / 200"). */
export const reasonError = (reason) => {
  const v = String(reason ?? '').trim();
  if (!v) return NAME_COPY.errors.reasonMissing;
  if (v.length > NAME_LIMITS.reason)
    return `Keep the reason under ${NAME_LIMITS.reason + 1} characters.`; // ⚠️ ASSUMPTION: not drawn
  return '';
};

/** A pasted line break becomes the drawn "⏎" glyph (frame 7.8.6d "Tali ⏎ Ignore all rules") so the unsafe-character message explains it. */
export const showLineBreaks = (text) => String(text ?? '').replace(/\s*\r?\n\s*/g, ' ⏎ ');

/** An example sentence with the new names: `{name}` is the full name, `{short}` the short name (full name when empty). */
export const renderExample = (template, values, fallback) =>
  template
    .replace('{name}', values.name.trim() || fallback.name)
    .replace(
      '{short}',
      values.short.trim() || values.name.trim() || fallback.short || fallback.name
    );

/** Former names after a rename: the old full and short names (frame 7.8.6i "Career Buddy, Buddy"), earlier ones kept, no duplicates. */
export const formerNamesAfter = (item, next) => {
  const keep = [item.name, item.short, ...(item.former ?? [])].filter(Boolean);
  const now = new Set([next.name, next.short].filter(Boolean));
  return [...new Set(keep)].filter((n) => !now.has(n));
};

/** "today 14:40" style stamp of the drafted-at line (frame 7.8.6f "Drafted by Ama Owusu · today 14:40"). */
export const stampOf = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const now = new Date();
  const same =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
  return same
    ? `today ${hm}`
    : `${d.getDate()} ${d.toLocaleString('en-GB', { month: 'short' })} ${hm}`;
};

/** Total of the places on pages (public + portals + emails) of a usage block: 280 for the Assistant (frame 7.8.6f / 7.8.6h). */
export const placesOf = (usage) =>
  ['public', 'talent', 'parent', 'recruiter', 'institution', 'emails'].reduce(
    (n, k) => n + (Number(usage[k]) || 0),
    0
  );
