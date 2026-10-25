import { KOFI_DETAIL, PROGRESS_OTHER_FORMS, PROGRESS_STUDENTS } from './data/progressData.js';

/*
 * progressDetail — GET /institution/progress/students/:id (mock). Kofi Danso is the drawn record (Figma 8595:653). ⚠️ ASSUMPTION: every other student
 * on the list gets the SAME template filled from the list row only (name, stream, profile %, verified results, programmes, activity); the About / Top
 * skills / Experience / Portfolio cards are left out for them because nothing is drawn. Returns null for an unknown id.
 */

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

export const findStudentRow = (id) =>
  [...PROGRESS_STUDENTS, ...Object.values(PROGRESS_OTHER_FORMS).flat()].find((s) => s.id === id) ??
  null;

export const getStudentDetail = (id) => {
  if (id === KOFI_DETAIL.id) return KOFI_DETAIL;
  const row = findStudentRow(id);
  if (!row) return null;
  const first = row.name.split(' ')[0];
  const results = row.results ?? 0;
  const programmes = row.programmes ?? 0;
  const supported = row.status === 'support';
  return {
    id: row.id,
    name: row.name,
    first,
    verified: 'Verified',
    headline: `${row.stream} · Savannah Hills SHS`,
    chips: [],
    stats: [
      { value: String(parseInt(row.skills ?? '0', 10) || 0), label: 'verified skills' },
      { value: String(results), label: 'verified results' },
      { value: row.activity ?? '–', label: 'last active' },
    ],
    bar: {
      title: `${row.name} · progress`,
      sub: `Profile ${row.profile ?? 0}% complete. Only you and the form teacher see this view.`,
    },
    skills: [],
    experience: [],
    portfolio: [],
    rail: {
      sticker: 'Term 1 progress',
      title: `${row.profile ?? 0}% · ${supported ? 'needs support' : 'on track'}`,
      text: `${plural(results, 'verified result', 'verified results')}, ${row.skills ?? 'no skills'}, ${
        programmes ? plural(programmes, 'programme', 'programmes') : 'no programmes yet'
      }.`,
      termTitle: 'This term',
      rows: [
        { icon: 'video', text: `Profile ${row.profile ?? 0}% · class average 76%` },
        { icon: 'target', text: plural(results, 'verified result', 'verified results') },
        { icon: 'file', text: row.skills ?? 'No skills' },
        {
          icon: 'voice',
          text: `${programmes} ${programmes === 1 ? 'programme' : 'programmes'} joined`,
        },
        { icon: 'phone', text: row.activity ?? '–' },
        { icon: 'wallet', text: row.status === 'flagged' ? row.booked : 'No coaching yet' },
      ],
      termLink: 'How progress is counted →',
    },
  };
};
