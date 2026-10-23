import { speakable } from '../careerBuddyLive.js';
import { BUDDY_VOICE_RATE } from './voiceCaptionData.js';

/*
 * Thin helpers over the browser's speech synthesis (the same engine useCareerBuddyLive speaks with).
 * pause / resume let a barge-in hold Buddy mid-sentence; speakAgain is "Play again" on a saved Buddy turn.
 *
 * ⚠️ ASSUMPTION: useCareerBuddyLive keeps its `speak` helper private, so speakAgain repeats its voice tuning
 * (rate from BUDDY_VOICE_RATE, pitch below). Exporting `speak` from there would let this share one helper.
 */
const PITCH = { sol: 0.9, bruce: 0.75, tali: 1.15 };

const synth = () => (typeof window !== 'undefined' ? window.speechSynthesis : null);

export const pauseSpeech = () => synth()?.pause();
export const resumeSpeech = () => synth()?.resume();

export const speakAgain = (text, voiceId = 'tali', onEnd) => {
  const s = synth();
  if (!s || !text || typeof SpeechSynthesisUtterance === 'undefined') {
    onEnd?.();
    return;
  }
  s.cancel();
  const u = new SpeechSynthesisUtterance(speakable(text));
  u.rate = BUDDY_VOICE_RATE[voiceId] ?? 1.05;
  u.pitch = PITCH[voiceId] ?? 1.15;
  u.lang = 'en-GB';
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  s.speak(u);
};

/** The text Buddy is speaking for the latest turn: the bot bubbles after the last talent message, as the speech helper reads them. */
export const lastBuddyText = (messages = []) => {
  const parts = [];
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const m = messages[i];
    if (m.sender === 'user') break;
    if (m.sender === 'bot' && !m.thinking && m.text) parts.unshift(m.text);
  }
  return speakable(parts.join(' ')).replace(/\s+/g, ' ').trim();
};
