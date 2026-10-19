import { useEffect, useRef, useState } from 'react';
import { debug } from '../../../../utils/debug.js';

const log = debug('gameKitUtils');

/* gameKitUtils — non-component helpers of the skill games (see gameKit.jsx for the components). */

/* ---------- class helpers (Figma: Playful ink 1.5 → Focused ink@0.12 1.0, dashed @0.30–0.40 → @0.10) ---------- */
export const INK =
  'border border-solid border-[rgba(28,42,33,0.12)] playful:border-[1.5px] playful:border-[#1c2a21]';
export const HAIR = 'border border-solid border-[rgba(28,42,33,0.12)]';
export const DASH_BORDER =
  'border border-dashed border-[rgba(28,42,33,0.1)] playful:border-[1.5px] playful:border-[rgba(28,42,33,0.3)]';
export const SEL_BORDER = 'border border-solid border-[#387440] playful:border-[1.5px]';
export const SEL_SHADOW = 'shadow-[0_6px_16px_rgba(56,116,64,0.16)]';
export const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";
export const EYEBROW =
  'm-0 font-sans text-[11.5px] leading-[14px] font-bold tracking-[0.69px] text-[#387440] uppercase max-lg:text-[12px]';

/* JetBrains Mono (code) + DM Mono (chess coordinates) — same loader the lab flow uses, safe to call twice. */
export const ensureGameFonts = () => {
  if (typeof document === 'undefined') return;
  if (!document.querySelector('link[data-lab-mono]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap';
    link.setAttribute('data-lab-mono', '');
    document.head.appendChild(link);
  }
  if (!document.querySelector('link[data-game-dm-mono]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=DM+Mono:wght@500&display=swap';
    link.setAttribute('data-game-dm-mono', '');
    document.head.appendChild(link);
  }
};

/* ---------- time ---------- */
export const formatClock = (seconds) => {
  const s = Math.max(0, Math.round(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/*
 * useCountdown — whole-second countdown. `running` gates it (a game booted from a Figma frame stays frozen on the drawn
 * value until the player acts, so the screenshot state is stable). Calls onZero once when it reaches 0.
 */
export const useCountdown = ({ start, running, onZero, resetKey }) => {
  const [left, setLeft] = useState(start);
  const zeroRef = useRef(onZero);
  zeroRef.current = onZero;
  useEffect(() => {
    setLeft(start);
  }, [start, resetKey]);
  useEffect(() => {
    if (!running) return undefined;
    const timer = setInterval(() => setLeft((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [running, resetKey]);
  useEffect(() => {
    if (running && left === 0) {
      log('countdown zero');
      zeroRef.current?.();
    }
  }, [left, running]);
  return left;
};

/* ---------- results view-model (LabResultsDialog contract) ---------- */
/*
 * buildGameResult — the end-of-run modal for a skill game. Pass copy follows the drawn Bug Hunt modal (SL-GS12 7943:9038:
 * "SKILL VERIFIED · Python verified. · You squashed 7 of 8 bugs in Bug Hunt. The Verified badge is now on Python on your card,
 * same as passing the lab."); the fail copy reuses the lab "Not verified yet" modal. ⚠️ ASSUMPTION for every game but Bug Hunt.
 */
export const buildGameResult = (cfg) => {
  const {
    skill,
    gameName,
    verb,
    noun,
    statLabel,
    correct,
    total,
    passMark,
    passed,
    earned,
    dots,
    topics,
    neededLabel,
    refresher,
  } = cfg;
  const first = topics.find((row) => !row.strong);
  const refresherRow =
    refresher ??
    (first
      ? {
          title: `Brush up on ${first.label.toLowerCase()}`,
          sub: 'Free 15-min refresher in My Learning',
          cta: 'Open',
        }
      : null);
  if (passed) {
    return {
      id: 'verified',
      tone: 'pass',
      medallion: 'check',
      sticker: 'VERIFIED',
      confetti: 'verified',
      eyebrow: 'SKILL VERIFIED',
      // SL-GS12 draws the whole heading in ink (no green accent on "verified.").
      heading: [[`${skill} verified.`, false]],
      body: `You ${verb} ${correct} of ${total} ${noun} in ${gameName}. The Verified badge is now on ${skill} on your card, same as passing the lab.`,
      stats: [
        { value: `${correct}/${total}`, label: statLabel, tone: 'green' },
        { value: `+${earned} {xp}`, label: 'EARNED', tone: 'gold' },
        { value: 'Verified', label: 'BADGE ADDED', tone: 'green' },
      ],
      dots,
      topics,
      refresher: refresherRow,
      actions: { secondary: 'Back to Skills Lab', primary: 'See it on my skills' },
    };
  }
  return {
    id: 'fail',
    tone: 'retry',
    medallion: 'refresh',
    sticker: 'RETAKES ARE FREE',
    confetti: null,
    eyebrow: 'NOT VERIFIED YET',
    heading: [
      ['So ', false],
      ['close.', true],
    ],
    body: `You got ${correct} of ${total} and need ${passMark} to pass. Nothing changes on your card until you pass. Retake with fresh questions whenever you’re ready.`,
    stats: [
      { value: `${correct}/${total}`, label: statLabel, tone: 'plain' },
      { value: `+${earned} {xp}`, label: 'FOR PRACTICE', tone: 'gold' },
      { value: neededLabel ?? passMark, label: 'NEEDED TO PASS', tone: 'plain' },
    ],
    dots,
    topics,
    refresher: refresherRow,
    actions: { secondary: 'Back to Skills Lab', primary: 'Retake with new questions' },
  };
};

/* Topic rows ("Strong" first, then "Review") from per-round topic + ok flags. */
export const topicRowsFor = (rounds, results, roundWord = 'Round') => {
  const order = [];
  const byTopic = {};
  rounds.forEach((round, i) => {
    if (!byTopic[round.topic]) {
      byTopic[round.topic] = { label: round.topic, nums: [], strong: true };
      order.push(round.topic);
    }
    byTopic[round.topic].nums.push(i + 1);
    if (results[i] !== 'ok') byTopic[round.topic].strong = false;
  });
  const rows = order.map((key) => ({
    label: key,
    strong: byTopic[key].strong,
    qs: `${roundWord}${byTopic[key].nums.length > 1 ? 's' : ''} ${byTopic[key].nums.join(', ')}`,
  }));
  return [...rows.filter((r) => r.strong), ...rows.filter((r) => !r.strong)];
};
