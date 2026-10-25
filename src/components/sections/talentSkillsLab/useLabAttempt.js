import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { debug } from '../../../utils/debug.js';
import { RESULT_SCENARIOS, earnedXp, pickScenario } from './skillsLabLabsData.js';
import { OPTION_LETTERS, fillTokens } from './labFormat.js';

const log = debug('useLabAttempt');

/*
 * useLabAttempt — the answer-state engine behind every lab flow (Python SL-L05 … L11b; other labs reuse it unchanged).
 *
 *   status:  playing ──select──▶ selected ──check──▶ correct | wrong ──next──▶ playing (next challenge) … ▶ finished
 *   hintUsed overlays playing / selected (L09): costs flow.hintCost, once per challenge.
 *   finished → results modal (scenario verified | perfect | fail | tough, see skillsLabLabsData.RESULT_SCENARIOS).
 *
 * Input   { flow, frame }  flow = a LAB_FLOWS entry; frame = the `?f=` code (or null). A known frame boots the engine in the
 *         exact state the Figma frame draws (flow.frames[frame]); anything else boots from flow.session (challenge 5, Resume).
 * Live    flow.live = { answer(body), finish(), restart() } (useLiveLabFlow.js): the server holds the answer keys. check()
 *         posts the pick and waits ('checking'); the reply's `reveal` (answer, explain, …) is merged into that question only
 *         then. Finishing posts /finish once. Without flow.live (demo, ?f= frames) everything is decided locally as before.
 * Output  everything a screen needs: question, dots, countLabel, summary, optionStates, feedback, footer flags, result view,
 *         plus the actions select(i) check() hint() next() restart(). Copy strings still contain the {xp} token.
 */
const initialState = (flow, frame) => {
  const seed = frame ? flow.frames?.[frame] : null;
  if (seed) {
    return {
      index: seed.index,
      results: seed.results,
      status: seed.status,
      selected: seed.selected ?? null,
      hintUsed: Boolean(seed.hintUsed),
      xp: seed.xp,
      scenario: seed.scenario ?? null,
      fromFrame: true,
      revealed: {},
      error: null,
    };
  }
  return {
    index: flow.session.index,
    results: flow.session.results,
    status: 'playing',
    selected: null,
    hintUsed: false,
    xp: flow.session.xp,
    scenario: null,
    fromFrame: false,
    revealed: {},
    error: null,
  };
};

const freshRun = (flow) => ({
  index: 0,
  results: [],
  status: 'playing',
  selected: null,
  hintUsed: false,
  xp: flow.session.xp,
  scenario: null,
  fromFrame: false,
  revealed: {},
  error: null,
});

/* A question with the server's reveal merged in (answer, explanation, phrase order, chess solution). */
export const withReveal = (question, reveal) => {
  if (!question || !reveal) return question;
  const merged = {
    ...question,
    answer: reveal.answer,
    explain: reveal.explain ?? { right: '', wrong: '' },
  };
  if (reveal.weaker) merged.weaker = reveal.weaker;
  if (reveal.answerLabel) merged.answerLabel = reveal.answerLabel;
  if (reveal.correct || reveal.marksByArrangement) {
    merged.body = {
      ...question.body,
      correct: reveal.correct ?? undefined,
      marksByArrangement: reveal.marksByArrangement ?? undefined,
    };
  }
  if (question.body?.puzzle) {
    merged.body = {
      ...question.body,
      puzzle: {
        ...question.body.puzzle,
        answer: reveal.answer,
        san: reveal.san,
        mateSq: reveal.mateSq,
        explain: reveal.puzzleExplain ?? '',
      },
    };
  }
  return merged;
};

const countOk = (results) => results.filter((r) => r === 'ok').length;

