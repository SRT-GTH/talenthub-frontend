import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import LabPlayChrome from '../LabPlayChrome.jsx';
import LabResultsDialog from '../LabResultsDialog.jsx';
import { LeaveLabDialog, RestartLabDialog } from '../SkillsLabLabDialogs.jsx';
import { useLabText } from '../labFormat.js';
import { useLabAttempt } from '../useLabAttempt.js';
import { ExtFooter } from './ExtParts.jsx';
import { EXT_KINDS } from './extKinds.js';
import { registerFlowConfetti } from './extConfetti.js';

const log = debug('ExtLabScreen');

/*
 * ExtLabScreen — the lab screen for flows that need more than LabPlayPage's built-in one (Public speaking, Team leadership, Strategic
 * thinking): own footer wording ("Next scenario", "Play move", "Place 2 more to check", "Give up and see the answer"), own progress
 * wording ("Scenario 2 of 5", "2 strong answers"), question kinds beyond multiple choice. LabPlayPage renders `flow.Screen` instead of
 * its own LabFlowScreen when a flow defines one. Same chrome, same engine (useLabAttempt), same dialogs.
 *
 * flow.ui = { unit: 'Challenge' | 'Scenario' | 'Puzzle', next: 'Next challenge', last: 'See results', summary(results) -> string,
 *             wide?: boolean (chess: 1458px column, no side doodles) }
 * question.kind picks the renderer from extKinds.js. `draft` = per-question interaction state (placed phrases, chess move) that is
 * not part of the engine; frame seeds provide it with flow.frames[code].draft.
 */
const EMPTY = {};

const ExtLabScreen = ({ flow, frame }) => {
  const attempt = useLabAttempt({ flow, frame });
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { t } = useLabText();
  const modal = params.get('modal');
  const hubPath = '/skills-lab';
  const { ui } = flow;
  registerFlowConfetti(flow);

  const seed = frame ? flow.frames?.[frame] : null;
  const [draftState, setDraftState] = useState(() => ({
    qi: seed ? seed.index : attempt.index,
    ...(seed?.draft ?? EMPTY),
  }));
  const draft = draftState.qi === attempt.index ? draftState : { qi: attempt.index };
  const setDraft = (patch) =>
    setDraftState((prev) => ({
      ...(prev.qi === attempt.index ? prev : { qi: attempt.index }),
      ...patch,
    }));

  useEffect(() => {
    log('mount', { lab: flow.id, frame });
  }, [flow, frame]);

  const kind = EXT_KINDS[attempt.question.kind];
  const ctx = { attempt, draft, setDraft, t, flow };
  const kindFooter = kind.footer ? kind.footer(ctx) : EMPTY;

  const setModal = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set('modal', value);
    else next.delete('modal');
    setParams(next, { replace: true });
  };

  const defaultAction = attempt.answered
    ? {
        label: kindFooter.nextLabel ?? (attempt.isLast ? ui.last : ui.next),
        onClick: attempt.next,
      }
    : {
        label: attempt.checking ? 'Checking…' : 'Check answer',
        onClick: attempt.check,
        disabled: !attempt.canCheck && !(attempt.finished && attempt.selected != null),
      };
  const action = kindFooter.action ?? defaultAction;

  const hint = attempt.hintUsed
    ? { mode: 'used', usedLabel: 'Hint used', cost: t('−{cost} {xp}', { cost: flow.hintCost }) }
    : {
        mode: 'link',
        prompt: 'Stuck?',
        linkLabel: t('Use a hint (−{cost} {xp})', { cost: flow.hintCost }),
        onClick: attempt.hint,
        disabled: !attempt.canHint,
      };

  // Keys 1–n pick an answer / place a phrase, Enter checks / continues.
  useEffect(() => {
    const onKey = (event) => {
      if (modal || attempt.finished || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      const n = Number(event.key);
      if (n >= 1 && n <= 9 && kind.digit) {
        kind.digit(n, ctx);
      } else if (event.key === 'Enter' && event.target?.tagName !== 'BUTTON') {
        if (!action.disabled) action.onClick?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const restart = () => {
    setDraftState({ qi: -1 });
    attempt.restart();
  };

  let dialog = null;
  if (attempt.finished && attempt.result && !modal) {
    const { id } = attempt.result;
    dialog = (
      <LabResultsDialog
        result={attempt.result}
        onClose={() => navigate(hubPath)}
        onSecondary={() => (id === 'fail' || id === 'tough' ? restart() : navigate(hubPath))}
        onPrimary={() => {
          if (id === 'verified' || id === 'perfect') navigate('/profile');
          else if (id === 'tough') navigate('/learning');
          else restart();
        }}
        onRefresher={() => navigate('/learning')}
      />
    );
  } else if (modal === 'restart') {
    dialog = (
      <RestartLabDialog
        lab={flow.title}
        correct={attempt.state.results.filter((r) => r === 'ok').length}
        onClose={() => setModal(null)}
        onConfirm={() => {
          restart();
          setModal(null);
        }}
      />
    );
  } else if (modal === 'leave') {
    dialog = (
      <LeaveLabDialog
        challenge={attempt.index + 1}
        total={flow.total}
        onClose={() => setModal(null)}
        onConfirm={() => navigate(hubPath)}
      />
    );
  }

  const footer = (
    <ExtFooter hint={hint} note={kindFooter.note} link={kindFooter.link} action={action} />
  );

  return (
    <LabPlayChrome
      title={flow.headerTitle}
      subtitle={flow.subtitle}
      sticker={flow.sticker}
      xp={`${attempt.xp} ${t('{xp}')}`}
      streak={attempt.streakDays ? `${attempt.streakDays}-day streak` : null}
      onExit={() => setModal('leave')}
      onSaveExit={() => navigate(hubPath)}
      onHelp={() => {
        const next = new URLSearchParams(params);
        next.set('help', '1');
        setParams(next, { replace: true });
      }}
      progress={{
        countLabel: attempt.finished
          ? `All ${flow.total} done`
          : `${ui.unit} ${attempt.index + 1} of ${flow.total}`,
        summary: ui.summary(attempt.state.results),
        dots: attempt.dots,
        passMark: attempt.passMark,
      }}
      decorations={!ui.wide}
      contentClassName={ui.wide ? 'max-w-[1458px]' : undefined}
      overlay={
        <>
          {footer}
          {dialog}
        </>
      }
    >
      {attempt.error ? (
        <p role="alert" className="m-0 mb-[12px] rounded-[12px] bg-[#fdecea] p-[12px] font-sans text-[14px] text-[#8a1c1c]">
          {attempt.error}
        </p>
      ) : null}
      <kind.Body ctx={ctx} />
    </LabPlayChrome>
  );
};

export default ExtLabScreen;
