// Registry: how to reach each Playful Figma frame (Personality, Opt out, Voice, Miscellaneous) in the app.
// Format: states[frameId] = { group, label, setup(page) } | { group, label, unreachable: true, reason }.
// Runs at viewport 1728 x (1117-52), Playful ON (init script in the audit). Setups are deterministic:
// they freeze CSS motion, wait for fonts, and pause toasts (Playful toast pauses auto-dismiss on hover).
import * as H from './helpers.js';

const G_P = 'Personality';
const G_O = 'Opt out';
const G_V = 'Voice';
const G_M = 'Miscellaneous';

const hoverToast = async (page) => {
  const t = page
    .locator('[role=status],[role=alert]')
    .filter({ hasText: /Success|Error|Warning/ })
    .first();
  await t.hover().catch(() => {});
};

const dismissMilestone = async (p) => {
  const keep = p.getByText('No, keep this private');
  if (await keep.count()) await keep.first().click();
  await p.waitForTimeout(400);
};

const dialogDemo = async (page, cb) => {
  await H.open(page, `?cb=${cb}`);
  await H.settle(page);
};

const mcqStarted = async (page) => {
  await H.toModePicker(page);
  await H.pickMode(page, 'MCQs (Assessment)');
  await H.answerMcq(page, 1);
};
const mcqProgress = async (page) => {
  await H.toModePicker(page);
  await H.pickMode(page, 'MCQs (Assessment)');
  await H.answerMcq(page, 2);
};
const openChatStarted = async (page) => {
  await H.toModePicker(page);
  await H.pickMode(page, 'Open Chat');
  await H.say(page, 'I usually pause, think it through, and break it down into smaller tasks.');
};
const openChatProgress = async (page) => {
  await openChatStarted(page);
  await H.say(page, 'I would say independent, but I also like bouncing ideas off people.');
};
const savedToast = async (p, toAwaiting) => {
  await toAwaiting(p);
  await H.confirmPanel(p, { keepMilestone: true });
  await dismissMilestone(p);
  await H.panelTop(p);
  await hoverToast(p);
  await H.settle(p);
};
const confirmed = async (p, toAwaiting) => {
  await toAwaiting(p);
  await H.confirmPanel(p);
  await p.mouse.move(5, 600);
  await p.waitForTimeout(2500);
  await H.panelTop(p);
  await H.settle(p);
};
const settled = (fn) => async (p) => {
  await fn(p);
  await H.settle(p);
};