const reducer = (state, action) => {
  const { flow } = action;
  switch (action.type) {
    case 'select':
      if (state.status !== 'playing' && state.status !== 'selected') return state;
      return { ...state, status: 'selected', selected: action.optionIndex, error: null };
    case 'checking':
      if (state.status !== 'selected') return state;
      return { ...state, status: 'checking', error: null };
    case 'checkFailed':
      return {
        ...state,
        status: state.selected === null ? 'playing' : 'selected',
        error: action.error,
      };
    case 'probeMissed':
      // Chess: a wrong first move the server did not count yet; back to playing (the board shows "1 try left").
      return { ...state, status: 'playing', selected: null };
    case 'revealed': {
      if (state.status !== 'checking' && state.status !== 'selected' && state.status !== 'playing')
        return state;
      const results = [...state.results];
      results[state.index] = action.ok ? 'ok' : 'bad';
      return {
        ...state,
        results,
        selected: action.selected ?? state.selected,
        revealed: { ...state.revealed, [action.questionId]: action.reveal },
        status: action.ok ? 'correct' : 'wrong',
        xp: action.ok ? state.xp + flow.correctXp : state.xp,
      };
    }
    case 'hint':
      if (state.hintUsed || (state.status !== 'playing' && state.status !== 'selected'))
        return state;
      return { ...state, hintUsed: true, xp: state.xp - flow.hintCost };
    case 'check': {
      if (state.status !== 'selected' || state.selected === null) return state;
      const question = flow.questions[state.index];
      const ok = state.selected === question.answer;
      const results = [...state.results];
      results[state.index] = ok ? 'ok' : 'bad';
      return {
        ...state,
        results,
        status: ok ? 'correct' : 'wrong',
        xp: ok ? state.xp + flow.correctXp : state.xp,
      };
    }
    case 'next': {
      if (state.status !== 'correct' && state.status !== 'wrong') return state;
      if (state.index + 1 < flow.total) {
        return {
          ...state,
          index: state.index + 1,
          status: 'playing',
          selected: null,
          hintUsed: false,
        };
      }
      const correct = countOk(state.results);
      const scenario = pickScenario(correct, flow.total, flow.passMark);
      // Header XP after a finished run = the XP the talent had before this attempt + what the results modal says was earned.
      return {
        ...state,
        status: 'finished',
        selected: null,
        scenario,
        xp: flow.session.xp + earnedXp(scenario, correct),
      };
    }
    case 'restart':
      return freshRun(flow);
    case 'restartLive':
      return { ...freshRun(flow), index: 0, results: [], xp: 0 };
    default:
      return state;
  }
};

/* Topic rows for a real run: topics where every question was right ("Strong") first, then the ones to review. */
const topicRows = (questions, results) => {
  const order = [];
  const byTopic = {};
  questions.forEach((q, i) => {
    if (!byTopic[q.topic]) {
      byTopic[q.topic] = { label: q.topic, qs: [], strong: true };
      order.push(q.topic);
    }
    byTopic[q.topic].qs.push(`Q${i + 1}`);
    if (results[i] !== 'ok') byTopic[q.topic].strong = false;
  });
  const rows = order.map((k) => ({ ...byTopic[k], qs: byTopic[k].qs.join(', ') }));
  return [...rows.filter((r) => r.strong), ...rows.filter((r) => !r.strong)];
};

/* The results modal view-model: scenario copy with the numbers filled in (the {xp} token is left for render time). */
export const buildResultView = (flow, state) => {
  const correct = countOk(state.results);
  const scenarioId = state.scenario ?? pickScenario(correct, flow.total, flow.passMark);
  // Labs may override the shared copy per scenario (`flow.resultCopy.<scenarioId>`), e.g. Figma's own wording per lab.
  const scenario = { ...RESULT_SCENARIOS[scenarioId], ...(flow.resultCopy?.[scenarioId] ?? {}) };
  const framed = state.fromFrame ? flow.frameResults?.[scenarioId] : null;
  const earned = framed ? framed.earned : earnedXp(scenarioId, correct);
  const topics = framed ? framed.topics : topicRows(flow.questions, state.results);
  const firstReview = topics.find((row) => !row.strong);
  const refresherTemplate = framed ? framed.refresher : flow.refreshers?.[scenarioId];
  const vars = {
    n: correct,
    total: flow.total,
    passMark: flow.passMark,
    title: flow.title,
    earned,
  };
  const fill = (s) => fillTokens(s, vars);
  return {
    id: scenarioId,
    tone: scenario.tone,
    medallion: scenario.medallion,
    sticker: scenario.sticker,
    confetti: scenario.confetti ?? null,
    eyebrow: fill(scenario.eyebrow),
    heading: scenario.heading.map(([text, accent]) => [fill(text), accent]),
    body: fill(scenario.body),
    stats: scenario.stats.map((s) => ({ ...s, value: fill(s.value) })),
    dots: state.results.map((r) => (r === 'ok' ? 'ok' : 'bad')),
    topics,
    refresher: refresherTemplate
      ? {
          ...refresherTemplate,
          title: fillTokens(refresherTemplate.title, {
            topic: (firstReview?.label ?? flow.title).toLowerCase(),
          }),
        }
      : null,
    actions: scenario.actions,
  };
};

