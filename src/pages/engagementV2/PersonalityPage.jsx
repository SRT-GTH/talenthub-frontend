import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import {
  STAGE_BY_ID,
  JOURNEY_MAP_ROUTE,
} from '../../components/sections/engagementShell/engagementShellData.js';
import PersonalityIntro from '../../components/sections/engagementV2/personality/PersonalityIntro.jsx';
import PersonalityOverview from '../../components/sections/engagementV2/personality/PersonalityOverview.jsx';
import PersonalityPath from '../../components/sections/engagementV2/personality/PersonalityPath.jsx';
import PersonalityQuiz from '../../components/sections/engagementV2/personality/PersonalityQuiz.jsx';
import PersonalityResult from '../../components/sections/engagementV2/personality/PersonalityResult.jsx';
import PersonalityWorking from '../../components/sections/engagementV2/personality/PersonalityWorking.jsx';
import { ARCADE_ROUTE } from '../../components/sections/engagementV2/personality/personalityData.js';
import usePersonalityState from '../../components/sections/engagementV2/personality/personalityState.js';
import { debug } from '../../utils/debug.js';

const log = debug('PersonalityPage');

/*
 * /profile/filling/personality — Personality stage (stage 3 of 9): intro (PE-01), quiz (PE-02/03), working (PE-04), result
 * (PE-05), choose your path (PA-00) and the optional stage overview. URL contract: see personalityState.js.
 * The Arcade (PA-01 …) is a separate page, ARCADE_ROUTE.
 * Wiring: Start the quiz -> quiz (question 7, the only drawn one) · Prefer games chip -> path chooser · Let's play (games) ->
 * arcade · Quick quiz + Let's play -> intro · Save and continue -> next stage (Skills) · Go back (overview) -> journey map.
 * Inert (nothing drawn): Skip for now, Exit quiz, Previous / Skip / Next question, Retake quiz, Chat path.
 * After a finished quiz, navigating with router state { computing: true } to ?step=working auto-advances to the result.
 */
const PersonalityPage = () => {
  const state = usePersonalityState();
  const { step, q, answer, path, update } = state;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    log('step', { step, q, answer, path });
  }, [step, q, answer, path]);

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
          else log('chat path: no destination drawn');
        }}
        onSkip={() => log('skip for now: no destination drawn')}
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
        onSkip={() => log('skip for now: no destination drawn')}
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
