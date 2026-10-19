import { debug } from '../../../../utils/debug.js';
import ChessQuestion from './ChessQuestion.jsx';
import { encodeMove } from './chessData.js';
import { chessView } from './chessLogic.js';
import { CHESS_PUZZLES } from './chessData.js';
import { ChoiceBody, PhrasesBody, ScenarioBody } from './ExtQuestions.jsx';

const log = debug('extKinds');

/*
 * Kind table of the extended labs. A kind = { Body, footer?, digit? }:
 *   Body    component drawing the challenge column, props { ctx }; ctx = { attempt, draft, setDraft, t, flow }
 *   footer  (ctx) -> { note?, link?, action? } overrides the default "Check answer" / "Next …" footer
 *   digit   (n, ctx) keyboard 1–9
 * The engine stores the outcome (select + check); what a kind needs on top lives in `draft` (see ExtLabScreen).
 */
const digitSelect = (n, { attempt }) => {
  if (!attempt.answered && n <= attempt.question.options.length) attempt.select(n - 1);
};

const phrasesFooter = ({ attempt, draft, setDraft }) => {
  if (attempt.answered) return {};
  const { slots, correct } = attempt.question.body;
  const placed = draft.placed ?? [];
  const left = slots - placed.length;
  return {
    note: left > 0 ? `Place ${left} more to check` : null,
    action: {
      label: 'Check answer',
      disabled: left > 0,
      onClick: () => {
        if (left > 0) return;
        log('check arrangement', placed.join('|'), 'expected', correct.join('|'));
        attempt.select(placed.join('|'));
        attempt.check();
        setDraft({ placed });
      },
    },
  };
};

const phrasesDigit = (n, { attempt, draft, setDraft }) => {
  if (attempt.answered) return;
  const { phrases, slots } = attempt.question.body;
  const placed = draft.placed ?? [];
  const p = phrases[n - 1];
  if (p && !placed.includes(p.id) && placed.length < slots) setDraft({ placed: [...placed, p.id] });
};

const chessFooter = (ctx) => {
  const { attempt, draft, setDraft, t } = ctx;
  if (attempt.answered) return { nextLabel: 'Next puzzle' };
  const puzzle = CHESS_PUZZLES[attempt.index];
  const view = chessView({ attempt, draft, puzzle, t });
  const giveUp = {
    label: 'Give up and see the answer',
    onClick: () => {
      log('give up');
      attempt.select('giveup');
      attempt.check();
    },
  };
  if (view.state === 'failed') {
    return {
      link: giveUp,
      action: {
        label: 'Try again',
        onClick: () => setDraft({ from: null, to: null, shown: false, fails: draft.fails ?? 0 }),
      },
    };
  }
  const ready = Boolean(draft.from && draft.to);
  return {
    link: giveUp,
    action: {
      label: 'Play move',
      disabled: !ready,
      onClick: () => {
        if (!ready) return;
        const move = encodeMove(draft.from, draft.to);
        if (move === puzzle.answer) {
          log('solved', move);
          attempt.select(move);
          attempt.check();
          return;
        }
        const fails = (draft.fails ?? 0) + 1;
        log('wrong move', move, { fails });
        if (fails >= 2) {
          attempt.select(`miss:${move}`);
          attempt.check();
        } else {
          setDraft({ from: draft.from, to: draft.to, fails, shown: true });
        }
      },
    },
  };
};

export const EXT_KINDS = {
  choice: { Body: ChoiceBody, digit: digitSelect },
  scenario: { Body: ScenarioBody, digit: digitSelect },
  phrases: { Body: PhrasesBody, footer: phrasesFooter, digit: phrasesDigit },
  chess: { Body: ChessQuestion, footer: chessFooter },
};
