import { RECORD_KOFI } from './data/rosterData.js';

/*
 * recordModel — builds the student record (GET /institution/students/:id) for any roster student.
 * Figma draws one record (Kofi Danso, 11.2.2j): that one is returned as drawn. For every other student the same layout is filled with what the roster knows (name, form, programme, pronouns,
 * linked state) and the profile sections that have no data (About, Top skills, Experience, Portfolio, Badges) are left out rather than invented ⚠️ ASSUMPTION.
 * recordFor(student) → record (same shape as RECORD_KOFI); student gains firstName.
 */

const PRONOUN_TEXT = { he: 'he/him', she: 'she/her', they: 'they/them' };

export const firstNameOf = (student) => student.name.split(' ')[0];

export const recordFor = (student) => {
  if (student.id === RECORD_KOFI.id) return RECORD_KOFI;
  const first = firstNameOf(student);
  return {
    id: student.id,
    name: student.name,
    pronouns: PRONOUN_TEXT[student.pronoun] ?? PRONOUN_TEXT.they,
    firstName: first,
    joined: 'Sep 2024',
    line: `Form ${student.form} · ${student.programme} · Savannah Hills SHS · Tamale`,
    formClass: `Form ${student.form}`,
    indexNo: null,
    open: null,
    chips: [{ id: 'where', label: 'Tamale · Northern', icon: 'pin' }],
    stats: [],
    tabs: [{ id: 'overview', label: 'Overview' }],
    about: null,
    skills: null,
    experience: null,
    portfolio: null,
    enrolment: {
      badge: 'Enrolment',
      title: `Enrolled · Form ${student.form}`,
      text: `Joined Savannah Hills SHS in Sep 2024. Expected to finish July 2027 (WASSCE).`,
    },
    record: [
      ...(student.cardVerified
        ? [{ id: 'card', icon: 'video', text: 'Ghana Card verified', dim: true }]
        : []),
      {
        id: 'visible',
        icon: 'wallet',
        text: student.linked ? 'Linked to GTH' : 'Not linked to GTH yet',
      },
    ],
    badges: [],
  };
};

/** The sentence under the title of the dark bar. */
export const barText = (student, record) =>
  student.id === RECORD_KOFI.id
    ? `${record.formClass} · ${student.programme} · index no. ${record.indexNo}. Linked to GTH and Ghana Card verified. Only your staff see this record.`
    : `Form ${student.form} · ${student.programme}. ${student.linked ? 'Linked to GTH' : 'Not linked to GTH yet'}${student.cardVerified ? ' and Ghana Card verified' : ''}. Only your staff see this record.`;
