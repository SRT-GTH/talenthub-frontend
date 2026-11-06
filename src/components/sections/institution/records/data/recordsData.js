/*
 * recordsData.js — COPY and option lists of the Theme 11 record verification screens (Figma 11.2.3a-f, canvas 8520:10). No sample records: the queue,
 * the counts and each record come from /api/institution/records (backend institutionRecords.service.js). Students send records from their
 * "My school" page (/school-links).
 */

export const KIND_LABELS = {
  results: 'Results',
  award: 'Award',
  certificate: 'Certificate',
  letter: 'Letter',
};

export const FILTER_CHIPS = [
  { id: 'all', label: 'All' },
  { id: 'results', label: 'Results' },
  { id: 'certificates', label: 'Certificates' },
];

export const SORT_OPTIONS = [
  { id: 'oldest', label: 'Oldest first' },
  { id: 'newest', label: 'Newest first' },
];

/** The reasons a school gives when it rejects a record (the student sees the reason and the note). */
export const REJECT_REASONS = [
  { id: 'grades', label: 'Grades don’t match our mark sheet' },
  { id: 'not-ours', label: 'We didn’t issue this' },
  { id: 'name', label: 'The name doesn’t match our records' },
  { id: 'unreadable', label: 'The file can’t be read' },
  { id: 'edited', label: 'The document looks edited' },
  { id: 'other', label: 'Something else (see the note)' },
];

export const QUEUE_COPY = {
  sentence: 'Students add results, certificates and awards. You confirm what your school issued.',
  waiting: (n) =>
    n
      ? `${n} ${n === 1 ? 'record has' : 'records have'} waited more than 7 days. Students see “pending” on their profile until you decide.`
      : 'Nothing has waited more than 7 days. Students see “pending” on their profile until you decide.',
  caughtUp: (avg) =>
    avg != null
      ? `Nice work. Your average decision time this term is ${avg < 1 ? 'under a day' : avg === 1 ? '1 day' : `${avg} days`}.`
      : 'Nice work. Nothing is waiting for you.',
  empty:
    'No records are waiting. When a student sends a result, certificate or award from their “My school” page, it shows up here.',
};
