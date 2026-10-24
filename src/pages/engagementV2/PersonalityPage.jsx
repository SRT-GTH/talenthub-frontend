import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import {
  STAGE_BY_ID,
  JOURNEY_MAP_ROUTE,
  nextStageRoute,
} from '../../components/sections/engagementShell/engagementShellData.js';
import PersonalityIntro from '../../components/sections/engagementV2/personality/PersonalityIntro.jsx';
import PersonalityOverview from '../../components/sections/engagementV2/personality/PersonalityOverview.jsx';
import PersonalityPath from '../../components/sections/engagementV2/personality/PersonalityPath.jsx';
import PersonalityQuiz from '../../components/sections/engagementV2/personality/PersonalityQuiz.jsx';
import PersonalityResult from '../../components/sections/engagementV2/personality/PersonalityResult.jsx';
import PersonalityWorking from '../../components/sections/engagementV2/personality/PersonalityWorking.jsx';
import {
  ARCADE_ROUTE,
  BEFORE_YOU_START,
  GETS,
} from '../../components/sections/engagementV2/personality/personalityData.js';
import {
  BIG_FIVE_TRAITS,
  LIKERT_LABELS,
  archetypeFromBigFive,
  bankQuestions,
  buildBigFiveResultView,
  latestBigFiveResult,
  toBigFiveResponses,
} from '../../components/sections/engagementV2/personality/personalityBigFive.js';
import usePersonalityState from '../../components/sections/engagementV2/personality/personalityState.js';
import { fetchMyProfile, isLiveProfile } from '../../services/profileStages.api.js';
import {
  fetchAssessmentTemplates,
  fetchMyAssessmentResults,
  scoreAssessment,
} from '../../services/assessment.api.js';
import { refreshJourney } from '../../services/journey.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('PersonalityPage');

/*
 * /profile/filling/personality — Personality stage (stage 3 of 9): intro (PE-01), quiz (PE-02/03), working (PE-04), result
 * (PE-05), choose your path (PA-00) and the optional stage overview. URL contract: see personalityState.js.
 * The Arcade (PA-01 …) is a separate page, ARCADE_ROUTE. Prefer games chip -> path chooser · Let's play (games) -> arcade ·
 * Quick quiz + Let's play -> intro · Chat path -> Career Buddy · Skip for now -> next stage (Skills) · Go back (overview) ->
 * journey map.
 *
 * Live (signed in) — a real test on the backend Big Five bank (personalityBigFive.js):
 *   - the bank is GET /engagement/assessments/templates (big_five, Mini-IPIP, 1–5 agree scale); Start the quiz opens
 *     question 1; Next / Previous / Skip move through it (?q=n), Exit returns to the intro. Answers ({ itemKey: 1..5 })
 *     live in state and sessionStorage (answersKey(), per session) so a refresh keeps them.
 *   - after the last question: every statement must be answered, then ?step=working while scoreAssessment()
 *     (POST /engagement/start + /engagement/assessments/score) runs. Only a successful score opens the result; a failure
 *     keeps the answers and shows a role="status" card with Retry. On success the server has written
 *     profile.personalitySnapshot, so refreshJourney() turns the stage done.
 *   - the result shows archetypeFromBigFive(scores) and the five real trait scores. A talent who already has a big_five
 *     result (GET /engagement/assessments/results/me) lands on it when no ?step is given. Retake quiz clears the answers
 *     and restarts at question 1; Save and continue only navigates to Skills (the save happened at scoring).
 * Demo (signed out): every step is URL-driven as drawn (question 7 only; Next / Previous / Skip / Exit / Retake inert);
 * after a finished quiz, router state { computing: true } on ?step=working auto-advances to the drawn result.
 */
// Keyed by the signed-in session's token tail so a second account in the same tab never inherits these answers.
const answersKey = () => {
  try {
    return `th:personality-v2-answers:${(localStorage.getItem('th:auth-token') || '').slice(-16)}`;
  } catch {
    return 'th:personality-v2-answers';
  }
};
const readAnswers = () => {
  try {
    const v = JSON.parse(sessionStorage.getItem(answersKey()) || '{}');
    return v && typeof v === 'object' ? v : {};
  } catch {
    return {};
  }
};
const writeAnswers = (answers) => {
  try {
    if (answers && Object.keys(answers).length)
      sessionStorage.setItem(answersKey(), JSON.stringify(answers));
    else sessionStorage.removeItem(answersKey());
  } catch {
    /* storage unavailable: answers stay in memory only */
  }
};

