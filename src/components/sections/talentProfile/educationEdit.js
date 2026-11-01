import {
  LEVEL_LABELS,
  isClassYear,
  overallResultLabel,
  readEducationEntry,
} from '../../../utils/education.js';

/*
 * Education editor helpers (2026-11-01). Signed-in talents could not add, fix or remove a school after onboarding (the
 * Experience tab's "+ Add" and pencils were demo-only), so the onboarding placeholder "Not provided" stayed for good.
 * profile.education entries are v2 (utils/education.js): institution, educationLevel, qualification, fieldOfStudy,
 * startYear, endYear, isCurrent, overallResult, plus keys this editor never touches (classYear, subjects, activities,
 * mediaFile, _id) which are written back unchanged.
 */

export const PLACEHOLDER_SCHOOL = 'Not provided';
export const isPlaceholderSchool = (v) =>
  !String(v ?? '').trim() || String(v).trim().toLowerCase() === PLACEHOLDER_SCHOOL.toLowerCase();

export const LEVEL_OPTIONS = Object.entries(LEVEL_LABELS).map(([id, label]) => ({ id, label }));

/* Stable key of an entry: its _id, else its position (entries written before ids existed). */
export const entryKey = (e, i) => String(e?._id ?? e?.id ?? `i${i}`);

export const emptyEducationForm = () => ({
  institution: '',
  level: '',
  qualification: '',
  fieldOfStudy: '',
  startYear: '',
  endYear: '',
  isCurrent: false,
  result: '',
});

const resultText = (r) =>
  r ? r.classification || overallResultLabel({ ...r, final: true }) || '' : '';

export const educationFormFromEntry = (entry) => {
  const r = readEducationEntry(entry || {});
  return {
    institution: isPlaceholderSchool(r.institution) ? '' : r.institution,
    level: LEVEL_LABELS[r.educationLevel] ? r.educationLevel : '',
    qualification: r.qualification || '',
    fieldOfStudy: r.fieldOfStudy || '',
    startYear: r.startYear ? String(r.startYear) : '',
    endYear: r.endYear ? String(r.endYear) : '',
    isCurrent: Boolean(r.isCurrent),
    result: resultText(r.overallResult),
  };
};

const YEAR_MIN = 1950;
const yearMax = () => new Date().getFullYear() + 8;
const yearOf = (text) => {
  const t = String(text ?? '').trim();
  return /^\d{4}$/.test(t) ? Number(t) : null;
};

/* -> { institution?, startYear?, endYear? } messages; empty object when the form can be saved. */
export const educationFormErrors = (form) => {
  const errors = {};
  if (isPlaceholderSchool(form.institution)) errors.institution = 'Add the name of your school.';
  const start = yearOf(form.startYear);
  const end = yearOf(form.endYear);
  const bad = (t, y) => String(t).trim() !== '' && (y === null || y < YEAR_MIN || y > yearMax());
  if (bad(form.startYear, start)) errors.startYear = 'Use a year like 2021.';
  if (bad(form.endYear, end)) errors.endYear = 'Use a year like 2025.';
  else if (start && end && end < start)
    errors.endYear = 'The end year can’t be before the start year.';
  return errors;
};

const setOrDelete = (out, key, value) => {
  if (value === null || value === undefined || value === '') delete out[key];
  else out[key] = value;
};

/* Form -> entry, on top of the original entry (keeps _id and keys this editor doesn't show). */
export const educationEntryFromForm = (form, original = {}) => {
  const out = { ...(original || {}) };
  delete out.id;
  out.institution = form.institution.trim();
  if (form.level) out.educationLevel = form.level;
  const q = form.qualification.trim();
  setOrDelete(out, 'qualification', q);
  if ('degree' in out) setOrDelete(out, 'degree', q); // v1 key, read before qualification by older code
  setOrDelete(out, 'fieldOfStudy', form.fieldOfStudy.trim());
  setOrDelete(out, 'startYear', yearOf(form.startYear));
  setOrDelete(out, 'endYear', yearOf(form.endYear));
  out.isCurrent = Boolean(form.isCurrent);
  const text = form.result.trim();
  const before = resultText(readEducationEntry(original || {}).overallResult);
  if (text !== before) {
    if (text) {
      out.overallResult = {
        measure: 'classification',
        value: null,
        scale: null,
        classification: text,
        final: !form.isCurrent,
      };
    } else delete out.overallResult;
    if (out.grade && !isClassYear(out.grade)) delete out.grade; // v1 result text, now in overallResult
  } else if (out.overallResult) {
    out.overallResult = { ...out.overallResult, final: !form.isCurrent };
  }
  return out;
};

/* The list after the edit: add (key 'new'), replace or remove by key. null when the key is no longer there. */
export const applyEducationEdit = (list, key, entry) => {
  const rows = Array.isArray(list) ? list : [];
  if (key === 'new') return [...rows, entry];
  const i = rows.findIndex((e, n) => entryKey(e, n) === key);
  if (i < 0) return null;
  return entry ? rows.map((e, n) => (n === i ? entry : e)) : rows.filter((_, n) => n !== i);
};
