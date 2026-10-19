import { useCallback, useEffect, useMemo, useReducer } from 'react';
import { debug } from '../../../../utils/debug.js';
import { fillTokens } from '../../talentSkillsLab/labFormat.js';
import {
  FULL_FRAMES,
  FULL_FRAME_DOTS_FAIL,
  FULL_FRAME_TOPICS,
  FULL_TOPIC_LABELS,
  FULL_TYPESCRIPT_QUESTIONS,
} from '../assessmentData.js';

const log = debug('fullFlow');

/*
 * fullFlow — state engine of the full assessment (MA-05 … MA-13). Pure helpers + `useFullAssessment`.
 *
 * State: { phase: 'playing' | 'finished', index, committed[25] (answer saved after "Next", null = unanswered), pending
 * (option picked on the current question, not yet saved), hints { [index]: removedOptionIndex }, secondsLeft, frozen,
 * dialog: null | 'leave' | 'resume' | 'timeup', resumeLeft, finished: { outcome, score, correct, topics, dots, earned,
 * elapsedMin, retakeFrom } }.
 *
 * The clock ticks once a second while playing; it pauses while the resume dialog is open (connection lost) and keeps
 * running while the leave dialog is open or the learner is away (drawn copy). `frozen` (frame seeds) holds every clock
 * still until the first pointer / key event so a `?f=` frame can be compared with Figma.
 * Progress of a live run is kept in localStorage so "Save and exit" / "Leave anyway" can be resumed (⚠️ ASSUMPTION, see
 * assessmentData.js).
 */
const STORE = 'gth:assessment:';