const TRAIT_BY_DIM = Object.fromEntries(BIG_FIVE_TRAITS.map((t) => [t.dim, t]));
const LIKERT_OPTIONS = LIKERT_LABELS.map((text, i) => ({ letter: String(i + 1), text }));

const personFromProfile = (p) => {
  if (!p) return {};
  const first = p.firstName || '';
  const last = p.lastName || '';
  const loc = typeof p.location === 'string' ? p.location : p.location?.city || '';
  return {
    name: [first, last ? `${last[0]}.` : ''].filter(Boolean).join(' '),
    initials: `${first[0] || ''}${last[0] || ''}`.toUpperCase(),
    photo: p.profilePhoto || p.avatar?.url || null,
    place: loc,
  };
};

const PersonalityPage = () => {
  const state = usePersonalityState();
  const { step, q, liveQ, answer, path, update } = state;
  const navigate = useNavigate();
  const location = useLocation();
  const live = isLiveProfile();
  const hasStepParam = new URLSearchParams(location.search).has('step');

  // Live state: the bank, the talent's answers, their latest result, the scoring call.
  const [bank, setBank] = useState({ status: 'idle', questions: [], minutes: null });
  const [answers, setAnswers] = useState(() => (live ? readAnswers() : {}));
  const [result, setResult] = useState({ status: live ? 'loading' : 'idle', data: null });
  const [scoring, setScoring] = useState({ status: 'idle', error: null });
  const [notice, setNotice] = useState(null);
  const [person, setPerson] = useState({});
  const landedRef = useRef(hasStepParam);

  useEffect(() => {
    log('step', { step, q, liveQ, answer, path, live });
  }, [step, q, liveQ, answer, path, live]);

  const loadBank = useCallback(async () => {
    setBank((b) => ({ ...b, status: 'loading' }));
    try {
      const templates = await fetchAssessmentTemplates();
      const t = templates.find((x) => x.assessmentType === 'big_five');
      const questions = bankQuestions(t);
      if (!questions.length) throw new Error('No big_five questions in the template bank');
      log('bank ready', { n: questions.length });
      setBank({ status: 'ready', questions, minutes: Number(t.estimatedMinutes) || null });
    } catch (err) {
      log.error('bank load failed:', err?.response?.status || err?.message);
      setBank((b) => ({ ...b, status: 'error' }));
    }
  }, []);

  // Live: load the bank, the latest result and the card's person once.
  useEffect(() => {
    if (!live) return undefined;
    let cancelled = false;
    loadBank();
    fetchMyAssessmentResults()
      .then(({ rows }) => {
        if (cancelled) return;
        const latest = latestBigFiveResult(rows);
        log('results', { hasBigFive: Boolean(latest) });
        setResult((r) =>
          r.status === 'ready' ? r : { status: latest ? 'ready' : 'none', data: latest }
        );
      })
      .catch((err) => {
        log.error('results load failed:', err?.response?.status || err?.message);
        if (!cancelled)
          setResult((r) => (r.status === 'ready' ? r : { status: 'none', data: null }));
      });
    fetchMyProfile()
      .then((p) => !cancelled && setPerson(personFromProfile(p)))
      .catch((err) => log.error('profile load failed (card shows "You"):', err?.message));
    return () => {
      cancelled = true;
    };
  }, [live, loadBank]);

  // Live landing: an existing result opens on the result screen (only when no ?step was asked for).
  useEffect(() => {
    if (!live || landedRef.current || result.status === 'loading') return;
    landedRef.current = true;
    if (result.status === 'ready' && !hasStepParam) {
      log('big_five result already saved -> result');
      update({ step: 'result' }, { replace: true });
    }
  }, [live, result.status, hasStepParam, update]);

  // Live guards: no result to show / no scoring in flight -> back to a screen that has data.
  useEffect(() => {
    if (!live) return;
    if (step === 'result' && result.status === 'none') {
      log('no big_five result yet -> intro');
      update({ step: 'intro' }, { replace: true });
    } else if (step === 'working' && scoring.status === 'idle') {
      log('nothing being scored -> quiz');
      update({ step: 'quiz', q: null }, { replace: true });
    }
  }, [live, step, result.status, scoring.status, update]);

  const setAnswer = useCallback((key, value) => {
    setAnswers((prev) => {
      const next = { ...prev, [key]: value };
      writeAnswers(next);
      return next;
    });
  }, []);

  const total = bank.questions.length;
  const index = Math.min(liveQ, Math.max(total, 1)) - 1;
  const current = bank.questions[index] || null;

  const score = useCallback(async () => {
    const rawResponses = toBigFiveResponses(bank.questions, answers);
    setScoring({ status: 'scoring', error: null });
    try {
      const data = await scoreAssessment({ assessmentType: 'big_five', rawResponses });
      if (!data || data.success === false || !data.scores || !archetypeFromBigFive(data.scores)) {
        throw new Error(data?.message || 'The score response had no usable Big Five scores');
      }
      log('scored', { resultId: data.resultId, xp: data.xpAwarded });
      setResult({
        status: 'ready',
        data: {
          scores: data.scores,
          interpretation: data.interpretation || {},
          at: new Date().toISOString(),
        },
      });
      setAnswers({});
      writeAnswers({});
      setScoring({ status: 'done', error: null });
      refreshJourney().catch((err) => log.error('journey refresh failed:', err?.message));
      update({ step: 'result', q: null }, { replace: true });
    } catch (err) {
      log.error('score failed:', err?.response?.status || err?.message);
      setScoring({
        status: 'error',
        error:
          'Your answers are safe on this device. Check your connection and try again in a moment.',
      });
    }
  }, [bank.questions, answers, update]);

  const submit = useCallback(() => {
    const missing = bank.questions.findIndex((x) => !answers[x.key]);
    if (missing >= 0) {
      const left = bank.questions.filter((x) => !answers[x.key]).length;
      log('submit blocked: unanswered', { first: missing + 1, left });
      setNotice(
        `Answer every statement to see your result: ${left} left. This is question ${missing + 1}.`
      );
      update({ step: 'quiz', q: missing + 1 });
      return;
    }
    setNotice(null);
    update({ step: 'working', q: null });
    score();
  }, [bank.questions, answers, update, score]);

  const goTo = (n) => {
    setNotice(null);
    update({ step: 'quiz', q: n });
  };
  const restartQuiz = () => {
    setAnswers({});
    writeAnswers({});
    setNotice(null);
    setScoring({ status: 'idle', error: null });
    update({ step: 'quiz', q: 1, answer: null });
  };

  const liveQuizView = useMemo(() => {
    if (!live || !current) return null;
    const trait = TRAIT_BY_DIM[current.dim];
    const answeredIdx = bank.questions.map((x) => Boolean(answers[x.key]));
    const answeredCount = answeredIdx.filter(Boolean).length;
    return {
      question: {
        n: index + 1,
        kicker: `QUESTION ${index + 1}${trait ? ` · ${trait.title.toUpperCase()}` : ''}`,
        titleLead: current.text,
        titleAccent: '',
        context:
          'How much does this sound like you? Answer for how you are, not how you’d like to be.',
        options: LIKERT_OPTIONS,
      },
      total,
      answeredIdx,
      answeredCount,
      subtitle: `${total} statements · No right answers`,
      savedLabel: 'Saved on this device after every answer',
      traitsSoFar: BIG_FIVE_TRAITS.map((t) => {
        const qs = bank.questions.filter((x) => x.dim === t.dim);
        const done = qs.filter((x) => answers[x.key]).length;
        return {
          id: t.id,
          label: t.title,
          status: qs.length ? `${done} of ${qs.length} answered` : '',
          fill: qs.length ? done / qs.length : 0,
        };
      }),
      traitsNote: 'Bars fill as you answer. Your scores appear after you submit.',
      nextLabel: index + 1 >= total ? 'Submit answers' : 'Next question',
      notice,
    };
  }, [live, current, bank.questions, answers, index, total, notice]);

  const liveIntroCopy = useMemo(() => {
    if (!live) return null;
    const n = total || 20;
    return {
      lede: `${n} short statements. Say how much each one sounds like you. There are no right answers. You get one of 9 archetypes and five trait scores that recruiters see on your card.`,
      chips: [`About ${bank.minutes || 5} min`, `${n} statements`, 'Retake any time'],
      gets: GETS.filter((g) => g.id !== 'note').map((g) =>
        g.id === 'scores'
          ? {
              ...g,
              title: 'Five trait scores',
              body: 'The Big Five, worked out from your answers.',
            }
          : g
      ),
      traitsKicker: 'THE FIVE TRAITS WE MEASURE',
      traits: BIG_FIVE_TRAITS,
      before: BEFORE_YOU_START.filter((b) => b.id !== 'ghana').map((b) =>
        b.id === 'right'
          ? {
              ...b,
              body: 'Each statement is about how you tend to work. Pick what is true for you.',
            }
          : b
      ),
    };
  }, [live, total, bank.minutes]);

  const toResult = useCallback(() => update({ step: 'result', q: null, answer: null }), [update]);
  const nextStage = STAGE_BY_ID.skills.route;

  const liveStatus = (message, onRetry) => (
    <div className="flex flex-1 items-start justify-center px-4 py-16">
      <p role="status" className="m-0 font-sans text-[15px] leading-[22px] text-[#595959]">
        {message}{' '}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[#387440] underline"
          >
            Retry
          </button>
        ) : null}
      </p>
    </div>
  );

  let body;
  if (step === 'quiz') {
    if (!live) {
      body = (
        <PersonalityQuiz
          q={q}
          answer={answer}
          onAnswer={(i) => update({ answer: i }, { replace: true })}
        />
      );
    } else if (bank.status === 'error') {
      body = liveStatus('We couldn’t load the quiz questions.', loadBank);
    } else if (!liveQuizView) {
      body = liveStatus('Loading the quiz…');
    } else {
      const picked = answers[current.key];
      const isLast = index + 1 >= total;
      body = (
        <PersonalityQuiz
          live={liveQuizView}
          answer={picked ? picked - 1 : null}
          onAnswer={(i) => setAnswer(current.key, i + 1)}
          onNext={() => (isLast ? submit() : goTo(index + 2))}
          onSkip={() => (isLast ? submit() : goTo(index + 2))}
          onPrev={() => (index > 0 ? goTo(index) : update({ step: 'intro', q: null }))}
          onExit={() => {
            setNotice(null);
            update({ step: 'intro', q: null });
          }}
        />
      );
    }
  } else if (step === 'working') {
    body = live ? (
      <PersonalityWorking
        total={total}
        subtitle={`${total} statements · No right answers · Done`}
        steps={[
          `Scoring your ${total} answers`,
          'Saving your result to your profile',
          'Matching you to 1 of 9 archetypes',
        ]}
        error={scoring.status === 'error' ? scoring.error : null}
        onRetry={score}
        onBack={() => {
          setScoring({ status: 'idle', error: null });
          update({ step: 'quiz', q: total || null });
        }}
      />
    ) : (
      <PersonalityWorking
        autoAdvanceMs={location.state?.computing ? 4000 : null}
        onDone={toResult}
      />
    );
  } else if (step === 'result') {
    if (live && result.status !== 'ready') {
      body = liveStatus('Loading your result…');
    } else {
      body = (
        <PersonalityResult
          view={live ? buildBigFiveResultView(result.data, person) : null}
          showNote={!live}
          onRetake={live ? restartQuiz : () => log('retake quiz (demo: no destination)')}
          onSave={() => {
            log('save and continue ->', nextStage);
            navigate(nextStage);
          }}
        />
      );
    }
  } else if (step === 'path') {
    body = (
      <PersonalityPath
        path={path}
        onSelect={(id) => update({ path: id }, { replace: true })}
        onStart={() => {
          if (path === 'games') navigate(ARCADE_ROUTE);
          else if (path === 'quiz') update({ step: 'intro', path: null });
          else navigate('/profile/filling/career-buddy');
        }}
        onSkip={() => navigate(nextStageRoute('personality'))}
      />
    );
  } else if (step === 'overview') {
    body = (
      <PersonalityOverview
        onBack={() => navigate(JOURNEY_MAP_ROUTE)}
        onOpen={() => update({ step: 'intro' })}
      />
    );
  } else {
    body = (
      <PersonalityIntro
        copy={liveIntroCopy}
        onStart={() => {
          setNotice(null);
          update(
            live ? { step: 'quiz', q: 1, answer: null } : { step: 'quiz', q: 7, answer: null }
          );
        }}
        onArcade={() => update({ step: 'path' })}
        onSkip={() => navigate(nextStageRoute('personality'))}
      />
    );
  }

  const isResult = step === 'result';
  return (
    <EngagementStageFrame
      stageId="personality"
      doneIds={isResult ? ['avatar', 'interests'] : []}
      showStageBar={isResult}
      footer={false}
    >
      {body}
    </EngagementStageFrame>
  );
};

export default PersonalityPage;
