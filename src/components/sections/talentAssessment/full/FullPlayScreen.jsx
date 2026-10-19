import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { debug } from '../../../../utils/debug.js';
import HelpPopover from '../../notifications/HelpPopover.jsx';
import { LabFlagIcon } from '../../talentSkillsLab/LabPlayIcons.jsx';
import { LabFooterBar, LabHeaderBar, LabTopBar } from '../../talentSkillsLab/LabPlayChrome.jsx';
import { fillTokens, useLabText } from '../../talentSkillsLab/labFormat.js';
import { DOODLE_STAR_PATH } from '../../talentSkillsLab/labPlayStyles.js';
import { FULL_TOPIC_LABELS } from '../assessmentData.js';
import { LeaveDialog, ResumeDialog, SubmitDialog, TimeUpDialog } from './FullDialogs.jsx';
import FullQuestion from './FullQuestion.jsx';
import FullResultDialog from './FullResultDialog.jsx';
import { buildResultView, fmtClock, useFullAssessment } from './fullFlow.js';

const log = debug('FullPlayScreen');

/*
 * FullPlayScreen — the focused full-assessment run (Figma MA-05 Question 12 · MA-06 passed · MA-10 not passed · MA-11
 * connection lost · MA-12 time is up · MA-13 leave). Same chrome family as the Skills Lab lab play pages (LabTopBar +
 * LabHeaderBar + LabFooterBar from talentSkillsLab/LabPlayChrome.jsx) with a progress BAR instead of challenge dots:
 *
 *   LabTopBar        logo · Style switch · Save & Exit · Help · avatar
 *   LabHeaderBar     "Assessment · TypeScript", subtitle, Playful sticker (TIMED · 18:20 LEFT / COMPLETE / NOT YET), XP, streak
 *   ProgressStrip    "Question 12 of 25" + "11 answered · 18:20 left" · 420 x 8 bar · "Pass mark: 70 / 100"
 *   FullQuestion     eyebrow, title, prompt, code, A-D answers
 *   LabFooterBar     hint link (−5 XP) · "Next question"
 *   overlay          FullResultDialog | ResumeDialog | TimeUpDialog | LeaveDialog
 *
 * Props: flow (FULL_ASSESSMENT_*), frame (the `?f=` code or null), resume (restore a saved run when there is no frame).
 * URL: `?help=1` opens the Help pop-over. The leave / resume / time-up dialogs are state (frames seed them).
 */
const ProgressStrip = ({ countLabel, summary, pct, passMark }) => (
  <section
    aria-label="Progress"
    className="relative flex flex-wrap items-center justify-between gap-x-[16px] gap-y-[10px] border-b border-solid border-[#e7e7e7] bg-white px-[clamp(16px,3.7vw,64px)] py-[clamp(10px,0.9vw,16px)] lg:min-h-[72px]"
  >
    <div className="flex min-w-0 flex-col gap-[2px]">
      <p className="m-0 font-sans text-[15px] leading-[18px] font-semibold text-[#1c2a21]">
        {countLabel}
      </p>
      <p className="m-0 font-sans text-[12px] leading-[14px] font-medium text-[#595959]">
        {summary}
      </p>
    </div>
    <div
      role="progressbar"
      aria-label={countLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(pct)}
      className="h-[8px] w-full max-w-[420px] overflow-hidden rounded-full bg-[#ebebe3] max-md:order-last max-md:max-w-none md:absolute md:top-1/2 md:left-1/2 md:w-[min(420px,30vw)] md:-translate-x-1/2 md:-translate-y-1/2"
    >
      <div className="h-full rounded-full bg-[#387440]" style={{ width: `${pct}%` }} />
    </div>
    {passMark ? (
      <span className="inline-flex items-center gap-[5px] rounded-full bg-[#ebf1ec] py-[5px] pr-[10px] pl-[8px] font-sans text-[12px] leading-[14px] font-semibold text-[#387440] playful:border playful:border-solid playful:border-[rgba(28,42,33,0.35)]">
        <LabFlagIcon className="size-[14px]" />
        {passMark}
      </span>
    ) : (
      <span />
    )}
  </section>
);

