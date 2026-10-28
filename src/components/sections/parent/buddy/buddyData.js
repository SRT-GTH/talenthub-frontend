/*
 * Copy of the parent Ask Buddy panel (Figma file SCXc457vwiq6o7d9g4jVbh, canvas "Parent · 13 Ask Buddy" 10089:2105, persona Emma Mensah). Verbatim from the Figma `characters`.
 * The five reply-in-progress rows reuse `ui/BuddyThinking` (Figma "Buddy thinking states"); only the parent's sample copy lives here.
 */
export const PANEL = {
  name: 'Career Buddy',
  status: 'Online · replies in seconds',
  today: 'Today',
  greeting:
    'Hi Emma. I can explain what Abena and Elliot see on GTH, what needs your approval, and how to keep them safe.',
  question: 'Can Abena apply for paid jobs yet?',
  placeholder: 'Ask about your wards, approvals or safety…',
  disclaimer: 'Buddy can make mistakes. Your chats stay private from your wards and recruiters.',
  suggestions: ['What needs my approval?', 'How does opting out work?', 'Explain Abena’s wallet'],
};

// The answer being written (PB-03 draws all of it; PB-05 shows what had arrived when the parent stopped it).
export const ANSWER =
  'Good question. Abena can volunteer and take unpaid internships now. Paid jobs open when she turns 18.';
export const ANSWER_STOPPED = 'Good question. Abena can volunteer and take unpaid';

// PB-01 … PB-05, as BuddyThinking props.
export const PHASES = {
  thinking: { phase: 'thinking', lookingAt: ['Abena’s profile', 'Rules for under-18s'] },
  working: {
    phase: 'working',
    lookingAt: ['Abena’s profile', 'Rules for under-18s'],
    sub: 'Checking what Abena can apply for',
    steps: [
      { id: 'read', label: 'Read Abena’s profile', state: 'done' },
      { id: 'rules', label: 'Checking GTH rules for under-18s', state: 'active' },
      { id: 'write', label: 'Writing your answer', state: 'next' },
    ],
    stepText: 'Step 2 of 3',
    progress: 99 / 255,
  },
  writing: { phase: 'writing', text: ANSWER },
  slow: {
    phase: 'slow',
    sub: 'This one takes longer: checking 3 wards’ activity',
    progress: 136 / 291,
    elapsed: 12,
  },
  stopped: { phase: 'stopped', text: ANSWER_STOPPED },
};

export const PHASE_IDS = Object.keys(PHASES);