export const fmtClock = (seconds) => {
  const s = Math.max(0, Math.round(seconds));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

export const isStrong = (right, total) => right / total >= 0.7;

/* Score a run: topic rows, dots and the pass / fail outcome (⚠️ ASSUMPTION rule: correct / total x 100, pass at passMark). */
export const scoreRun = (flow, committed) => {
  const perTopic = {};
  let correct = 0;
  const dots = FULL_TYPESCRIPT_QUESTIONS.map((q, i) => {
    const bucket = (perTopic[q.topic] ??= { right: 0, total: 0 });
    bucket.total += 1;
    const ok = committed[i] === q.answer;
    if (ok) {
      bucket.right += 1;
      correct += 1;
    }
    return ok ? 'ok' : 'bad';
  });
  const topics = Object.keys(FULL_TOPIC_LABELS).map((id) => {
    const { right, total } = perTopic[id];
    return {
      id,
      label: FULL_TOPIC_LABELS[id],
      qs: `${right} of ${total}`,
      strong: isStrong(right, total),
    };
  });
  const score = Math.round((correct / flow.total) * 100);
  return { score, correct, topics, dots, outcome: score >= flow.passMark ? 'pass' : 'fail' };
};

const retakeDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const finishRun = (flow, state, extra = {}) => {
  const committed = [...state.committed];
  if (state.pending !== null && committed[state.index] === null)
    committed[state.index] = state.pending;
  const scored = scoreRun(flow, committed);
  const earned = scored.outcome === 'pass' ? flow.passXp : flow.practiceXp;
  return {
    ...state,
    committed,
    pending: null,
    phase: 'finished',
    dialog: null,
    index: flow.total - 1,
    finished: {
      ...scored,
      earned,
      elapsedMin: Math.max(1, Math.round((flow.totalSeconds - state.secondsLeft) / 60)),
      retakeFrom: retakeDate(flow.retakeDays),
      ...extra,
    },
  };
};

const hintsUsed = (state) => Object.keys(state.hints).length;
export const answeredCount = (state) => state.committed.filter((v) => v !== null).length;

const freshState = (flow) => ({
  phase: 'playing',
  index: 0,
  committed: Array(flow.total).fill(null),
  pending: null,
  hints: {},
  secondsLeft: flow.totalSeconds,
  frozen: false,
  dialog: null,
  resumeLeft: flow.resumeWindowSeconds,
  baseXp: flow.startXp,
  scoringPct: null,
  answeredOverride: null,
  finished: null,
});

const fromSeed = (flow, seed) => {
  const base = freshState(flow);
  const committed = Array(flow.total).fill(null);
  (seed.committed ?? []).forEach((v, i) => {
    committed[i] = v;
  });
  const state = {
    ...base,
    committed,
    index: seed.index ?? 0,
    pending: seed.pending ?? null,
    secondsLeft: seed.secondsLeft ?? base.secondsLeft,
    baseXp: seed.xp ?? base.baseXp,
    frozen: Boolean(seed.frozen),
    dialog: seed.dialog ?? null,
    resumeLeft: seed.resumeLeft ?? base.resumeLeft,
    scoringPct: seed.scoringPct ?? null,
    answeredOverride: seed.answeredOverride ?? null,
  };
  if (seed.phase === 'finished') {
    return {
      ...state,
      phase: 'finished',
      index: flow.total - 1,
      pending: null,
      finished: {
        outcome: seed.outcome,
        score: seed.score,
        correct: seed.correct,
        topics: FULL_FRAME_TOPICS[seed.outcome],
        dots: seed.outcome === 'fail' ? FULL_FRAME_DOTS_FAIL : [],
        earned: seed.outcome === 'pass' ? flow.passXp : flow.practiceXp,
        elapsedMin: seed.elapsedMin,
        retakeFrom: seed.retakeFrom ?? retakeDate(flow.retakeDays),
        frame: true,
      },
    };
  }
  return state;
};

const loadSaved = (flow) => {
  try {
    const raw = window.localStorage.getItem(STORE + flow.id);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    const away = (Date.now() - saved.savedAt) / 1000;
    const state = { ...freshState(flow), ...saved.state, frozen: false, finished: null };
    if (saved.paused) {
      // Clock paused when the connection dropped: valid for the 30-minute resume window.
      if (away > flow.resumeWindowSeconds) return { ...state, secondsLeft: 0, dialog: 'timeup' };
      return {
        ...state,
        dialog: 'resume',
        resumeLeft: Math.round(flow.resumeWindowSeconds - away),
      };
    }
    const left = Math.round(state.secondsLeft - away);
    return left <= 0
      ? { ...state, secondsLeft: 0, dialog: 'timeup' }
      : { ...state, secondsLeft: left };
  } catch {
    return null;
  }
};

const init = ({ flow, frame, resume }) => {
  const seed = frame ? FULL_FRAMES[frame] : null;
  if (seed && seed.screen === 'play') return fromSeed(flow, seed);
  if (!seed && resume) {
    const saved = loadSaved(flow);
    if (saved) {
      log('restored saved run', { index: saved.index });
      return saved;
    }
  }
  return freshState(flow);
};

const reducer = (state, action) => {
  const { flow } = action;
  switch (action.type) {
    case 'release':
      return state.frozen ? { ...state, frozen: false } : state;
    case 'select': {
      if (state.phase !== 'playing' || state.hints[state.index] === action.option) return state;
      return { ...state, pending: action.option };
    }
    case 'next': {
      if (state.phase !== 'playing' || state.pending === null) return state;
      const committed = [...state.committed];
      committed[state.index] = state.pending;
      if (state.index >= flow.total - 1)
        return finishRun(flow, { ...state, committed, pending: committed[state.index] });
      const index = state.index + 1;
      return { ...state, committed, index, pending: committed[index] };
    }
    case 'prev': {
      if (state.phase !== 'playing' || state.index === 0) return state;
      const committed = [...state.committed];
      if (state.pending !== null) committed[state.index] = state.pending;
      const index = state.index - 1;
      return { ...state, committed, index, pending: committed[index] };
    }
    case 'hint': {
      if (state.phase !== 'playing' || state.hints[state.index] !== undefined) return state;
      const q = FULL_TYPESCRIPT_QUESTIONS[state.index];
      const wrong = q.options.map((_, i) => i).filter((i) => i !== q.answer && i !== state.pending);
      const removed = wrong[wrong.length - 1];
      return {
        ...state,
        hints: { ...state.hints, [state.index]: removed },
        pending: state.pending === removed ? null : state.pending,
      };
    }
    case 'tick': {
      if (state.frozen || state.phase !== 'playing') return state;
      if (state.dialog === 'resume') {
        const resumeLeft = state.resumeLeft - 1;
        return resumeLeft <= 0
          ? { ...state, resumeLeft: 0, dialog: 'timeup' }
          : { ...state, resumeLeft };
      }
      if (state.dialog === 'timeup') return state;
      const secondsLeft = state.secondsLeft - 1;
      return secondsLeft <= 0
        ? { ...state, secondsLeft: 0, dialog: 'timeup' }
        : { ...state, secondsLeft };
    }
    case 'dialog':
      return state.phase === 'playing' ? { ...state, dialog: action.name } : state;
    case 'offline':
      return state.phase === 'playing' && state.dialog !== 'timeup'
        ? { ...state, dialog: 'resume', resumeLeft: flow.resumeWindowSeconds }
        : state;
    case 'resume':
      return { ...state, dialog: null, resumeLeft: flow.resumeWindowSeconds };
    case 'finish':
      return state.phase === 'playing' ? finishRun(flow, state) : state;
    default:
      return state;
  }
};

export const useFullAssessment = ({ flow, frame = null, resume = false }) => {
  const [state, dispatch] = useReducer(reducer, { flow, frame, resume }, init);

  const act = useCallback(
    (type, extra = {}) => {
      log('action', type, extra);
      dispatch({ type, flow, ...extra });
    },
    [flow]
  );

  // Clock.
  useEffect(() => {
    if (state.phase !== 'playing') return undefined;
    const id = window.setInterval(() => dispatch({ type: 'tick', flow }), 1000);
    return () => window.clearInterval(id);
  }, [state.phase, flow]);

  // Frame seeds hold the clock until the first real interaction.
  useEffect(() => {
    if (!state.frozen) return undefined;
    const release = () => dispatch({ type: 'release', flow });
    window.addEventListener('pointerdown', release, { once: true });
    window.addEventListener('keydown', release, { once: true });
    return () => {
      window.removeEventListener('pointerdown', release);
      window.removeEventListener('keydown', release);
    };
  }, [state.frozen, flow]);

  // Connection lost (real browsers): pause the clock and ask to resume.
  useEffect(() => {
    const onOffline = () => dispatch({ type: 'offline', flow });
    window.addEventListener('offline', onOffline);
    return () => window.removeEventListener('offline', onOffline);
  }, [flow]);

  // Save after every answer so Save and exit / Leave anyway / a dropped connection can be picked up again.
  const live = frame === null;
  useEffect(() => {
    if (!live) return;
    try {
      if (state.phase === 'finished') {
        window.localStorage.removeItem(STORE + flow.id);
        return;
      }
      const { committed, index, pending, hints, secondsLeft, baseXp } = state;
      window.localStorage.setItem(
        STORE + flow.id,
        JSON.stringify({
          savedAt: Date.now(),
          paused: state.dialog === 'resume',
          state: { committed, index, pending, hints, secondsLeft, baseXp },
        })
      );
    } catch {
      /* storage can be blocked: the run still works, it just is not resumable */
    }
    // The clock itself is not a dependency on purpose: the snapshot is relative to `savedAt`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, state.committed, state.index, state.pending, state.hints, state.phase, state.dialog]);

  return useMemo(() => {
    const q = FULL_TYPESCRIPT_QUESTIONS[state.index];
    const finished = state.phase === 'finished';
    const used = hintsUsed(state);
    const hintRemoved = state.hints[state.index];
    const answered = state.answeredOverride ?? answeredCount(state);
    return {
      state,
      question: q,
      index: state.index,
      finished,
      result: state.finished,
      answered,
      answeredReal: answeredCount(state),
      selected: state.pending,
      hintRemoved,
      hintUsedHere: hintRemoved !== undefined,
      xp:
        state.baseXp -
        used * flow.hintCost +
        (finished && !state.finished?.frame ? state.finished.earned : 0),
      isLast: state.index >= flow.total - 1,
      select: (option) => act('select', { option }),
      next: () => act('next'),
      prev: () => act('prev'),
      hint: () => act('hint'),
      openDialog: (name) => act('dialog', { name }),
      closeDialog: () => act('dialog', { name: null }),
      resumeRun: () => act('resume'),
      finish: () => act('finish'),
    };
  }, [state, flow, act]);
};

/* Results modal view-model (FullResultDialog shape) from a finished run. {xp} stays a token: the dialog fills it per style. */
export const buildResultView = (flow, finished) => {
  const base = flow.results[finished.outcome];
  const vars = {
    score: finished.score,
    earned: finished.earned,
    top: Math.max(1, 100 - finished.score),
    date: finished.retakeFrom,
  };
  const fill = (text) => fillTokens(text, vars);
  const anyReview = finished.topics.some((row) => !row.strong);
  return {
    ...base,
    body: fill(base.body),
    stats: base.stats.map((stat) => ({ ...stat, value: fill(stat.value) })),
    // MA-06 (pass) draws no answer dots, MA-10 (fail) does.
    dots: finished.outcome === 'fail' ? finished.dots : [],
    topics: finished.topics,
    refresher: anyReview ? base.refresher : null,
  };
};
