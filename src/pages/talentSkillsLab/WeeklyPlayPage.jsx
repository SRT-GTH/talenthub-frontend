import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import '../../styles/talentA11y.css';
import { debug } from '../../utils/debug.js';
import { ensurePlayfulFont } from '../../utils/ensurePlayfulFont.js';
import UiStyleScope from '../../components/shared/UiStyleScope.jsx';
import LabPlayChrome from '../../components/sections/talentSkillsLab/LabPlayChrome.jsx';
import '../../components/sections/talentSkillsLab/labQuestionKinds.jsx';
import { getQuestionKind } from '../../components/sections/talentSkillsLab/labQuestionRegistry.js';
import { useLabText } from '../../components/sections/talentSkillsLab/labFormat.js';
import { useLabAttempt } from '../../components/sections/talentSkillsLab/useLabAttempt.js';
import {
  DialogHeader,
  DialogShell,
  PrimaryButton,
} from '../../components/sections/talentSkillsLab/SkillsLabDialogParts.jsx';
import { SkillsLabStopwatchGlyph } from '../../components/sections/talentSkillsLab/SkillsLabDialogIcons.jsx';
import { SKILLS_LAB_WEEKLY } from '../../components/sections/talentSkillsLab/skillsLabData.js';
import {
  WeeklyBoard,
  WeeklyOptIn,
} from '../../components/sections/talentSkillsLab/weekly/WeeklyBoard.jsx';
import {
  boardView,
  clockLabel,
} from '../../components/sections/talentSkillsLab/weekly/weeklyFormat.js';
import { useLiveStreak } from '../../components/sections/talentStreak/useLiveStreak.js';
import { useLiveXp } from '../../components/sections/talentXp/useLiveXp.js';
import {
  answerWeekly,
  finishWeekly,
  saveWeeklyOptIn,
  startWeekly,
} from '../../services/skillsLabWeekly.api.js';

const log = debug('WeeklyPlayPage');

/*
 * WeeklyPlayPage — `/skills-lab/weekly`: the weekly challenge run (5 questions, 2 minutes each) and its result.
 * Opened from the hub's SL-M4 dialog ("Start challenge"; `?optIn=1` carries the board opt-in into the first start).
 *
 * Reuses the lab flow pieces unchanged: LabPlayChrome (header, progress strip, footer), the question-kind registry
 * (labQuestionKinds.jsx + labKinds/*) and useLabAttempt with `flow.live` = the weekly API, so the server checks every
 * answer exactly as in a live lab. Differences from a lab: no hints, no per-question XP (+50 XP for finishing, from the
 * server), and a server-kept clock shown where a lab shows its pass mark. The server hands out one question at a time
 * (POST /weekly/start resumes and starts the next question's clock), so a question's 2 minutes start when it is shown.
 * When the clock runs out the current pick (or none) is sent; the server scores a late answer as a miss.
 */

