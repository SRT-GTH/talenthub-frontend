import { useEffect } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import HelpPopover from '../../components/sections/notifications/HelpPopover.jsx';
import LabPlayChrome from '../../components/sections/talentSkillsLab/LabPlayChrome.jsx';
import LabResultsDialog from '../../components/sections/talentSkillsLab/LabResultsDialog.jsx';
import {
  LeaveLabDialog,
  RestartLabDialog,
} from '../../components/sections/talentSkillsLab/SkillsLabLabDialogs.jsx';
import '../../components/sections/talentSkillsLab/labQuestionKinds.jsx';
import { getQuestionKind } from '../../components/sections/talentSkillsLab/labQuestionRegistry.js';
import { useLabText } from '../../components/sections/talentSkillsLab/labFormat.js';
import { getLabFlow } from '../../components/sections/talentSkillsLab/skillsLabLabsData.js';
import { useLabAttempt } from '../../components/sections/talentSkillsLab/useLabAttempt.js';
import { useLiveLabFlow } from '../../components/sections/talentSkillsLab/useLiveLabFlow.js';
import { isSkillsLabDemo } from '../../components/sections/talentSkillsLab/skillsLabHubData.js';

const log = debug('LabPlayPage');

/*
 * LAB_FLOW_GUIDE — how a new lab plugs into the lab flow (read this before building Data analysis, UI/UX, Engineering
 * planning, Product management, Public speaking, Team leadership or Strategic thinking).
 *
 *  Route    /skills-lab/lab/:labId/play            real, interactive run (resumes at the session's challenge)
 *           /skills-lab/lab/:labId/play?f=<code>   boots in the exact state a Figma frame draws (L05, L06 … L11b for Python)
 *           ?modal=restart | leave                 SL-M5 / SL-M6 confirm dialogs (SkillsLabLabDialogs.jsx)
 *
 *  1. DATA   in skillsLabLabsData.js add a block `/* ---- <lab> ---- *\/` that builds a flow object (shape = PYTHON_FLOW):
 *              { id, title, headerTitle, subtitle, sticker, total, passMark, hintCost, correctXp,
 *                session:{ index, results:['ok'|'bad'…], xp, streakDays },
 *                questions:[{ id, kind, topic, title:[[text, accent?]], prompt, body:{…kind specific}, options:[…],
 *                             answer:<index>, hint, explain:{ right, wrong, wrongByOption? } }],
 *                frames:{ L12a:{ index, results, status, selected, hintUsed, xp, scenario? } … },   // ?f= seeds
 *                frameResults:{ verified|perfect|fail|tough:{ earned, topics:[…], refresher } },    // drawn results copy
 *                refreshers:{ … } }
 *            then register it:  LAB_FLOWS.<labId> = flow  (RESULT_SCENARIOS — verified / perfect / fail / tough — is shared).
 *            Strings may carry the {xp} token (XP in Playful, pts in Focused).
 *  2. KIND   every question has a `kind`. 'code-output' exists. For a chart / scenario / chess / sentence-builder question
 *            write a renderer `({ attempt, t }) => …` that draws the challenge column from LabQuestionParts (ChallengeHead,
 *            OptionList, HintCard, FeedbackCard, CodeBlock) or your own JSX, and call
 *            registerQuestionKind('<kind>', Renderer) in labQuestionKinds.jsx (or your own file imported there).
 *            `attempt` is the useLabAttempt() object: question, index, status, selected, hintUsed, optionStates, feedback,
 *            answered, select(i). Custom answer bodies: <OptionList renderOption={(text, i) => …} />.
 *  3. ENGINE nothing to write: useLabAttempt drives playing → selected → correct | wrong → … → finished, hint costs
 *            flow.hintCost, results derive from the answers (RESULT_SCENARIOS + earnedXp/pickScenario in the data file).
 *            Games that want the same chrome (logo bar, lab header, progress strip, footer) import LabPlayChrome and pass
 *            their own children; the props contract is documented at the top of LabPlayChrome.jsx.
 *  4. DETAILS the lab's detail page (/skills-lab/lab/:labId) is data driven from skillsLabData.js `/* ---- details ---- *\/`
 *            — add a LAB_DETAILS entry (GET /skills-lab/labs/:id shape) there; no component work needed.
 *  5. CHECK  ?f=<code> for every Figma frame, Playful AND Focused (localStorage gth:ui-style), then 390 / 320 widths.
 *
 *  Frames of the Python lab live in flow.frames; their results modals use flow.frameResults (the Figma topics) while a real
 *  run derives topics from the questions. Keys 1–4 pick an answer, Enter checks / continues (the lab details copy says so).
 */

