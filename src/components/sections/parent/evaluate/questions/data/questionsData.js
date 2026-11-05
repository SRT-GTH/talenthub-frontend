/*
 * questionsData — mock copy for the parent evaluation question screens, section B · Answer the questions (Figma canvas "Parent · 07 Evaluate my child" 10057:66837).
 * Frames: PE-02 10034:148219 (general, Abena Q6 of 20), PE-02d 10052:4066 (academic, Elliot Q3 of 15), PE-03 10034:148861 (no answer), PE-02c 10042:4260 (note blocked), PE-02b 10042:3545 (discard confirm).
 * ⚠️ ASSUMPTION: only the drawn questions exist (plus one follow-up each so Next / Back can be exercised); the rest of the 20 / 15 are not drawn.
 * ⚠️ ASSUMPTION: Figma masks the offending word ("*****") in PE-02c, so BLOCKED_WORDS is an invented mock list; a run of 3+ asterisks is also treated as blocked so the drawn note reproduces.
 */
export const NOTE_MAX = 200;

export const SET_META = {
  general: { ward: 'Abena', pronoun: 'she', label: 'General evaluation', total: 20 },
  academic: { ward: 'Elliot', pronoun: 'he', label: 'Academic strengths', total: 15 },
};

export const QUESTIONS = {
  general: [
    {
      number: 6,
      section: 'Communication',
      text: 'When Abena has to speak to a group of adults she doesn’t know, she usually…',
      options: [
        'Speaks up confidently and enjoys it',
        'Manages well once she has prepared',
        'Gets nervous but still does it',
        'Avoids it if she can',
      ],
      answer: 1,
      note: 'She speaks well in front of family but is shy at school.',
    },
    {
      number: 7,
      section: 'Communication',
      text: 'When Abena disagrees with a friend, she usually…',
      options: [
        'Says so calmly and listens back',
        'Waits, then raises it later',
        'Goes along to keep the peace',
        'Gets upset and drops the subject',
      ],
      answer: null,
      note: '',
    },
  ],
  academic: [
    {
      number: 3,
      section: 'Communication',
      text: 'When Elliot has homework he finds hard, he usually…',
      options: [
        'Keeps trying until he gets it',
        'Asks a friend or teacher for help',
        'Leaves it and comes back later',
        'Skips it',
      ],
      answer: 1,
      note: 'He watches YouTube lessons for Physics.',
    },
    {
      number: 4,
      section: 'Study habits',
      text: 'When Elliot has a test coming up, he usually…',
      options: [
        'Plans a few days ahead',
        'Revises the night before',
        'Studies with friends',
        'Does not revise much',
      ],
      answer: null,
      note: '',
    },
  ],
};

export const BLOCKED_NOTE = 'She is so ***** lazy with homework';
export const BLOCKED_WORDS = ['stupid', 'idiot', 'dumb', 'useless', 'hate'];
export const BLOCKED_PATTERN = /\*{3,}/;

export const hasBlockedWord = (text) => {
  if (BLOCKED_PATTERN.test(text)) return true;
  const words = text.toLowerCase().match(/[a-z']+/g) ?? [];
  return words.some((w) => BLOCKED_WORDS.includes(w));
};

export const COPY = {
  needAnswer: 'Please select a response before continuing',
  noteLabel: 'Add a note (optional)',
  noteHelp: (ward) => `Up to ${NOTE_MAX} characters. ${ward} and recruiters can see notes.`,
  noteBlocked: (ward) => `Please remove the blocked word. ${ward} and recruiters can see notes.`,
  saved: 'Saved a moment ago',
  discard: 'Discard evaluation',
  back: 'Back',
  next: 'Next question',
  discardTitle: 'Discard this evaluation?',
  discardBody: (n, ward) =>
    `Your ${n} answers and notes are deleted. ${ward} won’t see anything, and you can start again later.`,
  keepGoing: 'Keep going',
};
