import { speakable } from './careerBuddyLive.js';

/*
 * Career Buddy voice replies, sentence by sentence (2026-10-23, voice latency).
 *
 * The reply streams in word by word (turn-stream `delta` events). Instead of waiting for the whole
 * turn and speaking it as one long utterance (slow to start, and Chrome stalls on long ones),
 * each sentence is queued on speechSynthesis as soon as it is complete. When the turn's final
 * reply arrives (authoritative - it can add a greeting or differ from the streamed text), only
 * the part not spoken yet is queued.
 */

const MIN_SENTENCE = 12; // shorter pieces wait to be joined with the next one
const MAX_RUN = 220; // a long run with no sentence end is cut at a comma / space

/** Pull complete sentences off the front of `buffer`. Returns { ready: string[], rest }. */
export function takeSentences(buffer, { flush = false } = {}) {
  const ready = [];
  let rest = String(buffer || '');
  for (;;) {
    const m = rest.match(/[.!?…](?=["')\]]?\s)|\n/);
    let cut = -1;
    if (m) cut = m.index + m[0].length;
    else if (rest.length > MAX_RUN) {
      const soft = Math.max(rest.lastIndexOf(', ', MAX_RUN), rest.lastIndexOf(' ', MAX_RUN));
      cut = soft > MIN_SENTENCE ? soft + 1 : -1;
    }
    if (cut < 0) break;
    const piece = rest.slice(0, cut);
    if (piece.trim().length < MIN_SENTENCE) {
      // Too short on its own ("Hi!" / "1."): keep it for the next sentence unless that's all there is.
      const next = rest.slice(cut).match(/[.!?…](?=["')\]]?\s)|\n/);
      if (!next) break;
      const joined = cut + next.index + next[0].length;
      ready.push(rest.slice(0, joined));
      rest = rest.slice(joined);
      continue;
    }
    ready.push(piece);
    rest = rest.slice(cut);
  }
  if (flush && rest.trim()) {
    ready.push(rest);
    rest = '';
  }
  return { ready: ready.map((s) => s.trim()).filter(Boolean), rest };
}

/**
 * What of `full` comes after `prefix`, ignoring whitespace and case differences; null when
 * `full` does not start with `prefix`.
 */
export function afterPrefix(full, prefix) {
  const a = String(full || '');
  const b = String(prefix || '');
  let i = 0;
  let j = 0;
  const ws = /\s/;
  while (j < b.length) {
    if (ws.test(b[j])) {
      j += 1;
      continue;
    }
    while (i < a.length && ws.test(a[i])) i += 1;
    if (i >= a.length || a[i].toLowerCase() !== b[j].toLowerCase()) return null;
    i += 1;
    j += 1;
  }
  return a.slice(i);
}

/** The part of the final reply still to say, given what was already queued from the stream. */
export function remainderToSpeak(finalText, queued) {
  const done = String(queued || '').trim();
  if (!done) return String(finalText || '');
  const rest = afterPrefix(finalText, done);
  if (rest !== null) return rest;
  // The final reply put something in front (e.g. a greeting): continue after the streamed part.
  const tail = done.slice(-40);
  const at = String(finalText || '').indexOf(tail);
  return at >= 0 ? String(finalText).slice(at + tail.length) : '';
}

const VOICE_TUNING = {
  sol: { rate: 0.95, pitch: 0.9 },
  bruce: { rate: 0.9, pitch: 0.75 },
  tali: { rate: 1.05, pitch: 1.15 },
};

const pickVoice = (synth) => {
  try {
    const voices = synth.getVoices?.() || [];
    return (
      voices.find((v) => v.lang === 'en-GB' && /google|natural|online/i.test(v.name)) ||
      voices.find((v) => v.lang === 'en-GB') ||
      null
    );
  } catch {
    return null;
  }
};

/**
 * One reply's voice. push(chunk) as text streams; finish(finalReply) when the turn is done;
 * cancel() to stop. onStart() fires with the first utterance, onIdle() when everything queued
 * has been spoken after finish() (or right away when there was nothing to say).
 */
export function createSpeaker({ voiceId, onStart, onIdle, synth = globalThis.speechSynthesis }) {
  const Utterance = globalThis.SpeechSynthesisUtterance;
  let buffer = '';
  let queued = '';
  let pending = 0;
  let started = false;
  let finished = false;
  let stopped = false;
  const live = []; // keep utterances referenced until they end (Chrome drops onend otherwise)
  const tuning = VOICE_TUNING[voiceId] || VOICE_TUNING.tali;
  const voice = synth ? pickVoice(synth) : null;

  const idleCheck = () => {
    if (finished && pending === 0 && !stopped) onIdle?.();
  };

  const say = (text) => {
    queued = queued ? `${queued} ${text}` : text;
    const spoken = speakable(text).trim();
    if (!spoken || !synth || !Utterance || stopped) return;
    const u = new Utterance(spoken);
    u.rate = tuning.rate;
    u.pitch = tuning.pitch;
    u.lang = 'en-GB';
    if (voice) u.voice = voice;
    const done = () => {
      const at = live.indexOf(u);
      if (at >= 0) live.splice(at, 1);
      pending = Math.max(0, pending - 1);
      idleCheck();
    };
    u.onend = done;
    u.onerror = done;
    live.push(u);
    pending += 1;
    if (!started) {
      started = true;
      onStart?.();
    }
    synth.speak(u);
  };

  if (synth) synth.cancel();

  return {
    push(chunk) {
      if (stopped || finished || !chunk) return;
      buffer += chunk;
      const { ready, rest } = takeSentences(buffer);
      buffer = rest;
      ready.forEach(say);
    },
    finish(finalText) {
      if (stopped || finished) return;
      finished = true;
      buffer = '';
      const rest = remainderToSpeak(finalText, queued);
      takeSentences(rest, { flush: true }).ready.forEach(say);
      idleCheck();
    },
    cancel() {
      stopped = true;
      live.length = 0;
      if (synth) synth.cancel();
    },
    get queued() {
      return queued;
    },
  };
}