const raw = {
  // ---------- Personality: MCQ flow (Figma row y=100) ----------
  '7873:64451': { group: G_P, label: 'NOT STARTED (mode picker)', setup: settled(H.toModePicker) },
  '7873:64694': { group: G_P, label: 'MCQ STARTED', setup: settled(mcqStarted) },
  '7873:65225': { group: G_P, label: 'MCQ IN PROGRESS', setup: settled(mcqProgress) },
  '7873:65756': { group: G_P, label: 'MCQ AWAITING REVIEW', setup: settled(H.toMcqAwaiting) },
  '7873:66287': {
    group: G_P,
    label: 'MCQ PERSONALITY SAVED (success toast)',
    setup: (p) => savedToast(p, H.toMcqAwaiting),
  },
  '7873:66821': {
    group: G_P,
    label: 'MCQ CONFIRMED',
    setup: (p) => confirmed(p, H.toMcqAwaiting),
  },

  // ---------- Personality: Open Chat flow (Figma row y=2318) ----------
  '7873:62522': { group: G_P, label: 'OPEN CHAT STARTED', setup: settled(openChatStarted) },
  '7873:62942': { group: G_P, label: 'OPEN CHAT IN PROGRESS', setup: settled(openChatProgress) },
  '7873:63362': {
    group: G_P,
    label: 'OPEN CHAT AWAITING REVIEW',
    setup: settled(H.toOpenChatAwaiting),
  },
  '7873:63695': {
    group: G_P,
    label: 'OPEN CHAT PERSONALITY SAVED (success toast)',
    setup: (p) => savedToast(p, H.toOpenChatAwaiting),
  },
  '7873:64031': {
    group: G_P,
    label: 'OPEN CHAT CONFIRMED',
    setup: (p) => confirmed(p, H.toOpenChatAwaiting),
  },

  // ---------- Personality: Games ----------
  '7873:67698': {
    group: G_P,
    label: 'GAMES STARTED (Open Game Store link)',
    setup: settled(H.toGamesIntro),
  },
  '7873:68025': { group: G_P, label: 'All Games dialog', setup: settled(H.openGameStore) },
  '7873:70496': {
    group: G_P,
    label: 'Games filter - Strategy',
    setup: async (p) => {
      await H.openGameStore(p);
      await p
        .getByRole('group', { name: 'Filter games by category' })
        .getByRole('button', { name: 'Strategy' })
        .click();
      await p.waitForTimeout(500);
      await H.settle(p);
    },
  },
  '7873:68514': {
    group: G_P,
    label: 'Game details (The Escape Room)',
    setup: async (p) => {
      await H.openGameStore(p);
      await p.getByRole('dialog').getByText('The Escape Room', { exact: true }).first().click();
      await p.waitForTimeout(700);
      await H.settle(p);
    },
  },
  '7873:68946': {
    group: G_P,
    label: 'vid-card (isolated 600x1033 component)',
    unreachable: true,
    reason:
      'Figma frame is a detached 600x1033 export of the Game-details dialog body, not a page state. The same markup is audited inside 7873:68514.',
  },
  '7873:69410': {
    group: G_P,
    label: 'Escape Room stage 2',
    setup: async (p) => {
      await H.toEscapeStage(p, 2);
      await H.settle(p);
    },
  },
  '7873:69773': {
    group: G_P,
    label: 'Escape Room stage 3',
    setup: async (p) => {
      await H.toEscapeStage(p, 3);
      await H.settle(p);
    },
  },
  '7873:70136': {
    group: G_P,
    label: 'Escape Room stage 4',
    setup: async (p) => {
      await H.toEscapeStage(p, 4);
      await H.settle(p);
    },
  },

  // ---------- Opt out ----------
  '7887:87553': {
    group: G_O,
    label: 'Opt-out: Your journey matters to us',
    setup: (p) => dialogDemo(p, 'opt-out'),
  },
  '7887:87877': {
    group: G_O,
    label: "Opt-out: We're sorry to see you go",
    setup: (p) => dialogDemo(p, 'opt-out-sorry'),
  },
  '7887:88201': {
    group: G_O,
    label: 'Opt-out: Schedule your return',
    setup: (p) => dialogDemo(p, 'opt-out-schedule'),
  },

  // ---------- Voice ----------
  '7887:89621': {
    group: G_V,
    label: 'Voice call',
    setup: async (p) => {
      await H.fakeMic(p);
      await dialogDemo(p, 'voice-call');
    },
  },
  '7887:89939': {
    group: G_V,
    label: 'Voice settings (Choose a voice)',
    setup: (p) => dialogDemo(p, 'voice-settings'),
  },
  '7887:90134': {
    group: G_V,
    label: 'Voice-to-text recording (welcome hero)',
    setup: async (p) => {
      await H.fakeMic(p);
      await H.open(p);
      await p.getByRole('button', { name: 'Dictate with microphone' }).click();
      await p.waitForTimeout(800);
      await H.settle(p);
    },
  },

  // ---------- Miscellaneous ----------
  '7873:51961': {
    group: G_M,
    label: 'Welcome (default)',
    setup: async (p) => {
      await H.open(p);
      await H.settle(p);
    },
  },
  '7873:52189': {
    group: G_M,
    label: 'Welcome - hover on Start voice call',
    setup: async (p) => {
      await H.open(p);
      await H.settle(p);
      await p.getByRole('button', { name: 'Start voice call' }).hover();
      await p.waitForTimeout(400);
    },
  },
  '7873:52417': {
    group: G_M,
    label: 'Returning hero (New Chat)',
    setup: async (p) => {
      await H.open(p, '?cb=new-chat');
      await H.settle(p);
    },
  },
  '7873:52580': {
    group: G_M,
    label: 'History drawer',
    setup: async (p) => {
      await H.open(p, '?cb=new-chat');
      await p.getByRole('button', { name: 'Chat history' }).click();
      await p.waitForTimeout(700);
      await H.settle(p);
    },
  },
  '7873:52782': {
    group: G_M,
    label: 'Education chat - hover on messages',
    setup: async (p) => {
      await H.toEducationReview(p);
      await H.settle(p);
      await p
        .getByText('Got it — University of Cape Coast')
        .first()
        .hover()
        .catch(() => {});
      await p.waitForTimeout(300);
    },
  },
  '7873:52957': {
    group: G_M,
    label: 'Success toast (Educational background saved)',
    setup: (p) => savedToast(p, H.toEducationReview),
  },
  '7873:53228': {
    group: G_M,
    label: 'Error toast (No internet connection)',
    setup: async (p) => {
      await H.toEducationReview(p);
      await H.confirmPanel(p, { stopAfterError: true });
      await H.panelTop(p);
      await hoverToast(p);
      await H.settle(p);
    },
  },
  '7873:53502': {
    group: G_M,
    label: 'Warning toast (Unsaved changes)',
    unreachable: true,
    reason:
      'The only talent warning toast is the Game Store stub "Coming soon / <game> gameplay is not built yet" (CareerBuddySection handlePlayGame). No flow shows "Warning - Unsaved changes" over the Education review panel.',
  },
};

// Vite HMR (other agents editing source) can full-reload the page mid-setup and reset the chat.
// Retry the whole setup from a fresh load up to 3 times.
const withRetry = (setup) => async (page) => {
  let lastErr;
  for (let i = 0; i < 3; i++) {
    try {
      if (i > 0) await H.open(page);
      await setup(page);
      return;
    } catch (e) {
      lastErr = e;
      await page.waitForTimeout(1500);
    }
  }
  throw lastErr;
};

export const states = Object.fromEntries(
  Object.entries(raw).map(([id, st]) => [id, st.setup ? { ...st, setup: withRetry(st.setup) } : st])
);
