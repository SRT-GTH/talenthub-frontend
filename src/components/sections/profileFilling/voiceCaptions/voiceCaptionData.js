/*
 * Live captions + saved voice turns - data and pure helpers.
 * Figma "AI DESIGN-engagement v2" section 9149:83053 (VC-01 ... VC-06, Playful + Focused).
 * All visible copy below is verbatim from the Figma text nodes (`characters`).
 */

/** Copy of the frames (verbatim). */
export const VOICE_COPY = {
  you: 'You',
  buddyLabel: 'Tali · Buddy',
  listening: 'Listening',
  speaking: 'Speaking',
  paused: 'Paused',
  stickerPlayful: 'LIVE CAPTIONS',
  labelFocused: 'Live captions',
  greyNote: 'Grey words may still change while you speak',
  listeningLabel: 'Listening…',
  captionsOff: 'Captions off · tap to show',
  cc: 'CC',
  interruptNote: 'Buddy stopped so you can talk. It will answer when you pause.',
  pauseNote: 'Buddy stopped so you can talk · it will pick up after you',
  talkPaused: 'Tali paused',
  letFinish: 'Let Tali finish',
  yourTurn: 'YOUR TURN',
  greeting: 'Hi Ama! Tap the mic and talk to me any time.',
  saved: 'Your voice chat is saved as text',
  didYouMean: 'Did you mean…',
  typeIt: 'Type it',
  learns: 'Buddy learns names you correct, like company names.',
  quickFix: 'QUICK FIX',
  buddyName: 'Tali · Buddy',
};

export const VOICE_DEMO = {
  youWords: 'Hi Tali, can you help me prepare for my ',
  youGrey: 'Hubtel interview on Fri…',
  interruptWords: 'Wait, can we do the ',
  interruptGrey: 'portfolio question first?',
  pauseWords: 'Sorry, can we talk about ',
  pauseGrey: 'the salary first?',
  buddyReply:
    'Of course, Ama. Let’s start with the question Hubtel asks most: tell me about a project you’re proud of.',
  buddyPausedLine: 'Of course, Ama. Let’s start with the question Hubtel asks most…',
  buddyQuoted: '“Of course, Ama. Let’s start with the question Hubtel asks…”',
  userTurn: 'Hi Tali, can you help me prepare for my hub tell interview on Friday?',
  userTurnFixed: 'Hi Tali, can you help me prepare for my Hubtel interview on Friday?',
};

/*
 * ⚠️ ASSUMPTION: Buddy's reply is spoken by the browser's speech synthesis, which gives the
 * caption layer no word timings, so the words are revealed at this average pace
 * (words per second at rate 1.0), scaled by the voice's own rate. Tuning copied from
 * useCareerBuddyLive (VOICE_TUNING).
 */
export const BUDDY_WORDS_PER_SECOND = 2.7;
export const BUDDY_VOICE_RATE = { sol: 0.95, bruce: 0.9, tali: 1.05 };

/** A transcript word counts as settled once it stopped changing for this long (the capture hook does not expose isFinal). */
export const SETTLE_MS = 800;
/** Words kept on screen in a caption card (the card is two lines at 22px). */
export const CARD_WORD_WINDOW = 22;

/** Barge-in: the mic level (0-1) and how long it must hold before Buddy is treated as interrupted. */
export const BARGE_IN_LEVEL = 0.4;
export const BARGE_IN_HOLD_MS = 450;
/** How long the "Buddy stopped so you can talk" tooltip layout shows before the compact chip layout takes over. */
export const PAUSE_NOTE_MS = 2600;

export const LEARNED_WORDS_KEY = 'careerBuddy.learnedWords';

export const splitWords = (text) =>
  String(text || '')
    .split(/\s+/)
    .filter(Boolean);

export const formatVoiceDuration = (seconds) => {
  const s = Math.max(0, Math.round(Number(seconds) || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/** Spoken length of a reply at the given voice rate (used for the "Voice · 0:08" meta of Buddy turns). */
export const estimateSpeechSeconds = (text, voiceId = 'tali') => {
  const rate = BUDDY_VOICE_RATE[voiceId] ?? 1;
  return Math.max(1, Math.round(splitWords(text).length / (BUDDY_WORDS_PER_SECOND * rate)));
};

/*
 * ⚠️ ASSUMPTION: the speech recogniser gives no per-word confidence, so "doubtful" words are
 * company / school names that browsers commonly split or mis-spell. Small local list, no backend.
 */
const DOUBTFUL = [
  { pattern: /\bhub\s?tell?\b/gi, suggestion: 'Hubtel' },
  { pattern: /\bm\.?\s?pharma\b/gi, suggestion: 'mPharma' },
  { pattern: /\bash(?:e|i)\s?(?:see|si)\b/gi, suggestion: 'Ashesi' },
  { pattern: /\bk\.?\s?n\.?\s?u\.?\s?s\.?\s?t\.?\b/gi, suggestion: 'KNUST' },
  { pattern: /\bpay\s?stack\b/gi, suggestion: 'Paystack' },
  { pattern: /\bflutter\s?wave\b/gi, suggestion: 'Flutterwave' },
  { pattern: /\bzee\s?pay\b/gi, suggestion: 'Zeepay' },
  { pattern: /\bm\s?t\s?n\s?mo\s?mo\b/gi, suggestion: 'MTN MoMo' },
];

const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const loadLearnedWords = () => {
  try {
    const raw = JSON.parse(window.localStorage.getItem(LEARNED_WORDS_KEY) || '{}');
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
};

export const saveLearnedWord = (heard, correct) => {
  const next = { ...loadLearnedWords(), [String(heard).toLowerCase()]: correct };
  try {
    window.localStorage.setItem(LEARNED_WORDS_KEY, JSON.stringify(next));
  } catch {
    /* private mode - the correction just is not remembered */
  }
  return next;
};

/** Words the user already corrected come out right the next time (learned map: lower-cased heard -> correct). */
export const applyLearned = (text, learned = {}) => {
  let out = String(text || '');
  Object.entries(learned).forEach(([heard, correct]) => {
    if (!heard) return;
    out = out.replace(new RegExp(`\\b${escapeRegExp(heard)}\\b`, 'gi'), correct);
  });
  return out;
};

/**
 * Splits a voice turn into plain parts and doubtful words:
 * [{ text }, { text: 'hub tell', heard: 'hub tell', suggestion: 'Hubtel' }, { text }]
 * `kept` = heard phrases the user chose to keep (no longer flagged).
 */
export const segmentVoiceText = (text, kept = []) => {
  const source = String(text || '');
  const hits = [];
  DOUBTFUL.forEach(({ pattern, suggestion }) => {
    pattern.lastIndex = 0;
    let m = pattern.exec(source);
    while (m) {
      const heard = m[0];
      // Already the right spelling (e.g. "Hubtel") - not doubtful.
      if (heard !== suggestion && !kept.includes(heard.toLowerCase())) {
        hits.push({ start: m.index, end: m.index + heard.length, heard, suggestion });
      }
      m = pattern.exec(source);
    }
  });
  hits.sort((a, b) => a.start - b.start);
  const parts = [];
  let cursor = 0;
  hits.forEach((h) => {
    if (h.start < cursor) return;
    if (h.start > cursor) parts.push({ text: source.slice(cursor, h.start) });
    parts.push({ text: h.heard, heard: h.heard, suggestion: h.suggestion });
    cursor = h.end;
  });
  if (cursor < source.length) parts.push({ text: source.slice(cursor) });
  return parts;
};
