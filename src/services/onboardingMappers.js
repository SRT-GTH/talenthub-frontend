/*
 * UI form values -> backend onboarding field values.
 * Kept separate from the pages so the mapping is visible and testable.
 */

// Backend gender enum: Male, Female, Other, Prefer not to say
const GENDER = {
  female: 'Female',
  male: 'Male',
  'non-binary': 'Other',
  'prefer-not': 'Prefer not to say',
};
export const mapGender = (v) => GENDER[v] || undefined;

// Backend stores nationality as free text; send the label
const NATIONALITY = {
  ghanaian: 'Ghanaian',
  nigerian: 'Nigerian',
  ivorian: 'Ivorian',
  togolese: 'Togolese',
  beninese: 'Beninese',
  burkinabe: 'Burkinabé',
  other: 'Other',
};
export const mapNationality = (v) => NATIONALITY[v] || v || undefined;

// Backend education_level enum (education v2): jhs, post_bece, shs, post_shs, technical, vocational,
// tertiary, post_grad (+ primary, gated in the UI). Diploma vs degree is the qualification, not the level.
const EDUCATION_LEVEL = {
  primary: 'primary',
  jhs: 'jhs',
  shs: 'shs',
  tertiary: 'tertiary',
  university: 'tertiary',
  postgrad: 'post_grad',
};
export const mapEducationLevel = (v) => EDUCATION_LEVEL[v] || v;

const QUALIFICATION = { tertiary: 'Diploma', university: 'Degree' };

// "Not currently studying": the grade field asks for the highest level finished instead.
export const FINISHED_LEVELS = {
  'done-jhs': { educationLevel: 'post_bece' },
  'done-shs': { educationLevel: 'post_shs' },
  'done-diploma': { educationLevel: 'tertiary', educationQualification: 'Diploma' },
  'done-degree': { educationLevel: 'tertiary', educationQualification: 'Degree' },
  'done-postgrad': { educationLevel: 'post_grad', educationQualification: 'Masters' },
};

/** UI level + grade -> the education step body (without institution / year / programme). */
export const buildEducationPayload = (level, grade) => {
  if (level === 'none') return { ...(FINISHED_LEVELS[grade] || {}), educationIsCurrent: false };
  const qualification =
    level === 'postgrad' ? (grade === 'phd' ? 'PhD' : 'Masters') : QUALIFICATION[level];
  return {
    educationLevel: mapEducationLevel(level),
    ...(grade ? { educationGrade: grade } : {}),
    ...(qualification ? { educationQualification: qualification } : {}),
  };
};

/** UI DOB "DD/MM/YYYY" (or DD-MM-YYYY) -> "YYYY-MM-DD" */
export const toIsoDate = (raw) => {
  const parts = String(raw || '')
    .trim()
    .split(/[-/]/);
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
};

/** 9 local digits (after the +233 prefix shown in the UI) -> "+233XXXXXXXXX" */
export const toGhanaE164 = (raw) => {
  const digits = String(raw || '').replace(/\D/g, '');
  if (!digits) return undefined;
  if (digits.startsWith('233')) return `+${digits}`;
  return `+233${digits.replace(/^0/, '')}`;
};

/** "Ama Owusu Mensah" -> { first: "Ama", last: "Owusu Mensah" } */
export const splitFullName = (full) => {
  const parts = String(full || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { first: '', last: '' };
  return { first: parts[0], last: parts.slice(1).join(' ') };
};
