import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EngagementStageFrame from '../../components/sections/engagementShell/EngagementStageFrame.jsx';
import EngagementStageBar from '../../components/sections/engagementShell/EngagementStageBar.jsx';
import { ENGAGEMENT_STAGES } from '../../components/sections/engagementShell/engagementShellData.js';
import AvatarHero from '../../components/sections/engagementV2/avatar/AvatarHero.jsx';
import AvatarPanel from '../../components/sections/engagementV2/avatar/AvatarPanel.jsx';
import AvatarSwitchModesDialog from '../../components/sections/engagementV2/avatar/AvatarSwitchModesDialog.jsx';
import {
  ExtrasBody,
  HairBody,
  OutfitBody,
  SkinBody,
  StyleBody,
} from '../../components/sections/engagementV2/avatar/AvatarStepBodies.jsx';
import {
  AVATAR_ROUTES,
  STEP_META,
  extrasSelectedCount,
  outfitSelectedCount,
} from '../../components/sections/engagementV2/avatar/avatarData.js';
import { useAvatarState } from '../../components/sections/engagementV2/avatar/avatarState.js';
import { useAvatarSelection } from '../../hooks/useAvatarSelection.js';
import { debug } from '../../utils/debug.js';

const log = debug('AvatarPage');

/*
 * AvatarPage — Engagement revamp, Avatar selection (Figma section "Avatar selection": Focused 8285:3264 / Playful 3218:2745).
 * One page, five steps chosen by the route (`step`: undefined = Style | 'skin' | 'hair' | 'extras' | 'outfit'; mounted in App.jsx inside
 * AvatarFlowLayout at /profile/engagement/avatar[/skin|/hair|/extras|/outfit]). `?modal=switch-modes` opens the "Switch Modes" dialog
 * (also reachable from the nav's gold "Change input mode" button). Selections live in the app-root AvatarSelectionProvider so Career
 * Buddy shows the same avatar. The Figma stage bar reads "STAGE 1 OF 9 · Avatar · 1 of 9 done · 11%" with segment 2 in gold, which the
 * shared frame cannot express from `stageId`, so the shared EngagementStageBar is rendered here with explicit segments.
 * Footer: the frames draw their own action card inside the panel, so the shared sticky footer is off.
 */
const BODIES = {
  style: StyleBody,
  skin: SkinBody,
  hair: HairBody,
  extras: ExtrasBody,
  outfit: OutfitBody,
};
const ORDER = ['style', 'skin', 'hair', 'extras', 'outfit'];
const SEGMENTS = ENGAGEMENT_STAGES.map((s) =>
  s.n === 1 ? 'done' : s.n === 2 ? 'current' : 'todo'
);

const AvatarPage = ({ step: stepProp }) => {
  const step = stepProp ?? 'style';
  const navigate = useNavigate();
  const { selection } = useAvatarSelection();
  const { modal, update } = useAvatarState();
  const meta = STEP_META[step];
  const Body = BODIES[step];

  useEffect(() => {
    log('mount', { step, modal });
  }, [step, modal]);

  const go = (id) => {
    log('go', id);
    navigate(AVATAR_ROUTES[id]);
  };
  const idx = ORDER.indexOf(step);
  const onBack = () => {
    log('back from', step);
    if (idx === 0) navigate('/profile/engagement');
    else go(ORDER[idx - 1]);
  };
  const onNext = () => {
    log('next from', step);
    if (idx === ORDER.length - 1) navigate('/profile/engagement');
    else go(ORDER[idx + 1]);
  };

  const selectedCount =
    step === 'extras'
      ? extrasSelectedCount(selection)
      : step === 'outfit'
        ? outfitSelectedCount(selection)
        : null;

  return (
    <EngagementStageFrame
      stageId={null}
      footer={false}
      onChangeInputMode={() => update({ modal: 'switch-modes' })}
    >
      <EngagementStageBar stageNumber={1} stageName="Avatar" segments={SEGMENTS} doneCount={1} />
      <div className="relative isolate overflow-hidden [container-type:inline-size]">
        <div
          className="relative grid grid-cols-1 lg:grid-cols-[990fr_738fr]"
          style={{ '--u': 'calc(min(100cqw, 1728px) / 1728)' }}
        >
          <AvatarHero meta={meta} />
          <AvatarPanel
            meta={meta}
            step={step}
            selectedCount={selectedCount}
            onTab={go}
            onBack={onBack}
            onNext={onNext}
          >
            <Body />
          </AvatarPanel>
        </div>
      </div>
      {modal === 'switch-modes' ? (
        <AvatarSwitchModesDialog
          onClose={() => update({ modal: null })}
          onChoose={(id) => {
            log('mode chosen', id);
            if (id === 'chat') navigate('/profile/filling/career-buddy');
            else if (id === 'cv') navigate('/profile/filling/cv');
            else update({ modal: null });
          }}
        />
      ) : null}
    </EngagementStageFrame>
  );
};

export default AvatarPage;
