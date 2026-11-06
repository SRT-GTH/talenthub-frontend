/*
 * messagesData.js — COPY of the institution Messages (Figma 11.3.3a-g, canvas 8520:10). No sample records: threads, audiences, delivery and
 * replies come from /api/institution/messages (backend institutionMessages.service.js, services/institutionPortal.api.js).
 * A message lands in each student's own GTH Messages inbox (they can reply there); guardians of under-18s get a copy by SMS, or by
 * email when no phone is on file.
 */

export const MESSAGES_COPY = {
  title: 'Messages',
  sentence:
    'Message a class, a programme group or a year group. Guardians of under-18s get a copy.',
};

export const AUDIENCE_TYPES = [
  { id: 'class', label: 'One class', icon: 'user' },
  { id: 'year', label: 'Year group', icon: 'users' },
  { id: 'programme', label: 'Programme group', icon: 'company' },
];

export const EMPTY_DRAFT = {
  type: 'year',
  choice: '',
  body: '',
  attach: true,
  sendAt: '',
};

export const SCHEDULED_SENTENCE = (label) =>
  `Sends to ${label} and their guardians. You can edit or cancel until then.`;

/** The sentence of the confirmation: who gets it in GTH now, who later, and the guardian copy. */
export const confirmSentence = (c) => {
  const later = c.students - c.reachable;
  return [
    `${c.reachable} of ${c.students} ${c.who} get this in their GTH inbox now.`,
    later > 0
      ? `${later} more ${later === 1 ? 'hasn’t' : 'haven’t'} linked GTH yet (or ${later === 1 ? 'is' : 'are'} waiting for guardian consent) and won’t see it.`
      : null,
    c.guardians
      ? `${c.guardians} ${c.guardians === 1 ? 'guardian of an under-18 gets' : 'guardians of under-18s get'} a copy.`
      : null,
    'You can’t unsend it.',
  ]
    .filter(Boolean)
    .join(' ');
};

export const deliveryProblem = (n) => ({
  title: `${n} ${n === 1 ? 'guardian' : 'guardians'} didn’t get the copy`,
  sentence: 'Their numbers or emails didn’t work. Retry now, or fix them on the student record.',
  see: `See the ${n}`,
  retry: 'Retry now',
});
