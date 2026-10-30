/*
 * Career Buddy search, Phase 3 (2026-10-30, backend gthSearch.listMyRecords): the result types that are the
 * talent's own records. They are private, so a tap on one is never sent as a search signal, and a set made only
 * of them is labelled "Your records".
 */
export const OWN_RECORD_TYPES = [
  'application',
  'interview',
  'saved',
  'result',
  'practice',
  'conversation',
  'enrolment',
  'verification',
];

export const isOwnRecord = (card) => OWN_RECORD_TYPES.includes(card?.type);
