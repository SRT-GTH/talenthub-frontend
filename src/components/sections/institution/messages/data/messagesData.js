/*
 * messagesData.js — API-shaped MOCK data of the institution Messages (Figma 11.3.3a-g, canvas 8520:10). SAMPLE CONTENT ONLY.
 * Future endpoints: GET /institution/messages (threads + counts), GET /institution/messages/:id, POST /institution/messages (send | schedule | draft),
 * PATCH /institution/messages/:id (edit a scheduled message), POST /institution/messages/:id/retry-sms, GET /institution/messages/:id/failures.
 * Counts here are the school's own send counts (not public aggregates). Guardians of under-18s get a copy by SMS (the page subtitle).
 *
 * BLOCK 1 threads   BLOCK 2 audiences (compose)   BLOCK 3 delivery failures
 */

/* ===== BLOCK 1 · threads (Figma 11.3.3c list + thread panes) ========================================================== */

export const MESSAGES_COPY = {
  title: 'Messages',
  sentence:
    'Message a class, a programme group or a year group. Guardians of under-18s get a copy.',
};

/* Message kinds in a timeline: out (text sent by the school) · card (programme / file attachment) · help (the "Questions?" bubble) · reply (inbound). */
const CLINIC_TEXT =
  'Good morning Form 3. The Scholarship Prep Clinic starts Saturday 24 October in the library. Tap below to join with your GTH profile.';

export const THREADS = [
  {
    id: 'thread-1',
    initials: 'F3',
    title: 'Form 3 · Scholarship clinic',
    when: 'Today',
    stat: '64 students · 58 opened · 9 replies',
    header: '64 students and 52 guardians · sent today at 09:00',
    placeholder: 'Write a follow-up to all 64…',
    timeline: [
      { id: 'm1', kind: 'out', text: CLINIC_TEXT, time: '09:00', status: '58 opened' },
      {
        id: 'm2',
        kind: 'card',
        label: 'PROGRAMME',
        title: 'Scholarship Prep Clinic',
        sub: 'Savannah Hills SHS • In person',
        sent: 'Sent to Form 3 · linked profiles',
        foot: '9 replies · 41 joined',
      },
      {
        id: 'm3',
        kind: 'help',
        text: 'Questions? Reply here and Mr Owusu will answer.',
        time: '09:01',
        status: 'Read',
      },
      {
        id: 'm4',
        kind: 'reply',
        text: 'Reply from Abena M.: Do we need to bring our results?',
        time: '11:42',
      },
      {
        id: 'm5',
        kind: 'reply',
        text: 'Reply from a guardian (Kofi D.): What time does it end?',
        time: '11:20',
      },
    ],
  },
  {
    id: 'thread-2',
    initials: 'F3',
    title: 'Form 3 · Mock exam timetable',
    when: 'Today',
    stat: '247 students · 231 opened · 12 replies',
    unread: '01',
    header: '247 students and 198 guardians · sent Friday at 16:30',
    placeholder: 'Write a follow-up to all 247…',
    timeline: [
      {
        id: 'm1',
        kind: 'out',
        text: 'Form 3, your mock exam timetable is attached. Papers start Monday 2 November at 8:00 in the main hall. Bring your index number.',
        time: '09:00',
        status: '231 opened',
      },
      {
        id: 'm2',
        kind: 'card',
        label: 'FILE',
        title: 'Mock exams · Nov 2026.pdf',
        sub: 'PDF · 2 pages · 180 KB',
        sent: 'Sent to Form 3 · all programmes',
        foot: '12 replies · 231 opened',
      },
      {
        id: 'm3',
        kind: 'help',
        text: 'Questions? Reply here and the exams office will answer.',
        time: '09:01',
        status: 'Read',
      },
      {
        id: 'm4',
        kind: 'reply',
        text: 'Reply from Ibrahim Y.: Is Technical Drawing on the Tuesday?',
        time: '11:42',
      },
      {
        id: 'm5',
        kind: 'reply',
        text: 'Reply from a guardian (Esi Q.): Will there be lunch?',
        time: '11:20',
      },
    ],
  },
  {
    id: 'thread-3',
    initials: 'F2',
    title: 'Form 2 · Link your GTH profile',
    when: 'Friday',
    stat: '302 students · 240 opened · 4 replies',
    unread: '02',
    header: '302 students and 241 guardians · sent Friday at 09:00',
    scheduledHeader: '302 students and 241 guardians · scheduled',
    placeholder: 'Write a follow-up to all 302…',
    scheduledPlaceholder: 'Write a follow-up to all 64…',
    timeline: [
      {
        id: 'm1',
        kind: 'out',
        text: 'Form 2, the careers talk with Kumasi Hive is on Thursday 29 October at 14:00 in the assembly hall. Link your GTH profile before then to join the coding club.',
        time: '09:00',
        status: '240 opened',
        scheduledStatus: 'Not sent yet',
      },
      {
        id: 'm2',
        kind: 'card',
        label: 'PROGRAMME',
        title: 'Scholarship Prep Clinic',
        sub: 'Savannah Hills SHS • In person',
        sent: 'Sent to Form 3 · linked profiles',
        foot: '4 replies · 41 joined',
        scheduledFoot: 'Opens for replies when sent',
        scheduledOnly: true,
      },
      {
        id: 'm3',
        kind: 'help',
        text: 'Questions? Reply here and Mr Owusu will answer.',
        time: '09:01',
        status: 'Read',
      },
    ],
  },
  {
    id: 'thread-4',
    initials: 'GR',
    title: 'Draft · Graduates 2026',
    when: '13 Sep',
    stat: 'Not sent yet',
    draft: true,
    header: 'Draft · not sent yet',
    placeholder: 'Write a follow-up…',
    timeline: [],
  },
];

