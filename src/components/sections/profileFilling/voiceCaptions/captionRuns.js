import { CARD_WORD_WINDOW, VOICE_DEMO } from './voiceCaptionData.js';

/*
 * Turns words + a position into the runs a caption card draws:
 *   You   : settled words (solid) + words that may still change (grey)
 *   Buddy : spoken words (solid) + the word being spoken (green, bold) + words still to come (grey)
 * A long text shows a window of CARD_WORD_WINDOW words so the card stays two lines high ("…" marks a cut).
 */
const TRAILING_PUNCT = /^(.*?)([:;,.!?\u2026\u2019\u201d)]*)$/;

const windowOf = (total, anchor) => {
  if (total <= CARD_WORD_WINDOW) return { start: 0, end: total };
  const start = Math.max(0, Math.min(anchor - 10, total - CARD_WORD_WINDOW));
  return { start, end: start + CARD_WORD_WINDOW };
};

export const youRuns = (words, settledCount) => {
  const { start, end } = windowOf(words.length, words.length);
  const lead = start > 0 ? '\u2026 ' : '';
  const settled = words.slice(start, Math.max(start, Math.min(settledCount, end)));
  const interim = words.slice(Math.max(start, Math.min(settledCount, end)), end);
  return {
    solid: settled.length ? `${lead}${settled.join(' ')}${interim.length ? ' ' : ''}` : lead,
    grey: interim.join(' '),
  };
};

export const buddyRuns = (words, index) => {
  const { start, end } = windowOf(words.length, index);
  const lead = start > 0 ? '\u2026 ' : '';
  const tail = end < words.length ? ' \u2026' : '';
  if (index >= words.length)
    return { solid: `${lead}${words.slice(start, end).join(' ')}${tail}`, current: '', grey: '' };
  const spoken = words.slice(start, Math.max(start, index));
  const [, head, punct] = (words[index] || '').match(TRAILING_PUNCT) || [];
  const rest = words.slice(index + 1, end);
  return {
    solid: `${lead}${spoken.join(' ')}${spoken.length ? ' ' : ''}`,
    current: head ?? words[index],
    grey: `${punct || ''}${rest.length ? ' ' : ''}${rest.join(' ')}${tail}`,
  };
};

/** Scene content of the demo frames (VC-01 ... VC-06), verbatim. */
export const DEMO_RUNS = {
  you: { solid: VOICE_DEMO.youWords, grey: VOICE_DEMO.youGrey },
  interrupt: { solid: VOICE_DEMO.interruptWords, grey: VOICE_DEMO.interruptGrey },
  pause: { solid: VOICE_DEMO.pauseWords, grey: VOICE_DEMO.pauseGrey },
  buddy: {
    solid: 'Of course, Ama. Let\u2019s start with the question Hubtel asks ',
    current: 'most',
    grey: ': tell me about a project you\u2019re proud of.',
  },
};