const FullPlayScreen = ({ flow, frame, resume = false }) => {
  const run = useFullAssessment({ flow, frame, resume });
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { t, xpWord } = useLabText();
  const { state, question, finished } = run;
  const { copy } = flow;
  const dialog = state.dialog;
  const left = fmtClock(state.secondsLeft);
  const exitPath = '/my-assessment';

  // Keys: 1-4 / A-D pick an answer, Enter = next, ArrowLeft = previous question. ⚠️ ASSUMPTION (not drawn).
  useEffect(() => {
    const onKey = (event) => {
      if (dialog || finished || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      const key = event.key.toLowerCase();
      const pick = '12345'.indexOf(key) >= 0 ? '12345'.indexOf(key) : 'abcde'.indexOf(key);
      if (key.length === 1 && pick >= 0 && pick < question.options.length) {
        if (pick !== run.hintRemoved) run.select(pick);
      } else if (event.key === 'Enter' && event.target?.tagName !== 'BUTTON') {
        if (run.selected !== null) run.next();
      } else if (event.key === 'ArrowLeft') {
        run.prev();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  useEffect(() => {
    log('mount', { frame, index: state.index, phase: state.phase, dialog });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame]);

  const result = run.result;
  const pct = finished ? 100 : ((state.index + 1) / flow.total) * 100;
  const eyebrow = fillTokens(copy.eyebrow, {
    n: question.n,
    topic: (question.topicLabel ?? FULL_TOPIC_LABELS[question.topic] ?? '').toUpperCase(),
  });

  const hint =
    flow.hintCost == null
      ? { mode: 'none' } // live runs: no answer keys in the browser, so no hint
      : run.hintUsedHere
        ? {
            mode: 'used',
            usedLabel: copy.hintUsed,
            cost: t('−{cost} {xp}', { cost: flow.hintCost }),
          }
        : {
            mode: 'link',
            prompt: copy.hintPrompt,
            linkLabel: t(copy.hintLink, { cost: flow.hintCost }),
            onClick: run.hint,
            disabled: finished,
          };
  const action = finished
    ? { label: copy.checkDisabled, disabled: true }
    : {
        label: run.isLast ? copy.submit : copy.next,
        onClick: run.next,
        disabled: run.selected === null,
      };

  let overlay = null;
  if (finished && result && flow.live && !result.view) {
    overlay = (
      <SubmitDialog
        error={result.error}
        onRetry={run.retryScore}
        onExit={() => navigate(exitPath)}
      />
    );
  } else if (finished && result && flow.live) {
    overlay = (
      <FullResultDialog
        result={result.view}
        onClose={() => navigate(exitPath)}
        onSecondary={() => navigate(exitPath)}
        onPrimary={() => navigate(flow.resultsTo || exitPath)}
        onRefresher={() => navigate('/learning')}
      />
    );
  } else if (finished && result) {
    overlay = (
      <FullResultDialog
        result={buildResultView(flow, result)}
        onClose={() => navigate(exitPath)}
        onSecondary={() => navigate(exitPath)}
        onPrimary={() => navigate(result.outcome === 'pass' ? '/profile' : '/skills-lab')}
        onRefresher={() => navigate('/learning')}
      />
    );
  } else if (dialog === 'resume') {
    overlay = (
      <ResumeDialog
        copy={flow.resume}
        answered={run.answeredReal}
        left={left}
        windowLeft={state.resumeLeft}
        index={state.index}
        onSaveExit={() => navigate(exitPath)}
        onResume={run.resumeRun}
      />
    );
  } else if (dialog === 'timeup') {
    overlay = (
      <TimeUpDialog
        copy={flow.timeUp}
        answered={state.answeredOverride ?? run.answeredReal + (run.selected !== null ? 1 : 0)}
        pct={state.scoringPct}
        onResult={run.finish}
      />
    );
  } else if (dialog === 'leave') {
    overlay = (
      <LeaveDialog copy={flow.leave} onLeave={() => navigate(exitPath)} onKeep={run.closeDialog} />
    );
  }

  const helpHome = {
    helpOpen: params.get('help') === '1',
    helpPage: 'assessment',
    update: (patch) => {
      const next = new URLSearchParams(params);
      Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, String(v)) : next.delete(k)));
      setParams(next, { replace: true });
    },
  };

  const sticker = finished
    ? result?.outcome === 'pass'
      ? copy.stickerPass
      : copy.stickerFail
    : fillTokens(copy.timedSticker, { left });
  const subtitle = finished
    ? fillTokens(copy.doneSubtitle, { min: result?.elapsedMin })
    : flow.subtitle;
  const countLabel = finished
    ? fillTokens(copy.doneLabel, { total: flow.total })
    : fillTokens(copy.countLabel, { n: state.index + 1, total: flow.total });
  const summary = finished
    ? flow.live
      ? copy.doneSummary
      : fillTokens(copy.doneSummary, {
          correct: result?.correct,
          review: flow.total - result?.correct,
        })
    : fillTokens(copy.summary, { answered: run.answered, left });

  return (
    <>
      <div className="flex min-h-screen min-h-dvh flex-col bg-[#f7f8f4] playful:bg-[linear-gradient(180deg,#fbf6ea_0%,#f4f6ec_100%)]">
        <LabTopBar
          onSaveExit={() => navigate(exitPath)}
          onHelp={() => {
            const next = new URLSearchParams(params);
            next.set('help', '1');
            setParams(next, { replace: true });
          }}
        />
        <LabHeaderBar
          title={flow.headerTitle}
          subtitle={subtitle}
          sticker={sticker}
          xp={run.xp == null ? null : `${run.xp} ${xpWord}`}
          streak={flow.streakDays ? `${flow.streakDays}-day streak` : null}
          onExit={() => run.openDialog('leave')}
        />
        <ProgressStrip
          countLabel={countLabel}
          summary={summary}
          pct={pct}
          passMark={copy.passMark}
        />
        <main className="flex-1 px-[clamp(16px,3.7vw,64px)] pt-[clamp(20px,2.3vw,40px)] pb-[clamp(24px,3.3vw,56px)]">
          <div className="relative mx-auto flex w-full max-w-[1040px] flex-col gap-[20px]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 hidden xl:block"
            >
              <span className="hidden playful:block">
                <svg
                  viewBox="0 0 22 22"
                  className="absolute top-[30px] left-[-46px] size-[22px] text-[#ffd86b]"
                >
                  <path d={DOODLE_STAR_PATH} fill="currentColor" />
                </svg>
                <svg
                  viewBox="0 0 22 22"
                  className="absolute top-[62px] left-[-24px] size-[12px] text-[#84cc16]"
                >
                  <path d={DOODLE_STAR_PATH} fill="currentColor" />
                </svg>
              </span>
            </span>
            <FullQuestion
              question={question}
              eyebrow={eyebrow}
              selected={run.selected}
              removed={run.hintRemoved}
              locked={finished}
              onSelect={run.select}
            />
          </div>
        </main>
        <LabFooterBar hint={hint} action={action} />
        {overlay}
      </div>
      <HelpPopover home={helpHome} />
    </>
  );
};

export default FullPlayScreen;
