import { useCallback, useEffect } from 'react';
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
  hasPersonalitySnapshot,
} from '../../components/sections/engagementV2/personality/personalityData.js';
import usePersonalityState from '../../components/sections/engagementV2/personality/personalityState.js';
import { fetchMyProfile, isLiveProfile } from '../../services/profileStages.api.js';
import { debug } from '../../utils/debug.js';

const log = debug('PersonalityPage');

/*
 * /profile/filling/personality — Personality stage (stage 3 of 9): intro (PE-01), quiz (PE-02/03), working (PE-04), result
 * (PE-05), choose your path (PA-00) and the optional stage overview. URL contract: see personalityState.js.
 * The Arcade (PA-01 …) is a separate page, ARCADE_ROUTE.
 * Wiring: Start the quiz -> quiz (question 7, the only drawn one) · Prefer games chip -> path chooser · Let's play (games) ->
 * arcade · Quick quiz + Let's play -> intro · Save and continue -> next stage (Skills) · Go back (overview) -> journey map.
 * Skip for now goes to the next stage (Skills); the Chat path opens Career Buddy.
 * Inert (nothing drawn): Exit quiz, Previous / Skip / Next question, Retake quiz.
 * After a finished quiz, navigating with router state { computing: true } to ?step=working auto-advances to the result.
 * Live (signed in): read-only. A talent whose profile already has a personalitySnapshot lands on the result when no ?step is
 * given (stage already done). Nothing here writes the profile: the result screen is still the drawn Figma result, so
 * Save and continue only moves on to the next stage.
 * Demo (signed out): every step is URL-driven as drawn.
 */
const PersonalityPage = () => {
  const state = usePersonalityState();
  const { step, q, answer, path, update } = state;
  const navigate = useNavigate();
  const location = useLocation();
  const hasStepParam = new URLSearchParams(location.search).has('step');

  useEffect(() => {
    log('step', { step, q, answer, path });
  }, [step, q, answer, path]);

  // Live: a talent who already has a personality result opens on it (unless a step was asked for).
  useEffect(() => {
    if (!isLiveProfile() || hasStepParam) return undefined;
    let cancelled = false;
    fetchMyProfile()
      .then((profile) => {
        if (cancelled || !hasPersonalitySnapshot(profile)) return;
        log('personality already saved -> result');
        update({ step: 'result' }, { replace: true });
      })
      .catch((err) => log.error('profile load failed (stay on this step):', err?.message));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once per landing; `update` changes with every URL change
  }, [hasStepParam]);

  const toResult = useCallback(() => update({ step: 'result', q: null, answer: null }), [update]);
  const nextStage = STAGE_BY_ID.skills.route;

  let body;
  if (step === 'quiz') {
    body = (
      <PersonalityQuiz
        q={q}
        answer={answer}
        onAnswer={(i) => update({ answer: i }, { replace: true })}
      />
    );
  } else if (step === 'working') {
    body = (
      <PersonalityWorking
        autoAdvanceMs={location.state?.computing ? 4000 : null}
        onDone={toResult}
      />
    );
  } else if (step === 'result') {
    body = (
      <PersonalityResult
        onRetake={() => log('retake quiz: no destination drawn')}
        onSave={() => {
          log('save and continue ->', nextStage);
          navigate(nextStage);
        }}
      />
    );
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
        onStart={() => update({ step: 'quiz', q: 7, answer: null })}
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
