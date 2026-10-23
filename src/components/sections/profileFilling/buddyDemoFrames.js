import { CAREER_BUDDY_NODES } from './careerBuddyScript.js';
import { opportunityDemoMessages } from './opportunityGuidance/opportunityDemoFrames.jsx';

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
 *   voice-speaking | voice-buddy | voice-saved | voice-fix | voice-off | voice-interrupt | voice-pause
 *                                                         VC-01 / VC-02 / VC-03 / VC-04 / VC-05 / VC-06 / VC-06b   (Figma 9149:83053; call with live captions)
 *   opp-areas | opp-matches | opp-why                     Opportunity Matching guidance, Focused (Figma 9053:80188; see opportunityGuidance/opportunityDemoFrames.jsx)
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

// Live captions frames: the call is drawn over the start of the chat (VC-01/02/05/06) or the call's turns are saved as text (VC-03/04).
const voiceDemoMessages = (voice) => {
  if (voice.scene) {
    return [
      {
        id: 'voice-demo-auto',
        sender: 'user',
        personaLabel: 'Emma',
        text: 'Upload resume to automatically populate profile',
        auto: true,
        autoLabel: '[Auto]',
      },
      {
        id: 'voice-demo-bot',
        sender: 'bot',
        text: 'Awesome, Go ahead and upload your resume then.',
      },
    ];
  }
  const you = voice.fix
    ? 'Hi Tali, can you help me prepare for my hub tell interview on Friday?'
    : 'Hi Tali, can you help me prepare for my Hubtel interview on Friday?';
  const turns = [
    {
      id: 'voice-demo-greeting',
      sender: 'bot',
      text: 'Hi Ama! Tap the mic and talk to me any time.',
      voice: { who: 'note' },
    },
    { id: 'voice-demo-you', sender: 'user', text: you, voice: { who: 'you', seconds: 6 } },
  ];
  if (voice.fix) return turns;
  return [
    ...turns,
    {
      id: 'voice-demo-buddy',
      sender: 'bot',
      text: 'Of course, Ama. Let’s start with the question Hubtel asks most: tell me about a project you’re proud of.',
      voice: { who: 'buddy', seconds: 8 },
    },
  ];
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
  // Live captions (VC-01 ... VC-06): `voice.scene` opens the call drawn statically (no mic); saved / fix show the chat after a call.
  'voice-speaking': { voice: { scene: 'you' } },
  'voice-buddy': { voice: { scene: 'buddy' } },
  'voice-saved': { voice: { saved: true } },
  'voice-fix': { voice: { fix: 'voice-demo-you' } },
  'voice-off': { voice: { scene: 'off' } },
  'voice-interrupt': { voice: { scene: 'interrupt' } },
  'voice-pause': { voice: { scene: 'pause' } },
  // Opportunity Matching guidance (9053:80189 / 9053:80615 / 9053:81141): `opportunity` = the chat up to that frame's last message.
  'opp-areas': { opportunity: 'areas' },
  'opp-matches': { opportunity: 'matches' },
  'opp-why': { opportunity: 'why' },
};

/** The reply-in-progress sample of a phase (thinking | working | writing | slow | stopped), for demo surfaces that draw it (the Ask Buddy panel, `?buddy=<phase>`). */
export const buddyDemoThinking = (phase) => (phase && THINKING[phase] ? THINKING[phase] : null);

export const buddyDemoFrame = (name) => (name && DEMO_FRAMES[name] ? DEMO_FRAMES[name] : null);

// The conversation the frames draw: the interests chat up to "I'm really drawn to software development ..." (the last reply is the talent's).
export const demoFrameMessages = (frame, { onContinue, onTryAgain } = {}) => {
  if (frame.voice) return voiceDemoMessages(frame.voice);
  if (frame.opportunity) return opportunityDemoMessages(frame.opportunity);
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
      thinking: { ...THINKING[frame.thinking], onContinue, onTryAgain },
    },
  ];
};
