import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/talentA11y.css';
import { classNames } from '../../../utils/classNames.js';
import { debug } from '../../../utils/debug.js';
import { ensurePlayfulFont } from '../../../utils/ensurePlayfulFont.js';
import UiStyleScope from '../../shared/UiStyleScope.jsx';
import StyleSwitch from '../../ui/StyleSwitch.jsx';
import EngagementTopNav from '../engagement/EngagementTopNav.jsx';
import EngagementStageBar from './EngagementStageBar.jsx';
import EngagementStageFooter from './EngagementStageFooter.jsx';
import ModePickerModal from '../engagementV2/journey/ModePickerModal.jsx';
import {
  ENGAGEMENT_STAGES,
  JHS_HIDDEN_STAGES,
  JOURNEY_MAP_ROUTE,
  STAGE_BY_ID,
  buildStageSegments,
  stagesFor,
} from './engagementShellData.js';
import { useLiveJourney } from './useLiveJourney.js';

const log = debug('EngagementStageFrame');

/*
 * EngagementStageFrame — the page every refreshed Engagement screen sits in (Figma canvas 3125:10352; each screen exists in
 * Focused (default) and Playful, switched with the nav's style switch):
 *
 *   nav (90px: logo · style switch · gold "Change input mode" · Save & Exit · help · profile chip)
 *   stage bar (64px: ← Journey map · STAGE n OF 9 + name · progress)        <- when `stageId` is set
 *   children                                                                  <- hero + body, built by the screen
 *   footer (88px, sticky: Skip for now · ✓ Auto-saved · Continue →)           <- unless `footer={false}`
 *
 * Props:
 *   stageId       'interests' | 'work' | … (see engagementShellData.js) — draws the stage bar for that stage
 *   doneIds       ids of finished stages (stage bar segments + "n of 9 done"); the signed-in talent's live journey
 *                 (GET /profiles/journey) replaces them once loaded, so these are the demo values
 *   footer        false to hide, or props for EngagementStageFooter ({ onContinue, onSkip, continueLabel, disabled, left })
 *   showStageBar  default true when stageId is set
 *   onChangeInputMode  handler for the gold nav button; when omitted the button opens the mode picker (J-03) itself:
 *                      Fill it in myself stays on this screen, Chat → Career Buddy, Upload my CV → /profile/filling/cv
 *   showChangeInputMode  false hides that button (the journey map and the Upload my CV frames do not draw it)
 *   children      the screen body
 * The frame mounts <UiStyleScope> (Playful variants only apply inside it), loads the Playful heading font and puts the
 * `data-talent-home` marker on <html> (focus rings + reduced motion, same as the talent pages).
 * Debug scope: EngagementStageFrame.
 */
const EngagementStageFrame = ({
  stageId = null,
  doneIds = [],
  footer = {},
  showStageBar = true,
  onChangeInputMode,
  showChangeInputMode = true,
  className,
  children,
}) => {
  const navigate = useNavigate();
  const [pickerOpen, setPickerOpen] = useState(false);
  const stage = stageId ? STAGE_BY_ID[stageId] : null;

  const pickMode = (id) => {
    log('mode picked', { id, stageId });
    setPickerOpen(false);
    if (id === 'chat') navigate('/profile/filling/career-buddy');
    else if (id === 'cv') navigate('/profile/filling/cv');
  };

  useEffect(() => {
    ensurePlayfulFont();
    document.documentElement.setAttribute('data-talent-home', '');
    log('mount', { stageId });
    return () => document.documentElement.removeAttribute('data-talent-home');
  }, [stageId]);

  const live = useLiveJourney();
  const jhs = Boolean(live?.jhs);
  const hidden = jhs && JHS_HIDDEN_STAGES.has(stageId);
  // JHS talents have no Work or Pitch stage: a bookmarked or typed URL goes back to the map.
  useEffect(() => {
    if (hidden) {
      log('stage not in this journey, back to the map', { stageId });
      navigate(JOURNEY_MAP_ROUTE, { replace: true });
    }
  }, [hidden, stageId, navigate]);
  const shownDoneIds = live ? live.doneIds : doneIds;
  const shownStage = stage && !hidden ? stagesFor(jhs).find((s) => s.id === stage.id) : null;
  const doneCount = shownDoneIds.length;
  const segments = shownStage
    ? buildStageSegments({ doneIds: shownDoneIds, currentId: shownStage.id, jhs })
    : undefined;
  log('render', { stageId, doneCount, live: Boolean(live), footer: footer !== false });

  return (
    <div
      className={classNames('flex min-h-dvh flex-col bg-[#f7f8f4] playful:bg-[#fffefc]', className)}
    >
      <UiStyleScope enabled />
      <EngagementTopNav
        bgClass="bg-[#f8f8f4]"
        className="md:h-[clamp(64px,5.21vw,90px)]"
        styleSwitch={<StyleSwitch />}
        showSwitchModes={showChangeInputMode}
        reserveSwitchModes={!showChangeInputMode}
        switchModesLabel="Change input mode"
        onSwitchModes={() => {
          log('change input mode', { custom: Boolean(onChangeInputMode) });
          if (onChangeInputMode) onChangeInputMode();
          else setPickerOpen(true);
        }}
        onSaveExit={() => {
          log('save & exit');
          navigate('/home');
        }}
      />
      {shownStage && showStageBar ? (
        <EngagementStageBar
          stageNumber={shownStage.n}
          stageName={shownStage.barLabel ?? shownStage.label}
          segments={segments}
          doneCount={doneCount}
        />
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      {footer === false ? null : (
        <EngagementStageFooter className="sticky bottom-0 z-20" {...footer} />
      )}
      {pickerOpen ? (
        <ModePickerModal onClose={() => setPickerOpen(false)} onPick={pickMode} />
      ) : null}
    </div>
  );
};

export { ENGAGEMENT_STAGES };
export default EngagementStageFrame;
