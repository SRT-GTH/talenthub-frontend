// Registry: Figma Playful frame id -> how to reach that state in the app.
//   { group, label, setup: async (page) => void }  |  { group, label, unreachable: true, reason }
// Setup drivers live in ./flow.js (scripted chat) and ./helpers.js. The runner opens the Career Buddy route with
// Playful ON first (unless `vibeModal: true`, which leaves `gth:ui-style-chosen` unset so the first-visit modal shows).
// Another agent's frames are merged from ./states.personality.js (optional).
import * as F from './flow.js';
import { open } from './helpers.js';

const WEL = 'Welcome phase';
const EDU = 'Educational Background';
const INT = 'Personal Area of Interests';
const WORK = 'Work Experience';
const AI = 'AI provides guidance';

const faqThenReady = (which) => async (page) => {
  await F.toFaq(page, which);
  await F.chip(page, "I think I'm ready now");
  await F.chip(page, 'Sounds great', { wait: false });
  await page.waitForTimeout(150);
};
const composerFilled = (text) => async (page) => {
  await open(page);
  await F.type(page, text, { send: false });
};

const own = {
  // ---- Welcome phase ----
  '7873:50485': { group: WEL, label: 'Welcome - landing', setup: (p) => open(p) },
  '7873:50714': {
    group: WEL,
    label: 'Welcome - composer "Tell me more about GTH" typed',
    setup: composerFilled('Tell me more about GTH'),
  },
  '7873:50988': {
    group: WEL,
    label: 'Welcome - composer "How does GTH match me" typed',
    setup: composerFilled('How does GTH match me with opportunities?'),
  },
  '7873:51215': {
    group: WEL,
    label: 'Welcome - composer "Is my personal information safe" typed',
    setup: composerFilled('Is my personal information safe on GTH'),
  },
  '7873:51441': {
    group: WEL,
    label: 'Welcome - FAQ about GTH -> ready -> Sounds great',
    setup: faqThenReady('Tell me more about GTH'),
  },
  '7873:51614': {
    group: WEL,
    label: 'Welcome - FAQ matching -> ready -> Sounds great',
    setup: faqThenReady('How does GTH match me with opportunities?'),
  },
  '7873:51787': {
    group: WEL,
    label: 'Welcome - FAQ privacy -> ready -> Sounds great',
    setup: faqThenReady('Is my personal information safe on GTH'),
  },

  // ---- Educational Background ----
  '7873:53777': {
    group: EDU,
    label: 'Education - NOT STARTED (first question)',
    setup: F.toEduStart,
  },
  '7873:53961': {
    group: EDU,
    label: 'Education - IN PROGRESS (all answers; Figma also shows a retry branch the app lacks)',
    setup: F.toEduReview,
  },
  '7873:54142': { group: EDU, label: 'Education - AWAITING REVIEW', setup: F.toEduReview },
  '7873:54323': {
    group: EDU,
    label: 'Education - USER CHOOSES TO EDIT',
    setup: async (p) => {
      await F.toEduReview(p);
      await F.modify(p);
    },
  },
  '7873:54504': {
    group: EDU,
    label: 'Education - SAVED',
    setup: async (p) => {
      await F.toEduReview(p);
      await F.confirmSavedOnly(p);
    },
  },
  '7873:54775': {
    group: EDU,
    label: 'Education - CONFIRMED',
    setup: async (p) => {
      await F.toEduReview(p);
      await F.confirmStage(p);
    },
  },

  // ---- Personal Area of Interests ----
  '7873:55044': { group: INT, label: 'Interests - NOT STARTED', setup: F.toInterestsStart },
  '7873:55289': { group: INT, label: 'Interests - IN PROGRESS', setup: F.toInterestsReview },
  '7873:55534': { group: INT, label: 'Interests - AWAITING REVIEW', setup: F.toInterestsReview },
  '7873:55795': {
    group: INT,
    label: 'Interests - USER CHOOSES TO EDIT',
    setup: async (p) => {
      await F.toInterestsReview(p);
      await F.modify(p);
    },
  },
  '7873:56056': {
    group: INT,
    label: 'Interests - SAVED',
    setup: async (p) => {
      await F.toInterestsReview(p);
      await F.confirmSavedOnly(p);
    },
  },
  '7873:56320': {
    group: INT,
    label: 'Interests - CONFIRMED',
    setup: async (p) => {
      await F.toInterestsReview(p);
      await F.confirmStage(p);
    },
  },

  // ---- Work Experience ----
  '7873:56996': {
    group: WORK,
    label: 'Work - IN PROGRESS (chat after Work Q&A)',
    setup: F.toWorkReview,
  },
  '7873:57480': { group: WORK, label: 'Work - AWAITING REVIEW', setup: F.toWorkReview },
  '7873:57877': {
    group: WORK,
    label: 'Work - USER CHOOSES TO EDIT',
    setup: async (p) => {
      await F.toWorkReview(p);
      await F.modify(p);
    },
  },
  '7873:58274': {
    group: WORK,
    label: 'Work - SAVED',
    setup: async (p) => {
      await F.toWorkReview(p);
      await F.confirmSavedOnly(p);
    },
  },
  '7873:58776': {
    group: WORK,
    label: 'Work - CONFIRMED',
    setup: async (p) => {
      await F.toWorkReview(p);
      await F.confirmStage(p);
    },
  },

  // ---- AI provides guidance (Career Options) ----
  '7873:59686': {
    group: AI,
    label: 'Guidance - IN PROGRESS (exposure Q&A done)',
    setup: F.toExposureWrap,
  },
  '7873:60211': {
    group: AI,
    label: 'Guidance - AWAITING REVIEW (Career Options)',
    setup: F.toGuidanceReturn,
  },
  '7873:60736': {
    group: AI,
    label: 'Guidance - USER CHOOSES TO EDIT',
    setup: async (p) => {
      await F.toGuidanceReturn(p);
      await F.modify(p);
    },
  },
  '7873:61261': {
    group: AI,
    label: 'Guidance - CAREER OPTIONS SAVED',
    setup: async (p) => {
      await F.toGuidanceReturn(p);
      await F.confirmSavedOnly(p);
    },
  },
  '7873:61794': {
    group: AI,
    label: 'Guidance - CONFIRMED',
    setup: async (p) => {
      await F.toGuidanceReturn(p);
      await F.confirmStage(p);
    },
  },

  // ---- Pick your vibe / Style switch ----
  '7883:86839': {
    group: 'Pick-your-vibe',
    label: 'Pick your vibe - first visit, Playful selected',
    vibeModal: true,
    setup: (p) => open(p),
  },
  '7883:87151': {
    group: 'Pick-your-vibe',
    label: 'Pick your vibe - first visit, Focused selected',
    vibeModal: true,
    setup: async (p) => {
      await open(p);
      await F.chooseVibeFocused(p);
    },
  },
  '7875:85654': {
    group: 'Style switch',
    label: 'GTH Style switch component',
    component: '[role=radiogroup]',
    setup: (p) => open(p),
  },
};

let more = {};
try {
  more = (await import('./states.personality.js')).states ?? {};
} catch (e) {
  if (e?.code !== 'ERR_MODULE_NOT_FOUND')
    console.warn('states.personality.js failed to load:', e.message);
}
export const states = { ...own, ...more };
