/*
 * Education data model v2 (2026-10-18) - frontend reader.
 * Mirrors backend utils/educationV2.utils.js readEducationEntry: reads any
 * profile.education[] entry (v1 keys grade/degree/curriculum or v2 keys
 * classYear/qualification/fieldOfStudy/subjects/overallResult) as v2.
 */

export const LEVEL_LABELS = {
  jhs: 'Junior High School',
  post_bece: 'Completed BECE',
  shs: 'Senior High School',
  post_shs: 'Completed WASSCE',
  technical: 'Technical / TVET',
  vocational: 'Vocational',
  tertiary: 'Tertiary',
  post_grad: 'Postgraduate',
};

const CLASS_YEAR_RE = /^\s*(jhs|shs|year|level|masters)[\s_-]?(\d{1,3})\s*$/i;

export const isClassYear = (v) =>
  typeof v === 'string' && (CLASS_YEAR_RE.test(v) || /^\s*(phd|gap)\s*$/i.test(v));

const normalizeLevel = (raw) => {
  if (!raw) return null;
  const t = String(raw).toLowerCase();
  if (LEVEL_LABELS[t]) return t;
  if (/post[ _-]?bece|after bece/.test(t)) return 'post_bece';
  if (/post[ _-]?(shs|wassce)|after wassce/.test(t)) return 'post_shs';
  if (/\b(jhs|junior high)\b/.test(t)) return 'jhs';
  if (/\b(shs|senior high|secondary)\b/.test(t)) return 'shs';
  if (/post ?grad|master|phd/.test(t)) return 'post_grad';
  if (/technical|tvet/.test(t)) return 'technical';
  if (/vocational|nvti/.test(t)) return 'vocational';
  if (/universit|tertiary|college|degree|diploma|hnd/.test(t)) return 'tertiary';
  return null;
};

const qualificationForLevel = (lvl) =>
  lvl === 'jhs' || lvl === 'post_bece'
    ? 'BECE'
    : lvl === 'shs' || lvl === 'post_shs'
      ? 'WASSCE'
      : null;

/** "shs-3" -> "SHS 3", "level-200" -> "Level 200", "year-2" -> "Year 2". */
export const classYearLabel = (v) => {
  if (!v) return null;
  const m = CLASS_YEAR_RE.exec(String(v));
  if (!m) return String(v);
  const head = m[1].toLowerCase();
  const word =
    head === 'jhs' || head === 'shs' ? head.toUpperCase() : head[0].toUpperCase() + head.slice(1);
  return `${word} ${m[2]}`;
};

/** overallResult -> "Aggregate 9", "CGPA 3.6/4.0", "CWA 68%", "Second Class Upper" (+ " so far" when not final). */
export const overallResultLabel = (r) => {
  if (!r) return null;
  const tail = r.final === false ? ' so far' : '';
  if (r.measure === 'aggregate' && r.value != null) return `Aggregate ${r.value}${tail}`;
  if (r.measure === 'cgpa' && r.value != null)
    return `CGPA ${r.value}${r.scale ? `/${r.scale}` : ''}${tail}`;
  if (r.measure === 'cwa' && r.value != null) return `CWA ${r.value}%${tail}`;
  return r.classification ? `${r.classification}${tail}` : null;
};

export function readEducationEntry(e = {}) {
  const level = normalizeLevel(e.educationLevel);
  const grade = e.grade;
  return {
    institution: e.institution ?? null,
    educationLevel: level ?? e.educationLevel ?? null,
    levelLabel: LEVEL_LABELS[level] || e.educationLevel || null,
    classYear: e.classYear ?? (isClassYear(grade) ? grade : null),
    qualification: e.qualification ?? e.degree ?? qualificationForLevel(level),
    fieldOfStudy: e.fieldOfStudy ?? e.curriculum ?? null,
    subjects: Array.isArray(e.subjects) ? e.subjects : [],
    overallResult:
      e.overallResult ??
      (grade && !isClassYear(grade)
        ? {
            measure: 'classification',
            value: null,
            scale: null,
            classification: String(grade),
            final: true,
          }
        : null),
    startYear: e.startYear ?? null,
    endYear: e.endYear ?? null,
    isCurrent: Boolean(e.isCurrent),
    activities: Array.isArray(e.activities) ? e.activities : [],
  };
}

/** Card title: "WASSCE · General Science", "BSc Statistics", or the programme alone. */
export const educationTitle = (v) => {
  const q = v.qualification;
  const f = v.fieldOfStudy;
  if (q && f) return /^(B|M|Ph|Dip|HND|Cert)/i.test(q) ? `${q} ${f}` : `${q} · ${f}`;
  return f || q || v.levelLabel || 'Education';
};