const ensureMono = () => {
  if (typeof document === 'undefined' || document.querySelector('link[data-lab-mono]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap';
  link.setAttribute('data-lab-mono', '');
  document.head.appendChild(link);
};

// Slots for questions the server has not handed out yet (never drawn: the next one is fetched before moving on).
const pending = (i) => ({
  id: `pending-${i}`,
  kind: 'choice',
  topic: '',
  title: [],
  prompt: '',
  body: {},
  options: [],
});
const padQuestions = (questions, total) =>
  Array.from({ length: total }, (_, i) => questions?.[i] ?? pending(i));
const clockFrom = (data) => ({
  deadline: data?.current?.deadline ?? null,
  offset: data?.serverNow ? Date.parse(data.serverNow) - Date.now() : 0,
});

/* ---- result (after finishing, or when this week's attempt is already finished) ---- */
const WeeklyResultDialog = ({ result, error, onRetry, onClose }) => {
  const titleId = useId();
  const { t } = useLabText();
  const [board, setBoard] = useState(null);
  const [optIn, setOptIn] = useState(Boolean(result?.optedIn));
  const [optError, setOptError] = useState(null);
  const shown = board ?? result?.board;

  const changeOptIn = async (on) => {
    setOptIn(on);
    setOptError(null);
    try {
      const next = await saveWeeklyOptIn(on);
      setOptIn(Boolean(next?.optedIn));
      if (next?.board) setBoard(next.board);
    } catch (err) {
      log('opt-in failed', err?.response?.status || err?.message);
      setOptIn(!on);
      setOptError('Could not save that. Try again.');
    }
  };

  return (
    <DialogShell width={560} onClose={onClose} labelId={titleId}>
      <DialogHeader
        id={titleId}
        title={result?.title ?? 'Weekly challenge'}
        tileClass="bg-[#ffd86b]"
        icon={<SkillsLabStopwatchGlyph className="size-[21px]" />}
        onClose={onClose}
      />
      {result ? (
        <>
          <div className="flex flex-wrap items-baseline gap-x-[12px] gap-y-[4px]">
            <span className="font-sans text-[32px] font-bold leading-[38px] text-[#1c2a21] playful:font-heading">
              {result.correct}/{result.total}
            </span>
            <span className="font-sans text-[15px] font-medium leading-[18px] text-[#595959]">
              correct in {result.time ?? clockLabel(result.timeSec)}
            </span>
            {result.xpAwarded ? (
              <span className="ml-auto inline-flex items-center rounded-full bg-[#1c2a21] px-[12px] py-[6px] font-sans text-[13px] font-bold leading-[16px] text-white">
                {t('+{n} {xp}', { n: result.xp })}
              </span>
            ) : null}
          </div>
          <p className="m-0 font-sans text-[15px] leading-[22px] text-[#1c2a21]">
            Done for this week. A new challenge starts on Monday.
          </p>
          <WeeklyBoard board={boardView(shown)} />
          <p className="m-0 font-sans text-[12.5px] leading-[18px] text-[#595959]">
            {SKILLS_LAB_WEEKLY.privacy}
          </p>
          {result.canOptIn ? <WeeklyOptIn on={optIn} onChange={changeOptIn} /> : null}
          {optError ? (
            <p role="alert" className="m-0 font-sans text-[13px] leading-[18px] text-[#8a1c1c]">
              {optError}
            </p>
          ) : null}
          <PrimaryButton onClick={onClose}>Back to Skills Lab</PrimaryButton>
        </>
      ) : error ? (
        <>
          <p role="alert" className="m-0 font-sans text-[15px] leading-[22px] text-[#8a1c1c]">
            Could not save your result. Check your connection and try again.
          </p>
          <PrimaryButton onClick={onRetry}>Try again</PrimaryButton>
        </>
      ) : (
        <p role="status" className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
          Saving your result…
        </p>
      )}
    </DialogShell>
  );
};

/* ---- the run ---- */
const WeeklyRunScreen = ({ initial, xpTotal, streakDays, onHub }) => {
  const { t } = useLabText();
  const total = initial.total;
  const [questions, setQuestions] = useState(() => padQuestions(initial.questions, total));
  const [clock, setClock] = useState(() => clockFrom(initial));
  const [now, setNow] = useState(() => Date.now());
  const [result, setResult] = useState(null);
  const [finishError, setFinishError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const timedOut = useRef(new Set());

  const flow = useMemo(
    () => ({
      id: 'weekly',
      title: initial.title,
      headerTitle: `Weekly challenge · ${initial.title}`,
      subtitle: 'Ends Sunday 11:59 pm · 2 min per question',
      total,
      passMark: total,
      correctXp: 0, // no XP per answer: the weekly XP is for finishing
      hintCost: 0,
      questions,
      session: {
        index: initial.attempt.index,
        results: initial.attempt.results,
        xp: xpTotal,
        streakDays,
      },
      frames: {},
      live: {
        answer: ({ questionId, selected }) => answerWeekly({ questionId, answer: selected }),
        finish: () =>
          finishWeekly()
            .then((r) => {
              setResult(r);
              return r;
            })
            .catch((err) => {
              setFinishError(true);
              throw err;
            }),
        restart: async () => null,
      },
    }),
    [initial, total, questions, xpTotal, streakDays]
  );
  const attempt = useLabAttempt({ flow });

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const secondsLeft = clock.deadline
    ? Math.max(0, Math.ceil((Date.parse(clock.deadline) - (now + clock.offset)) / 1000))
    : null;
  const qid = attempt.question.id;

  // Time's up: send the current pick (or none). The server scores it (late = a miss) and reveals the answer.
  useEffect(() => {
    if (secondsLeft !== 0 || attempt.finished || attempt.answered || attempt.checking) return;
    if (timedOut.current.has(qid)) return;
    timedOut.current.add(qid);
    log('time up', qid);
    attempt.tryMove(attempt.selected ?? -1, { final: true });
  }, [secondsLeft, attempt, qid]);

  // Keys 1–4 pick an answer, Enter checks / continues (same as a lab).
  useEffect(() => {
    const onKey = (event) => {
      if (attempt.finished || busy || event.metaKey || event.ctrlKey || event.altKey) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(event.target?.tagName)) return;
      const n = Number(event.key);
      if (n >= 1 && n <= attempt.question.options.length && !attempt.answered)
        attempt.select(n - 1);
      else if (event.key === 'Enter' && event.target?.tagName !== 'BUTTON') {
        if (attempt.canCheck) attempt.check();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const goNext = async () => {
    if (attempt.isLast) {
      attempt.next();
      return;
    }
    setBusy(true);
    setLoadError(null);
    try {
      // Resume = the server hands out the next question and starts its clock.
      const data = await startWeekly();
      if (data?.status === 'finished') {
        setResult(data);
        attempt.next();
        return;
      }
      setQuestions(padQuestions(data.questions, data.total));
      setClock(clockFrom(data));
      attempt.next();
    } catch (err) {
      log('next failed', err?.response?.status || err?.message);
      setLoadError('Could not load the next question. Try again.');
    } finally {
      setBusy(false);
    }
  };

  const retryFinish = () => {
    setFinishError(false);
    flow.live.finish().catch(() => {});
  };

  const Question = getQuestionKind(attempt.question.kind);
  const view = {
    ...attempt,
    feedback:
      attempt.feedback?.tone === 'correct'
        ? { ...attempt.feedback, title: 'Nailed it' }
        : attempt.feedback,
  };
  const wasTimeUp = attempt.answered && timedOut.current.has(qid);

  let action;
  if (attempt.finished) action = { label: 'See results', disabled: true };
  else if (attempt.answered)
    action = {
      label: busy ? 'Loading…' : attempt.isLast ? 'See results' : 'Next question',
      onClick: goNext,
      disabled: busy,
    };
  else
    action = {
      label: attempt.checking ? 'Checking…' : 'Check answer',
      onClick: attempt.check,
      disabled: !attempt.canCheck,
    };

  const timerLabel =
    secondsLeft !== null && !attempt.answered && !attempt.finished
      ? `${clockLabel(secondsLeft)} left`
      : '2 min per question';

  return (
    <LabPlayChrome
      title={flow.headerTitle}
      subtitle={flow.subtitle}
      xp={`${Number(xpTotal || 0).toLocaleString('en-GB')} ${t('{xp}')}`}
      streak={streakDays ? `${streakDays}-day streak` : null}
      onExit={onHub}
      onSaveExit={onHub}
      progress={{
        countLabel: attempt.finished
          ? `All ${total} done`
          : `Question ${attempt.index + 1} of ${total}`,
        summary: attempt.summary,
        dots: attempt.dots,
        passMark: timerLabel,
      }}
      footer={{ hint: { mode: 'none' }, action }}
      overlay={
        attempt.finished ? (
          <WeeklyResultDialog
            result={result}
            error={finishError}
            onRetry={retryFinish}
            onClose={onHub}
          />
        ) : null
      }
    >
      {attempt.error || loadError ? (
        <p
          role="alert"
          className="m-0 mb-[12px] rounded-[12px] bg-[#fdecea] p-[12px] font-sans text-[14px] text-[#8a1c1c]"
        >
          {loadError || attempt.error}
        </p>
      ) : null}
      {wasTimeUp ? (
        <p
          role="status"
          className="m-0 rounded-[12px] bg-[#fbf4e0] p-[12px] font-sans text-[14px] font-semibold text-[#463409]"
        >
          Time&apos;s up. That one counts as a miss.
        </p>
      ) : null}
      {Question ? (
        <Question attempt={view} t={t} />
      ) : (
        <p className="m-0 font-sans text-[15px] text-[#595959]">
          No renderer registered for question kind “{attempt.question.kind}”.
        </p>
      )}
    </LabPlayChrome>
  );
};

const WeeklyPlayPage = () => {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [state, setState] = useState({ status: 'loading', data: null });
  const liveXp = useLiveXp({ enabled: true });
  const liveStreak = useLiveStreak({ enabled: true });
  const xpTotal = liveXp.data?.total ?? 0;
  const streakDays = liveStreak.data?.summary?.current || null;
  const optInParam = params.get('optIn') === '1';
  const toHub = () => navigate('/skills-lab');

  useEffect(() => {
    let alive = true;
    startWeekly(optInParam ? { optIn: true } : {})
      // Every question answered but the run never finished (left on the last result): finish it now.
      .then((data) =>
        data?.status !== 'finished' && data?.attempt?.index >= data?.total ? finishWeekly() : data
      )
      .then((data) => {
        if (!alive) return;
        log('start', { status: data?.status, index: data?.attempt?.index });
        setState({ status: data?.status === 'finished' ? 'finished' : 'run', data });
        if (optInParam) {
          const next = new URLSearchParams(params);
          next.delete('optIn');
          setParams(next, { replace: true });
        }
      })
      .catch((err) => {
        log('start failed', err?.response?.status || err?.message);
        if (alive)
          setState({ status: err?.response?.status === 404 ? 'missing' : 'error', data: null });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start (or resume) once per visit
  }, []);

  useEffect(() => {
    ensurePlayfulFont();
    ensureMono();
    // Same marker as /home so talentA11y.css (focus ring, reduced motion) covers the portaled dialogs.
    document.documentElement.setAttribute('data-talent-home', '');
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, []);

  let body;
  if (state.status === 'loading' || (state.status === 'run' && liveXp.status === 'loading')) {
    body = (
      <div
        role="status"
        className="flex min-h-screen items-center justify-center bg-[#f7f8f4] font-sans text-[15px] text-[#595959]"
      >
        Loading the weekly challenge…
      </div>
    );
  } else if (state.status === 'run') {
    body = (
      <WeeklyRunScreen
        initial={state.data}
        xpTotal={xpTotal}
        streakDays={streakDays}
        onHub={toHub}
      />
    );
  } else if (state.status === 'finished') {
    body = (
      <LabPlayChrome
        title={`Weekly challenge · ${state.data.title}`}
        subtitle="Ends Sunday 11:59 pm · 2 min per question"
        onExit={toHub}
        onSaveExit={toHub}
        overlay={<WeeklyResultDialog result={state.data} onClose={toHub} />}
      >
        <p className="m-0 font-sans text-[15px] text-[#595959]">
          You have played this week&apos;s challenge.
        </p>
      </LabPlayChrome>
    );
  } else {
    body = (
      <div className="flex min-h-screen flex-col items-center justify-center gap-[12px] bg-[#f7f8f4] p-[24px] font-sans text-[#1c2a21]">
        <p className="m-0 text-[16px]">
          {state.status === 'missing'
            ? 'There is no weekly challenge this week.'
            : 'Could not load the weekly challenge. Check your connection and try again.'}
        </p>
        <Link to="/skills-lab" className="text-[14px] font-semibold text-[#387440] underline">
          Back to Skills Lab
        </Link>
      </div>
    );
  }

  return (
    <>
      <UiStyleScope enabled />
      {body}
    </>
  );
};

export default WeeklyPlayPage;