export const useLabAttempt = ({ flow, frame = null }) => {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    log('init', { lab: flow.id, frame });
    return initialState(flow, frame);
  });

  const act = useCallback(
    (type, extra = {}) => {
      log('action', type, extra);
      dispatch({ type, flow, ...extra });
    },
    [flow]
  );

  // The latest pick, readable right after select() in the same tick (chess "give up", phrases: select then check).
  const pickRef = useRef(state.selected);
  pickRef.current = state.status === 'selected' ? state.selected : pickRef.current;
  const finishSent = useRef(false);
  const live = flow.live ?? null;

  useEffect(() => {
    if (!live || state.status !== 'finished' || finishSent.current) return;
    finishSent.current = true;
    live.finish().catch((err) => log('finish failed', err?.response?.status || err?.message));
  }, [live, state.status]);

  return useMemo(() => {
    const base = flow.questions[state.index];
    const question = withReveal(base, state.revealed?.[base?.id]);
    const finished = state.status === 'finished';
    const answered = state.status === 'correct' || state.status === 'wrong';
    const correctCount = countOk(state.results);
    const reviewCount = state.results.filter((r) => r === 'bad').length;

    const dots = Array.from({ length: flow.total }, (_, i) => {
      if (state.results[i]) return { state: state.results[i], label: String(i + 1) };
      if (i === state.index && !finished) return { state: 'now', label: String(i + 1) };
      return { state: 'todo', label: String(i + 1) };
    });

    // One entry per option: tone = idle | selected | correct | wrong | dim, chip = text label shown on the right (or null).
    const optionStates = question.options.map((_, i) => {
      if (!answered) return { tone: state.selected === i ? 'selected' : 'idle', chip: null };
      const isAnswer = i === question.answer;
      const isPick = i === state.selected;
      if (state.status === 'correct') {
        return isPick ? { tone: 'correct', chip: 'Your answer' } : { tone: 'dim', chip: null };
      }
      if (isPick) return { tone: 'wrong', chip: 'Your answer' };
      if (isAnswer) return { tone: 'correct', chip: 'Correct answer' };
      return { tone: 'dim', chip: null };
    });

    let feedback = null;
    if (state.status === 'correct') {
      feedback = {
        tone: 'correct',
        title: `Nailed it · +${flow.correctXp} {xp}`,
        body: question.explain.right,
      };
    } else if (state.status === 'wrong') {
      feedback = {
        tone: 'wrong',
        title: `Not quite. The answer is ${OPTION_LETTERS[question.answer]}.`,
        body: question.explain.wrongByOption?.[state.selected] ?? question.explain.wrong,
      };
    }

    return {
      flow,
      state,
      status: state.status,
      index: state.index,
      question,
      selected: state.selected,
      hintUsed: state.hintUsed,
      xp: state.xp,
      streakDays: flow.session.streakDays,
      finished,
      answered,
      canCheck: state.status === 'selected',
      canHint: !state.hintUsed && (state.status === 'playing' || state.status === 'selected'),
      isLast: state.index + 1 >= flow.total,
      countLabel: finished
        ? `All ${flow.total} done`
        : `Challenge ${state.index + 1} of ${flow.total}`,
      summary:
        [
          correctCount ? `${correctCount} correct` : null,
          reviewCount ? `${reviewCount} to review` : null,
        ]
          .filter(Boolean)
          .join(' · ') || 'Just started',
      passMark: `Pass mark: ${flow.passMark} of ${flow.total}`,
      dots,
      optionStates,
      feedback,
      result: finished ? buildResultView(flow, state) : null,
      live: Boolean(live),
      checking: state.status === 'checking',
      error: state.error,
      select: (optionIndex) => {
        pickRef.current = optionIndex;
        act('select', { optionIndex });
      },
      check: () => {
        if (!live) return act('check');
        const selected = pickRef.current;
        if (selected === null || selected === undefined || answered || state.status === 'checking')
          return undefined;
        act('checking');
        return live
          .answer({ questionId: base.id, selected, hintUsed: state.hintUsed, final: true })
          .then((r) =>
            act('revealed', { ok: r.ok, reveal: r.reveal, questionId: base.id, selected })
          )
          .catch((err) => {
            log('check failed', err?.response?.status || err?.message);
            act('checkFailed', { error: 'Could not check that answer. Try again.' });
          });
      },
      // Chess (live): a move that may be a counted miss or a free first try. Resolves { final } so the board can react.
      tryMove: async (move, { final = false } = {}) => {
        if (!live) return null;
        pickRef.current = move;
        act('select', { optionIndex: move });
        act('checking');
        try {
          const r = await live.answer({
            questionId: base.id,
            selected: move,
            hintUsed: state.hintUsed,
            final,
          });
          if (r.final === false) {
            act('probeMissed');
            return r;
          }
          act('revealed', {
            ok: r.ok,
            reveal: r.reveal,
            questionId: base.id,
            selected: r.ok ? move : `miss:${move}`,
          });
          return r;
        } catch (err) {
          log('move failed', err?.response?.status || err?.message);
          act('checkFailed', { error: 'Could not check that move. Try again.' });
          return null;
        }
      },
      hint: () => act('hint'),
      next: () => act('next'),
      restart: () => {
        if (!live) return act('restart');
        finishSent.current = false;
        return live
          .restart()
          .then(() => act('restartLive'))
          .catch((err) => log('restart failed', err?.response?.status || err?.message));
      },
    };
  }, [flow, state, act, live]);
};