export const SCHEDULED_AT = '2026-10-26T07:00';
export const SCHEDULED_SENTENCE =
  'Sends to Form 2 and their guardians. You can edit or cancel until then.';

/* ===== BLOCK 2 · audiences (Figma 11.3.3a "Who gets it?") ============================================================ */

export const AUDIENCE_TYPES = [
  { id: 'class', label: 'One class', icon: 'user' },
  { id: 'year', label: 'Year group', icon: 'users' },
  { id: 'programme', label: 'Programme group', icon: 'company' },
];

/* ⚠️ ASSUMPTION: the choices under each tile are not drawn (Figma draws "Programme group" with the clinic attached); the counts are sample numbers,
   the clinic one is the drawn 64 students and 52 guardians. */
export const AUDIENCES = {
  class: [
    {
      id: 'form-3-science',
      label: 'Form 3 Science',
      students: 38,
      guardians: 31,
      who: 'Form 3 Science students',
    },
    {
      id: 'form-3-business',
      label: 'Form 3 Business',
      students: 41,
      guardians: 33,
      who: 'Form 3 Business students',
    },
  ],
  year: [
    { id: 'form-1', label: 'Form 1', students: 298, guardians: 262, who: 'Form 1 students' },
    { id: 'form-2', label: 'Form 2', students: 302, guardians: 241, who: 'Form 2 students' },
    { id: 'form-3', label: 'Form 3', students: 247, guardians: 198, who: 'Form 3 students' },
  ],
  programme: [
    {
      id: 'scholarship-clinic',
      label: 'Scholarship Prep Clinic',
      students: 64,
      guardians: 52,
      who: 'Form 3 students in the Scholarship clinic',
    },
  ],
};

export const DEFAULT_DRAFT = {
  type: 'programme',
  choice: 'scholarship-clinic',
  body: 'Good morning Form 3. The Scholarship Prep Clinic starts Saturday 24 October…',
  attach: true,
  sendAt: '',
};

/* ===== BLOCK 3 · delivery failures (Figma 11.3.3f) =================================================================== */

export const DELIVERY_PROBLEM = {
  count: 12,
  title: '12 guardians didn’t get the SMS',
  sentence:
    'Their numbers are switched off or wrong. We’ll retry once in 2 hours, or you can fix the numbers now.',
  see: 'See the 12',
  retry: 'Retry now',
};

/* ⚠️ ASSUMPTION: the "See the 12" list is not drawn. Sample rows: the student, the guardian relation and the masked number (never a full phone number). */
export const FAILED_NUMBERS = [
  ['Esi Quaye', 'Mother', '024 ••• ••12'],
  ['Yaw Adomako', 'Father', '020 ••• ••47'],
  ['Kofi Danso', 'Guardian', '055 ••• ••08'],
  ['Fatima Issah', 'Aunt', '027 ••• ••63'],
  ['Kojo Bawa', 'Father', '024 ••• ••90'],
  ['Ama Nkansah', 'Mother', '050 ••• ••31'],
  ['Akosua Sarpong', 'Mother', '026 ••• ••75'],
  ['Ibrahim Yakubu', 'Father', '020 ••• ••18'],
  ['Kwame Boateng', 'Guardian', '054 ••• ••26'],
  ['Abena Mahama', 'Mother', '024 ••• ••53'],
  ['Efia Kyei', 'Aunt', '055 ••• ••69'],
  ['Nana Agyei', 'Father', '027 ••• ••04'],
];
