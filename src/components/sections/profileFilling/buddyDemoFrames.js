import { CAREER_BUDDY_NODES } from './careerBuddyScript.js';

/*
 * Demo frames of the 21 Oct 2026 Career Buddy chat screens, reachable by URL on the scripted talent chat:
 *   /profile/filling/career-buddy?chat=<frame>
 * (the real chat reaches the same states by interaction: sending a message, opening History, "New chat", the settings button).
 *
 *   thinking | working | writing | slow | stopped          reply-in-progress rows        (Figma 8988:509558, 8993:511908)
 *   history  | history-menu | history-rename | history-delete | history-search | history-nomatch | history-empty | history-loading
 *                                                         CH-01 ... CH-08               (Figma 9086:71498 / 9086:77035)
 *   new | new-hover                                       NC-01 / NC-02                 (Figma 9086:75962 / 9086:76500)
 *   settings | settings-language | settings-clear         CS-01 / CS-02 / CS-03         (Figma 9093:80066 / 9093:81889)
 * The sample copy of the reply-in-progress rows is the copy drawn in those frames.
 */

const SAMPLE = {
  working: {
    phase: 'working',
    lookingAt: ['Your profile', 'Discoverable rules'],
    sub: 'Finding roles that fit your interests',
    steps: [
      { id: 'read', label: 'Read your profile and chat', state: 'done' },
      { id: 'match', label: 'Matching 214 roles in Accra', state: 'active' },
      { id: 'write', label: 'Writing your answer', state: 'next' },
    ],
    stepText: 'Step 2 of 3',
    progress: 99 / 254,
  },
  slow: {
    phase: 'slow',
    sub: 'This one takes longer: checking 2,400 postings',
    progress: 136 / 290,
    elapsed: 12,
  },
};

const THINKING = {
  thinking: { phase: 'thinking', lookingAt: ['Your profile', 'Discoverable rules'] },
  working: SAMPLE.working,
  writing: {
    phase: 'writing',
    text: 'Great pick. Here are three roles that fit a future product manager in Accra:',
  },
  slow: SAMPLE.slow,
  stopped: { phase: 'stopped', text: 'Great pick. Here are three roles that fit a future' },
};

export const DEMO_FRAMES = {
  thinking: { thinking: 'thinking' },
  working: { thinking: 'working' },
  writing: { thinking: 'writing' },
  slow: { thinking: 'slow' },
  stopped: { thinking: 'stopped' },
  history: { historyOpen: true },
  'history-menu': { historyOpen: true, drawer: { menuId: 'linkedin' } },
  'history-rename': {
    historyOpen: true,
    drawer: { renamingId: 'linkedin', renameDraft: 'LinkedIn summary for UX roles' },
  },
  'history-delete': { historyOpen: true, drawer: { deletingId: 'prep-hubtel' } },
  'history-search': { historyOpen: true, drawer: { query: 'hubtel' } },
  'history-nomatch': { historyOpen: true, drawer: { query: 'netflix' } },
  'history-empty': { historyOpen: true, emptyHistory: true },
  'history-loading': { historyOpen: true, loadingHistory: true },
  new: { fresh: true, savedToast: true, newDisabled: true },
  'new-hover': { fresh: true, newDisabled: true, tooltip: true },
  settings: { settingsOpen: true },
  'settings-language': { settingsOpen: true, settingsView: 'language' },
  'settings-clear': { settingsOpen: true, settingsClear: true },
};

export const buddyDemoFrame = (name) => (name && DEMO_FRAMES[name] ? DEMO_FRAMES[name] : null);

// The conversation the frames draw: the interests chat up to "I'm really drawn to software development ..." (the last reply is the talent's).
export const demoFrameMessages = (frame) => {
  const n = CAREER_BUDDY_NODES;
  const seed = [
    ...n['interests-q1'].reply(),
    ...n['interests-q2'].reply(),
    ...n['interests-q3'].reply(),
    n['interests-confirm'].reply()[0],
  ];
  if (!frame.thinking) return seed;
  return [
    ...seed,
    {
      id: 'cb-thinking',
      sender: 'bot',
      personaLabel: 'Career Buddy',
      text: '',
      thinking: THINKING[frame.thinking],
    },
  ];
};