const ensureMono = () => {
  if (typeof document === 'undefined' || document.querySelector('link[data-lab-mono]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap';
  link.setAttribute('data-lab-mono', '');
  document.head.appendChild(link);
};

const LabFlowScreen = ({ flow, frame }) => {
  const attempt = useLabAttempt({ flow, frame });
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { t } = useLabText();
  const modal = params.get('modal');
  const hubPath = '/skills-lab';

  const setModal = (value) => {
    const next = new URLSearchParams(params);
    if (value) next.set('modal', value);
    else next.delete('modal');
    setParams(next, { replace: true });
  };

  // Keys 1–4 pick an answer, Enter checks / continues (copy on the lab details page: "Keys 1 to 4 work too.").
  useEffect(() => {
    const onKey = (event) => {
      if (modal || attempt.finished || event.metaKey || event.ctrlKey || event.altKey) return;
      const tag = event.target?.tagName;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag)) return;
      const n = Number(event.key);
      if (n >= 1 && n <= attempt.question.options.length && !attempt.answered) {
        log('key select', n);
        attempt.select(n - 1);
      } else if (event.key === 'Enter' && event.target?.tagName !== 'BUTTON') {
        if (attempt.canCheck) attempt.check();
        else if (attempt.answered) attempt.next();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const Question = getQuestionKind(attempt.question.kind);
  const xpWord = t('{xp}');
  const { hintCost } = flow;

  const action = attempt.answered
    ? {
        // ⚠️ ASSUMPTION: the last challenge says "See results" (Figma only draws "Next challenge").
        label: attempt.isLast ? 'See results' : 'Next challenge',
        onClick: attempt.next,
      }
    : {
        label: attempt.checking ? 'Checking…' : 'Check answer',
        onClick: attempt.check,
        disabled: !attempt.canCheck,
      };

  const hint = attempt.hintUsed
    ? { mode: 'used', usedLabel: 'Hint used', cost: t('−{cost} {xp}', { cost: hintCost }) }
    : {
        mode: 'link',
        prompt: 'Stuck?',
        linkLabel: t('Use a hint (−{cost} {xp})', { cost: hintCost }),
        onClick: attempt.hint,
        disabled: !attempt.canHint,
      };

  let overlay = null;
  if (attempt.finished && attempt.result && !modal) {
    const { id } = attempt.result;
    overlay = (
      <LabResultsDialog
        result={attempt.result}
        onClose={() => navigate(hubPath)}
        onSecondary={() =>
          id === 'fail' || id === 'tough' ? attempt.restart() : navigate(hubPath)
        }
        onPrimary={() => {
          if (id === 'verified' || id === 'perfect') navigate('/profile');
          else if (id === 'tough') navigate('/learning');
          else attempt.restart();
        }}
        onRefresher={() => navigate('/learning')}
      />
    );
  } else if (modal === 'restart') {
    overlay = (
      <RestartLabDialog
        lab={flow.title}
        correct={attempt.state.results.filter((r) => r === 'ok').length}
        onClose={() => setModal(null)}
        onConfirm={() => {
          attempt.restart();
          setModal(null);
        }}
      />
    );
  } else if (modal === 'leave') {
    overlay = (
      <LeaveLabDialog
        challenge={attempt.index + 1}
        total={flow.total}
        onClose={() => setModal(null)}
        onConfirm={() => navigate(hubPath)}
      />
    );
  }

  const helpHome = {
    helpOpen: params.get('help') === '1',
    helpPage: 'skills-lab',
    update: (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, String(v)) : next.delete(k)));
      setParams(next, { replace: true });
    },
  };

  return (
    <>
      <LabPlayChrome
        title={flow.headerTitle}
        subtitle={flow.subtitle}
        sticker={flow.sticker}
        xp={`${attempt.xp} ${xpWord}`}
        streak={attempt.streakDays ? `${attempt.streakDays}-day streak` : null}
        onExit={() => setModal('leave')}
        onSaveExit={() => navigate(hubPath)}
        onHelp={() => {
          const next = new URLSearchParams(params);
          next.set('help', '1');
          setParams(next, { replace: true });
        }}
        progress={{
          countLabel: attempt.countLabel,
          summary: attempt.summary,
          dots: attempt.dots,
          passMark: attempt.passMark,
        }}
        footer={{
          hint,
          action: attempt.finished ? { label: 'Check answer', disabled: true } : action,
        }}
        overlay={overlay}
      >
        {attempt.error ? (
          <p role="alert" className="m-0 mb-[12px] rounded-[12px] bg-[#fdecea] p-[12px] font-sans text-[14px] text-[#8a1c1c]">
            {attempt.error}
          </p>
        ) : null}
        {Question ? (
          <Question attempt={attempt} t={t} />
        ) : (
          <p className="m-0 font-sans text-[15px] text-[#595959]">
            No renderer registered for question kind “{attempt.question.kind}”.
          </p>
        )}
      </LabPlayChrome>
      <HelpPopover home={helpHome} />
    </>
  );
};

const LabPlayPage = () => {
  const { labId } = useParams();
  const [params, setParams] = useSearchParams();
  const frame = params.get('f');
  const localFlow = getLabFlow(labId);
  // Live by default: the server starts / resumes the run and checks every answer. `?demo=1` and Figma frames (`?f=`)
  // keep the local flow.
  const liveRun = useLiveLabFlow({
    labId,
    flow: localFlow,
    enabled: Boolean(localFlow) && !frame && !isSkillsLabDemo(params),
    restart: params.get('restart') === '1',
  });
  const flow = liveRun.status === 'off' ? localFlow : liveRun.flow;

  // "Start over" lands here with ?restart=1: once the fresh run is loaded, drop it so a refresh resumes instead.
  useEffect(() => {
    if (liveRun.status !== 'ready' || params.get('restart') !== '1') return;
    const next = new URLSearchParams(params);
    next.delete('restart');
    setParams(next, { replace: true });
  }, [liveRun.status, params, setParams]);
  // A flow may bring its own screen (labScreens/ExtLabScreen.jsx: Public speaking, Team leadership, Strategic thinking).
  const FlowScreen = flow?.Screen ?? LabFlowScreen;

  useEffect(() => {
    ensurePlayfulFont();
    ensureMono();
  }, []);

  // Same marker as /home so talentA11y.css (focus ring, reduced motion) covers the portaled dialogs.
  useEffect(() => {
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  useEffect(() => {
    log('mount', { labId, frame, hasFlow: Boolean(flow) });
  }, [labId, frame, flow]);

  return (
    <>
      <UiStyleScope enabled />
      {liveRun.status === 'loading' ? (
        <div role="status" className="flex min-h-screen items-center justify-center bg-[#f7f8f4] font-sans text-[15px] text-[#595959]">
          Loading your lab…
        </div>
      ) : flow ? (
        <FlowScreen key={`${labId}:${frame ?? ''}:${liveRun.status}`} flow={flow} frame={frame} />
      ) : liveRun.status === 'error' && liveRun.error !== 'missing' ? (
        <div className="flex min-h-screen flex-col items-center justify-center gap-[12px] bg-[#f7f8f4] p-[24px] font-sans text-[#1c2a21]">
          <p className="m-0 text-[16px]">Could not load this lab. Check your connection and try again.</p>
          <Link to="/skills-lab" className="text-[14px] font-semibold text-[#387440] underline">
            Back to Skills Lab
          </Link>
        </div>
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center gap-[12px] bg-[#f7f8f4] p-[24px] font-sans text-[#1c2a21]">
          <p className="m-0 text-[16px]">This lab flow is not available yet.</p>
          <Link to="/skills-lab" className="text-[14px] font-semibold text-[#387440] underline">
            Back to Skills Lab
          </Link>
        </div>
      )}
    </>
  );
};

export default LabPlayPage;
