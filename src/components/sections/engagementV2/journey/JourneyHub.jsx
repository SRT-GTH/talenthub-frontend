import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '../../../../hooks/useMediaQuery.js';
import { debug } from '../../../../utils/debug.js';
import EngagementStageFrame from '../../engagementShell/EngagementStageFrame.jsx';
import { MILESTONES } from './journeyData.js';
import { buildJourneyModel } from './journeyModel.js';
import { useJourneyState } from './journeyState.js';
import JourneyHero from './JourneyHero.jsx';
import JourneyMapCanvas from './JourneyMapCanvas.jsx';
import JourneyMapList from './JourneyMapList.jsx';
import JourneyRail from './JourneyRail.jsx';
import MilestoneModal from './MilestoneModal.jsx';
import ModePickerModal from './ModePickerModal.jsx';

const log = debug('JourneyHub');

/*
 * JourneyHub — the whole journey screen (J-01 … J-07). The four routed pages only choose defaults:
 *   JourneyMapPage            defaults {}                      /profile/engagement
 *   MilestoneDiscoverablePage defaults {done:3, milestone:1}   /profile/engagement/milestone
 *   MilestoneTop20Page        defaults {done:6, milestone:2}   /profile/engagement/milestone/top-20
 *   MilestoneTopTalentPage    defaults {done:9, milestone:3}   /profile/engagement/milestone/top-talent
 * `children` render over the map (the Upload my CV dialogs sit on this screen). See journeyState.js for the URL contract.
 */
const JourneyHub = ({ defaults, children = null }) => {
  const navigate = useNavigate();
  const s = useJourneyState({ defaults });
  const model = useMemo(() => buildJourneyModel(s.done), [s.done]);
  const wide = useMediaQuery('(min-width: 1024px)');
  const twoCol = useMediaQuery('(min-width: 1536px)');

  useEffect(() => {
    log('state', {
      done: s.done,
      hover: s.hover,
      modal: s.modal,
      milestone: s.milestone,
      toast: s.toast,
    });
  }, [s.done, s.hover, s.modal, s.milestone, s.toast]);

  const closeMilestone = () => {
    log('close milestone', s.milestone);
    const qs = new URLSearchParams({ done: String(s.done) });
    if (s.milestone === 1) qs.set('toast', '1');
    navigate(`/profile/engagement?${qs.toString()}`);
  };
  const pickMode = (id) => {
    log('mode picked', id);
    if (id === 'chat') navigate('/profile/filling/career-buddy');
    else if (id === 'cv') navigate('/profile/filling/cv');
    // Fill it in myself: open the stage the map says is next (just close when every stage is done).
    else if (model.current?.route) navigate(model.current.route);
    else s.update({ modal: null });
  };

  return (
    <EngagementStageFrame
      stageId={null}
      footer={false}
      showStageBar={false}
      showChangeInputMode={false}
      onChangeInputMode={() => s.update({ modal: 'add-work' })}
    >
      <JourneyHero model={model} />
      <main
        className="mx-auto grid w-full max-w-[1728px] items-start gap-[24px] pl-[clamp(16px,3.7vw,64px)] pr-[clamp(16px,2.3vw,40px)] pb-[clamp(24px,4vw,70px)] pt-[clamp(16px,1.85vw,32px)]"
        style={{
          gridTemplateColumns: twoCol ? 'minmax(0,1112fr) minmax(0,488fr)' : 'minmax(0,1fr)',
        }}
      >
        <div className="min-w-0">
          {wide ? (
            <JourneyMapCanvas
              model={model}
              hoverId={s.hover}
              onHover={(id) => s.update({ hover: id })}
              toast={s.toast ? MILESTONES[0].toast : null}
              onToast={() => s.update({ toast: false })}
            />
          ) : (
            <JourneyMapList model={model} />
          )}
        </div>
        <div className="min-w-0 max-w-[488px] max-2xl:max-w-[720px]">
          <JourneyRail model={model} hoverFrame={Boolean(s.hover)} />
        </div>
      </main>
      {s.modal === 'add-work' ? (
        <ModePickerModal onClose={() => s.update({ modal: null })} onPick={pickMode} />
      ) : null}
      {children}
      {s.milestone ? (
        <MilestoneModal n={s.milestone} onClose={closeMilestone} onPrimary={(to) => navigate(to)} />
      ) : null}
    </EngagementStageFrame>
  );
};

export default JourneyHub;
